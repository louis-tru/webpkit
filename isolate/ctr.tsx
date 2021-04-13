/*
 * @copyright © 2018 Copyright dphone.com
 * @date 2020-04-07
 */

import utils from 'somes';
import * as React from 'react';
import {ViewController} from '../lib/ctr';
import {Application} from './app';
import {Dialog, DialogStack, Options } from '../lib/dialog';
import {Layer, LayerGroup} from '../lib/layer';

export enum Type {
	ACTIVITY = 1,
	WIDGET,
	COVER,
}

export enum CoverType {
	TOP, BOTTOM,
}

/**
 * 
 * 窗口构造器接口
 * 
 * @interface NewWindow 
*/
export interface NewWindow<T extends Window> {
	new(args?: any): T;
	type: Type;
}

/**
 * 
 * activity 启动选项
 * 
 * @interface ActivityOptions
*/
export interface ActivityOptions extends Options {
	callback?: {
		app: string;
		args?: any;
	};
}


/**
 * 
 * 窗口基础类型，派生子类型`Activity`、`Widget`、`Cover`
 * 
 * @class Window
*/
export class Window<P = {}, S = {}> extends ViewController<P, S> {
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
		return this.app.launcher.close(this.app, this.id, animate);
	}
}


/**
 * 
 * activity 导航状态
 * 
 * @enum
*/
export enum ActivityNavStatus {
	BACKGROUND = 1, // activity 进入背景状态
	FOREGROUND = 2, // activity 进入前景状态
	LEAVE = 3, // activity 离线状态，并不代码这个activity被卸载
}

/**
 * 
 * app 屏幕独占容器组件，一个app可以有多个这样的组件实例
 * 
 * @class Activity 
*/
export abstract class Activity<P = {}, S = {}> extends Window<P, S> {
	static readonly type: Type = Type.ACTIVITY;
	private _dialogStack?: DialogStack;
	private _layerGroup?: LayerGroup;

	permanent = 0;
	navStatus = ((this.props as any).__navStatus || ActivityNavStatus.LEAVE) as ActivityNavStatus;

	/**
	 * 
	 * 重写此只读属性，防止在这个activity上下拉或上拉出cover，返回`true`表示阻止cover呈现
	 * 
	 * @get preventCover
	*/
	get preventCover() {
		return this._dialogStack?.preventCover || this._layerGroup?.preventCover || false;
	}

	/**
	 * 
	 * 返回此activity的对话框栈
	 * 
	 * @get dialogStack
	*/
	get dialogStack() {
		if (!this._dialogStack) {
			this._dialogStack = new DialogStack(this.refs.__layers as HTMLElement);
		}
		return this._dialogStack;
	}

	/**
	 * 
	 * 返回此activity的所使用的layer组
	 * 
	 * @get layerGroup
	*/
	get layerGroup() {
		if (!this._layerGroup) {
			this._layerGroup = new LayerGroup(this.refs.__layers as HTMLElement);
		}
		return this._layerGroup;
	}

	/**
	 * 
	 * 重写状态恢复，如果自定义的activity需要局部状态，可以重写实现一个saveState的方法
	 * 
	 * 这个方法解决的是，只有从背景恢复时才恢复状态，其它状态忽略状态恢复
	 * 
	 * @func recoveryState()
	*/
	protected recoveryState() {
		if (this.navStatus == ActivityNavStatus.BACKGROUND) { // 从背景恢复时才恢复状态
			return super.recoveryState();
		}
	}

	protected triggerRemove() {
		if (this._dialogStack)
			this._dialogStack.closeAll();
	}

	/**
	 * 
	 * 退出此activity，调用此方法后屏幕应该显示上一个activity
	 * 
	 * @func exit()
	*/
	exit(rc?: any, animate = true) {
		var cb = (this.props as ActivityOptions).callback;
		if (cb) {
			return this.app.launcher.launch(cb.app, {animate, ...cb.args, ...rc});
		} else {
			return this.close(animate);
		}
	}

	/**
	 * 
	 * 呈现一个新的activity
	 * 
	 * @func present()
	*/
	present(activity: NewWindow<Activity>, args?: ActivityOptions, animate = true) {
		this.app.launcher.show(this.app, activity, args, animate);
	}

	/**
	 * 
	 * 从动态模块呈现一个activity
	 * 
	 * @func presentDynamicModule()
	*/
	presentDynamicModule(module: Promise<{default: NewWindow<Activity>}>, args?: ActivityOptions, animate = true) {
		module.then(({default: Act})=>this.present(Act, args, animate));
	}

