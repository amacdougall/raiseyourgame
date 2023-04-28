#!/bin/sh

export SERVER_NAME
export SSL_CERTIFICATE
export SSL_CERTIFICATE_KEY

envsubst '${SERVER_NAME} ${SSL_CERTIFICATE} ${SSL_CERTIFICATE_KEY}' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec "$@"
