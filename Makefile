dev:
	pnpm dev

start:
	pnpm start

test:
	pnpm test

analyze:
	pnpm analyze

unsafe-fix:
	pnpm unsafe-fix

db-stop:
	docker compose stop

db-up:
	docker compose --env-file .env.production up -d

db-start:
	docker compose --env-file .env.production start

db-down:
	docker compose down --rmi all -v

db-exec:
	docker exec -it $(id) bash

db-up-dev:
	docker compose --env-file .env.local up -d

db-start-dev:
	docker compose --env-file .env.local start

db-up-test:
	docker compose --env-file .env.test up -d

db-start-test:
	docker compose --env-file .env.test start

sc:
	docker ps
