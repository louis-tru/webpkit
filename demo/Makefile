NODE    ?= node
CWD     ?= $(shell pwd)
ENV     ?= dev

cfg = \
if [ -f .config.js ]; then \
	cat .config.js > config.js; \
elif [ -f .cfg_$(1).js ]; then \
	cat .cfg_$(1).js > config.js; \
fi

.PHONY: all build dev

.SECONDEXPANSION:

all: build

build:
	@$(call cfg,$(ENV))
	@npm run $@
	@cd out; tar cfvz publish.tgz public

dev:
	@$(call cfg,$(ENV))
	@npm run $@