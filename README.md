# Raise Your Game

TODO: document what this project is.

## Running in development

To run the entire project on localhost:

```
sudo docker compose up --build
```

Note that SSL won't work unless you have self-signed keys in `/certbot/conf`.
See `.env` for exact paths.

## Running in production

See `.env.production` (and `frontend/.env.production`) for differences. These
env files do not contain secrets.

```
./bin/run_production.sh
```

Note that SSL won't work unless Certbot-generated keys are present in
`/certbot/conf`. To produce these keys,

```
sudo docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d raiseyourga.me
```

Use the root crontab to set up SSL key renewal:
```
<cron timing expression> /home/<user>/raiseyourgame/bin/renew_certificates.sh
```
