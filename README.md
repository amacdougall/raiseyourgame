# Raise Your Game

This is a YouTube video annotation app. Plug in a URL, then when something
interesting happens, just start typing. The video will pause until you hit Enter
to submit the comment. Share the URL, and the recipient can see your comments
appear as the video plays. I originally envisioned it as a way to share advice
on gameplay footage, hence the name.

Written in TypeScript, with a MongoDB database. GraphQL for client/server
communication. I've wanted to make this application for a while; you can see an
unfinished Clojure version on my Github as well.


## Running the prod setup in local docker

To run the entire project on localhost:

```
COMPOSE_PROFILES='production' sudo docker compose up --build
```

This is a test of the whole system; not set up for local development with
reloading, etc. To do actual dev work, see the next two sections.

Note that SSL won't work unless you have self-signed keys in `/certbot/conf`.
See `.env` for exact paths.

## Running in development

```
sudo docker compose up --build
```

This will start only the MongoDB database; run the server and frontend
separately:

```
# in frontend
npm run dev

# in graphql-server
npm run debug
```

## Running in production

See `.env.production` (and `frontend/.env.production`) for differences. These
env files do not contain secrets.

```
./bin/run_production.sh
```

### Cleanup script

This application is anonymous but ephemeral. We want to delete all videos older
than 30 days. Add this script to the root crontab (I chose to run daily at 4am):

```
<cron timing expression> /home/<user>/raiseyourgame/bin/delete_old_videos.sh
```

### SSL certificates

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
