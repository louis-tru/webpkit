/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import * as React from 'react';
import {ViewController} from '../lib/ctr';
import {Application} from './app';
import {Dialog, DialogStack, Options } from '../lib/dialog';
import {Layer, LayerGroup} from '../lib/layer';

export enum Type {
	ACTIVITY = 1,
	WIDGET,
	COVER,
}

export enum CoverType {
	TOP, BOTTOM,
}

export interface NewWindow<T extends Window> {
	new(args?: any): T;
	type: Type;
}

export interface ActivityOptions extends Options {
	callback?: {
		app: string;
		args?: any;
	};
}

export class Window<P = {}, S = {}> extends ViewController<P, S> {
	readonly app: Application;
	readonly id: string;
	constructor(props: any) {
		super(props);
		utils.assert(props.__app__);
		this.app = props.__app__;
		this.id = props.id;
	}
	triggerResume() {
		// overwrite
	}
	triggerPause() {
		// overwrite
	}
	close(animate: boolean = true) {
		this.app.launcher.close(this.app, this.id, animate);
	}
}

export enum ActivityNavStatus {
	BACKGROUND = 1,
	FOREGROUND = 2,
	LEAVE = 3,
}

export abstract class Activity<P = {}, S = {}> extends Window<P, S> {
	static readonly type: Type = Type.ACTIVITY;
	private _dialogStack?: DialogStack;
	private _layerGroup?: LayerGroup;

	permanent = 0;
	navStatus = ((this.props as any).__navStatus || ActivityNavStatus.LEAVE) as ActivityNavStatus;

	get preventCover() {
		return this._dialogStack?.preventCover || this._layerGroup?.preventCover || false;
	}

	get dialogStack() {
		if (!this._dialogStack) {
			this._dialogStack = new DialogStack(this.refs.__layers as HTMLElement);
		}
		return this._dialogStack;
	}

	get layerGroup() {
		if (!this._layerGroup) {
			this._layerGroup = new LayerGroup(this.refs.__layers as HTMLElement);
		}
		return this._layerGroup;
	}

	protected recoveryState() {
		if (this.navStatus == ActivityNavStatus.BACKGROUND) {
			return super.recoveryState();
		}
	}

	protected triggerRemove() {
		if (this._dialogStack)
			this._dialogStack.closeAll();
	}

	exit(rc?: any, animate = true) {
		var cb = (this.props as ActivityOptions).callback;
		if (cb) {
			this.app.launcher.launch(cb.app, {animate, ...cb.args, ...rc});
		} else {
			this.close(animate);
		}
	}

	present(activity: NewWindow<Activity>, args?: ActivityOptions, animate = true) {
		this.app.launcher.show(this.app, activity, args, animate);
	}

	presentDynamicModule(module: Promise<{default: NewWindow<Activity>}>, args?: ActivityOptions, animate = true) {
		module.then(({default: Act})=>this.present(Act, args, animate));
	}

	showDialog(D: typeof Dialog, opts?: Options, animate = true): Dialog {
		this.app.launcher.closeCoverAll();
		return this.dialogStack.show(D, opts, animate, this);
	}

	closeDialog(id: typeof Dialog | string, animate = true) {
		return this.dialogStack.close(id, animate);
	}

	showLayer(L: typeof Layer, opts?: Options, animate = true, delay = 0): Layer {
		this.app.launcher.closeCoverAll();
		return this.layerGroup.show(L, opts, animate, delay, this);
	}

	closeLayer(id: typeof Layer | string, animate = true) {
		return this.layerGroup.close(id, animate);
	}

	render() {
		return (
			<div ref="__dom">
				{this.renderBody()}
				<div ref="__layers">
				</div>
			</div>
		);
	}

	async intoBackground(animate: number) {
		var div = this.refs.__dom as HTMLDivElement;
		var prevNavStatus = this.navStatus;
		if (prevNavStatus != ActivityNavStatus.BACKGROUND) {
			this.navStatus = ActivityNavStatus.BACKGROUND;
			this.triggerPause();
			if (div) {
				if (animate) {
					div.style.zIndex = '2';
					div.style.transitionDuration = `${animate}ms`;
					div.style.transform = 'translateX(-50%) scale(1,1)';
					await utils.sleep(400);
				}
				div.style.display = 'none';
			}
		} else {
			this.triggerPause();
		}
	}

	async intoForeground(animate: number) {
		var div = this.refs.__dom as HTMLDivElement;
		var prevNavStatus = this.navStatus;
		if (prevNavStatus != ActivityNavStatus.FOREGROUND) {
			this.navStatus = ActivityNavStatus.FOREGROUND;
			this.triggerResume();
			if (div) {
				div.style.display = 'block';
				div.style.transitionDuration = '0ms';
				if (animate) {
					div.style.transitionDuration = '0ms';
					if (prevNavStatus == ActivityNavStatus.LEAVE) { //  <- right
						div.style.zIndex = '3';
						div.style.transform = 'translateX(100%) scale(1,1)';
					} else { // left ->
						div.style.zIndex = '1';
						div.style.transform = 'translateX(-50%) scale(1,1)';
					}
					await utils.sleep(30);
					div.style.transitionDuration = `${animate}ms`;
					div.style.transform = 'translateX(0) scale(1,1)';
					await utils.sleep(400);
				} else {
					div.style.transform = 'translateX(0) scale(1,1)';
				}
			}
		} else {
			this.triggerResume();
		}
	}

	async intoLeave(animate: number) {
		var div = this.refs.__dom as HTMLDivElement;
		var prevNavStatus = this.navStatus;
		if (prevNavStatus != ActivityNavStatus.LEAVE) {
			this.navStatus = ActivityNavStatus.LEAVE;
			this.triggerPause();
			if (div) {
				if (animate) {
					div.style.zIndex = '2';
					div.style.transitionDuration = `${animate}ms`;
					div.style.transform = 'translateX(100%) scale(1,1)';
					await utils.sleep(400);
				}
				div.style.display = 'none';
			}
		} else {
			this.triggerPause();
		}
	}

	protected abstract renderBody(): React.ReactNode;
}

export class Widget<P = {}> extends Window<P> {
	static readonly type = Type.WIDGET;
}

export class Cover<P = {}> extends Window<P> {
	static readonly type = Type.COVER;
}