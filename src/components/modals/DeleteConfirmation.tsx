import { Box, Button, Typography } from "@mui/material";

interface DeleteConfirmationProps {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const DeleteConfirmation = ({
  onClose,
  onConfirm,
  message,
}: DeleteConfirmationProps) => {
  return (
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
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Confirm Delete
      </Typography>
      <Typography>{message}</Typography>
      <Box display="flex" justifyContent="space-evenly" mt={4}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onConfirm} autoFocus>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteConfirmation;
