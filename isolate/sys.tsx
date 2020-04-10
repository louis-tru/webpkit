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

function get_id(app: Application, id: string) {
	return id + '_' + app.name;
}

function getId<T extends Window>(window: WindowNew<T>, app: Application) {
	utils.assert(window);
	if (!(window as any).hasOwnProperty('__default_id')) {
		(window as any).__default_id = String(utils.id);
	}
	return get_id(app, String((window as any).__default_id));
}

export default class ApplicationLauncher extends 
Gesture<{width?: number|string, height?: number|string}> {
	public state = { __ch: 0 };
	private _installed: Map<string, ()=>Promise<ApplicationNew>> = new Map();
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

	install(appName: string, app: ()=>Promise<ApplicationNew>) {
		utils.assert(!this._installed.has(appName));
		this._installed.set(appName, app);
	}

	uninstall(appName: string) {
		utils.assert(this._installed.has(appName));
		this._installed.delete(appName);
	}

	/**
	 * @func launch application
	 */
	async launch(appName: string, args?: any) {
		var app = this._apps.get(appName);
		if (!app) {
			var ff = this._installed.get(appName);
			utils.assert(ff, `Application does not exist, ${appName}`);
			if (!ff) return;
			var App = await ff();
			app = new App(this);
			if (!this._sys)
				this._sys = app;
		}
		this.show(app, app.body(), args);
	}

	show<T extends Window>(app: Application, window: WindowNew<T>, args?: any) {
		if (window.type == Type.ACTIVITY) { // activity
			this._load(app, window, Target.ACTIVITY, args);
			this.showActivity(app, window as any, args);
		} else if (window.type == Type.WIDGET) { // widget
			this._load(app, window, Target.WIDGET, args);
		} else if (window.type == Type.TOP) {
			// this._load(app, window, Target.TOP, args);
		} else if (window.type == Type.BOTTOM) {
			// this._load(app, window, Target.BOTTOM, args);
		}
	}

	close<T extends Window>(app: Application, window: string | WindowNew<T>) {
		this._destroy(app, window);
	}

	private _autoDestroyActivity() {
		 // TODO auto destroy
		this._activity.forEach(e=>this._destroy(e.app, e.id));
	}

	private showActivity(app: Application, window: WindowNew<Activity>, args?: any) {
		this._autoDestroyActivity();
		this._cur = this._load(app, window, Target.ACTIVITY, args);
		(app as any)._cur = this._cur;
	}

	private _load<T extends Window>(app: Application, 
		window: WindowNew<T>, target: Target, args?: any)
	{
		utils.extendClass(Window, window);
		var id = String(args ? args.id: getId(window, app));
		var c = this._IDs.get(id);
		((this as any)['_' + target] as WindowInfo[]).forEach(c=>c.key=false);
		if (c) {
			c.key = true;
		} else {
			var c2: WindowInfo = { app, args, Window: window, id, target, key: true };
			((this as any)['_' + c2.target] as any[]).push(c);
			this._IDs.set(id, c as any);
		}
		this.setState({ __ch: this.state.__ch + 1 });
		return id;
	}

	private _destroy<T extends Window>(app: Application, 
		window: string | WindowNew<T>)
	{
		var id: string = typeof window == 'string' ? 
			get_id(app, String(window)): getId(window, app);
		var c = this._IDs.get(id);
		if (c) {
			if (id === this._cur)
				this._cur = '';
			if (c.target == Target.ACTIVITY && (c.app as any)._cur == id)
				(c.app as any)._cur = ''; // private visit
			((this as any)['_' + c.target] as WindowInfo[]).deleteOf(c);
			this._IDs.delete(id);
			this.setState({ __ch: this.state.__ch + 1 });
		}
	}

	getWindow(app: Application, id: string): null | Window {
		return this.refs[get_id(app, id)] as Window;
	}

	render() {
		var {_activity,_widget,_top,_bottom} = this;

		return (
			<div className="iso_sys" ref="__root">
				<div className="iso_bodys" ref="__bodys">
				{
					_activity.map(({args,Window,app,id})=>
						<Window {...args} __app__={app} key={app.name} id={id} ref={id} />
					)
				}
				</div>
				<div className="iso_widgets" ref="__widgets" >
				{
					_widget.map(({args,Window,app,id})=>
						<Window {...args} __app__={app} key={app.name + id} id={id} ref={id} />
					)
				}
				</div>
				<div className="iso_covers" style={{top: '-100%'}} ref="__tops" >
				{
					_top.map(({args,Window,app,id})=>
						<Window {...args} __app__={app} key={app.name + id} id={id} ref={id} />
					)
				}
				</div>
				<div className="iso_covers" style={{top: '100%'}} ref="__bottoms">
				{
					_bottom.map(({args,Window,app,id})=>
						<Window {...args} __app__={app} key={app.name + id} id={id} ref={id} />
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
		// TODO ...
	}

	protected triggerMove(e: Event) {
		// TODO ...
	}

	protected triggerEndMove(e: Event) {
		// TODO ...
	}

	static get current() {
		utils.assert(_cur, 'No the ApplicationLauncher instance');
		return _cur as ApplicationLauncher;
	}

	static launch(appName: string) {
		return ApplicationLauncher.current.launch(appName);
	}
}