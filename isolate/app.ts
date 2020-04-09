/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import {Activity,Cover,Construction} from './ctr';
import ApplicationLauncher from './sys';

/**
 * @class Application isolate
 */
export default abstract class Application {
	readonly abstract name: string;
	readonly launcher: ApplicationLauncher;
	private _cur: Activity | null = null; // current activity

	get current(): Activity {
		utils.assert(this._cur);
		return this._cur as Activity;
	}

	constructor(launcher: ApplicationLauncher) {
		this.launcher = launcher;
	}

	abstract body(): Construction<Activity>;
	top(): Construction<Cover> | null { return null; }
	bottom(): Construction<Cover> | null { return null; }
	protected triggerLoad() {}
	protected triggerUnload() {}
	protected triggerPause() {}
	protected triggerResume() {}
	protected triggerBackground() {}
	protected triggerForeground() {}
}

export interface ApplicationFactory {
	(args?: any): Application;
}