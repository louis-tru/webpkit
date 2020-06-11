
export interface Poster {
	rights_id: string; // id
	poster_picture: string; // pic url
	rights_total_volume: number; // 总成交额：
	total_turnover: number; 
	rights_like: number; // 喜欢
	rights_publish_number: number; // 总发行量
}

export interface PosterItem {
	account_id: number;
	rights_hold_shares: number;
	rights_shares_ratio: number;
	rights_total_shares: number;
	rights_trace_gas_ratio: number; // 交易手续费
	resident_rights_id: number;
	rights_index: number, // 编号
	rights_publish_number: number;
	rights_total: number, // 总份数
	rights_holder: string, //持有人
	rights_hash: string, // 发行hash rights_hash
	rights_hash_pic: string; // 发行hash图片url
	rights_status: number,// 艺术品状态  rights_status 1已发布 2出售中 3收藏中 4禁止交易
	rights_certificate_pic: string, // 权益证书图片地址
	rights_certificate_url: string; // 权益证书网页地址
	rights_sell_url: string; // 权益出售二维码地址
	sell_price: number; //当前价格
	rights_total_number: number; // 权益总成交量
	rights_total_profit: number; // 权益总利润
	rights_ratio: number; // 权益分润比
	rights_profit: number; // 艺术品利润
	rights_titile: string;
}

export interface PosterTransfer extends PosterItem {
	transfer_time: number;
}