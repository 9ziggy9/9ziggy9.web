ifneq (,$(wildcard ./.env))
    include .env
    export
endif

PORT := $(PORT)

.PHONY: start_server start_host kill_server zrok_shell docker_build

docker: docker_build
	docker run -p $(PORT):$(PORT) --env-file .env dizz

docker_build:
	docker build --no-cache -t dizz .

local_start_server: main.go
	@go run $<

zrok:
	zrok share reserved 9ziggy9

kill_server:
	fuser -k -n tcp $(PORT)

zrok_shell:
	@make -f Makefile.private shell
