import {
  faCancel,
  faEdit,
  faSave,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { showToast } from '../../utils/toast';

import StyledIconButton from '../buttons/StyledIconButton';
import StyledInput from '../inputs/StyledInput';

export interface Job {
  id: string;
  jobName: string;
  jobNumber: string;
  jobAddress: string;
}

interface JobListItemProps {
  job: Job;
  onDelete: (jobId: string) => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ job, onDelete }) => {
  const auth = useAuth();
  const db = useFirebase();

  const [editing, setEditing] = useState(false);
  const [jobName, setJobName] = useState(job.jobName);
  const [jobNumber, setJobNumber] = useState(job.jobNumber);
  const [jobAddress, setJobAddress] = useState(job.jobAddress);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (jobName.trim() === '')
      return showToast('Job name cannot be empty', false);
    if (jobNumber.trim() === '')
      return showToast('Job number cannot be empty', false);
    if (jobAddress.trim() === '')
      return showToast('Job address cannot be empty', false);

    // const jobKey = jobName.replace(SPACE_REPLACE_REGEX, '_').toLowerCase();

    // const exists = await db.exists(`orgs/${auth.orgId}/jobs/${jobKey}`);
    // if (exists) return showToast('Job already exists with this name.', false);

    await db.update(`orgs/${auth.orgId}/jobs/${job.id}`, {
      jobName: jobName,
      jobNumber: jobNumber,
      jobAddress: jobAddress,
    });

    setEditing(false);
  };

  const handleDelete = () => {
    // Call the `onDelete` function passed from the parent component
    // to remove the job from the database
    onDelete(job.id);
  };

  function handleCancel(): void {
    setEditing(false);
  }

  return (
    <div className='job-list-item w-[100%] flex'>
      {editing ? (
        <div className='flex items-center justify-evenly flex-wrap'>
          <StyledInput
            label='Job Name: '
            type='text'
            value={jobName}
            onChange={setJobName}
            className='w-[18vw] text-gray-800'
          />
          <StyledInput
            label='Job Number: '
            type='text'
            value={jobNumber}
            onChange={setJobNumber}
            className='w-[18vw] text-gray-800'
          />
          <StyledInput
            label='Job Address: '
            type='text'
            value={jobAddress}
            onChange={setJobAddress}
            className='w-[18vw] text-gray-800'
          />
        </div>
      ) : (
        <div className='flex items-center justify-evenly flex-wrap'>
          <span
            className='w-[18vw] text-gray-800'
            style={{ wordWrap: 'break-word' }}
          >
            {jobName}
          </span>
          <span
            className='w-[18vw] text-gray-800'
            style={{ wordWrap: 'break-word' }}
          >
            {jobAddress}
          </span>
          <span
            className='w-[18vw] text-gray-800'
            style={{ wordWrap: 'break-word' }}
          >
            {jobNumber}
          </span>
        </div>
      )}
      <div className='w-[8vw] flex justify-between text-gray-800'>
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
  );
};

export default JobListItem;
