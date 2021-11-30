/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import './cell.css';
import utils from 'somes';
import {React} from '.';
import {ViewController} from './ctr';
import Gesture,{Event as GEvent} from './gesture';
import {EventNoticer, Event} from 'somes/event';

interface CellDom { type: CellConstructor; props: any, key?: any; ref?: any; }

const transitionDuration = 500;

export class CellPanel<P = {}> extends Gesture<P & {
	index?: number;
	bounce?: boolean;
	preloading?: number;
	transitionDuration?: number;
	className?: string;
}> {

	private _count = 0;
	private __index = Number(this.props.index) || 0;
	private _bounce = !!Number(this.props.bounce);
	private __preloading = Math.max(1, Number(this.props.preloading) || 1);
	private _cells = new Set<Cell>();

	private get _index() {
		return this.__index;
	}

	private _reallyIndex(index: number) {
		var count = this._count;
		return (((index % count) + count) % count);
	}

	private setIndex(index: number, isCall: boolean = false) {
		index = Number(index);
		var reallyIndex = this._reallyIndex(index);
		if (reallyIndex !== this._reallyIndex(this.__index) || !this.isMounted) {
			if (index > this._maxIndex || index < this._minIndex) {
				if (!isCall)
					if (this._count < 3) return;
				this.__index = reallyIndex;
			} else {
				this.__index = index;
			}
			utils.nextTick(()=>this.forceUpdate(()=>{
				for (var cell of this._cells) {
					if (cell.index == reallyIndex) {
						(cell as any)._resume(); // private visit
					} else {
						(cell as any)._pause(); // private visit
					}
				}
				this.onSwitch.trigger(index);
			}));
		}
	}

	private get _maxIndex() {
		return this._count < 3 ? Math.max(this._count - 1, 0): 1000;
	}

	private get _minIndex() {
		return this._count < 3 ? 0: -1000;
	}

	private get _max() {
		return this._maxIndex * this.clientWidth;
	}

	private get _min() {
		return this._minIndex * this.clientWidth;
	}

	private _cellsDom() {
		var cells = [] as CellDom[];
		var child = this.props.children;
		if (child) {
			cells = (Array.isArray(child) ? child : [child]) as any;
		}
		return cells;
	}

	private _preloading(count: number) {
		return Math.min(this.__preloading, Math.floor((count - 1) / 2));
	}

	private _displayRange(index: number, count: number): number[] {
		if (count < 3) {
			if (count == 1) {
				this.__index = 0;
				return [0];
			} else if (count == 2) {
				this.__index = this._reallyIndex(index);
				return [0, 1];
			}
			return [];
		}

		var preloading = this._preloading(count);
		var range = [];

		for (var i = index - preloading, j = index + preloading * 2; i < j; i++) {
			range.push(i);
		}
		return range;
	}

	private _renderChild() {
		var cells = this._cellsDom();
		var count = this._count = cells.length;
		var range = this._displayRange(this._index, count);

		return range.map((index)=>{
			var reallyIndex = this._reallyIndex(index);
			var cell = cells[reallyIndex];
			utils.assert( utils.equalsClass(Cell, cell.type), 'CellPanel.props.children type error' );
			// console.log(cell.key || reallyIndex)
			var key = cell.key || reallyIndex;
			var x = index * 100 + '%';
			var E = {
				...cell,
				props: {
					...cell.props,
					panel: this,
					__index: reallyIndex,
					key: key,
					__left: x,
				}
			};
			return E;
		});
	}

	readonly onSwitch = new EventNoticer<Event<CellPanel<P>, number>>('Switch', this);

	get transitionDuration() {
		return Number(this.props.transitionDuration) || transitionDuration;
	}

	get count() {
		return this._count;
	}

	get index() {
		return this._index;
	}

	get reallyIndex() {
		return this._reallyIndex(this._index);
	}

	set index(val: number) {
		this.switchAt(val);
	}

	cellAt(index: number) {
		for (var cell of this._cells) {
			if (cell.index == index) {
				return cell;
			}
		}
		return null;
	}

	switchAt(index: number, animate = true) {
		index = Number(index);
		if (this._index != index) {
			this.setIndex(index, true);
			(this.refs.cells as HTMLElement).
				style.transitionDuration = animate ? `${this.transitionDuration}ms` : '0ms';
		}
	}

	get current() {
		var cell = this.cellAt(this._index) as Cell;
		utils.assert(cell);
		return cell;
	}

	render() {
		var cells = this._renderChild();
		return (
			<div ref="root" className={"_cells_panel "+(this.props.className?this.props.className:'')}>
				<div ref="cells" className="_cells" style={{
					transform: `translateX(${(-this._index)*100}%)`,
				}}>{cells}</div>
			</div>
		);
	}

	protected get $el() {
		return this.refs.root as HTMLElement;
	}

	private _beginX = -1;

	protected triggerMove(e: GEvent) {
		if (e.begin_direction == 1 || e.begin_direction == 3) { // left / rigjt

			var cells = this.refs.cells as HTMLElement;

			if (this._beginX == -1) {
				var style = getComputedStyle(cells);
				var transformX = style.transform.split(',')[4];
				var w = this.clientWidth;
				var x = -this._index * w;

				this._beginX = parseInt(transformX);

				if (this._beginX < x - w || this._beginX > x + w) {
					console.log('--------------', this._beginX);
					this._beginX = x;
				}

				// cells.style.transform = `translateX(${-this._beginX}px)`;
				// cells.style.transitionDuration = `0ms`;
				// console.log('style.transform', style.transform, this._beginX);
			}

			e.cancelBubble = true;
			var move_x = e.begin_x - e.x;
			var x = move_x - this._beginX;

			if (this._bounce) {
				if (this._max < x) {
					x -= ((x - this._max) / 1.5);
				} else if (x < this._min) {
					x -= (x / 1.5);
				}
			} else {
				x = Math.min(this._max, x);
				x = Math.max(this._min, x);
			}
			cells.style.transform = `translateX(${-x}px)`;
			cells.style.transitionDuration = `0ms`;
		}
	}

	protected triggerEndMove(e: GEvent) {
		if (e.begin_direction == 1 || e.begin_direction == 3) { // left / rigjt
			if (e.speed > 100 && e.begin_direction == e.instant_direction) {
				if (e.begin_direction == 1) { // right
					// this._index =  this._index - 1;
					this.setIndex(this._index - 1)
				} else { // left
					// this._index = this._index + 1;
					this.setIndex(this._index + 1);
				}
				// console.log('triggerEndMove', this._index);
			}
			var cells = this.refs.cells as HTMLElement;
			cells.style.transform = `translateX(${(-this._index*100)}%)`;
			cells.style.transitionDuration = `400ms`;
			this._beginX = -1;
		}
	}
}

