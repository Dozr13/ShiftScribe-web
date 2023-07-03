import { ChangeEvent } from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  inRequest: string;
  outRequest: string;
  onChange: (checked: boolean) => void;
  handleContainerClick: () => void;
}

const Checkbox = ({
  label,
  checked,
  inRequest,
  outRequest,
  onChange,
  handleContainerClick,
}: CheckboxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onChange(event.target.checked);
  };

  return (
    <div
      // className='min-w-full h-20 inline-flex items-stretch flex-col'
      className='grid grid-cols-1 divide-y my-5'
      onClick={handleContainerClick}
    >
      <label className='inline-flex items-center'>
        <input
          type='checkbox'
          checked={checked}
          onChange={handleChange}
          className='form-checkbox h-6 w-6 text-red-600 rounded-full focus:ring-0 focus:outline-none'
        />
        <span className='ml-2 text-gray-800'>{label}</span>
        <span className='text-gray-600 '>
          - In: {inRequest}, Out: {outRequest}
        </span>
      </label>
    </div>
  );
};

export default Checkbox;
