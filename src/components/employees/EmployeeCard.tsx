import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import deleteEmployee from "../../app/actions/deleteEmployee";
import updateEmployee from "../../app/actions/updateEmployee";
import { useAuthCtx } from "../../context/AuthContext";
// import { Employee } from "../../types/data";
import { fetchEmployeeData } from "../../lib/employeeApi";
import DeleteConfirmation from "./DeleteConfirmation";
import EmployeeGrid, { Employee } from "./EmployeeGrid";
import EmployeeModal from "./EmployeeModal";

interface EmployeeCardProps {
  initialEmployees: Employee[] | null;
}

const EmployeeCard = ({ initialEmployees }: EmployeeCardProps) => {
  const auth = useAuthCtx();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDelete = async (employeeId: string) => {
    await deleteEmployee(`employees/${employeeId}`);
    await fetchEmployeeData(auth.orgId);
  };

  const handleEdit = async (
    employeeId: string,
    updatedData: Partial<Employee>,
  ) => {
    try {
      await updateEmployee(`employees/${employeeId}`, updatedData);
      await fetchEmployeeData(auth.orgId);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee) {
      await handleDelete(selectedEmployee.id);
      closeDeleteModal();
      // Optionally, refresh the grid or show a success message
    }
  };

  return (
    <Box style={{ width: "50vw", padding: "20px" }}>
      <EmployeeGrid
        employees={initialEmployees}
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
          onClick={openDeleteModal}
          disabled={!selectedEmployee}
        >
          Delete
        </Button>

        {/* Edit Modal */}
        {editModalOpen && (
          <Modal open={editModalOpen} onClose={closeEditModal}>
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
              <EmployeeModal
                employee={selectedEmployee}
                onSave={closeEditModal} // Pass a callback to handle save
                onEdit={handleEdit}
              />
            </Box>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
            <DeleteConfirmation
              open={deleteModalOpen}
              onClose={closeDeleteModal}
              onConfirm={handleConfirmDelete}
            />
          </Modal>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeCard;
