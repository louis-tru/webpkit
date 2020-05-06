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

import * as React from 'react';
import {DataPage} from '../lib';
import {ViewController} from '../lib/ctr';

export default class Pageing extends ViewController<{page: DataPage}> {

	get page() {
		return this.props.page;
	}

	render() {
		if (!this.page) return null;
		var {dataPageCount, indexPage} = this.page;
		if (dataPageCount <= 1) return null;

		// var offset = Math.max(0, indexPage - 10);
		var offset = 5;

		return (
			<div className="text-right">
				<ul className="pagination">
					<li className={`footable-page-arrow ${indexPage?'':'disabled'}`}>
						<a data-page="first" href="#first" onClick={e=>indexPage&&this.page.reload({}, 0)}>«</a>
					</li>
					<li className={`footable-page-arrow ${indexPage?'':'disabled'}`}>
						<a data-page="prev" href="#prev" onClick={e=>indexPage&&this.page.reload({}, indexPage-1)}>‹</a>
					</li>
					{
						Array.from({length:10}).map((e,i)=>{
							var j = indexPage + i - offset;
							if (j < 0 || j >= dataPageCount) return null;
							return (
								<li className={`footable-page ${indexPage==j?'active':''}`}>
									<a data-page="0" href="#" onClick={e=>indexPage!=j&&this.page.reload({}, j)}>{j+1}</a>
								</li>
							);
						}).filter(e=>e)
					}
					<li className={`footable-page-arrow ${indexPage+1<dataPageCount?'':'disabled'}`}>
						<a data-page="next" href="#next" onClick={e=>indexPage+1<dataPageCount&&this.page.reload({}, indexPage+1)}>›</a>
					</li>
					<li className={`footable-page-arrow ${indexPage+1<dataPageCount?'':'disabled'}`}>
						<a data-page="last" href="#last" onClick={e=>indexPage+1<dataPageCount&&this.page.reload({}, dataPageCount-1)}>»</a>
					</li>
				</ul>
			</div>
		);
	}

}