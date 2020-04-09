/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import {React} from '../lib';
import {Window,Activity,Widget,Cover,Construction} from './ctr';
import Application, {ApplicationFactory} from './app';
import Gesture, {Ev} from './gesture';
import './sys.css';

var _cur: ApplicationLauncher | null = null;

enum Type {
	BODY = 'body',
	WIDGET = 'widget',
	TOP = 'top',
	BOTTOM = 'bottom',
}

interface ConstructorWrap<T = Window> {
	args?: any;
	app: Application;
	Constructor: Construction<T>;
	id: string;
	type: Type;
}

function getId<T>(ctr: Construction<T>, app: Application) {
	utils.assert(ctr);
	if (!(ctr as any).hasOwnProperty('__default_id')) {
		(ctr as any).__default_id = String(utils.id);
	}
	return String((ctr as any).__default_id) + '_' + app.name;
}

export default class ApplicationLauncher extends 
Gesture<{width?: number|string, height?: number|string}> {
	public state = { __ch: 0 };
	private _installed: Map<string, ()=>Promise<ApplicationFactory>> = new Map();
	private _sys: Application | null = null; // sys app
	private _cur: Activity | null = null; // current activity
	private _apps: Application[] = [];
	private _IDs: Map<string, ConstructorWrap> = new Map();

	componentWillMount() {
		utils.assert(!_cur);
		_cur = this;
	}

	componentWillUnmount() {
		_cur = null;
		super.componentWillUnmount();
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

	private _load<T>(app: Application, ctr: Construction<T>, type: Type, args?: any) {
		utils.extendClass(Window, ctr);
		var id = String(args ? args.id: getId(ctr, app));
		utils.assert(!this._IDs.has(id), `ID already exists "${id}"`);
		var c: ConstructorWrap<T> = { app, args, Constructor: ctr, id, type };
		this._IDs.set(id, c as any);
		this.setState({ __ch: this.state.__ch + 1 });
		return id;
	}

	private _destroy<T>(app: Application, id: string | Construction<T>) {
		var id_: string = typeof id == 'string' ? String(id) + '_' + app.name: getId(id, app);
		var c = this._IDs.get(id_);
		if (c) {
			this._IDs.delete(id_);
			this.setState({ __ch: this.state.__ch + 1 });
		}
	}

	render() {
		var ctx = {
			body: [] as  ConstructorWrap<Activity>[],
			widget: [] as  ConstructorWrap<Widget>[],
			top: [] as  ConstructorWrap<Cover>[],
			bottom: [] as ConstructorWrap<Cover>[],
		};

		for (var [,c] of this._IDs) {
			ctx[c.type].push(c as any);
		}

		return (
			<div className="iso_sys">
				<div className="iso_bodys" ref="__bodys">
				{
					ctx.body.map(({args,Constructor,app})=>
						<Constructor {...args} __app__={app} key={app.name} />
					)
				}
				</div>
				<div className="iso_widgets" ref="__widgets" >
				{
					ctx.widget.map(({args,Constructor,app,id})=>
						<Constructor {...args} __app__={app} key={app.name + id} />
					)
				}
				</div>
				<div className="iso_covers" style={{top: '-100%'}} ref="__tops" >
				{
					ctx.top.map(({args,Constructor,app,id})=>
						<Constructor {...args} __app__={app} key={app.name + id} />
					)
				}
				</div>
				<div className="iso_covers" style={{top: '100%'}} ref="__bottoms">
				{
					ctx.bottom.map(({args,Constructor,app,id})=>
						<Constructor {...args} __app__={app} key={app.name + id} />
					)
				}
				</div>
			</div>
		);
	}

	protected triggerBeginMove(e: Ev) {
		// TODO ...
	}
	protected triggerMove(e: Ev) {
		// TODO ...
	}
	protected triggerEndMove(e: Ev) {
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