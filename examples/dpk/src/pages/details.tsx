
import './details.scss';
import * as React from 'react';
import Activity from 'dphoto-lib/activity';
import Alert from 'dphoto-lib/alert';
import qrcode from 'dphoto-lib/qrcode';
import sdk from '../sdk';
import req from '../models';
import * as utils from '../utils';
import {PosterItem,Poster} from '../models/poster';
import {incomeExpression} from '../dialog/income_expression';

export default class extends Activity<{poster:Poster}> {

	state = {
		poster: {rights_publish_number:0} as Poster,
		list: [] as PosterItem[],
		loading: true,
		end: false,
		offset: 0,
		account_id: 0,
	};

	get preventCover() {
		return true;
	}

	protected name = 'dphoto_art_details';
	protected title = '发行详情';

	protected saveState() {
		return this.state;
	}

	private _handle_click_a = (poster: PosterItem)=>{
		this.presentDynamicModule(import('./certificate'), {poster});
	};

	private _handle_click_b = (poster: PosterItem)=>{
		this.presentDynamicModule(import('./traceability'), {poster});
	};

	private _handle_click_1 = (poster: PosterItem)=>{
		this.presentDynamicModule(import('./haishii'), {poster});
	};

	private _handle_click_2 = (poster: PosterItem)=>{
		incomeExpression(poster, this);
	};

	private _handle_click_3 = (poster: PosterItem)=>{
		Alert.show({
			title: '支付成功',
			text: (
				<div className="dphoto_art_successful_payment_alert">
					<div className="txt1"><span>¥</span> 4,300.00</div>
					<div className="txt2">支付成功，如果您想配送您购买的  实物艺术品，请联系<span>400-000-0000</span></div>
				</div>
			),
			buttons: {},
		}, this.dialogStack);
		// Alert.show({
		// 	title: '支付失败',
		// 	text: (
		// 		<div className="dphoto_art_fail_payment_alert">
		// 			<img className="img1" src={require('../../assets/art/pic_general_load_defeate.png')} />
		// 			<div className="txt1">支付失败，请重试。</div>
		// 		</div>
		// 	),
		// 	buttons: {},
		// }, this.dialogStack);
	};

	private _handle_click_4 = (poster: PosterItem)=>{
		qrcode({ title: '分享出售', text: '扫描二维码来分享出售链接', url: poster.rights_sell_url, width: 180, height: 180 });
	};

	private _offset = 0;

	private async _fetchData() {
		this.setState({ loading: true });
		var device_address = await sdk.device.methods.getAddress();
		var _poster = this.props.poster;
		var {offset,list} = this.state;
		// device/rights/posterPublishList?rights_id=368&offset=1&limit=2&device_address=0x3B4B1e2436703D1423C906BE504aD9D184C44E0b
		var {data: poster} = await req.get('device/rights/posterPublishList', {
			device_address,rights_id: _poster.rights_id, offset: this._offset, limit: this._offset + 100 });
		var data = poster.resident_rights as PosterItem[];
		list.splice(offset, list.length - offset, ...data);
		this.setState({
			poster, list,
			loading: false,
			end: data.length < 100,
			offset: offset + data.length,
		});
	}

	protected async triggerLoad() {
		if (!this.state.list.length) {
			await this._fetchData();
		}
		this.setState({ account_id: await sdk.device.methods.getAccountId() });
	}

	private _rights_status(status: number) {
		return ({
			'1': '收藏中', // 已发布
			'2': '出售中',
			'3': '收藏中',
			'4': '禁止交易',
		} as Dict<string>)[status] || '';
	}

	private _rights_status_cls(status: number) {
		return ({
			'1': 'green',
			'2': 'green',
			'3': 'orange',
			'4': 'red',
		} as Dict<string>)[status] || '';
	}

	renderMain() {
		var {list, loading, end, poster,account_id} = this.state;
		return (
			<div className="list">

				{list.map((e,j)=>{
					return (
						<div className="item" key={j}>
							<div className="row">编号/份数: <span>{e.rights_index}/{poster.rights_publish_number}</span></div>
							<div className="row">持有人: <span>{e.rights_holder}</span></div>
							<div className="row">发行哈希: <span className="long">{e.rights_hash}</span> <span 
								className="more" onClick={()=>this._handle_click_1(e)}>更多{'>'}</span>
							</div>
							{e.rights_profit?
							<div className="row">艺术品利润：<span
								>{utils.precision(e.rights_profit, 2)}</span> <span 
								className="icon" onClick={()=>this._handle_click_2(e)} /></div>:null}

							<div className="row">数字艺术品状态：
								<span className={this._rights_status_cls(e.rights_status)}
									>{this._rights_status(e.rights_status)}</span>
							</div>
							{e.rights_status==2?<div className="row">当前售价：<span>{utils.moneyFormat(e.sell_price)}</span></div>:null}
							<div className="icons">
								{/* <div className="a" onClick={()=>this._handle_click_a(e)} /> */}
								<div className="b" onClick={()=>this._handle_click_b(e)} />
							</div>
							<div className="btns">
								{/* {e.rights_status==2?<div className="a" onClick={()=>this._handle_click_3(e)}>购 买</div>:null} */}
								{e.rights_status==1&&e.account_id==account_id?<div className="b" onClick={()=>this._handle_click_4(e)}>出 售</div>:null}
							</div>

						</div>
					);
				})}

				{loading?<div className="_dphoto_art_loading">加载中</div>:null}
				{/* {end?<div className="_dphoto_art_foot"><span>我也是有底线的</span></div>:null} */}

			</div>
		);
	}
}