/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import {React} from '../lib';
import {Type,Window,Activity,WindowNew} from './ctr';
import Application, {ApplicationNew} from './app';
import Gesture, {Event} from './gesture';
import './sys.css';
import { DelayCall } from 'nxkit/delay_call';

var _cur: ApplicationLauncher | null = null;

enum Target {
	ACTIVITY = 'activity',
	WIDGET = 'widget',
	TOP = 'top',
	BOTTOM = 'bottom',
}

interface WindowInfo {
	args?: any;
	app: Application;
	Window: WindowNew<Window>;
	id: string;
	target: Target;
	key: boolean;
}

function _get_full_id(app: Application, id: string) {
	return app.name + '_' + id;
}

function getId<T extends Window>(window: WindowNew<T>) {
	utils.assert(window);
	if (!(window as any).hasOwnProperty('__default_id')) {
		(window as any).__default_id = String(utils.getId());
	}
	return String((window as any).__default_id);
}

function has_can_action(self: ApplicationLauncher) {
	// return (
	// 	// !self._top_cover_ok && 
	// 	// !self._bottom_cover_ok && 
	// 	self._layers.length === 0 && 
	// 	self._dialogs.length === 0
	// );
}

function has_can_horizontal(self: ApplicationLauncher) {
	// return !self._cover_top_ok && !self._cover_bottom_ok;
}

function set_cover_position(self: ApplicationLauncher/*, name, value, unit, duration*/) {
	// if (!self.$slots[name]) {
	// 	return;
	// }
	// if (name == 'top') { // top
	// 	self.$refs.__top.style.transform = `translateY(${value}${unit}) translateZ(1px)`;
	// 	self.$refs.__top.style.transitionDuration = `${duration}ms`;
	// } else { // bottom
	// 	self.$refs.__bottom.style.transform = `translateY(${-value}${unit}) translateZ(1px)`;
	// 	self.$refs.__bottom.style.transitionDuration = `${duration}ms`;
	// }
	// // console.log('set_cover_position', value)
	// if (value > 0) {
	// 	if (value == 100 && unit == '%') {
	// 		set_cover_ok(self, name, true);
	// 	}
	// 	self[`${name}_cover__`] = true;
	// 	self[`_${name}_cover_destroy`].clear();
	// } else { // destroy
	// 	set_cover_ok(self, name, false);
	// 	self[`_${name}_cover_destroy`].notice();
	// }
	// if (unit  == 'px') { // px
	// 	var blur = Math.max(0, value / self._height);
	// 	self.cells_blur = Math.round(blur * CELLS_BLUR);
	// } else { // %
	// 	var blur = Math.max(0, value / 100);
	// 	self.cells_blur = Math.round(blur * CELLS_BLUR);
	// }
	// self.$refs.__cells.style.transitionDuration = `${duration}ms`;
}

