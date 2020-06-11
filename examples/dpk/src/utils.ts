
export function moneyFormat(money: number) {
	return String(Number(money) || 0);
}

export function precision(num: number, precision: number) {
	precision = Math.pow(10, precision);
	return Math.round((Number(num) || 0) * precision) / precision;
}