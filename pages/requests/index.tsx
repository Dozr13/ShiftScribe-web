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

  const [isChecked, setIsChecked] = useState<boolean[]>([]);
  const [selectedItemsData, setSelectedItemsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    setLoading(true);

    try {
      const snapshot = await db.query(`orgs/${auth.orgId}/adjustmentRequests`);
      const data = snapshot.val();

      const requestArray = Object.entries(data).map(([id, request]) => {
        const { submitter, dateAdjustment, timeIn, timeOut } = (request as any)
          .events[Object.keys((request as any).events)[0]];

        return {
          id,
          employeeName: submitter,
          dateRequest: new Date(dateAdjustment),
          inRequest: new Date(timeIn).toLocaleTimeString(),
          outRequest: new Date(timeOut).toLocaleTimeString(),
        };
      });

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
  });

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
              onClick={handleCheckboxChange}
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
