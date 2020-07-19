
import './traceability.scss';
import './haishii.scss';
import * as React from 'react';
import Activity from 'dphoto-lib/activity';
import {Dialog} from 'webpkit/lib/dialog';
import req from '../models';
import {PosterItem} from '../models/poster';
import {Traceability} from '../models/traceability';
import * as utils from '../utils';

class Haishii extends Dialog {
	protected renderBody() {
		return (
			<div className="dphoto_art_haishii_dialog">
				<img className="img" src={require('../../assets/art/haishii.png')} />
				<div className="txt">
					Hashii宇宙中流通的限量数字资产，每个都带有一个Hash ID编码，
					这个Hash ID编码证明了数字资产的不可替代性，可根据编码追溯到当前唯一持有人，确保所属权真实、唯一
				</div>
				<div className="close" onClick={()=>this.close()} />
			</div>
		);
	}
}

export default class extends Activity<{poster:PosterItem}> {

	state = {
		list: [] as Traceability[],
		loading: true,
		end: false,
		order: 'desc',
		offset: 0,
	};

	get preventCover() {
		return true;
	}

	protected name = 'dphoto_art_traceability';
	protected title = '溯源';

	private async _fetchData() {
		this.setState({loading: true});
		var poster = this.props.poster;
		var {offset,order,list} = this.state;
		var {data} = await req.get('device/rights/residentPosterTrace', {
			resident_rights_id: poster.resident_rights_id,
			offset: offset,
			limit: offset + 100,
			order: order,
		});
		list.splice(offset, list.length - offset, ...data);
		this.setState({
			list,
			loading: false,
			end: data.length < 100,
			offset: offset + data.length,
		});
	}

	private _handleSort = ()=>{
		this.setState({ list: [], order: this.state.order == 'asc' ? 'desc': 'asc', offset: 0 }, ()=>this._fetchData());
	};

	protected async triggerLoad() {
		await this._fetchData();
	}

	renderMain() {
		var {list, loading, order} = this.state;

		return (
			<div className="scroll">
				{list.length > 1 ? <div className={`sort ${order}`} onClick={this._handleSort}>时间</div>: null}
				{
					list.map((e,j)=>{
						return (
							<div className={`info_block ${j==0?'first':''}` } key={j}>
								<div className="txt1">{e.order_status == 4 ? `基本信息`:
								`${new Date(e.create_time*1e3).toString('yyyy.MM.dd hh:mm')} 交易`}</div>
								<div className="txt2 icon1">区块链号：<span>{e.block_number}</span></div>
								<div className="txt2 icon2">交易ID：<span>{String(e.order_no).substr(0,26)}</span></div>
								<div className="txt2 icon3">节点：<span>{String(e.block_node).substr(0,26)}</span></div>
								{
									e.order_status == 4 ?
									<div className="box1">
										<div className="txt3">作者：<span>{e.resident_name}</span></div>
										<div className="txt3">类型：<span>{e.poster_type}</span></div>
										<div className="txt3">创作时间：<span>{new Date(e.create_time*1e3).toString('yyyy.MM')}</span></div>
									</div>:
									<div className="box1">
										<div className="txt3">购买人：<span>{e.resident_name}</span> {/*<span className="mask">店铺已实名</span>*/}</div>
										<div className="txt3">购买价格：<span>{utils.moneyFormat(e.order_cost)}</span></div>
										{/* <div className="genuine">已鉴定</div> */}
									</div>
								}
							</div>
						);
					})
				}

				{loading?<div className="_dphoto_art_loading">加载中</div>:null}
				{/* {end?<div className="_dphoto_art_foot"><span>我也是有底线的</span></div>:null} */}

			</div>
		);
	}

}