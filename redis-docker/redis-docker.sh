docker run \
    --rm \
    --name redis-server \
    -v "$(pwd)"/data:/data \
    -d redis \
    redis-server --appendonly yes