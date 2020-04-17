/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import './cell.css';
import {React} from '.';
import {ViewController} from './ctr';
import Gesture,{Event} from './gesture';

export class CellPanel extends Gesture {

	render() {
		return (
			<div ref="root" className="_cells">
			</div>
		);
	}

	renderCell(): React.ReactNode {
		return [
			<div key="0"></div>
		];
	}

	protected get $el() {
		return this.refs.root as HTMLElement;
	}

	protected triggerBeginMove(e: Event) {
		// TODO ...
	}

	protected triggerMove(e: Event) {
		if (e.begin_direction == 1) { // left
			e.cancelBubble = true;
			// TODO ...
		} else if (e.begin_direction == 3) { // rigjt
			e.cancelBubble = true;
			// TODO ...
		}
	}

	protected triggerEndMove(e: Event) {
		// TODO ...
	}

}

export class Cell extends ViewController {
	render() {
		return (
			<div className="_cell">
			</div>
		);
	}
}