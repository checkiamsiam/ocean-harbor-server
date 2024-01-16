# Production stage
FROM node

WORKDIR /app


COPY dist ./dist
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY package.json ./

RUN npm install --only=production

EXPOSE 5000

CMD ["node", "dist/index.js"]  
