FROM node:18.18.2 AS builder

WORKDIR /products

COPY package.json ./

# Install pnpm
RUN npm install -g pnpm typescript

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Build
RUN pnpm run build

# Production image
FROM node:18.18.2-slim

ENV PORT 8002
ENV NODE_ENV production

WORKDIR /products

COPY --from=builder /products/dist ./dist
COPY --from=builder /products/package.json ./package.json

RUN npm install --only=production

EXPOSE 8002

CMD ["node", "dist/src/server.js"]