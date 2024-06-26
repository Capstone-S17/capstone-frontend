export function isToday(date: Date) {
	const today = new Date();
	return (
		date.getDate() == today.getDate() &&
		date.getMonth() == today.getMonth() &&
		date.getFullYear() == today.getFullYear()
	);
}

export function isYesterday(date: Date) {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return (
		date.getDate() == yesterday.getDate() &&
		date.getMonth() == yesterday.getMonth() &&
		date.getFullYear() == yesterday.getFullYear()
	);
}

export function withinLastWeek(date: Date) {
	const lastWeek = new Date();
	lastWeek.setDate(lastWeek.getDate() - 7);
	return date > lastWeek;
}

export function withinLastMonth(date: Date) {
	const lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);
	return date > lastMonth;
}
