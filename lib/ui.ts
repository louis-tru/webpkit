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
import GlobalState from './state';

interface UIState {
	__loaded?: boolean;
}

export default class UI<P = {}, S extends UIState = {}, SS = any> extends GlobalState<P, S, SS> {
	private m_mounted?: boolean;
	private m_loaded?: boolean;

	updateState(data: S) {
		var state: S = {} as S;
		for (var i in data) {
			var o = data[i];
			if (typeof o == 'object' && !Array.isArray(o)) {
				state[i] = Object.assign(this.state[i] || {}, data[i]);
			}
		}
		this.setState(state);
	}

	get isLoaded() {
		return !!this.m_loaded;
	}

	get isMounted() {
		return !!this.m_mounted;
	}

	async componentWillMount() {
		super.componentWillMount(); // call super
		var r = this.triggerLoad() as any; // trigger event Load, private props visit
		if (r instanceof Promise) {
			r.then(()=>{
				this.m_loaded = true;
				this.setState({ __loaded: true } as any);
			});
		} else {
			this.m_loaded = true;
			this.setState({ __loaded: true } as any);
		}
	}

	async componentDidMount() {
		this.m_mounted = true;
		this.triggerMounted();
	}

	async componentWillUnmount() {
		super.componentWillUnmount(); // call super
		this.triggerRemove();
	}

	async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.triggerError(error, errorInfo);
	}

	protected triggerLoad() {
		// overwrite
	}

	protected triggerMounted() {
		// overwrite
	}

	protected triggerRemove() {
		// overwrite
	}

	protected triggerError(error: Error, errorInfo: React.ErrorInfo) {
		// overwrite
	}

}
