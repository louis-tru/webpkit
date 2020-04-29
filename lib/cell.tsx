/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import './cell.css';
import utils from 'nxkit';
import {React} from '.';
import {ViewController} from './ctr';
import Gesture,{Event as GE} from './gesture';
import {EventNoticer, Event} from 'nxkit/event';

interface CellDom { type: CellConstructor; props: any, key?: any; ref?: any; }

export class CellPanel<P = {}> extends Gesture<P & {
	index?: number;
	bounce?: boolean;
	preloading?: number;
}> {

	private __index = Number(this.props.index) || 0;
	private _bounce = !!Number(this.props.bounce);
	private _preloading = Math.max(1, Number(this.props.preloading) || 1);
	private _cells = new Set<Cell>();
	private __count = 0;

	private get _index() {
		return this.__index;
	}

	private set _index(index: number) {
		if (index !== this.__index || !this.isMounted) {
			this.__index = index;
			utils.nextTick(()=>{
				for (var cell of this._cells) {
					if (cell.index == index) {
						(cell as any)._resume(); // private visit
					} else {
						(cell as any)._pause(); // private visit
					}
				}
				this.onSwitch.trigger(index);
			});
		}
	}

	private _cellsDom() {
		var cells = [] as CellDom[];
		var child = this.props.children;
		if (child) {
			cells = (Array.isArray(child) ? child : [child]) as any;
		}
		return cells;
	}

	private get _count() {
		return this._cellsDom().length;
	}

	private _renderChild() {
		var cells = this._cellsDom();
		var index = this._index;
		this._index = index = Math.min(Math.max(0, index), cells.length - this._preloading); // fix index value
		this.__count = cells.length;
		var width = 100 / cells.length + '%';
		return cells.map((e,j)=>{
			utils.assert( utils.equalsClass(Cell, e.type), 'CellPanel.props.children type error' );
			var E = {...e, props: {...e.props, panel: this, __index: j } };
			return (
				<div key={e.key || j} style={{width}}>
					{ Math.abs(j - index) <= 1 ? E: null }
				</div>
			);
		});
	}

	readonly onSwitch = new EventNoticer<Event<number, CellPanel<P>>>('Switch', this);

	get count() {
		return this.__count;
	}

	get index() {
		return this._index;
	}

	set index(val: number) {
		this.switchAt(val);
	}

	private get _max_x() {
		return Math.max((this._count - 1) * this.clientWidth, 0);
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
		index = Math.min(Math.max(0, index), this._count - 1);
		if (this._index != index) {
			this._index = index;
			(this.refs.cells as HTMLElement).style.transitionDuration = animate ? '350ms' : '0ms';
			this.forceUpdate();
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
			<div ref="root" className="_cells_panel">
				<div ref="cells" className="_cells" style={{
					width: cells.length * 100 + '%',
					transform: `translateX(-${this._index/cells.length*100}%)`,
				}}>{cells}</div>
			</div>
		);
	}

	protected get $el() {
		return this.refs.root as HTMLElement;
	}

	protected triggerMove(e: GE) {
		if (e.begin_direction == 1 || e.begin_direction == 3) { // left / rigjt
			e.cancelBubble = true;
			var move_x = e.begin_x - e.x;
			var x = this._index * this.clientWidth + move_x;
			if (this._bounce) {
				if (this._max_x < x) {
					x -= ((x - this._max_x) / 1.5);
				} else if (x < 0) {
					x -= (x / 1.5);
				}
			} else {
				x = Math.min(this._max_x, x);
				x = Math.max(0, x);
			}
			var cells = this.refs.cells as HTMLElement;
			cells.style.transform = `translateX(${-x}px)`;
			cells.style.transitionDuration = `0ms`;
		}
	}

	protected triggerEndMove(e: GE) {
		if (e.begin_direction == 1 || e.begin_direction == 3) { // left / rigjt
			if (e.speed > 100 && e.begin_direction == e.instant_direction) {
				if (e.begin_direction == 1) { // right
					this._index = Math.max(0, this._index - 1);
				} else { // left
					this._index = Math.min(Math.max(0, this._count - 1), this._index + 1);
				}
				this.forceUpdate();
			}
			var cells = this.refs.cells as HTMLElement;
			cells.style.transform = `translateX(-${this._index/this._count*100}%)`;
			cells.style.transitionDuration = `350ms`;
		}
	}
}

interface CellConstructor {
	new(props: any): Cell;
}

export class Cell<P = {}, S = {}> extends ViewController<P & { style?: React.CSSProperties; className?: string }, S> {

	private _panel: CellPanel;
	private _isPause = true;

	readonly onResume = new EventNoticer<Event<void, Cell<P>>>('Resume', this);
	readonly onPause = new EventNoticer<Event<void, Cell<P>>>('Pause', this);

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
		return (
			<div className={`_cell ${this.props.className||''}`} style={this.props.style}>
				{this.props.children}
			</div>
		);
	}
}