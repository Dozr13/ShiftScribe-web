import { Box, Typography } from "@mui/material";
import { ChildrenProps } from "../../interfaces/interfaces";

const ErrorContainer: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <Box mt={1}>
      <Typography variant="body2" color="error.main">
        {children}
      </Typography>
    </Box>
  );
};

export default ErrorContainer;
