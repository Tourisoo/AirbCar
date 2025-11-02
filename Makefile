.PHONY: help local run clean fclean status logs stop build re

RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
PURPLE := \033[0;35m
CYAN := \033[0;36m
WHITE := \033[0;37m
BOLD := \033[1m
RESET := \033[0m

all: help

help:
	@echo "$(BOLD)$(CYAN)╔══════════════════════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(BOLD)$(CYAN)║$(RESET)                           $(BOLD)$(WHITE)AirbCar Development Commands$(RESET)                           $(BOLD)$(CYAN)║$(RESET)"
	@echo "$(BOLD)$(CYAN)╚══════════════════════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(BOLD)$(GREEN)Quick Start:$(RESET)"
	@echo "  $(YELLOW)make local$(RESET)     - Start AirbCar in local development mode"
	@echo "  $(YELLOW)make run$(RESET)       - Start AirbCar in remote mode (For Platform Owners)"
	@echo "  $(YELLOW)make status$(RESET)    - Check container status"
	@echo "  $(YELLOW)make logs$(RESET)      - View application logs"
	@echo ""
	@echo "$(BOLD)$(BLUE)Development:$(RESET)"
	@echo "  $(YELLOW)make build$(RESET)     - Build Docker images"
	@echo "  $(YELLOW)make stop$(RESET)      - Stop all services"
	@echo ""
	@echo "$(BOLD)$(PURPLE)Maintenance:$(RESET)"
	@echo "  $(YELLOW)make clean$(RESET)     - Clean containers and volumes"
	@echo "  $(YELLOW)make fclean$(RESET)    - Full cleanup (including images)"
	@echo "  $(YELLOW)make re$(RESET)        - Clean and restart"
	@echo ""
	@echo "$(BOLD)$(RED)Note:$(RESET) Use $(YELLOW)make local$(RESET) for local development with PostgreSQL"
	@echo ""

run:
	@echo "$(BOLD)$(RED)╔══════════════════════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(BOLD)$(RED)║$(RESET) $(BOLD)$(WHITE)WARNING: REMOTE DATABASE MODE (DEVELOPERS ONLY)$(RESET) $(BOLD)$(RED)║$(RESET)"
	@echo "$(BOLD)$(RED)║$(RESET) $(RED)   This command uses remote Supabase database and requires$(RESET) $(BOLD)$(RED)║$(RESET)"
	@echo "$(BOLD)$(RED)║$(RESET) $(RED)   platform owner's .env.local file with database credentials.$(RESET) $(BOLD)$(RED)║$(RESET)"
	@echo "$(BOLD)$(RED)║$(RESET) $(RED)   For local development, use 'make local' instead!$(RESET) $(BOLD)$(RED)║$(RESET)"
	@echo "$(BOLD)$(RED)╚══════════════════════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(BOLD)$(CYAN)Starting AirbCar in remote mode (Supabase)...$(RESET)"
	@$(MAKE) clean
	@echo "$(YELLOW)Building Docker images...$(RESET)"
	@docker compose build django-api next-app
	@echo "$(YELLOW)Starting services...$(RESET)"
	@docker compose --env-file .env.local up django-api next-app -d
	@echo "$(GREEN)AirbCar started successfully in remote mode!$(RESET)"
	@echo "$(CYAN)Frontend: http://localhost:3000$(RESET)"
	@echo "$(CYAN)Backend:  http://localhost:8000$(RESET)"

local:
	@echo "$(BOLD)$(GREEN)╔══════════════════════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(BOLD)$(GREEN)║$(RESET)		     $(BOLD)$(WHITE)Starting AirbCar in Local Development Mode$(RESET)	     	       $(BOLD)$(GREEN)║$(RESET)"
	@echo "$(BOLD)$(GREEN)╚══════════════════════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(YELLOW)Setting up environment file...$(RESET)"
	@cp .env.local.example .env.local
	@python -c "import secrets; f=open('.env.local','r+'); c=f.read(); f.seek(0); f.write(c.replace('auto-generated-by-make-local', secrets.token_urlsafe(50))); f.truncate()" 2>nul || python3 -c "import secrets; f=open('.env.local','r+'); c=f.read(); f.seek(0); f.write(c.replace('auto-generated-by-make-local', secrets.token_urlsafe(50))); f.truncate()"
	@$(MAKE) clean
	@echo "$(YELLOW)Building and starting services...$(RESET)"
	@docker compose up --build -d
	@echo "$(YELLOW)Cleaning up temporary files...$(RESET)"
	@rm -rf .env.local
	@echo "$(GREEN)AirbCar started successfully in local mode!$(RESET)"
	@echo "$(CYAN)Frontend: http://localhost:3000$(RESET)"
	@echo "$(CYAN)Backend:  http://localhost:8000$(RESET)"
	@echo "$(CYAN)Database: PostgreSQL (local)$(RESET)"

status:
	@echo "$(BOLD)$(BLUE)AirbCar Container Status$(RESET)"
	@echo "$(CYAN)═══════════════════════════════════════════════════════════════════════════════$(RESET)"
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

logs:
	@echo "$(BOLD)$(PURPLE)AirbCar Application Logs$(RESET)"
	@echo "$(CYAN)═══════════════════════════════════════════════════════════════════════════════$(RESET)"
	@docker compose logs -f --tail=50

stop:
	@echo "$(BOLD)$(RED)Stopping AirbCar services...$(RESET)"
	@docker compose down
	@echo "$(GREEN)Services stopped successfully!$(RESET)"

build:
	@echo "$(BOLD)$(BLUE)Building AirbCar Docker images...$(RESET)"
	@docker compose build
	@echo "$(GREEN)Images built successfully!$(RESET)"

clean:
	@echo "$(BOLD)$(YELLOW)Cleaning up AirbCar containers and volumes...$(RESET)"
	@docker compose down -v
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@docker network rm $$(docker network ls -q) 2>/dev/null || true
	@echo "$(GREEN)Cleanup completed!$(RESET)"

fclean: clean
	@echo "$(BOLD)$(RED)Performing full cleanup (containers, networks, volumes, images)...$(RESET)"
	@docker system prune -a -f
	@echo "$(GREEN)Full cleanup completed!$(RESET)"

re: clean run
