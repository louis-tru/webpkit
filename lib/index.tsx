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
import './util.css';
import utils from 'somes';
import { Router, Route, history } from './router';
import Page, { DataPage } from './page';
import * as ReactDom from 'react-dom';
import * as React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';
// import * as _history from 'history';
import {ViewController} from './ctr';

var current: Root | null = null;

export interface RootProps {
	routes?: Route[];
	notFound?: typeof Page;
}

export class Root<P extends RootProps = {}, S = {}> extends ViewController<P, S> {
	loadingText = 'Loading..';

	protected async triggerLoad() {
		current = this;
	}

	get history() {
		// var r = this.refs.router as unknown as Router;
		return history;
	}

	get router() {
		return this.refs.router as any as Router;
	}

	render() {
		return (
			this.isLoaded ?
			<Router ref="router" notFound={this.props.notFound} routes={this.props.routes} />:
			<div className="init-loading">{this.loadingText}</div>
		);
	}

	static get current() {
		utils.assert(current);
		return current as Root;
	}
}

export {
	React,
	ReactDom,
	Component,
	Router,
	Page, DataPage,
	Link,
	ViewController,
};