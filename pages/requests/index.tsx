import { useRouter } from 'next/router';
import { useState } from 'react';
import Checkbox from '../../components/checkbox/Checkbox';
import SubmitButton from '../../components/form-components/SubmitButton';
import { DASHBOARD } from '../../utils/constants/routes.constants';

const requests = [
  {
    id: 1,
    employeeName: 'Juan',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 2,
    employeeName: 'Ceasar',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 3,
    employeeName: 'Alfred',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 4,
    employeeName: 'Bobby',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 5,
    employeeName: 'Lou',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 6,
    employeeName: 'Pan',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 7,
    employeeName: 'Bobby',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 8,
    employeeName: 'Lou',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 10,
    employeeName: 'Pan',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 11,
    employeeName: 'Bobby',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 8,
    employeeName: 'Lou',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
  {
    id: 12,
    employeeName: 'Pan',
    dateRequest: new Date(),
    inRequest: '5am',
    outRequest: '6pm',
  },
];

const ViewRequestsPage = () => {
  const router = useRouter();

  const [isChecked, setIsChecked] = useState<boolean[]>(
    Array(requests.length).fill(false),
  );
  const [selectedItemsData, setSelectedItemsData] = useState<any[]>([]);

  const handleCheckboxChange = () => {
    const newSelectedItemsData = requests.filter((_, i) => isChecked[i]);
    setSelectedItemsData(newSelectedItemsData);
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
