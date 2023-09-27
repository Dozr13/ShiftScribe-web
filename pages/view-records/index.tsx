import { QueryConstraint, endAt, orderByKey, startAt } from 'firebase/database';
import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { StringUtils, TimeParser } from '../../lib';
import { TimeRecords, UserData } from '../../types/data';
import LoadingScreen from '../loading';

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
    Array<{ startDate: Date; endDate: Date | undefined; key: string }>
  >([
    {
      startDate: new Date(),
      endDate: undefined,
      key: 'selection',
    },
  ]);

  const { startDate, endDate } = dateState[0];

  const [showDateRange, setShowDateRange] = useState(false);

  const formatAndSetDates = (
    date: Date | null,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ) => {
    if (!date) return null;

    date.setHours(hours, minutes, seconds, milliseconds);

    return StringUtils.formatDateForFirebase(date);
  };

  const fetchData = async (
    ...query: QueryConstraint[]
  ): Promise<TimeRecords | null> => {
    setLoading(true);
    try {
      const formattedStartDate = startDate
        ? formatAndSetDates(startDate, 0, 0, 0, 0)
        : null;
      const formattedEndDate = endDate
        ? formatAndSetDates(endDate, 23, 59, 59, 999)
        : null;
      const queryConstraints: QueryConstraint[] = [orderByKey()];

      if (formattedStartDate)
        queryConstraints.push(startAt(formattedStartDate));
      if (formattedEndDate) queryConstraints.push(endAt(formattedEndDate));

      const res = await db.query(
        `orgs/${auth.orgId}/timeRecords`,
        ...queryConstraints,
      );

      if (!res.exists()) {
        toast.error('No records match this request.');
        return null;
      }
      return res.toJSON() as TimeRecords;
    } catch (error: unknown) {
    } finally {
      setLoading(false);
    }
    return null;
  };

  const purgeOldRecords = async (timeInWeeks = 2) => {
    const weekMs = 6.048e8 * timeInWeeks;
    const threshold = Date.now() - weekMs;

    const data = await fetchData(orderByKey(), endAt(threshold.toString()));

    const toDelete = new Array<number>();

    if (data) {
      setLoading(true);

      for (const key in data) {
        const numeric = Number(key);

        if (!isNaN(numeric)) {
          if (numeric < threshold) {
            toDelete.push(numeric);
          }
        }
      }
      const record: Record<string, null> = {};

      for (const val of toDelete) {
        record[val.toString()] = null;
      }

      if (record) await db.update(`orgs/${auth.orgId}/timeRecords`, record);

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

    let resCSV = '';

    const uniqueEmployees = Array.from(
      new Set(Object.values(data).map((record) => record.submitter)),
    ).filter(Boolean);

    const employeeHeaders = [
      'Date',
      'Time IN',
      'Time OUT',
      'Hours',
      'Lunch/ Break',
      'Job Number',
      'Total',
    ];

    const footerValues = [
      'Total Regular Time',
      'Total Overtime',
      'Total Time On Break',
      'Total Call Ins',
      '',
      'Total Hours',
    ];

    const jobIndex = employeeHeaders.indexOf('Job Number');

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
      : 'N/A';
    const endHumanReadable = endDate
      ? StringUtils.getHumanReadableDate(endDate)
      : 'N/A';

    for (const employeeId of uniqueEmployees as string[]) {
      const headers = [
        `Name: ${allUsers[employeeId].displayName}`,
        '',
        '',
        '',
        `Week Start At: ${startHumanReadable}`,
        `Week Ending: ${endHumanReadable}`,
      ];
      resCSV += `${headers.join(',')}\n${employeeHeaders.join(',')}\n`;

      let summary: UserDataTotals[] = [];

      for (const key in data) {
        const record = data[key];
        if (!record.events || record.submitter !== employeeId) continue;

        const userInfo = allUsers[record.submitter];
        const { origin, timeWorked, breakTime, job, calledIn, meta } =
          TimeParser.parseCurrentRecord(record.events);

        const timestamp = new Date(origin);
        const outTimestamp = new Date(origin + timeWorked);
        const daysWorkTime = StringUtils.timestampHM(timeWorked);
        const daysBreakTime = StringUtils.timestampHM(breakTime);
        const paidTime = Math.max(timeWorked - breakTime, 0);
        const daysPaidTime = StringUtils.timestampHM(paidTime);
        const inTime = timestamp.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        const outTime = outTimestamp.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        // CSV Record
        resCSV += `${timestamp.toLocaleDateString()},${inTime},${outTime},${daysWorkTime},${daysBreakTime},${job},${daysPaidTime}\n`;

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
        const regularTimeMs = 40 * 60 * 60 * 1000;
        const paidTimeMs = Math.max(totalWorkTimeMs - breakTimeMs, 0);
        const totalRegularTime = StringUtils.timestampHM(
          Math.min(totalWorkTimeMs, regularTimeMs),
        );
        const overtimeMs = Math.max(totalWorkTimeMs - regularTimeMs, 0);
        const totalOvertime = StringUtils.timestampHM(overtimeMs);
        const totalPaidTime = StringUtils.timestampHM(paidTimeMs);
        // let totalCombinedTime = StringUtils.addTimeValues(
        //   totalRegularTime,
        //   totalOvertime,
        // );
        // totalCombinedTime = StringUtils.subtractTimeValues(
        //   totalCombinedTime,
        //   userSummary.totalBreakTime,
        // );

        const footerData = [
          totalRegularTime,
          totalOvertime,
          userSummary.totalBreakTime,
          userSummary.totalCallIns,
          '',
          totalPaidTime,
        ];

        for (let i = 0; i < footerValues.length; i++) {
          if (footerValues[i] === '') {
            resCSV += '\n';
          } else {
            resCSV += `\n${Array(jobIndex).fill('').join(',')},${
              footerValues[i]
            },${footerData[i]}`;
          }
        }
      }

      const dividerWidth = 10;
      const dividerRow = '='.repeat(dividerWidth);

      resCSV += `\n\n\n${dividerRow}`;
      resCSV += `\n--- ${allUsers[employeeId].displayName} Data Ends Here ---\n`;
      resCSV += `${dividerRow}\n\n\n`;
    }

    setCsv(resCSV);
    setLoadingCSV(false);
  };

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;

    setDateState([{ startDate, endDate, key: 'selection' }]);
  };

  return (
    <ProtectedRoute>
      {loading && <LoadingScreen />}
      <div className='flex flex-col justify-center items-center'>
        <div className='p-10 container flex flex-col justify-center items-center mx-auto w-96 border-2 bg-gray-400 border-gray-400 rounded-md'>
          <div className='flex py-2 container mx-auto'></div>

          <div
            className='text-3xl text-white'
            style={{ fontFamily: 'monospace' }}
          >
            ADMIN PANEL v1.0
          </div>

          <div
            className='text-xl text-white'
            style={{ fontFamily: 'monospace' }}
          >
            {`ORG ID: ${auth.orgId?.toUpperCase()}`}
          </div>

          {csv ? (
            <>
              <a
                href={`data:text/csv;charset=utf-8,${encodeURI(csv)}`}
                download={`Employees-Hours-${StringUtils.getHumanReadableDate(
                  new Date(),
                )}.csv`}
                onClick={() => {
                  setCsv(undefined);
                }}
              >
                <button className='w-full mt-10 p-4 bg-blue-500 rounded-md'>
                  <p className='text-md font-semibold'>Click to Download CSV</p>
                </button>
              </a>
            </>
          ) : (
            <>
              {showDateRange && (
                <DateRange
                  editableDateInputs={true}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  ranges={dateState}
                />
              )}

              {!showDateRange && (
                <button
                  className='w-full mt-8 p-4 bg-blue-600 rounded-md'
                  onClick={() => setShowDateRange(!showDateRange)}
                >
                  <p className='text-md font-semibold'>Select Dates</p>
                </button>
              )}
              {showDateRange && (
                <button
                  className='w-full mt-8 p-4 bg-blue-600 rounded-md'
                  onClick={() => setShowDateRange(!showDateRange)}
                >
                  <p className='text-md font-semibold'>Close Range Picker</p>
                </button>
              )}
              <button
                className='w-full mt-10 p-4 bg-green-500 rounded-md'
                onClick={async () => {
                  await toast.promise(
                    generateCSV(),
                    {
                      loading: 'Generating CSV...',

                      success: 'CSV generated successfully!',
                      error: 'Error generating CSV.',
                    },
                    {
                      duration: 3000,
                    },
                  );
                }}
                disabled={loadingCSV}
              >
                <p className='text-md font-semibold'>
                  Generate CSV of ALL work Records
                </p>
              </button>
              <button
                className='w-full mt-8 p-4 bg-red-600 rounded-md'
                onClick={() => purgeOldRecords(2)}
                disabled={loadingCSV}
              >
                <p className='text-md font-semibold'>
                  Purge records older than 2 weeks
                </p>
              </button>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ViewRecordsPage;
