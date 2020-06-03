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

import utils from 'nxkit';
import * as React from 'react';
import GlobalState from './state';
import { Component } from 'react';

const persistentState = new Map<string, any>();

interface ViewControllerDefine<P = {}, S = {}> {
	shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
}

declare class ViewControllerDefine<P = {}, S = {}> {
	static contextType?: React.Context<any>;
	readonly context: any;
	readonly persistentID: string;
	constructor(props: Readonly<P>);
	constructor(props: P, context?: any);
	setState<K extends keyof S>(
		state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
		callback?: () => void
	): void;
	protected saveState(): any;
	protected recoveryState(): void;
	forceUpdate(callback?: () => void): void;
	render(): React.ReactNode;
	readonly props: Readonly<P> & Readonly<{ children?: React.ReactNode }>;
	state: Readonly<S>;
	readonly refs: {
		[key: string]: ViewControllerDefine<any,any> | Element;
	};
	readonly isLoaded: boolean;
	readonly isMounted: boolean;
	protected triggerLoad(): void;
	protected triggerMounted(): void;
	protected triggerUpdate(prevProps: Readonly<P>, prevState: Readonly<S>): void;
	protected triggerRemove(): void;
	protected triggerError(error: Error, errorInfo: React.ErrorInfo): void;
}

class ViewControllerIMPL<P = {}, S = {}> extends GlobalState<P, S> {
	private m_mounted?: boolean;
	private m_loaded?: boolean;

	get isLoaded() {
		return !!this.m_loaded;
	}

	get isMounted() {
		return !!this.m_mounted;
	}

	get persistentID() {
		var id = (this.constructor as any).__persistentID__ as string;
		if (!id) {
			(this.constructor as any).__persistentID__ = id = String(utils.getId());
		}
		return id;
	}

	protected saveState(): any {
		return null;
	}

	protected recoveryState(): any {
		return persistentState.get(this.persistentID);
	}

	protected __initialize__() {
		var state = this.recoveryState();
		if (state) {
			this.state = Object.assign(this.state || {}, state);
			Component.prototype.setState.call(this, state);
		}

		super.__initialize__(); // call super

		var r = this.triggerLoad() as any; // trigger event Load
		if (r instanceof Promise) {
			r.then(()=>{
				this.m_loaded = true;
				this.forceUpdate();
			});
		} else {
			this.m_loaded = true;
			this.forceUpdate();
		}
	}

	async componentDidMount() {
		this.m_mounted = true;
		await Promise.resolve();
		this.triggerMounted();
	}

	componentWillUnmount() {
		var state = this.saveState();
		if (state) {
			persistentState.set(this.persistentID, state);
		} else {
			persistentState.delete(this.persistentID);
		}
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

export { React };

export const ViewController = ViewControllerIMPL as unknown as typeof ViewControllerDefine;