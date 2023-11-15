import { Box } from "@mui/material";
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClassParams,
  RowStyle,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GridRowData } from "../../types/data";

export interface Employee {
  id: string;
  accessLevel: number;
  userData: {
    displayName: string;
    email: string;
    organization: string;
  } | null;
}

interface EmployeeGridProps {
  employees: Employee[] | null;
  setSelectedEmployee: Dispatch<SetStateAction<Employee | null>>;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  setSelectedEmployee,
}) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const onSelectionChanged = () => {
    if (gridApi) {
      const selectedNodes = gridApi.getSelectedNodes();

      if (selectedNodes.length > 0) {
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedEmployee(selectedData[0]);
      } else {
        setSelectedEmployee(null);
      }
    }
  };

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

  const rowData: GridRowData[] = employees!.map((employee) => ({
    displayName: employee.userData?.displayName || "",
    email: employee.userData?.email || "",
    organization: employee.userData?.organization || "",
    accessLevel: employee.accessLevel,
  }));

  const columnDefs = [
    { headerName: "Name", field: "displayName", width: 100, flex: 1 },
    { headerName: "Email", field: "email", width: 100, flex: 1 },
    { headerName: "Organization", field: "organization", width: 100, flex: 1 },
    { headerName: "Access Level", field: "accessLevel", width: 100, flex: 1 },
  ] as ColDef[];

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

  return (
    <Box className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowSelection="single"
        onSelectionChanged={onSelectionChanged}
        onGridReady={onGridReady}
        getRowStyle={getRowStyle}
        rowData={rowData}
        columnDefs={columnDefs}
        animateRows={true}
      />
    </Box>
  );
};

export default EmployeeGrid;
