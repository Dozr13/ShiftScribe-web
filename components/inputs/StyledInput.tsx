import React, { ChangeEvent, useState } from 'react';

interface StyledInputProps {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  flex?: boolean;
  disabled?: boolean;
}

const StyledInput: React.FC<StyledInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className,
  flex = false,
  disabled,
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const containerClassName = `input-container ${focused ? 'focused' : ''} ${
    className || ''
  }   ${flex ? 'flex flex-col' : ''}`;
  const inputClassName = `input-field ${
    error ? 'error' : ''
  } mb-4 p-1 rounded-md`;

  return (
    <div className={containerClassName}>
      {label && <label className='input-label'>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={inputClassName}
        disabled={disabled}
      />
      {error && <div className='error-message'>{error}</div>}
    </div>
  );
};

export default StyledInput;
