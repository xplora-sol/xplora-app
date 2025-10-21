#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR=/app
OUTPUT_DIR=/app/public
LOGFILE=/tmp/expo.log

mkdir -p "$OUTPUT_DIR"
cd "$PROJECT_DIR"

# Start nginx
service nginx start

# Start Expo without tunnel (LAN mode)
# Bind to all interfaces (0.0.0.0) so Docker host / LAN devices can reach it
EXPO_CMD="bunx expo start --host 0.0.0.0 --dev-client --port 8081"
echo "🌐 Starting Expo server on LAN (0.0.0.0:8081)..."
echo "Logs will be in $LOGFILE"

# Start Expo in background
$EXPO_CMD 2>&1 | tee "$LOGFILE" &
EXPO_PID=$!

# Wait for the Metro URL to appear in logs
URL=""
MAX_WAIT=120
for i in $(seq 1 $MAX_WAIT); do
    sleep 1
    URL=$(grep -Eo 'exp://[a-zA-Z0-9._:-]+' "$LOGFILE" | head -n1 || true)
    if [ -n "$URL" ]; then break; fi
done

if [ -z "$URL" ]; then
    echo "❌ Expo URL not found after $MAX_WAIT seconds. Check logs:"
    tail -n 50 "$LOGFILE"
    exit 1
fi

echo "✅ Expo URL: $URL"
echo "$URL" > "$OUTPUT_DIR/url.txt"

# Generate QR codes
if command -v qrcode-terminal >/dev/null; then
    npx qrcode-terminal "$URL" | tee "$OUTPUT_DIR/qrcode.txt"
fi

if command -v qrencode >/dev/null; then
    qrencode -s 10 -m 2 -o "$OUTPUT_DIR/qrcode.png" "$URL" || true
fi

# Basic index.html pointing to QR code
cat > "$OUTPUT_DIR/index.html" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Expo QR</title>
</head>
<body>
<h1>Scan QR to open Expo app</h1>
<p>URL: $URL</p>
<img src="/qrcode.png" alt="Expo QR Code" />
</body>
</html>
EOF

echo "📡 Expo server is running. Press Ctrl+C to stop."
echo "🚀 QR code & URL exported to $OUTPUT_DIR"

# Keep the script running and logs streaming
trap "echo 'Stopping Expo & nginx'; kill -TERM -$EXPO_PID 2>/dev/null; exit 0" INT TERM
tail -f "$LOGFILE" --pid=$EXPO_PID
