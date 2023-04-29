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

### If frontend fails to build on prod

On my minimal DigitalOcean droplet, the `npm install` phase of the frontend
Dockerfile was timing out. Even though NPM's error message was about
connectivity, the real answer seems to be that the system was out of RAM.
Based on [this StackOverflow answer](https://stackoverflow.com/questions/49228066/npm-install-via-digital-ocean-gets-killed),
I ran these commands at the Linux shell (not within Docker), and my builds
worked fine after that:

```sh
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo swapon --show
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl vm.vfs_cache_pressure=50
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
```
