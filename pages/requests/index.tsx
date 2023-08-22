import { QueryConstraint, equalTo, orderByKey } from 'firebase/database';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SubmitButton from '../../components/form-components/SubmitButton';
import ProtectedRoute from '../../components/protected-route';
import RequestListItem, {
  UserProfileData,
} from '../../components/requests-list';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { PermissionLevel } from '../../lib';
import stringUtils from '../../lib/StringUtils';
import timeParser from '../../lib/TimeParser';
import { EventObject, TimeRecords, UserData } from '../../types/data';
import { DASHBOARD } from '../../utils/constants/routes.constants';
import LoadingScreen from '../loading';

const ViewRequestsPage = () => {
  const auth = useAuth();
  const db = useFirebase();
  const router = useRouter();

  const [isChecked, setIsChecked] = useState<boolean[]>([]);
  const [selectedItemsData, setSelectedItemsData] = useState<TimeRecords[]>([]);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<UserProfileData[]>([]);

  const fetchData = useCallback(
    async (...query: QueryConstraint[]) => {
      setLoading(true);
      const res = await db.query(
        `orgs/${auth.orgId}/adjustmentRequests`,
        ...query,
      );
      // console.log('res: ', res);
      setLoading(false);

      if (!res.exists()) {
        let errorMessage = 'No records match this request.';
        toast.error(errorMessage);
      }

      return res.toJSON() as TimeRecords;
    },
    [auth.orgId, db],
  );

  const displayRequests = useCallback(async () => {
    if (!auth.orgId || !auth.user) return;

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

        const timestamp = new Date(origin);
        const outTimestamp = new Date(origin + timeWorked);

        const inRequestTime = timestamp.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        });
        const outRequestTime = outTimestamp.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        });

        const allJobs: EventObject[] = Object.values(record.events);

        const uniqueJobs = [...new Set(allJobs)];

        if (uniqueJobs.length === 1) {
          console.log(`Job: ${uniqueJobs[0]}`);
        } else if (uniqueJobs.length > 1) {
          console.log(`Jobs: ${uniqueJobs.join(', ')}`);
        } else {
          console.log('No jobs found');
        }

        const daysWorkTime = stringUtils.timestampHM(timeWorked);
        console.log('recEVENTS', record.events);
        const request = {
          id: key,
          submitter: userInfo.displayName,
          dateRequest: timestamp.toLocaleDateString(),
          inRequest: inRequestTime,
          outRequest: outRequestTime,
          jobs: allJobs,
          totalTimeRequested: daysWorkTime,
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
        if (requests) {
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

  // const handleApprove = async () => {
  //   const newSelectedItemsData = requests.filter((_, i) => isChecked[i]);

  //   for (const item of newSelectedItemsData) {
  //     const index = requests.findIndex((request) => request.id === item.id);
  //     const isCheckedItem = isChecked[index];

  //     const originalData = await fetchData(orderByKey(), equalTo(item.id));

  //     console.log('isCheckedItem: ', isCheckedItem);

  //     if (isCheckedItem) {
  //       try {
  //         const { events, submitter } = Object.values(originalData)[0];

  //         await db.update(`orgs/${auth.orgId}/timeRecords`, {
  //           [Date.now()]: {
  //             events,
  //             submitter,
  //           },
  //         });

  //         await db.delete(`orgs/${auth.orgId}/adjustmentRequests/${item.id}`);
  //       } catch (error) {
  //         console.error('Error approving request:', error);
  //         toast.error('Error approving request.');
  //       }
  //     } else {
  //       try {
  //         await db.delete(`orgs/${auth.orgId}/adjustmentRequests/${item.id}`);
  //       } catch (error) {
  //         console.error('Error denying request:', error);
  //         toast.error('Error denying request.');
  //       }
  //     }
  //   }

  //   const updatedRequests = requests.filter((_, i) => !isChecked[i]);
  //   setRequests(updatedRequests);
  // };
  const handleApprove = async () => {
    const approvedRequests = requests.filter((_, i) => isChecked[i]);

    for (const request of approvedRequests) {
      const originalData = await fetchData(orderByKey(), equalTo(request.id));

      if (originalData) {
        try {
          const { events, submitter } = Object.values(originalData)[0];

          await db.update(`orgs/${auth.orgId}/timeRecords`, {
            [Date.now()]: {
              events,
              submitter,
            },
          });

          await db.delete(
            `orgs/${auth.orgId}/adjustmentRequests/${request.id}`,
          );
        } catch (error) {
          console.error('Error approving request:', error);
          toast.error('Error approving request.');
        }
      }
    }

    // Update the requests list
    const remainingRequests = requests.filter((_, i) => !isChecked[i]);
    setRequests(remainingRequests);
    setIsChecked(Array(remainingRequests.length).fill(false)); // Reset checkboxes
  };

  // const handleCheckboxChange = async () => {
  //   const newSelectedItemsData = requests.filter((_, i) => isChecked[i]);
  //   setSelectedItemsData(newSelectedItemsData);

  //   const updatedRequests = requests.filter((_, i) => !isChecked[i]);
  //   setRequests(updatedRequests);

  //   for (const item of newSelectedItemsData) {
  //     const { id } = item;

  //     try {
  //       await db.exists(`orgs/${auth.orgId}/adjustmentRequests/${id}`);
  //     } catch (error) {
  //       console.error('Error removing request:', error);
  //       toast.error('Error removing request.');
  //     }
  //   }
  // };

  const handleDeny = async (id: string) => {
    await db.delete(`orgs/${auth.orgId}/adjustmentRequests/${id}`);
  };

  const onClickDashboard = () => {
    router.push(DASHBOARD);
  };

  // console.log(requests);

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
