"use client";
import { Box, Grid, IconButton, Modal, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { FaCalendar, FaTimes } from "react-icons/fa";
import {
  fetchAndGenerateCSV,
  purgeOldRecords,
} from "../../app/actions/recordsActions";
import useDateRange from "../../hooks/useDateRange";
import { getLastSundayTwoWeeksPrior } from "../../utils/dataService";
import DateRangePicker from "../records/DateRangePicker";
import DownloadCsvButton from "../records/DownloadCsvButton";
import GenerateCsvButton from "../records/GenerateCsvButton";
import PurgeOldRecords from "../records/PurgeOldRecords";
import { BACKGROUND_COLOR } from "../../../constants/colorPalette";

interface RecordsCardProps {
  orgId: string;
}

const RecordsCard: React.FC<RecordsCardProps> = ({ orgId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { dateState, setDateState } = useDateRange();
  const [showDateRange, setShowDateRange] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState<boolean>(false);
  const [csv, setCsv] = useState<string>();

  const effectiveStartDate =
    dateState[0].startDate ?? getLastSundayTwoWeeksPrior();
  const effectiveEndDate = dateState[0].endDate ?? new Date();

  const generateCSV = async () => {
    setLoadingCSV(true);
    const { success, csv, message } = await fetchAndGenerateCSV(
      orgId,
      effectiveStartDate,
      effectiveEndDate,
    );

    if (success && csv) {
      enqueueSnackbar(message || "CSV successfully generated", {
        variant: "success",
      });
      setCsv(csv);
    } else {
      // TODO: Implement better error message for if the dates selected don't have any records
      enqueueSnackbar(message || "An error occurred", { variant: "error" });
    }
    setLoadingCSV(false);
  };

  const handleShowDateRange = () => {
    setShowDateRange((prevShow) => !prevShow);
  };

  const handleModalClose = () => {
    setShowDateRange(false);

    // Display Snackbar message only if dates are selected
    if (dateState[0].startDate && dateState[0].endDate) {
      enqueueSnackbar(
        `Start Date set to: ${dateState[0].startDate.toLocaleDateString()}, End Date set to: ${dateState[0].endDate.toLocaleDateString()}`,
        { variant: "info" },
      );
    }
  };

  const purgeOldRecordsWrapper = async () => {
    const startDate = dateState[0].startDate;
    const endDate = dateState[0].endDate;
    // console.log("Purging records from:", startDate, "to", endDate);

    const result = await purgeOldRecords(orgId, startDate, endDate);

    if (result.success) {
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  return (
    <>
      <Paper
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: 2,
          p: 4,
          boxShadow: 3,
          bgcolor: BACKGROUND_COLOR,
        }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          {csv ? (
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <DownloadCsvButton
                  csv={csv}
                  resetCsv={() => setCsv(undefined)}
                  startDate={dateState[0].startDate}
                  endDate={dateState[0].endDate}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <GenerateCsvButton
                  disabled={loadingCSV}
                  onGenerateCSV={generateCSV}
                />
              </Grid>
              <Grid item>
                <PurgeOldRecords
                  orgId={orgId}
                  purgeFunction={purgeOldRecordsWrapper}
                />
              </Grid>
              <Grid item>
                <IconButton
                  onClick={handleShowDateRange}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showDateRange ? <FaTimes /> : <FaCalendar />}
                  <Box mr={1} />
                  <Typography variant="h6" color="primary">
                    {showDateRange ? "Close Date Range" : "Toggle Date Range"}
                  </Typography>
                </IconButton>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>

      {showDateRange && (
        // <Modal open={showDateRange} onClose={handleShowDateRange}>
        <Modal open={showDateRange} onClose={handleModalClose}>
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
            <DateRangePicker
              dateState={dateState}
              setDateState={setDateState}
            />
          </Box>
        </Modal>
      )}
    </>
  );
};

export default RecordsCard;
