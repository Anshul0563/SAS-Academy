FROM node:22-alpine AS deps
WORKDIR /app

# Always install backend deps from Server/ folder
COPY Server/package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY Server/package*.json ./

# Copy the entire Server folder
COPY Server ./Server

RUN mkdir -p ./Server/uploads

EXPOSE 5000

# Always boot the correct entrypoint
CMD ["node", "Server/server.js"]

