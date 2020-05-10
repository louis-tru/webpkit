
import Header from '../util/header';
import { React, NavPage, dialog } from 'webpkit/mobile';
import sdk from 'webpkit/lib/store';

export default class extends NavPage {

	state = { ssid: 'hard-chain-6G', passwd: 'hard-chain2017' };

	m_handle_change_ssid = (e: any)=>{
		this.setState({ ssid: e.target.value });
	}

	m_handle_change_passwd = (e: any)=>{
		this.setState({ passwd: e.target.value });
	}

	m_handle_set_wifi = (e: any)=>{
		dialog.confirm('Do you want to set up WiFi ?', e=>{
			if (e) {
				sdk.device.methods.setWifi({ ssid: this.state.ssid, pwd: this.state.passwd }).then(e=>{
					dialog.alert('setting wifi ok');
				});
			}
		})
	}

	render() {
		return (
			<div className="index">
				<Header title="Setting WiFi" page={this} />
				<div style={{margin: '10px'}}>
					<p>
						<h4>ssid: </h4>
						<input value={this.state.ssid} type="input" onChange={this.m_handle_change_ssid} /> 
					</p>
					<p>
						<h4>passwd: </h4>
						<input value={this.state.passwd} type="input" onChange={this.m_handle_change_passwd} />
					</p>
					<p>
						<input onClick={this.m_handle_set_wifi} value="commit" type="button" />
					</p>
				</div>
			</div>
		);
	}

}
