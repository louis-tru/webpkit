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

var path = require('somes/path').default;
var url = require('url');
var stripAnsi = require('strip-ansi');
var log = require('loglevel').getLogger('webpack-dev-server');
var socket = require('webpack-dev-server/client/socket');
var overlay = require('webpack-dev-server/client/overlay');

var pathname = location.pathname.match(/^\/[^\/]+\//);
var __resourceQuery = '?' + path.resolve('http://0.0.0.0', pathname ? pathname[0] : '', 'sockjs-node');

var urlParts = void 0;
var hotReload = true;
if (typeof window !== 'undefined') {
	var qs = window.location.search.toLowerCase();
	hotReload = qs.indexOf('hotreload=false') === -1;
}

urlParts = url.parse(__resourceQuery.substr(1));

if (!urlParts.port || urlParts.port === '0') {
	urlParts.port = self.location.port;
}

var _hot = false;
var initial = true;
var currentHash = '';
var useWarningOverlay = false;
var useErrorOverlay = false;
var useProgress = false;

var INFO = 'info';
var WARNING = 'warning';
var ERROR = 'error';
var NONE = 'none';

// Set the default log level
log.setDefaultLevel(INFO);

// Send messages to the outside, so plugins can consume it.
function sendMsg(type, data) {
	if (typeof self !== 'undefined' && (typeof WorkerGlobalScope === 'undefined' || !(self instanceof WorkerGlobalScope))) {
		self.postMessage({
			type: 'webpack' + type,
			data: data
		}, '*');
	}
}

var onSocketMsg = {
	hot: function hot() {
		_hot = true;
		log.info('[WDS] Hot Module Replacement enabled.');
	},
	invalid: function invalid() {
		log.info('[WDS] App updated. Recompiling...');
		// fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.
		if (useWarningOverlay || useErrorOverlay) overlay.clear();
		sendMsg('Invalid');
	},
	hash: function hash(_hash) {
		currentHash = _hash;
	},

	'still-ok': function stillOk() {
		log.info('[WDS] Nothing changed.');
		if (useWarningOverlay || useErrorOverlay) overlay.clear();
		sendMsg('StillOk');
	},
	'log-level': function logLevel(level) {
		var hotCtx = require.context('webpack/hot', false, /^\.\/log$/);
		if (hotCtx.keys().indexOf('./log') !== -1) {
			hotCtx('./log').setLogLevel(level);
		}
		switch (level) {
			case INFO:
			case ERROR:
				log.setLevel(level);
				break;
			case WARNING:
				// loglevel's warning name is different from webpack's
				log.setLevel('warn');
				break;
			case NONE:
				log.disableAll();
				break;
			default:
				log.error('[WDS] Unknown clientLogLevel \'' + level + '\'');
		}
	},
	overlay: function overlay(value) {
		if (typeof document !== 'undefined') {
			if (typeof value === 'boolean') {
				useWarningOverlay = false;
				useErrorOverlay = value;
			} else if (value) {
				useWarningOverlay = value.warnings;
				useErrorOverlay = value.errors;
			}
		}
	},
	progress: function progress(_progress) {
		if (typeof document !== 'undefined') {
			useProgress = _progress;
		}
	},

	'progress-update': function progressUpdate(data) {
		if (useProgress) log.info('[WDS] ' + data.percent + '% - ' + data.msg + '.');
	},
	ok: function ok() {
		sendMsg('Ok');
		if (useWarningOverlay || useErrorOverlay) overlay.clear();
		if (initial) return initial = false; // eslint-disable-line no-return-assign
		reloadApp();
	},

	'content-changed': function contentChanged() {
		log.info('[WDS] Content base changed. Reloading...');
		self.location.reload();
	},
	warnings: function warnings(_warnings) {
		log.warn('[WDS] Warnings while compiling.');
		var strippedWarnings = _warnings.map(function (warning) {
			return stripAnsi(warning);
		});
		sendMsg('Warnings', strippedWarnings);
		for (var i = 0; i < strippedWarnings.length; i++) {
			log.warn(strippedWarnings[i]);
		}
		if (useWarningOverlay) overlay.showMessage(_warnings);

		if (initial) return initial = false; // eslint-disable-line no-return-assign
		reloadApp();
	},
	errors: function errors(_errors) {
		log.error('[WDS] Errors while compiling. Reload prevented.');
		var strippedErrors = _errors.map(function (error) {
			return stripAnsi(error);
		});
		sendMsg('Errors', strippedErrors);
		for (var i = 0; i < strippedErrors.length; i++) {
			log.error(strippedErrors[i]);
		}
		if (useErrorOverlay) overlay.showMessage(_errors);
		initial = false;
	},
	error: function error(_error) {
		log.error(_error);
	},
	close: function close() {
		log.error('[WDS] Disconnected!');
		sendMsg('Close');
	}
};

var hostname = urlParts.hostname;
var protocol = urlParts.protocol;

// check ipv4 and ipv6 `all hostname`
if (hostname === '0.0.0.0' || hostname === '::') {
	// why do we need this check?
	// hostname n/a for file protocol (example, when using electron, ionic)
	// see: https://github.com/webpack/webpack-dev-server/pull/384
	// eslint-disable-next-line no-bitwise
	if (self.location.hostname && !!~self.location.protocol.indexOf('http')) {
		hostname = self.location.hostname;
	}
}

// `hostname` can be empty when the script path is relative. In that case, specifying
// a protocol would result in an invalid URL.
// When https is used in the app, secure websockets are always necessary
// because the browser doesn't accept non-secure websockets.
if (hostname && (self.location.protocol === 'https:' || urlParts.hostname === '0.0.0.0')) {
	protocol = self.location.protocol;
}

var socketUrl = url.format({
	protocol: protocol,
	auth: urlParts.auth,
	hostname: hostname,
	port: urlParts.port,
	pathname: urlParts.path == null || urlParts.path === '/' ? '/sockjs-node' : urlParts.path
});

socket(socketUrl, onSocketMsg);

var isUnloading = false;
self.addEventListener('beforeunload', function () {
	isUnloading = true;
});

function reloadApp() {
	if (isUnloading || !hotReload) {
		return;
	}
	if (_hot) {
		log.info('[WDS] App hot update...');
		// eslint-disable-next-line global-require
		var hotEmitter = require('webpack/hot/emitter');
		hotEmitter.emit('webpackHotUpdate', currentHash);
		if (typeof self !== 'undefined' && self.window) {
			// broadcast update to window
			self.postMessage('webpackHotUpdate' + currentHash, '*');
		}
	} else {
		var rootWindow = self;
		// use parent window for reload (in case we're in an iframe with no valid src)
		var intervalId = self.setInterval(function () {
			if (rootWindow.location.protocol !== 'about:') {
				// reload immediately if protocol is valid
				applyReload(rootWindow, intervalId);
			} else {
				rootWindow = rootWindow.parent;
				if (rootWindow.parent === rootWindow) {
					// if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
					applyReload(rootWindow, intervalId);
				}
			}
		});
	}

	function applyReload(rootWindow, intervalId) {
		clearInterval(intervalId);
		log.info('[WDS] App updated. Reloading...');
		rootWindow.location.reload();
	}
}