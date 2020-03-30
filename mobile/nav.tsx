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

import nxkit from 'nxkit';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import GlobalState from '../state';
import error from '../error';

class PrivPage extends Component {

	m_prev = null;
	m_next = null;
	m_status = -1;
	m_panel = null;
	m_timeout = 0;
	m_index = 0;

	constructor(props) {
		super(props);
		this.m_props = props;
		this.m_index = props.index;
		this.m_panel = props.panel;
		this.state = { component: null, };
		this._count = 0;
	}

	async loader() {
		try {
			if (this.props.component) {
				this.setState({ component: this.props.component });
			} else {
				var route = this.props.route;
				this._count++;
				var com = (await route.page()).default;
				if (this.state.component === com) {
					this.setState({ component: null });
				}
				this.setState({ component: com, load_count: this._count });
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

	onShow(data = {}) {
		try {
			if (this.refs.self.onShow) {
				this.refs.self.onShow(data);
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
		this.m_props = { ...props, index: this.m_index, panel: this.m_panel };
		this.props = this.m_props;
		this.loader();
	}

	render() {
		var Com = this.state.component;
		if (Com) {
			var props = {
				...this.m_props,
				ref: 'self',
				priv: this,
			};
			return (
				<Com {...props} />
			);
		} else {
			return (
				<div className="init-loading">
					正在载入数据..
				</div>
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
				requestAnimationFrame(e=>{
					requestAnimationFrame(e=>{
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

	intoForeground(time, data = {}) {
		if ( this.m_status == 0 ) return;
		this.m_next = null;

		clearTimeout(this.m_timeout);

		if ( this.m_status == -1 ) {
			if ( time && this.m_prev ) {
				this.m_panel.style.cssText = this.getStyle(`
					display: block;
					transform: translateX(100vw);
				`);
				requestAnimationFrame(e=>{
					requestAnimationFrame(e=>{
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
				requestAnimationFrame(e=>{
					requestAnimationFrame(e=>{
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
			this.onShow(data);
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
		this.push(this.props.initUrl, 0);
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

	m_parseProps(args) {
		if (typeof args == 'string') {
			args = {url:args};
		}
		var { url, params = {} } = args;

		url = url[0] != '/' ? '/' + url : url;

		// var search = {};
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
			nav: this,
			url: url,
			pathname: pathname,
			params: params, //Object.assign(search, params),
			route: route,
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

	m_push(url, animate, index, cb) {

		if (this.m_animating && animate) return false;

		var props = this.m_parseProps(url);
		var panel = document.createElement('div');
		this.refs.root.appendChild(panel);

		var self = this;
		var prev = this.m_current;
		var el = <PrivPage {...props} index={index} panel={panel} />;

		ReactDom.render(el, panel, function() {
			var page = this;

			self.m_current = page;
			self.m_pages.push(page);

			page.m_prev = prev;

			if (prev) {
				prev.m_next = page;
			}

			animate = animate ? 400: 0;

			if (animate) {
				self.m_animating = true;
				setTimeout(e=>self.m_animating = false, animate);
			}

			if (prev) {
				prev.intoBackground(animate);
			}
			page.intoForeground(animate, { active: 'push' });

			if (self.props.onNav) {
				self.props.onNav({ type: 'push', url: props.url, count: 1 });
			}

			if (cb) cb(page);
		});

		return true;
	}

	push(url, animate = 1) {
		return this.m_push(url, animate, this.length);
	}

	pops(result, index, animate = 1) {

		if (this.m_animating && animate) return false;

		if (this.length == 1 && index <= -1) {
			if (this.props.onEnd) {
				this.props.onEnd();
			}
			return false;
		}

		index = Math.max(0, index);

		if (index >= this.length - 1) return false;

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

		page.intoForeground(animate, { ...result, active: 'pop' });
		next.intoLeave(animate);

		if (this.props.onNav) {
			this.props.onNav({ type: 'pop', url: page.url, count: arr.length + 1 });
		}

		return true;
	}

	pop(result = {}, animate = 1) {
		return this.pops(result, this.length - 2, animate);
	}

	replace(url, animate = 0, index = -1) {
		// if (this.m_animating) return false;

		if (index >= 0 && index < this.length - 1) { // pop
			if (!this.pops({}, index, animate)) return false;
		}
		else if (animate) { // ani push

			var cur = this.m_current;
			if (!cur) return false;

			nxkit.assert(this.length > 0);

			return this.m_push(url, animate, this.length - 1, page=>{
				setTimeout(e=>{
					cur.intoLeave(0);
				}, 400);
				var prev = cur.m_prev;
				if (prev) {
					prev.m_next = page;
				}
				page.m_prev = prev;
				this.m_pages.deleteValue(cur);
				this.props.onNav({ type: 'replace', url: page.url, count: 0 });
			});
		}

		var props = this.m_parseProps(url);
		if (this.m_current) {
			this.m_current.replace(props);
			if (this.props.onNav) {
				this.props.onNav({ type: 'replace', url: props.url, count: 0 });
			}
		}

		return true;
	}
	
	get current() {
		return this.m_current.refs.self;
	}

	render() {
		return (
			<div className="root" ref="root">
			</div>
		);
	}

}

export class NavPage extends GlobalState {
	state = {};
	platform = '';

	getMainClass(cls = '') {
		var cls_1 = 'main ';
		if (nxkit.dev) {
			cls_1 += 'test ';
		}
		if (this.platform == 'android') {
			cls_1 += 'android ';
		} else if (this.platform == 'iphonex') {
			cls_1 += 'iphonex ';
		} else if (this.platform == 'iphone') {
			cls_1 += 'iphone ';
		}
		return cls_1 + cls;
	}

	mcls(cls = '') {
		return this.getMainClass(cls);
	}

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

	get loading() {
		return !this.state.loading_complete;
	}

	updateState(data) {
		var state = {};
		for (var i in data) {
			var o = data[i];
			if (typeof o == 'object' && !Array.isArray(o)) {
				state[i] = Object.assign(this.state[i] || {}, data[i]);
			}
		}
		this.setState(state);
	}

	async componentDidMount() {
		super.componentDidMount();
		await this.onLoad();
		this.setState({ loading_complete: true });
		if (this.props.priv.status == 0) {
			this.onShow({ active: 'init' });
		}
	}

	async componentWillUnmount() {
		super.componentWillUnmount();
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
	
	pushPage(url, animate = 1) {
		return this.nav.push(url, animate);
	}

	popPage(result = {}, animate = 1) {
		return this.nav.pop(result, animate);
	}

	replacePage(url, animate = 0, index = -1) {
		return this.nav.replace(url, animate, index);
	}

}
