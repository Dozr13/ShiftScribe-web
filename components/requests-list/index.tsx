import { Dispatch, SetStateAction, useEffect } from 'react';
import Checkbox from '../../components/checkbox/Checkbox';
import { RequestData } from '../../types/data';
import SubmitButton from '../form-components/SubmitButton';

interface IRequestListItem {
  requests: RequestData[];
  isChecked: boolean[];
  setIsChecked: Dispatch<SetStateAction<boolean[]>>;
  onApprove: () => Promise<void>;
  onDeny: (id: number) => Promise<void>;
}

const RequestListItem = ({
  requests,
  isChecked,
  setIsChecked,
  onApprove,
  onDeny,
}: IRequestListItem) => {
  useEffect(() => {
    setIsChecked(Array(requests.length).fill(false));
  }, [requests, setIsChecked]);

  const handleApproveClick = () => {
    onApprove();
  };

  const handleDenyClick = () => {
    const idsToDeny = requests
      .filter((_, i) => isChecked[i])
      .map((request) => request.id);
    for (const id of idsToDeny) {
      onDeny(id);
    }
  };

  return (
    <>
      <div className='p-8 container items-center mx-auto border-2 bg-gray-400 border-gray-400 rounded-md overflow-y-scroll overflow-x-hidden h-[50vh] w-[40vw]'>
        <div className='border-t-2'></div>
        {requests.map((request, index) => (
          <Checkbox
            key={request.id}
            label={request.submitter ?? 'Err'}
            checked={isChecked[index]}
            jobs={request.jobs}
            dateRequest={request.id}
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
          onClick={handleApproveClick}
          width='100%'
        />
        <SubmitButton message={'Deny'} onClick={handleDenyClick} width='100%' />
      </div>
    </>
  );
};

export default RequestListItem;
