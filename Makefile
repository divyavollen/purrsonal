up:
	docker compose --env-file ./env/dev.env -f docker-compose.dev.yml up

upv:
	docker compose  --verbose --env-file ./env/dev.env -f docker-compose.dev.yml up

down:
	docker compose -f docker-compose.dev.yml down

builddb:
	docker buildx build -t occupantangler/purrsonal_db:latest -f ./db/Dockerfile ./db

pushdb:
	docker image push occupantangler/purrsonal_db:latest

rmi:
	docker rmi -f $$(docker images -q)

rmc:
	docker rm -f $$(docker ps -aq)
