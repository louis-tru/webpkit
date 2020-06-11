
export interface Traceability {
	trans_id: number; // 
	block_number: string; // 区块链号
	block_node: string; // 节点
	order_no: string; // 交易ID
	order_cost: number; // 购买价格
	resident_name: string; // 购买人
	create_time: number; // 1588778848,
	update_time: number; // 1588778848
	order_status: number; // 2, 4:基础数据
	poster_type: string;
}