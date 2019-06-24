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
	state = {};

	constructor(props) {
		super(props);
		if (!this.props.router) return;
		this._url = this.props.location.pathname + this.props.location.search;
		var search = this.props.location.search.substr(1);
		var params = this.props.location.params || {};
		this._params = this.props.match ? { ...params, ...this.props.match.params }: params;
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
		return this._params;
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
		this._router && (this._router._current = this);
		await this.onLoad();
		this.setState({ loading_complete: true });
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

	goto(args) {
		var history = this.history;
		if (history) {
			if (typeof args == 'string') {
				args = {url:args};
			}
			var { url, params = {} } = args;
			var pathname = url;
			var search = '';
			var index = url.indexOf('?');
			if (index >= 0) {
				pathname = url.substr(0, index);
				search = url.substring(index);
			}
			history.push({ pathname, search, params });
		}
	}

}

var default_data_page = 10;

/**
 * @class DataPage
 */
export class DataPage {

	static setDefaultDataPage(page) {
		default_data_page = Number(page) || default_data_page;
	}

	get name() {
		return this.m_name || '';
	}

	set name(value) {
		this.m_name = value || '';
	}

	get dataPage() {
		return this.m_dataPage || default_data_page;
	}

	set dataPage(value) {
		this.m_dataPage = Number(value) || default_data_page;
	}

	get dataPageCount() {
		return Math.ceil(this.total / this.dataPage);
	}

	get data() {
		var name = `${this.name}_data`;
		return this.state[name] || GlobalState.getGlobalState()[name] || [];
	}

	set data(value) {
		this.setState({ [`${this.name}_data`]: value || [] });
	}

	get indexPage() {
		return Math.ceil(this.index / this.dataPage);
	}

	get index() {
		return this.m_index || 0;
	}

	set index(value) {
		this.m_index = Number(value) || 0;
	}

	get total() {
		return this.m_total || 0;
	}

	set total(value) {
		this.m_total = Number(value) || 0;
	}

	get length() {
		return this.data.length;
	}

	get hasMore() {
		var data = this.state[`${this.name}_data`];
		if (data && data.length) {
			if (data.length % this.dataPage === 0) {
				return true;
			}
		}
		return false;
	}

	async loadMore() {
		var rawData = this.data;
		this.m_load_data_params = {
			...this.m_load_data_params,
			limit: [rawData.length, this.dataPage],
		};
		var { value, total } = await this.loadData(this.m_load_data_params);
		this.total = total;
		this.data = rawData.concat(value);
	}

	async reload(params, page = 0) {
		var dataPage = this.dataPage;
		this.m_load_data_params = {
			...this.m_load_data_params,
			limit: [Math.max(0, Number(page)||0) * dataPage, dataPage],
			fetchTotal: 1,
			...params,
		};
		var { value, total, index } = await this.loadData(this.m_load_data_params);
		this.index = index;
		this.total = total;
		this.data = value;
	}

	async loadData(params) {
		return [];
	}

}
