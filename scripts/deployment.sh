echo "building the image ..."
docker compose -f ../docker-compose.yml build --no-cache

echo "shuting down the docker compose ..."
docker compose -f ../docker-compose.yml -f ../docker-compose.dev.yml down

echo "starting the docker compose ..."
docker compose -f ../docker-compose.yml up -d

echo "done"