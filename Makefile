
.PHONY: build pull

.SECONDEXPANSION:

build:
	@rm -rf out/webpkit
	@mkdir -p out/webpkit
	@cp -rf assets cms isolate lib mobile webpack .postcssrc.js LICENSE package.json README.md shell.js out/webpkit/
	@find out/webpkit -name '*.ts'| xargs rm
	@find out/webpkit -name '*.tsx'| xargs rm
	@cp -rf examples out/webpkit/
	@tsc
	@tar cfz out/webpkit.tgz out/webpkit

pull:
	git pull
	git submodule update --init --recursive