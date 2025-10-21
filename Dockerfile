# Dockerfile - run expo with tunneling and generate QR
FROM node:18-alpine

# Install required packages
RUN apk add --no-cache bash git curl jq qrencode

# Install expo CLI
RUN npm install -g expo-cli

# Create app dir
WORKDIR /app

# Copy project files (assumes your expo project is in the same folder as the Dockerfile)
# If you don't want to copy everything, adjust this COPY line as needed.
COPY . /app

# Copy entrypoint script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Directory where QR files will be written (mount this from host to retrieve files)
VOLUME ["/output"]

# expo ports (dev server, metro, devtools)
EXPOSE 19000 19001 19002

# Start script
CMD ["/usr/local/bin/start.sh"]
