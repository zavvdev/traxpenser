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

db-up:
	docker compose up -d

db-stop:
	docker compose stop

db-start:
	docker compose start

db-down:
	docker compose down --rmi all -v

db-exec:
	docker exec -it $(id) bash

sc:
	docker ps
