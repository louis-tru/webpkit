
.PHONY: build

.SECONDEXPANSION:

build:
	@rm -rf out/webpkit
	@mkdir -p out/webpkit
	@cp -rf assets cms examples isolate lib mobile webpack .postcssrc.js LICENSE package.json README.md shell.js out/webpkit/
	@find out/webpkit -name '*.ts'| xargs rm
	@find out/webpkit -name '*.tsx'| xargs rm
	@tsc
	@tar cfz out/webpkit.tgz out/webpkit