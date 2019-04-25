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

global.__resourceQuery = '?https://52block.net/test_wx'

const path = require('path');
const utils = require('./utils');
const config = require('./config');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProd =
	process.env.NODE_ENV === 'production' ||
	process.env.NODE_ENV === 'prod';
const sourceMapEnabled = isProd
	? config.build.productionSourceMap
	: config.dev.cssSourceMap;

const HOST = config.dev.host;
const PORT = config.dev.port;
const ENV = { NODE_ENV: isProd ? '"production"': '"development"' };
const name = config.productName;

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
	new UglifyJsPlugin({
		uglifyOptions: {
			compress: { warnings: false },
		},
		sourceMap: config.build.productionSourceMap,
		parallel: true,
	}),
	// extract css into its own file
	new ExtractTextPlugin({
		filename: utils.assetsPath('[name].[contenthash].css'),
		// Setting the following option to `false` will not extract CSS from codesplit chunks.
		// Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
		// It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
		// increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
		allChunks: true,
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
	
	// split vendor js into its own file
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		minChunks (module) {
			// any required modules inside node_modules are extracted to vendor
			return (
				module.resource &&
				/\.js$/.test(module.resource) &&
				module.resource.indexOf( utils.resolve('node_modules') ) === 0
			)
		}
	}),
	// extract webpack runtime and module manifest to its own file in order to
	// prevent vendor hash from being updated whenever app bundle is updated
	new webpack.optimize.CommonsChunkPlugin({
		name: 'manifest',
		minChunks: Infinity
	}),
	// This instance extracts shared chunks from code splitted chunks and bundles them
	// in a separate chunk, similar to the vendor chunk
	// see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
	new webpack.optimize.CommonsChunkPlugin({
		name: 'app',
		async: 'vendor-async',
		children: true,
		minChunks: 3,
	}),
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
	new HtmlWebpackPlugin({
		filename: name == 'app' ? 'index.html': name + '.html',
		template: name + '/index.html',
		inject: true,
	}),
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

module.exports = {
	externals: require('./externals'),
	context: utils.resolve('.'),
	entry:{
		[name]: [ ...devClient, `./${name}/index` ],
	},
	output: {
		path: config.output, // build output dir
		filename: isProd ? utils.assetsPath('[name].min.js?[chunkhash]'): '[name].js',
			...(isProd ? {
		chunkFilename: utils.assetsPath('[chunkhash].js') }: {}),
		publicPath: '',
	},
	resolve: {
		extensions: ['.js', '.vue', '.json', '.jsx', '.css'],
		alias: {
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
				loader: 'babel-loader',
				include: [utils.resolve('.'), path.join(__dirname, '..')],
				exclude: /node_modules/,
				options: {
					babelrc: __dirname + '/../.babelrc',
				},
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
					name: utils.assetsPath('[name].[hash:7].[ext]')
				}
			},
			...utils.styleLoaders({ sourceMap: sourceMapEnabled, usePostCSS: true, extract: isProd, }),
		],
	},
	plugins: plugins,
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
		// historyApiFallback: {
		// 	rewrites: [
		// 		{ from: /.*/, to: path.posix.join(config.assetsPublicPath, 'index.html') },
		// 	],
		// },
		// contentBase: fasle, // since we use CopyWebpackPlugin.
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
