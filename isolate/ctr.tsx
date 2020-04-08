/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import {React} from '../lib';
import GlobalState from '../utils/state';
import Application from './app';
import './ctr.css';

export interface Construction<T extends BaseUI = BaseUI> {
	new(args?: any): T;
}

export class BaseUI<P = {}> extends GlobalState<P> {
	readonly application: Application;
	constructor(props: any) {
		var application = props.__app__ as Application;
		utils.assert(application);
		utils.assert(application.isActive);
		super(props);
		this.application = application;
	}
}

export class Activity<P = {}> extends BaseUI<P> {
}

export class Widget<P = {}> extends BaseUI<P> {
}

export class Dialog<P = {}> extends BaseUI<P> {
	render() {
		return (
			<div className="iso_dialog">
			</div>
		);
	}
}