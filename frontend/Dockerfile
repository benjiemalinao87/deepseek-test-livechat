FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Expose the port
EXPOSE ${PORT:-3000}

# Start the application with explicit host binding
CMD ["sh", "-c", "serve -s build -l tcp://0.0.0.0:${PORT:-3000}"]
