export function CalculateDueDate(
  dateString: string,
  turnaroundTimeInHours: number
): string {
  if (!isISO8601(dateString))
    throw new Error("Invalid date format. Date must be in ISO8601 format");
  const startOfDay = 9;
  const endOfDay = 17;
  const workHours = endOfDay - startOfDay;
  const date = new Date(dateString);
  const submittedDayOfWeek = date.getUTCDay();
  const submittedHourOfDay = date.getUTCHours();

  if (
    submittedDayOfWeek === 0 ||
    submittedDayOfWeek === 6 ||
    submittedHourOfDay < startOfDay ||
    submittedHourOfDay >= endOfDay
  )
    throw new Error("Invalid submit date/time");
  const totalWorkDays = Math.floor(turnaroundTimeInHours / workHours);
  const weeksToAdd = Math.floor(totalWorkDays / 5);
  let hoursToAdd = turnaroundTimeInHours - totalWorkDays * workHours;
  let daysToAdd = totalWorkDays - 5 * weeksToAdd;

  if (hoursToAdd + submittedHourOfDay >= endOfDay) {
    daysToAdd++;
    hoursToAdd = hoursToAdd - workHours;
  }

  if (submittedDayOfWeek + daysToAdd > 5) {
    daysToAdd += 2;
  }
  const totalHoursToAdd = (weeksToAdd * 7 + daysToAdd) * 24 + hoursToAdd;
  const dueDate = new Date(date.getTime() + totalHoursToAdd * 60 * 60 * 1000);
  return dueDate.toISOString();
}

function isISO8601(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[\+\-]\d{2}:\d{2})$/.test(
    dateString
  );
}
