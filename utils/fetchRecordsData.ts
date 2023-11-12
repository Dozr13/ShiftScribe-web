import { QueryConstraint, endAt, orderByKey, startAt } from "firebase/database";
import { TimeRecords } from "../types/data";

// Define an interface for the parameters
interface FetchDataParams {
  db: any; // Replace with the actual type of your Firebase database instance
  orgId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  formatAndSetDates: (
    date: Date | undefined,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ) => string | null;
  getLastSundayTwoWeeksPrior: () => Date;
  queryConstraints: QueryConstraint[];
}

const fetchRecordsData = async ({
  db,
  orgId,
  startDate,
  endDate,
  formatAndSetDates,
  getLastSundayTwoWeeksPrior,
}: FetchDataParams): Promise<TimeRecords | null> => {
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

    const targetQuery = queryConstraints.length > 1 ? queryConstraints : [];
    const res = await db.query(`orgs/${orgId}/timeRecords`, ...targetQuery);

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

export default fetchRecordsData;
