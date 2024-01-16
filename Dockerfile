# Production stage
FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --only=production

COPY dist ./dist

COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "dist/index.js"]  
