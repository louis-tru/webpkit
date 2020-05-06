
const utils = require('./utils');
const config = require('./cfg');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin") ;
const ManifestPlugin = require('./manifest').ManifestPlugin;
const views = require('./views');
const path = require('path');

const {NODE_ENV,isProd} = config;
const HOST = config.dev.host;
const PORT = config.dev.port;

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
		to: path.basename(e),
		ignore: ['.*', '*.mp4', '*.mp3'],
	}))),
	// generate dist index.html with correct asset hash for caching.
	// you can customize output by editing /index.html
	// see https://github.com/ampedandwired/html-webpack-plugin
	
	...views.map(({name,html})=>
		new HtmlWebpackPlugin({
			filename: name + '.html',
			template: html,
			inject: true,
			chunks: ['runtime', 'low', 'vendors', name],
		}),
	),
	...(isProd ? prod_plugins: develop_plugins),
];

module.exports = plugins;