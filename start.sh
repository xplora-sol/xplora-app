#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR=/app
OUTPUT_DIR=/output
LOGFILE=/tmp/expo.log

mkdir -p "$OUTPUT_DIR"
cd "$PROJECT_DIR"

echo "🚀 Starting Expo with tunnel mode..."
echo "Logs will be written to $LOGFILE"
echo

# Start expo in background
npx expo start --tunnel >"$LOGFILE" 2>&1 &
EXPO_PID=$!
echo "Expo PID: $EXPO_PID"

echo "⏳ Waiting up to 120s for Expo tunnel URL..."

URL=""

for i in $(seq 1 120); do
  sleep 1

  # Extract possible URLs from logs
  URL=$(grep -Eo 'exp://[^ ]+' "$LOGFILE" | grep -v 'localhost' | head -n1 || true)
  if [ -z "$URL" ]; then
    URL=$(grep -Eo 'https://qr\.expo\.dev/[^ ]+' "$LOGFILE" | head -n1 || true)
  fi
  if [ -z "$URL" ]; then
    URL=$(grep -Eo 'https://[a-zA-Z0-9.-]+\.tunnel\.expo\.dev[^ ]*' "$LOGFILE" | head -n1 || true)
  fi

  if [ -n "$URL" ]; then
    break
  fi
done

if [ -z "$URL" ]; then
  echo "❌ ERROR: No Expo URL found after 120s."
  echo "Here are the last few URLs seen in logs (for debugging):"
  grep -Eo 'https?://[^ ]+' "$LOGFILE" | sort -u | tail -n 10 || true
  echo
  tail -n 50 "$LOGFILE"
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
echo "📡 Tailing Expo logs (Ctrl+C to stop)..."
echo

tail -n +1 -f "$LOGFILE"
