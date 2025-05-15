dev:
	pnpm dev

start:
	pnpm start

analyze:
	pnpm analyze

prettify:
	pnpm prettify

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
