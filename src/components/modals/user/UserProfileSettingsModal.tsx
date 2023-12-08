import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { OrgProfile, UserData } from "../../../../types/data";
import { updateUserProfile } from "../../../app/actions/userActions";
import fetchUserData, {
  determineRoleBasedOnAccessLevel,
  fetchUserAccessLevel,
} from "../../../utils/fetchUserData";

interface UserProfileSettingsModalProps {
  onClose: () => void;
  uid: string;
}

const UserProfileSettingsModal: React.FC<UserProfileSettingsModalProps> = ({
  onClose,
  uid,
}) => {
  const [userData, setUserData] = useState<UserData>({
    displayName: "",
    email: "",
    organization: "",
    darkMode: false,
  });
  const [orgProfile, setOrgProfile] = useState<OrgProfile>({});
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUserData = await fetchUserData(uid);
      if (fetchedUserData) {
        setIsLoading(true);
        setUserData(fetchedUserData);
        setDarkMode(fetchedUserData.darkMode ?? false);

        const accessLevel = await fetchUserAccessLevel(
          fetchedUserData.organization,
          uid,
        );
        setOrgProfile((prevOrgProfile) => ({ ...prevOrgProfile, accessLevel }));
      }
      setIsLoading(false);
    };

    fetchData();
  }, [uid]);

  const role = determineRoleBasedOnAccessLevel(orgProfile.accessLevel!);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
  };

  const handleSubmit = async () => {
    const result = await updateUserProfile(uid, {
      displayName: userData.displayName,
      email: userData.email,
      darkMode: darkMode,
    });

    if (result.success) {
      console.log(result.message);
      onClose();
    } else {
      console.error(result.error);
    }
  };
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box>
      <Typography variant="h6" textAlign="center">
        Edit Profile Settings
      </Typography>
      <TextField
        label="Email"
        name="email"
        type="email"
        value={userData.email}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Name"
        name="displayName"
        value={userData.displayName}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Access Level"
        value={orgProfile.accessLevel ?? "N/A"}
        fullWidth
        disabled
        sx={{ mb: 2 }}
      />
      <TextField label="Role" value={role} fullWidth disabled sx={{ mb: 2 }} />
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={handleDarkModeChange} />}
        label="Dark Mode"
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Update
      </Button>
    </Box>
  );
};

export default UserProfileSettingsModal;
