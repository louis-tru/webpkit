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

// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const fs = require('fs');
const path = require('path');
const devinline = process.env.DEV_INLINE == 'false' ? false: true;
const productName = process.env.PRODUCT_NAME || readPackageJson().name || 'app';
const prot = Number(process.env.PORT) || 8080;
const sourceMap = process.env.MAP === 'true' ? true: false;
const isMinimizer = process.env.MINIM === 'false' ? false: true;
const limit = Number(process.env.LIMIT) || 10240;
const osmosis = process.env.OSMOSIS === 'true' ? true: false;
const babelTS = process.env.BABEL_TS === 'true' ? true: false;
const source = path.resolve(process.env.ROOT_DIR || process.cwd());

const NODE_ENV = 
	process.env.NODE_ENV == 'prod' ? 'production': 
	process.env.NODE_ENV == 'dev' ? 'development': process.env.NODE_ENV || 'development';

const isProd = NODE_ENV == 'production';

try {
	var publicPath = process.env.PUBLIC_PATH || '';
	if (!publicPath) {
		publicPath = require(source + '/config').publicPath || '';
	}
} catch(err) {}

const virtualPath = process.env.VIRTUAL || '';
	// (publicPath && !/^https?:\/\//i.test(publicPath)) ? publicPath: '';
const output = path.resolve(process.env.OUTPUT ||  'out/public', virtualPath);

var staticAssets = [];

if (fs.existsSync(source + '/.static')) {
	staticAssets = fs.readFileSync(source + '/.static', 'utf8')
		.split('\n').map(e=>e.trim()).filter(e=>e);
}

function readPackageJson() {
	try {
		return require(`${process.cwd()}/package.json`);
	} catch(err) {}
	return {};
}

module.exports = {
	productName: productName,
	source: source,
	output: output,
	virtualPath: virtualPath,
	staticAssets: staticAssets,
	publicPath: publicPath,
	isMinimizer: isMinimizer,
	isProd: isProd,
	NODE_ENV: NODE_ENV,
	limit: limit,
	babelTS: babelTS,
	configOsmosis: osmosis, // 文件 module-id 间接受/config.js内容影响（config渗透），一般情况下不需要开启，
	env: {
		NODE_ENV: `"${NODE_ENV}"`,
	},

	/**
	 * Source Maps
	 */
	sourceMap: sourceMap,

	dev: {
		inline: devinline,

		hotOnly: false,
		hot: true,

		proxyTable: {},
		
		// Various Dev Server settings
		host: '0.0.0.0', // can be overwritten by process.env.HOST
		port: prot, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
		autoOpenBrowser: false,
		errorOverlay: true,
		notifyOnErrors: true,
		poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

		/**
		 * Source Maps
		 */

		// https://webpack.js.org/configuration/devtool/#development
		// devtool: 'cheap-module-eval-source-map',
		// devtool: 'module-eval-source-map',
		devtool: "source-map",

		// If you have problems debugging vue-files in devtools,
		// set this to false - it *may* help
		// https://vue-loader.vuejs.org/en/options.html#cachebusting
		cacheBusting: true,

	},

	build: {

		// https://webpack.js.org/configuration/devtool/#production
		devtool: '#source-map',

		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	}
};
