echo "building the image ..."
docker compose -f ../docker-compose.yml build --pull 

echo "shuting down the docker compose ..."
docker compose -f ../docker-compose.yml down

echo "starting the docker compose ..."
docker compose -f ../docker-compose.yml up --pull always -d

docker system prune -a --volumes -f

echo "done"