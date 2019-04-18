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

import React, { Component } from 'react';
import CMSPage from './cms-page';

export * from '..';
export { CMSPage };

require('./utils.css');
global.jQuery = global.$ = require('jquery');
global.Raphael = require('raphael');
require('nifty/plugins/sparkline/jquery.sparkline.js');
require('nifty/css/bootstrap.css');
require('nifty/js/bootstrap.js');
require('nifty/css/nifty.css');
require('nifty/plugins/magic-check/css/magic-check.css');
require('nifty/plugins/pace/pace.css');
require('nifty/plugins/pace/pace.js');
require('nifty/plugins/morris-js/morris.css');
require('nifty/plugins/morris-js/morris.js');

import { initialize, error, Router, Root } from '..';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Login from './login';
import Header from './header';
import Footer from './footer';
import Menu from './menu';
import NotFound from './404';

/**
 * @class CMSRoot
 */
export class CMSRoot extends Root {

	constructor(props) {
		super(props);
		this.state.is_404 = false;

		window.addEventListener('hashchange', e=>{
			if (this.state.is_404) {
				this._no404();
			}
		});
	}

	render() {
		var _NotFound = this.props.notFound || NotFound;

		return (
			this.state.isLoaded ?
			this.state.is_404 ? <_NotFound />:
			<HashRouter>
				<Switch>
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/404">
						<_NotFound />
					</Route>
					<Route path="/">
						<div id="container" className="effect aside-float aside-bright mainnav-lg">

							{this.header()}
							{this.menu()}

							{/* -- Content -- */}
							<Router ref="router"
								notFound={_NotFound} routes={this.props.routes}
							/>

							{this.footer()}

							<button className="scroll-top btn">
								<i className="pci-chevron chevron-up"></i>
							</button>

						</div>
					</Route>
				</Switch>
			</HashRouter>
			:
			<div className="init-loading">Loading..</div>
		);
	}

	_404() {
		this.setState({ is_404: true });
	}

	_no404() {
		this.setState({ is_404: false });
	}

	menu() {
		return <Menu />;
	}

	header() {
		return <Header />;
	}

	footer() {
		return <Footer/>;
	}

}
