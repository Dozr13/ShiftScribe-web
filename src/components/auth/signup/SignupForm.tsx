"use client";
import {
  Box,
  Button,
  Container,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useSnackbar } from "notistack";
import { signup } from "../../../app/actions/signupActions";
import routes from "../../../utils/routes";
import BackToLandingButton from "../../landing/BackToLandingButton";
import { signupSchema } from "./signup.validation";

interface SignupFormValues {
  organization: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

const SignupForm = () => {
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      organization: "",
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      try {
        const response = await signup(
          values.organization,
          values.email,
          values.password,
          values.displayName,
        );

        if (response.status === "success") {
          enqueueSnackbar("Successfully signed up!", { variant: "success" });

          const result = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });

          if (result && !result.error) {
            window.location.href = routes.dashboard(response.data.endpoint);
          } else {
            enqueueSnackbar(result?.error || "Login failed", {
              variant: "error",
            });
          }
        } else {
          enqueueSnackbar(response.data.message, { variant: "error" });
        }
      } catch (error) {
        console.error("Signup error:", error);
        enqueueSnackbar("An unexpected error occurred", { variant: "error" });
      }
    },
  });

  const renderTextField = (
    name: keyof SignupFormValues,
    label: string,
    type: string = "text",
    autoComplete?: string,
  ) => (
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

  return (
    <Container maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        {renderTextField("organization", "Organization")}
        {renderTextField("email", "Email", "email", "username")}
        {renderTextField("displayName", "Your Name")}
        {renderTextField("password", "Password", "password", "new-password")}
        {renderTextField(
          "confirmPassword",
          "Confirm Password",
          "password",
          "new-password",
        )}
        <Box my={2}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={formik.isSubmitting}
          >
            Sign up
          </Button>
        </Box>
        <BackToLandingButton />
      </form>
    </Container>
  );
};

export default SignupForm;
