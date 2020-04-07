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
import '../lib/utils.css';
import './utils.css';
import rem from '../utils/rem';
import {store, initialize as initStore} from '../utils/store';
import error from '../lib/handles';
import * as dialog from '../lib/dialog';
import { NavPage, Nav, Route, NavArgs } from './nav';
import * as ReactDom from 'react-dom';
import * as React from 'react';
import { Component } from 'react';
import _404 from './404';
import GlobalState from '../utils/state';
import {NavDataPage} from './page';
import errno from '../utils/errno';

export interface RootProps {
	scale?: number;
	title?: string;
	config?: Dict;
	routes?: Route[];
	notFound?: typeof NavPage;
}

export class Root extends GlobalState<RootProps> {
	loadingText = 'Loading..';
	state = { isLoaded: false };
	private m_path: string;

	async componentDidMount() {
		rem.initialize(this.props.scale);

		try {
			this.m_path = await this.onLoad();
		} catch(err) {
			if (err.code != errno.ERR_LOGIN_FORWARD[0]) {
				dialog.alert(err.message + ', ' + err.code + ',' + err.stack);
			}
			throw err;
		}

		store.addEventListener('uncaughtException', function(err) {
			error(err.data);
		});

		this.setState({ isLoaded: true });
		// setTimeout(e=>window.history.replaceState({}, this.props.title||'', '#/'), 10);

		window.addEventListener('hashchange', (e)=>{
			(this.refs.nav as Nav).current.popPage(true); // 不管前进或后退都当成后退处理
		});
	}

	async onLoad() {
		var config = this.props.config;
		if (config && config.serviceAPI)
			await initStore(config);
		return '/';
	}

	onNav(e: NavArgs) {
		if (e.action == 'pop') {
			// window.history.go(-e.count);
		} else if (e.action == 'push') {
			window.history.pushState({}, this.props.title||'', '#' + e.pathname);
		} else { // replace
			window.history.replaceState({}, this.props.title||'', '#' + e.pathname);
		}
	}

	onEnd() {
		// console.log('closeApp');
	}

	render() {
		var url = this.m_path || (location.hash ? location.hash.replace(/^#/, '') : '/');
		return (
			this.state.isLoaded ?
			<Nav 
				ref="nav"
				notFound={this.props.notFound || _404}
				routes={this.props.routes||[]}
				onNav={e=>this.onNav(e)}
				onEnd={()=>this.onEnd()}
				initURL={url}
			/>:
			<div className="init-loading">{this.loadingText}</div>
		);
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
