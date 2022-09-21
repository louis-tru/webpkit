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

// import utils from 'somes';
import * as React from 'react';
import {ViewController} from './ctr';
import GlobalState from './state';
import * as _history from 'history';
import {Location} from 'history';
import {Router} from './router';
import { match } from 'react-router';

export type History = _history.History; //<_history.History.PoorMansUnknown>;

export interface PageInit {
	router: Router;
	history: History;
	location: Location;
	match: match;
}

export default class Page<Params = {}, S = {}> extends ViewController<{}, S> {
	private _url = '';
	private _router?: Router;
	private _pageInit: PageInit;
	private _params: Params = {} as Params;

	constructor(props: Readonly<Params & PageInit>) {
		super(props);
		this._pageInit = props;
		// utils.assert(this.props.router, 'no router');
		if (!props.router)
			return;
		this._router = props.router;
		this._url = props.location.pathname + props.location.search;
		this._params = Object.assign({}, props.match && props.match.params) as Params;
		var search = props.location.search.substring(1);
		if (search) {
			search.split('&').forEach(e=>{
				var [key,...value] = e.split('=');
				var	valueStr = value[0];
				if (valueStr && valueStr.length) {
					var val = '';
					if (value[0].length >= 1) {
						val = value.join('=');
					}
					(this as any)._params[key] = decodeURIComponent(val);
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
		return this._pageInit.history as History;
	}

	get location() {
		return this._pageInit.location as Location;
	}

	get match() {
		return this._pageInit.match as match;
	}

	get params() {
		return this._params;
	}

	protected triggerLoad() {
		this._router && ((this._router as any)._current = this);
	}

	protected triggerRemove() {
		if (this._router && (this._router as any)._current === this) {
			(this._router as any)._current = null;
		}
	}

	goBack() {
		this.history && this.history.goBack()
	} 

	goForward() {
		this.history && this.history.goForward()
	}

	goto(args: string | { url: string, params?: Dict}) {
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
				pathname = url.substring(0, index);
				search = url.substring(index);
			}
			for (var i in params) {
				search += (search?'&':'') + i + '=' + encodeURIComponent(params[i]);
			}
			history.push({ pathname, search });
		}
	}

}

export class Loading extends Page<{content?:string}, {}> {
	render() {
		return <div> {this.params.content||''} </div>
	}
}

var default_data_page = 10;

export interface DataPageParams {
	fetchTotal: boolean,
	limit: [number,number],
	[key: string]: any,
}

export interface IDataPage<Data> {
	name: string;
	dataPage: number;
	readonly dataPageCount: number
	data: Data[];
	readonly indexPage: number;
	index: number
	total: number;
	readonly length: number;
	readonly hasMore: boolean;
	loadMore(): Promise<void>;
	reload(params: DataPageParams, page?: number): Promise<void>;
	loadData(params: DataPageParams): Promise<{ value: Data[]; total?: number; index?: number }>;
}

export class DataPage<P = {}, S = {}, Data = Dict> extends Page<P, S> implements IDataPage<Data> {
	private m_index?: number;
	private m_total?: number;
	private m_load_data_params?: DataPageParams;

	static setDefaultDataPage(page: number) {
		default_data_page = Number(page) || default_data_page;
	}

	readonly name: string = '';
	readonly dataPage = default_data_page;

	get dataPageCount() {
		return Math.ceil(this.total / this.dataPage);
	}

	get data(): Data[] {
		var name = `${this.name}_data`;
		return (this as any).state[name] || GlobalState.getGlobalState(name) || [];
	}

	set data(value: Data[]) {
		this.setState({ [`${this.name}_data`]: value || [] } as any);
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
		var data = (this as any).state[`${this.name}_data`];
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
			fetchTotal: false,
		};
		var { value, total } = await this.loadData(this.m_load_data_params);
		this.total = total || value.length;
		this.data = rawData.concat(value);
	}

	async reload(params?: DataPageParams, page = 0) {
		var dataPage = this.dataPage;
		this.m_load_data_params = {
			...this.m_load_data_params,
			limit: [Math.max(0, Number(page)||0) * dataPage, dataPage],
			fetchTotal: true,
			...params,
		};
		var { value, total, index } = await this.loadData(this.m_load_data_params);
		this.index = index || 0;
		this.total = total || value.length;
		this.data = value;
	}

	async loadData(params: DataPageParams): Promise<{ value: Data[]; total?: number; index?: number }> {
		return { value: [] };
	}

}
