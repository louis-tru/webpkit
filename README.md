Web Page KIT Framework
=====================

这个项目是基于react做的二次封装，提供了一些基础组件库，比如：`全局状态`、`局部状态`、`路由`等。

项目分为5个主要的模块：

1.`lib`核心模块对react二次封装

2.`mobile`移动端导航解决方案

3.`isolate`多apps隔离系统

4.`cms`ui框架

5.`webpack`二次封装


# lib

主要对react组件做二次封装

## global state

`GlobalState` 这是提全局状态管理的组件，继承于react的`Component`,

当继承于此组件的子组件，在组件属性`state`中有两种全局状态表示方法，前缀`$`与`$$`开头的属性。

声明以`$`前缀的名称表示使用全局临时状态，不同组件中的切换不会丢失状态，但页面重载后状态会丢失。

声明以`$$`前缀名称表示使用全局永久状态，状态会以`localstorage`方式存入到本地，页面重载状态不会丢失。

使用示例：

```ts
import {GlobalState} from 'webpkit/lib/state';

class Test1 extends GlobalState {
	state = {
		$a: 100, // 临时全局状态。如果全局状态存在，该值会被重新初始化为全局状态中对应的值，如果全局状态不存在，会将`100`存入到全局状态中
		$$b: 200, // 永久全局状态
	}

	componentDidMount() {
		// 更新全局状态。在这里更新后，所有当前依赖这个全局变量的组件都会发生更新
		// 这相当于调用了所有依赖此全局属性组件的setState
		this.setState({ $a: 1000 });
	}

	render() {
		return (
			<div>{ this.state.$a }</div>
		);
	}

}

class Test2 extends GlobalState {
	state = {
		$a: null, // 这里会不一定会是`null`值，会被初始化成全局状态中存储的值
	}
}

```

## ctr

这里提供了一个全新的react基础组件`ViewController`来代替react的`Component`组件，

`ViewController`组件与原生的`Component`功能基本类似，但名称api名称做了一些修改，也增加了几个属性与方法，

此外`ViewController`拥有`GlobalState`组件全部特性，可以直接在state中使用全局状态。

以下是组件原型：

```ts
declare class ViewControllerDefine<P = {}, S = {}> {
	static contextType?: React.Context<any>;
	readonly context: any;
	readonly persistentID: string;
	constructor(props: Readonly<P>);
	constructor(props: P, context?: any);
	setState<K extends keyof S>(
		state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
		callback?: () => void
	): void;
	protected saveState(): any;
	protected recoveryState(): void;
	forceUpdate(callback?: () => void): void;
	render(): React.ReactNode;
	readonly props: Readonly<P> & Readonly<{ children?: React.ReactNode }>;
	state: Readonly<S>;
	readonly refs: {
		[key: string]: ViewControllerDefine<any,any> | Element;
	};
	readonly isLoaded: boolean;
	readonly isMounted: boolean;
	readonly isDestroy: boolean;
	protected triggerLoad(): void;
	protected triggerMounted(): void;
	protected triggerUpdate(prevProps: Readonly<P>, prevState: Readonly<S>): void;
	protected triggerRemove(): void;
	protected triggerError(error: Error, errorInfo: React.ErrorInfo): void;
}
```

以下是方法与属性说明：

*`isLoaded` 表示`triggerLoad()`是否执行完成

*`isMounted` 组件是否挂载完成

*`isDestroy` 组件是否已经被卸载

*`triggerLoad()` 组件在挂载交前执行，也可以重写成异步函数，执行完成后会把`isLoaded`属性设置成`true`，并重新调用`render()`

*`triggerMounted()` 组件挂载完成后执行

*`triggerUpdate()` 组件在更新时执行，这包括属性更新与状态更新

*`triggerRemove()`组件在卸载时执行

*`triggerError()`组件在发生异常时执行


### local state

除以上功能外，此组件还有一个局部状态的功能，这个局部变量默认是临时的。

这与全局状态有些类似，也都是在组件在卸载后重新加载时，还能恢复之前的状态，

与全局状态不同的是，此局部状态只能在当前组件使用不能共享到全局。

此功能由两个重载函数实现，`saveState(): any`与`recoveryState(): any`

`saveState()` 会在组件卸载时自动被调用，如果这个函数返回了一些数据，这些数据将会做为未来可恢复的状态保存起来，

返回的数据默认保存到一个临时的`map`中,以做为未来恢复状态使用。

不返回数据时不保存状态，并会把之前保存的状态清除。

`recoveryState()`在初始化组件时调用，返回的数据做为初始化组件的状态数据，这个函数默认从一个临时的`map`获取数据并返回，

一般情况下不需要重载此函数，但如果有必要把数据存储到别的地方时或存储为永久状态时就需要重写此函数。

除了上述的两个重载函数外，还有个只读属性`persistentID`这个属性做为状态数据存储时的`key`使用,默认这个`key`值就是组件构造本身，

