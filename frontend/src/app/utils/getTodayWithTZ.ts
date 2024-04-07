export const getTodayWithTZ = (timeZone: string | undefined) => {
  if (!timeZone) {
    return {};
  }
  // Get the current date and time as the startDateRange
  const startDateRange = new Date().toLocaleString('en-US', {
    timeZone,
    dateStyle: 'full',
    timeStyle: 'long',
  });

  // Get the end of the current day (12 midnight) as the endDateRange
  const today = new Date();
  const endDateRange = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
    0,
    0,
    0
  ).toLocaleString('en-US', { timeZone, dateStyle: 'full', timeStyle: 'long' });

  // Convert the formatted strings to ZonedDateTime format
  const startDateRangeZoned = new Date(startDateRange).toISOString();
  const endDateRangeZoned = new Date(endDateRange).toISOString();

  return {
    startDateRange: startDateRangeZoned,
    endDateRange: endDateRangeZoned,
  };
};
