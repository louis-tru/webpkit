/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import {Activity,NewWindow,Cover} from './ctr';
import ApplicationLauncher from './sys';

/**
 * @class Application isolate
 */
export default abstract class Application {
	readonly abstract name: string;
	readonly launcher: ApplicationLauncher;
	private _cur = ''; // current activity id

	get current(): Activity | null {
		var act = this.launcher.getWindow(this, this._cur);
		return act as Activity;
	}

	constructor(launcher: ApplicationLauncher) {
		this.launcher = launcher;
	}

	triggerLaunch(args?: any) {}
	triggerLoad() {}
	triggerUnload() {}
	triggerPause() {}
	triggerResume() {}
	triggerBackground() {}
	triggerForeground() {}
}

export abstract class ApplicationSystem extends Application {
	abstract top(): NewWindow<Cover>;
	abstract bottom(): NewWindow<Cover>;
}