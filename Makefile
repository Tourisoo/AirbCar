.PHONY: local run clean

all: run

run:
	@echo "\033[1;31m⚠️  WARNING: REMOTE DATABASE MODE (DEVELOPERS ONLY)\033[0m"
	@echo "\033[1;31m   This command uses remote Supabase database and requires\033[0m"
	@echo "\033[1;31m   platform owner's .env.local file with database credentials.\033[0m"
	@echo "\033[1;31m   For local development, use 'make local' instead!\033[0m"
	@echo ""
	@echo "🚀 Starting AirbCar in remote mode (Supabase)..."
	@docker compose down -v
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@docker network rm $$(docker network ls -q) 2>/dev/null || true
	@docker compose build django-api next-app
	@docker compose --env-file .env.local up django-api next-app -d

local:
	@echo "Starting AirbCar in local mode (Local DB)..."
	@docker compose down -v
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@docker network rm $$(docker network ls -q) 2>/dev/null || true	
	@docker compose --env-file .env.local.example up --build -d

re: clean run

clean:
	@echo "Stopping and removing all containers and networks"
	@docker compose down -v
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@docker network rm $$(docker network ls -q) 2>/dev/null || true

fclean: clean
	@echo "Performing full cleanup (containers, networks, volumes, images)..."
	@docker system prune -a