但存在多个相同实例的组件时，这些实例组件的局部状态一定是相同的，如果需要组件使用的局部状态不相同时，那就可以重写此属性来达到目的。


以下是一个使用局部状态的实例：

```ts
import {ViewController} from 'webpkit/lib/ctr';

class Test extends ViewController {

	state = { a: 100, b: 200 }

	saveState() {
		return this.state; // 当前的组件状态直接返回
	}

	render() {
		return (
			<div>{ this.state.a }</div>
		);
	}

}

```

## page

封装的页面类组件，用来统一架构并规范一般ui编程以`Page`输出为主模块，页面之间解耦合。

这个组件提供了一些一般页面跳转方法，与参数获取的属性，在使用lib提供的root组件时页面的基础类型必需是`Page`。

具体api与属性见ts代码，`lib/page.tsx`


## root

这是类库提供的启动组件，这个组件提供了一个默认一级路由以json属性的转入到root组件上。

以下是实例代码：

```tsx
import {Root,ReactDom,React} from 'webpkit/lib';

ReactDom.render(<MyRoot routes={[
	{
		path: ['/', '/index'],
		page: () => import('./pages/index'),
	},
	{
		path: '/bad_pixels',
		page: () => import('./pages/bad_pixels'),
	},
]} />, document.querySelector('#app'));
```

`lib` 中还有其它的封装功能这，可直接查看ts代码，核心是上面所描述的几个，下面简单列出这些组件都是什么：

*`gesture` 手势解析与控制

*`cell` 横向滚动数据流列表

*`dialog`通用对话框

*`keyboard`软键盘ui组件套件

*`layer`图层控制

*`loading`加载时小组件

*`qrcode`二维码组件

*`request`http请求提供类

*`state`全局状态

*`router`路由组件，一般不需要直接使用

*`upload`上传组件



# mobile

提供了一个移动端上使用的导航套件，主要提供类似iOS系统导航ui组件的功能。


## page

`NavPage`导航页面，导航滚动的基础组件，在mobile中提供的`Root`组件上必需要使用这个`NavPage`组件做为路由的基本组件


## root


这是`mobile`类库提供的启动组件，这个组件提供了一个默认一级路由以json属性的转入到root组件上，

路由的组件只能是`NavPage`。

以下是实例：

```tsx
import {Root,ReactDom,React} from 'webpkit/mobile';

ReactDom.render(<MyRoot routes={[
	{
		path: ['/', '/index'],
		page: () => import('./pages/index'),
	},
	{
		path: '/bad_pixels',
		page: () => import('./pages/bad_pixels'),
	},
]} />, document.querySelector('#app'));
```


# cms

cms中提供了一套UI框架，这包括`menu`、`header`、`footer`、`page`，其它与`lib`没有本质区别


# isolate

这是一套在一个网页中运行多个apps的隔离系统，适用于需要第三方开发者在宿主app中开发自己的app，并且这些众多的apps是独立运行，相互不影响。

通过修改过的`webpack`打包脚本与特有的工具可以将这些apps打包成独立可以安装卸载的安装包。

核心架构如下：

-ApplicationLauncher
	-Application
		-Activity
		-Activity
		-Widget
		-Cover
	-Application
		-Activity
	-Application
		-Activity


`ApplicationLauncher`由系统启动，默认启动一个默认系统app, 这个app在装机时默认安装到系统中，

这个app一般用来管理众多apps的桌面程序，可以启动、安装、卸载apps。

app中的activity表示一个独占屏幕，一个app可以拥有多个activiet，这与android的ui架构很类似，

这些activity之间可以通过系统api以消息的形式相与通迅与唤起，并具这不局限于自己的app的activity，不同之间app之间的activity都可以用相同的方式通迅与唤醒。

具体的api说明查看ts代码。

以下列出文件所代码的大概功能：

*`app`app基础类型，所有自定义的app都应该继承于此

*`core`这是系统启动时创建的实体，一般不需要由用户自己创建，可通过表态函数获取当前实例

*`ctr`提供了在app中运行的ui组件，最上面是`Window`，`ACtivity`也是继承于此，还包括`Widget`、`Cover`。
`Widget`窗口内的小组件
`Cover`下拉与卡拉覆盖层，每个app都可有自己的上拉与下拉覆盖层菜单


更多细节可以参考这几个项目：

`http://gitlab.stars-mine.com/hardware/dphoto-lib.git` 这是dphoto设备app程序使用的一个基础库

`http://gitlab.stars-mine.com/hardware/dphoto-core.git` 这是dphoto设备系统app项目，依赖`dphoto-lib`

`http://gitlab.stars-mine.com/hardware/dphoto-art.git` 这是为dphoto设备开发的一个三方app，依赖`dphoto-lib`

`http://gitlab.stars-mine.com/hardware/dpc-run.git` 这是dphoto设备的app安装与卸载工具


# webpack

对webpack的默认配置，可直接引用`webpack/index`使用打包工具

