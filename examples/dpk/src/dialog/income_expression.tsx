
import './income_expression.scss';
import * as React from 'react';
import * as utils from '../utils';
import {Activity} from 'webpkit/isolate/ctr';
import {PosterItem} from '../models/poster';
import Alert from 'dphoto-lib/alert';

export function incomeExpression(poster: PosterItem, act?: Activity) {
	var rights_total_number = Number(poster.rights_total_number) || 0;
	var rights_trace_gas_ratio = Number(poster.rights_trace_gas_ratio) || 0;
	var rights_trace_gas_ratio_str = utils.precision(rights_trace_gas_ratio * 100, 2) + '%';
	var rights_hold_shares = Number(poster.rights_hold_shares) || 0;
	var rights_total_shares = Number(poster.rights_total_shares) || 0;
	var total_profit = rights_total_number * rights_trace_gas_ratio;
	var total_profit_str = utils.precision(total_profit, 2);
	var shares_ratio = rights_hold_shares / rights_hold_shares;
	var shares_ratio_str = utils.precision(shares_ratio*100, 2) + '%';
	var profit = total_profit * shares_ratio;
	var profit_str = utils.precision(profit, 2);
	Alert.show({
		title: '计算公式',
		text: (
			<div className="dphoto_art_details_profit_details">
				<div className="txt1">累计成交金额：<span>{rights_total_number}</span></div>
				<div className="txt1">鉴真溯源收益：
					<span>{rights_total_number}×{rights_trace_gas_ratio_str}={total_profit_str}</span>
				</div>
				<div className="txt1">分润比：
					<span>{rights_hold_shares}/{rights_total_shares}={shares_ratio_str}</span>
				</div>
				<div className="txt1">艺术品利润：<span>{total_profit_str}×{shares_ratio_str}={profit_str}</span></div>
				<div className="txt2">备注：“分润比”就是艺术家占的分成比例除以所有角色占的分成比例（100%）</div>
			</div>
		),
		buttons: {},
	}, act?.dialogStack);
}