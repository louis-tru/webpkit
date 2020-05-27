
const utils = require('./utils');
const config = require('./cfg');
const path = require('path');
const fs = require('fs');

const isProd = config.isProd;
const sourceMapEnabled = isProd ?
	config.build.productionSourceMap: config.dev.cssSourceMap;

var babelOptions;
var babelrc = [utils.resolve('.babelrc'), path.join(__dirname + '/../.babelrc')];

for (var src of babelrc) {
	try {
		babelOptions = eval('(' + fs.readFileSync(src, 'utf-8') + ')');
		break;
	} catch(err) {
		console.warn(err);
	}
}

module.exports = {
	rules: [
		{
			test: /\.(js|jsx)$/,
			include: [/*utils.resolve('.'), */path.resolve('..')],
			exclude: /(typeof|_bigint)\.js/,
			use: [{
				loader: 'babel-loader',
				options: babelOptions,
			}],
		},
		{
			test: /\.(ts|tsx)$/,
			include: [/*utils.resolve('.'), */path.resolve('..')],
			use: [{
				loader: 'babel-loader',
				options: babelOptions,
			},{
				loader: 'ts-loader',
				options: { allowTsInNodeModules: true },
			}],
		},
		{
			test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: config.limit,
				name: utils.assetsPath('res/[name].[hash:7].[ext]')
			}
		},
		...utils.styleLoaders({ sourceMap: sourceMapEnabled, usePostCSS: true, extract: isProd, }),
	],
};