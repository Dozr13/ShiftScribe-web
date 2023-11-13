import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaCalendar, FaTimes } from "react-icons/fa";
import ProtectedRoute from "../../components/protected-route";
import DateRangePicker from "../../components/view-records/DateRangePicker";
import DownloadCsvButton from "../../components/view-records/DownloadCsvButton";
import PurgeOldRecords from "../../components/view-records/PurgeOldRecords";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/FirebaseContext";
import useDateRange from "../../hooks/useDateRange";
import useLoadingAndError from "../../hooks/useLoadingAndError";
import { fetchData } from "../../utils/dataService";
import { getLastSundayTwoWeeksPrior } from "../../utils/dateUtils";
import generateCSVContent from "../../utils/generateCsvContent";
import LoadingScreen from "../loading";

export const ViewRecordsPage = () => {
  const auth = useAuth();
  const db = useFirebase();
  const { enqueueSnackbar } = useSnackbar();
  const { dateState, setDateState } = useDateRange();
  const { isLoading, error, startLoading, stopLoading, handleError } =
    useLoadingAndError();

  const { startDate, endDate } = dateState[0];

  const [csv, setCsv] = useState<string>();
  const [loadingCSV, setLoadingCSV] = useState<boolean>(false);

  const [showDateRange, setShowDateRange] = useState(false);

  useEffect(() => {
    if (startDate === undefined) {
      const lastSundayTwoWeeksPrior = getLastSundayTwoWeeksPrior();
      setDateState((prevState) => [
        { ...prevState[0], startDate: lastSundayTwoWeeksPrior },
      ]);
    }
    if (endDate === undefined) {
      const today = new Date();
      setDateState((prevState) => [{ ...prevState[0], endDate: today }]);
    }
  }, [startDate, endDate, setDateState]);

  const generateCSV = async () => {
    setLoadingCSV(true);
    const records = await handleFetchData();
    if (records) {
      const csvContent = await generateCSVContent({
        readUserFunction: db.read,
        orgId: auth.orgId,
        startDate,
        endDate,
        data: records,
      });
      setCsv(csvContent);
    } else {
      enqueueSnackbar("No records found for the selected date range.", {
        variant: "error",
      });
    }
    setLoadingCSV(false);
  };

  const handleFetchData = useCallback(async () => {
    startLoading();
    try {
      const data = await fetchData(db, auth.orgId, startDate, endDate);
      console.log("Fetched Data:", data);
      return data;
    } catch (error) {
      handleError(error as string);
    } finally {
      stopLoading();
    }
  }, [
    db,
    auth.orgId,
    startDate,
    endDate,
    startLoading,
    stopLoading,
    handleError,
  ]);

  const handleShowDateRange = () => {
    setShowDateRange((prevShow) => !prevShow);
  };

  return (
    <ProtectedRoute>
      {isLoading && <LoadingScreen />}
      {error && <p>Error: {error}</p>}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",
        }}
      >
        <Typography variant="h3" color="textSecondary" sx={{ my: 4 }}>
          Documents for: {auth.orgId}
        </Typography>
        <Paper
          sx={{
            p: 5,
            border: 2,
            borderColor: theme.BORDER_COLOR,
            bgcolor: theme.HEADER_BACKGROUND_COLOR,
            borderRadius: 2,
            overflowY: "scroll",
            maxHeight: "90%",
            width: "50vw",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
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
                    startDate={startDate}
                    endDate={endDate}
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={generateCSV}
                    disabled={loadingCSV}
                    sx={{ fontSize: "18px", px: 4, py: 2 }}
                  >
                    {loadingCSV ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Generate CSV"
                    )}
                  </Button>
                </Grid>
                <Grid item>
                  <PurgeOldRecords
                    orgId={auth.orgId}
                    fetchDataFunction={handleFetchData}
                  />
                </Grid>
                <Grid item mt={4}>
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

        {/* Second Grid item for the DateRangePicker */}
        {showDateRange && (
          <Grid item xs={12} md={8} lg={6}>
            <DateRangePicker
              dateState={dateState}
              setDateState={setDateState}
            />
          </Grid>
        )}
      </Box>
    </ProtectedRoute>
  );
};

export default ViewRecordsPage;
