import { useEffect, useState } from 'react';
import SubmitButton from '../../components/form-components/SubmitButton';
import StyledInput from '../../components/inputs/StyledInput';
import JobListItem, { Job } from '../../components/job-list';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { OrgJobs } from '../../types/data';
import { SPACE_REPLACE_REGEX } from '../../utils/constants/regex.constants';
import { showToast } from '../../utils/toast';

const JobInformationPage = () => {
  const auth = useAuth();
  const db = useFirebase();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobNameValue, setJobNameValue] = useState('');
  const [jobNumberValue, setJobNumberValue] = useState('');
  const [jobAddressValue, setJobAddressValue] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      if (!auth.orgId) return;

      setLoading(true);

      const snapshot = await db.read(`orgs/${auth.orgId}/jobs`);
      if (snapshot.exists()) {
        const jobsData = snapshot.val() as OrgJobs;
        const jobsArray = Object.keys(jobsData).map((key) => ({
          id: key,
          ...jobsData[key],
        }));
        setJobs(jobsArray);
      }

      setLoading(false);
    };

    fetchJobs();
  }, [auth.orgId, db, jobs]);

  const handleSubmit = async () => {
    if (!auth.orgId) return;

    if (jobNameValue.trim() === '')
      return showToast('Job name must not be empty', false);
    if (jobNumberValue.trim() === '')
      return showToast('Job number must not be empty', false);

    const jobKey = jobNameValue.replace(SPACE_REPLACE_REGEX, '_').toLowerCase();

    const exists = await db.exists(`orgs/${auth.orgId}/jobs/${jobKey}`);
    if (exists) return showToast('Job already exists with this name.', false);

    setLoading(true);

    await db.update(`orgs/${auth.orgId}/jobs`, {
      [jobKey]: {
        jobName: jobNameValue,
        jobNumber: jobNumberValue,
        jobAddress: jobAddressValue,
      },
    } as OrgJobs);

    setJobNameValue('');
    setJobNumberValue('');
    setJobAddressValue('');

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await db.update(`orgs/${auth.orgId}/jobs`, {
      [id]: null,
    });
  };

  return (
    <ProtectedRoute>
      <div className='job-information'>
        <div className='flex flex-col items-center'>
          <div className='text-3xl text-gray-300 font-extrabold p-10'>
            Job Information
          </div>
          <div className='p-5 container border-2 bg-gray-400 border-gray-400 rounded-md overflow-y-scroll overflow-x-hidden h-[50vh] w-[70vw]'>
            <div className='flex justify-evenly mb-2'>
              <div className='w-[25%] text-gray-800 font-bold text-xl p-5'>
                Job Name
              </div>
              <div className='w-[25%] text-gray-800 font-bold text-xl p-5'>
                Job Number
              </div>
              <div className='w-[25%] text-gray-800 font-bold text-xl p-5'>
                Job Address
              </div>
              <div className='w-[25%]'></div>
            </div>
            {jobs.map((job) => (
              <JobListItem key={job.id} job={job} onDelete={handleDelete} />
            ))}
          </div>
          <div className='p-8 container border-2 bg-gray-400 border-gray-400 rounded-md mt-4'>
            <div className='flex justify-around items-start'>
              <StyledInput
                label='Job Name: '
                type='text'
                value={jobNameValue}
                onChange={setJobNameValue}
                flex
              />
              <StyledInput
                label='Job Number: '
                type='text'
                value={jobNumberValue}
                onChange={setJobNumberValue}
                flex
              />
              <StyledInput
                label='Job Address: '
                type='text'
                value={jobAddressValue}
                onChange={setJobAddressValue}
                flex
              />
            </div>
          </div>
          <SubmitButton message={'Add to List'} onClick={handleSubmit} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default JobInformationPage;
