
const utils = require('./utils');
const config = require('./cfg');
const path = require('path');
const fs = require('fs');

const isProd = config.isProd;

var babelOptions;
var babelrc = [utils.resolve('.babelrc'), path.join(__dirname + '/../.babelrc')];

for (var src of babelrc) {
	try {
		babelOptions = eval('(' + fs.readFileSync(src, 'utf-8') + ')');
		break;
	} catch(err) {
		// console.warn(err);
	}
}

module.exports = {
	rules: [
		{
			test: /\.(js|jsx)$/,
			include: [path.resolve('..')],
			exclude: /(typeof|_bigint)\.js/,
			use: [{
				loader: 'babel-loader',
				options: babelOptions,
			}],
		},
		{
			test: /\.(ts|tsx)$/,
			include: [path.resolve('..')],
			use: [{
				loader: 'babel-loader',
				options: babelOptions,
			},{
				loader: 'ts-loader',
				options: { 
					allowTsInNodeModules: false,
					onlyCompileBundledFiles: true,
				},
			}],
		},
		{
			test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf|pdf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: config.limit,
				name: utils.assetsPath('res/[name].[hash:7].[ext]')
			}
		},
		...utils.styleLoaders({ sourceMap: config.sourceMap, usePostCSS: true, extract: isProd, }),
	],
};