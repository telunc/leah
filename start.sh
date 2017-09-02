sh mysql-docker/mysql-docker.sh
sh redis-docker/redis-docker.sh

docker build -t leah-server .
docker run --rm \
    --name leah-server \
    --link mysql-server \
    --link redis-server \
    -p 8080:8080 \
    leah-server