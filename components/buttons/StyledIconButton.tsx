import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StyledIconButtonProps {
  onClick: () => void;
  icon: IconProp;
  label: string;
  color: string;
}

const StyledIconButton = ({
  onClick,
  label,
  icon,
  color,
}: StyledIconButtonProps) => {
  // const buttonClassName = `bg-${color}-500 hover:bg-${color}-700 text-white font-bold py-2 px-4 rounded flex flex-col items-center`;

  const iconButtonClassName = `${color}`;

  return (
    <div
      className='py-3 px-3 rounded flex flex-col items-center'
      onClick={onClick}
      role='button'
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className={iconButtonClassName}
          size='lg'
        />
      )}
      <span className={iconButtonClassName}>{label}</span>
    </div>
  );
};

export default StyledIconButton;
