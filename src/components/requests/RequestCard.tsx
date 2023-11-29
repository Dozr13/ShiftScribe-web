"use client";
import { Box, Button, Modal } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {
  approveRequest,
  denyRequest,
  fetchRequests,
} from "../../app/actions/requestActions";
import { OrgRequests } from "../../types/data";
import DeleteConfirmation from "../modals/DeleteConfirmation";
import RequestGrid from "./RequestGrid";
import RequestModal from "./RequestModal";

interface RequestCardProps {
  orgId: string;
}

const RequestCard = ({ orgId }: RequestCardProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [requests, setRequests] = useState<OrgRequests[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<
    OrgRequests | undefined
  >(undefined);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      await fetchRequests(orgId, setRequests);
    };

    init();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [orgId]);

  const openRequestModal = () => {
    if (selectedRequest) {
      setRequestModalOpen(true);
    } else {
      setSelectedRequest(undefined);
      setRequestModalOpen(false);
    }
  };

  const handleApprove = async () => {
    if (selectedRequest) {
      try {
        const timeRecordData = {
          events: selectedRequest.events || {},
          submitter: selectedRequest.submitter,
        };

        await approveRequest(orgId, selectedRequest.id, timeRecordData);
        enqueueSnackbar("Request approved successfully", {
          variant: "success",
        });
        fetchRequests(orgId, setRequests);
      } catch (error) {
        console.error("Error approving request:", error);
        enqueueSnackbar("Error approving request", { variant: "error" });
      }
    }

    setSelectedRequest(undefined);
    setRequestModalOpen(false);
  };

  const handleDeny = async () => {
    if (selectedRequest?.id) {
      try {
        await denyRequest(orgId, selectedRequest.id);
        enqueueSnackbar("Request denied successfully", { variant: "success" });
        fetchRequests(orgId, setRequests);
      } catch (error) {
        console.error("Error denying request:", error);
        enqueueSnackbar("Error denying request", { variant: "error" });
      }
    }
  };

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
        <RequestGrid
          requests={requests}
          setSelectedRequest={setSelectedRequest}
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
          onClick={openRequestModal}
          disabled={!selectedRequest}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          onClick={() => setDeleteModalOpen(true)}
          disabled={!selectedRequest}
        >
          Deny
        </Button>
      </Box>

      {/* Modals */}
      {requestModalOpen && (
        <Modal
          open={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
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
            <RequestModal
              request={selectedRequest!}
              onApprove={handleApprove}
            />
          </Box>
        </Modal>
      )}
      {deleteModalOpen && (
        <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DeleteConfirmation
            onConfirm={handleDeny}
            onClose={() => setDeleteModalOpen(false)}
            message="Are you sure you want to remove this job information?"
          />
        </Modal>
      )}
    </Box>
  );
};

export default RequestCard;
