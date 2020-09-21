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

var win = window;
var doc = win.document;
var docEl = doc.documentElement;
var dpr = window.devicePixelRatio || 1;
var atomPixel = 1;
var rootFontSize = 0;
var scale = 0

doc.addEventListener("touchstart", function(){}, true);

var _unlock: (()=>void) | null = null;

var tid: any;

function resize() {
	clearTimeout(tid);
	tid = setTimeout(refreshRem, 300);
}

function pageshow(e: any) {
	if (e.persisted) {
		clearTimeout(tid);
		tid = setTimeout(refreshRem, 300);
	}
}

export function refreshRem() {
	if (!_unlock) return;

	var width = docEl.getBoundingClientRect().width;
	if (width / dpr > 980) {
		width = 980 * dpr;
	}
	rootFontSize = width / scale;
	docEl.style.fontSize = rootFontSize + 'px';
	atomPixel = width / (scale * 100);
}

export function lock(_scale?: number) {
	scale = _scale || 7.5;

	if (!_unlock) {
		win.addEventListener('resize', resize, false);
		win.addEventListener('pageshow', pageshow, false);
		doc.addEventListener('DOMContentLoaded', refreshRem, false);

		_unlock = ()=>{
			win.removeEventListener('resize', resize, false);
			win.removeEventListener('pageshow', pageshow, false);
			doc.removeEventListener('DOMContentLoaded', refreshRem, false);
			docEl.style.fontSize = 'initial';
			_unlock = null;
			atomPixel = 1;
			rootFontSize = 0;
		};
	}

	refreshRem();
}

export function unlock() {
	if (_unlock)
		_unlock();
}

export default {
	get atomPixel() { return atomPixel },
	get rootFontSize() { return rootFontSize },
	refreshRem,
	initialize: function(_scale?: number) {
		lock(_scale);
	},
}