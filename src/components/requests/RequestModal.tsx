"use client";
import { Box, Button, Typography } from "@mui/material";
import { OrgRequests } from "../../types/data";

interface RequestModalProps {
  request: OrgRequests;
  onApprove: () => void;
}

const RequestModal = ({ request, onApprove }: RequestModalProps) => {
  return (
    <Box>
      <Typography variant="h6">Confirm Action</Typography>
      <Typography>Are you sure you want to Approve these requests?</Typography>
      <Box
        sx={{ display: "flex", justifyContent: "space-around", marginTop: 2 }}
      >
        <Button variant="contained" color="primary" onClick={onApprove}>
          Approve
        </Button>
      </Box>
    </Box>
  );
};

export default RequestModal;