export default class ApplicationLauncher extends Gesture<{
	width?: number|string;
	height?: number|string;
	disableTopGesture?: boolean;
	disableBottomGesture?: boolean;
}> {
	public state = { __ch: 0 };
	private _installed: Map<string, ()=>Promise<{default:ApplicationNew}>> = new Map();
	private _apps: Map<string, Application> = new Map(); // current run applications
	private _sys: Application | null = null; // sys app
	private _cur = ''; // current activity id
	private _IDs: Map<string, WindowInfo> = new Map();
	private _activity = [] as WindowInfo[];
	private _widget = [] as WindowInfo[];
	private _top = [] as WindowInfo[];
	private _bottom = [] as WindowInfo[];

	protected triggerLoad() {
		utils.assert(!_cur);
		_cur = this;
	}

	protected triggerRemove() {
		_cur = null;
	}

	install(appName: string, app: ()=>Promise<{default:ApplicationNew}>) {
		utils.assert(!this._installed.has(appName));
		this._installed.set(appName, app);
	}

	uninstall(appName: string) {
		utils.assert(this._installed.has(appName));
		this._installed.delete(appName);
	}

	async launch(appName: string, args?: any) {
		var app = this._apps.get(appName);
		var isLoad = false;
		if (!app) {
			var ff = this._installed.get(appName);
			utils.assert(ff, `Application does not exist, ${appName}`);
			if (!ff) return;
			var App = await ff();
			app = new App.default(this);
			if (!this._sys)
				this._sys = app;
			isLoad = true;
			this._apps.set(appName, app);
		}
		this.show(app, app.body(), args);
		if (isLoad)
			(app as any).triggerLoad();
	}

	show<T extends Window>(app: Application, window: WindowNew<T>, args?: any) {
		if (window.type == Type.ACTIVITY) { // activity
			this._load(app, window, Target.ACTIVITY, args);
		} else if (window.type == Type.WIDGET) { // widget
			this._load(app, window, Target.WIDGET, args);
		} /*else if (window.type == Type.TOP) {
			// this._load(app, window, Target.TOP, args);
		} else if (window.type == Type.BOTTOM) {
			// this._load(app, window, Target.BOTTOM, args);
		}*/
	}

	close<T extends Window>(app: Application, window: string | WindowNew<T>) {
		this._destroy(app, window);
	}

	private _autoDestroyActivity() {
		// TODO auto destroy
		// this._activity.forEach(e=>this._destroy(e.app, e.id));
	}

	private _loadActivity(app: Application, id: string) {
		this._autoDestroyActivity();
		var fid = _get_full_id(app, id);
		(app as any)._cur = id; // private visit
		this._cur = fid;
	}

	private _destroyActivity(act: Activity) {
		var app = act.app;
		if (!this._activity.find(e=>e.app === app)) {
			for ( var e of [...this._widget,...this._top,...this._bottom] ) {
				if (e.app === app)
					this._destroy(e.app, e.id);
			}
			(app as any).triggerUnload(); // private visit
		}
	}

	private _load<T extends Window>(app: Application, 
		window: WindowNew<T>, target: Target, args?: any)
	{
		utils.equalsClass(Window, window);
		var id = args?.id ? String(args.id): getId(window);
		var fid = _get_full_id(app, id);
		var c = this._IDs.get(fid) as WindowInfo;

		this._loadActivity(app, id);

		((this as any)['_' + target] as WindowInfo[]).forEach(c=>{
			c.key = false;
		});
		// console.log('----', id,fid);
		if (c) {
			c.key = true;
		} else {
			c = { app, args, Window: window, id, target, key: true };
			((this as any)['_' + c.target] as any[]).push(c);
			this._IDs.set(fid, c);
		}
		this.setState({ __ch: this.state.__ch + 1 });
	}

	private _destroy<T extends Window>(app: Application, window: string | WindowNew<T>)
	{
		var id: string = typeof window == 'string' ? String(window): getId(window);
		var fid = _get_full_id(app, id);
		var c = this._IDs.get(fid);
		if (c) {
			((this as any)['_' + c.target] as WindowInfo[]).deleteOf(c);
			this._IDs.delete(fid);
			if (c.target == Target.ACTIVITY) {
				if (this._cur == fid) { // clear ApplicationLauncher._cur
					this._cur = '';
				}
				if ((c.app as any)._cur == id) { // clear Application._cur
					(app as any)._cur = ''; // private visit
				}
				this._destroyActivity(this.refs[fid] as Activity);
			}
			this.setState({ __ch: this.state.__ch + 1 });
		}
	}

	getWindow(app: Application, id: string): Window | null {
		return this.refs[_get_full_id(app, id)] as Window || null;
	}

	render() {
		var {_activity,_widget,_top,_bottom} = this;
		var _id = _get_full_id;
		return (
			<div className="iso_sys" ref="__root">
				<div className="iso_bodys" ref="__bodys">
				{
					_activity.map(({args,Window,app,id,key},j)=>
						<div
							key={_id(app,id)} 
							style={{width: '100%', height: '100%', display: key?'block':'none'}}
						>
							<Window {...args} __app__={app} id={id} ref={_id(app,id)} />
						</div>
					)
				}
				</div>
				<div className="iso_widgets" ref="__widgets" >
				{
					_widget.map(({args,Window,app,id})=>
						<Window {...args} __app__={app} 
							key={_id(app,id)} id={id} ref={_id(app,id)} />
					)
				}
				</div>
				<div className="iso_covers" style={{top: '-100%'}} ref="__tops" >
				{
					_top.map(({args,Window,app,id})=>
						<Window {...args} __app__={app} 
							key={_id(app,id)} id={id} ref={_id(app,id)} />
					)
				}
				</div>
				<div className="iso_covers" style={{top: '100%'}} ref="__bottoms">
				{
					_bottom.map(({args,Window,app,id})=>
						<Window {...args} __app__={app} 
							key={_id(app,id)} id={id} ref={_id(app,id)} />
					)
				}
				</div>
			</div>
		);
	}

	protected get $el() {
		return this.refs.__root as HTMLElement;
	}

	protected triggerBeginMove(e: Event) {

	// private _begin_move = false;
	// private _cover_top_ok = false;
	// private _cover_bottom_ok = false;
	// private cover_top__ = false;
	// private cover_bottom__ = false;
	// private _cover_top_destroy = new DelayCall(e=>this.cover_top__=false, 1e3);
	// private _cover_bottom_destroy = new DelayCall(e=>this.cover_bottom__=false, 1e3);
	// private _disable_top_gesture = Number(this.props.disableTopGesture) ? true: false;
	// private _disable_bottom_gesture = Number(this.props.disableBottomGesture) ? true: false;
	// private _width = 0;
	// private _height = 0;

		// if (has_can_action(this)) {
		// 	this._begin_move = true;
		// }
	}

	protected triggerMove(e: Event) {
		// if (!this._begin_move || !has_can_action(this)) {
		// 	return;
		// }
		// if (e.begin_direction == 1 || e.begin_direction == 3) { /* // left / right
		// 	if (has_can_horizontal(this)) {
		// 		var move_x = e.begin_x - e.x;
		// 		var x = this._cell_index * this._width + move_x;
		// 		if (this._bounce) {
		// 			if (this._max_x < x) {
		// 				x -= ((x - this._max_x) / 1.5);
		// 			} else if (x < 0) {
		// 				x -= (x / 1.5);
		// 			}
		// 		} else {
		// 			x = Math.min(this._max_x, x);
		// 			x = Math.max(0, x);
		// 		}
		// 		this.__x = x;
		// 		this.$refs.__cells.style.transform = `translateX(${-x}px) translateZ(1px)`;
		// 		this.$refs.__cells.style.transitionDuration = `0ms`;
		// 	}*/
		// } else if (e.begin_direction == 2) { // up
		// 	if (this._cover_top_ok) { // close top
		// 		// console.log(this._height - (e.begin_y - e.y), this._height)
		// 		if (!this._disable_top_gesture)
		// 			set_cover_position(this, 'top', this._height - Math.max(e.begin_y - e.y, 0), 'px', 0);
		// 	} else if (!this._cover_bottom_ok) { // open bottom
		// 		if (!this._disable_bottom_gesture)
		// 			set_cover_position(this, 'bottom', e.begin_y - e.y, 'px', 0);
		// 	}
		// } else if (e.begin_direction == 4) { // down
		// 	if (this._cover_bottom_ok) { // close bottom
		// 		if (!this._disable_bottom_gesture)
		// 			set_cover_position(this, 'bottom', this._height - Math.max(e.y - e.begin_y, 0), 'px', 0);
		// 	} else if (!this._cover_top_ok) { // open top
		// 		if (!this._disable_top_gesture) {
		// 			// console.log(e.y - e.begin_y, this._height)
		// 			set_cover_position(this, 'top', e.y - e.begin_y, 'px', 0);
		// 		}
		// 	}
		// }
	}

	protected triggerEndMove(e: Event) {
		// if (!this._begin_move || !has_can_action(this)) {
		// 	return;
		// }
		// this._begin_move = false;
		// if ((e.begin_direction == 1 || e.begin_direction == 3)) {// left / right
		// 	/*if (has_can_horizontal(this)) {
		// 		var x = this._cell_index * this._width;
		// 		if (e.speed > 30 && e.begin_direction == e.instant_direction) {
		// 			if (e.begin_direction == 1) { // right
		// 				this._cell_index = Math.max(0, this._cell_index - 1);
		// 			} else { // left
		// 				this._cell_index = Math.min(this._cell_index_max, this._cell_index + 1);
		// 			}
		// 			x = this._cell_index * this._width;
		// 		} else { // recovery
		// 			var transform = getComputedStyle(this.$refs.__cells)['transform'];
		// 			var mat = transform.match(/^matrix3d\((-?\d+(\.\d+)?,\s+){12}(-?\d+(\.\d+)?)/)
		// 			if (mat && mat[3]) {
		// 				x = -Number(mat[3]);
		// 				this._cell_index = Math.round(x / this._width);
		// 				this._cell_index = Math.min(this._cell_index, this._cell_index_max);
		// 				this._cell_index = Math.max(this._cell_index, 0);
		// 				x = this._cell_index * this._width;
		// 			}
		// 		}
		// 		this.__x = x;
		// 		this.$refs.__cells.style.transform = `translateX(${-x}px) translateZ(1px)`;
		// 		this.$refs.__cells.style.transitionDuration = `${this._momentum_time}ms`;
		// 		this.ch__++;
		// 	}*/
		// }
		// else if (e.begin_direction == 2 || e.begin_direction == 4) { // top / bottom
		// 	var y = 0, el;
		// 	// console.log('e.speed', e.speed);
		// 	var action = e.speed > 500 && e.begin_direction == e.instant_direction;
		// 	if (e.begin_direction == 2) { // up, top => bottom
		// 		if (this._top_cover_ok) { // close top
		// 			if (!this._disable_top_gesture) {
		// 				if (action) {
		// 					this.closeCover('top');
		// 				} else { // recovery
		// 					this.showCover('top');
		// 				}
		// 			}
		// 		} else if (!this._bottom_cover_ok) { // open bottom
		// 			if (!this._disable_bottom_gesture) { // not disable
		// 				if (action) {
		// 					this.showCover('bottom');
		// 				} else { // recovery
		// 					this.closeCover('bottom');
		// 				}
		// 			}
		// 		}
		// 	} else { // down, bottom => top
		// 		if (this._bottom_cover_ok) { // close bottom
		// 			if (!this._disable_bottom_gesture) {
		// 				if (action) {
		// 					this.closeCover('bottom');
		// 				} else { // recovery
		// 					this.showCover('bottom');
		// 				}
		// 			}
		// 		} else if (!this._top_cover_ok) { // open top
		// 			if (!this._disable_top_gesture) { // not disable
		// 				if (action) {
		// 					this.showCover('top');
		// 				} else { // recovery
		// 					this.closeCover('top');
		// 				}
		// 			}
		// 		}
		// 	}
		// 	// end if 
		// }
	}

	static get current() {
		utils.assert(_cur, 'No the ApplicationLauncher instance');
		return _cur as ApplicationLauncher;
	}

	static launch(appName: string, args?: any) {
		return ApplicationLauncher.current.launch(appName, args);
	}
}