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
import './utils.css';
import nxkit from 'nxkit';
import sdk from 'dphoto-magic-sdk';
import path from 'nxkit/path';
import error from './error';
import { Router } from './router';
import Page, { DataPage } from './page';
import ReactDom from 'react-dom';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import GlobalState from './state';
import * as History from 'history';
import * as dialog from './dialog';
import errno from './errno';

var current = null;

const history = History.createBrowserHistory(); // History.createHashHistory();

/**
 * @class Root
 */
export class Root extends GlobalState {

	state = { isLoaded: false };

	constructor(props) {
		super(props);
		this.history = history;
	}

	async componentDidMount() {
		current = this;

		try {
			await this.onLoad();
			if ( typeof this.props.onLoad == 'function') {
				await this.props.onLoad(this);
			}
		} catch(err) {
			if (err.code != errno.ERR_LOGIN_FORWARD[0]) {
				dialog.alert(err.message + ', ' + err.code + ',' + err.stack);
			}
			throw err;
		}

		sdk.addEventListener('uncaughtException', function(err) {
			error.defaultErrorHandle(err.data);
		});

		this.setState({ isLoaded: true });
	}

	async onLoad() {
		if (this.props.initSDK!==false)
			await initializeSDK(this.props.config || {});
	}
	
	render() {
		return (
			this.state.isLoaded ?
			<Router ref="router" 
				history={this.history}
				notFound={this.props.notFound}
				routes={this.props.routes}
			/>:
			<div className="init-loading">Loading..</div>
		);
	}

	static get current() {
		return current;
	}
}

export async function initializeSDK(config = {}) {
	if (sdk.isLoaded) return;
	var url = new path.URL(config.serviceAPI || nxkit.config.serviceAPI);
	await sdk.initialize(
		path.getParam('D_SDK_HOST') || url.hostname,
		path.getParam('D_SDK_PORT') || url.port,
		path.getParam('D_SDK_SSL') || /^(http|ws)s/.test(url.protocol),
		path.getParam('D_SDK_VIRTUAL') || url.filename
	);

};

export {
	React,
	ReactDom,
	Component,
	Router,
	Page, DataPage,
	sdk,
	Link,
	error,
	dialog,
};
