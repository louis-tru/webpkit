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

import utils from 'somes';
import * as React from 'react';
import { Component } from 'react';
import { Router as RouterRaw, Route as RouteRaw, Switch } from 'react-router-dom';
import handles from './errno_handles';
import somes from 'somes';
import Page, {History, Loading} from './page';
import NotFound from './404';
import * as _history from 'history';
import { match } from 'react-router';

export const history = _history.createBrowserHistory();

function newRoute(router: Router, { path, page, ...args }: { path: string, page: ()=>Promise<{ default: typeof Page }> } & Dict) {

	class InlRoute extends Component<{location: any, match: match}> {

		state = { com: Loading, isLoaded: false };

		async componentDidMount() {
			if (!this.state.isLoaded) {
				try {
					var com = (await page()).default;
					somes.assert(somes.equalsClass(Page, com), 'Page TypeError, somes.equalsClass(Page, com)');
					this.setState({ com, isLoaded: true });
				} catch(err: any) {
					handles(err);
				}
			}
		}

		render() {
			var Com = this.state.com as any;
			return (
				<Com
					router={router}
					history={history}
					location={this.props.location}
					match={this.props.match}
				/>
			);
		}
	}

	return <RouteRaw path={path} key={path} {...args} component={InlRoute} />
}

export interface Route extends Dict {
	path: string | string[];
	page(): Promise<any/*{ default: typeof Page }*/>;
	exact?: boolean;
}

export class Router extends Component<{notFound?: typeof Page, routes?: Route[] }> {
	private _routes: Dict = {};
	private _notFound: typeof Page;
	private _current: Page | null = null;
	private _history: History;

	constructor(props: any) {
		super(props);
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
		this._history = history;//_history.createBrowserHistory();
		this._notFound = this.props.notFound || NotFound as typeof Page;
	}

	get current(): Page {
		utils.assert(this._current);
		return this._current as Page;
	}

	get history() {
		return this._history;
	}

	render() {
		var notFound = { path: '', page: async ()=>({ default: this._notFound }) };
		return (
			<RouterRaw history={this._history}>
				<Switch>
					{Object.values(this._routes).map(e=>newRoute(this, {exact: true, ...e}))}
					{newRoute(this, notFound)}
				</Switch>
			</RouterRaw>
		);
	}

}