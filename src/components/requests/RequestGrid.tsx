import { ColDef } from "ag-grid-community";
import { OrgRequest } from "../../../types/data";
import {
  calculateTotalTime,
  extractDate,
  extractJobs,
  extractTime,
} from "../../utils/eventUtils";
import GenericGrid from "../grid/GenericGrid";

interface RequestGridProps {
  requests: OrgRequest[];
  setSelectedRequest: (request: OrgRequest | undefined) => void;
}

const RequestGrid: React.FC<RequestGridProps> = ({
  requests,
  setSelectedRequest,
}) => {
  const idField: keyof OrgRequest = "id";

  const columnDefs: ColDef[] = [
    {
      headerName: "Submitter",
      field: "submitterName",
      valueGetter: (params) => {
        return params.data.submitterName || "No matching account";
      },
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Date",
      field: "dateRequest",
      valueGetter: (params) => extractDate(params.data.id),

      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Time In",
      field: "inRequest",
      valueGetter: (params) => extractTime(params.data.events, "clockin"),
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Time Out",
      field: "outRequest",
      valueGetter: (params) => extractTime(params.data.events, "clockout"),
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Jobs",
      field: "jobs",
      valueGetter: (params: { data: OrgRequest }) =>
        extractJobs(params.data.events),
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Total Time",
      field: "totalTimeRequested",
      valueGetter: (params: { data: OrgRequest }) =>
        calculateTotalTime(params.data.events),
      sortable: true,
      filter: true,
      resizable: true,
    },
  ];

  const handleRowSelected = (selectedRequest: OrgRequest) => {
    setSelectedRequest(selectedRequest);
  };

  return (
    <GenericGrid<OrgRequest>
      rowData={requests}
      columnDefs={columnDefs}
      onRowSelected={handleRowSelected}
      idField={idField}
      allowMultipleSelection={true}
    />
  );
};

export default RequestGrid;
