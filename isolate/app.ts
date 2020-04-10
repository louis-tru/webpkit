/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'nxkit';
import {Activity,Cover,WindowNew} from './ctr';
import ApplicationLauncher from './sys';

/**
 * @class Application isolate
 */
export default abstract class Application {
	readonly abstract name: string;
	readonly launcher: ApplicationLauncher;
	private _cur = ''; // current activity id

	get current(): Activity {
		var act = this.launcher.getWindow(this, this._cur) as Activity;
		utils.assert(act);
		return act;
	}

	get isActive() {
		return !!this.launcher.getWindow(this, this._cur);
	}

	constructor(launcher: ApplicationLauncher) {
		this.launcher = launcher;
	}
	abstract body(): WindowNew<Activity>;
	top(): WindowNew<Cover> | null { return null; }
	bottom(): WindowNew<Cover> | null { return null; }
	protected triggerLoad() {}
	protected triggerUnload() {}
	protected triggerPause() {}
	protected triggerResume() {}
	protected triggerBackground() {}
	protected triggerForeground() {}
}

export interface ApplicationNew {
	new(launcher: ApplicationLauncher): Application;
}