import { QueryConstraint, endAt, orderByKey, startAt } from "firebase/database";
import { TimeRecords } from "../../types/data";
import stringUtils from "./StringUtils";

// Utility to format and set dates for Firebase
export const formatAndSetDates = (
  date: Date | undefined,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
): string | null => {
  if (!date) return null;
  date.setHours(hours, minutes, seconds, milliseconds);
  return stringUtils.formatDateForFirebase(date);
};

// Utility to get the last Sunday two weeks prior
export const getLastSundayTwoWeeksPrior = (): Date => {
  const today = new Date();
  const day = today.getDay();
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - day - 14);
  lastSunday.setHours(0, 0, 0, 0);
  return lastSunday;
};

// Function to fetch data
export const fetchData = async (
  db: any, // Replace with your database type
  orgId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<TimeRecords | null> => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const lastSundayTwoWeeksPrior = getLastSundayTwoWeeksPrior();

    const formattedEndDate = endDate
      ? formatAndSetDates(endDate, 23, 59, 59, 999)
      : formatAndSetDates(today, 23, 59, 59, 999);

    let formattedStartDate = formatAndSetDates(startDate, 0, 0, 0, 0);
    if (!formattedStartDate || formattedStartDate === formattedEndDate) {
      formattedStartDate = formatAndSetDates(
        lastSundayTwoWeeksPrior,
        0,
        0,
        0,
        0,
      );
    }

    const queryConstraints: QueryConstraint[] = [orderByKey()];
    if (formattedStartDate) queryConstraints.push(startAt(formattedStartDate));
    if (formattedEndDate) queryConstraints.push(endAt(formattedEndDate));

    const res = await db.query(
      `orgs/${orgId}/timeRecords`,
      ...queryConstraints,
    );
    if (!res?.exists()) {
      console.error("No records match this request.");
      return null;
    }

    return res.toJSON() as TimeRecords;
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return null;
  }
};
