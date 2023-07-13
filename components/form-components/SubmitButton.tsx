interface ButtonProps {
  message: string;
  onClick?: () => void;
  onSubmit?: (index: number, checked: boolean) => Promise<void>;
  disabled?: boolean;
  width?: string;
}

const SubmitButton = ({ disabled, message, onClick, width }: ButtonProps) => {
  return (
    <div className='flex justify-center pt-8'>
      <button
        type='submit'
        onClick={onClick}
        disabled={disabled}
        className={`h-fit text-center w-80 mx-auto py-3 px-4 mt-3 bg-blue-900 border-2 rounded-md hover:shadow-lg hover:bg-blue-800 text-lg transition`}
        style={{ width: width }}
      >
        <p className='capitalize text-white font-bold'>{message}</p>
      </button>
    </div>
  );
};

export default SubmitButton;
