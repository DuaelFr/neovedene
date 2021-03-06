
default: up

up:
	docker-compose up -d

down:
	docker-compose stop

prune:
	docker-compose down

bshell:
	docker-compose exec node-back sh

fshell:
	docker-compose exec node-front sh

build:
	docker-compose exec node-back yarn install
	docker-compose exec node-back yarn run import

# Shortcuts

stop: down
bsh: bshell
fsh: fshell
