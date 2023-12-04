export const formatAndSetDates = (
  date: Date | undefined,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
) => {
  if (!date) return null;
  date.setHours(hours, minutes, seconds, milliseconds);
  return date;
};

export const getLastSundayTwoWeeksPrior = (): Date => {
  const today = new Date();
  const day = today.getDay();
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - day - 14);
  lastSunday.setHours(0, 0, 0, 0);
  return lastSunday;
};
