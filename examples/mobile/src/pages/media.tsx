
import utils from 'nxkit';
import Header from '../util/header';
import {React, NavPage} from 'webpkit/mobile';
import sdk from 'webpkit/lib/store';
import { ConBar } from '../util/bar';
import { Monitor } from 'nxkit/monitor';

const piper720p = require('../res/piper720p.mp4');

export default class extends NavPage<{auto?: boolean}> {
	state = {volume: 0, light: 0};
	private m_m_volume = new Monitor(40, -1);
	private m_m_light = new Monitor(40, -1);

	async triggerLoad() {
		if (this.params.auto) {
			var volume = 1, light = 1;
			this.setState({ volume: 1, light: 1 });
			await this.m_m_light.start(e=>{
				(light -= 0.01) >= 0 ? this.setState({ light: light }): e.stop();
			});
			await utils.sleep(1000);
			await this.m_m_light.start(e=>{
				(light += 0.01) <= 1 ? this.setState({ light: light }) : e.stop();
			});
			await this.m_m_light.start(e=>{
				(light -= 0.01) >= 0.6 ? this.setState({ light: light }) : e.stop();
			});
			await this.m_m_volume.start(e=>{
				(volume -= 0.01) >= 0 ? this.setState({ volume: volume }): e.stop();
			});
			await this.m_m_volume.start(e=>{
				(volume += 0.01) <= 1 ? this.setState({ volume: volume }): e.stop();
			});
			await this.m_m_volume.start(e=>{
				(volume -= 0.01) >= 0.6 ? this.setState({ volume: volume }): e.stop();
			});
			this.popPage(true);
		} else {
			var volume: number = await sdk.device.methods.getVolume();
			var light: number = await sdk.device.methods.getScreenLight();
			this.setState({ volume, light });
		}
	}

	async onUnload() {
		if (this.m_m_volume.running) {
			this.m_m_volume.stop();
		}
		if (this.m_m_light.running) {
			this.m_m_light.stop();
		}
	}

	m_handle_play = ()=>{
		if (this.params.auto) {
			(this.refs.video as HTMLVideoElement).currentTime = 100;
		}
	}

	m_handle_time_update = ()=>{
		// console.log('currentTime', this.refs.video.currentTime);
	}

	m_change_handle_0 = async (value: number)=>{
		await sdk.device2.methods.setVolume({ value });
	}

	m_change_handle_1 = async (value: number)=>{
		await sdk.device2.methods.setScreenLight({ value });
	}

	render() {
		return (
			<div className="index media">
				<Header title="Video" page={this} />

				<video
					ref="video"
					style={{ width: '100%' }}
					controls={true}
					autoPlay={true}
					preload="auto"
					onPlay={this.m_handle_play}
					onTimeUpdate={this.m_handle_time_update}
					src={piper720p}
				></video>
				{
					// <audio
					// 	style={{ width: '100%', margin: '1rem 0' }}
					// 	controls="controls"
					// 	src={require.resolve('../res/piper720p.mp4')}
					// ></audio>
				}
				<ConBar value={this.state.volume} title="音量" onChange={this.m_change_handle_0} />
				<ConBar value={this.state.light} title="亮度" onChange={this.m_change_handle_1} />

			</div>
		);
	}

}
