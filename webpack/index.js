/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2019, hardchain
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of hardchain nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL hardchain BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const config = require('./cfg');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin") ;
const os = require('os');
const ManifestPlugin = require('./manifest').ManifestPlugin;

const NODE_ENV = 
	process.env.NODE_ENV == 'prod' ? 'production': 
	process.env.NODE_ENV == 'dev' ? 'development': process.env.NODE_ENV || 'development';

const isProd = NODE_ENV == 'production';
const sourceMapEnabled = isProd ?
	config.build.productionSourceMap: config.dev.cssSourceMap;

// console.log('--------------', process.env.NODE_ENV, NODE_ENV)

const HOST = config.dev.host;
const PORT = config.dev.port;

const views = ['.', 'views', 'app'].map(inputDir=>{
	if (fs.existsSync(`${config.source}/${inputDir}`) && fs.statSync(`${config.source}/${inputDir}`).isDirectory()) {

		var r = fs.readdirSync(inputDir)
		.filter(e=>['.jsx','.tsx','.ts','.js'].indexOf(path.extname(e))!=-1)
		.filter(e=>fs.statSync(path.join(inputDir, e)).isFile())
		.map(e=>{
			var ext = path.extname(e);
			var name = e.substr(0, e.length - ext.length);
			var path_ = './' + path.join(inputDir, name);
			return { name, path: path_, html: path_ + '.html' };
		})
		.filter(e=>fs.existsSync(e.html)&&fs.statSync(e.html).isFile());

		if (r.length)
			return r;
	}
}).find(e=>e);

// console.log('----------------------', views);

// develop plugins
const develop_plugins = [
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
	new webpack.NoEmitOnErrorsPlugin(),
	new FriendlyErrorsPlugin({
		compilationSuccessInfo: {
			messages: [`Your application is running here: http://${HOST}:${PORT}`],
		},
		onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
	}),
];

const prod_plugins = [
	// extract css into its own file
	new MiniCssExtractPlugin({
		filename: utils.assetsPath('css/[name].min.css?[chunkhash]'), // [contenthash]
		chunkFilename: utils.assetsPath("css/[name].min.css?[chunkhash]"),
	}),
	// Compress extracted CSS. We are using this plugin so that possible
	// duplicated CSS from different components can be deduped.
	new OptimizeCSSPlugin({
		cssProcessorOptions: config.build.productionSourceMap
			? { safe: true, map: { inline: false } }
			: { safe: true }
	}),
	// keep module.id stable when vendor modules does not change
	new webpack.HashedModuleIdsPlugin(),
	// enable scope hoisting
	new webpack.optimize.ModuleConcatenationPlugin(),
	...(config.build.productionGzip ? [
		new (require('compression-webpack-plugin'))({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8 
		})]:[]
	),
	...(config.build.bundleAnalyzerReport ? [
		new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)() ]:[]
	),
	new ManifestPlugin(),
];

const plugins = [
	new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
	new webpack.DefinePlugin({ 'process.env': { NODE_ENV: `"${NODE_ENV}"` } }),
	// copy custom static assets
	new CopyWebpackPlugin(config.staticAssets.map(e=>({
		from: utils.resolve(e),
		to: e,
		ignore: ['.*', '*.mp4', '*.mp3'],
	}))),
	// generate dist index.html with correct asset hash for caching.
	// you can customize output by editing /index.html
	// see https://github.com/ampedandwired/html-webpack-plugin
	
	...views.map(({name,path})=>
		new HtmlWebpackPlugin({
			filename: name + '.html',
			template: path + '.html',
			inject: true,
			chunks: ['low', 'vendors', 'common', name, 'manifest'],
		}),
	),
	...(isProd ? prod_plugins: develop_plugins),
];

var devClient = [];

if (!isProd && config.dev.inline === false) {
	devClient.push('webpkit/webpack/dev-client');
	if (config.dev.hotOnly) {
		devClient.push('webpack/hot/only-dev-server');
	} else if (config.dev.hot) {
		devClient.push('webpack/hot/dev-server');
	}
}

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
	mode: isProd ? 'production': 'development',
	externals: require('./externals'),
	context: utils.resolve('.'),
	entry: {/**/},
	output: {
		path: config.output, // build output dir
		filename: isProd ? utils.assetsPath('js/[name].min.js?[chunkhash]'): '[name].js',
			...(isProd ? {
		chunkFilename: utils.assetsPath('js/[name].chunk.min.js?[chunkhash]') }: {}),
		publicPath: config.publicPath,
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json',/* '.css', '.sass'*/],
		// alias: {
		// 	'nifty': path.join(__dirname, '../nifty'),
		// }
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: [utils.resolve('.'), path.join(__dirname, '..')],
				exclude: /(typeof|_bigint)\.js/,
				use: [{
					loader: 'babel-loader',
					options: babelOptions,
				}],
			},
			{
				test: /\.(ts|tsx)$/,
				include: [utils.resolve('.'), path.join(__dirname, '..')],
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
					limit: 10000,
					name: utils.assetsPath('res/[name].[hash:7].[ext]')
				}
			},
			...utils.styleLoaders({ sourceMap: sourceMapEnabled, usePostCSS: true, extract: isProd, }),
		],
	},
	plugins: plugins,
	optimization: {
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: os.cpus().length - 1,
				sourceMap: true, // Must be set to true if using source-maps in production
				terserOptions: {
					// https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
				},
				exclude: config.minimizer ? /nxkit_bigint/: /.*/,
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
					// test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
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
	},
	// cheap-module-eval-source-map is faster for development
	devtool: isProd 
		? (config.build.productionSourceMap ? config.build.devtool : false)
		: config.dev.devtool,
	node: {
		// prevent webpack from injecting useless setImmediate polyfill because Vue
		// source contains it (although only uses it if it's native).
		setImmediate: false,
		// prevent webpack from injecting mocks to Node native modules
		// that does not make sense for the client
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	},
	// these devServer options should be customized in /config/index.js
	devServer: {
		inline: config.dev.inline,
		clientLogLevel: 'warning',
		historyApiFallback: {
			rewrites: [
				{ from: /.*?\.html(\?.*)?$/, to: '/' },
			],
		},
		// contentBase: false, // since we use CopyWebpackPlugin.
		disableHostCheck: true, // Invalid Host header
		hotOnly: config.dev.hotOnly,
		hot: config.dev.hot,
		compress: true,
		host: HOST,
		port: PORT,
		open: config.dev.autoOpenBrowser,
		overlay: config.dev.errorOverlay ? { warnings: false, errors: true }: false,
		publicPath: path.join('/', config.assetsPublicPath),
		proxy: config.dev.proxyTable,
		quiet: true, // necessary for FriendlyErrorsPlugin
		watchOptions: { poll: config.dev.poll, },
	},
};

views.forEach(({name,path})=>{
	module.exports.entry[name] = ['webpkit/webpack/low', ...devClient, path ];
});

// console.log(module.exports.entry)