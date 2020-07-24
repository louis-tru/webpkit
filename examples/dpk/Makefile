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

.PHONY: build build2 dev config

.SECONDEXPANSION:

build build2: config
	@rm -rf out/public
	@npm run $@
	@cd out/public; tar cfvz ../$(NAME).dpk ./*

dev: config
	@npm run $@

config:
	@$(call cfg,$(ENV))

#####################################

.PHONY: pull install

pull = \
	if [ ! -d ../dphoto-$(1) ]; then \
		cd .. && git clone http://gitlab.stars-mine.com/hardware/dphoto-$(1).git; \
	else \
		cd ../dphoto-$(1) && git pull; \
	fi

pull:
	@git pull
	@$(call pull,lib)
	@$(call pull,core)

install: pull
	@$(call cfg,$(ENV))
	@npm install
	@cd ../dphoto-core && make install
	@rm -rf ../node_modules && ln -s dphoto-lib/node_modules ../node_modules
