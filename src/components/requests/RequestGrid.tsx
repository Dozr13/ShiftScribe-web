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
import stringUtils from "../../../lib/StringUtils";
import { OrgRequests, RequestsGridRowData } from "../../types/data";

interface RequestGridProps {
  requests: OrgRequests[];
  setSelectedRequest: (request: OrgRequests | undefined) => void;
}

const RequestGrid: React.FC<RequestGridProps> = ({
  requests,
  setSelectedRequest,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [paginationPageSize, setPaginationPageSize] = useState(10);

  useEffect(() => {
    const handleResize = () => gridApi?.sizeColumnsToFit();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const formatRequestForDisplay = (
    request: OrgRequests,
  ): RequestsGridRowData => {
    let inRequestTimestamp: number | null = null;
    let outRequestTimestamp: number | null = null;
    let jobSet = new Set<string>();

    if (request.events) {
      Object.entries(request.events).forEach(([timestamp, event]) => {
        if (event.type === "clockin" && !inRequestTimestamp) {
          inRequestTimestamp = parseInt(timestamp);
        }
        if (event.type === "clockout" && !outRequestTimestamp) {
          outRequestTimestamp = parseInt(timestamp);
        }
        if (event.job) {
          jobSet.add(event.job);
        }
      });
    }
    const formattedJobs =
      jobSet.size > 0 ? Array.from(jobSet).join(", ") : "No Jobs";
    const totalTime =
      inRequestTimestamp && outRequestTimestamp
        ? stringUtils.timestampHM(outRequestTimestamp - inRequestTimestamp)
        : "N/A";

    const dateRequest = stringUtils.convertTimestampToDateString(request.id);
    const inRequest = inRequestTimestamp
      ? stringUtils.timestampToHHMM(inRequestTimestamp)
      : "N/A";
    const outRequest = outRequestTimestamp
      ? stringUtils.timestampToHHMM(outRequestTimestamp)
      : "N/A";

    return {
      id: request.id,
      submitter: request.submitterName!,
      dateRequest: dateRequest,
      inRequest: inRequest,
      outRequest: outRequest,
      jobs: formattedJobs,
      totalTimeRequested: totalTime,
    };
  };

  const rowData = requests.map((request) => formatRequestForDisplay(request));

  const columnDefs: ColDef[] = [
    {
      headerName: "Submitter",
      field: "submitter",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Date",
      field: "dateRequest",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Time In",
      field: "inRequest",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Time Out",
      field: "outRequest",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Jobs",
      field: "jobs",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Total Time",
      field: "totalTimeRequested",
      sortable: true,
      filter: true,
      resizable: true,
    },
  ];

  const onRowSelected = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      const selectedId = event.data.id;
      const fullRequest = requests.find((req) => req.id === selectedId);

      if (fullRequest) {
        setSelectedRequest(fullRequest);
      } else {
        console.error("Selected job not found");
      }
    } else {
      setSelectedRequest(undefined);
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
    <Box className="ag-theme-alpine" sx={{ width: "70vw", height: "100%" }}>
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

export default RequestGrid;
