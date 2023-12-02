"use client";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { signup } from "../../../app/actions/signupActions";
import validationSchema from "../signin/validation";

const SignupForm = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    console.log("IN SIGNUP FORM");
  }, []);

  const formik = useFormik({
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
          // Perform any additional actions like redirection or state updates
        } else {
          enqueueSnackbar(response.data.message, { variant: "error" });
        }
      } catch (error) {
        enqueueSnackbar("An unexpected error occurred", { variant: "error" });
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <TextField
          fullWidth
          id="organization"
          name="organization"
          label="Organization"
          value={formik.values.organization}
          onChange={formik.handleChange}
          error={
            formik.touched.organization && Boolean(formik.errors.organization)
          }
          helperText={formik.touched.organization && formik.errors.organization}
          margin="normal"
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />
        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          margin="normal"
        />
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
