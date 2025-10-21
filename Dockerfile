# Use Debian-based image instead of Alpine
FROM node:20-bookworm

# Install dependencies (qrencode works here)
RUN apt-get update && apt-get install -y \
    bash git curl jq qrencode \
 && rm -rf /var/lib/apt/lists/*

# Optional: for QR in terminal
RUN npm install -g qrcode-terminal expo-cli @expo/ngrok@^4.1.0

WORKDIR /app

COPY . /app

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

VOLUME ["/output"]

EXPOSE 19000 19001 19002

CMD ["/usr/local/bin/start.sh"]
