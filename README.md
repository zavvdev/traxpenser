# Setup

1. Copy `.env.example` to `.env` and fill in the values

2. Edit your `/etc/hosts` file to include the following lines:

```
127.0.0.1 mongodb
127.0.0.1 mongodb_replica_1
127.0.0.1 mongodb_replica_2
```

3. Run `pnpm install` to install the dependencies

4. Run `make db-up` to start the MongoDB containers

5. Run `make dev` to start the development environment

## Accessing MongoDB

To login into the MongoDB shell, you can use the following commands:

1. `make sc` - show running containers

2. `make db-exec id=<mongodb_container_id>` - login into the MongoDB container

3. `mongosh -u <username> -p <password>` - replace `<username>` and `<password>` with your MongoDB credentials from .env file

## Other commands

`make dev` - start the development environment

`make start` - start the application

`make analyze` - run code analysis tools

`make unsafe-fix` - run code analysis unsafe code fixes

`make db-up` - create and start database containers

`make db-down` - stop and remove database containers

`make db-stop` - stop database containers

`make db-start` - start stopped database containers

`make db-exec id=<container-id>` - login into database container by id

`make sc` - show running containers
