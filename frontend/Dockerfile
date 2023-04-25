FROM node:18.15-alpine

WORKDIR /app

COPY package*.json ./
COPY . .
RUN npm install
RUN cp .env.production .env

CMD ["npm", "start"]
