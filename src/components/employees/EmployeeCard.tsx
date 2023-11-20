"use client";
import { Box, Button, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchEmployees } from "../../app/actions/employee/fetchEmployees";
import { deleteData } from "../../lib/employeeApi";
import { Employee } from "../../types/data";
import DeleteConfirmation from "./DeleteConfirmation";
import EmployeeGrid from "./EmployeeGrid";
import EmployeeModal from "./EmployeeModal";

interface EmployeeCardProps {
  orgId: string;
}

interface EmployeeCardProps {
  orgId: string;
}

const EmployeeCard = ({ orgId }: EmployeeCardProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >(undefined);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      const fetchedEmployees = await fetchEmployees(orgId);
      setEmployees(fetchedEmployees);
    };

    loadEmployees();
  }, [orgId]);

  const openEditModal = () => {
    if (selectedEmployee) {
      setEditModalOpen(true);
    } else {
      setSelectedEmployee(undefined);
      setEditModalOpen(false);
    }
  };

  const handleEdit = async (updatedEmployee: Employee) => {
    if (selectedEmployee?.id) {
      const payload = {
        employeeId: selectedEmployee.id,
        orgId: orgId,
        displayName: updatedEmployee.userData.displayName,
        email: updatedEmployee.userData.email,
        accessLevel: updatedEmployee.accessLevel,
        organization: updatedEmployee.userData.organization,
      };

      console.log("Updating with payload:", payload);

      try {
        const url = "/api/employee";

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: selectedEmployee.id,
            orgId: orgId,
            displayName: updatedEmployee.userData.displayName,
            email: updatedEmployee.userData.email,
            accessLevel: updatedEmployee.accessLevel,
            organization: updatedEmployee.userData.organization,
          }),
        });

        console.log("Update response:", response);

        if (response.ok) {
          // Handle success - perhaps show a confirmation message
          console.log("Employee updated successfully");
        } else {
          // Handle errors - perhaps show an error message
          console.error("Failed to update employee");
        }
      } catch (error) {
        console.error("Error updating employee:", error);
      }

      setEditModalOpen(false);
      setSelectedEmployee(undefined);

      console.log("orgId before rfetch:", orgId);
      // Reload employee data
      const fetchedEmployees = await fetchEmployees(orgId);
      console.log("Refetched employees:", fetchedEmployees);

      setEmployees(fetchedEmployees);
    }
  };

  const handleDelete = async () => {
    if (selectedEmployee?.id) {
      await deleteData(`employees/${selectedEmployee.id}`);
      setDeleteModalOpen(false);
      setSelectedEmployee(undefined);

      const fetchedEmployees = await fetchEmployees(orgId);
      setEmployees(fetchedEmployees);
    }
  };

  return (
    <Box style={{ height: "100%", width: "50%", padding: "20px" }}>
      <EmployeeGrid
        employees={employees}
        setSelectedEmployee={setSelectedEmployee}
      />

      <Box display="flex" justifyContent="space-around" mt={2} sx={{ p: 4 }}>
        <Button
          variant="contained"
          onClick={openEditModal}
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

      {editModalOpen && (
        <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
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
          />
        </Modal>
      )}
    </Box>
  );
};

export default EmployeeCard;