interface CellConstructor {
	new(props: any): Cell;
}

export class Cell<P = {}, S = {}> extends ViewController<P & { style?: React.CSSProperties; className?: string }, S> {

	private _panel: CellPanel;
	private _isPause = true;

	readonly onResume = new EventNoticer<Event<Cell<P>, void>>('Resume', this);
	readonly onPause = new EventNoticer<Event<Cell<P>, void>>('Pause', this);

	constructor(props: any) {
		super(props);
		this._panel = props.panel;
		((this._panel as any)._cells as Set<Cell>).add(this);
	}

	get index() {
		return (this.props as any).__index as number;
	}

	get panel() {
		return this._panel;
	}

	get isPause() {
		return this._isPause;
	}

	triggerResume() {
		this.onResume.trigger();
	}

	triggerPause() {
		this.onPause.trigger();
	}

	private _resume() {
		if (this._isPause) {
			this._isPause = false;
			this.triggerResume();
		}
	}

	private _pause() {
		if (!this._isPause) {
			this._isPause = true;
			// console.log('triggerPause', this.index);
			this.triggerPause();
		}
	}

	triggerMounted() {
		this._resume();
		super.triggerMounted();
	}

	triggerRemove() {
		((this._panel as any)._cells as Set<Cell>).delete(this);
		this._pause();
	}

	render() {
		var left = (this.props as any).__left || '0';
		var style = {...this.props.style, transform: `translateX(${left})`, position: 'absolute' };
		return (
			<div className={`_cell ${this.props.className||''}`} style={style as React.CSSProperties}>
				{this.renderBody() || this.props.children}
			</div>
		);
	}

	renderBody(): React.ReactNode {
		return null;
	}
}