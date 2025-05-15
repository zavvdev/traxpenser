dev:
	php artisan serve

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
