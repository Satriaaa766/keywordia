FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
# Install dependencies, including dev dependencies for the build
RUN apk add --no-cache openssl
RUN npm ci
COPY . .
# Generate SvelteKit config files (tsconfig.json, etc.)
RUN npx svelte-kit sync
# Build the application
RUN npx prisma generate

CMD ["npm", "run", "dev"]