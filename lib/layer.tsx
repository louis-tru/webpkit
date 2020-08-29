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

import './layer.css';
import utils from 'somes';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ViewController } from './ctr';
import {EventNoticer,Event} from 'somes/event';
import {getDefaultId, Options } from './dialog';
import {Activity} from '../isolate/ctr';

export class LayerGroup {
	private _IDs: Map<string, Layer> = new Map();
	private _panel: HTMLElement;

	constructor(panel: HTMLElement = document.body) {
		utils.assert(panel, 'Panel cannot be empty');
		this._panel = panel;
	}

	get preventCover() {
		for (var [,l] of this._IDs) {
			if (l.preventCover)
				return true;
		}
		return false;
	}

	async show(D: typeof Layer, opts?: Options, animate = true, delay = 0, act?: Activity) {
		var id = opts?.id ? String(opts.id): getDefaultId(D);
		utils.assert(!this._IDs.has(id), `Dialog already exists, "${id}"`);

		var div = document.createElement('div');

		this._panel.appendChild(div);

		var instance = await new Promise<Layer>(r=>
			ReactDom.render(<D {...opts} __activity={act} __panel={div} />, div, function(this: any) { r(this) })
		);

		instance.onClose.on(()=>this._IDs.delete(id));

		this._IDs.set(id, instance);

		instance.show(animate, delay);

		return instance;
	}

	close(id: typeof Layer | string, animate = true) {
		var _id: string = typeof id == 'string' ? String(id): getDefaultId(id);
		// utils.assert(this._IDs.has(_id), `Dialog no exists, "${id}"`);
		var l = this._IDs.get(_id);
		if (l) {
			l.close(animate);
		} else {
			console.warn(`Layer no exists, "${id}"`);
		}
	}

	closeAll() {
		for (var [,b] of this._IDs) {
			b.close();
		}
	}
}

var _globaLayerGroup: LayerGroup | null;

export abstract class Layer<P = {}, S = {}> extends ViewController<P, S> {
	
	fullScreen = true;

	readonly onClose = new EventNoticer<Event<any, Layer>>('Close', this);

	private __show = false;
	private __close = false;
	private __activity?: Activity = (this.props as any).__activity;
	private __panel?: HTMLDivElement = (this.props as any).__panel;

	get preventCover() {
		return this.fullScreen;
	}

	get activity() {
		return this.__activity;
	}

	render() {
		return this.__show ? (
			<div className={'layer' + (this.fullScreen?' fullScreen': '')} ref="root">
				{this.renderBody()}
			</div>
		): null;
	}

	private async _enableAnimate(animate: boolean) {
		if (!this.refs.root) return;
		if (animate) {
			(this.refs.root as HTMLElement).style.transitionDuration = '300ms';
		} else {
			(this.refs.root as HTMLElement).style.transitionDuration = '0ms';
		}
		(this.refs.root as HTMLElement).style.display = 'block';
		await utils.sleep(30);
	}

	private async _hide(animate: boolean) {
		await this._enableAnimate(animate);
		if (!this.refs.root) return;
		(this.refs.root as HTMLElement).style.opacity = '0';
		await utils.sleep(300);
	}

	async show(animate = true, delay = 0) {
		if (delay) await utils.sleep(delay);
		if (this.__close) return;
		this.__show = true;
		this.forceUpdate(async ()=>{
			if (!this.__close) {
				await this._enableAnimate(animate);
				(this.refs.root as HTMLElement).style.opacity = '1';
				await utils.sleep(300);
			}
		});
	}

	async close(animate = true) {
		if (!this.__close) {
			this.__close = true;
			this.onClose.trigger({animate});
			await this._hide(animate);
		}
		if (this.__panel) {
			ReactDom.unmountComponentAtNode(this.__panel);
			(this.__panel.parentNode as HTMLElement).removeChild(this.__panel);
			this.__panel = undefined;
		}
	}

	protected abstract renderBody(): React.ReactNode;

	static get globaLayerGroup() {
		if (!_globaLayerGroup) {
			_globaLayerGroup = new LayerGroup();
		}
		return _globaLayerGroup;
	}

}
