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
import { Component } from 'react';
import * as React from 'react';
import * as ReactDom from 'react-dom';

export interface Options {
	title?: string,
	text?: string,
	buttons?: Dict<(e:any)=>void>,
	prompt?: {
		type?: string;
		value?: string;
		input?: InputConstructor;
	},
	nomask?: boolean,
}

export class Dialog extends Component<Options, {
	opacity: number;
	nomask: boolean
}> {

	constructor(props: any) {
		super(props);
		this.state = { opacity: 0, nomask: props.nomask };
	}

	componentDidMount() {
		setTimeout(e=>{
			this.setState({ opacity: 1 });
			if (this.refs.prompt) {
				var props = this.props;
				var input = this.refs.prompt as HTMLInputElement;
				input.value = typeof props.prompt=='string'? props.prompt : '';
			}
		}, 50);
	}

	m_handleClick_1(cb: (s:any)=>void) {
		this.setState({ opacity: 0 });
		setTimeout(()=>{
			var root = this.refs.root;
			if (root) {
				cb(this);
				var div = (this.refs.root as HTMLDivElement).parentNode as HTMLDivElement;
				ReactDom.unmountComponentAtNode(div);
				document.body.removeChild(div);
			}
		}, 500);
	}

	m_handleChange_1 = ()=>{
	}

	render() {
		var props = this.props;
		var buttons = props.buttons || {};
		var {nomask,opacity} = this.state
		var style: Dict = { opacity };

		if (nomask) {
			style.background = 'none';
		}

		return (
			<div ref="root" className="dialog" style={style}>
				<div className="core">
					<div className="a" dangerouslySetInnerHTML={{ __html: props.title || ''/*||'温馨提示'*/ }}></div>
					{
						props.prompt ?
						<div className="b">
							<div>{props.text}</div>
							{	(()=>{
								var Input = props.prompt.input;
								var type = props.prompt.type || 'text';
								var inputProps = {
									ref: 'prompt',
									style: {
										border: 'solid 0.015rem #ccc',
										width: '90%',
										marginTop: '0.1rem',
										height: '0.5rem',
										padding: '0 2px',
									} as React.CSSProperties,
								}
								return (
									Input ? 
									<Input {...inputProps} value={props.prompt.value} />: 
									<input {...inputProps} defaultValue={props.prompt.value} type={type} />
								);
							})()}
						</div>:
						<div className="b" dangerouslySetInnerHTML={{ __html: props.text || ''}}></div>
					}
					<div className="btns">
					{
						(()=>{
							var r = [];
							for (var i in buttons) {
								var t = i[0] == '@' ? i.substr(1) : i;
								var cls = i[0] == '@' ? 'ok':'';
								r.push(<div key={i} className={cls} 
									onClick={this.m_handleClick_1.bind(this, buttons[i])}>{t}</div>);
							}
							return r;
						})()
					}
					</div>
				</div>
			</div>
		);
	}

	static show({title, text, buttons, prompt, nomask }: Options) {
		var div = document.createElement('div');
		document.body.appendChild(div);
		return ReactDom.render<Options, Dialog>(
			<Dialog 
				title={title} 
				buttons={buttons}
				text={text}
				prompt={prompt}
				nomask={nomask}
			/>, div);
	}
}

export function show(opts: Options) {
	return Dialog.show(opts);
}

export type DialogIn = string | {
	text?: string;
	title?: string;
}

export function alert(In: DialogIn, cb?: ()=>void) {
	var _cb = cb || function() {}
	var o = typeof In == 'string' ? { text: In, title: '' }: In;
	var { text, title } = o;
	return Dialog.show({
		title, text, buttons: {
		'确定': e=>{ _cb() },
	}});
}

export function confirm(In: DialogIn, cb?: (ok: boolean)=>void) {
	var _cb = cb || function() {};
	var o = typeof In == 'string' ? { text: In, title: '' } : In;
	var { text, title } = o;
	return Dialog.show({title, text, buttons: {
		'取消': e=>_cb(false),
		'@确定': e=>_cb(true),
	}});
}

export interface InputProps {
	onChange?: ()=>void;
	onDone?: ()=>void;
	value?: string;
	className?: string;
	style?: Dict;
	type?: string;
}

export interface InputConstructor {
	new(props: InputProps): Component<InputProps>;
}

export type PromptIn = string | {
	text?: string;
	title?: string;
	value?: string;
	type?: string;
	input?: InputConstructor;
}

export function prompt(In: PromptIn, cb?: (value: string, ok: boolean)=>void) {
	var _cb = cb || function() {}
	var o = typeof In == 'string' ? { text: In, title: '', value: '', type: 'text' }: In;
	var { text, title, value, type, input } = o;
	return Dialog.show({title, text, buttons: {
		'取消': e=> _cb(e.refs.prompt.value, false),
		'@确定': e=> _cb(e.refs.prompt.value, true),
	}, prompt: {value, type, input}});
}