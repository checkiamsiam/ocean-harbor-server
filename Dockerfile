# Build stage
FROM node:alpine AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN tsc 

# Production stage
FROM node:alpine

WORKDIR /app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /usr/src/app/package.json ./

RUN npm install --only=production

EXPOSE 5000

CMD ["node", "dist/index.js"]  
