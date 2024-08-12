# Use an official node image as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock into the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the app
RUN yarn build

# Use an official nginx image to serve the app
FROM nginx:stable-alpine

# Copy the built app from the previous image
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
