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
import {hashHistory} from 'react-router-dom';
import {HashRouter, Router as RouterRaw, Route, Switch, Redirect} from 'react-router-dom';
import error from './error';
import qkit from 'qkit';
import Page from './page';
import NotFound from './404';

/**
 * @class Loading
 */
class Loading extends Component {
	render() {
		return <div> {this.props.content||''} </div>
	}
}

function route(router, { path, page, ...args }) {

	class _Route extends Component {

		state = { com: Loading, isLoaded: false };
		
		async componentDidMount() {
			if (!this.state.isLoaded) {
				try {
					var com = (await page()).default;
					qkit.assert(qkit.equalsClass(Page, com), 'TypeError');
					this.setState({ com, isLoaded: true });
				} catch(err) {
					error.defaultErrorHandle(err);
				}
			}
		}

		render() {
			var _Com = this.state.com;
			return (
				<_Com
					router={router}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			);
		}
	}

	return <Route path={path} key={path} {...args} component={_Route}/>
}

/**
 * @class Router
 */
export class Router extends Component {

	type = 'hash';

	constructor(props) {
		super(props);
		this.type = this.props.type || 'hash';
		this._Router = this.type == 'hash' ? HashRouter: RouterRaw
		this._notFound = this.props.notFound || NotFound;
		this._routes = {};
		
		(this.props.routes || []).forEach(e=>{
			if (e.path) {
				if (Array.isArray(e.path)) {
					e.path.forEach(j=>{
						this._routes[j] = { ...e, path: j };
					})
				} else {
					this._routes[e.path] = e;
				}
			}
		});
	}

	render() {
		var _Router = this._Router;
		// if (true) {
		// 	return <Redirect to="/login" />
		// }
		return (
			<_Router history={hashHistory}>
				<Switch>
					{Object.values(this._routes).map(e=>route(this, e))}
					{route(this, { page: e=>({ default:this._notFound }) })}
				</Switch>
			</_Router>
		);
	}

}

export { Page };