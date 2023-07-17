import { QueryConstraint, equalTo, orderByKey } from 'firebase/database';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Checkbox from '../../components/checkbox/Checkbox';
import SubmitButton from '../../components/form-components/SubmitButton';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { PermissionLevel } from '../../lib';
import stringUtils from '../../lib/StringUtils';
import timeParser from '../../lib/TimeParser';
import { TimeRecords, UserData } from '../../types/data';
import { DASHBOARD } from '../../utils/constants/routes.constants';

const ViewRequestsPage = () => {
  const auth = useAuth();
  const db = useFirebase();
  const router = useRouter();

  const [isChecked, setIsChecked] = useState<boolean[]>([]);
  const [selectedItemsData, setSelectedItemsData] = useState<TimeRecords[]>([]);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<
    {
      id: string;
      submitter: string;
      dateRequest: string;
      inRequest: string;
      outRequest: string;
      totalTimeRequested: string;
    }[]
  >([]);

  const fetchData = async (...query: QueryConstraint[]) => {
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
  };

  useEffect(() => {
    if (auth.user && auth.permissionLevel < PermissionLevel.MANAGER) {
      router.back();
    }
  }, [auth.permissionLevel, auth.user, router]);

  const displayRequests = async () => {
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

        const daysWorkTime = stringUtils.timestampHM(timeWorked);

        const request = {
          id: key,
          submitter: userInfo.displayName,
          dateRequest: timestamp.toLocaleDateString(),
          inRequest: inRequestTime,
          outRequest: outRequestTime,
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
  };

  const handleApprove = async () => {
    const newSelectedItemsData = requests.filter((_, i) => isChecked[i]);

    for (const item of newSelectedItemsData) {
      const index = requests.findIndex((request) => request.id === item.id);
      const isCheckedItem = isChecked[index];

      const originalData = await fetchData(orderByKey(), equalTo(item.id));

      if (isCheckedItem) {
        try {
          const { events, submitter } = Object.values(originalData)[0];

          await db.update(`orgs/${auth.orgId}/timeRecords`, {
            [Date.now()]: {
              events,
              submitter,
            },
          });

          await db.delete(`orgs/${auth.orgId}/adjustmentRequests/${item.id}`);
        } catch (error) {
          console.error('Error approving request:', error);
          toast.error('Error approving request.');
        }
      } else {
        try {
          await db.delete(`orgs/${auth.orgId}/adjustmentRequests/${item.id}`);
        } catch (error) {
          console.error('Error denying request:', error);
          toast.error('Error denying request.');
        }
      }
    }

    const updatedRequests = requests.filter((_, i) => !isChecked[i]);
    setRequests(updatedRequests);
  };

  const handleCheckboxChange = async () => {
    const newSelectedItemsData = requests.filter((_, i) => isChecked[i]);
    setSelectedItemsData(newSelectedItemsData);

    const updatedRequests = requests.filter((_, i) => !isChecked[i]);
    setRequests(updatedRequests);

    for (const item of newSelectedItemsData) {
      const { id } = item;

      try {
        await db.exists(`orgs/${auth.orgId}/adjustmentRequests/${id}`);
      } catch (error) {
        console.error('Error removing request:', error);
        toast.error('Error removing request.');
      }
    }
  };

  const onClickDashboard = () => {
    router.push(DASHBOARD);
  };

  useEffect(() => {
    if (auth.permissionLevel >= PermissionLevel.MANAGER) {
      const getRequests = async () => {
        const requests = await displayRequests();
        if (requests) {
          setRequests(requests);
          setIsChecked(Array(requests.length).fill(false));
        }
      };

      getRequests();
    } else {
      router.back();
    }
  }, [auth.permissionLevel, router]);

  return (
    <div className='admin-panel flex flex-col justify-center items-center'>
      <div className='text-3xl text-gray-300 font-extrabold p-10'>
        Time Adjustment Requests
      </div>
      {requests.length > 0 ? (
        <>
          <div className='p-8 container items-center mx-auto border-2 bg-gray-400 border-gray-400 rounded-md overflow-y-scroll overflow-x-hidden h-[50vh] w-[40vw]'>
            <div className='border-t-2'></div>
            {requests.map((request, index) => (
              <Checkbox
                key={request.id}
                label={request.submitter}
                checked={isChecked[index]}
                dateRequest={request.dateRequest}
                inRequest={request.inRequest}
                outRequest={request.outRequest}
                onChange={(checked) => {
                  const newCheckedItems = [...isChecked];
                  newCheckedItems[index] = checked;
                  setIsChecked(newCheckedItems);
                }}
              />
            ))}
          </div>
          <div className='flex flex-row w-full justify-around'>
            <SubmitButton
              message={'Approve'}
              onClick={handleApprove}
              width='100%'
            />
            <SubmitButton
              message={'Deny'}
              onClick={handleCheckboxChange}
              width='100%'
            />
          </div>
        </>
      ) : (
        <>
          <div className='p-8 container items-center mx-auto border-2 bg-gray-400 border-gray-400 rounded-md h-fit w-[40vw]'>
            <p className='text-black text-3xl text-center'>
              No Requests at this time.
            </p>
          </div>
          <SubmitButton
            message={'Back to Dashboard'}
            onClick={onClickDashboard}
          />
        </>
      )}
    </div>
  );
};

export default ViewRequestsPage;
