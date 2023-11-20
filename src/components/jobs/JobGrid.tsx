import { Box } from "@mui/material";
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClassParams,
  RowSelectedEvent,
  RowStyle,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import { JobsGridRowData, OrgJob } from "../../types/data";

interface JobGridProps {
  jobs: OrgJob[];
  setSelectedJob: (job: OrgJob | undefined) => void;
}

const JobGrid: React.FC<JobGridProps> = ({ jobs, setSelectedJob }) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (gridApi) {
        gridApi.sizeColumnsToFit();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [gridApi]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const getRowStyle = (params: RowClassParams): RowStyle | undefined => {
    if (params.node.isSelected()) {
      return { background: "red" };
    }
    return undefined;
  };

  const rowData: JobsGridRowData[] = jobs!.map((job) => ({
    id: job.id,
    jobName: job.jobName,
    jobNumber: job.jobNumber,
    jobAddress: job.jobAddress,
  }));

  const columnDefs = [
    { headerName: "Job Name", field: "jobName", width: 100, flex: 1 },
    { headerName: "Job Number", field: "jobNumber", width: 100, flex: 1 },
    { headerName: "Address", field: "jobAddress", width: 100, flex: 1 },
  ] as ColDef[];

  const onRowSelected = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      const selectedId = event.data.id;

      console.log("Selected ID: ", selectedId);

      const fullJob = jobs.find((job) => job.id === selectedId);

      console.log("FULL JOB: ", fullJob);

      if (fullJob) {
        setSelectedJob(fullJob);
      } else {
        console.error("Selected job not found");
      }
    } else {
      setSelectedJob(undefined);
    }
  };

  return (
    <Box className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowSelection="single"
        onRowSelected={onRowSelected}
        onGridReady={onGridReady}
        getRowStyle={getRowStyle}
        rowData={rowData}
        columnDefs={columnDefs}
        animateRows={true}
      />
    </Box>
  );
};

export default JobGrid;
