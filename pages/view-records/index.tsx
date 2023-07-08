import { QueryConstraint, endAt, orderByKey } from 'firebase/database';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { PermissionLevel, StringUtils, TimeParser } from '../../lib';
import { TimeRecords, UserData } from '../../types/data';

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

    const headers = [
      'Employee',
      'E-Mail',
      'Job',
      'Date',
      'Clocked In',
      'Clocked Out',
      'Time Worked',
      'Time On Break',
      'Combined Time',
      'Called In',
      'Reason Missed',
    ];

    const summaryHeaders = [
      'Employee',
      'E-Mail',
      'Total Time Worked',
      'Total Time On Break',
      'Total Combined Time',
      'Total Call Ins',
    ];

    let resCSV = `${headers.join(',')}\n`;

    let summary: UserDataTotals[] = [];

    for (const key in data) {
      const record = data[key];
      if (!record.events) continue; // no bueno

      const userData = await db.read(`/users/${record.submitter}`);
      const userInfo = userData.toJSON() as UserData;

      const end = Number(key);
      const { origin, timeWorked, breakTime, job, calledIn, meta } =
        TimeParser.parseCurrentRecord(record.events);

      const timestamp = new Date(origin);
      const outTimestamp = new Date(end);
      const daysWorkTime = StringUtils.timestampHM(timeWorked);
      const daysBreakTime = StringUtils.timestampHM(breakTime);
      const paidTime = Math.max(timeWorked - breakTime, 0);
      const daysPaidTime = StringUtils.timestampHM(paidTime);

      resCSV += `${userInfo.displayName},${userInfo.email},${
        calledIn ? '' : job
      },${timestamp.toLocaleDateString()},${timestamp.toLocaleTimeString()},${outTimestamp.toLocaleTimeString()},${daysWorkTime},${daysBreakTime},${daysPaidTime},${
        calledIn ? 'Out Today' : ''
      },${calledIn ? meta : ''}`;

      resCSV += '\n';

      const userId = record.submitter as string;
      const userSummary = summary.find((item) => item.id === userId);

      if (userSummary) {
        userSummary.totalWorkTime = StringUtils.addTimeValues(
          userSummary.totalWorkTime,
          StringUtils.timestampHM(timeWorked),
        );
        userSummary.totalBreakTime = StringUtils.addTimeValues(
          userSummary.totalBreakTime,
          StringUtils.timestampHM(breakTime),
        );
        userSummary.totalPaidTime = StringUtils.addTimeValues(
          userSummary.totalPaidTime,
          StringUtils.timestampHM(paidTime),
        );
        userSummary.totalCallIns += calledIn ? 1 : 0;
      } else {
        summary.push({
          id: userId,
          employeeName: userInfo.displayName,
          employeeEmail: userInfo.email,
          totalWorkTime: StringUtils.timestampHM(timeWorked),
          totalBreakTime: StringUtils.timestampHM(breakTime),
          totalPaidTime: StringUtils.timestampHM(timeWorked - breakTime),
          totalCallIns: calledIn ? 1 : 0,
        });
      }
    }

    resCSV += `\nSummary,\n,${summaryHeaders.join(',')}\n`;

    for (const userSummary of summary) {
      resCSV += '\n';
      resCSV += `,${userSummary.employeeName},${userSummary.employeeEmail},${userSummary.totalWorkTime},${userSummary.totalBreakTime},${userSummary.totalPaidTime},${userSummary.totalCallIns},`;
    }

    setCsv(resCSV);

    setLoadingCSV(false);
  };

  useEffect(() => {
    if (auth.user && auth.permissionLevel < PermissionLevel.MANAGER) {
      router.back();
    }
  }, [auth.permissionLevel, auth.user, router]);

  return (
    <ProtectedRoute>
      <div className='admin-panel flex flex-col justify-center items-center'>
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
                href={'data:text/csv;charset=utf-8,' + encodeURI(csv)}
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
