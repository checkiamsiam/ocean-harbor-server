FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build


# Production stage
FROM base AS runner

WORKDIR /app

COPY --from=builder app/dist ./dist

COPY --from=builder app/prisma/schema.prisma ./prisma/schema.prisma

COPY .env ./

COPY package.json ./

ENV NODE_ENV=production

RUN npm install --omit=dev --ignore-scripts 

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "dist/index.js"]  