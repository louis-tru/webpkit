/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2019-01-10
 */

import utils from 'nxkit';
import {React,Component} from 'cport-h5/lib';
import './director.css';
import { Desktop, hasDesktop, desktop as getCurrentDesktop } from './index';

var _cur: Director | null = null;

/**
 * @class Director
 */
export default class Director extends Component<{width?: number|string, height?: number|string}, S> {
	state = { ch__: 0, desktop_count: 0 };
	private _width: number|string;
	private _height: number|string;
	private _desktop: any[] = [];

	private static gen_slots(self: Director) {
		self._desktop.forEach(({desk, options}, i)=>{
			self.$slots[`desktop_${i+1}`] = self.$createElement(desk, { attrs: options });
		});
		self.setState({ ch__: self.state.ch__+1, desktop_count: self._desktop.length });
	}

	componentWillMount() {
		utils.assert(!current);
		_cur = this;
		this._width = this.props.width || '100%';
		this._height = this.props.height || '100%';
	}

	componentDidMount() {
		utils.assert(_cur === this);
		_cur = null;
	}

	private _cls(i: number) {
		if (this._desktop.length == 1) {
			return '';
		} else {
			return this._desktop.length == i ? 'hc_director_in' : ''
		}
	}

	/**
	 * @func switch desktop
	 */
	switch(desk: any, options: any) {
		var data = { desk, options, style: '', id: utils.id };
		if (this._desktop.find(e=>e.desk === desk)) {
			this._desktop = [data];
			gen_slots(this);
		} else {
			this._desktop.push(data);
			gen_slots(this);
			if (this._desktop.length > 1) {
				setTimeout(e=>{
					if (this._desktop.length) {
						this._desktop = [this._desktop.indexReverse(0)];
						gen_slots(this);
					}
				}, 400);
			}
		}
	}

	render() {
		var width = this._width;
		var height = this._height;
		return (
			<div ref="panel" style={{width, height}} className="hc_director">
				{
					this._desktop.map((e,j)=>{
						return (
							<div
								key={j}
								style={{width,height}}
								className={this._cls(j+1)}
							>
								{/* <slot :name="`desktop_${index+1}`" /> */}
							</div>
						);
					})
				}
			</div>
		);
	}

	static get current() {
		utils.assert(current, 'no current Director');
		return _cur as Director;
	}

}

export function current() {
	return Director.current;
}