# Production stage
FROM node:18-alpine

WORKDIR /app

COPY dist ./dist

COPY prisma/schema.prisma ./prisma/schema.prisma

COPY .env ./

COPY package.json ./

RUN npm install --only=production

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "dist/index.js"]  