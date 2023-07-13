import { QueryConstraint } from 'firebase/database';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Checkbox from '../../components/checkbox/Checkbox';
import SubmitButton from '../../components/form-components/SubmitButton';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { DASHBOARD } from '../../utils/constants/routes.constants';

const ViewRequestsPage = () => {
  const auth = useAuth();
  const db = useFirebase();
  const router = useRouter();

  const [selectedItemsData, setSelectedItemsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [isChecked, setIsChecked] = useState<boolean[]>(
    Array(requests.length).fill(false),
  );

  const fetchRequests = async (...query: QueryConstraint[]) => {
    setLoading(true);

    try {
      const snapshot = await db.query(
        `orgs/${auth.orgId}/adjustmentRequests`,
        ...query,
      );
      if (!snapshot) {
        throw new Error('Snapshot is null or undefined');
      }

      const data = snapshot.val();
      if (!data) {
        throw new Error('Data is null or undefined');
      }

      const requestArray = Object.entries(data).flatMap(
        ([userId, userRequests]: [string, unknown]) => {
          return Object.entries(userRequests as Record<string, any>).map(
            ([eventId, event]: [string, any]) => {
              const eventKey = Object.keys(event.events)[0];
              const { submitter, dateAdjustment, timeIn, timeOut } =
                event.events[eventKey];

              return {
                id: eventId,
                employeeName: submitter,
                dateRequest: new Date(dateAdjustment),
                inRequest: new Date(timeIn).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                outRequest: new Date(timeOut).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              };
            },
          );
        },
      );

      setRequests(requestArray);
      setIsChecked(Array(requestArray.length).fill(false));
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Error fetching requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async () => {
    const newSelectedItemsData = requests.filter((_, i) => isChecked[i]);
    setSelectedItemsData(newSelectedItemsData);

    for (const item of newSelectedItemsData) {
      const { id, type } = item;

      if (type === 'adjustmentRequest') {
        // Handle adjustment request
        const adjustmentRequest = item;

        try {
          const newTimeRecordKey = Date.now().toString();

          const timeIn = new Date(adjustmentRequest.inRequest).getTime();
          const timeOut = new Date(adjustmentRequest.outRequest).getTime();

          // Update timeRecords with the approved adjustment request
          await db.update(
            `orgs/${auth.orgId}/timeRecords/${newTimeRecordKey}`,
            {
              events: {
                [timeIn]: {
                  job: 'time adjustment',
                  type: 'clockin',
                },
                [timeOut]: {
                  job: 'time adjustment',
                  type: 'clockout',
                },
              },
              submitter: adjustmentRequest.employeeName,
            },
          );

          await db.delete(
            `orgs/${auth.orgId}/adjustmentRequests/${auth.user.uid}/${id}`,
          );

          // Remove the approved request from the requests state
          setRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== id),
          );
        } catch (error) {
          console.error('Error updating time records:', error);
          toast.error('Error updating time records.');
        }
      }
    }

    setIsChecked(Array(requests.length).fill(false)); // Reset checkbox state
  };

  const handleDeny = async () => {
    const selectedItems = requests.filter((_, i) => isChecked[i]);

    for (const item of selectedItems) {
      const { id } = item;

      try {
        // Perform the deny action for each item
        await db.update(`orgs/${auth.orgId}/adjustmentRequests/${id}`, {
          status: 'denied', // You can add a status field to the request object to indicate denial
        });
      } catch (error) {
        console.error('Error denying request:', error);
        toast.error('Error denying request.');
      }
    }

    const updatedRequests = requests.filter((_, i) => !isChecked[i]);
    setRequests(updatedRequests);
    setIsChecked(Array(updatedRequests.length).fill(false));
  };

  const onClickDashboard = () => {
    router.push(DASHBOARD);
  };

  return (
    <div className='admin-panel flex flex-col justify-center items-center'>
      <div className='text-2xl text-gray-300 font-extrabold p-10'>
        Time Adjustment Requests
      </div>
      {requests.length > 0 ? (
        <>
          <div className='p-8 container items-center mx-auto border-2 bg-gray-400 border-gray-400 rounded-md overflow-y-scroll overflow-x-hidden h-[50vh] w-[40vw]'>
            <div className='border-t-2'></div>
            {requests.map((request, index) => (
              <Checkbox
                key={request.id}
                label={request.employeeName}
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
            <SubmitButton message={'Deny'} onClick={handleDeny} width='100%' />
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
