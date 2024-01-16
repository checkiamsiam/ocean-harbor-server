# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package.json ./

ENV NODE_ENV=production

RUN npm install --production

COPY dist ./dist

COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "dist/index.js"]  