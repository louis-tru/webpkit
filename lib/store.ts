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

import Store, {Descriptors} from 'somes/store';
import path from 'somes/path';
import {Signer} from 'somes/request';
import { sha256 } from 'somes/hash';
import buffer, { IBuffer } from 'somes/buffer';

const crypto_tx = require('crypto-tx');

export class DefaultSigner implements Signer {
	readonly authName: string;
	readonly privKey: IBuffer;

	constructor(user: string, keyHex: string) {
		this.authName = user;
		this.privKey = buffer.from(keyHex, 'hex');
	}

	sign(path: string, data: string) {
		var st = Date.now();
		var key = "a4dd53f2fefde37c07ac4824cf7085439633e1a357daacc3aaa16418275a9e40";
		var msg = (data) + st + key;
		var hash = sha256(msg);

		var signature = crypto_tx.sign(hash, this.privKey);
		var sign = buffer.concat([signature.signature, [signature.recovery]]).toString('base64');

		return {
			st: String(st),
			sign: sign,
			'auth-name': this.authName,
		};
	}
}

export async function make({
	url = 'http://127.0.0.1:8091/service-api', signer, name, store, descriptors }: {
	url?: string; signer?: Signer; name?: string; store?: Store; descriptors?: Dict<Descriptors>,
}) {
	var _store = store || new Store(name);
	if (_store.isLoaded) return _store;
	var urlObj = new path.URL(url);
	await _store.initialize({
		host: urlObj.hostname, 
		port: urlObj.port,
		ssl: /^(http|ws)s/.test(urlObj.protocol), 
		prefix: urlObj.filename,
		descriptors,
	});
	if (signer) {
		_store.setSigner(signer);
	}
	return _store;
}