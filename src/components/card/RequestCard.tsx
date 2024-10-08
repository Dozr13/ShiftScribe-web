"use client";
import { Box, Button, Modal } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { FOOTER_HEIGHT } from "../../../constants/sizes";
import { OrgRequest } from "../../../types/data";
import {
  approveRequest,
  denyRequest,
  fetchRequests,
} from "../../app/actions/requestActions";
import { OrganizationIDProps } from "../../interfaces/interfaces";
import RequestGrid from "../grid/RequestGrid";
import DeleteConfirmation from "../modals/DeleteConfirmation";
import RequestModal from "../modals/RequestModal";

const RequestCard: React.FC<OrganizationIDProps> = ({ orgId }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [requests, setRequests] = useState<OrgRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<
    OrgRequest | undefined
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
        // console.error("Error approving request:", error);
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
      <Box
        sx={{
          flexGrow: 1,
          marginBottom: FOOTER_HEIGHT,
        }}
      >
        <RequestGrid
          requests={requests}
          setSelectedRequest={setSelectedRequest}
        />
      </Box>

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
