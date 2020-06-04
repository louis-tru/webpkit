/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import './core.css';
import utils from 'nxkit';
import {List,ListItem} from 'nxkit/event';
import {React} from '../lib';
import {getDefaultId} from '../lib/dialog';
import {Type,CoverType,Window,NewWindow, Cover, Activity, ActivityNavStatus} from './ctr';
import {Application} from './app';
import Gesture, {Event} from '../lib/gesture';
import * as ReactDom from 'react-dom';
import { DelayCall } from 'nxkit/delay_call';
import * as fastClick from 'fastclick';

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

export interface Options extends Dict {
	id?: any;
}

export const MAX_ACTIVITY_RETAIN_COUNT = 1;

interface Info {
	window?: Window;
	panel?: HTMLElement;
	app: Application;
	New: NewWindow<Window>;
	appName: string;
	id: string;
	target: Target;
	time: number;
	permanent: boolean;
	args?: Options;
}

interface Info2 extends Info {
	window: Window;
	panel: HTMLElement;
}

enum Target {
	ACTIVITY,
	WIDGET,
	TOP,
	BOTTOM,
}

type Item = ListItem<Info>;

interface LItem {
	item: Item;
	load: boolean;
}

function _get_full_id(app: Application, id: string) {
	return app.name + '_' + id;
}

function _get_full_id_by_info(info: Info) {
	return info.appName + '_' + info.id;
}

