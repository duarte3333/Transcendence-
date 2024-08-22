DOCKER_COMPOSE = docker-compose
PROJECT_NAME = transcendence

.PHONY: remove prune restart rebuild

remove:
	docker stop $$(docker ps -q) && docker rm $$(docker ps -aq) && docker rmi $$(docker images -q)

prune:
	docker system prune -a --volumes -f

re_clean:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) down --remove-orphans && $(DOCKER_COMPOSE) -p $(PROJECT_NAME) build --no-cache && $(DOCKER_COMPOSE) -p $(PROJECT_NAME) up

run:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) down && $(DOCKER_COMPOSE) -p $(PROJECT_NAME) up --build

re:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) down && $(DOCKER_COMPOSE) -p $(PROJECT_NAME) up

ipmac:
	ipconfig getifaddr en0