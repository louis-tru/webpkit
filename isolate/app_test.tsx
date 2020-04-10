
import * as React from 'react';
import Application from './app';
import {Activity,Widget} from './ctr';

export default class TestApp extends Application {
	readonly name = 'TestApp';
	body() {
		return TestActivity;
	}
}

class TestWidget extends Widget {
	private test = ()=>{
		this.app.launcher.launch('TestApp');
	}
	render() {
		return (
			<div onClick={this.test}>
				TestWidget
			</div>
		);
	}
}

class TestActivity extends Activity {

	private m_handle_show_widget = ()=>{
		this.app.launcher.show(this.app, TestWidget);
	}

	render() {
		return (
			<div onClick={this.m_handle_show_widget}>
				TestActivity
			</div>
		);
	}

}