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
    <Box
      sx={{
        position: "absolute",
        top: 0,
        mt: `calc(10vh)`,
        mx: 20,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" component="h1">
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
