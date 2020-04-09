/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import UI from '../lib/ui';
import Application from './app';
import './ctr.css';

export interface Construction<T> {
	new(args?: any): T;
}

export class Window<P = {}> extends UI<P> {
	readonly application: Application;
	constructor(props: any) {
		super(props);
		var application = props.__app__ as Application;
		utils.assert(application);
		utils.assert(application.isActive);
		this.application = application;
	}
}

export class Activity<P = {}> extends Window<P> {}

export class Widget<P = {}> extends Window<P> {}

export class Cover<P = {}> extends Window<P> {}