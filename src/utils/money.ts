
export function formatMoney (value: number): string {
	return Intl.NumberFormat('vi-VN', {
		style: "currency",
		currency: "VND"
	}).format(value * 1_000_000)
}