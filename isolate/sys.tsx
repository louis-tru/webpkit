/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import {React} from '../lib';
import {Type,Window,Activity,Widget,Cover,Construction} from './ctr';
import Application, {ApplicationFactory} from './app';
import Gesture, {Event} from './gesture';
import './sys.css';

var _cur: ApplicationLauncher | null = null;

enum Target {
	ACTIVITY = 'activity',
	WIDGET = 'widget',
	TOP = 'top',
	BOTTOM = 'bottom',
}

interface ConstructorWrap<T extends Window> {
	args?: any;
	app: Application;
	Constructor: Construction<T>;
	id: string;
	target: Target;
}

function getId<T extends Window>(window: Construction<T>, app: Application) {
	utils.assert(window);
	if (!(window as any).hasOwnProperty('__default_id')) {
		(window as any).__default_id = String(utils.id);
	}
	return String((window as any).__default_id) + '_' + app.name;
}

export default class ApplicationLauncher extends 
Gesture<{width?: number|string, height?: number|string}> {
	public state = { __ch: 0 };
	private _installed: Map<string, ()=>Promise<ApplicationFactory>> = new Map();
	private _apps: Application[] = [];
	private _sys: Application | null = null; // sys app
	private _cur: Application | null = null; // current application
	private _IDs: Map<string, ConstructorWrap<any>> = new Map();

	triggerLoad() {
		utils.assert(!_cur);
		_cur = this;
		super.triggerLoad();
	}

	triggerRemove() {
		_cur = null;
	}

	/**
	 * @func install application
	 */
	install(appName: string, app: ()=>Promise<ApplicationFactory>) {
		// TODO ...
	}

	/**
	 * @func uninstall application
	 */
	uninstall(appName: string) {
		// TODO ...
	}

	/**
	 * @func launch application
	 */
	launch(appName: string, args?: any) {
		// TODO ...
	}

	showActivity(app: Application, window: Construction<Activity>, args?: any) {
		utils.assert(window.type == Type.ACTIVITY);
		this._load(app, window, Target.ACTIVITY, args);
	}

	showWidget(app: Application, window: Construction<Widget>, args?: any) {
		utils.assert(window.type == Type.WIDGET);
		this._load(app, window, Target.WIDGET, args);
	}

	showTop(app: Application, window: Construction<Cover>, args?: any) {
		utils.assert(window.type == Type.COVER);
		this._load(app, window, Target.TOP, args);
	}

	showBottom(app: Application, window: Construction<Cover>, args?: any) {
		utils.assert(window.type == Type.COVER);
		this._load(app, window, Target.BOTTOM, args);
	}

	closeActivity(app: Application, window: string | Construction<Activity>) {
		this._destroy(app, window);
	}

	closeWidget(app: Application, window: string | Construction<Widget>) {
		this._destroy(app, window);
	}

	closeTop(app: Application, window: string | Construction<Cover>) {
		this._destroy(app, window);
	}

	closeBottom(app: Application, window: string | Construction<Cover>) {
		this._destroy(app, window);
	}

	private _load<T extends Window>(app: Application, window: Construction<T>, target: Target, args?: any) {
		utils.extendClass(Window, window);
		var id = String(args ? args.id: getId(window, app));
		utils.assert(!this._IDs.has(id), `ID already exists "${id}"`);
		var c: ConstructorWrap<T> = { app, args, Constructor: window, id, target };
		this._IDs.set(id, c as any);
		this.setState({ __ch: this.state.__ch + 1 });
	}

	private _destroy<T extends Window>(app: Application, window: string | Construction<T>): boolean {
		var id: string = typeof window == 'string' ? String(window) + '_' + app.name: getId(window, app);
		var c = this._IDs.get(id);
		if (c) {
			this._IDs.delete(id);
			this.setState({ __ch: this.state.__ch + 1 });
			return true;
		}
		return false;
	}

	render() {
		var ctx = {
			activity: [] as  ConstructorWrap<Activity>[],
			widget: [] as  ConstructorWrap<Widget>[],
			top: [] as  ConstructorWrap<Cover>[],
			bottom: [] as ConstructorWrap<Cover>[],
		};

		for (var [,c] of this._IDs) {
			ctx[c.target].push(c as any);
		}

		return (
			<div className="iso_sys">
				<div className="iso_bodys" ref="__bodys">
				{
					ctx.activity.map(({args,Constructor,app,id})=>
						<Constructor {...args} __app__={app} key={app.name} id={id} />
					)
				}
				</div>
				<div className="iso_widgets" ref="__widgets" >
				{
					ctx.widget.map(({args,Constructor,app,id})=>
						<Constructor {...args} __app__={app} key={app.name + id} id={id} />
					)
				}
				</div>
				<div className="iso_covers" style={{top: '-100%'}} ref="__tops" >
				{
					ctx.top.map(({args,Constructor,app,id})=>
						<Constructor {...args} __app__={app} key={app.name + id} id={id} />
					)
				}
				</div>
				<div className="iso_covers" style={{top: '100%'}} ref="__bottoms">
				{
					ctx.bottom.map(({args,Constructor,app,id})=>
						<Constructor {...args} __app__={app} key={app.name + id} id={id} />
					)
				}
				</div>
			</div>
		);
	}

	protected get $el() {
		return this.refs.iso_sys as HTMLElement;
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