export default class ApplicationLauncher extends Gesture<{
	disableTopGesture?: boolean;
	disableBottomGesture?: boolean;
}> {
	private _installed: Map<string, ()=>Promise<{default:NewApplication}>> = new Map();
	private _apps: Map<string, Application> = new Map(); // current run applications
	private _sys: Application | null = null; // sys app
	private _cur: Item | null = null; // cur activity
	private _InstanceIDs: Map<string, Item> = new Map();
	private _activityHistory = new List<Info>();
	private _widgetHistory = new List<Info2>();
	private _topHistory = new List<Info2>();
	private _bottomHistory = new List<Info2>();

	constructor(props: any) {
		super(props);
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
			return [div, this._activityHistory];
		} else if (target == Target.WIDGET) {
			var div = document.createElement('div');
			(this.refs.__widget as HTMLElement).appendChild(div);
			return [div, this._widgetHistory];
		} else if (target == Target.TOP) {
			var div = document.createElement('div');
			(this.refs.__top as HTMLElement).appendChild(div);
			return [div, this._topHistory];
		}  else if (target == Target.BOTTOM) {
			var div = document.createElement('div');
			(this.refs.__bottom as HTMLElement).appendChild(div);
			return [div, this._bottomHistory];
		} else {
			throw new Error('Err');
		}
	}

	get currentApplication() {
		return this._cur ? (this._cur.value as Info).app.name: '';
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
				this._sys = app;
			}
			isLoad = true;
			this._apps.set(appName, app);
		}
		if (isLoad) {
			await app.triggerLoad();
		}
		app.triggerLaunch({...args});
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

		var retainActivityCount = 0;
		var retainApps = new Set();
		var item = this._activityHistory.first;

		// TODO ... auto clear activitys
		while(item) {
			var next = item.next;
			var info = item.value as Info;
			if (info.window) {
				retainActivityCount++;
				if (!info.permanent && this._cur !== item) {
					if (retainActivityCount >= MAX_ACTIVITY_RETAIN_COUNT) {
						// this._unload(item);
						this._unloadInstance(item);
					}
				}
			}
			item = next;
		}

		if (this._sys) {
			retainApps.add(this._sys.name);
		}
		for (item = this._activityHistory.first; item; item = item.next) {
			var info = item.value as Info;
			retainApps.add(info.appName);
		}

		for (var [,app] of this._apps) {
			if (!retainApps.has(app.name)) {

				let item = this._widgetHistory.first;
				while (item) {
					let next = item.next;
					let info = item.value as Info2;
					if (info.window.app === app) {
						await this._unmakeWidget(item, false);
						this._unload(item);
					}
					item = next;
				}

				for(let item of [this._topHistory.first, this._bottomHistory.first]) {
					if (item) {
						let info = item.value as Info2;
						if (info.window.app === app) {
							if (info.target == Target.TOP)
								await this._unmakeTop(item, false);
							else
								await this._unmakeBottom(item, false);
						}
					}
				}

				this._exitApp(app); // exit app
			}
		}
	}

	async show<T extends Window>(app: Application, window: NewWindow<T>, args?: Options, animate = true): Promise<T> {
		if (window.type == Type.ACTIVITY) {
			this.closeCoverAll();
			return await this._makeActivity(await this._load(app, window, Target.ACTIVITY, args), animate) as any;
		} else if (window.type == Type.WIDGET) {
			return await this._makeWidget(await this._load(app, window, Target.WIDGET, args), animate) as any;
		} else {
			throw new Error('Err');
		}
	}

	async close<T extends Window>(app: Application, id: string | NewWindow<T>, animate = true) {
		var item = this._getInfo(app, id);
		if (item) {
			var info = item.value as Info;
			if (info.target == Target.ACTIVITY) {
				this.closeCoverAll();
				await this._unmakeActivity(item, animate);
				this._unload(item);
			} else if (info.target == Target.WIDGET) {
				await this._unmakeWidget(item, animate);
				this._unload(item);
			}
		}
	}

	private _getCoverConstructor(type: CoverType) {
		if (this._disableCover)
			return { app: this._sys as Application, win: null };
		var win: NewWindow<Cover> | null = null;
		var app = this._sys as Application;
		if (this._cur) {
			var act = (this._cur.value as Info).window as Activity;
			if (act) {
				win = type == CoverType.TOP ? act.app.top(): act.app.bottom();
			}
		}
		if (!win) {
			var app = this._sys;
			win = type == CoverType.TOP ? app.top(): app.bottom();
		}
		return { app, win };
	}

	private _disableCover = false;

	// setDisableCover(disable: boolean) {
	// 	this._disableCover = disable;
	// }

	async showCover(type: CoverType = CoverType.TOP, animate = true) {
		var {app,win} = this._getCoverConstructor(type);
		if (!win) return;
		if (type == CoverType.TOP) {
			this.closeCover(CoverType.BOTTOM);
			await this._makeTop(await this._load(app, win, Target.TOP), animate);
		} else if (type == CoverType.BOTTOM) {
			this.closeCover(CoverType.TOP);
			await this._makeBottom(await this._load(app, win, Target.BOTTOM), animate);
		}
	}

	async closeCover(type: CoverType = CoverType.TOP, animate = true) {
		if (type == CoverType.TOP) {
			var item = this._topHistory.first;
			if (item) {
				await this._unmakeTop(item, animate);
			}
		} else {
			var item = this._bottomHistory.first;
			if (item) {
				await this._unmakeBottom(item, animate);
			}
		}
	}

	closeCoverAll() {
		this.closeCover(CoverType.TOP);
		this.closeCover(CoverType.BOTTOM);
	}

	private async _makeActivity({item}: LItem, animate: boolean) {
		var currInfo = item.value as Info2;
		var prev = this._cur;
		this._cur = item;
		if (prev) {
			if (prev !== this._cur) {
				var prevInfo = prev.value as Info2;
				var prevAct = prevInfo.window as Activity;
				var currAct = currInfo.window as Activity;
				var time = animate ? ACTIVITY_ANIMATE_TIME: 0;
				await Promise.all([
					currAct.navStatus == ActivityNavStatus.BACKGROUND ?
					prevAct.intoLeave(time): prevAct.intoBackground(time),
					currAct.intoForeground(time),
				]);
			}
		} else {
			await (currInfo.window as Activity).intoForeground(0);
		}

		var act = currInfo.window as Activity;
		if (act.permanent >= 1) {
			currInfo.permanent = true;
		}

		utils.nextTick(()=>this._autoClear());
		return currInfo.window;
	}

	private async _unmakeActivity(item: Item, animate: boolean) {
		if (item === this._cur) {
			var prev = item.prev;
			if (prev) {
				var cur = prev;
				var nextInfo = item.value as Info2;
				var currInfo = cur.value as Info2;
				if (!currInfo.window) { // reload
					prev = cur.prev;
					this._unload(cur);
					var args = { ...currInfo.args, __navStatus: ActivityNavStatus.BACKGROUND };
					cur = (await this._load(currInfo.app, currInfo.New, Target.ACTIVITY, args, prev || item)).item;
					currInfo = cur.value as Info2;
				}
				this._cur = cur;
				var currAct = currInfo.window as Activity;
				var nextAct = nextInfo.window as Activity;
				var time = animate ? ACTIVITY_ANIMATE_TIME: 0;
				await Promise.all([
					currAct.intoForeground(time),
					nextAct.intoLeave(time),
				]);
			} else {
				this._cur = null;
				await ((item.value as Info2).window as Activity).intoLeave(0);
			}
		}
		utils.nextTick(()=>this._autoClear());
	}

	private async _makeTop({item}: LItem, animate: boolean) {
		var info = item.value as Info;
		if (animate) {
			this._setCoverPosition(CoverType.TOP, 100, '%', 350);
			await utils.sleep(350);
		} else {
			this._setCoverPosition(CoverType.TOP, 100, '%', 0);
		}
		return info.window;
	}

	private async _makeBottom({item}: LItem, animate: boolean) {
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
		// var info = item.value as Info;
		if (animate) {
			this._setCoverPosition(CoverType.TOP, 0, '%', 350);
			await utils.sleep(350);
		} else {
			this._setCoverPosition(CoverType.TOP, 0, '%', 0);
		}
	}

	private async _unmakeBottom(item: Item, animate: boolean) {
		// var info = item.value as Info;
		if (animate) {
			this._setCoverPosition(CoverType.BOTTOM, 0, '%', 350);
			await utils.sleep(350);
		} else {
			this._setCoverPosition(CoverType.BOTTOM, 0, '%', 0);
		}
	}

	private async _makeWidget({item,load}: LItem, animate: boolean) {
		var info = item.value as Info2;
		if (!load) return info.window;
		info.window.triggerResume();
		if (animate) {
			info.panel.style.transitionDuration = '0';
			info.panel.style.opacity = '0';
			await utils.sleep(50);
			info.panel.style.transitionDuration = `200ms`;
			info.panel.style.opacity = '1';
		} else {
			info.panel.style.transitionDuration = '0';
			info.panel.style.opacity = '1';
		}
		return info.window;
	}

	private async _unmakeWidget(item: Item, animate: boolean) {
		var info = item.value as Info2;
		info.window.triggerPause();
		if (animate) {
			info.panel.style.transitionDuration = '0';
			info.panel.style.opacity = '1';
			await utils.sleep(50);
			info.panel.style.transitionDuration = `200ms`;
			info.panel.style.opacity = '0';
			await utils.sleep(200);
		} else {
			info.panel.style.transitionDuration = '0';
			info.panel.style.opacity = '0';
		}
	}

	private async _load<T extends Window>(app: Application, window: NewWindow<T>, target: Target, args?: Options, prev?: Item | null) {
		utils.equalsClass(Window, window);
		var id = args?.id ? String(args.id): getDefaultId(window);
		var fid = _get_full_id(app, id);
		var item = this._InstanceIDs.get(fid), load = false;
		if (!item) {
			var [panel, stack] = this._genPanel(target);
			var New = window as any;

			var win = await new Promise<Window>(r=>
				ReactDom.render(<New {...args} __app__={app} id={id} />, panel, function(this: any) { r(this) })
			);

			var info: Info = {
				window: win, panel, id, target, time: Date.now(),
				permanent: false, args, appName: app.name, New, app,
			};
			if (prev) {
				item = stack.insert(prev, info);
			} else {
				item = stack.push(info);
			}
			this._InstanceIDs.set(fid, item);
			load = true;
		} else {
			// var [panel, stack] = this._genPanel(target);
			// var New = window as any;
			// var win = ReactDom.render<{}>(<New {...args} __app__={app} id={id} />, panel) as Window;
			// (item.value as Info2).window.props
		}
		return {item, load} as LItem;
	}

	private _unloadInstance(item: ListItem<Info>) {
		var info = item.value as Info;
		if (info.window) {
			var panel = info.panel as HTMLElement;
			ReactDom.unmountComponentAtNode(panel);
			(panel.parentElement as HTMLElement).removeChild(panel);
			info.window = undefined;
			info.panel = undefined;
			this._InstanceIDs.delete(_get_full_id_by_info(info));
		}
	}

	private _unload(item: ListItem<Info>) {
		if (!item.host) return;
		this._unloadInstance(item);
		(item.host as List<Info>).del(item);
	}

	private _getInfo(app: Application, id: string | NewWindow<Window>): ListItem<Info> | null {
		utils.assert(app);
		var _id: string = typeof id == 'string' ? String(id): getDefaultId(id);
		var fid = _get_full_id(app, _id);
		var item = this._InstanceIDs.get(fid);
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
		var item = this._topHistory.first;
		if (item)
			this._unload(item);
	}, 1e3);

	private _bottom_unload = new DelayCall(()=>{
		var item = this._bottomHistory.first;
		if (item)
			this._unload(item);
	}, 1e3);

	private _setCoverFullOpen(name: CoverName, value: boolean) {
		var self = this as any;
		if (self[`_${name}_full_open`] != value) {
			self[`_${name}_full_open`] = value;
			var item = self[`_${name}History`].first as Item;
			if (item) {
				if (value) {
					(item.value as Info2).window.triggerResume();
				} else {
					(item.value as Info2).window.triggerPause();
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
			var {app,win} = this._getCoverConstructor(type);
			if (!win) return;
			if (this._topHistory.length === 0) {
				this._load(app, win, Target.TOP);
			}
		} else {
			var {app,win} = this._getCoverConstructor(type);
			if (!win) return;
			if (this._bottomHistory.length === 0) {
				this._load(app, win, Target.BOTTOM);
			}
		}

		this._setCoverPosition(type, value, 'px', 0);
	}

	protected triggerBeginMove(e: Event) {
		// console.log('triggerBeginMove');
		if (this._cur) {
			var info = this._cur.value as Info;
			var act = (info.window as Activity);
			if (act.preventCover) {
				return;
			}
		}
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
			var ok = e.speed > 200 && e.begin_direction == e.instant_direction;
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