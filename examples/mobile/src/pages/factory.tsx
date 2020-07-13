
import Header from '../util/header';
import { React, NavPage } from 'webpkit/mobile';
import sdk from '../sdk';
import {prompt,alert,confirm} from 'webpkit/lib/dialog';
import {Input} from '../util/keyboard';
import utils from 'somes';
import '../css/factory.css';

export default class extends NavPage {

	state = {
		wifiPanel: true,
		wifiHotspotList: null as (any[] | null),
		deviceId: '',
		deviceSn: '',
		loadingText: '',
		done: false,
		address: '',
		isActivate: false,
	};

	async triggerLoad() {

		sdk.message.addEventListener('InvalidDeviceActivate', e=>{
			alert(e.data.message);
			if (e.data.errno == 1001) {
				this.m_init_status();
			}
		}, this);

		this.setState({
			deviceId: await sdk.device.methods.deviceId(),
			deviceSn: await sdk.device.methods.serialNumber(),
			address: await sdk.device.methods.getAccountAddress(),
			isActivate: await sdk.device.methods.isActivate(),
		});

		this.m_handle_refresh();
	}

	triggerRemove() {
		sdk.message.removeEventListenerWithScope(this);
	}

	m_handle_refresh = async ()=>{
		this.setState({ wifiHotspotList: null });
		this.setState({ wifiHotspotList: await sdk.device.methods.getWifiHotspotList(), details: await sdk.device.methods.details() });
	}

	m_handle_poweroff = ()=>{
		sdk.device.methods.poweroff();
	}

	m_init_status = ()=>{
		this.setState({ wifiPanel: true });
		this.m_handle_refresh();
	}

	m_start = async(cfg?: Dict)=>{
		try {
			if (cfg) {
				this.setState({ loadingText: 'Setting wifi ...' });
				if (!await this.m_handle_select_wifi(cfg))
					return;
				this.setState({ wifiPanel: false });
			}
			var wifi = await sdk.device.methods.getWifiStatus();
			if (wifi.available) {
				if (await this.m_activate()) {
					this.setState({ isActivate: true });
					if (await this.m_exchangeMiner()) {
						this.setState({ done: true });
						var miner = await this.m_checkMiner();
						await new Promise(ok=>alert(`exchange miner ok, miner hash = ${miner.miner_hash} id = ${miner.id}, index = ${miner.miner} star = ${miner.star}`, ok));
						await this.m_reset();
					}
				}
			} else {
				this.setState({ wifiPanel: true });
				alert('请先设置Wifi');
			}
		} catch (err) {
			alert(err.message);
		} finally {
			this.setState({ loadingText: '' });
		}
	}

	m_reset = async()=>{
		await new Promise((ok,reject)=>{
			confirm('是否恢复出厂设置？', e=>{
				if (e) {
					sdk.device.methods.reset().then(ok).catch(reject);
				} else {
					ok();
				}
			});
		});
	}

	async m_activate() {
		if (await sdk.device.methods.isActivate())
			return true;
		await sdk.device.methods.activate();
		this.setState({ loadingText: 'Device activating ...' });
		var index = 0;
		while (!await sdk.device.methods.isActivate()) {
			if (this.state.wifiPanel)
				return false;
			await utils.sleep(5e3);
			this.setState({ loadingText: `Device activating ${++index} ...` });
			try {
				if (index % 5 === 0)
					await sdk.device.methods.activate();
			} catch(err) {}
		}
		return true;
	}

	async m_checkMiner() {
		var miners = await sdk.device.methods.getMiners();
		return miners[0] || null;
	}

	async m_exchangeMiner() {
		if (await this.m_checkMiner())
			return true;
		this.setState({ loadingText: 'Exchange miner ...' });
		var minerSN = await sdk.wallet.methods.getExchangeMiner();
		if (!minerSN) {
			throw Error.new('矿工兑换码不存在！');
		}

		try {
			await sdk.wallet.methods.exchangeMiner({ minerSN });
		} catch(err) {
			await new Promise(ok=>alert(err.message, ok));
			await new Promise((ok,reject)=>{
				confirm(`出错了是否要继续？${err.message}`, e=>{
					if (e) ok(); else reject(err);
				});
			});
		}

		var index = 0;
		while (!await this.m_checkMiner()) {
			if (this.state.wifiPanel)
				return false;
			// try {
			// 	if (index % 5 === 0)
			// 		await sdk.wallet.exchangeMiner({ minerSN });
			// } catch(err) {}
			await utils.sleep(5e3);
			this.setState({ loadingText: `Exchange Miner ${++index} ...` });
		}

		return true;
	}

	async m_handle_select_wifi(cfg: Dict) {
		if (cfg.encryption_key == 'off') {
			return await sdk.device.methods.setWifi({ ssid: cfg.essid, pwd: '' });
		} else if (cfg.config && cfg.flags.indexOf('FAIL') == -1) {
			return await sdk.device.methods.selectWifi({ ssid: cfg.essid });
		} else {
			return await new Promise((resolve, reject)=>{
				prompt({text: `请输入密码:${cfg.essid}`, input: Input}, async (pwd, ok)=>{
					if (ok) {
						if (!pwd)
							return alert('密码不能为空', ()=>resolve());
						var opt = {ssid: cfg.essid, pwd, isWep: false };
						if (cfg.encryption_mode == 'WEP')
							opt.isWep = true;
						sdk.device.methods.setWifi(opt).then(resolve).catch(reject);
					} else {
						resolve();
					}
				});
			});
		}
	}

	render() {
		var {wifiPanel,wifiHotspotList,done,loadingText,deviceId,deviceSn,address,isActivate} = this.state;
		return (
			<div className="factory">
				<Header title="Factory" page={this} />
				<div className="whl_sn">id: {deviceId}, sn: {deviceSn}, {address}, {isActivate?'已激活':''}</div>
				{ wifiPanel?
					loadingText?
					<div>
						<div className="whl_err">{loadingText}</div>
					</div>:
					<div>
						<div className="content">
							{
								wifiHotspotList?
								wifiHotspotList.length?
								wifiHotspotList.map((e,i)=>{
									var selected = e.config&&e.config.flags=='[CURRENT]'? 'selected': '';
									return (
										<div key={i} className={`whl_item ${selected}`} onClick={()=>this.m_start(e)}>
											{e.essid} {e.encryption_mode}
										</div>
									);
								}):
								<div className="whl_err">None hotspot</div>:
								<div className="whl_err">Scaning...</div>
							}
						</div>
						<div className="_btn _btn2" onClick={this.m_handle_refresh}>Refresh</div>
						<div className="_btn" onClick={this.m_handle_poweroff}>PowerOff</div>
					</div>:
					done?
					<div>
						<div className="whl_err">Done 已激活，矿工已经创建</div>
						<div className="_btn _btn2" onClick={this.m_reset}>Reset Device</div>
					</div>:
					loadingText?
					<div>
						<div className="whl_err">{loadingText}</div>
						<div className="_btn _btn2" onClick={this.m_init_status}>Stop</div>
					</div>:
					<div>
						<div className="_btn _btn2" onClick={e=>this.m_start()}>Continue</div>
						<div className="_btn" onClick={this.m_init_status}>Setting Network</div>
					</div>
				}

			</div>
		);
	}
}