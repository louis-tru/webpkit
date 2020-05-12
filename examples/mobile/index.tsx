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

import {React,Root,ReactDom,dialog} from 'webpkit/mobile';
import _404 from './src/pages/404';
import routes from './src/router';
import path from 'nxkit/path';
import './src/css/util.css';
import sdk,{initialize} from './src/sdk';
import utils from 'nxkit';
import errnoHandles from 'webpkit/lib/errno_handles';
import {Console} from 'nxkit/log';

utils.onUncaughtException.on((e)=>{
	errnoHandles(e.data);
});

utils.onUnhandledRejection.on((e)=>{
	errnoHandles(e.data.reason);
});

class MyRoot<P> extends Root<P> {

	protected startupPath: string = path.getParam('init_url') || '/';

	async triggerLoad() {
		await super.triggerLoad();

		try {
			await initialize();
		} catch(err) {
			dialog.alert(err.message + ', ' + err.code + ',' + err.stack);
			throw err;
		}

		sdk.message.addEventListener('BluetoothPairRequest', e=>{
			dialog.confirm(e.data.mobile + ',请求蓝牙配对', e=>{
				sdk.device.methods.agreeBluetoothPair({ isAgree: e }).catch(console.error);
			});
		});
	}
}

ReactDom.render(<MyRoot routes={routes} notFound={_404} />, document.querySelector('#app'));

Console.defaultInstance.log('init ok');