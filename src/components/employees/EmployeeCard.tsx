"use client";
import { Box, Button, Modal } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {
  deleteEmployee,
  updateEmployee,
} from "../../app/actions/employeeActions";
import { useEmployees } from "../../hooks/employees/useEmployees";
import { Employee } from "../../types/data";
import DeleteConfirmation from "../modals/DeleteConfirmation";
import EmployeeGrid from "./EmployeeGrid";
import EmployeeModal from "./EmployeeModal";

interface EmployeeCardProps {
  orgId: string;
}

interface EmployeeCardProps {
  orgId: string;
}

const EmployeeCard = ({ orgId }: EmployeeCardProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { employees, refreshEmployees } = useEmployees(orgId);

  // const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >(undefined);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const openAddEmployeeModal = () => {
    setSelectedEmployee({
      id: "",
      accessLevel: 1,
      userData: {
        displayName: "",
        email: "",
        organization: orgId,
      },
    });
    setIsAddMode(true);
    setEmployeeModalOpen(true);
  };

  const openEmployeeModal = () => {
    if (selectedEmployee) {
      setEmployeeModalOpen(true);
    } else {
      setSelectedEmployee(undefined);
      setEmployeeModalOpen(false);
    }
  };

  // TODO: Figure out implementation
  // const handleAdd = async (newEmployeeData: Employee) => {
  //   try {
  //     const employeeId = await addEmployee(orgId, newEmployeeData);
  //     if (employeeId) {
  //       enqueueSnackbar("Employee added successfully", { variant: "success" });
  //       refreshEmployees();
  //     }
  //   } catch (error) {
  //     enqueueSnackbar("Error adding employee", { variant: "error" });
  //   }
  // };

  useEffect(() => {
    console.log("dfasdsad", employees);
  }, [employees]);

  const handleEdit = async (updatedEmployee: Employee) => {
    console.log("updatedEmployee", updatedEmployee);
    if (selectedEmployee) {
      try {
        await updateEmployee(orgId, selectedEmployee.id, updatedEmployee);

        refreshEmployees();
      } catch (error) {
        console.error("Error updating employee:", error);
        enqueueSnackbar("Error updating employee", { variant: "error" });
      }
    }
    enqueueSnackbar("Employee updated successfully", {
      variant: "success",
    });

    setEmployeeModalOpen(false);
    setSelectedEmployee(undefined);

    refreshEmployees();
  };

  const handleDelete = async () => {
    if (selectedEmployee?.id) {
      try {
        await deleteEmployee(orgId, selectedEmployee.id);
        enqueueSnackbar("Employee deleted successfully", {
          variant: "success",
        });

        setDeleteModalOpen(false);
        setSelectedEmployee(undefined);
        refreshEmployees();
      } catch (error) {
        enqueueSnackbar("Error deleting employee", { variant: "error" });
      }
    }
  };

  //   return (
  //     <Box style={{ height: "100%", width: "50%", padding: "20px" }}>
  //       <EmployeeGrid
  //         employees={employees}
  //         setSelectedEmployee={setSelectedEmployee}
  //       />

  //       <Box display="flex" justifyContent="space-around" mt={2} sx={{ p: 4 }}>
  //         {/* // TODO: Figure out implementation with firebase */}
  //         {/* <Button variant="contained" onClick={openAddEmployeeModal}>
  //           Add
  //         </Button> */}
  //         <Button
  //           variant="contained"
  //           onClick={openEmployeeModal}
  //           disabled={!selectedEmployee}
  //         >
  //           Edit
  //         </Button>
  //         <Button
  //           variant="contained"
  //           onClick={() => setDeleteModalOpen(true)}
  //           disabled={!selectedEmployee}
  //         >
  //           Delete
  //         </Button>
  //       </Box>

  //       {employeeModalOpen && (
  //         <Modal
  //           open={employeeModalOpen}
  //           onClose={() => setEmployeeModalOpen(false)}
  //         >
  //           <Box
  //             sx={{
  //               position: "absolute",
  //               top: "50%",
  //               left: "50%",
  //               transform: "translate(-50%, -50%)",
  //               bgcolor: "white",
  //               p: 4,
  //               minWidth: 300,
  //               maxWidth: 600,
  //               borderRadius: 2,
  //               boxShadow: 24,
  //               overflowY: "auto",
  //             }}
  //           >
  //             <EmployeeModal employee={selectedEmployee!} onSave={handleEdit} />
  //           </Box>
  //         </Modal>
  //       )}

  //       {deleteModalOpen && (
  //         <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
  //           <DeleteConfirmation
  //             onConfirm={handleDelete}
  //             onClose={() => setDeleteModalOpen(false)}
  //             message="Are you sure you want to remove this employee and their data?"
  //           />
  //         </Modal>
  //       )}
  //     </Box>
  //   );
  // };

  // export default EmployeeCard;

  const footerHeight = "50px";
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "80%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Main grid container */}
      <Box
        sx={{
          flexGrow: 1,
          marginBottom: footerHeight,
        }}
      >
        <EmployeeGrid
          employees={employees}
          setSelectedEmployee={setSelectedEmployee}
        />
      </Box>

      {/* Footer with page size selector and action buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: 2,
          height: footerHeight,
          width: "50%",
        }}
      >
        <Button
          variant="contained"
          onClick={openEmployeeModal}
          disabled={!selectedEmployee}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          onClick={() => setDeleteModalOpen(true)}
          disabled={!selectedEmployee}
        >
          Delete
        </Button>
      </Box>

      {/* Modals */}
      {employeeModalOpen && (
        <Modal
          open={employeeModalOpen}
          onClose={() => setEmployeeModalOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              p: 4,
              minWidth: 300,
              maxWidth: 600,
              borderRadius: 2,
              boxShadow: 24,
              overflowY: "auto",
            }}
          >
            <EmployeeModal employee={selectedEmployee!} onSave={handleEdit} />
          </Box>
        </Modal>
      )}

      {deleteModalOpen && (
        <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DeleteConfirmation
            onConfirm={handleDelete}
            onClose={() => setDeleteModalOpen(false)}
            message="Are you sure you want to remove this employee and their data?"
          />
        </Modal>
      )}
    </Box>
  );
};

export default EmployeeCard;
