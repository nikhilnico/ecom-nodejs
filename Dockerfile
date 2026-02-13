# Use the official Node.js 20 Alpine image as a base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install dependencies (production dependencies only for the final image)
RUN npm install --production

# Copy the rest of the app code into the container
COPY . .

# Build the NestJS app
RUN npm run build

# Specify the default command to run the app
CMD ["node", "dist/main"]
