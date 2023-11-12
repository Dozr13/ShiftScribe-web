import { faCalendar, faClose } from "@fortawesome/free-solid-svg-icons";
import { Box, Button, Typography } from "@mui/material";
import { QueryConstraint, endAt, orderByKey, startAt } from "firebase/database";
import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import toast from "react-hot-toast";
import StyledIconButton from "../../components/buttons/StyledIconButton";
import ProtectedRoute from "../../components/protected-route";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/FirebaseContext";
import { StringUtils } from "../../lib";
import timeParser from "../../lib/TimeParser";
import { TimeRecords, UserData } from "../../types/data";
import LoadingScreen from "../loading";

type UserDataTotals = {
  id: string;
  employeeName: string;
  employeeEmail: string;
  totalWorkTime: string;
  totalBreakTime: string;
  totalPaidTime: string;
  totalCallIns: number;
};

export const ViewRecordsPage = () => {
  const auth = useAuth();
  const db = useFirebase();

  const [csv, setCsv] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCSV, setLoadingCSV] = useState<boolean>(false);

  const [dateState, setDateState] = useState<
    Array<{
      startDate: Date | undefined;
      endDate: Date | undefined;
      key: string;
    }>
  >([
    {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  ]);

  const { startDate, endDate } = dateState[0];

  const [showDateRange, setShowDateRange] = useState(false);

  const formatAndSetDates = (
    date: Date | undefined,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ) => {
    if (!date) return null;

    date.setHours(hours, minutes, seconds, milliseconds);

    return StringUtils.formatDateForFirebase(date);
  };

  const getLastSundayTwoWeeksPrior = (): Date => {
    const today = new Date();
    const day = today.getDay();
    const lastSunday = new Date(today);

    lastSunday.setDate(today.getDate() - day - 14);
    lastSunday.setHours(0, 0, 0, 0);

    return lastSunday;
  };

  const fetchData = async (
    ...query: QueryConstraint[]
  ): Promise<TimeRecords | null> => {
    setLoading(true);

    let res: any;

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

      // console.log(
      //   'Formatted Start Date:',
      //   StringUtils.convertTimestampToDateString(formattedStartDate ?? ''),
      // );
      // console.log(
      //   'Formatted End Date:',
      //   StringUtils.convertTimestampToDateString(formattedEndDate ?? ''),
      // );

      const queryConstraints: QueryConstraint[] = [orderByKey()];

      if (formattedStartDate)
        queryConstraints.push(startAt(formattedStartDate));
      if (formattedEndDate) queryConstraints.push(endAt(formattedEndDate));

      const targetQuery =
        queryConstraints.length > 1 ? queryConstraints : query;

      res = await db.query(`orgs/${auth.orgId}/timeRecords`, ...targetQuery);

      // console.log('DB Query Result exists:', res?.exists());
      // console.log('DB Query Result key:', res?.key);
      // console.log('DB Query Result value:', res?.val());

      if (!res?.exists()) {
        toast.error("No records match this request.");
        return null;
      }

      return res.toJSON() as TimeRecords;
    } catch (error: unknown) {
      toast.error("An error occurred while fetching data.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate === undefined) {
      const lastSundayTwoWeeksPrior = getLastSundayTwoWeeksPrior();
      setDateState((prevState) => [
        { ...prevState[0], startDate: lastSundayTwoWeeksPrior },
      ]);
    }
    if (endDate === undefined) {
      const today = new Date();
      setDateState((prevState) => [{ ...prevState[0], endDate: today }]);
    }
  }, [startDate, endDate, setDateState]);

  const [isButtonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(!(startDate && endDate));
  }, [startDate, endDate]);

  const purgeOldRecords = async (
    startDate: Date | undefined,
    endDate: Date | null,
  ) => {
    if (!startDate || !endDate) {
      toast.error("Both start date and end date are required.");
      return;
    }

    const formattedStartDate = formatAndSetDates(startDate, 0, 0, 0, 0);
    const formattedEndDate = formatAndSetDates(endDate, 23, 59, 59, 999);

    const queryConstraints: QueryConstraint[] = [orderByKey()];

    if (formattedStartDate) queryConstraints.push(startAt(formattedStartDate));
    if (formattedEndDate) queryConstraints.push(endAt(formattedEndDate));

    const data = await fetchData(...queryConstraints);

    const toDelete = new Array<number>();

    if (data) {
      setLoading(true);

      for (const key in data) {
        const numeric = Number(key);

        if (!isNaN(numeric)) {
          if (
            numeric >= Number(formattedStartDate) &&
            numeric <= Number(formattedEndDate)
          ) {
            toDelete.push(numeric);
          }
        }
      }

      const record: Record<string, null> = {};

      for (const val of toDelete) {
        record[val.toString()] = null;
      }

      if (Object.keys(record).length > 0) {
        await db.update(`orgs/${auth.orgId}/timeRecords`, record);
      }

      setLoading(false);
    }
  };

  const generateCSV = async () => {
    if (!auth.orgId || !auth.user) return;

    setLoadingCSV(true);

    const data = await fetchData();
    if (!data) {
      setLoadingCSV(false);
      return;
    }

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
      db.read(`/users/${employeeId}`),
    );
    const allUsersResults = await Promise.all(allUsersPromises);
    const allUsers: Record<string, UserData> = {};
    allUsersResults.forEach((userData, index) => {
      const currentEmployeeId = uniqueEmployees[index] as string;
      allUsers[currentEmployeeId] = userData.toJSON() as UserData;
    });

    const startHumanReadable = startDate
      ? StringUtils.getHumanReadableDate(startDate)
      : "N/A";
    const endHumanReadable = endDate
      ? StringUtils.getHumanReadableDate(endDate)
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

        // console.log('key', key);
        // console.log('data', data);
        // console.log('record', record);

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

        const { timeWorked, job, calledIn, meta } =
          timeParser.parseCurrentRecord(record.events);

        // console.log('ORIGIN', origin);

        const dateWorked = StringUtils.convertTimestampToDateString(key);
        const timestamp = new Date(Number(origin));
        // console.log('timestamp', timestamp);
        const outTimestamp = new Date(Number(origin) + Number(timeWorked));
        const daysWorkTime = StringUtils.timestampHM(timeWorked);
        const daysBreakTime = StringUtils.timestampHM(breakTime);
        const paidTime = Math.max(timeWorked - breakTime, 0);
        const daysPaidTime = StringUtils.timestampHM(paidTime);
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
          userSummary.totalWorkTime = StringUtils.addTimeValues(
            userSummary.totalWorkTime,
            daysWorkTime,
          );
          userSummary.totalBreakTime = StringUtils.addTimeValues(
            userSummary.totalBreakTime,
            daysBreakTime,
          );
          userSummary.totalPaidTime = StringUtils.addTimeValues(
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
        const totalWorkTimeMs = StringUtils.timestampToMilliseconds(
          userSummary.totalWorkTime,
        );
        const breakTimeMs = StringUtils.timestampToMilliseconds(
          userSummary.totalBreakTime,
        );

        const regularTimeMsCap = 40 * 60 * 60 * 1000;

        const paidTimeMs = Math.max(totalWorkTimeMs - breakTimeMs, 0);

        const regularTimeMs = Math.min(paidTimeMs, regularTimeMsCap);
        const totalRegularTime = StringUtils.timestampHM(regularTimeMs);

        const overtimeMs = Math.max(paidTimeMs - regularTimeMs, 0);
        const totalOvertime = StringUtils.timestampHM(overtimeMs);

        const totalPaidTime = StringUtils.timestampHM(paidTimeMs);

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
    setCsv(resCSV);
    setLoadingCSV(false);
  };

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;

    setDateState([{ startDate, endDate, key: "selection" }]);
  };

  const handleShowDateRange = () => {
    setShowDateRange((prevShow) => !prevShow);
  };

  return (
    <ProtectedRoute>
      {loading && <LoadingScreen />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 5,
          m: 2,
          width: 384,
          border: 2,
          borderColor: theme.BORDER_COLOR,
          bgcolor: theme.HEADER_BACKGROUND_COLOR,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: theme.TEXT_COLOR,
            fontFamily: "monospace",
            mb: 2,
          }}
        >
          ADMIN PANEL v1.0
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: theme.TEXT_COLOR,
            fontFamily: "monospace",
            mb: 2,
          }}
        >
          {`ORG ID: ${auth.orgId?.toUpperCase()}`}
        </Typography>

        {csv ? (
          <Button
            component="a"
            href={`data:text/csv;charset=utf-8,${encodeURI(csv)}`}
            download={`Employees-Hours-${StringUtils.getHumanReadableDate(
              dateState[0].startDate ?? new Date(),
            )}-${StringUtils.getHumanReadableDate(
              dateState[0].endDate ?? new Date(),
            )}.csv`}
            onClick={() => setCsv(undefined)}
            variant="contained"
            sx={{
              mt: 4,
              bgcolor: theme.BUTTON_COLOR_PRIMARY,
              "&:hover": {
                bgcolor: theme.BUTTON_PRIMARY_HOVER_COLOR,
              },
            }}
          >
            Click to Download CSV
          </Button>
        ) : (
          <>
            {showDateRange && (
              <Box
                className={`date-picker-wrapper ${
                  showDateRange ? "slide-in-fade-in" : "slide-out-fade-out"
                }`}
              >
                <DateRange
                  editableDateInputs={true}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  ranges={dateState}
                />
              </Box>
            )}

            <Button
              variant="contained"
              onClick={async () => {
                await toast.promise(
                  generateCSV(),
                  {
                    loading: "Generating CSV...",

                    success: "CSV generated successfully!",
                    error: "Error generating CSV.",
                  },
                  {
                    duration: 3000,
                  },
                );
              }}
              disabled={loadingCSV}
            >
              Generate CSV of ALL work Records
            </Button>
            <Button
              variant="contained"
              onClick={() => purgeOldRecords(startDate, endDate || new Date())}
              disabled={loadingCSV}
              sx={{
                mt: 3,
                bgcolor: "error.main",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
            >
              Purge records older than 2 weeks
            </Button>
            <Box mt={3}>
              <StyledIconButton
                onClick={handleShowDateRange}
                label={
                  showDateRange ? " Close Date Range" : " Toggle Date Range "
                }
                icon={!showDateRange ? faCalendar : faClose}
                color={"primary"}
              />
            </Box>
          </>
        )}
      </Box>
    </ProtectedRoute>
  );
};

export default ViewRecordsPage;
