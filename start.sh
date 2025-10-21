#!/usr/bin/env bash
set -euo pipefail

# Detect if running in Docker or locally
if [ -d "/app" ] && [ "$(pwd)" = "/app" ]; then
  PROJECT_DIR=/app
  OUTPUT_DIR=/output
else
  PROJECT_DIR=.
  OUTPUT_DIR=.
fi

LOGFILE=/tmp/expo.log

mkdir -p "$OUTPUT_DIR"
cd "$PROJECT_DIR"

echo "🚀 Starting Expo with tunnel mode..."
echo "Logs will be written to $LOGFILE"
echo "Project: $PROJECT_DIR"
echo "Output: $OUTPUT_DIR"
echo

# Install dependencies first
npm i

# Clear old log
> "$LOGFILE"

# Start expo in background, capturing all output to log file
# Force line buffering with stdbuf if available, or use script
if command -v unbuffer >/dev/null 2>&1; then
  # Use expect's unbuffer to disable output buffering
  unbuffer npx expo start --tunnel 2>&1 | tee -a "$LOGFILE" &
  EXPO_PID=$!
elif command -v stdbuf >/dev/null 2>&1; then
  # Use stdbuf for line buffering (Linux)
  stdbuf -oL -eL npx expo start --tunnel 2>&1 | tee -a "$LOGFILE" &
  EXPO_PID=$!
else
  # Fallback: use script to capture pty output (works on macOS)
  # This captures the actual terminal output including the QR code
  (script -q /dev/null npx expo start --tunnel 2>&1 || npx expo start --tunnel 2>&1) | tee -a "$LOGFILE" &
  EXPO_PID=$!
fi

echo "Expo PID: $EXPO_PID"

echo "⏳ Waiting up to 120s for Expo tunnel URL..."

URL=""

for i in $(seq 1 120); do
  sleep 1

  # Strip ANSI color codes from log file for parsing
  CLEAN_LOG=$(sed 's/\x1b\[[0-9;]*m//g' "$LOGFILE")

  # Extract possible URLs from logs
  # Match exp:// URLs with the format: exp://xxx-anonymous-8081.exp.direct
  URL=$(echo "$CLEAN_LOG" | grep -Eo 'exp://[a-zA-Z0-9_-]+-anonymous-[0-9]+\.exp\.direct' | head -n1 || true)
  if [ -z "$URL" ]; then
    # Try broader .exp.direct pattern
    URL=$(echo "$CLEAN_LOG" | grep -Eo 'exp://[a-zA-Z0-9._-]+\.exp\.direct' | head -n1 || true)
  fi
  if [ -z "$URL" ]; then
    # Fallback: any exp:// URL (excluding localhost)
    URL=$(echo "$CLEAN_LOG" | grep -Eo 'exp://[^ ]+' | grep -v 'localhost' | head -n1 || true)
  fi
  if [ -z "$URL" ]; then
    # Try QR code URLs
    URL=$(echo "$CLEAN_LOG" | grep -Eo 'https://qr\.expo\.dev/[^ ]+' | head -n1 || true)
  fi
  if [ -z "$URL" ]; then
    # Try tunnel URLs
    URL=$(echo "$CLEAN_LOG" | grep -Eo 'https://[a-zA-Z0-9.-]+\.tunnel\.expo\.dev[^ ]*' | head -n1 || true)
  fi

  if [ -n "$URL" ]; then
    echo "🔍 Found URL at iteration $i: $URL"
    break
  fi
done

if [ -z "$URL" ]; then
  echo "❌ ERROR: No Expo URL found after 120s."
  echo
  echo "Here are ALL URLs seen in logs (for debugging):"
  sed 's/\x1b\[[0-9;]*m//g' "$LOGFILE" | grep -Eo '(exp|https?)://[^ ]+' | sort -u || true
  echo
  echo "📋 Last 50 lines of log:"
  tail -n 50 "$LOGFILE"
  echo
  echo "💡 Check if ngrok/tunnel authentication is required"
  exit 1
fi

echo "✅ Found Expo URL: $URL"
echo "$URL" > "$OUTPUT_DIR/url.txt"

# Try Node-based QR generator first (cross-platform fallback)
if command -v npx >/dev/null 2>&1; then
  echo "🧩 Generating QR using qrcode-terminal..."
  npx qrcode-terminal "$URL" | tee "$OUTPUT_DIR/qrcode.txt"
else
  # fallback to qrencode if available
  if command -v qrencode >/dev/null 2>&1; then
    echo "🧩 Generating QR using qrencode..."
    qrencode -o "$OUTPUT_DIR/qrcode.png" "$URL"
    qrencode -t ansiutf8 "$URL" | tee "$OUTPUT_DIR/qrcode.txt"
  else
    echo "⚠️ No QR generator available (install qrcode-terminal or qrencode)."
  fi
fi

# Copy artifacts into project folder too
cp -f "$OUTPUT_DIR"/* "$PROJECT_DIR/" 2>/dev/null || true

echo
echo "📦 QR + URL exported to:"
echo "   - $OUTPUT_DIR/qrcode.txt"
echo "   - $OUTPUT_DIR/qrcode.png (if available)"
echo "   - $OUTPUT_DIR/url.txt"
echo
echo "📋 URL: $URL"
echo
echo "📡 Expo is running. Press Ctrl+C to stop."
echo

# Cleanup function
cleanup() {
  echo
  echo "🛑 Shutting down..."
  kill $EXPO_PID 2>/dev/null || true
  rm -f "/tmp/expo_pipe_$$" 2>/dev/null || true
  exit 0
}

trap cleanup INT TERM

# Keep script running and show logs
tail -n +1 -f "$LOGFILE"
