import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StringUtils } from "../../lib";
import { EventObject, RequestData } from "../../types/data";

interface IRequestListItem {
  requests: RequestData[];
  isChecked: boolean[];
  setIsChecked: Dispatch<SetStateAction<boolean[]>>;
  onApprove: () => Promise<void>;
  onDeny: (id: number) => Promise<void>;
}

const RequestListItem = ({
  requests,
  isChecked,
  setIsChecked,
  onApprove,
  onDeny,
}: IRequestListItem) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<EventObject[]>([]);

  useEffect(() => {
    setIsChecked(Array(requests.length).fill(false));
  }, [requests, setIsChecked]);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    jobs: EventObject[],
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedJobs(jobs);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedJobs([]);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    setIsChecked(Array(requests.length).fill(false));
  }, [requests, setIsChecked]);

  const handleApproveClick = () => {
    onApprove();
  };

  const handleDenyClick = () => {
    const idsToDeny = requests
      .filter((_, i) => isChecked[i])
      .map((request) => request.id);
    for (const id of idsToDeny) {
      onDeny(id);
    }
  };

  const formatRequestDetails = (request: RequestData) => {
    return `Submitted By: ${
      request.submitter
    }, Date: ${StringUtils.timestampToMMDDYYYY(
      request.dateRequest,
    )}, In: ${StringUtils.timestampToHHMM(
      request.inRequest,
    )}, Out: ${StringUtils.timestampToHHMM(request.outRequest)}`;
  };

  return (
    <>
      <Paper
        sx={{
          p: 2,
          mx: "auto",
          border: 2,
          bgcolor: "grey.400",
          borderRadius: 2,
          overflow: "auto",
          height: "50vh",
          width: "40vw",
        }}
      >
        {requests.map((request, index) => (
          <Card key={request.id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={1}>
                  <Checkbox
                    checked={isChecked[index]}
                    onChange={(event, checked) => {
                      const newCheckedItems = [...isChecked];
                      newCheckedItems[index] = checked;
                      setIsChecked(newCheckedItems);
                    }}
                  />
                </Grid>
                <Grid item xs={11}>
                  <Typography variant="body1" component="div">
                    Submitted By: {request.submitter} - Date:{" "}
                    {StringUtils.timestampToMMDDYYYY(request.dateRequest)}
                  </Typography>
                  <Typography variant="body2" component="div">
                    In: {StringUtils.timestampToHHMM(request.inRequest)} - Out:{" "}
                    {StringUtils.timestampToHHMM(request.outRequest)}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Jobs: {request.jobs.map((job) => job.job).join(", ")}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Paper>
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ width: "40vw", mt: 4 }}
      >
        <Grid item xs={6}>
          <Button
            variant="contained"
            sx={{ p: 2 }}
            type="submit"
            onClick={handleApproveClick}
            fullWidth
          >
            Approve
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            sx={{ p: 2 }}
            onClick={handleDenyClick}
            fullWidth
          >
            Deny
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default RequestListItem;
