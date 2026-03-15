# Use official Node.js 18 alpine image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install --production

# Copy the entire project into the container
# This includes both backend and frontend directories
COPY . .

# Expose the API and Web server port
EXPOSE 3000

# Start the application server
CMD [ "node", "backend/server.js" ]
