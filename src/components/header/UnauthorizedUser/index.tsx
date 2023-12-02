import { Box } from "@mui/material";
import IntroAppBar from "./IntroAppBar";
import IntroSideBar from "./IntroSideBar";

const IntroWrapper = () => {
  return (
    <Box>
      <IntroAppBar />
      <IntroSideBar />
    </Box>
  );
};

export default IntroWrapper;
