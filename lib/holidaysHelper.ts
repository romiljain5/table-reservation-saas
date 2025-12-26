// Check if a date is in the blocked holidays list
export function isDateBlocked(
  date: Date | string,
  holidays: Array<{ date: string; reason: string }> | null | undefined
): boolean {
  if (!holidays || !Array.isArray(holidays)) {
    return false;
  }

  const dateStr = typeof date === "string" ? date : date.toISOString().split("T")[0];

  return holidays.some((h) => h.date === dateStr);
}

// Get the reason for a blocked date
export function getBlockedReason(
  date: Date | string,
  holidays: Array<{ date: string; reason: string }> | null | undefined
): string | null {
  if (!holidays || !Array.isArray(holidays)) {
    return null;
  }

  const dateStr = typeof date === "string" ? date : date.toISOString().split("T")[0];

  const holiday = holidays.find((h) => h.date === dateStr);
  return holiday?.reason ?? null;
}

// Get all blocked dates in a given month
export function getBlockedDatesInMonth(
  year: number,
  month: number,
  holidays: Array<{ date: string; reason: string }> | null | undefined
): Array<{ date: string; reason: string }> {
  if (!holidays || !Array.isArray(holidays)) {
    return [];
  }

  const yearStr = year.toString();
  const monthStr = (month + 1).toString().padStart(2, "0");

  return holidays.filter((h) => h.date.startsWith(`${yearStr}-${monthStr}`));
}
