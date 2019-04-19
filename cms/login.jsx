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

import CMSPage from './cms-page';
import { Root, React } from '..';

import 'nifty/css/demo/nifty-demo-icons.css';
import 'nifty/css/demo/nifty-demo.css';

/**
 * @class Login
 */
export default class Login extends CMSPage {

	state = { $$url: '', };

	onLoadNifty() {

		var $imgHolder 	= $('#demo-bg-list');
		var $bgBtn 		= $imgHolder.find('.demo-chg-bg');
		var $target 	= $('#bg-overlay');
		var self = this;

		$bgBtn.on('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			var $el = $(this);
			if ($el.hasClass('active') || $imgHolder.hasClass('disabled')) return;
			if ($el.hasClass('bg-trans')) {
				self.setState({ $$url: '' });

				// $target.css('background-image','none').removeClass('bg-img');
				$imgHolder.removeClass('disabled');
				$bgBtn.removeClass('active');
				$el.addClass('active');

				return;
			}

			$imgHolder.addClass('disabled');
			var url = $el.attr('src').replace('/thumbs','');

			$('<img/>').load(url, function(){

				self.setState({ $$url: url });

				// $target.css('background-image', 'url("' + url + '")').addClass('bg-img');
				$imgHolder.removeClass('disabled');
				$bgBtn.removeClass('active');
				$el.addClass('active');

				$(this).remove();
			})

		});

	}

	render() {
		return (
			<div id="container" className="cls-container">
				
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
								<p className="text-muted">Sign In to your account</p>
							</div>
							<form action="index.html">
								<div className="form-group">
									<input type="text" className="form-control" placeholder="Username" autoFocus />
								</div>
								<div className="form-group">
									<input type="password" className="form-control" placeholder="Password" />
								</div>
								<div className="checkbox pad-btm text-left">
									<input id="demo-form-checkbox" className="magic-checkbox" type="checkbox" />
									<label for="demo-form-checkbox">Remember me</label>
								</div>
								<button className="btn btn-primary btn-lg btn-block" type="submit">Sign In</button>
							</form>
						</div>
				
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
					</div>
				</div>
				{/*--===================================================--*/}
				
				
				{/*-- DEMO PURPOSE ONLY --*/}
				{/*--===================================================--*/}
				<div className="demo-bg">
					<div id="demo-bg-list">
						<div className="demo-loading"><i className="psi-repeat-2"></i></div>
						<img className="demo-chg-bg bg-trans active" src="nifty/img/bg-img/thumbs/bg-trns.jpg" alt="Background Image" />
						<img className="demo-chg-bg" src="nifty/img/bg-img/thumbs/bg-img-1.jpg" alt="Background Image" />
						<img className="demo-chg-bg" src="nifty/img/bg-img/thumbs/bg-img-2.jpg" alt="Background Image" />
						<img className="demo-chg-bg" src="nifty/img/bg-img/thumbs/bg-img-3.jpg" alt="Background Image" />
						<img className="demo-chg-bg" src="nifty/img/bg-img/thumbs/bg-img-4.jpg" alt="Background Image" />
						<img className="demo-chg-bg" src="nifty/img/bg-img/thumbs/bg-img-5.jpg" alt="Background Image" />
						<img className="demo-chg-bg" src="nifty/img/bg-img/thumbs/bg-img-6.jpg" alt="Background Image" />
						<img className="demo-chg-bg" src="nifty/img/bg-img/thumbs/bg-img-7.jpg" alt="Background Image" />
					</div>
				</div>
				{/*--===================================================--*/}
				
				
				
			</div>
		);
	}
}


