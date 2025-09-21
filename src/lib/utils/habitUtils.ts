export type Habit = {
	id: number;
	userId: string;
	listId: number;
	icon: string;
	name: string;
	description?: string | null;
	targetValue?: number | null;
	unit?: string | null;
	frequency: string;
	days?: string[] | null;
	displayOrder: number;
	startDate: string;
	startTime?: string | null;
	endTime?: string | null;
	completions?: Record<string, HabitCompletion>;
};

export type HabitCompletion = {
	id: number;
	userId: string;
	habitId: number;
	completedDate: string;
	value: number | null;
	entryMethod: string | null;
};

export function calcProgress(habit: Habit, selectedDate: Date) {
	const completionCount = getResult(habit, selectedDate);
	const targetValue = habit.targetValue ?? 1;
	return Math.round((completionCount / targetValue) * 100);
}

export function checkAlreadyCompletedWeekMonth(habit: Habit, selectedDate: Date) {
	if (habit.frequency === 'weekly' || habit.frequency === 'monthly') {
		const targetValue = habit.targetValue ?? 1;
		const completions = habit.completions ?? {};
		return getResult(habit, selectedDate) >= targetValue && !completions[selectedDate.toISOString().split('T')[0]];
	}
}

export function getResult(habit: Habit, selectedDate: Date) {
	if (habit.frequency === 'weekly') {
		return Number(getWeeklyAccumulated(habit, selectedDate).toFixed(1));
	} else if (habit.frequency === 'monthly') {
		return Number(getMonthlyAccumulated(habit, selectedDate).toFixed(1));
	} else {
		const completions = habit.completions ?? {};
		return completions[selectedDate.toISOString().split('T')[0]]?.value || 0;
	}
}

function getWeeklyAccumulated(habit: Habit, selectedDate: Date) {
	if (!habit?.completions) return 0;

	const weekDays = getPrevWeekDays(selectedDate);
	return weekDays.reduce((total, dateStr) => {
		const completions = habit.completions ?? {};
		return total + (completions[dateStr]?.value ?? 0);
	}, 0);
}

function getMonthlyAccumulated(habit: Habit, selectedDate: Date) {
	if (!habit?.completions) return 0;

	const monthDays = getPrevMonthDays(selectedDate);
	return monthDays.reduce((total, dateStr) => {
		const completions = habit.completions ?? {};
		return total + (completions[dateStr]?.value ?? 0);
	}, 0);
}

function getPrevWeekDays(date: Date) {
	const days = [];
	const startOfWeek = new Date(date);
	const dayOfWeek = date.getDay();
	const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
	startOfWeek.setDate(date.getDate() + diff);

	for (let i = 0; i < 7; i++) {
		const day = new Date(startOfWeek);
		day.setDate(startOfWeek.getDate() + i);
		if (day <= date) {
			days.push(day.toISOString().split('T')[0]);
		}
	}
	return days;
}

function getPrevMonthDays(date: Date) {
	const days = [];
	const year = date.getFullYear();
	const month = date.getMonth();

	for (let day = 1; day <= date.getDate(); day++) {
		const currentDay = new Date(year, month, day, 12, 0, 0);
		days.push(currentDay.toISOString().split('T')[0]);
	}
	return days;
}
