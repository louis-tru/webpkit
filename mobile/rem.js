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

(function(){

	var win = window;
	var document = win.document;
	var docEl = document.documentElement;
	var dpr = window.devicePixelRatio || 1;
	var is_initialize = 0;
	var atomPixel = 1;
	var rootFontSize = 12;

	document.addEventListener("touchstart", function(){}, true);

	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;
		if (width / dpr > 980) {
			width = 980 * dpr;
		}
		var rem = width / 7.5;
		
		docEl.style.fontSize = rem + 'px';

		rootFontSize = rem;
		
		atomPixel = width / 750;

		// if (doc.body && window.orientation == 0) {
		// 	var _rem = rem;
		// 	var html_width = width;
		// 	var body_width = doc.body.getBoundingClientRect().width;

		// 	if (html_width != body_width) { // 系统字体放大
		// 		_rem = rem * (html_width / body_width);
		// 		docEl.style.fontSize = _rem + 'px';
		// 	}
		// }
	}

	function initialize() {

		if (is_initialize) return;
		is_initialize = 1;

		var tid;
		win.addEventListener('resize', function() {
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 300);
		}, false);

		win.addEventListener('pageshow', function(e) {
			if (e.persisted) {
				clearTimeout(tid);
				tid = setTimeout(refreshRem, 300);
			}
		}, false);

		document.addEventListener('DOMContentLoaded', refreshRem, false);

		refreshRem();
	}

	if (typeof module == 'object') {
		module.exports = {
			get atomPixel() { return atomPixel },
			get rootFontSize() { return rootFontSize },
			refreshRem,
			initialize,
		};
	} else {
		initialize();
	}

})();
