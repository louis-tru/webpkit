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
import '../utils.css';
import './utils.css';
import rem from './rem';
import qkit from 'qkit';
import sdk from 'dphoto-magic-sdk';
import path from 'qkit/path';
import '../_fix';
import error from '../error';
import dialog from '../dialog';
import { NavPage, Nav } from './nav';
import ReactDom from 'react-dom';
import React, { Component } from 'react';
import _404 from './404';

/**
 * @class MyPage
 */
export class MyPage extends NavPage {

	name = 'test';
	platform = 'iphonex';

	getMainClass(cls = '') {
		var cls_1 = 'main ';
		if (qkit.dev) {
			cls_1 += 'test ';
		}
		if (this.platform == 'android') {
			cls_1 += 'android ';
		} else if (this.platform == 'iphonex') {
			cls_1 += 'iphonex '; 
		}
		return cls_1 + this.name + ' ' + cls;
	}

	get mainClass() {
		return this.getMainClass();
	}
}

/**
 * @class Root
 */
export class Root extends Component {

	state = { isLoaded: false };

	async componentDidMount() {
		rem.initialize();
		try {
			await initialize(this.props.config || {});
			this.setState({ isLoaded: true });
			return
		} catch(e) {
			error.defaultErrorHandle(e);
			return;
		}

		setTimeout(e=>window.history.replaceState({}, this.props.title||'', '#/'), 10);
		window.addEventListener('hashchange', (e)=>{ // 不管前进或后退都当成后退处理
			this.refs.nav.current.popPage(true);
		});
	}

	onNav(e){
		if (e.type == 'pop') {
			// window.history.go(-e.count);
		} else if (e.type == 'push') {
			window.history.pushState({}, this.props.title||'', '#' + e.url);
		} else { // replace
			window.history.replaceState({}, this.props.title||'', '#' + e.url);
		}
	}

	onEnd(e) {
		// console.log('closeApp');
	}

	render() {
		var url = location.hash ? location.hash.replace(/^#/, '') : '/';
		return (
			this.state.isLoaded ?
			<Nav 
				ref="nav"
				notFound={_404}
				routes={this.props.routes||[]}
				onNav={e=>this.onNav(e)}
				onEnd={e=>this.onEnd(e)}
				initUrl={url}
			/>:
			<div className="init-loading">
				Loading..
			</div>
		);
	}
}

export async function initialize(config = {}) {
	if (sdk.isLoaded) return;
	var url = new path.URL(config.serviceAPI || qkit.config.serviceAPI);
	await sdk.initialize(
		path.getParam('D_SDK_HOST') || url.hostname,
		path.getParam('D_SDK_PORT') || url.port);

	sdk.addEventListener('Error', function(err) {
		error.defaultErrorHandle(err.data);
	});
};

export {
	React,
	ReactDom,
	Component,
	Nav,
	NavPage,
	dialog,
	sdk,
};
