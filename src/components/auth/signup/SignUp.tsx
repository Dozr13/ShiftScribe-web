"use client";
import signUp from "@/services/signup";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import Link from "next/link";
import validationSchema from "../signin/validation";

// // Validation schema
// const validationSchema = yup.object({
//   email: yup
//     .string()
//     .email('Invalid email format')
//     .required('Email is required'),
//   password: yup
//     .string()
//     .required('Password is required')
//     .min(8, 'Password should be of minimum 8 characters length'),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref('password'), null], 'Passwords must match')
//     .required('Confirm password is required'),
//   organization: yup
//     .string()
//     .required('Organization is required')
// });

const SignupForm = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      organization: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      signUp(values);
      console.log("Form values:", values);
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
