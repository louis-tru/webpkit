
.PHONY: build

.SECONDEXPANSION:

build:
	@rm -rf out/dist
	@mkdir -p out/dist
	@cp -rf assets cms examples isolate lib mobile webpack .postcssrc.js LICENSE package.json README.md shell.js out/dist/
	@find out/dist -name '*.ts'| xargs rm
	@find out/dist -name '*.tsx'| xargs rm
	@tsc
