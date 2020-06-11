/**
 * @copyright © 2018 Copyright dphone.com
 * @date 2019-01-03
 */

import './index.scss';
import * as React from 'react';
import {Activity} from 'webpkit/isolate';
import {Dialog} from 'webpkit/lib/dialog';
import {Layer} from 'webpkit/lib/layer';
import qrcode from 'dphoto-lib/qrcode';
import {sign} from 'dphoto-lib/request';
import {querystringStringify} from 'nxkit/request';
import {Cell,CellPanel} from 'webpkit/lib/cell';
import {DelayCall} from 'nxkit/delay_call';
import req from '../request';
import sdk, {store} from '../sdk';
import * as utils from '../utils';
import {Poster} from '../models/poster';
import * as config from '../../config';
import storage from '../storage';
import {Loading} from 'dphoto-lib/loading';
import {GainRevenue} from '../dialog/gain-revenue';

async function contributeURL() {
	var obj = await sign('', '', store) as Dict<string>;
	obj.device_address = await sdk.device.methods.getAddress();
	obj.space_id = config.space_id;
	return config.contribute + '?' + querystringStringify(obj);
}

function contributeAlert(url: string, act?: Activity) {
	qrcode({title:'提交数字艺术品', text:'扫描二维码来提交数字艺术品', url}, act?.dialogStack);
}

class MoreDialog extends Dialog {

	triggerMaskClick() {
		this.close();
	}

	get noMask() {
		return true;
	}

	private _handle_click_1 = ()=>{
		this.close();
		// this.activity?.presentDynamicModule(import('../../spirit'));
	};

	private _handle_click_2 = async ()=>{
		this.close();
		contributeAlert(await contributeURL(), this.activity);
	};

	renderBody() {
		return (
			<div className="dphoto_art_more">
				<div className="spirit" onClick={this._handle_click_1}>精灵</div>
				<div className="contribute" onClick={this._handle_click_2}>提交数字艺术品</div>
			</div>
		);
	}
}

class Guide extends Layer {

	state = {step: 0};

	private _close() {
		storage.set('dphoto_art_guide', false);
		this.close();
	}

	private _handleClick = ()=>{
		if (this.state.step == 1)
			this._close();
		else
			this.setState({ step: this.state.step + 1 });
	};

	protected get $el() {
		return this.refs.root as HTMLDivElement;
	}

	renderBody() {
		var {step} = this.state;
		return (
			<div className="dphoto_art_guide" ref="root">
				{step==0?<div className="step_0">
					<div className="_btn">
						<div className="a" onClick={this._handleClick}>我知道了</div>
						<div className="b">点击这里“提交数字艺术品”</div>
					</div>
					<div className="icon_1" />
					<div className="border_1" />
				</div>: null}
				{step==1?<div className="step_1">
					<div className="_btn">
						<div className="a" onClick={this._handleClick}>我知道了</div>
						<div className="b">这里查看发行详情</div>
					</div>
					<div className="icon_1" />
					<div className="border_1">300</div>
				</div>: null}
			</div>
		);
	}

	static show(act: Activity) {
		if (storage.get('dphoto_art_guide', true)) {
			act.layerGroup.show(Guide);
		}
	}

}

export default class Index extends Activity {

	permanent = 1;
	state = {
		more: false,
		posters: [] as Poster[],
		loaded: false,
	};

	private _handleAction = async ()=>{
		if (this.state.more) {
			this.showDialog(MoreDialog);
		} else { // more
			contributeAlert(await contributeURL(), this);
		}
	};

	private _handle_click_1 = (poster: Poster)=>{
		this.presentDynamicModule(import('./details'), {poster});
	};

	private async _fetchData() {
		var device_address = await sdk.device.methods.getAddress();
		var {data:posters} = await req.withoutErr(this, 'device/rights/posterList')({device_address,offset:0,limit:100});
		this.setState({posters});
	}

	protected async triggerLoad() {

		sdk.message.addEventListener('CORE_DEPOSIT_PROOF', ()=>{
			this._fetchData();
		}, this);

		sdk.message.addEventListener('HASHII_CREATE', ()=>{
			this._fetchData();
		}, this);

		sdk.message.addEventListener('HASHII_TRANSFER', ()=>{
			this._fetchData();
		}, this);

		sdk.message.addEventListener('HASHII_PROFIT', (e)=>{
			this.showDialog(GainRevenue, {poster:e.data});
			this._fetchData();
		});

		sdk.message.addEventListener('UnBindUser', ()=>this._fetchData(), this);
		sdk.message.addEventListener('BindUser', ()=>setTimeout(()=>this._fetchData(), 1e3), this);

		sdk.device.methods.getMiners().then(e=>{
			this.setState({more: e.length});
		});

		setTimeout(()=>this.setState({loaded: true}), 5e3)

		await this._fetchData();
	}

	private _setIntervalid: any;

	protected triggerMounted() {

		this._setIntervalid = setInterval(()=>{
			if (this._playing && this.state.posters.length) {
				var panel = this.refs.cells as CellPanel;
				panel.switchAt(panel.index + 1);
			}
		}, 5e3);

		Guide.show(this);
	}

	protected triggerRemove() {
		super.triggerRemove();
		clearInterval(this._setIntervalid);
		req.withoutErr(this, 'device/rights/posterList'); // CANCEL
		sdk.message.removeEventListenerWithScope(this);
	}

	private _playing = true;
	private _ResumePlay= new DelayCall(()=>{
		this._playing = true;
	}, 1e3);

	private _HandlePausePlay = ()=>{
		this._ResumePlay.clear();
		this._playing = false;
	};

	private _HandleResumePlay = ()=>{
		this._ResumePlay.call();
	};

	triggerResume() {
		this._ResumePlay.call();
	}

	triggerPause() {
		this._ResumePlay.clear();
		this._playing = false;
	}

	protected renderBody() {
		var {more,posters,loaded} = this.state;
		return (
			<div className="dphoto_art_index" onTouchStart={this._HandlePausePlay} onTouchEnd={this._HandleResumePlay}>
				{loaded || this.isLoaded?
				<CellPanel bounce={true} ref="cells" transitionDuration={500}>
					{posters.length?posters.map((e,j)=>{
						return (
							<Cell key={j} className="cell">
								{/* <div style={{fontSize: '1rem', textAlign: 'center'}}>{j}</div> */}
								<div className="img">
									<img src={e.poster_picture} />
								</div>
								<div className="info">
									{/* <div className="txt1">虔诚的教徒们</div>
									<div className="txt2">大师兄师<span/>2020年</div> */}
									{e.rights_total_volume?<div className="txt3">总成交额：{utils.moneyFormat(e.rights_total_volume)}</div>:null}
									<div className="icons">
										{e.rights_publish_number?<div className="b" onClick={()=>this._handle_click_1(e)}>{e.rights_publish_number}</div>:null}
										{e.rights_like?<div className="a">{e.rights_like}</div>:null}
									</div>
								</div>
							</Cell>
						);
					}):
					<Cell className="cell">
						<img src={require('../../assets/art/51590054826_.pic_hd.jpg')} style={{width: '100%', height: '100%'}} />
					</Cell>}
				</CellPanel>: <Loading />}
				<div className={"action " + (more?'':'contribute')} onClick={this._handleAction} />
				<div className="box_1"></div>
			</div>
		);
	}

}