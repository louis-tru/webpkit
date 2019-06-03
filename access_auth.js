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

import crypto from 'crypto-tx';
import hash_js from 'hash.js';
import { Buffer } from 'buffer';
import { Signer } from 'qkit/request';
import storage from 'qkit/storage';

var privateKeyBytes;
var publicKeyBytes;
var publicKey;

var hex = storage.get('access_auth_key');
if (hex) { // use priv 
	genAccessKey_0(Buffer.from(hex, 'hex'));
} else {
	genAccessKey();
}

function genAccessKey_0(privatekey) {
	privateKeyBytes = privatekey;
	publicKeyBytes = crypto.getPublic(privatekey, true);
	publicKey = '0x' + publicKeyBytes.toString('hex');
}

function genAccessKey() {
	genAccessKey_0(crypto.genPrivateKey());
	storage.set('access_auth_key', privateKeyBytes.toString('hex'));
}

/**
 * @class H5Signer
 */
class H5Signer extends Signer {

	setExtra(extra) {
		this.m_extra = extra;
	}

	sign(url, data_str = null) {
		var st = Date.now();
		var fuzz_key = '0a37eb70c1737777bc111d03af4fcd091bc6d913baa2f90316511c61943dbce2';
		var sha256 = hash_js.sha256();
		if (data_str) {
			sha256.update(data_str);
		}
		url = url.replace(/^.+\/service-api\//, '/service-api/');
		sha256.update(st + fuzz_key + url);

		var message = Buffer.from(sha256.digest());
		var { signature, recovery } = crypto.sign(message, privateKeyBytes);
		var sign = new Buffer(65);

		signature.copy(sign);
		sign[64] = recovery;

		return Object.assign({
			st, sign: sign.toString('base64'),
		}, this.m_extra);
	}
}

var signer = new H5Signer();

export default {
	genAccessKey,
	signer,
	get publicKeyBytes() { return publicKeyBytes },
	get publicKey() { return publicKey },
};
