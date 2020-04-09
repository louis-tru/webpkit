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
	if [ ! -d ../cport-h5 ]; then \
		cd .. && git clone http://gitlab.stars-mine.com/cport/cport-h5.git; \
	else \
		cd ../cport-h5 && git pull; \
	fi

install: pull
	@-npm install
	@rm -rf ../node_modules && ln -s cport-h5/node_modules ../node_modules