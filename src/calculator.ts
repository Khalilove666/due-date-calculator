const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;
const WORK_HOURS_PER_DAY = WORK_END_HOUR - WORK_START_HOUR;
const SUNDAY = 0;
const SATURDAY = 6;
const NUM_OF_BUSINESS_DAYS = 5;
const NUM_OF_NON_BUSINESS_DAYS = 2;

/**
 * Calculates the due date based on a submission time and turnaround time in hours.
 *
 * @param submitDateAsISO8601 - ISO8601-formatted UTC date string
 * @param turnaroundTimeInHours - Time required to complete the task, in work hours
 * @returns Due date as an ISO8601 string
 * @throws Will throw an error if the date is invalid, not in working hours, or if the turnaround time is not positive
 */
export function calculateDueDate(
  submitDateAsISO8601: string,
  turnaroundTimeInHours: number
): string {
  validateTurnaroundTime(turnaroundTimeInHours);
  validateSubmitDate(submitDateAsISO8601);
  const submitDate = new Date(submitDateAsISO8601);
  const submittedDayOfWeek = submitDate.getUTCDay();
  const submittedHourOfDay = submitDate.getUTCHours();
  const turnaroundTimeAsWorkDays = Math.floor(
    turnaroundTimeInHours / WORK_HOURS_PER_DAY
  );
  const numOfWeeksToAdd = Math.floor(
    turnaroundTimeAsWorkDays / NUM_OF_BUSINESS_DAYS
  );
  let numOfDaysToAdd =
    turnaroundTimeAsWorkDays - numOfWeeksToAdd * NUM_OF_BUSINESS_DAYS;
  let numOfHoursToAdd = turnaroundTimeInHours % WORK_HOURS_PER_DAY;

  if (submittedHourOfDay + numOfHoursToAdd >= WORK_END_HOUR) {
    numOfDaysToAdd++;
    numOfHoursToAdd = numOfHoursToAdd - WORK_HOURS_PER_DAY;
  }

  if (submittedDayOfWeek + numOfDaysToAdd > NUM_OF_BUSINESS_DAYS) {
    numOfDaysToAdd += NUM_OF_NON_BUSINESS_DAYS;
  }

  const totalMillisecondsToAdd = convertToMilliseconds(
    numOfWeeksToAdd,
    numOfDaysToAdd,
    numOfHoursToAdd
  );

  const dueDateInMilliseconds = submitDate.getTime() + totalMillisecondsToAdd;
  const dueDate = new Date(dueDateInMilliseconds);
  const dueDateFormattedAsISO8601 = dueDate.toISOString();

  return dueDateFormattedAsISO8601;
}

export function validateSubmitDate(submitDateAsISO8601: string): void {
  if (!isISO8601(submitDateAsISO8601))
    throw new Error("Invalid date format. Date must be in ISO8601 format.");

  const submitDate = new Date(submitDateAsISO8601);
  const submittedDayOfWeek = submitDate.getUTCDay();
  const submittedHourOfDay = submitDate.getUTCHours();
  if (
    submittedDayOfWeek === SUNDAY ||
    submittedDayOfWeek === SATURDAY ||
    submittedHourOfDay < WORK_START_HOUR ||
    submittedHourOfDay >= WORK_END_HOUR
  )
    throw new Error("Invalid submit date/time.");
}

export function validateTurnaroundTime(hours: number): void {
  if (hours <= 0)
    throw new Error(
      "Invalid turnaround time. Turnaround time must be positive number."
    );
}

export function isISO8601(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[\+\-]\d{2}:\d{2})$/.test(
    dateString
  );
}

export function convertToMilliseconds(
  numOfWeeks: number,
  numOfDays: number,
  numOfHours: number
): number {
  return ((numOfWeeks * 7 + numOfDays) * 24 + numOfHours) * 60 * 60 * 1000;
}
