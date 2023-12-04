import { ColDef } from "ag-grid-community";
import { JobsGridRowData, OrgJob } from "../../../types/data";
import GenericGrid from "./GenericGrid";

interface JobGridProps {
  jobs: OrgJob[];
  setSelectedJob: (job: OrgJob | undefined) => void;
}

const JobGrid: React.FC<JobGridProps> = ({ jobs, setSelectedJob }) => {
  const idField: keyof JobsGridRowData = "id";

  const rowData: JobsGridRowData[] = jobs!.map((job) => ({
    id: job.id,
    jobName: job.jobName,
    jobNumber: job.jobNumber,
    jobAddress: job.jobAddress,
  }));

  const columnDefs: ColDef[] = [
    {
      headerName: "Job Name",
      field: "jobName",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Job Number",
      field: "jobNumber",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Address",
      field: "jobAddress",
      sortable: true,
      filter: true,
      resizable: true,
    },
  ];

  const handleRowSelected = (job: OrgJob) => {
    setSelectedJob(job);
  };

  return (
    <GenericGrid<OrgJob>
      rowData={rowData}
      columnDefs={columnDefs}
      onRowSelected={handleRowSelected}
      idField={idField}
      allowMultipleSelection={true}
    />
  );
};

export default JobGrid;
