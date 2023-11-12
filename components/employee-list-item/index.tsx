import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/FirebaseContext";

import {
  faCancel,
  faEdit,
  faSave,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import * as theme from "../../constants/theme";
import { EMAIL_REGEX } from "../../utils/constants/regex.constants";
import { showToast } from "../../utils/toast";

export interface Employee {
  id: string;
  accessLevel: number;
  userData: {
    displayName: string;
    email: string;
    organization: string;
  } | null;
}

interface EmployeeListItemProps {
  employee: Employee;
  onDelete: (employeeId: string) => void;
}

const EmployeeListItem: React.FC<EmployeeListItemProps> = ({
  employee,
  onDelete,
}) => {
  const auth = useAuth();
  const db = useFirebase();

  const { id, accessLevel, userData } = employee;

  const { displayName = "", email = "", organization = "" } = userData || {};

  const isCurrentUser = !!auth.user && auth.user.uid === id;

  const [editing, setEditing] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [employeeName, setEmployeeName] = useState(displayName);
  const [employeeEmail, setEmployeeEmail] = useState(email);
  const [employeeOrg, setEmployeeOrg] = useState(organization);
  const [employeeAccessLevel, setEmployeeAccessLevel] =
    useState<number>(accessLevel);

  useEffect(() => {
    setIsValidEmail(
      (employeeEmail || "").trim() === ""
        ? true
        : (employeeEmail || "").match(EMAIL_REGEX) !== null,
    );
  }, [employeeEmail, editing]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (employeeName.trim() === "")
      return showToast("Employee Name cannot be empty", false);
    if (employeeEmail.trim() === "")
      return showToast("Employee Email cannot be empty", false);
    if (!isValidEmail) return showToast("Please enter a valid email", false);

    const accessLevelNumber = employeeAccessLevel;

    if (
      isNaN(accessLevelNumber) ||
      accessLevelNumber < 1 ||
      accessLevelNumber > 4
    ) {
      return showToast("Access level must be a number between 1 and 4", false);
    }

    await db.update(`orgs/${auth.orgId}/members/${employee.id}`, {
      accessLevel: accessLevelNumber,
    });

    await db.update(`users/${employee.id}`, {
      displayName: employeeName,
      email: employeeEmail,
      organization: employeeOrg,
    });

    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(employee.id);
  };

  function handleCancel(): void {
    setEditing(false);
  }

  const handleEmployeeAccessLevelChange = (value: string) => {
    if (value === "") {
      setEmployeeAccessLevel(0);
      return;
    }

    const parsedValue = parseInt(value, 10);

    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 4) {
      setEmployeeAccessLevel(parsedValue);
    } else {
      showToast("Access level must be a number between 1 and 4", false);
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      spacing={2}
      sx={{ borderBottom: 2, borderColor: theme.BORDER_COLOR, py: 2 }}
    >
      {editing ? (
        <>
          <Grid
            item
            xs={2.4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <TextField
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid
            item
            xs={2.4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <TextField
              type="email"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              variant="outlined"
              size="small"
              error={!isValidEmail || employeeEmail.trim() === ""}
            />
          </Grid>
          <Grid
            item
            xs={2.4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <TextField
              type="text"
              value={employeeOrg}
              onChange={(e) => setEmployeeOrg(e.target.value)}
              variant="outlined"
              size="small"
              disabled
            />
          </Grid>
          <Grid
            item
            xs={2.4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <TextField
              type="number"
              value={employeeAccessLevel.toString()}
              onChange={(e) => handleEmployeeAccessLevelChange(e.target.value)}
              variant="outlined"
              size="small"
              disabled={isCurrentUser}
              InputProps={{ inputProps: { min: 1, max: 4 } }}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid
            item
            xs={2.4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Typography sx={{ color: theme.TEXT_COLOR }}>
              {employeeName}
            </Typography>
          </Grid>
          <Grid
            item
            xs={2.4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Typography sx={{ color: theme.TEXT_COLOR }}>
              {employeeEmail}
            </Typography>
          </Grid>
          <Grid
            item
            xs={2.4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Typography sx={{ color: theme.TEXT_COLOR }}>
              {employeeOrg}
            </Typography>
          </Grid>
          <Grid
            item
            xs={2.4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Typography sx={{ color: theme.TEXT_COLOR }}>
              {employeeAccessLevel}
            </Typography>
          </Grid>
        </>
      )}
      <Grid item xs={2.4} sx={{ display: "flex", justifyContent: "center" }}>
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

export default EmployeeListItem;
