import { Box, Button } from "@mui/material";
import Link from "next/link";
import routes from "../../utils/routes";

const Landing = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
      <Link href={routes.signup} passHref>
        <Button variant="contained" color="primary">
          Sign Up
        </Button>
      </Link>
      <Link href={routes.login} passHref>
        <Button variant="contained" color="primary">
          Log In
        </Button>
      </Link>
      <Link href={routes.about} passHref>
        <Button variant="contained" color="primary">
          About
        </Button>
      </Link>
    </Box>
  );
};

export default Landing;
