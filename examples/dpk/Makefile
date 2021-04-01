NODE    ?= node
CWD     ?= $(shell pwd)
ENV     ?= dev
NAME    ?= $(shell node -e 'console.log(require("./config").app.appId)')

cfg = \
if [ -f .config.js ]; then \
	cat .config.js > config.js; \
elif [ -f .cfg_$(1).js ]; then \
	cat .cfg_$(1).js > config.js; \
fi

.PHONY: build dev pull

.SECONDEXPANSION:

build:
	@$(call cfg,$(ENV))
	@npm run $@
	@cd out/public; tar cfvz ../$(NAME).dpk ./*

dev:
	@$(call cfg,$(ENV))
	@npm run $@

pull:
	git pull
	git submodule update --init --recursive
