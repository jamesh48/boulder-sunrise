import moment from 'moment-timezone';

export const getTodayWithTZ = (timezone: string | undefined) => {
  // Get current date/time in the specified timezone
  const now = moment().tz(timezone || 'America/Denver', false);

  // Calculate end of today in the specified timezone
  const endOfDay = now.clone().endOf('day');

  // Set time to 23:59:59.999 for end of today
  endOfDay.set({
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 999,
  });

  return {
    endDateRange: endOfDay.toISOString(),
  };
};
