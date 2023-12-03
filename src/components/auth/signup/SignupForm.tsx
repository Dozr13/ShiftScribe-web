"use client";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { signup } from "../../../app/actions/signupActions";
import routes from "../../../utils/routes";
import validationSchema from "../signin/validation";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  organization: string;
}

const SignupForm = () => {
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      organization: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await signup(
          values.email,
          values.password,
          values.organization,
          values.email,
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
    name: keyof FormValues,
    label: string,
    type: string = "text",
  ) => (
    <TextField
      fullWidth
      id={name}
      name={name}
      label={label}
      type={type}
      value={formik.values[name]}
      onChange={formik.handleChange}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      margin="normal"
    />
  );

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        {renderTextField("organization", "Organization")}
        {renderTextField("email", "Email", "email")}
        {renderTextField("password", "Password", "password")}
        {renderTextField("confirmPassword", "Confirm Password", "password")}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={formik.isSubmitting}
        >
          Sign up
        </Button>
      </form>
      <Button
        variant="outlined"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Link href="/">Back to Intro</Link>
      </Button>
    </Container>
  );
};

export default SignupForm;
