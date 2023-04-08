FROM node:18.15-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# TODO: different commands in prod
CMD ["npm", "run", "dev"]
