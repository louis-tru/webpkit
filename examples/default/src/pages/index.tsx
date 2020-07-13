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

import utils from 'somes';
import req from 'somes/request';
import path from 'somes/path';
import {Page,React,Link} from 'webpkit';
import './index.css';

const LINES = 100;

export default class Index extends Page {
	
	state = { logs: [], color: path.getParam('color') || '0f0' };

	async showLog() {
		var {data:text} = await req.get(`./static/${path.getParam('log')||'log'}.txt`);
		var logsAll = (text + '').split(/\n/);
		var index = 0, len = logsAll.length;
		var logs = [];
		while (true) {
			logs.push(logsAll[index]);
			if (logs.length > LINES) {
				logs.shift();
			}
			this.setState({ logs });
			await utils.sleep(utils.random(50, 1000));
			index = (index + 1) % len;
		}
	}

	triggerLoad() {
		this.showLog();
	}

	render() {
		return (
			<div className="index">
				<div className="con">
					{this.state.logs.map((e,i)=>
						<Link className="log" style={{color:'#'+this.state.color}} key={i} to="/test">{e}</Link>
					)}
				</div>
			</div>
		);
	}
}