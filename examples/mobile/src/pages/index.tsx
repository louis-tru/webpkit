
import { React, NavPage,dialog } from 'webpkit/mobile';
import sdk from 'webpkit/lib/store';
import utils from 'nxkit';
import '../css/index.css';

export default class extends NavPage {

	state = { details: {} };
	private m_auto_test = false;
	private m_auto_test_step = 0;
	private m_auto_test_tables = [
		'network?auto=1',
		'media?auto=1',
		'led?auto=1',
		'iframe?auto=1',
	];

	async triggerLoad() {
		this.nav.onNav.on(e=>{
			if (this.m_auto_test && e.data.action == 'pop') {
				this.m_auto_test_step++;
				if (this.m_auto_test_step < this.m_auto_test_tables.length) {
					setTimeout(e=>this.pushPage(this.m_auto_test_tables[this.m_auto_test_step], true), 1000);
				} else {
					this.m_auto_test = false;
					setTimeout(e=>dialog.alert('测试完成'), 1000);
				}
			}
		});
		var details = await sdk.device.methods.details();
		this.setState({ details });
		(this.refs.scroll as HTMLDivElement).scrollTop = 949;
		(this.refs.scroll as HTMLDivElement).scrollLeft = 953;
	}

	m_handle_audo_test = ()=>{
		dialog.confirm('要开始测试？', e=>{
			if (e) {
				this.m_auto_test = true;
				this.m_auto_test_step = 0;
				this.pushPage(this.m_auto_test_tables[0], true);
			}
		});
	}

	m_handle_reset_device = ()=>{
		dialog.confirm('是否要重置设备？', e=>{
			if (e) {
				// fs.rm_r_sync('/mnt/dphotos/dphoto-magic-sdk/var/db.db');
				// if (fs.existsSync('/mnt/dphotos/dphoto-hw/var/wpa_supplicant.conf')) {
				// 	fs.writeFileSync('/mnt/dphotos/dphoto-hw/var/wpa_supplicant.conf', '');
				// }
				// setTimeout(e=>sdk.device.reboot().catch(console.error), 500);
				dialog.alert('暂不支持此功能');
			}
		});0
	}

	m_handle_start_desktop() {
		sdk.device.methods.startDesktop();
	}

	m_handle_poweroff = ()=>{
		dialog.confirm('是否要重启？', e=>{
			if (e) {
				setTimeout(e=>sdk.device.methods.reboot().catch(console.error), 500);
			}
		});
	}

	render() {
		return (
			<div className={this.mcls('index index2')} ref="scroll" id="scroll">
				<div className="scroll">
					<pre className="content">
						<code>
						{
							JSON.stringify({
								...utils.filter(this.state.details,
									[	'address',
										'ip',
										'deviceName',
										'serialNumber',
										'versions',
									]
								)
							}, null, 2)
						}
						</code>
					</pre>
					<div className="g_btn g_btn2" onClick={this.m_handle_audo_test}>Auto Test</div>
					<div className="g_btn" onClick={e=>this.pushPage('network', true)}>Network</div>
					<div className="g_btn" onClick={e=>this.pushPage('network_set', true)}>Setting WiFi</div>
					<div className="g_btn" onClick={e=>this.pushPage('media', true)}>Media</div>
					<div className="g_btn" onClick={e=>this.pushPage('led', true)}>LED/Button</div>
					<div className="g_btn" onClick={e=>this.pushPage('bad_pixels', true)}>Bad Pixels</div>
					<div className="g_btn" onClick={e=>this.pushPage('iframe', true)}>WebGL</div>
					<div className="g_btn" onClick={this.m_handle_reset_device}>Reset Device</div>
					<div className="g_btn" onClick={this.m_handle_start_desktop}>Start desktop</div>
					<div className="g_btn" onClick={this.m_handle_poweroff}>PowerOff</div>
					<div className="g_btn" onClick={e=>this.pushPage('factory', true)}>Factory</div>
					<div className="g_btn" onClick={e=>this.pushPage('other', true)}>Other</div>
				</div>
			</div>
		);
	}

}