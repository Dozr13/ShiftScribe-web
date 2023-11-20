import { Box, Button, Typography } from "@mui/material";
import { forwardRef } from "react";

interface DeleteConfirmationProps {
  onClose: () => void;
  onConfirm: () => void; // Change here
}

const DeleteConfirmation = forwardRef<HTMLDivElement, DeleteConfirmationProps>(
  ({ onClose, onConfirm }, ref) => {
    return (
      <Box
        ref={ref}
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
          Are you sure you want to remove this job information?
        </Typography>
        <Box display="flex" justifyContent="space-around" mt={2}>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onConfirm} autoFocus>
            Confirm
          </Button>
        </Box>
      </Box>
    );
  },
);

DeleteConfirmation.displayName = "DeleteConfirmation";

export default DeleteConfirmation;
