import { QueryConstraint, equalTo, orderByKey } from 'firebase/database';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SubmitButton from '../../components/form-components/SubmitButton';
import ProtectedRoute from '../../components/protected-route';
import RequestListItem from '../../components/requests-list';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { PermissionLevel } from '../../lib';
import stringUtils from '../../lib/StringUtils';
import timeParser from '../../lib/TimeParser';
import {
  EventObject,
  RequestData,
  TimeRecords,
  UserData,
} from '../../types/data';
import { DASHBOARD } from '../../utils/constants/routes.constants';
import LoadingScreen from '../loading';

const ViewRequestsPage = () => {
  const auth = useAuth();
  const db = useFirebase();
  const router = useRouter();

  const [isChecked, setIsChecked] = useState<boolean[]>([]);
  const [selectedItemsData, setSelectedItemsData] = useState<TimeRecords[]>([]);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<Array<RequestData>>([]);

  const fetchData = useCallback(
    async (...query: QueryConstraint[]) => {
      setLoading(true);
      const res = await db.query(
        `orgs/${auth.orgId}/adjustmentRequests`,
        ...query,
      );
      setLoading(false);

      if (!res.exists()) {
        let errorMessage = 'No records match this request.';
        toast.error(errorMessage);
      }

      return res.toJSON() as TimeRecords;
    },
    [auth.orgId, db],
  );

  const displayRequests = useCallback(async (): Promise<RequestData[]> => {
    if (!auth.orgId || !auth.user) return [];

    setLoading(true);

    try {
      const data = await fetchData();

      if (!data) {
        setLoading(false);
        return [];
      }

      const requestsArray = [];

      for (const key in data) {
        const record = data[key];

        if (!record.events) continue;

        const userData = await db.read(`/users/${record.submitter}`);
        const userInfo = userData.toJSON() as UserData;

        const { origin, timeWorked } = timeParser.parseCurrentRecord(
          record.events,
        );

        const allJobs: EventObject[] = Object.values(record.events);

        const uniqueJobs = [...new Set(allJobs)];

        // if (uniqueJobs.length === 1) {
        //   console.log(`Job: ${uniqueJobs[0]}`);
        // } else if (uniqueJobs.length > 1) {
        //   console.log(`Jobs: ${uniqueJobs.join(', ')}`);
        // } else {
        //   console.log('No jobs found');
        // }

        const daysWorkTime = stringUtils.timestampHM(timeWorked);
        const request: RequestData = {
          id: Number(key),
          submitter: userInfo.displayName,
          dateRequest: origin,
          inRequest: origin,
          outRequest: origin + timeWorked,
          jobs: allJobs,
          totalTimeRequested: Number(daysWorkTime),
        };

        requestsArray.push(request);
      }

      setLoading(false);
      return requestsArray;
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Error fetching requests.');
      setLoading(false);
      return [];
    }
  }, [auth.orgId, auth.user, db, fetchData]);

  useEffect(() => {
    if (auth.permissionLevel >= PermissionLevel.MANAGER) {
      const getRequests = async () => {
        const requests = await displayRequests();
        if (Array.isArray(requests)) {
          setRequests(requests);
        }
      };

      getRequests();
    } else {
      router.back();
    }
  }, [auth.permissionLevel, router, displayRequests]);

  useEffect(() => {
    setIsChecked(Array(requests.length).fill(false));
  }, [requests]);

  const handleApprove = async () => {
    const allPromises = requests
      .filter((_, i) => isChecked[i])
      .map(async (request) => {
        const originalData = await fetchData(
          orderByKey(),
          equalTo(request.id.toString()),
        );

        if (!originalData) return;

        const { events, submitter } = Object.values(originalData)[0];

        try {
          const newKey = `${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;

          await db.update(`orgs/${auth.orgId}/timeRecords`, {
            [newKey]: {
              events,
              submitter,
            },
          });

          await db.delete(
            `orgs/${auth.orgId}/adjustmentRequests/${request.id}`,
          );

          const remainingRequests = requests.filter((_, i) => !isChecked[i]);
          setRequests(remainingRequests);
          setIsChecked(Array(remainingRequests.length).fill(false));
        } catch (error) {
          console.error('Error approving request:', error);
          toast.error('Error approving request.');
        }
      });

    await Promise.all(allPromises);
  };

  const handleDeny = async (id: number) => {
    await db.delete(`orgs/${auth.orgId}/adjustmentRequests/${id}`);
    const remainingRequests = requests.filter((request) => request.id !== id);
    setRequests(remainingRequests);

    setIsChecked(Array(remainingRequests.length).fill(false));
  };

  const onClickDashboard = () => {
    router.push(DASHBOARD);
  };

  return (
    <ProtectedRoute>
      {loading && <LoadingScreen />}
      <div className='admin-panel flex flex-col justify-center items-center'>
        <div className='text-3xl text-gray-300 font-extrabold p-10'>
          Time Adjustment Requests
        </div>
        {requests.length > 0 ? (
          <RequestListItem
            requests={requests}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        ) : (
          <div className='p-8 container items-center mx-auto border-2 bg-gray-400 border-gray-400 rounded-md h-fit w-[40vw]'>
            <p className='text-black text-3xl text-center'>
              No Requests at this time.
            </p>
            <SubmitButton
              message={'Back to Dashboard'}
              onClick={onClickDashboard}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ViewRequestsPage;
