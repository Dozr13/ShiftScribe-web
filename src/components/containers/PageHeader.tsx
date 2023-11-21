import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  mainMessage: string;
  secondaryMessage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  mainMessage,
  secondaryMessage,
}) => {
  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography variant="h3" component="h1">
        {mainMessage}
      </Typography>
      {secondaryMessage && (
        <Typography variant="h5" component="h2">
          {secondaryMessage}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;
