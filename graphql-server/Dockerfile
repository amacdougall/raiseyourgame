FROM node:18.15-alpine

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN cp .env.production .env

# TODO: ...?
# create user with limited privileges, jailed to /app
# ENV GROUP_ID=1000 \
#     USER_ID=1000
# 
# RUN addgroup -g $GROUP_ID appgroup
# RUN adduser -D -u $USER_ID appuser appgroup -s /bin/sh
# 
# USER app

CMD ["npm", "start"]
