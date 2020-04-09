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

import 'nxkit';
import * as React from 'react';
import CMSPage, {CMSDataPage} from './page';
import * as jq from 'jquery';
import * as raphael from 'raphael';
import './util.css';

const glob = globalThis as any;

glob.jQuery = glob.$ = jq;
glob.Raphael = raphael;

import './_ext';
// import '../nifty/plugins/sparkline/jquery.sparkline.js';
import 'cport-nifty/css/bootstrap.min.css';
import 'cport-nifty/js/bootstrap.js';
import 'cport-nifty/plugins/font-awesome/css/font-awesome.min.css';
import 'cport-nifty/css/nifty.min.css';
import 'cport-nifty/plugins/magic-check/css/magic-check.css';
import 'cport-nifty/plugins/pace/pace.css';
import 'cport-nifty/plugins/pace/pace.js';
import 'cport-nifty/plugins/morris-js/morris.css';
import 'cport-nifty/plugins/morris-js/morris.js';
// import '../nifty/css/demo/nifty-demo-icons.css';
// import '../nifty/css/demo/nifty-demo.css';

import { Router as MyRouter, Root, RootProps } from '../lib';
import {Router, Route, Switch} from 'react-router-dom';
import Login from './login';
import Menu from './menu';
import Header from './header';
import Footer from './footer';
import ExamplesMenu from './test/cms-menu';
import NotFound from './404';

export * from '../lib';
export { CMSPage, CMSDataPage, Header, Footer, Menu, Login };

export interface CMSRootProps extends RootProps {
	login?: JSX.Element;
	menu?: JSX.Element;
	header?: JSX.Element;
	footer?: JSX.Element;
}

export class CMSRoot<P extends CMSRootProps = CMSRootProps, S = {}> extends Root<P, S> {

	constructor(props: P) {
		super(props);
		this.history.listen(()=> {
			if ((this.state as any).__is_404) {
				this._no404();
			}
		});
	}

	render() {
		var _NotFound = this.props.notFound || NotFound as any;

		return (
			this.isLoaded ?
			(this.state as any).__is_404 ? <_NotFound />:
			<Router history={this.history}>
				<Switch>

					<Route path="/login">
						{this.login()}
					</Route>

					<Route path="/404">
						<_NotFound />
					</Route>

					<Route path="/">
						<div id="container" className="effect aside-float aside-bright mainnav-lg">

							{this.header()}
							{this.menu()}
							
							{/* -- Content -- */}
							<MyRouter ref="router" notFound={_NotFound} routes={this.props.routes} />

							{this.footer()}

							<button className="scroll-top btn">
								<i className="pci-chevron chevron-up"></i>
							</button>

						</div>
					</Route>

				</Switch>
			</Router>
			:
			<div className="init-loading">Loading..</div>
		);
	}

	_404() {
		this.setState({ __is_404: true } as any);
	}

	_no404() {
		this.setState({ __is_404: false } as any);
	}

	login() {
		return this.props.login || <Login />;
	}

	menu() {
		return this.props.menu || <ExamplesMenu />;
	}

	header() {
		return this.props.header || <Header />;
	}

	footer() {
		return this.props.footer || <Footer />;
	}

}
