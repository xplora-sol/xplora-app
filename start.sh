#!/usr/bin/env bash
set -euo pipefail

# Detect if running in Docker or locally
if [ -d "/app" ] && [ "$(pwd)" = "/app" ]; then
  PROJECT_DIR=/app
  OUTPUT_DIR=/app/public
  WEB_ENABLED=true
else
  PROJECT_DIR=.
  OUTPUT_DIR=.
  WEB_ENABLED=false
fi

LOGFILE=/tmp/expo.log

mkdir -p "$OUTPUT_DIR"
cd "$PROJECT_DIR"

echo "🚀 Starting Expo with tunnel mode..."
echo "Logs will be written to $LOGFILE"
echo "Project: $PROJECT_DIR"
echo "Output: $OUTPUT_DIR"
[ "$WEB_ENABLED" = "true" ] && echo "Web server: http://localhost (nginx)"
echo

# Start nginx if in Docker
if [ "$WEB_ENABLED" = "true" ]; then
  echo "🌐 Starting nginx web server..."
  service nginx start
  
  # Create a basic index.html
  cat > "$OUTPUT_DIR/index.html" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expo QR Code</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #0a0a0a;
            color: #fff;
        }
        .container {
            background: #1a1a1a;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        h1 {
            color: #fff;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #888;
            margin-bottom: 30px;
        }
        .qr-container {
            text-align: center;
            margin: 30px 0;
        }
        .qr-container img {
            max-width: 300px;
            background: white;
            padding: 20px;
            border-radius: 8px;
        }
        .url-box {
            background: #2a2a2a;
            padding: 15px;
            border-radius: 8px;
            word-break: break-all;
            font-family: monospace;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background: #007AFF;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin: 10px 5px;
        }
        .button:hover {
            background: #0051D5;
        }
        .status {
            color: #4CAF50;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .loading {
            text-align: center;
            padding: 40px;
        }
        .spinner {
            border: 3px solid #333;
            border-top: 3px solid #007AFF;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
    <script>
        function checkForQR() {
            fetch('/qrcode.png')
                .then(response => {
                    if (response.ok) {
                        location.reload();
                    } else {
                        setTimeout(checkForQR, 2000);
                    }
                })
                .catch(() => setTimeout(checkForQR, 2000));
        }
        
        window.addEventListener('DOMContentLoaded', function() {
            if (!document.querySelector('.qr-container img')) {
                checkForQR();
            }
        });
    </script>
</head>
<body>
    <div class="container">
        <h1>📱 Expo Development Server</h1>
        <p class="subtitle">Scan the QR code with Expo Go to view your app</p>
        
        <div id="content">
            <div class="loading">
                <div class="spinner"></div>
                <p>⏳ Waiting for Expo tunnel to start...</p>
                <p style="color: #666; font-size: 14px;">This usually takes 30-60 seconds</p>
            </div>
        </div>
    </div>
</body>
</html>
EOF
  echo "✅ Created index.html"
fi

# Only install dependencies if not in Docker (Docker does this in build)
if [ "$PROJECT_DIR" != "/app" ]; then
  echo "📦 Installing dependencies..."
  if command -v bun >/dev/null 2>&1; then
    bun install
  else
    npm i
  fi
fi

# Clear old log
> "$LOGFILE"

echo "🌐 Starting Expo server with tunnel..."

# Determine package manager
PKG_MANAGER="npx"
if command -v bunx >/dev/null 2>&1; then
  PKG_MANAGER="bunx"
fi

# Start expo in background with unbuffer for proper output capture
unbuffer $PKG_MANAGER expo start --tunnel 2>&1 | tee -a "$LOGFILE" &
EXPO_PID=$!

echo "Expo PID: $EXPO_PID"

echo "⏳ Waiting up to 180s for Expo tunnel URL..."

URL=""
MAX_WAIT=180

for i in $(seq 1 $MAX_WAIT); do
  sleep 1

  # Strip ANSI color codes from log file for parsing
  CLEAN_LOG=$(sed 's/\x1b\[[0-9;]*m//g' "$LOGFILE")

  # Try multiple URL patterns in order of preference
  # 1. Primary exp:// tunnel URLs
  URL=$(echo "$CLEAN_LOG" | grep -Eo 'exp://[a-zA-Z0-9_-]+-[a-zA-Z0-9_-]+-[0-9]+\.exp\.direct' | head -n1 || true)
  
  if [ -z "$URL" ]; then
    # 2. Any .exp.direct URL
    URL=$(echo "$CLEAN_LOG" | grep -Eo 'exp://[a-zA-Z0-9._-]+\.exp\.direct(:[0-9]+)?' | head -n1 || true)
  fi
  
  if [ -z "$URL" ]; then
    # 3. Tunnel dev URLs
    URL=$(echo "$CLEAN_LOG" | grep -Eo 'exp://[a-zA-Z0-9.-]+\.tunnel\.expo\.dev(:[0-9]+)?' | head -n1 || true)
  fi
  
  if [ -z "$URL" ]; then
    # 4. QR code URLs (can be converted to exp://)
    QR_URL=$(echo "$CLEAN_LOG" | grep -Eo 'https://qr\.expo\.dev/[^ ]+' | head -n1 || true)
    if [ -n "$QR_URL" ]; then
      # Extract the exp:// URL from QR code URL
      URL=$(echo "$QR_URL" | sed -E 's|.*url=([^&]+).*|\1|' | sed 's/%3A/:/g' | sed 's/%2F/\//g' || true)
    fi
  fi

  if [ -n "$URL" ]; then
    echo "🔍 Found URL at iteration $i: $URL"
    break
  fi
  
  # Progress indicator
  if [ $((i % 10)) -eq 0 ]; then
    echo "   ... still waiting ($i/${MAX_WAIT}s)"
  fi
done

if [ -z "$URL" ]; then
  echo "❌ ERROR: No Expo URL found after ${MAX_WAIT}s."
  echo
  echo "🔍 Debug: All URLs found in logs:"
  sed 's/\x1b\[[0-9;]*m//g' "$LOGFILE" | grep -Eo '(exp|https?)://[^ ]+' | sort -u || echo "   (none found)"
  echo
  echo "📋 Last 100 lines of log:"
  tail -n 100 "$LOGFILE"
  echo
  echo "💡 Troubleshooting tips:"
  echo "   - Check if @expo/ngrok authentication is required"
  echo "   - Verify network connectivity"
  echo "   - Check Expo CLI version: npx expo --version"
  exit 1
fi

echo "✅ Found Expo URL: $URL"
echo "$URL" > "$OUTPUT_DIR/url.txt"

# Generate QR code using qrcode-terminal (cross-platform)
echo "📱 Generating QR code..."
if command -v bunx >/dev/null 2>&1; then
  bunx qrcode-terminal "$URL" 2>/dev/null | tee "$OUTPUT_DIR/qrcode.txt" || echo "⚠️ QR terminal generation failed"
elif command -v npx >/dev/null 2>&1; then
  npx qrcode-terminal "$URL" 2>/dev/null | tee "$OUTPUT_DIR/qrcode.txt" || echo "⚠️ QR terminal generation failed"
fi

# Also generate PNG if qrencode is available
if command -v qrencode >/dev/null 2>&1; then
  qrencode -s 10 -m 2 -o "$OUTPUT_DIR/qrcode.png" "$URL" 2>/dev/null && echo "   ✓ PNG QR code saved" || true
fi

# Update index.html with actual content
if [ "$WEB_ENABLED" = "true" ] && [ -f "$OUTPUT_DIR/qrcode.png" ]; then
  cat > "$OUTPUT_DIR/index.html" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expo QR Code - Ready</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #0a0a0a;
            color: #fff;
        }
        .container {
            background: #1a1a1a;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        h1 {
            color: #fff;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #888;
            margin-bottom: 30px;
        }
        .status {
            background: #1a4d1a;
            color: #4CAF50;
            padding: 10px 20px;
            border-radius: 6px;
            display: inline-block;
            margin-bottom: 20px;
        }
        .qr-container {
            text-align: center;
            margin: 30px 0;
        }
        .qr-container img {
            max-width: 300px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .url-box {
            background: #2a2a2a;
            padding: 15px;
            border-radius: 8px;
            word-break: break-all;
            font-family: monospace;
            margin: 20px 0;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: #007AFF;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin: 10px 5px;
            transition: background 0.2s;
        }
        .button:hover {
            background: #0051D5;
        }
        .instructions {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .instructions h3 {
            margin-top: 0;
            color: #fff;
        }
        .instructions ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin: 8px 0;
            color: #ccc;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 Expo Development Server</h1>
        <p class="subtitle">Scan the QR code with Expo Go to view your app</p>
        
        <div class="status">✅ Tunnel Active</div>
        
        <div class="qr-container">
            <img src="/qrcode.png" alt="Expo QR Code" />
        </div>
        
        <div class="url-box">
            <strong>Expo URL:</strong><br>
            $URL
        </div>
        
        <div style="text-align: center;">
            <a href="/qrcode.png" class="button" download>⬇️ Download QR Code</a>
            <a href="/url.txt" class="button" download>📄 Download URL</a>
        </div>
        
        <div class="instructions">
            <h3>🚀 How to use:</h3>
            <ol>
                <li>Install <strong>Expo Go</strong> app on your mobile device:<br>
                    <a href="https://apps.apple.com/app/expo-go/id982107779" style="color: #007AFF;">iOS App Store</a> | 
                    <a href="https://play.google.com/store/apps/details?id=host.exp.exponent" style="color: #007AFF;">Android Play Store</a>
                </li>
                <li>Open Expo Go and tap <strong>Scan QR code</strong></li>
                <li>Point your camera at the QR code above</li>
                <li>Your app will load automatically! 🎉</li>
            </ol>
        </div>
        
        <div class="footer">
            <p>Powered by Expo · Auto-refreshes when you save changes</p>
        </div>
    </div>
</body>
</html>
EOF
  echo "✅ Updated index.html with QR code"
fi

# Copy artifacts to project folder (if different from output)
if [ "$OUTPUT_DIR" != "$PROJECT_DIR" ]; then
  cp -f "$OUTPUT_DIR"/url.txt "$PROJECT_DIR/" 2>/dev/null || true
  cp -f "$OUTPUT_DIR"/qrcode.* "$PROJECT_DIR/" 2>/dev/null || true
fi

echo
echo "📦 Artifacts exported:"
echo "   - $OUTPUT_DIR/url.txt"
echo "   - $OUTPUT_DIR/qrcode.txt"
[ -f "$OUTPUT_DIR/qrcode.png" ] && echo "   - $OUTPUT_DIR/qrcode.png"
[ "$WEB_ENABLED" = "true" ] && echo "   - $OUTPUT_DIR/index.html (web interface)"
echo
if [ "$WEB_ENABLED" = "true" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🌐 WEB INTERFACE AVAILABLE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
    echo "🔗 Your QR code is available at:"
    if [ -n "${COOLIFY_FQDN:-}" ]; then
      echo "   https://${COOLIFY_FQDN}/"
      echo "   https://${COOLIFY_FQDN}/qrcode.png"
    else
      echo "   http://localhost/"
      echo "   http://localhost/qrcode.png"
    fi
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  fi
  echo
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📱 Scan this QR code with Expo Go app:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cat "$OUTPUT_DIR/qrcode.txt" 2>/dev/null || true
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo
  echo "🔗 Direct URL: $URL"
  echo
  echo "📡 Expo server is running. Press Ctrl+C to stop."
  echo "📋 Streaming logs below..."
  echo
  
  # Health check for Coolify
  if [ "$WEB_ENABLED" = "true" ]; then
    (
      while true; do
        sleep 15
        if ! ps -p $EXPO_PID > /dev/null; then
          echo "🚨 Expo process died. Exiting."
          exit 1
        fi
      done
    ) &
  fi
  
  # Cleanup function
  cleanup() {
    echo
    echo "🛑 Shutting down services..."
    if [ "$WEB_ENABLED" = "true" ]; then
      service nginx stop 2>/dev/null || true
    fi
    # Kill the main Expo process and its children
    if ps -p $EXPO_PID > /dev/null; then
      kill -TERM -$EXPO_PID 2>/dev/null || true
      sleep 2
      kill -KILL -$EXPO_PID 2>/dev/null || true
    fi
    echo "✅ Cleanup complete"
    exit 0
  }
  
  trap cleanup INT TERM EXIT
  
  # Keep script running and show logs
  tail -f "$LOGFILE" --pid=$EXPO_PID
  