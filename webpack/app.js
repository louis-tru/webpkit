
const path = require('path');
const crypto = require('crypto-tx');
const cfg = require('webpkit/webpack/cfg');
const appCfg = require(path.resolve('./config'));
const utils = require('webpkit/webpack/utils');
const fs = require('fs');
const pkg = require(`${process.cwd()}/package.json`);

const app = appCfg.app = appCfg.app || {};

app.name = app.name || pkg.name;
app.displayName = app.displayName || pkg.name;
app.appId = app.appId || pkg.name;
app.appKey = app.appKey || crypto.genPrivateKey().toString('base64');
app.version = pkg.version;

fs.writeFileSync(path.resolve('./config.js'), `module.exports = ${JSON.stringify(appCfg, null, 2)}`);

const private = Buffer.from(app.appKey, 'base64');
const appKey = crypto.getPublic(private, true);

class ApplicationInfo {

	apply(compiler) {
		if (cfg.isProd)
			this._apply(compiler);
	}

	_apply(compiler) {

		compiler.hooks.done.tap('ApplicationInfo', ()=>{
			var path_str = path.resolve(cfg.output, utils.assetsPath('app.json'));

			if (app.icon) {
				var icon = path.resolve(app.icon);
				if (fs.existsSync(icon)) {
					var basename = path.basename(icon);
					fs.copyFileSync(icon, path.resolve(cfg.output, utils.assetsPath(basename)) );
					app.icon = app.appId + '/' + basename;
				}
			}

			fs.writeFileSync(path_str, JSON.stringify({...app, appKey: appKey.toString('base64') }, null, 2));
		});
	}

}

module.exports = ApplicationInfo;