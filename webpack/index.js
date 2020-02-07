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

//global.__resourceQuery = '?https://52block.net/test_wx'

const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const config = require('./config');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('../node_modules/vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin") ;
const os = require('os');

const isProd =
	process.env.NODE_ENV === 'production' ||
	process.env.NODE_ENV === 'prod';
const sourceMapEnabled = isProd
	? config.build.productionSourceMap
	: config.dev.cssSourceMap;

// console.log('--------------', process.env.NODE_ENV)

const HOST = config.dev.host;
const PORT = config.dev.port;
// const ENV = { NODE_ENV: isProd ? '"production"': '"development"' };
const ENV = { NODE_ENV: `"${process.env.NODE_ENV}"` || '"development"' };
const name = config.productName;
const views = 
	fs.existsSync(`${config.source}/views`) && 
	fs.statSync(`${config.source}/views`).isDirectory() ?
	fs.readdirSync('./views').filter(e=>path.extname(e)=='.jsx').map(e=>{
		var name = e.substr(0, e.length - 4);
		return { name, path: `./views/${name}` };
	}): 
	[{ name: name=='app'?'index': name, path: `./${name}/index` }];

// console.log('views', isProd);

// develop plugins
const develop_plugins = [
	// new BundleAnalyzerPlugin(),
	new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
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
	new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
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
];

const plugins = [
	new VueLoaderPlugin(),
	// http://vuejs.github.io/vue-loader/en/workflow/production.html
	new webpack.DefinePlugin({ 'process.env': ENV }),
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
			chunks: ['low', 'vendors', 'common', name],
		}),
	),
	...(isProd ? prod_plugins: develop_plugins),
];

var devClient = [];

if (!isProd && config.dev.inline === false) {
	devClient.push('cport-h5/webpack/dev-client');
	if (config.dev.hotOnly) {
		devClient.push('webpack/hot/only-dev-server');
	} else if (config.dev.hot) {
		devClient.push('webpack/hot/dev-server');
	}
}

var defaultBabelOption;
var babelrc = [utils.resolve('.babelrc'), path.join(__dirname + '/../.babelrc')];

for (var src of babelrc) {
	try {
		defaultBabelOptions = eval('(' + fs.readFileSync(src, 'utf-8') + ')');
		break;
	} catch(err) {
		console.warn(err);
	}
}

// console.log(defaultBabelOptions);

// utils.assert(defaultBabelOption, '.babelrc undefined');
// console.log(defaultBabelOptions.presets[1]);

module.exports = {
	mode: isProd ? 'production': 'development',
	externals: require('./externals'),
	context: utils.resolve('.'),
	entry: {/**/},
	output: {
		path: config.output, // build output dir
		filename: isProd ? utils.assetsPath('js/[name].min.js?[chunkhash]'): '[name].js',
			...(isProd ? {
		chunkFilename: utils.assetsPath('js/[name].min.js?[chunkhash]') }: {}),
		publicPath: config.publicPath,
	},
	resolve: {
		extensions: ['.js', '.vue', '.json', '.jsx', '.css'],
		alias: {
			'@ant-design/icons/lib/dist$': path.resolve('./icons.js'),
			'vue$': 'vue/dist/vue.esm.js',
			'static': utils.resolve('static'),
			'nifty': path.join(__dirname, '../nifty'),
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: utils.cssLoaders({
						sourceMap: sourceMapEnabled,
						extract: isProd,
					}),
					cssSourceMap: sourceMapEnabled,
					cacheBusting: config.dev.cacheBusting,
					transformToRequire: {
						video: ['src', 'poster'],
						source: 'src',
						img: 'src',
						image: 'xlink:href',
					},
				},
			},
			{
				test: /\.(js|jsx)$/,
				include: [
					utils.resolve('.'),
					path.join(__dirname, '..'),
					// path.join(__dirname, '../../dphoto-magic-sdk'),
					// path.join(__dirname, '../../crypto-tx'),
					// path.join(process.env.NGUI, 'libs/nxkit'),
				],
				exclude: /(typeof|_bigint)\.js/,
				// loader: 'babel-loader',
				// options: defaultBabelOptions,
				use: [{
					loader: 'babel-loader',
					options: defaultBabelOptions,
				}]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsFontPath('[name].[hash:7].[ext]')
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
				exclude: /nxkit_bigint/,
			}),
		],
		splitChunks: {
			// chunks: 'all', //同时分割同步和异步代码,推荐。
			// maxAsyncRequests: 5,  // 异步加载chunk的并发请求数量<=5
			// maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
			// minSize: 30000, // 模块超过30k自动被抽离成公共模块
			// minChunks: 1, // 模块被引用>=1次，便分割
			cacheGroups: {
				vendors: {
					// test: /node_modules/,
					test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
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
				low: {
					test: /webpack\/low/,
					name: "low",
					chunks: "all",
					enforce: true,
					priority: 6,
				},
			}
	 }
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
	module.exports.entry[name] = ['cport-h5/webpack/low', ...devClient, path ];
});