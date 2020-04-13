/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import * as React from 'react';
import utils from 'nxkit';
import {ViewController} from '../lib/ctr';
import Application from './app';
import Dialog from './dialog';
import './ctr.css';

export enum Type {
	ACTIVITY = 1,
	WIDGET,
	TOP, BOTTOM,
}

export interface WindowNew<T extends Window> {
	new(args?: any): T;
	type: Type;
}

export class Window<P = {}> extends ViewController<P> {
	readonly app: Application;
	readonly id: string;
	constructor(props: any) {
		super(props);
		utils.assert(props.__app__);
		this.app = props.__app__;
		this.id = props.id;
	}
	// get isActive() {
	// 	return true;
	// }
	// protected triggerMounted() {
	// }
	// protected triggerRemove() {
		// if (this.isActive) {
		// 	this.triggerPause();
		// }
	// }
	protected triggerResume() {
		// overwrite
	}
	protected triggerPause() {
		// overwrite
	}
}

export class Activity<P = {}> extends Window<P> {
	static readonly type: Type = Type.ACTIVITY;
	launch(activity: WindowNew<Activity>, args?: any) {
		this.app.launcher.show(this.app, activity, args);
	}
	saveState(): any {
		return null;
	}
	show(dialog: typeof Dialog, opts?: any) {
		// TODO ...
	}
	close(dialog: typeof Dialog | string) {
		// TODO ...
	}
	render() {
		return (
			<div>
				Activity
			</div>
		);
	}
}

export class Widget<P = {}> extends Window<P> {
	static readonly type = Type.WIDGET;
}

export class Cover<P = {}> extends Window<P> {
}

export class Top<P = {}> extends Cover<P> {
	static readonly type = Type.TOP;
}

export class Bottom<P = {}> extends Cover<P> {
	static readonly type = Type.BOTTOM;
}