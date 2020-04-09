/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import * as React from 'react';
import UI from '../lib/ui';
import './dialog.css';

export default class Dialog<P = {}, S = {}> extends UI<P, S> {

	state = { animation_name: 'show', animation_duration: '300ms' }

	private get __dialog_style() {
		return {
			animationName: `${this.state.animation_name}_1`,
			animationDuration: this.state.animation_duration,
		}
	}

	private get __dialog_box_style() {
		return {
			animationName: `${this.state.animation_name}_2`,
			animationDuration: this.state.animation_duration,
		};
	}

	_close(options?: any) {
		this.setState({animationName: 'hide', animation_duration: '300ms'} as any);
		// setTimeout(e=>this.desktop._close_dialog(this, options), 300);
	}

	render(con?: any) {
		return (
			<div className="hc_dialog" style={this.__dialog_style}>
				<div className="hc_dialog_box" style={this.__dialog_box_style}>
					{con}
				</div>
			</div>
		);
	}
}