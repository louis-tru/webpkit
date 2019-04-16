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
import error from '../error';

class PrivPage extends Component {

	m_prev = null;
	m_next = null;
	m_status = -1;
	m_panel = null;
	m_timeout = 0;
	m_index: 0;

	constructor(props) {
		super(props);
		this.m_props = props;
		this.m_index = props.index;
		this.m_panel = props.panel;
		this.state = { component: null, };
	}

	async loader() {
		try {
			if (this.props.component) {
				this.setState({ component: this.props.component });
			} else {
				var route = this.props.route;
				var com = (await route.page()).default;
				this.setState({ component: com });
			}
		} catch (e) {
			error.defaultErrorHandle(e);
		}
	}

	get status() {
		return this.m_status;
	}

	get url() {
		return this.props.url;
	}

	get index() {
		return this.m_index;
	}

	componentDidMount() {
		this.loader();
	}

	onShow() {
		try {
			if (this.refs.self.onShow) {
				this.refs.self.onShow();
			}
		} catch(err) {
			console.error(err);
		}
	}

	onHide() {
		try {
			if (this.refs.self.onHide) {
				this.refs.self.onHide();
			}	
		} catch(err) {
			console.error(err);
		}
	}

	unmount() {
		this.setState({ component: null });
		this.m_panel.parentNode.removeChild(this.m_panel);
	}

	replace(props) {
		this.props = this.m_props = { ...props, index: this.m_index, panel: this.m_panel };
		this.loader();
	}

	render() {
		var component = this.state.component;
		if (component) {
			return React.createElement(component, { ...this.m_props, ref: 'self', priv: this });
		} else {
			return (
				<view className="init-loading">
					正在载入数据..
				</view>
			);
		}
	}

	getStyle(styleStr) {
		return `
			width: 100vw;
			min-height: 100vh;
			background: #fff;
			position: absolute;
			z-index: ${this.m_index};
			` + styleStr;
	}

	intoBackground(time) {
		if ( this.m_next == null ) return;
		clearTimeout(this.m_timeout);

		if ( this.m_status != 1 ) {
			if (time) {
				erroruestAnimationFrame(e=>{
					erroruestAnimationFrame(e=>{
						this.m_panel.style.cssText = this.getStyle(`
							display: block;
							transform: translateX(-35vw);
							transition-property: transform;
							transition-duration: ${time}ms;
						`);
						this.m_timeout = setTimeout(e=>{
							this.m_panel.style.transitionProperty = 'none';
							this.m_panel.style.display = 'none';
						}, time + 200);
					});
				});
			} else {
				this.m_panel.style.cssText = this.getStyle(`
					transform: translateX(-50vw);
					transition-property: none;
				`);
			}
		}
		this.m_status = 1;
		this.onHide();
	}

	intoForeground(time) {
		if ( this.m_status == 0 ) return;
		this.m_next = null;

		clearTimeout(this.m_timeout);

		if ( this.m_status == -1 ) {
			if ( time && this.m_prev ) {
				this.m_panel.style.cssText = this.getStyle(`
					display: block;
					transform: translateX(100vw);
				`);
				erroruestAnimationFrame(e=>{
					erroruestAnimationFrame(e=>{
						this.m_panel.style.cssText = this.getStyle(`
							transform: translateX(0);
							transition-property: transform;
							transition-duration: ${time}ms;
							box-shadow: -1px 0 2px #aaa;
						`);
						this.m_timeout = setTimeout(e=>{
							this.m_panel.style.transitionProperty = 'none';
							this.m_panel.style.boxshadow = 'none';
							this.m_panel.style.transform = 'none';
							this.m_panel.style.boxShadow = 'none';
							// this.m_panel.style.zIndex = -1; // 该死的ios9.0bug,不加这个属性，排行页面不显示。
						}, time + 200);
					});
				});
			} else {
				this.m_panel.style.cssText = this.getStyle(`
					transform: translateX(0); 
					display: block; 
					transition-property: none;
					border-left: none;
				`);
			}
			this.m_status = 0;
		} 
		else if ( this.m_status == 1 ) {
			if ( time ) {
				this.m_panel.style.cssText = this.getStyle(`
					display: block;
					transform: translateX(-35vw);
				`);
				erroruestAnimationFrame(e=>{
					erroruestAnimationFrame(e=>{
						this.m_panel.style.cssText = this.getStyle(`
							display: block;
							transform: translateX(0);
							transition-property: transform;
							transition-duration: ${time}ms;
							border-left: none;
						`);
						this.m_timeout = setTimeout(e=>{
							this.m_panel.style.transitionProperty = 'none';
							this.m_panel.style.transform = 'none';
						}, time + 200);
					});
				});
			} else {
				this.m_panel.style.cssText = this.getStyle(`
					transform: none; 
					display: block; 
					transition-property: none;
					border-left: none;
				`);
			}
			this.m_status = 0;
			this.onShow();
		}
	}

