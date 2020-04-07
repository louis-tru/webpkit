/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import GlobalState from '../utils/state';
import ApplicationIsolate from './app';

export type Type = 'main' | 'widget' | 'top' | 'bottom' | 'layer';

export interface Construction<T = ViewController> {
	new(args?: any): T;
	readonly type: Type;
}

export class ViewController<P = {}> extends GlobalState<P> {
	readonly application: ApplicationIsolate;
	constructor(props: any) {
		var application = props.__app as ApplicationIsolate;
		utils.assert(application);
		utils.assert(application.isActive);
		super(props);
		this.application = application;
	}
	static get type() { return '' }
}

export class Activity<P = {}> extends ViewController<P> {
	static get type() { return 'activity' }
}

export class Widget<P = {}> extends ViewController<P> {
	static get type() { return 'widget' }
}

class Cover<P = {}> extends Activity<P> {
}

export class Top<P = {}> extends Cover<P> {
	static get type() { return 'top' }
}

export class Bottom<P = {}> extends Cover<P> {
	static get type() { return 'bottom' }
}

/**
 * @class Layer 只在所属的application活跃时对能被显示,除系统application外
 */
export class Layer<P = {}> extends ViewController<P> {
	static get type() { return 'layer' }
}