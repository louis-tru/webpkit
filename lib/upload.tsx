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

import somes from 'somes';
import path from 'somes/path';
import * as React from 'react';
import {ViewController} from './ctr';
import store from './store';
import './utils.css';
import access from './auth';
import Loading from './loading';
// import { Toast } from './antd';

const qiniu = require('qiniu-js');

export interface QiniuUptoken {
	token: string;
	domain: string;
}

var uploadUrl = '/service-api/utils/uploadFile';
var qiniuUptoken = async function () {
	var uptoken = await store.utils.methods.qiniuUptoken();
	return uptoken as QiniuUptoken;
}

export function setConfig(uptoken: ()=>Promise<QiniuUptoken>, upload_url: string) {
	qiniuUptoken = uptoken;
	uploadUrl = upload_url;
}

export async function uploadFile(file: File, params?: Dict) {
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

export async function uploadQiniu(file: File, params: Dict = {}) {
	var uptoken = await qiniuUptoken(); //sdk.utils.qiniuUptoken();

	var url = await new Promise((resolve, reject)=>{
		// var mat = file.name.match(/\.[a-z0-9]+$/i);
		var extname = path.extname(file.name);
		var key = `${new Date().toString('yyyyMMdd')}/${somes.random()}${somes.random()}${extname}`;
		var subscription = qiniu.upload(file, key, uptoken.token, {
			fname: '',
			params: params,
			mimeType: null,
		}, {
			useCdnDomain: true,
			region: qiniu.region.z0,
		}).subscribe((r:any)=>{ // progress
			// r.total.percent
		}, (e:any)=>{ // err
			reject(e);
		}, async (e: any)=>{ // ok
			resolve(uptoken.domain + '/' + e.key);
		});
	});

	return url as string;
}

export interface UploadProps {
	onStartUpload?: (file: File)=>void;
	onChange?: (src: string, raw: string)=>void;
	onError?: (err: Error)=>void;
	src?: string;
	value?: string;
	size?: number;
	class?: string;
	className?: string;
	noShow?: boolean;
	accept?: string;
}

export default class Upload extends ViewController<UploadProps, Dict> {
	state = { src: '' };
	private m_id: string = '';

	private m_handle_change = async (e:any)=>{
		var file = e.target.files[0];
		if (!file) return;
		var name = file.name;
		// if (/\.(jpeg|jpg|png|gif)$/i.test(file.name)) {
		this.m_onStartUpload(file);
		Loading.show('上传中..', this.m_id);
		try {
			var src = await uploadQiniu(file);
		} finally {
			Loading.close(this.m_id);
		}
		this.m_onChange(src, this.value);
		this.setState({ src });
		// } else {
			// Toast.info('请选择正确图片格式！');
		// }
	}

	private m_onChange(src: string, raw: string) {
		if (this.props.onChange) {
			this.props.onChange(src, raw);
		}
	}

	private m_onStartUpload(file: File) {
		if (this.props.onStartUpload) {
			this.props.onStartUpload(file);
		}
	}

	private m_onError(err: any) {
		if (this.props.onError) {
			this.props.onError(err);
		}
	}

	get value() {
		return this.state.src || this.props.src || this.props.value || '';
	}

	triggerLoad() {
		this.m_id = `upload_${somes.getId()}`;
		this.setState({ src: this.props.src || this.props.value || '' });
	}

	render() {
		var cls = this.props.className || this.props.class;
		var src = this.value;
		var accept = this.props.accept || 'image/*';
		var style = {};
		var defaultImage = ''

		if (src && !/\.(jpeg|jpg|png|gif)$/i.test(src)) {
			src = '';
			defaultImage = 'defaultImage';
		}

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
			<div className={`g_upload ${cls} ${defaultImage}`} style={style}>
				<input accept={accept} type="file" onChange={this.m_handle_change} style={{
					width: '100%',
					height: '100%',
					opacity: 0.01,
				}} />
				{/*this.props.children*/}
				<div className="upload_icon"></div>
			</div>
		);
	}

}