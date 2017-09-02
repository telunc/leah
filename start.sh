sh mysql-docker/mysql-docker.sh
sh redis-docker/redis-docker.sh

docker build -t leah-server .
docker run --rm \
    --name leah-server \
    --link mysql-server \
    --link redis-server \
    -e "NODE_ENV=production" \
    leah-server