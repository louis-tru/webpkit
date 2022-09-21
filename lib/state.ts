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

import { Component } from 'react';
import storage from 'somes/storage';

var global_state_components = new Map<GlobalState, Set<string>>();
var global_states: Dict = {};

function set_global_state_value(name: string, value: any) {
	global_states[name] = value;
	if (name[1] == '$') {
		storage.set('global_state_' + name, value);
	}
}

function fillGlobalStateValue(self: GlobalState) {
	var set = new Set<string>();
	var state = self.state;
	if (state) {
		var change = false;
		for (var name of Object.keys(state)) {
			if (name[0] == '$') {
				if ( name[1] == '$' ) {
					if (!(name in global_states)) {
						global_states[name] = storage.get('global_state_' + name);
					}
				}
				if (name in global_states) {
					var fill_value = global_states[name];
					if (fill_value !== state[name]) {
						change = true;
						state[name] = fill_value;
					}
				} else {
					set_global_state_value(name, state[name]);
				}
				set.add(name);
			}
		}
		if (change) {
			Component.prototype.setState.call(self, state);
		}
	}
	return set;
}

export function getGlobalState(name: string) {
	var r = global_states[name];
	if (r === undefined) {
		global_states[name] = r = storage.get('global_state_' + name);
	}
	return r;
}

export function setGlobalState(state: any, self?: GlobalState, callback?: ()=>void) {
	if (!state) return;

	var global_state = [];

	for (var name of Object.keys(state)) {
		if (name[0] == '$') {
			global_state.push(name);
			set_global_state_value(name, state[name]);
		}
	}

	if (global_state.length) {
		for (var [com,set] of global_state_components) {
			if (com !== self) {
				var _state: Dict = {}, update = false;

				for ( var name of global_state ) {
					if (set.has(name)) {
						update = true;
						_state[name] = global_states[name];
					}
				}
				if (update) {
					Component.prototype.setState.call(com, _state);
				}
			}
		}
	}

	if (self) {
		Component.prototype.setState.call(self, state, callback);
	}
}

/**
 * @class GlobalState
 */
export default class GlobalState<P = {}, S = {}> extends Component<P, S> {
	private _IsGlobal?: boolean;
	public state = {} as any;

	setState(state: S, callback?: ()=>void) {
		GlobalState.setGlobalState(state, this as GlobalState, callback);
	}

	UNSAFE_componentWillMount() {
		this.__initialize__();
	}

	protected __initialize__() {
		if (!global_state_components.has(this as GlobalState)) {
			var set = fillGlobalStateValue(this as GlobalState);
			if (set.size) {
				global_state_components.set(this as GlobalState, set);
				this._IsGlobal = true;
			}
		}
	}

	componentWillUnmount() {
		if (this._IsGlobal)
			global_state_components.delete(this as GlobalState);
	}

	static getGlobalState(name: string) {
		return getGlobalState(name);
	}

	static setGlobalState(state: any, self?: GlobalState, callback?: ()=>void) {
		setGlobalState(state, self, callback);
	}

}