import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import AddJobForm from "../../components/forms/AddJobForm";
import JobListItem, { Job } from "../../components/job-list";
import ProtectedRoute from "../../components/protected-route";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/FirebaseContext";
import { OrgJobs } from "../../types/data";
import LoadingScreen from "../loading";

const JobInformationPage = () => {
  const auth = useAuth();
  const db = useFirebase();
  const { enqueueSnackbar } = useSnackbar();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!auth.orgId) return;

      setLoading(true);

      const snapshot = await db.read(`orgs/${auth.orgId}/jobs`);
      if (snapshot.exists()) {
        const jobsData = snapshot.val() as OrgJobs;
        const jobsArray = Object.keys(jobsData).map((key) => ({
          id: key,
          ...jobsData[key],
        }));
        setJobs(jobsArray);
      }

      setLoading(false);
    };

    fetchJobs();
  }, [auth.orgId, db]);

  const handleDelete = async (id: string) => {
    await db.update(`orgs/${auth.orgId}/jobs`, {
      [id]: null,
    });

    enqueueSnackbar("Job deleted successfully", { variant: "error" });
  };

  const handleJobAdded = (newJobData: Job) => {
    setJobs((prevJobs) => [...prevJobs, newJobData]);

    enqueueSnackbar("Job added successfully", { variant: "success" });
  };

  return (
    <ProtectedRoute>
      {loading && <LoadingScreen />}
      <Box
        sx={{
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h3" color="textSecondary" sx={{ my: 4 }}>
          Job Information
        </Typography>
        <Paper
          sx={{
            p: 5,
            mb: 4,
            border: 2,
            borderColor: theme.BORDER_COLOR,
            bgcolor: theme.HEADER_BACKGROUND_COLOR,
            borderRadius: 2,
            overflowY: "auto",
            maxHeight: "40vh",
            width: "70vw",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.TEXT_COLOR,
              }}
            >
              Job Name
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.TEXT_COLOR,
              }}
            >
              Job Number
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.TEXT_COLOR,
              }}
            >
              Job Address
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.TEXT_COLOR,
              }}
            >
              Actions
            </Grid>
            <Divider sx={{ width: "100%", mt: 4 }} />
          </Grid>
          {jobs.map((job) => (
            <JobListItem key={job.id} job={job} onDelete={handleDelete} />
          ))}
        </Paper>
        <AddJobForm onJobAdded={handleJobAdded} />
      </Box>
    </ProtectedRoute>
  );
};

export default JobInformationPage;
