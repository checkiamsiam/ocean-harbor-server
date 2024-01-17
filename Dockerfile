# Production stage
FROM node:18-alpine

WORKDIR /app

COPY dist ./dist

COPY prisma/schema.prisma ./prisma/schema.prisma

COPY .env ./

COPY package.json ./

ENV NODE_ENV=production

RUN npm install --omit=dev --ignore-scripts 

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "dist/index.js"]  