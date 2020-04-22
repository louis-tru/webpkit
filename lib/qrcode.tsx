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

import * as _qrcode from './_qrcode';
import {ViewController,React} from './ctr';

exports.QRCode = _qrcode.default;

export interface Options {
	width?: number;
	height?: number;
	typeNumber?: number;
	colorDark?: string;
	colorLight?: string;
	correctLevel?: number;
	text?: string;
}

export declare class QRCode {
	constructor(el: string | HTMLElement, opts?: Options);
	makeCode(sText: string): void;
	makeImage(): void;
	clear(): void;
	static CorrectLevel: {
		L: number;
		M: number;
		Q: number;
		H: number;
	};
}

export default class extends ViewController<Options & { 
	className?: string;
	style?: React.CSSProperties;
	logoSrc?: string;
}> {

	private _qr?: QRCode;

	private get opts() {
		return {
			width: 256,
			height: 256,
			typeNumber: 4,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: (_qrcode.default as typeof QRCode).CorrectLevel.H,
			...this.props,
		};
	}

	triggerMounted() {
		this._qr = new _qrcode.default(this.refs.dom as HTMLElement, this.opts);
	}

	triggerUpdate() {
		(this._qr as QRCode).makeCode(this.props.text || '');
	}

	triggerRemove() {
		(this._qr as QRCode).clear();
	}

	render() {
		return (
			<div className={this.props.className} style={this.props} ref="dom"></div>
		);
	}
}
