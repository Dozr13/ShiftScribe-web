import {
  QueryConstraint,
  get,
  getDatabase,
  query,
  ref,
  update,
} from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";
import { TimeRecord, UserData, UserDataTotals } from "../../types/data";
import stringUtils from "../../utils/StringUtils";
import timeParser from "../../utils/TimeParserUtils";

const readUserData = async (userId: string): Promise<UserData> => {
  const snapshot = await get(ref(getDatabase(), `/users/${userId}`));
  return snapshot.val();
};

export const fetchFromDatabase = async (
  path: string,
  ...constraints: QueryConstraint[]
) => {
  const dbQuery = query(ref(firebaseDatabase, path), ...constraints);
  try {
    const snapshot = await get(dbQuery);

    return snapshot.val();
  } catch (error) {
    console.error("Error fetching data:", error);
    // TODO: Create an errorHandler function to use throughout
  }
};

export const generateCSVContent = async (
  orgId: string,
  data: Record<string, TimeRecord>,
  startDate?: Date,
  endDate?: Date,
): Promise<string> => {
  if (!orgId || !data) return "";

  let resCSV = "";

  const uniqueEmployees = Array.from(
    new Set(Object.values(data).map((record) => record.submitter)),
  ).filter(Boolean);

  const employeeHeaders = [
    "Date",
    "Time IN",
    "Time OUT",
    "Hours",
    "Lunch/ Break",
    "Job Number",
    "Total",
  ];

  const footerValues = [
    "Total Regular Time",
    "Total Overtime",
    "Total Time On Break",
    "Total Call Ins",
    "",
    "Total Hours",
  ];

  const jobIndex = employeeHeaders.indexOf("Job Number");

  const allUsers: Record<string, UserData> = {};
  for (const employeeId of uniqueEmployees) {
    const userData = await readUserData(employeeId!);
    allUsers[employeeId!] = userData;
  }

  const startHumanReadable = startDate
    ? stringUtils.getHumanReadableDate(startDate)
    : "N/A";
  const endHumanReadable = endDate
    ? stringUtils.getHumanReadableDate(endDate)
    : "N/A";

  for (const employeeId of uniqueEmployees as string[]) {
    const headers = [
      `Name: ${allUsers[employeeId].displayName}`,
      "",
      "",
      "",
      `Week Start At: ${startHumanReadable}`,
      `Week Ending: ${endHumanReadable}`,
    ];
    resCSV += `${headers.join(",")}\n${employeeHeaders.join(",")}\n`;

    let summary: UserDataTotals[] = [];

    for (const key in data) {
      const record = data[key];
      if (!record.events || record.submitter !== employeeId) continue;

      const userInfo = allUsers[record.submitter];

      let origin = 0;
      let time = 0;
      let breakTime = 0;

      const eventKeys = Object.keys(record.events);
      if (eventKeys.length === 0) continue;

      origin = Number(eventKeys[0]);

      for (const eventKey in record.events) {
        const event = record.events[eventKey];

        switch (event.type) {
          case "clockin":
            break;
          case "clockout":
            time += Number(eventKey) - origin;
            break;
        }
      }

      const { timeWorked, job, calledIn, meta } = timeParser.parseCurrentRecord(
        record.events,
      );

      const dateWorked = stringUtils.convertTimestampToDateString(key);
      const timestamp = new Date(Number(origin));
      const outTimestamp = new Date(Number(origin) + Number(timeWorked));
      const daysWorkTime = stringUtils.timestampHM(timeWorked);
      const daysBreakTime = stringUtils.timestampHM(breakTime);
      const paidTime = Math.max(timeWorked - breakTime, 0);
      const daysPaidTime = stringUtils.timestampHM(paidTime);
      const inTime = timestamp.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const outTime = outTimestamp.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      resCSV += `${dateWorked},${inTime},${outTime},${daysWorkTime},${daysBreakTime},${job},${daysPaidTime}\n`;

      const userId = record.submitter as string;
      const userSummary = summary.find((item) => item.id === userId);
      if (userSummary) {
        userSummary.totalWorkTime = stringUtils.addTimeValues(
          userSummary.totalWorkTime,
          daysWorkTime,
        );
        userSummary.totalBreakTime = stringUtils.addTimeValues(
          userSummary.totalBreakTime,
          daysBreakTime,
        );
        userSummary.totalPaidTime = stringUtils.addTimeValues(
          userSummary.totalPaidTime,
          daysPaidTime,
        );
        userSummary.totalCallIns += calledIn ? 1 : 0;
      } else {
        summary.push({
          id: userId,
          employeeName: userInfo.displayName,
          employeeEmail: userInfo.email,
          totalWorkTime: daysWorkTime,
          totalBreakTime: daysBreakTime,
          totalPaidTime: daysPaidTime,
          totalCallIns: calledIn ? 1 : 0,
        });
      }
    }

    for (const userSummary of summary) {
      const totalWorkTimeMs = stringUtils.timestampToMilliseconds(
        userSummary.totalWorkTime,
      );
      const breakTimeMs = stringUtils.timestampToMilliseconds(
        userSummary.totalBreakTime,
      );

      const regularTimeMsCap = 40 * 60 * 60 * 1000;

      const paidTimeMs = Math.max(totalWorkTimeMs - breakTimeMs, 0);

      const regularTimeMs = Math.min(paidTimeMs, regularTimeMsCap);
      const totalRegularTime = stringUtils.timestampHM(regularTimeMs);

      const overtimeMs = Math.max(paidTimeMs - regularTimeMs, 0);
      const totalOvertime = stringUtils.timestampHM(overtimeMs);

      const totalPaidTime = stringUtils.timestampHM(paidTimeMs);

      const footerData = [
        totalRegularTime,
        totalOvertime,
        userSummary.totalBreakTime,
        userSummary.totalCallIns,
        "",
        totalPaidTime,
      ];

      for (let i = 0; i < footerValues.length; i++) {
        if (footerValues[i] === "") {
          resCSV += "\n";
        } else {
          resCSV += `\n${Array(jobIndex).fill("").join(",")},${
            footerValues[i]
          },${footerData[i]}`;
        }
      }
    }

    const dividerWidth = 10;
    const dividerRow = "=".repeat(dividerWidth);
    resCSV += `\n\n\n${dividerRow}`;
    resCSV += `\n--- ${allUsers[employeeId].displayName}'s Data Ends Here ---\n`;
    resCSV += `${dividerRow}\n\n\n`;
  }

  return resCSV;
};

