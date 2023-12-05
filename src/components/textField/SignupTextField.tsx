// SignupTextField.tsx
import { Box, FormHelperText, TextField } from "@mui/material";
import { SignupTextFieldProps } from "../../interfaces/interfaces";

const SignupTextField: React.FC<SignupTextFieldProps> = ({
  formik,
  name,
  label,
  type = "text",
  autoComplete,
}) => {
  return (
    <Box>
      <TextField
        fullWidth
        id={name}
        name={name}
        autoComplete={autoComplete}
        label={label}
        type={type}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        margin="normal"
      />
      <FormHelperText
        error={Boolean(formik.touched[name] && formik.errors[name])}
      >
        {formik.touched[name] && formik.errors[name]
          ? formik.errors[name]
          : " "}
      </FormHelperText>
    </Box>
  );
};

export default SignupTextField;
