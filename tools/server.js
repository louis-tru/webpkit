
const config = require('./cfg');
const path = require('path');

// these devServer options should be customized in /config/index.js
module.exports = {
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
	host: config.dev.host,
	port: config.dev.port,
	open: config.dev.autoOpenBrowser,
	overlay: config.dev.errorOverlay ? { warnings: false, errors: true }: false,
	publicPath: path.posix.join('/', config.virtualPath),
	proxy: config.dev.proxyTable,
	quiet: true, // necessary for FriendlyErrorsPlugin
	watchOptions: { poll: config.dev.poll, },
}