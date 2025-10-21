FROM oven/bun:1-debian

# Install system dependencies including qrencode and nginx
RUN apt-get update && apt-get install -y \
    bash git curl jq qrencode expect nginx \
 && rm -rf /var/lib/apt/lists/*

# Install global npm packages using bun
RUN bun add -g qrcode-terminal expo-cli --non-interactive

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the app
COPY . .

# Create public directory for QR code / web interface
RUN mkdir -p /app/public

# Configure nginx to serve static files
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /app/public; \
    location / { autoindex on; try_files $uri $uri/ =404; } \
    location /health { return 200 "OK"; add_header Content-Type text/plain; } \
}' > /etc/nginx/sites-available/default

# Copy start script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose ports:
# - 8081: Metro server (Expo start)
# - 19000/19001/19002: Expo DevTools & other services
# - 80: nginx for QR web interface
EXPOSE 80 8081 19000 19001 19002

VOLUME ["/output"]

# Run start script
CMD ["/usr/local/bin/start.sh"]
