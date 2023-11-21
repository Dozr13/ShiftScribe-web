import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
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
import { useEffect, useRef, useState } from "react";
import { JobsGridRowData, OrgJob } from "../../types/data";

interface JobGridProps {
  jobs: OrgJob[];
  // paginationPageSize: number;
  setSelectedJob: (job: OrgJob | undefined) => void;
}

const JobGrid: React.FC<JobGridProps> = ({ jobs, setSelectedJob }) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  // const pageSizes = [5, 10, 20, 50, 100];

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

  const onRowSelected = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      const selectedId = event.data.id;
      const fullJob = jobs.find((job) => job.id === selectedId);

      if (fullJob) {
        setSelectedJob(fullJob);
      } else {
        console.error("Selected job not found");
      }
    } else {
      setSelectedJob(undefined);
    }
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = parseInt(event.target.value as string, 10);

    if (!isNaN(newSize)) {
      setPaginationPageSize(newSize);
      if (gridApi) {
        gridApi.paginationSetPageSize(newSize);
      }
    }
  };

  return (
    <Box className="ag-theme-alpine" sx={{ width: "50vw", height: "100%" }}>
      <AgGridReact
        rowSelection="single"
        onRowSelected={onRowSelected}
        onGridReady={onGridReady}
        getRowStyle={getRowStyle}
        rowData={rowData}
        columnDefs={columnDefs}
        ref={gridRef}
        animateRows={true}
        pagination={true}
        paginationPageSize={paginationPageSize}
        enableRangeSelection={true}
      />
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id="pagination-page-size-label">Page Size</InputLabel>
          <Select
            labelId="pagination-page-size-label"
            id="pagination-page-size-select"
            value={paginationPageSize}
            label="Page Size"
            onChange={handlePageSizeChange}
          >
            {[5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default JobGrid;
