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
import { React } from '../lib';
import {alert} from '../lib/dialog';
import GlobalState from '../lib/state';

/**
 * @class Login
 */
export default class Login extends GlobalState<{admin?: boolean; padAll?: 'none'}> {

	private m_vcode_delay_id: any;
	state = { $$url: '', verificationtext: '获取验证码', disabledbtn: false};

	onUnload() {
		clearTimeout(this.m_vcode_delay_id);
	}

	signin() {
	}

	private changeVerificationText(text: string) {
	}

	getVerificationCodeImpl(phone: string): any {
	}

	set_vcode_delay(vcode_delay: number) {
		vcode_delay--;
		if (vcode_delay) {
			this.setState({ verificationtext: vcode_delay + '秒', disabledbtn: true });
			this.m_vcode_delay_id = 
				setTimeout(e=>this.set_vcode_delay(vcode_delay),1000);
		} else {
			this.setState({ verificationtext: '获取验证码', disabledbtn: false });
		}
	}

	async getVerificationCode() {
		if (this.state.disabledbtn) return;
		var iphone = this.getCheckPhone().replace(/\s+/g, '');
		await this.getVerificationCodeImpl(iphone);
		this.set_vcode_delay(61);
	}

	checkPhone(phone: string) {
		return (/^1[34578]\d{9}$/.test(phone))
	}

	getCheckPhone() {
		var iphone = (this.refs.uname as HTMLInputElement).value;
		utils.assert(this.checkPhone(iphone), '手机输入不正确');
		return iphone;
	}

	getCheckVcode() {
		var vcode = (this.refs.upwd as HTMLInputElement).value;
		utils.assert(/^\d{6}$/.test(vcode), '手机验证码输入不正确');
		return vcode;
	}

	showErrordialog(text: string) {
		alert(text);
	}

	render() {
		const {admin}  = this.props
		return (
			<div id="container" className="cls-container">
				{/* {this.renderContent()} */}
				{/*-- BACKGROUND IMAGE --*/}
				{/*--===================================================--*/}
				<div id="bg-overlay" className={this.state.$$url ? 'bg-img': ''} 
					style={{backgroundImage: this.state.$$url?`url(${this.state.$$url})`:'none'}}></div>
				
				{/*-- LOGIN FORM --*/}
				{/*--===================================================--*/}
				<div className="cls-content">
					<div className="cls-content-sm panel">
						<div className="panel-body">
							<div className="mar-ver pad-btm">
								<h3 className="h4 mar-no">Account Login</h3>
								<p className="text-muted">Hashii后台管理系统</p>
							</div>
							{/* <form> */}
								<div className="form-group">
									<input type="text" className="form-control" placeholder="请输入手机号" ref="uname" autoFocus />
								</div>
								<div className="form-group" style={{position: 'relative'}}>
									<input type={admin ? 'password' : 'text'} maxLength={6} className="form-control" placeholder={admin ? '请输入密码' : '请输入验证码'} ref="upwd"/>
									<button className="btn btn-default" 
										style={{position: 'absolute', top: '1px',right: '1px', padding: '4px 12px',border: 'none', display: admin ? 'none' : 'block'}} 
										onClick={()=>{this.getVerificationCode()}} disabled={this.state.disabledbtn ? true : false}>
										{this.state.verificationtext}</button>
								</div>
								
								<div className="checkbox pad-btm text-left">{/*
									<input id="demo-form-checkbox" className="magic-checkbox" type="checkbox" />
									<label htmlFor="demo-form-checkbox">Remember me</label>*/}
								</div>
								<button className="btn btn-primary btn-lg btn-block" type="submit" onClick={()=>{this.signin()}}>登录</button>
							{/* </form> */}
						</div>
				
						{this.props.padAll == 'none'?null:
						<div className="pad-all">
							<a href="pages-password-reminder.html" className="btn-link mar-rgt">Forgot password ?</a>
							<a href="pages-register.html" className="btn-link mar-lft">Create a new account</a>
				
							<div className="media pad-top bord-top">
								<div className="pull-right">
									<a href="#" className="pad-rgt"><i className="demo-psi-facebook icon-lg text-primary"></i></a>
									<a href="#" className="pad-rgt"><i className="demo-psi-twitter icon-lg text-info"></i></a>
									<a href="#" className="pad-rgt"><i className="demo-psi-google-plus icon-lg text-danger"></i></a>
								</div>
								<div className="media-body text-left">
									Login with
								</div>
							</div>
						</div>
						}
					</div>
				</div>
				{/*--===================================================--*/}
			</div>
		);
	}
}


