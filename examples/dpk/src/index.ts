/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2020, hardchain
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
import './utils.scss';
import {Application} from 'webpkit/isolate';
import {store,initialize} from './sdk';
import storage from './storage';
import Main from './pages/index';
import * as language from 'dphoto-lib/language';
import * as config from '../config';
// import Main from './pages/details';
// import Main from './pages/traceability';

export default class extends Application {

	readonly name = config.app.appId;

	triggerLaunch(args?: any) {
		this.launcher.show(this, Main, args, 'animate' in args ? args.animate: true);
	}

	async triggerLoad() {
		while (1) {
			try {
				await initialize();
				break;
			} catch(e) { // 300ms 后重试 
				await utils.sleep(300);
			}
		}
		await storage.initialize();
		
		language.registerLanguageChangeNotice(this, async (code)=>{
			if (code == 'zh-cn') {
				language.setLanguageTags((await import('../spirit/lang/zh-cn')).default);
			} else if (code == 'en-us') {
				language.setLanguageTags((await import('../spirit/lang/en-us')).default);
			}
		});
	}

	triggerUnload() {
		store.destroy();
		language.unregisterLanguageChangeNotice(this);
	}

}