// components/server/JobData.server.js
"use client";
import { useEffect, useState } from "react";
import { fetchJobs } from "../../app/actions/job/fetchJobs";
import { OrgJob } from "../../types/data";

interface JobDataProps {
  orgId: string;
}

const JobData = ({ orgId }: JobDataProps) => {
  const [jobs, setJobs] = useState<OrgJob[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const jobsData = await fetchJobs(orgId);
      setJobs(jobsData);
    };

    fetchData();
  }, [orgId]);

  return jobs;
};

export default JobData;
