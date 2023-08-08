import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';

import {
  faCancel,
  faEdit,
  faSave,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { EMAIL_REGEX } from '../../utils/constants/regex.constants';
import { showToast } from '../../utils/toast';
import StyledIconButton from '../buttons/StyledIconButton';
import StyledInput from '../inputs/StyledInput';

export interface Employee {
  id: string;
  accessLevel: number;
  userData: {
    displayName: string;
    email: string;
    organization: string;
  };
}

interface EmployeeListItemProps {
  employee: Employee;
  onDelete: (employeeId: string) => void;
}

const EmployeeListItem: React.FC<EmployeeListItemProps> = ({
  employee,
  onDelete,
}) => {
  const auth = useAuth();
  const db = useFirebase();

  const { id, accessLevel, userData } = employee;
  const { displayName, email, organization } = userData;
  const isCurrentUser = !!auth.user && auth.user.uid === id;

  const [editing, setEditing] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [employeeName, setEmployeeName] = useState(displayName || '');
  const [employeeEmail, setEmployeeEmail] = useState(email);
  const [employeeOrg, setEmployeeOrg] = useState(organization);
  const [employeeAccessLevel, setEmployeeAccessLevel] =
    useState<number>(accessLevel);

  useEffect(() => {
    setIsValidEmail(
      employeeEmail.trim() === ''
        ? true
        : employeeEmail.match(EMAIL_REGEX) !== null,
    );
  }, [employeeEmail]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (employeeName.trim() === '')
      return showToast('Employee Name cannot be empty', false);
    if (employeeEmail.trim() === '')
      return showToast('Employee Email cannot be empty', false);
    if (!isValidEmail) return showToast('Please enter a valid email', false);

    const accessLevelNumber = employeeAccessLevel;

    if (
      isNaN(accessLevelNumber) ||
      accessLevelNumber < 1 ||
      accessLevelNumber > 4
    ) {
      return showToast('Access level must be a number between 1 and 4', false);
    }

    await db.update(`orgs/${auth.orgId}/members/${employee.id}`, {
      accessLevel: accessLevelNumber,
    });

    await db.update(`users/${employee.id}`, {
      displayName: employeeName,
      email: employeeEmail,
      organization: employeeOrg,
    });

    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(employee.id);
  };

  function handleCancel(): void {
    setEditing(false);
  }

  const handleEmployeeAccessLevelChange = (value: string) => {
    if (value === '') {
      setEmployeeAccessLevel(0);
      return;
    }

    const parsedValue = parseInt(value, 10);

    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 4) {
      setEmployeeAccessLevel(parsedValue);
    } else {
      showToast('Access level must be a number between 1 and 4', false);
    }
  };

  return (
    <div className='employee-list-item border-t-2'>
      <div className='flex items-center justify-evenly flex-wrap'>
        {editing ? (
          <>
            <StyledInput
              type='text'
              value={employeeName}
              onChange={setEmployeeName}
              className='text-gray-800 w-[20%]'
            />
            <StyledInput
              type='text'
              value={employeeEmail}
              onChange={setEmployeeEmail}
              className={`text-gray-800 w-[20%]`}
              emailInputClassName={
                !isValidEmail || employeeEmail.trim() === ''
                  ? 'border-4 border-red-400'
                  : 'border-4 border-transparent'
              }
            />
            <StyledInput
              type='text'
              value={employeeOrg}
              onChange={setEmployeeOrg}
              className='text-gray-800 w-[20%]'
              disabled
            />
            <StyledInput
              type='text'
              value={employeeAccessLevel}
              onChange={handleEmployeeAccessLevelChange}
              className='text-gray-800 w-[20%]'
              disabled={isCurrentUser}
            />
          </>
        ) : (
          <>
            <span
              className='text-gray-800 w-[20%] p-5'
              style={{ wordWrap: 'break-word' }}
            >
              {employeeName}
            </span>
            <span
              className='text-gray-800 w-[20%] p-5'
              style={{ wordWrap: 'break-word' }}
            >
              {employeeEmail}
            </span>
            <span
              className='text-gray-800 w-[20%] p-5'
              style={{ wordWrap: 'break-word' }}
            >
              {employeeOrg}
            </span>
            <span
              className='text-gray-800 w-[20%] p-5'
              style={{ wordWrap: 'break-word' }}
            >
              {employeeAccessLevel}
            </span>
          </>
        )}
        <div className='flex justify-around text-gray-800 w-[20%] p-5'>
          <StyledIconButton
            onClick={!editing ? handleEdit : handleSave}
            label={!editing ? 'Edit' : 'Save'}
            icon={!editing ? faEdit : faSave}
            color={!editing ? 'text-blue-700' : 'text-green-700'}
          />
          <StyledIconButton
            onClick={!editing ? handleDelete : handleCancel}
            label={!editing ? 'Delete' : 'Cancel'}
            icon={!editing ? faTrashAlt : faCancel}
            color={!editing ? 'text-red-700' : 'text-yellow-300'}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeListItem;
