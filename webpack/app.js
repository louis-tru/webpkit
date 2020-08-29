
const path = require('path');
const crypto = require('crypto-tx');
const cfg = require('webpkit/webpack/cfg');
const appCfg = require(path.resolve('./config'));
const utils = require('webpkit/webpack/utils');
const fs = require('somes/fs');
const pkg = require(`${process.cwd()}/package.json`);

const appInfo = appCfg.app || {};

appInfo.name = appInfo.name || pkg.name;
appInfo.displayName = appInfo.displayName || pkg.name;
appInfo.appId = appInfo.appId || pkg.name;
appInfo.appKey = appInfo.appKey;
appInfo.version = pkg.version;

if (cfg.isProd || !appInfo.appKey) {
	appCfg.app = appInfo;
	appInfo.appKey = crypto.genPrivateKey().toString('base64');
	fs.writeFileSync(path.resolve('./config.js'), `module.exports = ${JSON.stringify(appCfg, null, 2)}`);
}

const private = Buffer.from(appInfo.appKey, 'base64');
const appKey = crypto.getPublic(private, true);

class ApplicationInfo {

	apply(compiler) {
		if (cfg.isProd)
			this._apply(compiler);
	}

	_apply(compiler) {

		compiler.hooks.done.tap('ApplicationInfo', ()=>{
			var path_str = path.resolve(cfg.output, utils.assetsPath('app.json'));

			if (appInfo.icon) {
				var icon = path.resolve(appInfo.icon);
				if (fs.existsSync(icon)) {
					var basename = path.basename(icon);
					fs.copyFileSync(icon, path.resolve(cfg.output, utils.assetsPath(basename)) );
					appInfo.icon = appInfo.appId + '/' + basename;
				}
			}

			fs.writeFileSync(path_str, JSON.stringify({...appInfo, appKey: appKey.toString('base64') }, null, 2));
		});
	}

}

module.exports = ApplicationInfo;