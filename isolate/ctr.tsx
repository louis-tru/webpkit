/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import * as React from 'react';
import {ViewController} from '../lib/ctr';
import Application from './app';
import Dialog from './dialog';
import './ctr.css';

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

export class Window<P = {}> extends ViewController<P> {
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
}

export class Activity<P = {}> extends Window<P> {
	static readonly type: Type = Type.ACTIVITY;
	launch(activity: NewWindow<Activity>, args?: any) {
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
			<div ref="dom">
				Activity
			</div>
		);
	}
}

export class Widget<P = {}> extends Window<P> {
	static readonly type = Type.WIDGET;
}

export class Cover<P = {}> extends Window<P> {
	static readonly type = Type.COVER;
}