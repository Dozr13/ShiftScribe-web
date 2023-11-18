"use client";
import { Box, Button, Modal } from "@mui/material";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import deleteEmployee from "../../app/actions/deleteEmployee";
import updateEmployee from "../../app/actions/updateEmployee";
import { fetchEmployeeData } from "../../lib/employeeApi";
import { firebaseDatabase } from "../../services/firebase";
import DeleteConfirmation from "./DeleteConfirmation";
import EmployeeGrid, {
  Employee,
  UpdatableEmployeeUserData,
} from "./EmployeeGrid";
import EmployeeModal from "./EmployeeModal";

interface EmployeeCardProps {
  orgId: string;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ orgId }) => {
  const [selectedEmployee, setSelectedEmployee] =
    useState<UpdatableEmployeeUserData | null>(null);

  const [initialEmployees, setInitialEmployees] = useState<Employee[] | null>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, [orgId]);

  const fetchEmployees = async () => {
    if (!orgId) return;

    setLoading(true);

    try {
      const orgMembersRef = ref(firebaseDatabase, `orgs/${orgId}/members`);
      const orgMembersSnapshot = await get(orgMembersRef);

      if (orgMembersSnapshot.exists()) {
        const membersData = orgMembersSnapshot.val();
        const memberIds = Object.keys(membersData);

        const employeesArray = await Promise.all(
          memberIds.map(async (memberId) => {
            const userRef = ref(firebaseDatabase, `users/${memberId}`);
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val();

            return {
              id: memberId,
              ...membersData[memberId],
              userData,
            };
          }),
        );

        setInitialEmployees(employeesArray);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDelete = async (employeeId: string) => {
    await deleteEmployee(`employees/${employeeId}`);
    await fetchEmployeeData(orgId ?? "");
  };

  const handleEdit = async (
    employeeId: string,
    updatedData: Partial<Employee>,
  ) => {
    console.log("UPDATED DATAAAA: ", updatedData);
    try {
      await updateEmployee(`employees/${employeeId}`, updatedData);
      fetchEmployees(); // Refresh the employee data
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
    <Box style={{ height: "100%", width: "50%", padding: "20px" }}>
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
                onSave={closeEditModal}
                onEdit={handleEdit}
                onUpdated={fetchEmployees}
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
