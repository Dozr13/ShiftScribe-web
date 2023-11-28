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
import { Employee, EmployeesGridRowData } from "../../types/data";

interface EmployeeGridProps {
  employees: Employee[];
  setSelectedEmployee: (employee: Employee | undefined) => void;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  setSelectedEmployee,
}) => {
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

  const rowData: EmployeesGridRowData[] = employees!.map((employee) => ({
    id: employee.id,
    displayName: employee.userData?.displayName,
    email: employee.userData?.email,
    organization: employee.userData?.organization,
    accessLevel: employee.accessLevel,
  }));

  const columnDefs = [
    { headerName: "Name", field: "displayName", width: 100, flex: 1 },
    { headerName: "Email", field: "email", width: 100, flex: 1 },
    { headerName: "Organization", field: "organization", width: 100, flex: 1 },
    { headerName: "Access Level", field: "accessLevel", width: 100, flex: 1 },
  ] as ColDef[];

  const onRowSelected = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      const selectedId = event.data.id;
      const fullEmployee = employees.find((emp) => emp.id === selectedId);

      if (fullEmployee) {
        setSelectedEmployee(fullEmployee);
      } else {
        console.error("Selected employee not found");
      }
    } else {
      setSelectedEmployee(undefined);
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
        animateRows={true}
        pagination={true}
        paginationPageSize={5}
        enableRangeSelection={true}
        domLayout="autoHeight"
      />
    </Box>
  );
};

export default EmployeeGrid;
