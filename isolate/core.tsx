/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import {List,ListItem} from 'nxkit/event';
import {React} from '../lib';
import {getDefaultId} from '../lib/dialog';
import {Type,CoverType,Window,NewWindow, Cover} from './ctr';
import Application, {ApplicationSystem} from './app';
import Gesture, {Event} from './gesture';
import * as ReactDom from 'react-dom';
import { DelayCall } from 'nxkit/delay_call';
import * as fastClick from 'fastclick';

import './core.css'; // css

(fastClick as any).attach(document.body);

var _launcher: ApplicationLauncher | null = null;
var ACTIVITY_ANIMATE_TIME = 400;

enum CoverName {
	TOP = 'top',
	BOTTOM = 'bottom'
}

function getCoverName(type: CoverType): CoverName {
	return type == CoverType.TOP ? CoverName.TOP: CoverName.BOTTOM;
}

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
			if (!this._sys) {
				if (app instanceof ApplicationSystem)
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
		if (app === this._sys) {
			this.closeCover(CoverType.TOP, false);
			this.closeCover(CoverType.BOTTOM, false);
			this._sys = null;
		}
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
			this.closeCoverAll();
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

	private _getCoverConstructor(type: CoverType) {
		utils.assert(this._sys, 'non sys');
		var sys = this._sys as ApplicationSystem;
		return {app: sys, window: type == CoverType.TOP ? sys.top(): sys.bottom()};
	}

	async showCover(type: CoverType = CoverType.TOP, animate = true) {
		var {app,window} = this._getCoverConstructor(type);
		if (type == CoverType.TOP) {
			this.closeCover(CoverType.BOTTOM);
			await this._makeTop(this._load(app, window, Target.TOP), animate);
		} else if (type == CoverType.BOTTOM) {
			this.closeCover(CoverType.TOP);
			await this._makeBottom(this._load(app, window, Target.BOTTOM), animate);
		}
	}

	async closeCover(type: CoverType = CoverType.TOP, animate = true) {
		var {app,window} = this._getCoverConstructor(type);
		var item = this._getInfo(app, window);
		if (item) {
			if (type == CoverType.TOP) {
				await this._unmakeTop(item, animate);
				// this._unload(item);
			} else {
				await this._unmakeBottom(item, animate);
				// this._unload(item);
			}
		}
	}

	closeCoverAll() {
		this.closeCover(CoverType.TOP);
		this.closeCover(CoverType.BOTTOM);
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
			this._setCoverPosition(CoverType.TOP, 100, '%', 350);
			await utils.sleep(350);
		} else {
			this._setCoverPosition(CoverType.TOP, 100, '%', 0);
		}
		return info.window;
	}

	private async _makeBottom(item: Item, animate: boolean) {
		var info = item.value as Info;
		if (animate) {
			this._setCoverPosition(CoverType.BOTTOM, 100, '%', 350);
			await utils.sleep(350);
		} else {
			this._setCoverPosition(CoverType.BOTTOM, 100, '%', 0);
		}
		return info.window;
	}

	private async _unmakeTop(item: Item, animate: boolean) {
		var info = item.value as Info;
		if (animate) {
			this._setCoverPosition(CoverType.TOP, 0, '%', 350);
			await utils.sleep(350);
		} else {
			this._setCoverPosition(CoverType.TOP, 0, '%', 0);
		}
	}

	private async _unmakeBottom(item: Item, animate: boolean) {
		var info = item.value as Info;
		if (animate) {
			this._setCoverPosition(CoverType.BOTTOM, 0, '%', 350);
			await utils.sleep(350);
		} else {
			this._setCoverPosition(CoverType.BOTTOM, 0, '%', 0);
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
		if (!item.host) return;
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
				<div className="iso_widgets" ref="__widget"></div>
				<div className="iso_covers" style={{top: '-100%'}} ref="__top"></div>
				<div className="iso_covers" style={{top:  '100%'}} ref="__bottom"></div>
			</div>
		);
	}

	protected get $el() {
		return this.refs.__root as HTMLElement;
	}

	private _beginMove = false;
	private _top_full_open = false;
	private _bottom_full_open = false;
	private _disable_top_gesture = Number(this.props.disableTopGesture) ? true: false;
	private _disable_bottom_gesture = Number(this.props.disableBottomGesture) ? true: false;

	private _top_unload = new DelayCall(()=>{
		var sys = this._sys as ApplicationSystem;
		var item = this._getInfo(sys, sys.top());
		if (item) {
			this._unload(item);
		}
	}, 1e3);

	private _bottom_unload = new DelayCall(()=>{
		var sys = this._sys as ApplicationSystem;
		var item = this._getInfo(sys, sys.bottom());
		if (item) {
			this._unload(item);
		}
	}, 1e3);

	private _setCoverFullOpen(name: CoverName, value: boolean) {
		var self = this as any;
		if (self[`_${name}_full_open`] != value) {
			self[`_${name}_full_open`] = value;
			var item = self[`_${name}`].first as Item;
			if (item) {
				if (value) {
					(item.value as Info).window.triggerResume();
				} else {
					(item.value as Info).window.triggerPause();
				}
			}
		}
	}

	private _setCoverPosition(type: CoverType, value: number, unit: string, duration: number) {
		var self: ApplicationLauncher = this;
		var __top = self.refs.__top as HTMLElement;
		var __bottom = self.refs.__bottom as HTMLElement;
		var name = getCoverName(type);

		if (type == CoverType.TOP) { // top
			__top.style.transform = `translateY(${value}${unit}) translateZ(1px)`;
			__top.style.transitionDuration = `${duration}ms`;
		} else { // bottom
			__bottom.style.transform = `translateY(${-value}${unit}) translateZ(1px)`;
			__bottom.style.transitionDuration = `${duration}ms`;
		}

		// console.log('set_cover_position', value)
		if (value > 0) {
			if (value == 100 && unit == '%')
				this._setCoverFullOpen(name, true);
			if (type == CoverType.TOP) {
				self[`_top_unload`].clear();
			} else {
				self[`_bottom_unload`].clear();
			}
		} else { // destroy
			this._setCoverFullOpen(name, false);
			if (type == CoverType.TOP) {
				self[`_top_unload`].call();
			} else {
				self[`_bottom_unload`].call();
			}
		}
	}

	private _setCoverPositionNoAnimate(type: CoverType, value: number) {
		if (type == CoverType.TOP) {
			if (this._top.length === 0) {
				var {app,window} = this._getCoverConstructor(type);
				this._load(app, window, Target.TOP);
			}
		} else {
			if (this._bottom.length === 0) {
				var {app,window} = this._getCoverConstructor(type);
				this._load(app, window, Target.BOTTOM);
			}
		}
		this._setCoverPosition(type, value, 'px', 0);
	}

	protected triggerBeginMove(e: Event) {
		// console.log('triggerBeginMove');
		this._beginMove = true;
	}

	protected triggerMove(e: Event) {
		if (!this._beginMove) {
			return;
		}
		// console.log('triggerMove', e.begin_direction);

		if (e.begin_direction == 2) { // up
			if (this._top_full_open) { // close top
				// console.log(this.height - (e.begin_y - e.y), this.height)
				if (!this._disable_top_gesture)
					this._setCoverPositionNoAnimate(CoverType.TOP, this.clientHeight - Math.max(e.begin_y - e.y, 0));
			} else if (!this._bottom_full_open) { // open bottom
				if (!this._disable_bottom_gesture)
					this._setCoverPositionNoAnimate(CoverType.BOTTOM, e.begin_y - e.y);
			}
		} else if (e.begin_direction == 4) { // down
			if (this._bottom_full_open) { // close bottom
				if (!this._disable_bottom_gesture)
					this._setCoverPositionNoAnimate(CoverType.BOTTOM, this.clientHeight - Math.max(e.y - e.begin_y, 0));
			} else if (!this._top_full_open) { // open top
				if (!this._disable_top_gesture) {
					// console.log(e.y - e.begin_y, this.height)
					this._setCoverPositionNoAnimate(CoverType.TOP, e.y - e.begin_y);
				}
			}
		}
	}

	protected triggerEndMove(e: Event) {
		if (!this._beginMove) {
			return;
		}
		this._beginMove = false;
		// console.log('triggerEndMove');

		if (e.begin_direction == 2 || e.begin_direction == 4) { // top / bottom
			// var y = 0, el;
			// console.log('e.speed', e.speed);
			var ok = e.speed > 500 && e.begin_direction == e.instant_direction;
			// console.log('e.speed', e.speed, e.begin_direction == e.instant_direction);
			if (e.begin_direction == 2) { // up, top => bottom
				if (this._top_full_open) { // close top
					if (!this._disable_top_gesture) {
						if (ok) {
							this.closeCover(CoverType.TOP);
						} else { // recovery
							this.showCover(CoverType.TOP);
						}
					}
				} else if (!this._bottom_full_open) { // open bottom
					if (!this._disable_bottom_gesture) { // not disable
						if (ok) {
							this.showCover(CoverType.BOTTOM);
						} else { // recovery
							this.closeCover(CoverType.BOTTOM);
						}
					}
				}
			} else { // down, bottom => top
				if (this._bottom_full_open) { // close bottom
					if (!this._disable_bottom_gesture) {
						if (ok) {
							this.closeCover(CoverType.BOTTOM);
						} else { // recovery
							this.showCover(CoverType.BOTTOM);
						}
					}
				} else if (!this._top_full_open) { // open top
					if (!this._disable_top_gesture) { // not disable
						if (ok) {
							this.showCover(CoverType.TOP);
						} else { // recovery
							this.closeCover(CoverType.TOP);
						}
					}
				}
			}
			// end if 
		}
	}

	static get current() {
		utils.assert(_launcher, 'No the ApplicationLauncher instance');
		return _launcher as ApplicationLauncher;
	}

	static launch(appName: string, args?: any) {
		return ApplicationLauncher.current.launch(appName, args);
	}
}