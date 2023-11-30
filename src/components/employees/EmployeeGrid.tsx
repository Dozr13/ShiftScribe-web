import { ColDef, GridApi } from "ag-grid-community";
import { useEffect, useState } from "react";
import { Employee, EmployeesGridRowData } from "../../types/data";
import GenericGrid from "../grid/GenericGrid";

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
    const handleResize = () => gridApi?.sizeColumnsToFit();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gridApi]);

  const rowData: EmployeesGridRowData[] = employees!.map((employee) => ({
    id: employee.id,
    accessLevel: employee.accessLevel,
    userData: {
      displayName: employee.userData?.displayName,
      email: employee.userData?.email,
      organization: employee.userData?.organization,
    },
  }));

  const columnDefs: ColDef[] = [
    {
      headerName: "Name",
      field: "userData.displayName",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Email",
      field: "userData.email",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Organization",
      field: "userData.organization",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Access Level",
      field: "accessLevel",
      sortable: true,
      filter: true,
      resizable: true,
    },
  ];

  const handleRowSelected = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <GenericGrid<Employee>
      rowData={rowData}
      columnDefs={columnDefs}
      onRowSelected={handleRowSelected}
      idField="id"
    />
  );
};

export default EmployeeGrid;
