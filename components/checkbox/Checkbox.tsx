import { ChangeEvent } from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  dateRequest: Date;
  inRequest: string;
  outRequest: string;
  onChange: (checked: boolean) => void;
}

const Checkbox = ({
  label,
  checked,
  dateRequest,
  inRequest,
  outRequest,
  onChange,
}: CheckboxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onChange(event.target.checked);
  };

  return (
    <div className='border-b-4'>
      <div className='grid grid-cols-4 my-4'>
        <div className='flex items-center'>
          <input
            type='checkbox'
            checked={checked}
            onChange={handleChange}
            className='form-checkbox h-6 w-6 text-red-600 rounded-full focus:ring-0 focus:outline-none mx-auto my-auto'
          />
        </div>
        <div className='col-span-1 flex flex-col justify-center'>
          <span className='m-2 text-gray-800'>{label}</span>
        </div>
        <div className='col-span-1 flex flex-col justify-center'>
          <div className='text-gray-600'>
            Date: {dateRequest.toLocaleDateString()}
          </div>
        </div>
        <div className='col-span-1 flex flex-col w-40'>
          <div className='text-gray-600'>In: {inRequest}</div>
          <div className='text-gray-600'>Out: {outRequest}</div>
        </div>
      </div>
    </div>
  );
};

export default Checkbox;
