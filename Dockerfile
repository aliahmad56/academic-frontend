# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install --legacy-peer-deps

RUN npm install @stripe/stripe-js

# Copy the rest of the application code to the container
COPY .env .

COPY . .

# Build the application
RUN npm run build

# Expose the desired port
EXPOSE 4173

# Prevent the browser from opening automatically
ENV BROWSER none

# Start the application
CMD ["npm", "run", "preview", "--", "--port", "4173","--host", "0.0.0.0"]