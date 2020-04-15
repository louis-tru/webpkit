/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import {List,ListItem} from 'nxkit/event';
import {React} from '../lib';
import {getDefaultId} from '../lib/dialog';
import {Type,CoverType,Window,NewWindow} from './ctr';
import Application, {ApplicationSystem} from './app';
import Gesture, {Event} from './gesture';
import * as ReactDom from 'react-dom';
import { DelayCall } from 'nxkit/delay_call';
import * as fastClick from 'fastclick';

import './core.css'; // css

(fastClick as any).attach(document.body);

var _launcher: ApplicationLauncher | null = null;
var ACTIVITY_ANIMATE_TIME = 400;

export interface NewApplication {
	new(launcher: ApplicationLauncher): Application;
}

enum Target {
	ACTIVITY,
	WIDGET,
	TOP,
	BOTTOM,
}

interface Info {
	window: Window;
	panel: HTMLElement;
	id: string;
	target: Target;
	time: number;
	permanent: boolean;
}

type Item = ListItem<Info>;

function _get_full_id(app: Application, id: string) {
	return app.name + '_' + id;
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
	disableTopGesture?: boolean;
	disableBottomGesture?: boolean;
}> {
	private _installed: Map<string, ()=>Promise<{default:NewApplication}>> = new Map();
	private _apps: Map<string, Application> = new Map(); // current run applications
	private _sys: ApplicationSystem | null = null; // sys app
	private _cur: Item | null = null;
	private _IDs: Map<string, Item> = new Map();
	private _activity = new List<Info>();
	private _widget = new List<Info>();
	private _top = new List<Info>();
	private _bottom = new List<Info>();

	protected triggerLoad() {
		utils.assert(!_launcher);
		_launcher = this;
	}

	protected triggerRemove() {
		_launcher = null;
	}

	private _genPanel(target: Target): [HTMLElement, List<Info>] {
		if (target == Target.ACTIVITY) {
			var div = document.createElement('div');
			(this.refs.__activity as HTMLElement).appendChild(div);
			return [div, this._activity];
		} else if (target == Target.WIDGET) {
			var div = document.createElement('div');
			(this.refs.__widget as HTMLElement).appendChild(div);
			return [div, this._widget];
		} else if (target == Target.TOP) {
			var div = document.createElement('div');
			(this.refs.__top as HTMLElement).appendChild(div);
			return [div, this._top];
		}  else if (target == Target.BOTTOM) {
			var div = document.createElement('div');
			(this.refs.__bottom as HTMLElement).appendChild(div);
			return [div, this._bottom];
		} else {
			throw new Error('Err');
		}
	}

	install(appName: string, app: ()=>Promise<{default:NewApplication}>) {
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
			if (!this._sys && app instanceof ApplicationSystem) {
				this._sys = app;
			}
			isLoad = true;
			this._apps.set(appName, app);
		}
		if (isLoad)
			app.triggerLoad();
		app.triggerLaunch(args);
	}

	private _exitApp(app: Application) {
		app.triggerUnload();
		this._apps.delete(app.name);
	}

	private async _autoClear() {
		// TODO ... clear all activity

		var appNames = new Set();
		var item = this._activity.first;
		while(item) {
			var next = item.next;
			var info = item.value as Info;
			if (!info.permanent && this._cur !== item) {
				this._unload(item);
			} else {
				appNames.add(info.window.app.name);
			}
			item = next;
		}

		for (var [,app] of this._apps) {
			if (!appNames.has(app.name)) {
				var item = this._widget.first;
				while (item) {
					var next = item.next;
					var info = item.value as Info;
					if (info.window.app === app) {
						await this._unmakeWidget(item, false);
						this._unload(item);
					}
					item = next;
				}
				this._exitApp(app); // exit app
			}
		}
	}

	async show<T extends Window>(app: Application, window: NewWindow<T>, args?: any, animate = true): Promise<T> {
		if (window.type == Type.ACTIVITY) {
			return await this._makeActivity(this._load(app, window, Target.ACTIVITY, args), animate) as any;
		} else if (window.type == Type.WIDGET) {
			return await this._makeWidget(this._load(app, window, Target.WIDGET, args), animate) as any;
		} else {
			throw new Error('Err');
		}
	}

	async close<T extends Window>(app: Application, id: string | NewWindow<T>, animate = true) {
		var item = this._getInfo(app, id);
		if (item) {
			var info = item.value as Info;
			if (info.target == Target.ACTIVITY) {
				await this._unmakeActivity(item, animate);
				this._unload(item);
			} else if (info.target == Target.WIDGET) {
				await this._unmakeWidget(item, animate);
				this._unload(item);
			}
		}
	}

	async showCover(type: CoverType = CoverType.TOP, animate = true) {
		utils.assert(this._sys);
		var sys = this._sys as ApplicationSystem;
		var window = type == CoverType.TOP ? sys.top(): sys.bottom();
		if (type == CoverType.TOP) {
			await this._makeTop(this._load(sys, window, Target.TOP), animate);
		} else if (type == CoverType.BOTTOM) {
			await this._makeBottom(this._load(sys, window, Target.BOTTOM), animate);
		}
	}

	async closeCover(type: CoverType = CoverType.TOP, animate = true) {
		var sys = this._sys as ApplicationSystem;
		var item = this._getInfo(sys, type == CoverType.TOP ? sys.top(): sys.bottom());
		if (item) {
			if (type == CoverType.TOP) {
				await this._unmakeTop(item, animate);
				this._unload(item);
			} else if (type == CoverType.BOTTOM) {
				await this._unmakeBottom(item, animate);
				this._unload(item);
			}
		}
	}

	private async _makeActivity(item: Item, animate: boolean) {
		var currInfo = item.value as Info;
		var prev = this._cur;
		this._cur = item;
		if (prev) {
			if (prev !== this._cur) {
				var prevInfo = prev.value as Info;
				prevInfo.window.triggerPause();
				currInfo.window.triggerResume();
				if (animate) {
					// init style
					prevInfo.panel.style.zIndex = '1';
					currInfo.panel.style.zIndex = '2';
					prevInfo.panel.style.display = 'block';
					currInfo.panel.style.display = 'block';
					prevInfo.panel.style.transitionDuration = '0ms';
					currInfo.panel.style.transitionDuration = '0ms';
					prevInfo.panel.style.transform = 'translateX(0) scale(1,1)';
					currInfo.panel.style.transform = 'translateX(100%) scale(1,1)';
					await utils.sleep(100);
					// ani
					prevInfo.panel.style.transitionDuration = `${ACTIVITY_ANIMATE_TIME}ms`;
					currInfo.panel.style.transitionDuration = `${ACTIVITY_ANIMATE_TIME}ms`;
					prevInfo.panel.style.transform = 'translateX(-50%) scale(0.7,0.7)';
					currInfo.panel.style.transform = 'translateX(0) scale(1,1)';
					await utils.sleep(400);
					prevInfo.panel.style.display = 'none';
				} else {
					prevInfo.panel.style.transitionDuration = '0ms';
					currInfo.panel.style.transitionDuration = '0ms';
					prevInfo.panel.style.transform = 'translateX(0) scale(1,1)';
					currInfo.panel.style.transform = 'translateX(0) scale(1,1)';
					prevInfo.panel.style.display = 'none';
					currInfo.panel.style.display = 'block';
				}
			}
		} else {
			currInfo.window.triggerResume();
		}

		if (this._activity.length == 1 && this._activity.first === item) {
			currInfo.permanent = true;
		}

		this._autoClear();
		return currInfo.window;
	}

	private async _unmakeActivity(item: Item, animate: boolean) {
		if (item === this._cur) {
			var prev = item.prev;
			if (prev) {
				var nextInfo = item.value as Info;
				var currInfo = prev.value as Info;
				this._cur = prev;
				nextInfo.window.triggerPause();
				currInfo.window.triggerResume();
				if (animate) {
					// init style
					currInfo.panel.style.zIndex = '2';
					nextInfo.panel.style.zIndex = '1';
					currInfo.panel.style.display = 'block';
					nextInfo.panel.style.display = 'block';
					currInfo.panel.style.transitionDuration = '0ms';
					nextInfo.panel.style.transitionDuration = '0ms';
					currInfo.panel.style.transform = 'translateX(-50%) scale(0.7,0.7)';
					nextInfo.panel.style.transform = 'translateX(0) scale(1,1)';
					await utils.sleep(100);
					// ani
					currInfo.panel.style.transitionDuration = `${ACTIVITY_ANIMATE_TIME}ms`;
					nextInfo.panel.style.transitionDuration = `${ACTIVITY_ANIMATE_TIME}ms`;
					currInfo.panel.style.transform = 'translateX(0) scale(1,1)';
					nextInfo.panel.style.transform = 'translateX(100%) scale(1,1)';
					await utils.sleep(400);
					nextInfo.panel.style.display = 'none';
				}
			} else {
				this._cur = null;
				(item.value as Info).window.triggerPause();
			}
		}
		utils.nextTick(()=>this._autoClear());
	}

	private async _makeTop(item: Item, animate: boolean) {
		var info = item.value as Info;
		if (animate) {
			// TODO ...
		}
		return info.window;
	}

	private async _makeBottom(item: Item, animate: boolean) {
		var info = item.value as Info;
		if (animate) {
			// TODO ...
		}
		return info.window;
	}

	private async _unmakeTop(item: Item, animate: boolean) {
		var info = item.value as Info;
		if (animate) {
			// TODO ...
		}
	}

	private async _unmakeBottom(item: Item, animate: boolean) {
		var info = item.value as Info;
		if (animate) {
			// TODO ...
		}
	}

	private async _makeWidget(item: Item, animate: boolean) {
		var info = item.value as Info;
		info.window.triggerResume();
		if (animate) {
			info.panel.style.transitionDuration = '0';
			info.panel.style.opacity = '0';
			await utils.sleep(100);
			info.panel.style.transitionDuration = `150ms`;
			info.panel.style.opacity = '1';
		} else {
			info.panel.style.transitionDuration = '0';
			info.panel.style.opacity = '1';
		}
		return info.window;
	}

	private async _unmakeWidget(item: Item, animate: boolean) {
		var info = item.value as Info;
		info.window.triggerPause();
		if (animate) {
			info.panel.style.transitionDuration = '0';
			info.panel.style.opacity = '1';
			await utils.sleep(100);
			info.panel.style.transitionDuration = `150ms`;
			info.panel.style.opacity = '0';
		} else {
			info.panel.style.transitionDuration = '0';
			info.panel.style.opacity = '0';
		}
	}

	private _load<T extends Window>(app: Application, window: NewWindow<T>, target: Target, args?: any) {
		utils.equalsClass(Window, window);
		var id = args?.id ? String(args.id): getDefaultId(window);
		var fid = _get_full_id(app, id);
		var item = this._IDs.get(fid);
		if (!item) {
			var [panel, stack] = this._genPanel(target);
			var New = window as any;
			var win = ReactDom.render<{}>(<New {...args} __app__={app} id={id} />, panel) as Window;
			var info = { window: win, panel, id, target, time: Date.now(), permanent: false } as Info;
			item = stack.push(info);
			this._IDs.set(fid, item);
		}
		return item;
	}

	private _unload(item: ListItem<Info>) {
		var info = item.value as Info;
		var fid = _get_full_id(info.window.app, info.id);
		ReactDom.unmountComponentAtNode(info.panel);
		(info.panel.parentElement as HTMLElement).removeChild(info.panel);
		(item.host as List<Info>).del(item);
		this._IDs.delete(fid);
	}

	private _getInfo(app: Application, id: string | NewWindow<Window>): ListItem<Info> | null {
		utils.assert(app);
		var _id: string = typeof id == 'string' ? String(window): getDefaultId(id);
		var fid = _get_full_id(app, _id);
		var item = this._IDs.get(fid);
		return item || null;
	}

	getWindow(app: Application, id: string | NewWindow<Window>): Window | null {
		return this._getInfo(app, id)?.value?.window || null;
	}

	render() {
		return (
			<div className="iso_sys" ref="__root">
				<div className="iso_activitys" ref="__activity"></div>
				<div className="iso_widgets" ref="__widget" ></div>
				<div className="iso_covers" style={{top: '-100%'}} ref="__top" ></div>
				<div className="iso_covers" style={{top:  '100%'}} ref="__bottom"></div>
			</div>
		);
	}

	protected get $el() {
		return this.refs.__root as HTMLElement;
	}

	protected triggerBeginMove(e: Event) {
		console.log('triggerBeginMove 0');
		//
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
		// 
		// if (has_can_action(this)) {
		// 	this._begin_move = true;
		// }
	}

	protected triggerMove(e: Event) {
		console.log('triggerMove 1');
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
		console.log('triggerEndMove 2');
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
		utils.assert(_launcher, 'No the ApplicationLauncher instance');
		return _launcher as ApplicationLauncher;
	}

	static launch(appName: string, args?: any) {
		return ApplicationLauncher.current.launch(appName, args);
	}
}