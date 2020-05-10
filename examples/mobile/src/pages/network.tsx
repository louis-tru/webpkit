
import Header from '../util/header';
import { React, NavPage } from 'webpkit/mobile';
import sdk from 'webpkit/lib/store';
import {Monitor} from 'nxkit/monitor';
import req from 'nxkit/request';
import utils from 'nxkit';

export default class extends NavPage<{auto?: boolean}> {
	state = { list: [] as string[] };
	private m_test_count = 0;
	private m_monitor = new Monitor(1000, -1);

	async triggerLoad() {
		var url = 'http://files.dphotos.com.cn/test.txt';
		var device_id = await sdk.device.methods.deviceId();
		this.m_monitor.start(async e=> {
			var i = this.state.list.length;
			var st = Date.now();//time=2.04 ms
			try {
				this.state.list.push(`${url} ..`);
				this.setState({ list: this.state.list });
				var data = await req.get(url, { headers: { 'device-id': device_id } });
				utils.assert(data.data.toString().indexOf('ok') >= 0);
				this.state.list[i] = `${url} ${Date.now() - st} ms ok`;
			} catch(e) {
				this.state.list[i] = `<span style="color:#f00">${url} ${Date.now() - st} ms fail</span>`;
			}
			this.setState({ list: this.state.list });
			this.m_test_count++;
			if (this.m_test_count >= 10 && this.params.auto) {
				this.popPage(true);
			}
		});
	}

	async triggerRemove() {
		if (this.m_monitor.running)
			this.m_monitor.stop();
	}

	render() {
		return (
			<div className="index">
				<Header title="Network" page={this} />
				{
					this.state.list.map((e,j)=>{
						return <div key={j} dangerouslySetInnerHTML={{__html: e}}></div>
					})
				}
			</div>
		);
	}

}
