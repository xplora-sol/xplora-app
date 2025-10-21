# Use Debian-based image instead of Alpine
FROM node:18-bullseye

# Install dependencies (qrencode works here)
RUN apt-get update && apt-get install -y \
    bash git curl jq qrencode \
 && rm -rf /var/lib/apt/lists/*

# Optional: for QR in terminal
RUN npm install -g qrcode-terminal expo-cli

# Install expo CLI
RUN npm install -g expo-cli

WORKDIR /app

COPY . /app

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

VOLUME ["/output"]

EXPOSE 19000 19001 19002

CMD ["/usr/local/bin/start.sh"]
