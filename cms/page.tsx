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

import somes from 'somes';
import {ViewController} from '../lib/ctr';
import Page, { IDataPage, DataPage } from '../lib/page';

export default class CMSPage<P = {}, S = {}> extends Page<P, S> {

	protected reloadNifty() {
		require('cport-nifty/js/nifty.js').initialize();
	}

	protected triggerMounted() {
		this.reloadNifty();
	}

}

export declare class CMSDataPageDefine<P = {}, S = {}, Data = Dict> extends CMSPage<P, S> implements IDataPage<Data> {
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
	reload(params: Dict, page?: number): Promise<void>;
	loadData(params: Dict): Promise<{ value: Data[]; total?: number; index?: number }>;
}

class CMSDataPageIMPL extends CMSPage {}

somes.extendClass(CMSDataPageIMPL, DataPage, ViewController.prototype);

export const CMSDataPage = CMSDataPageIMPL as unknown as typeof CMSDataPageDefine;