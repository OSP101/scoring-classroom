# Stage 1: Dependencies and Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the application (this will include Tailwind CSS processing)
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy necessary config files
COPY --from=builder /app/next.config.mjs /app/tsconfig.json /app/postcss.config.mjs /app/tailwind.config.ts ./

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# ในส่วนสุดท้ายของ Dockerfile
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]