export const fetchAndGenerateCSV = async (
  orgId: string,
  startDate: Date,
  endDate: Date,
): Promise<{ success: boolean; csv?: string; message?: string }> => {
  try {
    const records = await fetchFromDatabase(`/orgs/${orgId}/timeRecords`);
    if (!records) {
      return {
        success: false,
        message: "No records found for the selected date range.",
      };
    }

    const filteredRecords: Record<string, TimeRecord> = Object.fromEntries(
      Object.entries(records).filter(([key]) => {
        const recordDate = new Date(parseInt(key));
        return recordDate >= startDate && recordDate <= endDate;
      }),
    ) as Record<string, TimeRecord>;

    const csvContent = await generateCSVContent(
      orgId,
      filteredRecords,
      startDate,
      endDate,
    );
    return { success: true, csv: csvContent };
  } catch (error) {
    console.error("Error in fetchAndGenerateCSV:", error);
    return { success: false, message: "Error generating CSV" };
  }
};

export const purgeOldRecords = async (
  orgId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<{ success: boolean; message: string }> => {
  try {
    const records = await fetchFromDatabase(`/orgs/${orgId}/timeRecords`);
    if (!records) {
      return { success: false, message: "No records found." };
    }

    const toDelete = Object.keys(records).filter((key) => {
      const recordDate = new Date(parseInt(key));
      const startOfDay = startDate
        ? new Date(startDate.setHours(0, 0, 0, 0))
        : null;
      const endOfDay = endDate
        ? new Date(endDate.setHours(23, 59, 59, 999))
        : null;

      return (
        (!startOfDay || recordDate >= startOfDay) &&
        (!endOfDay || recordDate <= endOfDay)
      );
    });

    const recordUpdates = toDelete.reduce<Record<string, any>>(
      (updates, key) => {
        updates[`/orgs/${orgId}/timeRecords/${key}`] = null;
        return updates;
      },
      {},
    );

    if (Object.keys(recordUpdates).length > 0) {
      await update(ref(getDatabase()), recordUpdates);
      return { success: true, message: "Records purged successfully." };
    } else {
      return { success: false, message: "No records to purge." };
    }
  } catch (error) {
    console.error("Error purging records:", error);
    return {
      success: false,
      message: "Error occurred during purging records.",
    };
  }
};
