sudo docker compose run --rm certbot renew
sudo docker compose exec frontend nginx -s reload
