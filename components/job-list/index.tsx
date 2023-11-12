import {
  faCancel,
  faEdit,
  faSave,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/FirebaseContext";
import { showToast } from "../../utils/toast";
import EditableTextField from "../inputs/EditableTextField";

export interface Job {
  id: string;
  jobName: string;
  jobNumber: string;
  jobAddress: string;
}

interface JobListItemProps {
  job: Job;
  onDelete: (jobId: string) => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ job, onDelete }) => {
  const auth = useAuth();
  const db = useFirebase();
  const { enqueueSnackbar } = useSnackbar();

  const [editing, setEditing] = useState(false);
  const [jobName, setJobName] = useState(job.jobName);
  const [jobNumber, setJobNumber] = useState(job.jobNumber);
  const [jobAddress, setJobAddress] = useState(job.jobAddress);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (jobName.trim() === "")
      return showToast("Job name cannot be empty", false);
    if (jobNumber.trim() === "")
      return showToast("Job number cannot be empty", false);

    await db.update(`orgs/${auth.orgId}/jobs/${job.id}`, {
      jobName: jobName,
      jobNumber: jobNumber,
      jobAddress: jobAddress,
    });

    enqueueSnackbar("Job details updated successfully", { variant: "success" });

    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(job.id);
  };

  function handleCancel(): void {
    setEditing(false);
  }

  return (
    <Grid
      container
      alignItems="center"
      spacing={2}
      sx={{ borderBottom: 2, borderColor: theme.BORDER_COLOR, py: 2 }}
    >
      <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
        {editing ? (
          <EditableTextField
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
          />
        ) : (
          <Typography>{jobName}</Typography>
        )}
      </Grid>
      <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
        {editing ? (
          <EditableTextField
            value={jobNumber}
            onChange={(e) => setJobNumber(e.target.value)}
          />
        ) : (
          <Typography>{jobNumber}</Typography>
        )}
      </Grid>
      <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
        {editing ? (
          <EditableTextField
            value={jobAddress}
            onChange={(e) => setJobAddress(e.target.value)}
          />
        ) : (
          <Typography>{jobAddress}</Typography>
        )}
      </Grid>
      <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title={!editing ? "Edit" : "Save"}>
          <IconButton
            onClick={!editing ? handleEdit : handleSave}
            sx={{
              color: !editing ? theme.ACCENT_COLOR : theme.BUTTON_COLOR_PRIMARY,
            }}
          >
            <FontAwesomeIcon icon={!editing ? faEdit : faSave} />
          </IconButton>
        </Tooltip>
        <Tooltip title={!editing ? "Delete" : "Cancel"}>
          <IconButton
            onClick={!editing ? handleDelete : handleCancel}
            sx={{ color: !editing ? "error.main" : "warning.main" }}
          >
            <FontAwesomeIcon icon={!editing ? faTrashAlt : faCancel} />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default JobListItem;
