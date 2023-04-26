FROM node:18.15-alpine AS build

WORKDIR /app

# build frontend asset bundle
COPY package*.json /app

# ensure Python 3 is available
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

RUN npm install
COPY . .
RUN cp .env.production .env
RUN npm run build

# build backend
FROM nginx:alpine

COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
