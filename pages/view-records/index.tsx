import { useEffect, useState } from 'react';

import { QueryConstraint, endAt, orderByKey } from 'firebase/database';

import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { PermissionLevel, StringUtils, TimeParser } from '../../lib';
import { TimeRecords, UserData } from '../../types/data';
import Colors from '../../utils/constants/colors.constants';

export const ViewRecordsPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirebase();

  const [csv, setCsv] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (...query: QueryConstraint[]) => {
    setLoading(true);
    const res = await db.query(`orgs/${auth.orgId}/timeRecords`, ...query);
    setLoading(false);

    if (!res.exists()) {
      // Toast.show({
      //   type: 'info',
      //   text1: 'No records match this request.',
      // });

      return;
    }

    return res.toJSON() as TimeRecords;
  };

  const purgeOldRecords = async (timeInWeeks = 2) => {
    const weekMs = 6.048e8 * timeInWeeks;
    const threshold = Date.now() - weekMs;

    console.log(threshold.toString());

    const json = await fetchData(orderByKey(), endAt(threshold.toString()));

    console.log(json);

    const toDelete = new Array<number>();

    if (json) {
      setLoading(true);

      for (const key in json) {
        const numeric = Number(key);

        if (!isNaN(numeric)) {
          if (numeric < threshold) {
            toDelete.push(numeric);
          }
        }
      }
      const obj: Record<string, null> = {};

      for (const val of toDelete) {
        obj[val.toString()] = null;
      }

      if (obj) await db.update(`orgs/${auth.orgId}/timeRecords`, obj);

      setLoading(false);
    }
  };

  console.log(auth.orgId);
  console.log(auth.user);

  const GenerateCSV = async () => {
    if (!auth.orgId || !auth.user) return;
    console.log('clicked');

    const json = await fetchData();
    if (!json) return;

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
    ];

    let resCSV = `${headers.join(',')}\n`;

    for (const item in json) {
      const obj = json[item];
      if (!obj.events) continue; // no bueno

      const userData = await db.read(`/users/${obj.submitter}`);
      const userInfo = userData.toJSON() as UserData;

      const end = Number(item);
      const { origin, timeWorked, breakTime, job } =
        TimeParser.parseCurrentRecord(obj.events);
      const timestamp = new Date(origin);
      const outTimestamp = new Date(end);
      const localeWorkTime = StringUtils.timestampHM(timeWorked);
      const localeBreakTime = StringUtils.timestampHM(breakTime);
      const localeTotalTime = StringUtils.timestampHM(timeWorked + breakTime);

      resCSV += `${userInfo.displayName},${
        userInfo.email
      },${job},${timestamp.toLocaleDateString()},${timestamp.toLocaleTimeString()},${outTimestamp.toLocaleTimeString()},${localeWorkTime},${localeBreakTime},${localeTotalTime}`;

      resCSV += '\n';
    }

    setCsv(resCSV);
  };

  useEffect(() => {
    if (auth.user) {
      if (auth.permissionLevel < PermissionLevel.MANAGER) {
        router.back();
      }
    }
  }, [auth.permissionLevel, auth.user, router]);

  // if (loading) return <Spinner />;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
      }}
    >
      <div
        style={{ fontSize: 32, fontFamily: 'monospace', color: Colors.White }}
      >
        ADMIN PANEL v0
      </div>

      <div
        style={{ fontSize: 15, fontFamily: 'monospace', color: Colors.White }}
      >
        {`ORG ID: ${auth.orgId?.toUpperCase()}`}
      </div>

      {csv ? (
        <>
          <a
            style={{ backgroundColor: Colors.White, padding: 10 }}
            href={'data:text/csv;charset=utf-8,' + encodeURI(csv)}
            onClick={() => {
              setCsv(undefined);
            }}
          >
            <div>DOWNLOAD</div>
          </a>
        </>
      ) : (
        <>
          <button
            style={{ marginTop: 10, padding: 10, backgroundColor: 'yellow' }}
            onClick={GenerateCSV}
          >
            Generate CSV of ALL work Records
          </button>
          <button
            style={{ marginTop: 25, padding: 10, backgroundColor: 'red' }}
            onClick={() => purgeOldRecords(2)}
          >
            Purge records older than 2 weeks
          </button>
        </>
      )}
    </div>
  );
};

export default ViewRecordsPage;
