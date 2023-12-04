import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import {
  ACCENT_COLOR,
  BACKGROUND_COLOR,
  BUTTON_COLOR_TEXT,
  TEXT_COLOR,
} from "../../../constants/colorPalette";
import routes from "../../utils/routes";

const Landing = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: ACCENT_COLOR,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: 2,
          p: 4,
          boxShadow: 3,
          bgcolor: BACKGROUND_COLOR,
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{ fontWeight: "bold", color: TEXT_COLOR }}
        >
          Manage Your Work Schedule Effortlessly
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: TEXT_COLOR }}>
          ShiftScribe simplifies team scheduling and time tracking.
        </Typography>
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {[
            {
              text: "Sign Up",
              href: routes.signup,
              variant: "contained" as const,
            },
            {
              text: "Log In",
              href: routes.login,
              variant: "outlined" as const,
            },
            {
              text: "Learn More",
              href: routes.about,
              variant: "text" as const,
            },
          ].map(({ text, href, variant }) => (
            <Link key={text} href={href} passHref>
              <Button
                variant={variant}
                sx={{
                  bgcolor:
                    variant === "contained" ? ACCENT_COLOR : "transparent",
                  color:
                    variant === "contained" ? BUTTON_COLOR_TEXT : ACCENT_COLOR,
                  "&:hover": {
                    bgcolor:
                      variant === "contained"
                        ? "darken(ACCENT_COLOR, 0.2)"
                        : "rgba(255, 255, 255, 0.1)",
                    color: BUTTON_COLOR_TEXT,
                  },
                  py: 1.5,
                }}
                size="large"
                fullWidth
              >
                {text}
              </Button>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
