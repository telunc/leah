mkdir -p data
docker run \
	--rm \
	--name mysql-server \
	-p 3306:3306 \
	-v "$(pwd)"/data:/var/lib/mysql \
	-e MYSQL_ROOT_PASSWORD=password \
	-e MYSQL_DATABASE=leah \
	-d mysql:5.7 