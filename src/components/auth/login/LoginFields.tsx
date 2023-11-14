import { Box } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import ErrorContainer from "../../containers/ErrorContainer";
import StyledTextField from "../../inputs/StyledTextField";

interface LoginFieldsProps {
  email: string;
  password: string;
}

const LoginFields = ({ email, password }: LoginFieldsProps) => {
  return (
    <Box style={{ width: "97%" }}>
      {/* Email Field */}
      <Field
        as={StyledTextField}
        fullWidth
        id="email"
        name="email"
        type="email"
        label="Email"
        variant="outlined"
        placeholder="example@email.com"
      />
      <ErrorContainer>
        <ErrorMessage name="email" component="div" />
      </ErrorContainer>

      {/* Password Field */}
      <Field
        as={StyledTextField}
        fullWidth
        id="password"
        name="password"
        type="password"
        label="Password"
        variant="outlined"
        placeholder="Enter your password"
      />
      <ErrorContainer>
        <ErrorMessage name="password" component="div" />
      </ErrorContainer>
    </Box>
  );
};

export default LoginFields;
