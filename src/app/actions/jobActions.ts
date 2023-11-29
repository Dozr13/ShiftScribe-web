import { off, onValue, ref, remove, update } from "firebase/database";
import { pushData } from "../../lib/jobApi";
import { firebaseDatabase } from "../../services/firebase";
import { OrgJob } from "../../types/data";

export const fetchJobs = async (
  orgId: string,
  setJobs: (jobs: OrgJob[]) => void,
) => {
  const jobsRef = ref(firebaseDatabase, `orgs/${orgId}/jobs`);
  const unsubscribe = onValue(jobsRef, (snapshot) => {
    const jobsData = snapshot.val();
    const formattedJobs: OrgJob[] = jobsData
      ? Object.entries(jobsData).map(([firebaseId, jobData]) => ({
          ...(jobData as OrgJob),
          id: firebaseId,
        }))
      : [];
    setJobs(formattedJobs);
  });

  return () => off(jobsRef, "value", unsubscribe);
};

export const addJob = async (
  orgId: string,
  jobName: string,
  jobNumber: string,
  jobAddress: string,
): Promise<void> => {
  const newJob: Partial<OrgJob> = {
    jobName,
    jobNumber,
    jobAddress,
  };

  const jobPath = `orgs/${orgId}/jobs`;
  pushData(jobPath, newJob);
};

export const updateJob = async (
  orgId: string,
  jobId: string,
  payload: Partial<OrgJob>,
) => {
  const jobRef = ref(firebaseDatabase, `orgs/${orgId}/jobs/${jobId}`);
  await update(jobRef, payload);
};

export const deleteJob = async (orgId: string, jobId: string) => {
  const jobRef = ref(firebaseDatabase, `orgs/${orgId}/jobs/${jobId}`);
  await remove(jobRef);
};
