# Savage SVG Generator - Development Commands

.PHONY: help install dev build test clean docker-dev docker-down lint typecheck

# Colors for output
BLUE := \033[34m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)Savage SVG Generator - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	pnpm install
	cd api && pnpm install
	cd backend && uv sync

install-frontend: ## Install frontend dependencies only
	@echo "$(BLUE)Installing frontend dependencies...$(NC)"
	pnpm install

install-api: ## Install API dependencies only
	@echo "$(BLUE)Installing API dependencies...$(NC)"
	cd api && pnpm install

install-backend: ## Install backend dependencies only
	@echo "$(BLUE)Installing backend dependencies...$(NC)"
	cd backend && uv sync

dev: ## Start development servers for all services
	@echo "$(BLUE)Starting all development servers...$(NC)"
	pnpm dev:all

dev-frontend: ## Start frontend development server only
	@echo "$(BLUE)Starting frontend development server...$(NC)"
	pnpm dev

dev-api: ## Start API development server only
	@echo "$(BLUE)Starting API development server...$(NC)"
	cd api && pnpm dev

dev-backend: ## Start backend development server only
	@echo "$(BLUE)Starting backend development server...$(NC)"
	cd backend && uv run uvicorn main:app --reload --port 8001

build: ## Build all services for production
	@echo "$(BLUE)Building all services...$(NC)"
	pnpm build
	cd api && pnpm build

build-frontend: ## Build frontend only
	@echo "$(BLUE)Building frontend...$(NC)"
	pnpm build

build-api: ## Build API only
	@echo "$(BLUE)Building API...$(NC)"
	cd api && pnpm build

test: ## Run all tests
	@echo "$(BLUE)Running all tests...$(NC)"
	pnpm test

test-frontend: ## Run frontend tests only
	@echo "$(BLUE)Running frontend tests...$(NC)"
	pnpm test:frontend

test-api: ## Run API tests only
	@echo "$(BLUE)Running API tests...$(NC)"
	cd api && pnpm test

test-backend: ## Run backend tests only
	@echo "$(BLUE)Running backend tests...$(NC)"
	cd backend && uv run pytest

test-e2e: ## Run end-to-end tests
	@echo "$(BLUE)Running E2E tests...$(NC)"
	pnpm test:e2e

lint: ## Run linting for all services
	@echo "$(BLUE)Running linting...$(NC)"
	pnpm lint
	@echo "$(GREEN)Linting completed$(NC)"

lint-fix: ## Fix linting issues automatically
	@echo "$(BLUE)Fixing linting issues...$(NC)"
	pnpm lint:fix
	@echo "$(GREEN)Linting fixes applied$(NC)"

typecheck: ## Run type checking for all services
	@echo "$(BLUE)Running type checking...$(NC)"
	pnpm typecheck
	cd api && pnpm exec tsc --noEmit
	@echo "$(GREEN)Type checking completed$(NC)"

docker-dev: ## Start development environment with Docker Compose
	@echo "$(BLUE)Starting Docker development environment...$(NC)"
	docker-compose -f docker-compose.dev.yml up --build

docker-down: ## Stop Docker development environment
	@echo "$(BLUE)Stopping Docker development environment...$(NC)"
	docker-compose -f docker-compose.dev.yml down

docker-logs: ## View Docker logs
	@echo "$(BLUE)Viewing Docker logs...$(NC)"
	docker-compose -f docker-compose.dev.yml logs -f

clean: ## Clean all build artifacts and dependencies
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	rm -rf dist/
	rm -rf node_modules/
	rm -rf api/dist/
	rm -rf api/node_modules/
	rm -rf backend/.venv/
	rm -rf backend/__pycache__/
	rm -rf backend/**/__pycache__/
	rm -rf .next/
	rm -rf playwright-report/
	rm -rf test-results/
	@echo "$(GREEN)Cleanup completed$(NC)"

setup: ## Initial project setup (install dependencies and create env files)
	@echo "$(BLUE)Setting up project...$(NC)"
	make install
	@if [ ! -f api/.env ]; then \
		echo "$(YELLOW)Creating API .env file...$(NC)"; \
		cp api/.env.example api/.env; \
	fi
	@if [ ! -f backend/.env ]; then \
		echo "$(YELLOW)Creating backend .env file...$(NC)"; \
		cp backend/.env.example backend/.env; \
	fi
	@echo "$(GREEN)Setup completed! Please configure your .env files before running the development servers.$(NC)"

health: ## Check if all services are running
	@echo "$(BLUE)Checking service health...$(NC)"
	@curl -s http://localhost:5173 > /dev/null && echo "$(GREEN)✓ Frontend is running$(NC)" || echo "$(RED)✗ Frontend is not running$(NC)"
	@curl -s http://localhost:8000/health > /dev/null && echo "$(GREEN)✓ API is running$(NC)" || echo "$(RED)✗ API is not running$(NC)"
	@curl -s http://localhost:8001/health > /dev/null && echo "$(GREEN)✓ Backend is running$(NC)" || echo "$(RED)✗ Backend is not running$(NC)"

logs: ## View logs from all development servers
	@echo "$(BLUE)Viewing development logs...$(NC)"
	@echo "Use Ctrl+C to stop viewing logs"
	tail -f api/*.log backend/*.log 2>/dev/null || echo "$(YELLOW)No log files found$(NC)"

# Default target
.DEFAULT_GOAL := help