import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { QueryConstraint, equalTo, orderByKey } from "firebase/database";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "../../components/protected-route";
import RequestListItem from "../../components/requests-list-item/RequestListIem";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/FirebaseContext";
import { PermissionLevel } from "../../lib";
import stringUtils from "../../lib/StringUtils";
import timeParser from "../../lib/TimeParser";
import {
  EventObject,
  RequestData,
  TimeRecords,
  UserData,
} from "../../types/data";
import { DASHBOARD } from "../../utils/constants/routes.constants";

const ViewRequestsPage = () => {
  const auth = useAuth();
  const db = useFirebase();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [isChecked, setIsChecked] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<Array<RequestData>>([]);
  const [isEditedRecord, setIsEditedRecord] = useState<boolean>(false);

  const fetchData = useCallback(
    async (...query: QueryConstraint[]) => {
      setLoading(true);
      const res = await db.query(
        `orgs/${auth.orgId}/adjustmentRequests`,
        ...query,
      );
      setLoading(false);

      if (!res.exists()) {
        enqueueSnackbar("No records match this request.", {
          variant: "error",
        });
      }

      return res.toJSON() as TimeRecords;
    },
    [auth.orgId, db, enqueueSnackbar],
  );

  const displayRequests = useCallback(async (): Promise<RequestData[]> => {
    if (!auth.orgId || !auth.user) return [];

    setLoading(true);

    try {
      const data = await fetchData();

      if (!data) {
        setLoading(false);
        return [];
      }

      const requestsArray = [];

      for (const key in data) {
        const record = data[key];

        if (!record.events) continue;

        const userData = await db.read(`/users/${record.submitter}`);
        const userInfo = userData.toJSON() as UserData;

        const { origin, timeWorked } = timeParser.parseCurrentRecord(
          record.events,
        );

        const allJobs: EventObject[] = Object.values(record.events);

        const daysWorkTime = stringUtils.timestampHM(timeWorked);
        const request: RequestData = {
          id: Number(key),
          submitter: userInfo.displayName,
          dateRequest: origin,
          inRequest: origin,
          outRequest: origin + timeWorked,
          jobs: allJobs,
          totalTimeRequested: Number(daysWorkTime),
        };

        requestsArray.push(request);
      }

      setLoading(false);
      return requestsArray;
    } catch (error) {
      enqueueSnackbar("Error fetching requests.", {
        variant: "error",
      });
      setLoading(false);
      return [];
    }
  }, [auth.orgId, auth.user, db, enqueueSnackbar, fetchData]);

  useEffect(() => {
    if (auth.permissionLevel >= PermissionLevel.MANAGER) {
      const getRequests = async () => {
        const requests = await displayRequests();
        if (Array.isArray(requests)) {
          setRequests(requests);
        }
      };

      getRequests();
    } else {
      router.back();
    }
  }, [auth.permissionLevel, router, displayRequests]);

  useEffect(() => {
    setIsChecked(Array(requests.length).fill(false));
  }, [requests]);

  function convertUnixToMMDDYYYY(unixTimestamp: string | number) {
    const date = new Date(unixTimestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  const handleApprove = async () => {
    const allPromises = requests
      .filter((_, i) => isChecked[i])
      .map(async (request) => {
        const originalData = await fetchData(
          orderByKey(),
          equalTo(request.id.toString()),
        );

        if (originalData && Object.keys(originalData).length > 0) {
          const firstTimestamp = Object.keys(originalData)[0];
          const firstTimestampMMDDYYYY = convertUnixToMMDDYYYY(
            Number(firstTimestamp),
          );
        }

        if (!originalData) return;

        for (const [originalKey, record] of Object.entries(originalData)) {
          if (!record.events) continue;

          const { events, submitter } = record;

          try {
            const existingRecord = await db.read(
              `orgs/${auth.orgId}/timeRecords/${originalKey}`,
            );

            if (existingRecord.exists()) {
              setIsEditedRecord(true);
            }

            await db.update(`orgs/${auth.orgId}/timeRecords`, {
              [originalKey]: {
                events,
                submitter,
              },
            });
          } catch (error) {
            enqueueSnackbar("Error approving request.", {
              variant: "error",
            });
          }
        }

        await db.delete(`orgs/${auth.orgId}/adjustmentRequests/${request.id}`);
        const remainingRequests = requests.filter((_, i) => !isChecked[i]);
        setRequests(remainingRequests);
        setIsChecked(Array(remainingRequests.length).fill(false));
      });

    await Promise.all(allPromises);
  };

  const handleDeny = async (id: number) => {
    await db.delete(`orgs/${auth.orgId}/adjustmentRequests/${id}`);
    const remainingRequests = requests.filter((request) => request.id !== id);
    setRequests(remainingRequests);

    setIsChecked(Array(remainingRequests.length).fill(false));
  };

  const onClickDashboard = () => {
    router.push(DASHBOARD);
  };

  return (
    <ProtectedRoute>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h3" color="textSecondary" sx={{ my: 4 }}>
          Time Adjustment Requests
        </Typography>
        {/* <Paper
          sx={{
            p: 5,
            border: 2,
            borderColor: theme.BORDER_COLOR,
            bgcolor: theme.HEADER_BACKGROUND_COLOR,
            borderRadius: 2,
            overflowY: "scroll",
            maxHeight: "90%",
            width: "70vw",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        > */}
        {loading ? (
          <CircularProgress />
        ) : requests.length > 0 ? (
          <RequestListItem
            requests={requests}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        ) : (
          <Box
            sx={{
              border: 2,
              bgcolor: "grey.400",
              borderRadius: 2,
              p: 4,
              width: "40vw",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">No Requests at this time.</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onClickDashboard}
              sx={{ mt: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
        )}
        {/* </Paper> */}
      </Box>
    </ProtectedRoute>
  );
};

export default ViewRequestsPage;
