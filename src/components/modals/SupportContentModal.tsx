import { Box, Button, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

const SupportContentModal = () => {
  const { enqueueSnackbar } = useSnackbar();
  const email = "wade.pate@bytesmithcode.com";

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(email).then(() => {
      enqueueSnackbar("Email copied to clipboard!", { variant: "success" });
    });
  };

  return (
    <Box>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Need Help?
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        If you encounter any issues or have any questions, please feel free to
        reach out to our support team.
        <br />
        <br />
        You can contact me at:
        <br />
        <Button onClick={handleCopyToClipboard}>{email}</Button>
        <br />
        <br />
        We&apos;re here to help!
      </Typography>
    </Box>
  );
};

export default SupportContentModal;
