// "use client";
// import { Formik, FormikHelpers } from "formik";
// import { redirect } from "next/navigation";
// import { useSnackbar } from "notistack";
// import { SignInFormValues } from "../../../../types/initial";
// import signIn from "../../../services/signin";
// import routes from "../../../utils/routes";
// import SignInCard from "./SignInCard";
// import validationSchema from "./validation";

// const SignInForm = () => {
//   const { enqueueSnackbar } = useSnackbar();

//   const initialValues = {
//     email: "",
//     password: "",
//   };

//   const onSubmit = async (
//     values: SignInFormValues,
//     actions: FormikHelpers<SignInFormValues>,
//   ) => {
//     try {
//       await signIn({ email: values.email, password: values.password });
//       enqueueSnackbar("Successfully logged in!", { variant: "success" });

//       redirect(routes.home);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         enqueueSnackbar(error.message, { variant: "error" });
//       } else {
//         enqueueSnackbar("An unknown error occurred", { variant: "error" });
//       }
//     } finally {
//       actions.setSubmitting(false);
//     }
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}
//     >
//       {(formikProps) => (
//         <form onSubmit={formikProps.handleSubmit}>
//           <SignInCard formik={formikProps} />
//         </form>
//       )}
//     </Formik>
//   );
// };

// export default SignInForm;

// "use client";
// import { Box, Button, Container, TextField } from "@mui/material";
// import { useFormik } from "formik";
// import { providers, signIn, getSession, csrfToken } from "next-auth/react";
// import { useSnackbar } from "notistack";
// import { signup } from "../../../app/actions/signupActions";
// import routes from "../../../utils/routes";
// import BackToLandingButton from "../../landing/BackToLandingButton";
// import validationSchema from "../signin/validation";

// interface FormValues {
//   email: string;
//   password: string;
// }

// const SignupForm = () => {
//   const { enqueueSnackbar } = useSnackbar();

//   const formik = useFormik<FormValues>({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const response = await signIn(values.email, values.password);

//         if (response.status === "success") {
//           enqueueSnackbar("Successfully signed up!", { variant: "success" });

//           const result = await signIn("credentials", {
//             redirect: false,
//             email: values.email,
//             password: values.password,
//           });

//           if (result && !result.error) {
//             window.location.href = routes.dashboard(response.data.endpoint);
//           } else {
//             enqueueSnackbar(result?.error || "Login failed", {
//               variant: "error",
//             });
//           }
//         } else {
//           enqueueSnackbar(response.data.message, { variant: "error" });
//         }
//       } catch (error) {
//         console.error("Signup error:", error);
//         enqueueSnackbar("An unexpected error occurred", { variant: "error" });
//       }
//     },
//   });

//   const renderTextField = (
//     name: keyof FormValues,
//     label: string,
//     type: string = "text",
//   ) => (
//     <TextField
//       fullWidth
//       id={name}
//       name={name}
//       label={label}
//       type={type}
//       value={formik.values[name]}
//       onChange={formik.handleChange}
//       error={formik.touched[name] && Boolean(formik.errors[name])}
//       helperText={formik.touched[name] && formik.errors[name]}
//       margin="normal"
//     />
//   );

//   return (
//     <Container maxWidth="sm">
//       <form onSubmit={formik.handleSubmit}>
//         {renderTextField("organization", "Organization")}
//         {renderTextField("email", "Email", "email")}
//         {renderTextField("password", "Password", "password")}
//         {renderTextField("confirmPassword", "Confirm Password", "password")}
//         <Box>
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             size="large"
//             disabled={formik.isSubmitting}
//           >
//             Sign up
//           </Button>
//           <BackToLandingButton />
//         </Box>
//       </form>
//     </Container>
//   );
// };

// export default SignupForm;
