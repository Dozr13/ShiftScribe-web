import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/FirebaseContext";
import { OrgJobs } from "../../types/data";
import { SPACE_REPLACE_REGEX } from "../../utils/constants/regex.constants";
import SubmitButton from "../form-components/SubmitButton";
import { Job } from "../job-list";

interface AddJobFormProps {
  onJobAdded: (newJobData: Job) => void;
}

const AddJobForm = ({ onJobAdded }: AddJobFormProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [jobNameValue, setJobNameValue] = useState("");
  const [jobNumberValue, setJobNumberValue] = useState("");
  const [jobAddressValue, setJobAddressValue] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const db = useFirebase();

  const handleSubmit = async () => {
    if (!auth.orgId) return;

    try {
      if (jobNameValue.trim() === "") {
        enqueueSnackbar("Job name must not be empty", { variant: "error" });
        return;
      }
      if (jobNumberValue.trim() === "") {
        enqueueSnackbar("Job number must not be empty", { variant: "error" });
        return;
      }

      const jobKey = jobNameValue
        .replace(SPACE_REPLACE_REGEX, "_")
        .toLowerCase();

      const exists = await db.exists(`orgs/${auth.orgId}/jobs/${jobKey}`);
      if (exists) {
        enqueueSnackbar("Job already exists with this name.", {
          variant: "error",
        });
        return;
      }

      setLoading(true);

      const newJobData = {
        jobName: jobNameValue,
        jobNumber: jobNumberValue,
        jobAddress: jobAddressValue,
      };

      await db.update(`orgs/${auth.orgId}/jobs`, {
        [jobKey]: newJobData,
      } as OrgJobs);

      setJobNameValue("");
      setJobNumberValue("");
      setJobAddressValue("");

      onJobAdded({ id: jobKey, ...newJobData });

      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Error adding job", { variant: "error" });
    }
  };

  return (
    <Card sx={{ width: "70vw" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Add New Job
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Job Name"
              type="text"
              value={jobNameValue}
              onChange={(e) => setJobNameValue(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Job Number"
              type="text"
              value={jobNumberValue}
              onChange={(e) => setJobNumberValue(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Job Address"
              type="text"
              value={jobAddressValue}
              onChange={(e) => setJobAddressValue(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <SubmitButton message="Add to List" onClick={handleSubmit} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddJobForm;
