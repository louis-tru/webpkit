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

import 'normalize.css';
import '../lib/util.css';
import './util.css';
import rem from '../lib/rem';
import * as dialog from '../lib/dialog';
import { NavPage, Nav, Route, NavArgs } from './nav';
import * as ReactDom from 'react-dom';
import * as React from 'react';
import { Component } from 'react';
import _404 from './404';
import {ViewController} from '../lib/ctr';
import {NavDataPage} from './page';
import path from 'somes/path';
import somes from 'somes';

var current: Root | null = null;

export interface RootProps {
	scale?: number;
	title?: string;
	routes?: Route[];
	notFound?: typeof NavPage;
}

export class Root<P extends RootProps = {}, S = {}> extends ViewController<P, S> {
	protected startupPath: string = '';
	protected isHashRoutes = true;
	private _external: boolean = false;

	async triggerLoad() {
		current = this;
		rem.initialize(this.props.scale);
		window.addEventListener(this.isHashRoutes ? 'hashchange': 'popstate', ()=>{
			try {
				this._external = true;
				(this.refs.nav as Nav).current.popPage(true); // 不管前进或后退都当成后退处理
			} finally {
				this._external = false;
			}
		});
	}

	triggerNav(e: NavArgs) {
		var title = this.props.title as string || '';
		var u = new path.URL(e.pathname);
		u.params = e.params;
		var s = (this.isHashRoutes ? '#' : '') + u.path;
		if (e.action == 'push') {
			globalThis.history.pushState({}, title, s);
		} else if (e.action == 'replace') {
			globalThis.history.replaceState({}, title, s);
		} else {
			if (!this._external)
				globalThis.history.back();
		}
	}

	triggerEnd() {
		// console.log('closeApp');
	}

	private _LocationHref() {
		var u = new path.URL(location.href);
		return this.isHashRoutes ? u.hash.substr(1) || '/': u.path;
	}

	render() {
		var url = this.startupPath || this._LocationHref();
		var routes = this.props.routes as Route[] || [];
		return (
			this.isLoaded ?
			<div>
				<Nav 
					ref="nav"
					notFound={this.props.notFound || _404}
					routes={routes}
					onNav={e=>this.triggerNav(e)}
					onEnd={()=>this.triggerEnd()}
					initURL={url}
				/>
				{this.renderTools()}
			</div>:
			this.renderLoading()
		);
	}

	protected renderTools(): React.ReactNode {
		return null;
	}

	protected renderLoading(): React.ReactNode {
		return <div className="init-loading">Loading..</div>;
	}

	static get current() {
		somes.assert(current);
		return current as Root;
	}
}

export {
	React,
	ReactDom,
	Component,
	Nav,
	NavPage,
	dialog,
	NavDataPage,
};
