# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json or yarn.lock to the container
COPY package.json package-lock.json* yarn.lock* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Change working directory to src
WORKDIR /app/src

# Make port 4000 available to the world outside this container
EXPOSE 4000

# Run index.js when the container launches
CMD ["node", "index.js"]

