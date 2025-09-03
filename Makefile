up:
	docker compose --env-file ./env/dev.env -f docker-compose.dev.yml up -d

upv:
	docker compose  --verbose --env-file ./env/dev.env -f docker-compose.dev.yml up

down:
	docker compose -f docker-compose.dev.yml down

rebuild:
	docker compose --env-file ./env/dev.env -f docker-compose.dev.yml up -d --no-deps --build $(svc)

stop:
	docker compose --env-file ./env/dev.env -f docker-compose.dev.yml stop $(svc)

builddb:
	docker buildx build -t occupantangler/purrsonal_db:latest -f ./db/Dockerfile ./db

pushdb:
	docker image push occupantangler/purrsonal_db:latest

rmi:
	docker rmi -f $$(docker images -q)

rmc:
	docker rm -f $$(docker ps -aq)

prune:
	docker container prune -f
	docker image prune -f
	docker builder prune -f
	docker volume prune -f
	docker network prune -f

