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

import { NavPage, Nav } from './nav';
import React, { Component } from 'react';
import GlobalState from '../global-state';

export default class NavDataPage extends NavPage {

	name = '';
	dataPage = 30;

	get data() {
		var name = `${this.name}_data`;
		return this.state[name] || GlobalState.getGlobalState()[name] || [];
	}

	set data(value) {
		this.setState({ [`${this.name}_data`]: value || [] });
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

	loadMore = async ()=>{
		var rawData = this.data;
		this.m_load_data_params = {
			...this.m_load_data_params,
			limit: [rawData.length, rawData.length + this.dataPage],
		};
		var data = await this.loadData(this.m_load_data_params);
		this.data = rawData.concat(data);
	}

	constructor(props) {
		super(props);
	}

	async reload(params) {
		this.m_load_data_params = {
			...this.m_load_data_params,
			limit: [0, this.dataPage || 30],
			...params,
		};
		this.data = await this.loadData(this.m_load_data_params);
	}

	async loadData(params) {
		return [];
	}

}
