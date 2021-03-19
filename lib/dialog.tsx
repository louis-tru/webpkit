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

import './util.css';
import './dialog.css';
import utils from 'somes';
import { ViewController } from './ctr';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {EventNoticer,Event} from 'somes/event';
import {List,ListItem} from 'somes/event';
import {Activity} from '../isolate/ctr';
import {InputProps,Input} from './keyboard';

var DEFAULT_SCALE = 1;

export function getDefaultId(obj: any) {
	utils.assert(obj);
	if (!(obj as any).hasOwnProperty('__default_id')) {
		(obj as any).__default_id = String(utils.getId());
	}
	return String((obj as any).__default_id);
}

export interface Options extends Dict {
	id?: string;
}

export class DialogStack {
	private _dialogStack = new List<Dialog>();
	private _IDs: Map<string, ListItem<Dialog>> = new Map();
	private _panel: HTMLElement;

	constructor(panel: HTMLElement = document.body) {
		utils.assert(panel, 'Panel cannot be empty');
		this._panel = panel;
	}

	get preventCover() {
		return this._dialogStack?.last?.value?.preventCover || false;
	}

	async show(D: typeof Dialog, opts?: Options, animate = true, act?: Activity) {
		var id = opts?.id ? String(opts.id): getDefaultId(D);
		utils.assert(!this._IDs.has(id), `Dialog already exists, "${id}"`);

		var div = document.createElement('div');

		this._panel.appendChild(div);

		var instance = await new Promise<Dialog>(r=>
			ReactDom.render(<D {...opts} __activity={act} __panel={div} />, div, function(this: any) { r(this) })
		);

		var prev = this._dialogStack.last;
		if (prev) {
			(prev.value as Dialog).hide();
		}

		var item = this._dialogStack.push(instance);

		instance.onClose.on(({data})=>{
			this._dialogStack.del(item);
			this._IDs.delete(id);
			utils.sleep(200).then(()=>{
				var last = this._dialogStack.last;
				if (last) {
					(last.value as Dialog).show(data.animate);
				}
			});
		});

		this._IDs.set(id, item);

		instance.show(animate);

		return instance;
	}

	close(id: typeof Dialog | string, animate = true) {
		var _id: string = typeof id == 'string' ? String(id): getDefaultId(id);
		// utils.assert(this._IDs.has(_id), `Dialog no exists, "${id}"`);
		var item = this._IDs.get(_id);
		if (item) {
			(item.value as Dialog).close(animate);
		} else {
			console.warn(`Dialog no exists, "${id}"`);
		}
	}

	closeAll() {
		var item = this._dialogStack.first;
		while(item) {
			var next = item.next;
			(item.value as Dialog).close(false);
			item = next;
		}
	}
}

var _globaDialogStack: DialogStack | null;

export abstract class Dialog<P = {}> extends ViewController<P> {

	readonly onClose = new EventNoticer<Event<any, Dialog>>('Close', this);

	private __activity?: Activity = (this.props as any).__activity;
	private __panel?: HTMLDivElement = (this.props as any).__panel;

	get preventCover() {
		return true;
		}

	get activity() {
		return this.__activity;
	}

	private _maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
		if (event.target === this.refs.root) {
			this.triggerMaskClick();
	}
	};

	protected triggerMaskClick() {
	}

	render() {
		var style: Dict = {};
		if (this.noMask) {
			style.background = 'none';
		}
		return (
			<div ref="root" className="dialog" style={style} onClick={this._maskClick}>
				<div className="core" ref="core">
					{this.renderBody()}
				</div>
			</div>
		)
	}

	private async _enableAnimate(animate: boolean) {
		if (!this.refs.root) return;
		if (animate) {
			(this.refs.root as HTMLElement).style.transitionDuration = '300ms';
			(this.refs.core as HTMLElement).style.transitionDuration = '300ms';
		} else {
			(this.refs.root as HTMLElement).style.transitionDuration = '0ms';
			(this.refs.core as HTMLElement).style.transitionDuration = '0ms';
		}
		(this.refs.root as HTMLElement).style.display = 'flex';
		await utils.sleep(30);
	}

	async hide(animate = true) {
		await this._enableAnimate(animate);
		if (!this.refs.root) return;
		if (!this.noMask)
			(this.refs.root as HTMLElement).style.background = 'rgba(0,0,0,0.01)';
		(this.refs.core as HTMLElement).style.opacity = '0';
		(this.refs.core as HTMLElement).style.transform = 'scale(0.3)';
		await utils.sleep(300);
		if (!this.refs.root) return;
		(this.refs.root as HTMLElement).style.display = 'none';
	}

	async show(animate = true) {
		await this._enableAnimate(animate);
		if (!this.refs.root) return;
		if (!this.noMask)
			(this.refs.root as HTMLElement).style.background = 'rgba(0,0,0,0.75)';
		(this.refs.core as HTMLElement).style.opacity = '1';
		(this.refs.core as HTMLElement).style.transform = 'scale(1)';
		await utils.sleep(300);
	}

	async close(animate = true) {
		if (this.refs.root) {
			this.onClose.trigger({animate});
			await this.hide(animate);
		}
		if (this.__panel) {
			ReactDom.unmountComponentAtNode(this.__panel);
			(this.__panel.parentNode as HTMLElement).removeChild(this.__panel);
			this.__panel = undefined;
		}
	}

	get noMask() {
		return false;
	}

	protected abstract renderBody(): React.ReactNode;

	static get globaDialogStack() {
		if (!_globaDialogStack) {
			_globaDialogStack = new DialogStack();
		}
		return _globaDialogStack;
	}
}

