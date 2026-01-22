# Server Dockerfile
# Minimal production-ready Node.js container

FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application source code
COPY src ./src

# Expose application port
EXPOSE 8000

# Start the server
CMD ["node", "src/app.js"]
