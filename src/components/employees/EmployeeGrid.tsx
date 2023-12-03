import { ColDef } from "ag-grid-community";
import { EmployeesGridRowData, OrgEmployee } from "../../../types/data";
import GenericGrid from "../grid/GenericGrid";

interface EmployeeGridProps {
  employees: OrgEmployee[];
  setSelectedEmployee: (employee: OrgEmployee | undefined) => void;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  setSelectedEmployee,
}) => {
  const idField: keyof EmployeesGridRowData = "id";

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

  const handleRowSelected = (employee: OrgEmployee) => {
    setSelectedEmployee(employee);
  };

  return (
    <GenericGrid<OrgEmployee>
      rowData={rowData}
      columnDefs={columnDefs}
      onRowSelected={handleRowSelected}
      idField={idField}
    />
  );
};

export default EmployeeGrid;
