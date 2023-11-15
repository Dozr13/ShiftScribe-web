import { Typography } from "@mui/material";
import Link from "next/link";
import * as theme from "../../../constants/theme";

const Logo = () => {
  return (
    <Link href="/">
      <Typography
        variant="h6"
        sx={{
          color: theme.TEXT_COLOR,
          "&:hover": { color: theme.ACCENT_COLOR },
          textDecoration: "none",
        }}
      >
        ShiftScribe
      </Typography>
    </Link>
  );
};

export default Logo;
