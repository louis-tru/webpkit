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

import langoukit from 'langoukit';
import React, { Component } from 'react';
import sdk from 'dphoto-magic-sdk';
// import { Toast } from './antd';
import './utils.css';
import access from './access_auth';
import * as qiniu from 'qiniu-js';
import Loading from './loading';

var uploadUrl = '/service-api/utils/uploadFile';
var qiniuUptoken = async function () {
	var uptoken = await sdk.utils.qiniuUptoken();
	return uptoken;
}

export function setConfig(uptoken, upload_url) {
	qiniuUptoken = uptoken;
	uploadUrl = upload_url;
}

export async function uploadFile(file, params) {
	var url = uploadUrl; // config.serviceAPI + '/service-api/utils/uploadFile';
	var xhr = new XMLHttpRequest();

	var fd = new FormData();

	fd.append('file', file);

	for (var i in params) {
		fd.append(i, params[i]);
	}

	xhr.open('POST', url, true);
	xhr.responseType = 'json';

	var sign = access.signer.sign(url);
	for (var i in sign) {
		xhr.setRequestHeader(i, sign[i]);
	}

	return new Promise((resolve, reject)=>{
		xhr.onload = (e)=>{
			var res = xhr.response;
			if (res.code === 0) {
				resolve(res.data);
			} else {
				reject(Error.new(res, res.code));
			}
		};
		xhr.onerror = (e)=>{
			reject(Error.new('网络异常，请稍后重试'));
		};
		xhr.upload.onprogress = (e)=>{
			if (e.lengthComputable) {
				var percent = (e.loaded / e.total - 0.01) || 0;
			}
		};
		xhr.send(fd);
	});
}

export async function uploadQiniu(file, params = {}) {
	var uptoken = await qiniuUptoken(); //sdk.utils.qiniuUptoken();

	var url = await new Promise((resolve, reject)=>{
		var mat = file.name.match(/\.[a-z]+$/i);
		var key = `${new Date().toString('yyyyMMdd')}/${langoukit.random()}${langoukit.random()}${mat[0]}`;
		var subscription = qiniu.upload(file, key, uptoken.token, {
			fname: '',
			params: params,
			mimeType: null,
		}, {
			useCdnDomain: true,
			region: qiniu.region.z0,
		}).subscribe(r=>{ // progress
			// r.total.percent
		}, e=>{ // err
			reject(e);
		}, async e=>{ // ok
			resolve(uptoken.domain + '/' + e.key);
		});
	});

	return url;
}

export default class Upload extends Component {
	state = { src: '' };

	m_handle_change = async (e)=>{
		var file = e.target.files[0];
		if (!file) return;
		var name = file.name;
		if (/\.(jpeg|jpg|png|gif)$/i.test(file.name)) {
			this.m_onStartUpload(file);
			Loading.show('上传中..', this.m_id);
			try {
				var src = await uploadQiniu(file);
			} finally {
				Loading.close(this.m_id);
			}
			this.m_onChange(src, this.value);
			this.setState({ src });
		} else {
			// Toast.info('请选择正确图片格式！');
		}
	}

	m_onChange(src, raw) {
		if (this.props.onChange) {
			this.props.onChange(src, raw);
		}
	}

	m_onStartUpload(file) {
		if (this.props.onStartUpload) {
			this.props.onStartUpload(file);
		}
	}

	m_onError(err) {
		if (this.props.onError) {
			this.props.onError(err);
		}
	}

	get value() {
		return this.state.src || this.props.src || this.props.value || '';
	}

	componentDidMount() {
		this.m_id = `upload_${langoukit.iid}`;
		this.setState({ src: this.props.src || this.props.value || '' });
	}

	render() {
		var cls = this.props.className || this.props.class;
		var src = this.value;

		var style = {};

		if (!this.props.noShow) {
			var size = this.props.size ? 
				`?imageMogr/auto-orient/thumbnail/${this.props.size}`: '';
			style = {
				...(src?{backgroundImage: `url(${src}${size})`}:{}),
				backgroundSize: '100%',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
			};
		}

		return (
			<div className={`g_upload ${cls}`} style={style}>
				<input accept="image/*" type="file" onChange={this.m_handle_change} style={{
					width: '100%',
					height: '100%',
					opacity: 0.01,
				}} />
				{/*this.props.children*/}
				<div class="upload_icon"></div>
			</div>
		);
	}

}