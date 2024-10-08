ifneq (,$(wildcard ./.env))
    include .env
    export
endif

PORT := $(PORT)

.PHONY: start_server start_host kill_server zrok_shell docker_build

docker: docker_build
	docker run -p $(PORT):$(PORT) --env-file .env 9ziggy9.web

docker_build:
	docker build --no-cache -t 9ziggy9.web .

local_start_server: main.go
	@go run servelog.go main.go

zrok:
	zrok share reserved 9ziggy9

kill_server:
	fuser -k -n tcp $(PORT)

zrok_shell:
	@make -f Makefile.private shell
