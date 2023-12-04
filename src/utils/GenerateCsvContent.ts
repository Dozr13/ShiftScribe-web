import { DataSnapshot } from "firebase/database";
import { TimeRecord, UserData, UserDataTotals } from "../../types/data";
import stringUtils from "./StringUtils";
import timeParser from "./TimeParserUtils";

interface GenerateCSVContentParams {
  readUserFunction: (Path: string) => Promise<DataSnapshot>;
  orgId: string | null | undefined;
  data: Record<string, TimeRecord>;
  startDate?: Date;
  endDate?: Date;
}

const generateCSVContent = async ({
  readUserFunction,
  orgId,
  startDate,
  endDate,
  data,
}: GenerateCSVContentParams): Promise<string> => {
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

  const allUsersPromises = uniqueEmployees.map((employeeId) =>
    readUserFunction(`/users/${employeeId}`),
  );
  const allUsersResults = await Promise.all(allUsersPromises);
  const allUsers: Record<string, UserData> = {};
  allUsersResults.forEach((userData: DataSnapshot, index: number) => {
    const currentEmployeeId = uniqueEmployees[index] as string;
    allUsers[currentEmployeeId] = userData.toJSON() as UserData;
  });

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
  // setCsv(resCSV);
  // setLoadingCSV(false);
  return resCSV;
};

export default generateCSVContent;
