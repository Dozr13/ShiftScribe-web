import React, { useRef } from 'react';

interface ImageUploadInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
}

const ImageUploadInput = ({ onChange, width }: ImageUploadInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className='flex justify-center pt-8'>
      <button
        className={`h-fit text-center w-80 mx-auto py-3 px-4 mt-3 bg-blue-900 border-2 rounded-md hover:shadow-lg hover:bg-blue-800 text-lg transition`}
        style={{ width: width }}
        onClick={handleClick}
      >
        <input
          type='file'
          ref={inputRef}
          onChange={onChange}
          style={{ display: 'none' }}
        />
        <p className='capitalize text-white font-bold'>Select File</p>
      </button>
    </div>
  );
};

export default ImageUploadInput;
