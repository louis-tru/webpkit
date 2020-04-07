/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import {React} from '../lib';
import {ViewController,Activity,Widget,Top,Bottom,Layer,Construction,Type} from './ctr';
import Application, {ApplicationFactory} from './app';
import './sys.css';
import Gesture, {Ev} from './gesture';

var _cur: ApplicationLauncher | null = null;

interface ConstructorWrap<T = ViewController> {
	args?: any;
	app: Application;
	Constructor: Construction<T>;
	id: string;
	type: Type;
}

function getId<T>(ctr: Construction<T>, app: Application) {
	utils.assert(ctr);
	if (!(ctr as any).hasOwnProperty('__id')) {
		(ctr as any).__id = String(utils.id);
	}
	return String((ctr as any).__id) + '_' + app.name;
}

export default class ApplicationLauncher extends Gesture<{width?: number|string, height?: number|string}> {
	public state = { __ch: 0 };
	private _installed: Map<string, ()=>Promise<ApplicationFactory>> = new Map();
	private _app: Application | null = null; // current launch app
	private __main: ConstructorWrap<Activity>[] = [];
	private __widget: ConstructorWrap<Widget>[] = [];
	private __top: ConstructorWrap<Top>[] = [];
	private __bottom: ConstructorWrap<Bottom>[] = [];
	private __layer: ConstructorWrap<Layer>[] = [];
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

	private _show<T = ViewController>(app: Application, ctr: Construction<T>, args?: any) {
		utils.extendClass(ViewController, ctr);
		var id = String(args ? args.id: getId(ctr, app));
		var type = ctr.type;
		utils.assert(type, 'Incorrect type');
		utils.assert(!this._IDs.has(id), 'ID already exists');
		var c: ConstructorWrap<T> = { app, args, Constructor: ctr, id, type };
		(this as any)['__' + type].push(c);
		this._IDs.set(id, c as any);
		this.setState({ __ch: this.state.__ch + 1 });
	}

	private _close<T = ViewController>(app: Application, id: string | Construction<T>) {
		var id_: string;
		if (typeof id == 'string') {
			id_ = String(id) + '_' + app.name;
		} else {
			id_ = getId(id, app);
		}
		var c = this._IDs.get(id_);
		if (c) {
			(this as any)['__' + c.type].deleteOf(c);
			this.setState({ __ch: this.state.__ch + 1 });
		}
	}

	render() {
		return (
			<div className="iso_sys">
				<div className="iso_main" ref="__main">
					{
						this.__main.map(({args,Constructor,app})=>
							<Constructor {...args} app={app} key={app.name} />
						)
					}
				</div>
				<div className="iso_layers" ref="__widget" >
					{
						this.__widget.map(({args,Constructor,app,id})=>
							<Constructor {...args} app={app} key={app.name + id} />
						)
					}
				</div>
				<div className="iso_cover" style={{top: '-100%'}} ref="__top" >
					{
						this.__top.map(({args,Constructor,app,id})=>
							<Constructor {...args} app={app} key={app.name + id} />
						)
					}
				</div>
				<div className="iso_cover" style={{top: '100%'}} ref="__bottom"> */}
					{
						this.__bottom.map(({args,Constructor,app,id})=>
							<Constructor {...args} app={app} key={app.name + id} />
						)
					}
				</div>
				<div className="iso_layers" ref="__layer">
					{
						this.__layer.map(({args,Constructor,app,id})=>
							<Constructor {...args} app={app} key={app.name + id} />
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