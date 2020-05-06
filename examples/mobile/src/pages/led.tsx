
import Header from '../util/header';
import { React, NavPage } from 'webpkit/mobile';
import sdk from 'webpkit/lib/store';
import {Monitor} from 'nxkit/monitor';
import '../css/led.css';

export default class extends NavPage<{auto?: boolean}> {
	
	state = {
		btn: -1,
		text: '',
		text2: '',
		text2_css: '',
		text3: '',
		text3_css: '',
	};
	private m_attach_ok = 0;
	private m_button_ok = 0;
	private m_monitor = new Monitor(5000, -1);
	
	async triggerLoad() {

		sdk.message.addEventListener('AttachmentAttach', e=>{
			this.setState({ 'text2_css': 'ok' });
			this.m_attach_ok = 1;
		}, 'led');

		sdk.message.addEventListener('AttachmentDeattach', e=>{
			this.setState({ 'text2_css': '' });
			this.m_attach_ok = 0;
		}, 'led');

		sdk.message.addEventListener('PowerPressDown', e=>{
			this.setState({ 'text3_css': 'ok' });
			this.m_button_ok = 1;
		}, 'led');

		sdk.message.addEventListener('PowerPress', e=>{
			this.setState({ 'text3_css': '' });
			this.m_button_ok = 0;
		}, 'led');

		if (this.params.auto) {
			var i = 0;
			var handles = ['A', 'B', 'C', 'D'];
			await this.m_monitor.start(e=>{
				if (i >= 4) {
					e.stop();
				} else {
					(this as any)['m_handle_' + handles[i]]();
					i++;
				}
			});

			this.setState({ text2: '请插入附件' });

			await this.m_monitor.start(e=>{
				if (this.m_attach_ok) {
					e.stop();
				}
			});

			this.setState({ text2: '请拔出附件' });

			await this.m_monitor.start(e=>{
				if (!this.m_attach_ok) {
					e.stop();
				}
			});

			this.setState({ text3: '请按下按钮' });

			this.m_monitor.interval = 1000;

			await this.m_monitor.start(e=>{
				if (this.m_button_ok) {
					e.stop();
				}
			});

			this.setState({ text3: '请松开按钮' });

			await this.m_monitor.start(e=>{
				if (!this.m_button_ok) {
					e.stop();
				}
			});

			await this.m_monitor.start(async e=>{
				if (await sdk.device.methods.getScreenPower()) {
					e.stop();
					this.popPage(true);
				}
			});
		}
	}

	async onUnload() {
		sdk.message.removeEventListener('AttachmentAttach', 'led');
		sdk.message.removeEventListener('AttachmentDeattach', 'led');
		sdk.message.removeEventListener('PowerPressDown', 'led');
		sdk.message.removeEventListener('PowerPress', 'led');

		if (this.m_monitor.running) {
			this.m_monitor.stop();
		}
		sdk.device.methods.closeLED({name: 'led'});
	}

	m_handle_A = async ()=>{
		sdk.device.methods.openLED({
			time: 0,
			speed: 1,
			name: 'led',
			colors: ["0xff00ff", "0xffff00", "0xff0000", "0x00ff00", "0xff"],
		});
		this.setState({ text: '测试A', btn: 0 });
	}

	m_handle_B = ()=>{
		sdk.device.methods.openLED({
			time: 0,
			speed: 0,
			name: 'led',
			colors: ["0xffffff", "0x0"],
		});
		this.setState({ text: '测试B', btn: 1 });
	}

	m_handle_C = ()=>{
		sdk.device.methods.openLED({
			time: 0,
			speed: 3,
			name: 'led',
			colors: ["0xffffff", "0x0", "0xf000f0", "0x00ff", "0xff0000", "0x00ff"],
		});
		this.setState({ text: '测试C', btn: 2 });
	}

	m_handle_D = ()=>{
		sdk.device.methods.openLED({
			time: 0,
			speed: 0,
			name: 'led',
			colors: ["0xff00", "0x0", "0xf0fff0", "0x00ff", "0xff0000", "0xf00ff0"],
		});
		this.setState({ text: '测试D', btn: 3 });
	}

	render() {
		return (
			<view className={this.mcls('index led')}>
				<Header title="LED/Button" page={this} />
				<div className={`g_btn ${this.state.btn==0?'g_btn2':''}`} onClick={this.m_handle_A}>A</div>
				<div className={`g_btn ${this.state.btn==1?'g_btn2':''}`} onClick={this.m_handle_B}>B</div>
				<div className={`g_btn ${this.state.btn==2?'g_btn2':''}`} onClick={this.m_handle_C}>C</div>
				<div className={`g_btn ${this.state.btn==3?'g_btn2':''}`} onClick={this.m_handle_D}>D</div>
				<div className="text1">{ this.state.text }</div>
				<div className={'text2 ' + this.state.text2_css}>LED附件: { this.state.text2 }</div>
				<div className={'text2 ' + this.state.text3_css}>电源按钮: { this.state.text3 }</div>
			</view>
		);
	}

}
