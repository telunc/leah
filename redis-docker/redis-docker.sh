docker run \
    --rm \
    --name redis-server \
    -p 6379:6379 \
    -v "$(pwd)"/data:/data \
    -d redis \
    redis-server --appendonly yes