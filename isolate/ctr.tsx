/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import * as React from 'react';
import {ViewController} from '../lib/ctr';
import Application from './app';
import {Dialog,DialogStack} from '../lib/dialog';

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
	close(animate: boolean = true) {
		this.app.launcher.close(this.app, this.id, animate);
	}
}

export abstract class Activity<P = {}> extends Window<P> {
	static readonly type: Type = Type.ACTIVITY;
	private _dialogStack: DialogStack;

	private get dialogStack() {
		if (!this._dialogStack) {
			this._dialogStack = new DialogStack(this.refs.dialog as HTMLElement);
		}
		return this._dialogStack;
	}

	protected triggerRemove() {
		if (this._dialogStack)
			this._dialogStack.closeAll();
	}

	present(activity: NewWindow<Activity>, args?: any) {
		this.app.launcher.show(this.app, activity, args);
	}

	showDialog(D: typeof Dialog, opts?: any) {
		this.app.launcher.closeCoverAll();
		return this.dialogStack.show(D, opts);
	}

	closeDialog(id: typeof Dialog | string) {
		return this.dialogStack.close(id);
	}

	render() {
		return (
			<div ref="dom">
				{this.renderBody()}
				<div ref="dialog"></div>
			</div>
		);
	}

	abstract renderBody(): React.ReactNode;
}

export class Widget<P = {}> extends Window<P> {
	static readonly type = Type.WIDGET;
}

export class Cover<P = {}> extends Window<P> {
	static readonly type = Type.COVER;
}