
const path = require('path');

// https://www.cnblogs.com/champyin/p/12198515.html

class ManifestPlugin {

	apply(compiler) {
		// console.log('------------ ManifestPlugin --- ');

		var options = {};
		options.assets = true;
		options.version = false;
		options.timings = false;
		options.chunks = true;
		options.chunkModules = true;
		options.cached = false;
		options.source = false;
		options.errorDetails = false;
		options.chunkOrigins = true;
		options.chunkNames = true;

		compiler.hooks.done.tap('ManifestPlugin', (stats) => {
			// var data = stats.toJson(options);
			// console.log('-- ManifestPlugin --', data.modules.filter(e=>e.name&&['.ts','.tsx'].indexOf(path.extname(e.name))!=-1 ) );
			// console.log('-- ManifestPlugin --', stats );
		});

	}
}

exports.ManifestPlugin = ManifestPlugin;