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
import storage from 'qkit/storage';

var __id = 0;
var global_state_components = {};
var global_state_components_arr = [];
var global_states = {};

function set_global_state_value(name, value) {
	global_states[name] = value;
	if (name[1] == '$') {
		storage.set(name, value);
	}
}

function fill_global_state_value(self, trigger) {
	var change = false;
	self._global_state_key = '|';
	for (var name in self.state) {
		if (name[0] == '$') {
			if ( !(name in global_states) && name[1] == '$' ) {
				global_states[name] = storage.get(name);
			}
			if (name in global_states) {
				var fill_value = global_states[name];
				if (trigger) {
					if (fill_value !== self.state[name]) {
						change = true;
						self.state[name] = fill_value;
					}
				} else {
					self.state[name] = fill_value;
				}
			} else {
				set_global_state_value(name, self.state[name]);
			}
			self._global_state_key += name + '|';
		}
	}
	if (change) {
		Component.prototype.setState.call(self, self.state);
	}
}

function registerState(self) {
	if (!self.__id) {
		self.__id = ++__id;
		global_state_components[self.__id] = self;
		fill_global_state_value(self, true);
	}
}

function unregisterState(self) {
	if (self.__id) {
		delete global_state_components[self.__id];
		global_state_components_arr = Object.values(global_state_components);
	}
}

function setGlobalState(self, state) {
	var global_state = [];

	for (var name in state) {
		if (name[0] == '$') {
			var val = state[name];
			global_state.push(name);
			set_global_state_value(name, val);
		}
	}

	var r = Component.prototype.setState.call(self, state);

	if (global_state.length) {
		for (var com of global_state_components_arr) {
			if (com !== self) {
				var key = com._global_state_key;
				var state = {}, ok = false;

				for ( var name of global_state ) {
					if (key.indexOf('|' + name + '|') >= 0) {
						ok = true;
						state[name] = global_states[name];
					}
				}
				if (ok) {
					Component.prototype.setState.call(com, state);
				}
			}
		}
	}

	return r;
}

/**
 * @class GlobalState
 */
export default class GlobalState extends Component {

	setState(state) {
		return setGlobalState(this, state);
	}

	componentDidMount() {
		registerState(this);
	}

	componentWillUnmount() {
		unregisterState(this);
	}

}