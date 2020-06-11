
import './gain-revenue.scss';
import * as React from 'react';
import {Dialog} from 'webpkit/lib/dialog';
import {incomeExpression} from './income_expression';
import {PosterTransfer} from '../models/poster';
import * as utils from '../utils';

export class GainRevenue extends Dialog<{poster: PosterTransfer}> {

	private _handleIncomeExpression = ()=>{
		incomeExpression(this.props.poster, this.activity);
	};

	protected renderBody() {
		var poster = this.props.poster;
		return (
			<div className="dphoto_art_GainRevenue">
				<div className="box0">
					<div className="txt1">您的作品</div>
					<div className="txt2">{poster.rights_titile}</div>
					<div className="box1">
						<div className="txt3">交易帮您获得收益</div>
						<div className="txt4">{utils.precision(poster.rights_profit, 2)}<span onClick={this._handleIncomeExpression} /></div>
					</div>
					<div className="txt5">{new Date(poster.transfer_time*1e3).toString('yyyy-MM-dd hh:mm')}</div>
					<div className="arrow1"></div>
					<div className="btn1" onClick={()=>this.close()} >知道了</div>
				</div>
				<div className="close" onClick={()=>this.close()} />
			</div>
		);
	}

}