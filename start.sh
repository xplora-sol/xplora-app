#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR=/app
OUTPUT_DIR=/output
LOGFILE=/tmp/expo.log

mkdir -p "$OUTPUT_DIR"
cd "$PROJECT_DIR"

# Start expo with tunnel in background and capture all output to logfile
# `--tunnel` forces tunnel, remove or change flags as desired
echo "Starting expo (this will run in background)..."
# Use npx to ensure local/installed expo works either way
npx expo start --tunnel >"$LOGFILE" 2>&1 &

EXPO_PID=$!
echo "expo pid: $EXPO_PID"
echo "Waiting for expo to print a URL in the logs (timeout 120s)..."

# Try to find a useful URL in expo logs
URL=""
for i in $(seq 1 120); do
  sleep 1
  # look for exp:// or https://qr.expo.dev or https://expo.dev/... lines
  URL=$(grep -Eo 'exp://[^ ]+' "$LOGFILE" | head -n1 || true)
  if [ -z "$URL" ]; then
    URL=$(grep -Eo 'https?://qr\.expo\.dev/[^ ]+' "$LOGFILE" | head -n1 || true)
  fi
  if [ -z "$URL" ]; then
    URL=$(grep -Eo 'https?://[^\ ]*expo\.dev[^\ ]*' "$LOGFILE" | head -n1 || true)
  fi
  if [ -n "$URL" ]; then
    break
  fi
done

if [ -z "$URL" ]; then
  echo "ERROR: Could not find expo URL in logs after timeout. Showing last 200 lines:"
  tail -n 200 "$LOGFILE"
  echo "Exit with non-zero status."
  exit 1
fi

echo "Found URL: $URL"

# Save URL and generate QR codes
echo "$URL" > "$OUTPUT_DIR/url.txt"

# Generate PNG QR
qrencode -o "$OUTPUT_DIR/qrcode.png" "$URL"

# Generate ASCII QR for terminal and file
qrencode -t ansiutf8 "$URL" > "$OUTPUT_DIR/qrcode.txt"

# print ASCII to console
echo "---- ASCII QR (scan from device) ----"
cat "$OUTPUT_DIR/qrcode.txt"
echo "-------------------------------------"

# also copy into project directory for convenience
cp "$OUTPUT_DIR/qrcode.png" "$PROJECT_DIR/" || true
cp "$OUTPUT_DIR/qrcode.txt" "$PROJECT_DIR/" || true
cp "$OUTPUT_DIR/url.txt" "$PROJECT_DIR/" || true

echo "QR PNG saved to: $OUTPUT_DIR/qrcode.png"
echo "QR ASCII saved to: $OUTPUT_DIR/qrcode.txt"
echo "URL saved to: $OUTPUT_DIR/url.txt"
echo ""
echo "Tailing expo logs (press Ctrl+C to exit container) — QR files are available in the /output volume or copied into /app/"

# keep container alive and show logs
tail -n +1 -f "$LOGFILE"
