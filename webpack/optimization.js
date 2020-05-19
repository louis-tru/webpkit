
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');
const config = require('./cfg');

module.exports = {
	minimizer: [
		new TerserPlugin({
			cache: true,
			parallel: os.cpus().length - 1,
			sourceMap: true, // Must be set to true if using source-maps in production
			terserOptions: {
				// https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
			},
			exclude: config.isMinimizer ? /nxkit_bigint/: /.*/,
		}),
	],
	runtimeChunk: {
		name: 'runtime',
	},
	splitChunks: {
		cacheGroups: {
			vendors: {
				test: /node_modules|webpkit/,
				name: "vendors",
				chunks: "all",
				priority: 3,
				enforce: true,
			},
			nxkit_bigint: {
				test: /nxkit\/_bigint/,
				name: "nxkit_bigint",
				chunks: "all",
				enforce: true,
				priority: 5,
			},
			low: { // TODO 最高优先级必须先加载low.js文件,有些旧浏览器需要这些api
				test: /webpack\/low/,
				name: "low",
				chunks: "all",
				enforce: true,
				priority: 6,
			},
		},
	},
	chunkIds: 'named',
	moduleIds: 'hashed',
};