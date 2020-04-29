
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
	// runtimeChunk: 'single',
	runtimeChunk: {
		name: 'manifest'
	},
	splitChunks: {
		// chunks: 'all'|'async'|'initial', //同时分割同步和异步代码,推荐。
		// maxAsyncRequests: 5,  // 异步加载chunk的并发请求数量<=5
		// maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
		// minSize: 30000, // 模块超过30k自动被抽离成公共模块
		// minChunks: 1, // 模块被引用>=1次，便分割
		// name: true,
		// automaticNameDelimiter: '~',
		cacheGroups: {
			vendors: {
				test: /node_modules/,
				name: "vendors",
				chunks: "all",
				priority: 3,
				enforce: true,
			},
			common: {
				name: "common",
				chunks: "all",
				priority: 2,
				enforce: true,
				minChunks: 2,
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
		}
	},
};