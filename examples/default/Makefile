NODE    ?= node
CWD     ?= $(shell pwd)
ENV     ?= dev

cfg = \
if [ -f .config.js ]; then \
	cat .config.js > config.js; \
elif [ -f .cfg_$(1).js ]; then \
	cat .cfg_$(1).js > config.js; \
fi

.PHONY: all build dev pull install

.SECONDEXPANSION:

all: build

build:
	@$(call cfg,$(ENV))
	@npm run $@
	@cd out; tar cfvz public.tgz public

dev:
	@$(call cfg,$(ENV))
	@npm run $@

pull:
	@git pull; \
	if [ ! -d ../webpkit ]; then \
		cd .. && git clone http://gitlab.stars-mine.com/cport/webpkit.git; \
	else \
		cd ../webpkit && git pull; \
	fi

install: pull
	@-npm install
	@rm -rf ../node_modules && ln -s webpkit/node_modules ../node_modules