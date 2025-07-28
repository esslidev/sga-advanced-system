# Use a small Node image for dev
FROM node:24-alpine

# Create app directory
WORKDIR /app

# Install dependencies first for caching
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the app
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Start Vite dev server
CMD ["yarn", "dev", "--host"]
