# Configuration
REGISTRY ?= docker.io
NAMESPACE ?= tcg
VERSION ?= v1.0.0

IMAGE_BACKEND := $(REGISTRY)/$(NAMESPACE)/tcg-backend:$(VERSION)
IMAGE_FRONTEND := $(REGISTRY)/$(NAMESPACE)/tcg-frontend:$(VERSION)

COMPOSE_FILE := docker-compose.prod.yml

.PHONY: help
help:
	@echo "Targets:"
	@echo "  login            - Docker login to registry ($(REGISTRY))"
	@echo "  build            - Build backend and frontend images"
	@echo "  push             - Push backend and frontend images"
	@echo "  tag-latest       - Tag images also as :latest"
	@echo "  push-latest      - Push :latest tags"
	@echo "  deploy           - Pull images and start services with compose (prod)"
	@echo "  up               - Build on host and start services (uses compose build)"
	@echo "  down             - Stop services"
	@echo "  logs             - Tail service logs"
	@echo "  images           - Show computed image names"
	@echo "Usage: make <target> REGISTRY=docker.io NAMESPACE=NAME VERSION=vX.Y.Z"

.PHONY: images
images:
	@echo BACKEND=$(IMAGE_BACKEND)
	@echo FRONTEND=$(IMAGE_FRONTEND)

.PHONY: login
login:
	docker login $(REGISTRY)

.PHONY: build
build:
	docker build -t $(IMAGE_BACKEND) -f backend/Dockerfile backend
	docker build -t $(IMAGE_FRONTEND) -f frontend/Dockerfile.prod frontend

.PHONY: push
push:
	docker push $(IMAGE_BACKEND)
	docker push $(IMAGE_FRONTEND)

.PHONY: tag-latest
tag-latest:
	docker tag $(IMAGE_BACKEND) $(REGISTRY)/$(NAMESPACE)/tcg-backend:latest
	docker tag $(IMAGE_FRONTEND) $(REGISTRY)/$(NAMESPACE)/tcg-frontend:latest

.PHONY: push-latest
push-latest: tag-latest
	docker push $(REGISTRY)/$(NAMESPACE)/tcg-backend:latest
	docker push $(REGISTRY)/$(NAMESPACE)/tcg-frontend:latest

.PHONY: deploy
deploy:
	IMAGE_BACKEND=$(IMAGE_BACKEND) IMAGE_FRONTEND=$(IMAGE_FRONTEND) docker compose -f $(COMPOSE_FILE) pull
	IMAGE_BACKEND=$(IMAGE_BACKEND) IMAGE_FRONTEND=$(IMAGE_FRONTEND) docker compose -f $(COMPOSE_FILE) up -d

.PHONY: up
up:
	docker compose -f $(COMPOSE_FILE) build
	docker compose -f $(COMPOSE_FILE) up -d

.PHONY: down
down:
	docker compose -f $(COMPOSE_FILE) down

.PHONY: logs
logs:
	docker compose -f $(COMPOSE_FILE) logs -f --tail=200 | cat


