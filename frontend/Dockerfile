# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
# Accept build-time variable
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
