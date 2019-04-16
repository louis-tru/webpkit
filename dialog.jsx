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

import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './utils.css';
import './dialog.css';

class Dialog extends Component {

	constructor(props) {
		super(props);
		this.state = { opacity: 0 };
	}

	componentDidMount() {
		setTimeout(e=>{
			this.setState({ opacity: 1 });
			if (this.refs.prompt) {
				var props = this.props;
				this.refs.prompt.value = typeof props.prompt=='string'? props.prompt : '';
			}
		}, 50);
	}

	m_handleClick_1(cb, e) {
		this.setState({ opacity: 0 });
		setTimeout(e=>{
			cb(this);
			document.body.removeChild(this.refs.root.parentNode);
		}, 500);
	}

	m_handleChange_1 = e=>{

	}

	render() {

		var props = this.props;
		var buttons = props.buttons || {};

		return (
			<view ref="root" className="dialog" style={{opacity: this.state.opacity}}>
				<view className="core">
					<view className="a">{props.title/*||'温馨提示'*/}</view>
					<view className="b">{
						props.prompt ? [
							<div key={1}>{props.text}</div>,
							<input key={2} 
								ref="prompt" 
								style={{
									border: 'solid 0.015rem #ccc',
									width: '90%',
									marginTop: '0.1rem',
									height: '0.5rem',
								}}
								onChange={this.m_handleChange_1}
							/>
						] : props.text
					}</view>
					<view className="btns">
					{
						(e=>{
							var r = [];
							for (var i in buttons) {
								var t = i[0] == '@' ? i.substr(1) : i;
								var cls = i[0] == '@' ? 'ok':'';
								r.push(<view key={i} className={cls} 
									onClick={this.m_handleClick_1.bind(this, buttons[i])}>{t}</view>);
							}
							return r;
						})()
					}
					</view>
				</view>
			</view>
		);
	}

	static show(title, text, buttons, prompt) {
		var div = document.createElement('div');
		document.body.appendChild(div);
		ReactDom.render(
			<Dialog 
				title={title} 
				buttons={buttons}
				text={text}
				prompt={prompt}
			/>, div);
	}

}

export function alert(text, cb) {
	cb = cb || function() {}
	var o = typeof text == 'string' ? { text: text, title: '' }: text;
	var { text, title } = o;
	Dialog.show(title, text, {
		'确定': e=>{ cb() },
	});
}

export function confirm(text, cb) {
	cb = cb || function() {};
	var o = typeof text == 'string' ? { text: text, title: '' } : text;
	var { text, title } = o;
	Dialog.show(title, text, {
		'取消': e=>cb(false),
		'@确定': e=>cb(true),
	});
}

export function prompt(text, cb) {
	cb = cb || function() {}
	var o = typeof text == 'string' ? { text: text, title: '' }: text;
	var { text, title } = o;
	Dialog.show(title, text, {
		'取消': e=> cb(e.refs.prompt.value, false),
		'@确定': e=> cb(e.refs.prompt.value, true),
	}, true);
}
