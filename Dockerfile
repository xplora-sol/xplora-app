FROM oven/bun:1-debian

# Install system dependencies including expect for unbuffer and nginx
RUN apt-get update && apt-get install -y \
    bash git curl jq qrencode expect nginx \
    && rm -rf /var/lib/apt/lists/*

# Install global packages using bun
RUN bun add -g qrcode-terminal expo-cli @expo/ngrok@^4.1.0

WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lock ./

# Install dependencies (cached layer)
RUN bun install

# Copy the rest of the application
COPY . .

# Create public directory for serving files
RUN mkdir -p /app/public

# Configure nginx to serve static files
RUN echo 'server { \n\
    listen 80; \n\
    server_name _; \n\
    root /app/public; \n\
    \n\
    location / { \n\
    autoindex on; \n\
    try_files $uri $uri/ =404; \n\
    } \n\
    \n\
    location /health { \n\
    return 200 "OK"; \n\
    add_header Content-Type text/plain; \n\
    } \n\
    }' > /etc/nginx/sites-available/default

# Copy and prepare start script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

VOLUME ["/output"]

# Expose nginx (80), Expo ports
EXPOSE 80 19000 19001 19002 8081