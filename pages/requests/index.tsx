// pages/view-requests.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';
import Checkbox from '../../components/checkbox/Checkbox';
import SubmitButton from '../../components/form-components/SubmitButton';

const ViewRequestsPage = () => {
  const router = useRouter();

  const requests = [
    { id: 1, employeeName: 'Juan', inRequest: '5am', outRequest: '6pm' },
    { id: 2, employeeName: 'Ceasar', inRequest: '5am', outRequest: '6pm' },
    { id: 3, employeeName: 'Alfred', inRequest: '5am', outRequest: '6pm' },
    { id: 4, employeeName: 'Bobby', inRequest: '5am', outRequest: '6pm' },
    { id: 5, employeeName: 'Lou', inRequest: '5am', outRequest: '6pm' },
    { id: 6, employeeName: 'Pan', inRequest: '5am', outRequest: '6pm' },
  ];

  const [isChecked, setIsChecked] = useState<boolean[]>(
    Array(requests.length).fill(false),
  );
  const [selectedItemsData, setSelectedItemsData] = useState<any[]>([]);

  const handleToggle = (employeeName: string) => {
    const index = requests.findIndex(
      (request) => request.employeeName === employeeName,
    );
    if (index !== -1) {
      const newCheckedItems = [...isChecked];
      newCheckedItems[index] = !newCheckedItems[index];
      setIsChecked(newCheckedItems);
    }
  };

  const handleContainerClick = (index: number) => {
    const employeeName = requests[index].employeeName;
    handleToggle(employeeName);
  };

  const handleCheckboxChange = () => {
    const newSelectedItemsData = requests.filter((_, i) => isChecked[i]);
    setSelectedItemsData(newSelectedItemsData);
  };

  return (
    <div className='admin-panel flex flex-col justify-center items-center'>
      <div className='p-10 container flex flex-col justify-center items-center mx-auto w-96 border-2 bg-gray-400 border-gray-400 rounded-md'>
        <div className='flex flex-col items-start justify-around py-2 container mx-auto'>
          {requests.map((request, index) => (
            <Checkbox
              key={request.id}
              label={request.employeeName}
              checked={isChecked[index]}
              inRequest={request.inRequest}
              outRequest={request.outRequest}
              onChange={() => handleToggle(request.employeeName)}
              handleContainerClick={() => handleContainerClick(index)}
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
      </div>
    </div>
  );
};

export default ViewRequestsPage;
