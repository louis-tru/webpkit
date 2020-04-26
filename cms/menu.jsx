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

import { React, Page, Link, Component } from '..';
import GlobalState from '../global-state';

/**
 * @class Menu
 */
export default class Menu extends GlobalState {

	state = { pathname: location.pathname };

	reloadNifty() {
		jQuery.niftyNav('bind');
	}

	setState(state) {
		super.setState(state);
		setTimeout(e=>this.reloadNifty(), 200);
	}
	get pathname () {
		return this.state.pathname;
	}
	componentDidMount() {
		this.m_interval_id = setInterval(e=>{
			if (this.pathname != location.pathname) {
				super.setState({ pathname: location.pathname });
			}
		}, 500);
	}

	componentWillUnmount() {
		clearInterval(this.m_interval_id);
	}
	_renderMenuList(list, level, out) {
		return list.map((e,j)=>{
			var key= `key_${level}_${j}`;
			if (typeof e == 'string') {
				if (e == '-') {
					return <li className="list-divider" key={key}></li>;
				} else {
					return <li className="list-header" key={key}>{e}</li>;
				}
			} else {
				var children = e.children || [];
				var In = { selected: false };
				var ch = this._renderMenuList(children, level+1, In);

				var current = !!(e.go && e.go == this.pathname);
				var selected = In.selected || current;
				if (selected) out.selected = 1;
				var expanded = e.expanded || selected;
				
				return (
					<li className={(selected?'active-link ': '') + (expanded?'active':'')} key={key} 
						onClick={(e)=> e.go&&this.setState({ pathname: e.go })}>
						<Link to={children.length ? '#': e.go || '#'} className={current?'hover':''}>
							<i className={e.icon||''}></i>
							<span className="menu-title">
								{
									e.bold&&!level ? <strong>{e.title}</strong>:e.title}
									{e.label?<span className={
										`label pull-right ` + (e.color&&e.color[0]!='#'?e.color:'')
									} style={
										e.color&&e.color[0]=='#'?{ background: e.color }:{}
									}>{e.label}</span>: !children.length&&('num'in e) ?
									<span className="pull-right badge badge-warning">{e.num}</span>: null
								}
							</span>
							{children.length&&!e.label ? <i className="arrow"></i>: null}
						</Link>
						{
							children.length ? 
							<ul className={'collapse ' + (expanded?'in':'')}>{ch}</ul>: null
						}
					</li>
				);
			}
		});
	}

	render() {
		return (
			<nav id="mainnav-container">
				<div id="mainnav">
					<div id="mainnav-menu-wrap">
						<div className="nano">
							<div className="nano-content" style={{paddingTop: 0}}>
								{ this.renderProfile() }
								{ this.renderShortcut() }
								<ul id="mainnav-menu" className="list-group">
									{ this._renderMenuList(this.renderMain(), 0, { selected: 0 }) }
								</ul>
								{ this.renderWidget() }
							</div>
						</div>
					</div>
				</div>
			</nav>
		)
	}
	renderMain() {
		return [];
	}
	renderProfile() {
		return null;
	}

	renderShortcut() {
		return null;
	}
	
	renderWidget() {
		return null;
	}
}
