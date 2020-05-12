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

class _ViewController<P = {}, S = {}> extends GlobalState<P, S> {
	private m_mounted?: boolean;
	private m_loaded?: boolean;

	updateState(data: S, callback?: () => void) {
		var state: S = {} as S;
		for (var i in data) {
			var o = data[i];
			if (typeof o == 'object' && !Array.isArray(o)) {
				state[i] = Object.assign(this.state[i] || {}, data[i]);
			}
		}
		this.setState(state, callback);
	}

	get isLoaded() {
		return !!this.m_loaded;
	}

	get isMounted() {
		return !!this.m_mounted;
	}

	componentWillMount() {
		super.componentWillMount(); // call super
		var r = this.triggerLoad() as any; // trigger event Load
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

	componentDidMount() {
		this.m_mounted = true;
		this.triggerMounted();
	}

	componentWillUnmount() {
		super.componentWillUnmount(); // call super
		this.triggerRemove();
	}

	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>): void {
		this.triggerUpdate(prevProps, prevState);
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.triggerError(error, errorInfo);
	}

	protected triggerLoad() { /* overwrite */ }
	protected triggerMounted(): void { /* overwrite */ }
	protected triggerUpdate(prevProps: Readonly<P>, prevState: Readonly<S>) { /* overwrite */ }
	protected triggerRemove() { /* overwrite */ }
	protected triggerError(error: Error, errorInfo: React.ErrorInfo) { /* overwrite */ }
}

exports.ViewController = _ViewController;

export { React };

export interface ViewController<P = {}, S = {}> {
	shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
}

export declare class ViewController<P, S> {
	static contextType?: React.Context<any>;
	readonly context: any;
	constructor(props: Readonly<P>);
	constructor(props: P, context?: any);
	setState<K extends keyof S>(
		state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
		callback?: () => void
	): void;
	forceUpdate(callback?: () => void): void;
	updateState<K extends keyof S>(state: Pick<S, K> | S, callback?: () => void): void;
	render(): React.ReactNode;
	readonly props: Readonly<P> & Readonly<{ children?: React.ReactNode }>;
	state: Readonly<S>;
	readonly refs: {
		[key: string]: ViewController<any,any> | Element;
	};
	readonly isLoaded: boolean;
	readonly isMounted: boolean;
	protected triggerLoad(): void;
	protected triggerMounted(): void;
	protected triggerUpdate(prevProps: Readonly<P>, prevState: Readonly<S>): void;
	protected triggerRemove(): void;
	protected triggerError(error: Error, errorInfo: React.ErrorInfo): void;
}