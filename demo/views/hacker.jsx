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

var path = require('nxkit/path')

var ocav = document.getElementById("cav");
var ctx = ocav.getContext("2d");
var W = window.innerWidth;
var H = window.innerHeight;
ocav.width = W;
ocav.height = H;
var fontsize = 16;
var columns = Math.ceil(W / fontsize);
var drops = [];
var texts = "0123456789ABCDEFHIJKMLNOPQRSTUVWXYZ".split("");

for (var i = 0; i < columns; i++) {
	drops[i] = 0;
}

var color = "#0ff";
if (path.getParam('color')) {
	color = '#' + path.getParam('color');
}

function run() {
	ctx.fillStyle = "rgba(0,0,0,0.05)";
	ctx.fillRect(0, 0, W, H);
	ctx.fillStyle = color;
	ctx.font = fontsize + "px Arial";
	for (var i = 0; i < columns; i++) {
		var text = texts[Math.floor(Math.random() * texts.length)];
		ctx.fillText(text, i * fontsize, drops[i] * fontsize);
		if (drops[i] * fontsize > H || Math.random() > 0.95) {
			drops[i] = 0;
		}
		drops[i]++;
	}
}
setInterval(run, 30);


class Test {
	a() {
		console.log('test')
	}
}

export default Test;