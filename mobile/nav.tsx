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

import utils from 'nxkit';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Component } from 'react';
import UI from '../lib/ui';
import error from '../lib/handles';
import {EventNoticer, Event} from 'nxkit/event';

var loading = '正在载入数据..';

export interface Route {
	path: string | string[];
	page: ()=>Promise<any>;
}

export type Args = string | { url: string, params?: Dict };

interface ParseParams {
	nav: Nav,
	url: string;
	pathname: string,
	params: Dict,
	notFound?: typeof NavPage;
	route?: Route;
}

interface PrivPageProps extends ParseParams {
	index: number;
	panel: HTMLDivElement;
}

class PrivPage extends Component<PrivPageProps> {
	m_prev: any = null;
	m_next: any = null;
	m_status = -1;
	m_panel: HTMLDivElement;
	m_timeout?: any;
	m_index = 0;
	m_props: PrivPageProps;
	_count: number = 0;
	state: {component: typeof NavPage | null} = { component: null };

	constructor(props: PrivPageProps) {
		super(props);
		this.m_props = props;
		this.m_index = props.index;
		this.m_panel = props.panel;
	}

	async loader() {
		try {
			if (this.m_props.notFound) {
				this.setState({ component: this.m_props.notFound });
			} else {
				var route = this.m_props.route as Route;
				this._count++;
				var com = (await route.page()).default;
				if (this.state.component === com) {
					this.setState({ component: null });
				}
				this.setState({ component: com, load_count: this._count });
			}
		} catch (e) {
			error(e);
		}
	}

	get status() {
		return this.m_status;
	}

	get url() {
		return this.m_props.url;
	}

	get nav() {
		return this.m_props.nav;
	}

	get pathname() {
		return this.m_props.pathname;
	}

	get params() {
		return this.m_props.params;
	}

	get index() {
		return this.m_index;
	}

	componentDidMount() {
		this.loader();
	}

	onShow(data = {}) {
		try {
			(this.refs.self as NavPage).triggerShow(data);
		} catch(err) {
			console.error(err);
		}
	}

	onHide() {
		try {
			(this.refs.self as NavPage).triggerHide();
		} catch(err) {
			console.error(err);
		}
	}

	unmount() {
		// this.setState({ component: null });
		ReactDom.unmountComponentAtNode(this.m_panel);
		(this.m_panel.parentNode as HTMLDivElement).removeChild(this.m_panel);
	}

	replace(props: ParseParams) {
		this.m_props = {
			...props,
			index: this.m_index,
			panel: this.m_panel,
		};
		(this as any).props = this.m_props;
		this.loader();
	}

	render() {
		var Com = this.state.component;
		if (Com) {
			var props = {
				url: this.m_props.url,
				pathname: this.m_props.pathname,
				params: this.m_props.params,
				ref: 'self',
				priv: this,
			};
			return (
				<Com {...props} />
			);
		} else {
			return (
				<div className="init-loading"> {loading} </div>
			);
		}
	}

	getStyle(styleStr: string) {
		return `
			width: 100%;
			min-height: 100%;
			background: #fff;
			position: absolute;
			z-index: ${this.m_index};
			` + styleStr;
	}

