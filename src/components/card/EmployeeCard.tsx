"use client";
import { Box, Button, Modal } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { FOOTER_HEIGHT } from "../../../constants/sizes";
import { OrgEmployee } from "../../../types/data";
import {
  deleteEmployee,
  updateEmployee,
} from "../../app/actions/employeeActions";
import { useEmployees } from "../../hooks/employees/useEmployees";
import { OrganizationIDProps } from "../../interfaces/interfaces";
import EmployeeGrid from "../grid/EmployeeGrid";
import DeleteConfirmation from "../modals/DeleteConfirmation";
import EmployeeModal from "../modals/EmployeeModal";

const EmployeeCard = ({ orgId }: OrganizationIDProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { employees, refreshEmployees } = useEmployees(orgId);

  const [selectedEmployee, setSelectedEmployee] = useState<
    OrgEmployee | undefined
  >(undefined);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // TODO: Figure out implementation
  // const [isAddMode, setIsAddMode] = useState(false);

  // const openAddEmployeeModal = () => {
  //   setSelectedEmployee({
  //     id: "",
  //     accessLevel: 1,
  //     userData: {
  //       displayName: "",
  //       email: "",
  //       organization: orgId,
  //     },
  //   });
  //   setIsAddMode(true);
  //   setEmployeeModalOpen(true);
  // };

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

  const handleEdit = async (updatedEmployee: OrgEmployee) => {
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
          marginBottom: FOOTER_HEIGHT,
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
          height: FOOTER_HEIGHT,
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
