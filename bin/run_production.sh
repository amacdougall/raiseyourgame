# script to run the production environment on DigitalOcean
export COMPOSE_PROFILES='graphql-server,frontend'
sudo --preserve-env docker compose up --build
