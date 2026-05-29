# Build stage
FROM node:20-bookworm AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the SvelteKit app (adapter-node -> ./build)
RUN npm run build

# Runtime stage
FROM node:20-bookworm

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy the built app from the builder
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# adapter-node reads PORT/HOST at runtime
ENV PORT=3000
ENV HOST=0.0.0.0

# Start app
CMD ["node", "build"]
