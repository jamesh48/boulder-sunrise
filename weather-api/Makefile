.PHONY: help build up down restart logs clean rebuild shell stop

# Default target - show available commands
help:
	@echo "Available commands:"
	@echo "  make build      - Build the Docker images"
	@echo "  make up         - Start the containers in detached mode"
	@echo "  make down       - Stop and remove containers"
	@echo "  make restart    - Restart the containers"
	@echo "  make logs       - View container logs (follow mode)"
	@echo "  make clean      - Remove containers, volumes, and images"
	@echo "  make rebuild    - Clean rebuild and start containers"
	@echo "  make shell      - Open a shell in the weather-api container"
	@echo "  make stop       - Stop containers without removing them"

# Build Docker images
build:
	docker-compose build

# Start containers in detached mode
up:
	docker-compose up -d

# Stop and remove containers
down:
	docker-compose down

# Restart containers
restart:
	docker-compose restart

# View logs (follow mode)
logs:
	docker-compose logs -f weather-api

# Stop containers without removing them
stop:
	docker-compose stop

# Remove everything (containers, volumes, images)
clean:
	docker-compose down -v --rmi all

# Clean rebuild - stop, clean, build, and start
rebuild: down clean build up
	@echo "Rebuild complete!"

# Open a shell in the weather-api container
shell:
	docker exec -it weather-api /bin/sh