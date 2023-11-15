import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
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
        <Typography variant="h6" gutterBottom>
          Confirm Delete
        </Typography>
        <Typography>
          Are you sure you want to remove this employee and their data from the
          organization?
        </Typography>
        <Box display="flex" justifyContent="space-around" mt={2}>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onConfirm}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmation;
