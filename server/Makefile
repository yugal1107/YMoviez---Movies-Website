# Docker helpers for the YMoviez server.
#
# Usage:
#   make login                        # log in to ghcr.io (needs CR_PAT env var or prompts for token)
#   make build                        # build image locally
#   make push                         # build + push to ghcr.io
#   make pull                         # pull latest image from ghcr.io
#   make run                          # run container with ./.env on port 3000
#   make stop                         # stop + remove the container
#   make logs                         # tail container logs
#
# Override defaults on the CLI, e.g.:
#   make push TAG=v1.2.3
#   make run PORT=4000 ENV_FILE=.env.prod

GH_USER  ?= yugal1107
IMAGE    ?= ymoviez-server
REGISTRY ?= ghcr.io
TAG      ?= latest
IMG      := $(REGISTRY)/$(GH_USER)/$(IMAGE):$(TAG)

CONTAINER ?= $(IMAGE)
PORT      ?= 3000
ENV_FILE  ?= .env

.PHONY: login build push pull run stop logs

login:
	@if [ -z "$$CR_PAT" ]; then \
		echo "Enter GitHub PAT (with write:packages) for $(GH_USER):"; \
		read -s TOKEN; echo "$$TOKEN" | docker login $(REGISTRY) -u $(GH_USER) --password-stdin; \
	else \
		echo "$$CR_PAT" | docker login $(REGISTRY) -u $(GH_USER) --password-stdin; \
	fi

build:
	docker build -t $(IMG) .

push: build
	docker push $(IMG)

pull:
	docker pull $(IMG)

run:
	@test -f $(ENV_FILE) || { echo "Missing $(ENV_FILE)"; exit 1; }
	docker run -d --name $(CONTAINER) --env-file $(ENV_FILE) -p $(PORT):3000 --restart unless-stopped $(IMG)

stop:
	-docker stop $(CONTAINER)
	-docker rm $(CONTAINER)

logs:
	docker logs -f $(CONTAINER)
