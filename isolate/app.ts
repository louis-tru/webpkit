/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import {NewWindow,Cover} from './ctr';
import ApplicationLauncher from './core';

/**
 * @class Application
 */
export abstract class Application {
	readonly abstract name: string;
	readonly launcher: ApplicationLauncher;
	constructor(launcher: ApplicationLauncher) {
		this.launcher = launcher;
	}
	triggerLaunch(args: Dict) {}
	triggerLoad() {}
	triggerUnload() {}
	top(): NewWindow<Cover> | null {
		return null;
	}
	bottom(): NewWindow<Cover> | null {
		return null;
	}
}