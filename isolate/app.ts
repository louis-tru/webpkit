/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import {NewWindow,Cover} from './ctr';
import ApplicationLauncher from './core';

/**
 * @class Application isolate
 */
export default abstract class Application {
	readonly abstract name: string;
	readonly launcher: ApplicationLauncher;
	constructor(launcher: ApplicationLauncher) {
		this.launcher = launcher;
	}
	triggerLaunch(args?: any) {}
	triggerLoad() {}
	triggerUnload() {}
}

export abstract class ApplicationSystem extends Application {
	abstract top(): NewWindow<Cover>;
	abstract bottom(): NewWindow<Cover>;
}