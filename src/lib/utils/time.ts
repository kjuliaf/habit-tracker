export function isMorning() {
	const now = new Date();
	return now.getHours() >= 4 && now.getHours() < 12;
}

export function isAfternoon() {
	const now = new Date();
	return now.getHours() >= 12 && now.getHours() < 18;
}

export function isEvening() {
	const now = new Date();
	return now.getHours() >= 18 || now.getHours() < 4;
}
