/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import {Activity,Construction} from './ctr';
import ApplicationLauncher from './sys';

/**
 * @class Application isolate
 */
export default abstract class Application {
	readonly abstract name: string;
	readonly isActive: boolean;
	readonly launcher: ApplicationLauncher;
	triggerLoad() {}
	triggerUnload() {}
	triggerPause() {}
	triggerResume() {}
	triggerBackground() {}
	triggerForeground() {}
	abstract body(): Construction<Activity>;
	top(): Construction<Activity> | null { return null; }
	bottom(): Construction<Activity> | null { return null; }
}

export interface ApplicationFactory {
	(args?: any): Application;
}