# Use an official Node runtime as a base image for building the app
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build production bundle
RUN npm run build

# Expose port 80
EXPOSE 80

# Command to run the React app
CMD ["npm", "start"]
