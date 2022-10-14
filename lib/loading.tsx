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

import { React } from '.';
import { Layer } from './layer';

import './util.css';

export default class Loading extends Layer<{text?: string}> {

	_id: any;
	_load = 0;
	_text = '';

	triggerLoad() {
		this._id = setInterval(()=>this.updateText(), 1e3);
		// return super.triggerLoad();
	}

	triggerRemove() {
		clearInterval(this._id);
		// super.triggerRemove();
	}

	updateText() {
		this._load = this._load >= 3 ? 0: this._load + 1;
		this._text = Array.from({ length: this._load + 1 }).join('.');
		this.forceUpdate();
	}

	renderBody() {
		var text = this.props.text || 'Loading';
		return (
			<div ref="root" className="g_loading">
				{/* <Icon type="loading" size="lg" /> */}
				<div className="text">{text}<span>{this._text}</span></div>
			</div>
		);
	}

	static show(text = 'Loading..', id?: any) {
		return Loading.globaLayerGroup.show(this, { text, id }, true, 200);
	}

	static close(id?: any) {
		Loading.globaLayerGroup.close(id || this);
	}

}