export interface DefaultOptions extends Options {
	title?: React.ReactNode,
	text?: React.ReactNode,
	buttons?: Dict<(e:any)=>void>,
	prompt?: {
		type?: string;
		value?: string;
		input?: InputConstructor;
		placeholder?: string;
	},
	noMask?: boolean;
}

export default class DefaultDialog extends Dialog<DefaultOptions> {

	protected triggerMounted() {
		if (this.refs.prompt) {
			var props = this.props;
			var input = this.refs.prompt as HTMLInputElement;
			input.value = typeof props.prompt=='string'? props.prompt : '';
		}
		super.triggerMounted();
	}

	protected _handleClick_1(cb: (s:any)=>void) {
		var root = this.refs.root;
		if (root) {
			cb(this);
			this.close();
		}
	}

	get noMask() {
		return !!this.props.noMask;
	}

	protected renderButtons() {
		var buttons = this.props.buttons || { '@确定': (e)=>{} };
		var r = [];
		for (let i in buttons) {
			var t = i[0] == '@' ? i.substr(1) : i;
			var cls = i[0] == '@' ? 'ok':'';
			r.push(
				<div key={i} className={cls} onClick={()=>this._handleClick_1(buttons[i])}>{t}</div>
			);
		}
		return r;
	}

	protected renderBody() {
		var props = this.props;
		return (
			<div className="default" style={{ transform: `scale(${DefaultDialog.scale})` }}>
				<div className="a">{ props.title || ''/*||'温馨提示'*/ }</div>
				{
					props.prompt ?
					<div className="b">
						<div>{props.text}</div>
						{	(()=>{
							var Input = props.prompt.input;
							var type = props.prompt.type || 'text';
							var placeholder = props.prompt.placeholder || '';
							var inputProps = {
								ref: 'prompt',
								placeholder: placeholder,
								style: {
									border: 'solid 0.015rem #ccc',
									width: '90%',
									marginTop: '0.1rem',
									height: '0.5rem',
									padding: '0 2px',
								} as React.CSSProperties,
							};
							return (
								Input ? 
								<Input {...inputProps} value={props.prompt.value} type={type} initFocus={true} />: 
								<input {...inputProps} defaultValue={props.prompt.value} type={type} />
							);
						})()}
					</div>:
					<div className="b">{props.text || ''}</div>
				}
				<div className="btns">
					{this.renderButtons()}
				</div>
			</div>
		);
	}

	static setScale(scale: number) {
		DEFAULT_SCALE = Math.max(1, Math.min(4, scale));
	}

	static get scale() {
		return DEFAULT_SCALE;
	}

	static show(opts: DefaultOptions, stack?: DialogStack) {
		return (stack || Dialog.globaDialogStack).show(this, Object.assign({ id: utils.getId() }, opts));
	}

	static alert(In: DialogIn, cb?: ()=>void, stack?: DialogStack) {
		var _cb = cb || function() {}
		var o = typeof In == 'string' ? { text: In, title: '', id: '' }: In;
		var { text, title, id } = o;
		return this.show({
			id, title, text, 
			buttons: {
			'@确定': ()=>{ _cb() },
		}}, stack);
	}

	static confirm(In: DialogIn, cb?: (ok: boolean)=>void, stack?: DialogStack) {
		var _cb = cb || function() {};
		var o = typeof In == 'string' ? { text: In, title: '', id: '' } : In;
		var { text, title, id } = o;
		return this.show({ id, title, text, buttons: {
			'取消': ()=>_cb(false),
			'@确定': ()=>_cb(true),
		}}, stack);
	}

	static prompt(In: PromptIn, cb?: (value: string, ok: boolean)=>void, stack?: DialogStack) {
		var _cb = cb || function() {}
		var o = typeof In == 'string' ? { text: In, title: '', value: '', type: 'text', id: '' }: In;
		var { text, title, value, type, input, placeholder, id } = o;
		return this.show({ id, title, text, buttons: {
			'取消': e=> _cb(e.refs.prompt.value, false),
			'@确定': e=> _cb(e.refs.prompt.value, true),
		}, prompt: {value, type, input, placeholder }}, stack);
	}

}

export type DialogIn = string | {
	text?: React.ReactNode;
	title?: React.ReactNode;
	id?: string;
}

export interface InputConstructor {
	new(props: InputProps): Input;
}

export type PromptIn = string | {
	text?: React.ReactNode;
	title?: React.ReactNode;
	value?: string;
	type?: string;
	input?: InputConstructor;
	placeholder?: string;
	id?: string;
}

export function show(opts: DefaultOptions, stack?: DialogStack) {
	return DefaultDialog.show(opts, stack);
}

export function alert(In: DialogIn, cb?: ()=>void, stack?: DialogStack) {
	return DefaultDialog.alert(In, cb, stack);
}

export function confirm(In: DialogIn, cb?: (ok: boolean)=>void, stack?: DialogStack) {
	return DefaultDialog.confirm(In, cb, stack);
}

export function prompt(In: PromptIn, cb?: (value: string, ok: boolean)=>void, stack?: DialogStack) {
	return DefaultDialog.prompt(In, cb, stack);
}
