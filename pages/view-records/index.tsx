import { QueryConstraint, endAt, orderByKey } from 'firebase/database';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
  const router = useRouter();
  const auth = useAuth();
  const db = useFirebase();

  const [csv, setCsv] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCSV, setLoadingCSV] = useState<boolean>(false);

  const fetchData = async (...query: QueryConstraint[]) => {
    setLoading(true);
    const res = await db.query(`orgs/${auth.orgId}/timeRecords`, ...query);
    setLoading(false);
    if (!res.exists()) {
      let errorMessage = 'No records match this request.';
      toast.error(errorMessage);
    }

    return res.toJSON() as TimeRecords;
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
      'Total Combined Time',
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

    // Iterate through each unique employee
    for (const employeeId of uniqueEmployees as string[]) {
      const headers = [
        `Name: ${allUsers[employeeId].displayName}`,
        '',
        '',
        '',
        '',
        `Week Ending: 08/19/2020`,
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
        let totalCombinedTime = StringUtils.addTimeValues(
          totalRegularTime,
          totalOvertime,
        );
        totalCombinedTime = StringUtils.subtractTimeValues(
          totalCombinedTime,
          userSummary.totalBreakTime,
        );

        const footerData = [
          totalRegularTime,
          totalOvertime,
          userSummary.totalBreakTime,
          totalPaidTime,
          userSummary.totalCallIns,
          '',
          totalCombinedTime,
        ];

        // console.log('footerData: ', footerData);

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
            ADMIN PANEL v0
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
                download={`EmployeesHours-${StringUtils.getHumanReadableDate(
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
