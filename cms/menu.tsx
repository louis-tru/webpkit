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

import { React, Link } from '../lib';
import {ViewController} from '../lib/ctr';
import {history} from '../lib/router';

export interface MenuInfo {
	icon?: string;
	title: string;
	go?: string;
	bold?: boolean|number;
	selected?: boolean|number;
	expanded?: boolean|number;
	num?: number;
	children?: (MenuInfo|string)[];
}

export default class Menu extends ViewController {

	private m_UnregisterCallback: any;

	state = { pathname: history.location.pathname };

	constructor(props: any) {
		super(props);
	}

	protected reloadNifty() {
		require('cport-nifty/js/nifty.js');
		(jQuery as any).niftyNav('bind');
	}

	setState(state: any) {
		super.setState(state);
		setTimeout(()=>this.reloadNifty(), 200);
	}

	get pathname () {
		return this.state.pathname;
	}

	triggerLoad() {
		this.m_UnregisterCallback = history.listen(()=> {
			this.setState({ pathname: history.location.pathname });
		});
	}

	triggerRemove() {
		this.m_UnregisterCallback();
	}

	private _renderMenuList(list: any[], level: number, out: any) {
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
						onClick={()=> e.go&&this.setState({ pathname: e.go })}>
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

	renderMain(): (MenuInfo|string)[] {
		return [];
	}

	renderProfile(): any {
		return null;
	}

	renderShortcut(): any {
		return null;
	}
	
	renderWidget(): any {
		return null;
	}
}
