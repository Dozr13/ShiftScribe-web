"use client";
import { Box, Button, Modal, SelectChangeEvent } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {
  addJob,
  // addJob,
  deleteJob,
  fetchJobs,
  updateJob,
} from "../../app/actions/jobActions";
import { OrgJob } from "../../types/data";
import DeleteConfirmation from "./DeleteConfirmation";
import JobGrid from "./JobGrid";
import JobModal from "./JobModal";

interface JobCardProps {
  orgId: string;
}

const JobCard = ({ orgId }: JobCardProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [jobs, setJobs] = useState<OrgJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<OrgJob | undefined>(undefined);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const pageSizes = [5, 10, 20, 50, 100];

  useEffect(() => {
    fetchJobs(orgId, setJobs);
  }, [orgId]);

  const handlePageSizeChange = (event: SelectChangeEvent) => {
    const newSize = parseInt(event.target.value, 10);
    setPaginationPageSize(newSize);
  };

  const openAddJobModal = () => {
    setSelectedJob({ id: "", jobName: "", jobNumber: "", jobAddress: "" });
    setIsAddMode(true);
    setJobModalOpen(true);
  };

  const openJobModal = () => {
    if (selectedJob) {
      setJobModalOpen(true);
    } else {
      setSelectedJob(undefined);
      setJobModalOpen(false);
    }
  };

  const handleAddNewJob = async (newJob: Partial<OrgJob>) => {
    if (!newJob.jobName || !newJob.jobNumber || !newJob.jobAddress) {
      enqueueSnackbar("Job name and number are required", { variant: "error" });
      return;
    }

    try {
      await addJob(orgId, newJob.jobName, newJob.jobNumber, newJob.jobAddress);
      enqueueSnackbar("Job updated successfully", { variant: "success" });

      fetchJobs(orgId, setJobs);
    } catch (error) {
      console.error("Error adding new job:", error);
      enqueueSnackbar("Error adding new job", { variant: "success" });
    }
    setJobModalOpen(false);
    setIsAddMode(false);
  };

  const handleEdit = async (updatedJob: Partial<OrgJob>) => {
    if (!updatedJob.jobName || !updatedJob.jobNumber) {
      enqueueSnackbar("Job name and number are required", { variant: "error" });
      return;
    }

    if (selectedJob) {
      try {
        await updateJob(orgId, selectedJob.id, updatedJob);

        fetchJobs(orgId, setJobs);
      } catch (error) {
        console.error("Error updating job:", error);
        enqueueSnackbar("Error updating job", { variant: "error" });
      }

      enqueueSnackbar("Job updated successfully", { variant: "success" });

      setJobModalOpen(false);
      setSelectedJob(undefined);

      fetchJobs(orgId, setJobs);
    }
  };

  const handleDelete = async () => {
    console.log("selectedJob", selectedJob);
    console.log("selectedJob ID", selectedJob?.id);
    if (selectedJob?.id) {
      try {
        await deleteJob(orgId, selectedJob.id);

        enqueueSnackbar("Job deleted successfully", { variant: "success" });

        setDeleteModalOpen(false);
        setSelectedJob(undefined);
        fetchJobs(orgId, setJobs);
      } catch (error) {
        console.error("Error deleting job:", error);
        enqueueSnackbar("Error deleting job", { variant: "error" });
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
        <JobGrid jobs={jobs} setSelectedJob={setSelectedJob} />
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
        {/* Action buttons */}
        <Button variant="contained" onClick={openAddJobModal}>
          Add
        </Button>
        <Button
          variant="contained"
          onClick={openJobModal}
          disabled={!selectedJob}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          onClick={() => setDeleteModalOpen(true)}
          disabled={!selectedJob}
        >
          Delete
        </Button>
      </Box>

      {/* Modals */}
      {jobModalOpen && (
        <Modal open={jobModalOpen} onClose={() => setJobModalOpen(false)}>
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
            <JobModal
              job={selectedJob!}
              onSave={isAddMode ? handleAddNewJob : handleEdit}
              isAddMode={isAddMode}
            />
          </Box>
        </Modal>
      )}
      {deleteModalOpen && (
        <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DeleteConfirmation
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
          />
        </Modal>
      )}
    </Box>
  );
};

export default JobCard;
