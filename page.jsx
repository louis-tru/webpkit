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
import GlobalState from './global-state';

/**
 * @class Page
 */
export default class Page extends GlobalState {

	constructor(props) {
		super(props);
		if (!this.props.router) return;
		this._url = this.props.location.pathname + this.props.location.search;
		var search = this.props.location.search.substr(1);
		this._params = {};
		this._router = this.props.router;
		if (search) {
			search.split('&').forEach(e=>{
				var [key,...value] = e.split('=');
				if (value.length) {
					if (value.length > 1) {
						value = value.join('=');
					}
					this._params[key] = decodeURIComponent(value);
				}
			});
		}
	}

	get url() {
		return this._url;
	}

	get pathname() {
		return this.location && this.location.pathname;
	}

	get history() {
		return this.props.history;
	}

	get location() {
		return this.props.location;
	}

	get match() {
		return this.props.match;
	}

	get params() {
		return this.props.match && this.props.match.params;
	}

	componentDidMount() {
		super.componentDidMount();
		this._router && (this._router._current = this);
		this.onLoad();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.onUnload();
		if (this._router && this._router._current === this) {
			this._router._current = null;
		}
	}

	onLoad() {
		// overwrite
	}

	onUnload() {
		// overwrite
	}

	goBack() {
		this.history && this.history.goBack()
	} 

	goForward() {
		this.history && this.history.goForward()
	}

	goto(url) {
		if (this._router) {
			if (this._router.type == 'hash') {
				location.hash = url;
			} else {
				location.href = url;
			}
		}
	}

}
