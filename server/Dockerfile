FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY src/ ./src/

USER node

EXPOSE 5000

CMD ["node", "src/server.js"]
