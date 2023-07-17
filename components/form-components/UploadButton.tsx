// import React from 'react';

// interface ButtonProps {
//   message: string;
//   onClick: (event: React.FormEvent<HTMLFormElement>) => void;
//   width?: string;
// }

// const UploadButton = ({ message, onClick, width }: ButtonProps) => {
//   return (
//     <div className='flex justify-center pt-8'>
//       <form onSubmit={onClick}>
//         <button
//           type='submit'
//           className={`h-fit text-center w-80 mx-auto py-3 px-4 mt-3 bg-blue-900 border-2 rounded-md hover:shadow-lg hover:bg-blue-800 text-lg transition`}
//           style={{ width: width }}
//         >
//           <p className='capitalize text-white font-bold'>{message}</p>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadButton;
import React from 'react';

interface ButtonProps {
  form: string;
  message: string;
  type: 'submit';
  onSubmit?: React.MouseEventHandler<HTMLButtonElement>;
  width?: string;
}

const UploadButton = ({
  form,
  message,
  type,
  onSubmit,
  width,
}: ButtonProps) => {
  return (
    <div className='flex justify-center pt-8'>
      <button
        form={form}
        type={type}
        onClick={onSubmit}
        className={`h-fit text-center w-80 mx-auto py-3 px-4 mt-3 bg-blue-900 border-2 rounded-md hover:shadow-lg hover:bg-blue-800 text-lg transition`}
        style={{ width: width }}
      >
        <p className='capitalize text-white font-bold'>{message}</p>
      </button>
    </div>
  );
};

export default UploadButton;
