import { Box, Button, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import { ACCENT_COLOR } from "../../../constants/colorPalette";

const Denied = () => {
  return (
    <Box textAlign="center" sx={{ marginTop: 3 }}>
      <Typography variant="h6" color={ACCENT_COLOR} gutterBottom>
        Insufficient permissions to access this page.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={redirect("/denied")}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Denied;
