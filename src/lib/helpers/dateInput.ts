/** Formats a date as the `YYYY-MM-DD` value of an `<input type="date">`, in UTC. */
export function toDateInputValue(d: Date | string | null | undefined): string {
	if (!d) return '';
	const date = d instanceof Date ? d : new Date(d);
	if (Number.isNaN(date.getTime())) return '';
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
