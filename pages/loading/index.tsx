import { Box } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box className="fixed top-0 left-0 w-full h-full bg-slate-950 flex justify-center items-center z-50">
      <Box className="animate-spin-slow border-t-4 border-blue-500 h-12 w-12 rounded-full ease-linear"></Box>
    </Box>
  );
};

export default LoadingScreen;
