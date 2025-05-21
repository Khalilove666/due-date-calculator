const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;
const WORK_HOURS_PER_DAY = WORK_END_HOUR - WORK_START_HOUR;

/**
 * Calculates the due date based on a submission time and turnaround time in hours.
 *
 * @param submitDateFormattedAsISO8601 - ISO8601-formatted UTC date string
 * @param turnaroundTimeInHours - Time required to complete the task, in work hours
 * @returns Due date as an ISO8601 string
 * @throws Will throw an error if the date is invalid, not in working hours, or if the turnaround time is not positive
 */
export function calculateDueDate(
  submitDateFormattedAsISO8601: string,
  turnaroundTimeInHours: number
): string {
  validateInput(submitDateFormattedAsISO8601, turnaroundTimeInHours);

  const submitDate = new Date(submitDateFormattedAsISO8601);
  const submittedDayOfWeek = submitDate.getUTCDay();
  const submittedHourOfDay = submitDate.getUTCHours();

  if (
    submittedDayOfWeek === 0 ||
    submittedDayOfWeek === 6 ||
    submittedHourOfDay < WORK_START_HOUR ||
    submittedHourOfDay >= WORK_END_HOUR
  )
    throw new Error("Invalid submit date/time");

  const turnaroundTimeAsWorkDays = Math.floor(
    turnaroundTimeInHours / WORK_HOURS_PER_DAY
  );
  const weeksToAdd = Math.floor(turnaroundTimeAsWorkDays / 5);
  let daysToAdd = turnaroundTimeAsWorkDays - 5 * weeksToAdd;
  let hoursToAdd =
    turnaroundTimeInHours - turnaroundTimeAsWorkDays * WORK_HOURS_PER_DAY;

  if (hoursToAdd + submittedHourOfDay >= WORK_END_HOUR) {
    daysToAdd++;
    hoursToAdd = hoursToAdd - WORK_HOURS_PER_DAY;
  }

  if (submittedDayOfWeek + daysToAdd > 5) {
    daysToAdd += 2;
  }

  const totalHoursToAdd = (weeksToAdd * 7 + daysToAdd) * 24 + hoursToAdd;
  const dueDate = new Date(
    submitDate.getTime() + totalHoursToAdd * 60 * 60 * 1000
  );
  const dueDateFormattedAsISO8601 = dueDate.toISOString();

  return dueDateFormattedAsISO8601;
}

export function validateInput(dateString: string, hours: number): void {
  if (!isISO8601(dateString)) {
    throw new Error("Invalid date format. Date must be in ISO8601 format");
  }

  if (hours <= 0) {
    throw new Error(
      "Invalid turnaround time. Turnaround time must be positive number"
    );
  }
}

function isISO8601(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[\+\-]\d{2}:\d{2})$/.test(
    dateString
  );
}
