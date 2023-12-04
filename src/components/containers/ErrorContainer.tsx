import { Box, Typography } from "@mui/material";

interface ErrorContainerProps {
  children: React.ReactNode;
}

const ErrorContainer: React.FC<ErrorContainerProps> = ({ children }) => {
  return (
    <Box mt={1}>
      <Typography variant="body2" color="error.main">
        {children}
      </Typography>
    </Box>
  );
};

export default ErrorContainer;
