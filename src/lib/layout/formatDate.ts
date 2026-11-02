const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-06" -> "Jun 2025". Anything else ("Present", "2025") is returned as-is. */
export function formatMonth(value: string | undefined): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${match[1]}` : value;
}

export function formatDateRange(start?: string, end?: string): string {
  const from = formatMonth(start);
  const to = formatMonth(end);
  if (from && to) return `${from} – ${to}`;
  return from || to;
}
