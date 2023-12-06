"use client";
import { Box, Button, Container } from "@mui/material";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useSnackbar } from "notistack";
import { signup } from "../../../app/actions/signupActions";
import { SignupFormValues } from "../../../interfaces/interfaces";
import routes from "../../../utils/routes";
import BackToLandingButton from "../../landing/BackToLandingButton";
import SignupTextField from "../../textField/SignupTextField";
import { signupSchema } from "./signup.validation";

// TODO: Implement actions functionality from CreateOrganizationAction and userActions
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

  return (
    <Container maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <SignupTextField
          formik={formik}
          name="organization"
          label="Organization"
        />
        <SignupTextField
          formik={formik}
          name="email"
          label="Email"
          type="email"
          autoComplete="username"
        />
        <SignupTextField formik={formik} name="displayName" label="Your Name" />
        <SignupTextField
          formik={formik}
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
        />
        <SignupTextField
          formik={formik}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
        />

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
