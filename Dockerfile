# Production stage
FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY dist ./dist

COPY prisma/schema.prisma ./prisma/schema.prisma

EXPOSE 5000

CMD ["node", "dist/index.js"]  