	/**
	 * 
	 * 呈现一个新对话框
	 * 
	 * @func showDialog()
	*/
	showDialog(D: typeof Dialog, opts?: Options, animate = true): Promise<Dialog> {
		this.app.launcher.closeCoverAll();
		return this.dialogStack.show(D, opts, animate, this);
	}

	/**
	 * 
	 * 通过id关闭一个对话框
	 * 
	 * @func closeDialog()
	*/
	closeDialog(id: typeof Dialog | string, animate = true) {
		return this.dialogStack.close(id, animate);
	}

	/**
	 * 
	 * 呈现一个新的图层
	 * 
	 * @func showLayer()
	*/
	showLayer(L: typeof Layer, opts?: Options, animate = true, delay = 0): Promise<Layer> {
		this.app.launcher.closeCoverAll();
		return this.layerGroup.show(L, opts, animate, delay, this);
	}

	/**
	 * 
	 * 通过id关闭图层显示
	 * 
	 * @func closeLayer()
	*/
	closeLayer(id: typeof Layer | string, animate = true) {
		return this.layerGroup.close(id, animate);
	}

	render() {
		return (
			<div ref="__dom">
				{this.renderBody()}
				<div ref="__layers">
				</div>
			</div>
		);
	}

	async intoBackground(animate: number) {
		var div = this.refs.__dom as HTMLDivElement;
		var prevNavStatus = this.navStatus;
		if (prevNavStatus != ActivityNavStatus.BACKGROUND) {
			this.navStatus = ActivityNavStatus.BACKGROUND;
			this.triggerPause();
			if (div) {
				if (animate) {
					div.style.zIndex = '2';
					div.style.transitionDuration = `${animate}ms`;
					div.style.transform = 'translateX(-50%) scale(1,1)';
					await utils.sleep(400);
				}
				div.style.display = 'none';
			}
		} else {
			this.triggerPause();
		}
	}

	async intoForeground(animate: number) {
		var div = this.refs.__dom as HTMLDivElement;
		var prevNavStatus = this.navStatus;
		if (prevNavStatus != ActivityNavStatus.FOREGROUND) {
			this.navStatus = ActivityNavStatus.FOREGROUND;
			this.triggerResume();
			if (div) {
				div.style.display = 'block';
				div.style.transitionDuration = '0ms';
				if (animate) {
					div.style.transitionDuration = '0ms';
					if (prevNavStatus == ActivityNavStatus.LEAVE) { //  <- right
						div.style.zIndex = '3';
						div.style.transform = 'translateX(100%) scale(1,1)';
					} else { // left ->
						div.style.zIndex = '1';
						div.style.transform = 'translateX(-50%) scale(1,1)';
					}
					await utils.sleep(30);
					div.style.transitionDuration = `${animate}ms`;
					div.style.transform = 'translateX(0) scale(1,1)';
					await utils.sleep(400);
				} else {
					div.style.transform = 'translateX(0) scale(1,1)';
				}
			}
		} else {
			this.triggerResume();
		}
	}

	async intoLeave(animate: number) {
		var div = this.refs.__dom as HTMLDivElement;
		var prevNavStatus = this.navStatus;
		if (prevNavStatus != ActivityNavStatus.LEAVE) {
			this.navStatus = ActivityNavStatus.LEAVE;
			this.triggerPause();
			if (div) {
				if (animate) {
					div.style.zIndex = '2';
					div.style.transitionDuration = `${animate}ms`;
					div.style.transform = 'translateX(100%) scale(1,1)';
					await utils.sleep(400);
				}
				div.style.display = 'none';
			}
		} else {
			this.triggerPause();
		}
	}

	/**
	 * 
	 * 重写此方法来呈现activity的内容
	 * 
	 * @func renderBody()
	*/
	protected abstract renderBody(): React.ReactNode;
}


/**
 * 
 * app窗口小组件，浮动在activity上面的小组件
 * 
 * @class Widget 
*/
export class Widget<P = {}> extends Window<P> {
	static readonly type = Type.WIDGET;
}


/**
 * 
 * 下拉或上拉覆盖层，覆盖在所有的组件之上
 * 
 * @claas Cover
*/
export class Cover<P = {}> extends Window<P> {
	static readonly type = Type.COVER;
}