	intoLeave(time) { 
		if ( this.m_status == 0 ) {
			clearTimeout(this.m_timeout);
			if ( time ) {
				this.m_panel.style.cssText = this.getStyle(`
					display: block;
					transform: translateX(100vw);
					transition-property: transform;
					transition-duration: ${time}ms;
					box-shadow: -1px 0 2px #aaa;
				`);
				this.m_timeout = setTimeout(e=>{
					this.unmount();
				}, time + 200);
				this.m_status = -1;
				return;
			}
		}
		this.m_status = -1;
		this.unmount();
	}
}

export class Nav extends Component {

	m_pages = [];
	m_current = null;
	m_routes = {};
	m_animating = false;

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		var routes = this.props.routes;
		routes.forEach(e=>{
			this.m_routes[e.path] = e;
		});
		this.push(this.props.initUrl);
	}

	get length() {
		return this.m_pages.length;
	}

	getPage(index) {
		return this.m_pages[index].refs.self;
	}

	get routes() {
		return this.m_routes;
	}

	m_parseProps(url) {
		url = url[0] != '/' ? '/' + url : url;

		var params = {};
		var pathname = url;
		var index = url.indexOf('?');

		if (index != -1) {
			url.substr(index + 1).split('&').forEach(e=>{
				if (e) {
					var ls = e.split('=');
					params[ls[0]] = ls[1] || '';
				}
			});
			pathname = url.substring(0, index);
		}

		var route = this.m_routes[pathname];
		var props = { 
			nav: this, url: url, pathname: pathname, params: params, route: route,
		};

		if (!route) {
			if (this.props.notFound) {
				props.component = this.props.notFound;
			} else {
				throw new Error(`Not found ${url}`);
			}
		}
		return props;
	}

	push(url, animate) {

		if (this.m_animating) return;

		var props = this.m_parseProps(url);
		var panel = document.createElement('div');
		this.refs.root.appendChild(panel);

		var prev = this.m_current;
		var page = ReactDom.render(
			<PrivPage {...props} index={this.length} panel={panel} />, panel
		);

		this.m_current = page;
		this.m_pages.push(page);

		page.m_prev = prev;

		if (prev) {
			prev.m_next = page;
		}

		animate = animate ? 400: 0;

		if (animate) {
			this.m_animating = true;
			setTimeout(e=>this.m_animating = false, animate);
		}

		if (prev) {
			prev.intoBackground(animate);
		}
		page.intoForeground(animate);

		if (this.props.onNav) {
			this.props.onNav({ type: 'push', url: props.url, count: 1 });
		}
	}

	pops(index, animate) {

		if (this.m_animating) return;

		if (this.length == 1 && index <= -1) {
			if (this.props.onEnd) {
				this.props.onEnd();
			}
			return;
		}

		index = Math.max(0, index);

		if (index >= this.length - 1) return;

		var page = this.m_pages[index];
		var arr = this.m_pages.splice(index + 1);
		var next = arr.pop();

		arr.forEach(function (page) {
			page.intoLeave(0);
		});

		this.m_current = page;

		animate = animate ? 400: 0;

		if (animate) {
			this.m_animating = true;
			setTimeout(e=>this.m_animating = false, animate);
		}

		page.m_next = null;
		next.m_prev = null;

		page.intoForeground(animate);
		next.intoLeave(animate);

		if (this.props.onNav) {
			this.props.onNav({ type: 'pop', url: page.url, count: arr.length + 1 });
		}
	}

	pop(animate) {
		this.pops(this.length - 2, animate);
	}

	replace(url) {
		var props = this.m_parseProps(url);
		if (this.m_current) {
			this.m_current.replace(props);
			if (this.props.onNav) {
				this.props.onNav({ type: 'replace', url: props.url, count: 0 });
			}
		}
	}
	
	get current() {
		return this.m_current.refs.self;
	}

	render() {
		return (
			<view className="root" ref="root">
			</view>
		);
	}

}

export class NavPage extends Component {

	get nav() {
		return this.props.nav;
	}

	get url() {
		return this.props.url;
	}

	get pathname() {
		return this.props.pathname;
	}

	get index() {
		return this.props.index;
	}

	get params() {
		return this.props.params;
	}

	componentDidMount() {
		this.onLoad();
		if (this.props.priv.status == 0) {
			this.onShow();
		}
	}

	componentWillUnmount() {
		if (this.props.priv.status == -1) {
			this.onHide();
		}
		this.onUnload();
	}

	onLoad() {
		// overwrite
	}

	onUnload() {
		// overwrite
	}

	onShow() {
		// overwrite
	}

	onHide() {
		// overwrite
	}
	
	pushPage(url, animate) {
		this.nav.push(url, animate);
	}

	popPage(animate) {
		this.nav.pop(animate);
	}

	replacePage(url) {
		this.nav.replace(url);
	}

}
