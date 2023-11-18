import { TextField } from "@mui/material";
import grey from "@mui/material/colors/grey";
import { styled } from "@mui/system";

const defaultColor = grey[500];

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: defaultColor,
    },
  },
  "& .MuiInputLabel-outlined": {
    "&.Mui-focused": {
      color: defaultColor,
    },
  },
});

export default StyledTextField;
