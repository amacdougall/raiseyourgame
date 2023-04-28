# NOTE: run this from the root crontab, since DigitalOcean docker needs sudo
# anyway.
#
# TODO: make this at least a little bit more portable by providing config file
# as an argument; but for now, this is only expected to run in one context on
# one server.
export CONFIG_FILE=/home/rygadmin/raiseyourgame/docker-compose.yml

sudo docker compose -f $CONFIG_FILE run --rm certbot renew
sudo docker compose -f $CONFIG_FILE exec frontend nginx -s reload