	intoBackground(time: number) {
		if ( this.m_next == null ) return;

		clearTimeout(this.m_timeout);

		if ( this.m_status != 1 ) {
			if (time) {
				requestAnimationFrame(e=>{
					requestAnimationFrame(e=>{
						this.m_panel.style.cssText = this.getStyle(`
							display: block;
							transform: translateX(-35vw) translateZ(1px);
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

	intoForeground(time: number, data: Dict = {}) {
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
							transform: translateX(0) translateZ(1px);
							transition-property: transform;
							transition-duration: ${time}ms;
							box-shadow: -1px 0 2px #aaa;
						`);
						this.m_timeout = setTimeout(e=>{
							this.m_panel.style.transitionProperty = 'none';
							this.m_panel.style.boxShadow = 'none';
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
							transform: translateX(0) translateZ(1px);
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

	intoLeave(time: number) { 
		if ( this.m_status == 0 ) {
			clearTimeout(this.m_timeout);

			if ( time ) {
				this.m_panel.style.cssText = this.getStyle(`
					display: block;
					transform: translateX(100vw) translateZ(1px);
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

export interface NavArgs {
	action: 'push' | 'pop' | 'replace';
	pathname: string;
	params: Dict;
	count: number;
}

export interface NavProps {
	routes: Route[];
	initURL?: string;
	notFound?: typeof NavPage;
	onNav?: (args: NavArgs)=>void;
	onEnd?: ()=>void;
}

export class Nav extends Component<NavProps> {
	private m_pages: PrivPage[] = [];
	private m_current: PrivPage | null = null;
	private m_routes: Dict<Route> = {};
	private m_animating = false;

	readonly onNav = new EventNoticer<Event<NavArgs, Nav>>('Nav', this);
	readonly onEnd = new EventNoticer<Event<void, Nav>>('End', this);

	triggerNav(data: NavArgs) {
		if (this.props.onNav) {
			this.props.onNav(data);
		}
		this.onNav.trigger(data);
	}

	triggerEnd() {
		if (this.props.onEnd) {
			this.props.onEnd();
		}
		this.onEnd.trigger();
	}

	componentDidMount() {
		var routes = this.props.routes;
		routes.forEach(e=>{
			if (typeof e.path == 'string') {
				e.path = [e.path];
			}
			for (var url of e.path) {
				url = url[0] != '/' ? '/' + url : url;
				this.m_routes[url] = e;
			}
		});
		this.push(this.props.initURL || '/', false);
	}

	get length() {
		return this.m_pages.length;
	}

	getPage(index: number) {
		return this.m_pages[index].refs.self as NavPage;
	}

	get routes() {
		return this.m_routes;
	}

	private m_parseProps(args: Args): ParseParams {
		if (typeof args == 'string') {
			args = { url: args };
		}
		var { url, params = {} } = args;

		url = url[0] != '/' ? '/' + url : url;

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
		var props: ParseParams = { 
			nav: this,
			url: url,
			pathname: pathname,
			params: params,
			route: route,
		};

		if (!route) {
			if (this.props.notFound) {
				props.notFound = this.props.notFound;
			} else {
				throw new Error(`Not found ${url}`);
			}
		}
		return props;
	}

	private m_push(url: Args, animate: boolean, index: number, cb?: (page: PrivPage)=>void) {

		if (this.m_animating && animate) return false;

		var props = this.m_parseProps(url);
		var panel = document.createElement('div');
		(this.refs.root as HTMLDivElement).appendChild(panel);

		var self = this;
		var prev = this.m_current;
		var el = <PrivPage {...props} index={index} panel={panel} />;

		ReactDom.render(el, panel, function(this: PrivPage) {
			var page = this;

			self.m_current = page;
			self.m_pages.push(page);

			page.m_prev = prev;

			if (prev) {
				prev.m_next = page;
			}

			var animateNum = animate ? 400: 0;

			if (animate) {
				self.m_animating = true;
				setTimeout(e=>self.m_animating = false, animateNum);
			}

			if (prev) {
				prev.intoBackground(animateNum);
			}
			page.intoForeground(animateNum, { active: 'push' });

			var {pathname,params} = props;
			self.triggerNav({ action: 'push', pathname, params, count: 1 })

			if (cb)
				cb(page);
		});

		return true;
	}

	push(url: Args, animate = true) {
		return this.m_push(url, animate, this.length);
	}

	pops(result: any, index: number, animate = true) {

		if (this.m_animating && animate) return false;

		if (this.length == 1 && index <= -1) {
			this.triggerEnd();
			return false;
		}

		index = Math.max(0, index);

		if (index >= this.length - 1) return false;

		var page = this.m_pages[index];
		var arr = this.m_pages.splice(index + 1);
		var next = arr.pop() as PrivPage;

		arr.forEach(function (page) {
			page.intoLeave(0);
		});

		this.m_current = page;

		var animateNum = animate ? 400: 0;

		if (animate) {
			this.m_animating = true;
			setTimeout(e=>this.m_animating = false, animateNum);
		}

		page.m_next = null;
		next.m_prev = null;

		page.intoForeground(animateNum, { ...result, active: 'pop' });
		next.intoLeave(animateNum);

		this.triggerNav({ action: 'pop', pathname: page.pathname, params: page.params, count: arr.length + 1 });

		return true;
	}

	pop(animate = true, result: Dict = {}) {
		return this.pops(result, this.length - 2, animate);
	}

	replace(url: Args, animate = false, index = -1) {
		// if (this.m_animating) return false;

		if (index >= 0 && index < this.length - 1) { // pop
			if (!this.pops({}, index, animate)) return false;
		}
		else if (animate) { // ani push

			var cur = this.m_current as PrivPage;
			if (!cur)
				return false;

			utils.assert(this.length > 0);

			return this.m_push(url, animate, this.length - 1, page=>{
				setTimeout(e=>{
					cur.intoLeave(0);
				}, 400);
				var prev = cur.m_prev;
				if (prev) {
					prev.m_next = page;
				}
				page.m_prev = prev;
				this.m_pages.deleteOf(cur);
				this.triggerNav({ action: 'replace', pathname: page.pathname, params: page.params, count: 0 });
			});
		}

		var props = this.m_parseProps(url);
		if (this.m_current) {
			this.m_current.replace(props);
			this.triggerNav({ action: 'replace', pathname: props.pathname, params: props.params, count: 0 });
		}

		return true;
	}

	get current() {
		utils.assert(this.m_current);
		return (this.m_current as PrivPage).refs.self as NavPage;
	}

	render() {
		return (
			<div className="root" ref="root">
			</div>
		);
	}
}

interface BaseProps<P> {
	priv: PrivPage;
	url: string;
	pathname: string;
	params: P;
}

export class NavPage<P = {}, S = {}, SS = any> extends UI<BaseProps<P>, S, SS> {
	static platform = '';

	mcls(cls = '') {
		var cls_1 = 'main ';
		if (utils.debug) {
			cls_1 += 'test ';
		}
		if (NavPage.platform == 'android') {
			cls_1 += 'android ';
		} else if (NavPage.platform == 'iphonex') {
			cls_1 += 'iphonex ';
		} else if (NavPage.platform == 'iphone') {
			cls_1 += 'iphone ';
		}
		return cls_1 + cls;
	}

	get nav() {
		return this.props.priv.nav;
	}

	get url() {
		return this.props.url;
	}

	get pathname() {
		return this.props.pathname;
	}

	get index() {
		return this.props.priv.index;
	}

	get params() {
		return this.props.params;
	}

	async triggerLoad() {
		if (this.props.priv.status == 0) {
			this.triggerShow({ active: 'init' });
		}
	}

	triggerRemove() {
		if (this.props.priv.status == -1)
			this.triggerHide();
	}

	triggerShow(data: { active?: 'init', [key: string]: any } = {}) {
		// overwrite
	}

	triggerHide() {
		// overwrite
	}
	
	pushPage(url: Args, animate = true) {
		return this.nav.push(url, animate);
	}

	popPage(animate = true, result: Dict = {}) {
		return this.nav.pop(animate, result);
	}

	replacePage(url: Args, animate = false, index = -1) {
		return this.nav.replace(url, animate, index);
	}

}