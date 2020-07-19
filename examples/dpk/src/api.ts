
import req from './models';

// 获取精灵信息
export function getMinerInfo(hash: string) {
	return req.get('device/coupon/miner', { miner_hash: hash.substring(2) });
}

// 获取星球名称，星主名称
export function getGlobalInfo(space_hash: string) {
	return req.get('device/space/detail', {space_hash})
}

// 获取权益 0 未兑换 1 已兑换
export function getConvertRights(hash: string, last: number) {
	return req.get('device/rights/lists', { miner_hash: hash.substring(2), last, limit: 10});
}

export function getUnConvertRights(hash: string, last: number) {
	return req.get('device/coupon/lists', { miner_hash: hash.substring(2), last, limit: 10 });
}

export function getMyStars(account_address: string) {
	return req.get('device/space/mylist', {account_address});
}

export function getMinerPlanet(hash: string) {
	return req.useCacheAfterError('device/space/minerSpace', {miner_hash: hash.substring(2) });
}

// 获取binding用户信息
export function getUserInfo(account_address: string) {
	return req.useCacheAfterError('device/account/detail', {account_address});
}