"use client";
import { Formik, FormikHelpers } from "formik";
import { redirect } from "next/navigation";
import { useSnackbar } from "notistack";
import { useAuthCtx } from "../../../context/AuthContext";
import { LoginFormValues } from "../../../types/initial";
import LoginCard from "./LoginCard";
import validationSchema from "./validation";

const LoginForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { signIn } = useAuthCtx();

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>,
  ) => {
    console.log("IN ON SUBMIT", values.email, values.password);
    try {
      await signIn(values.email, values.password);
      enqueueSnackbar("Successfully logged in!", { variant: "success" });
      redirect("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message, { variant: "error" });
      } else {
        enqueueSnackbar("An unknown error occurred", { variant: "error" });
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => (
        <form onSubmit={formikProps.handleSubmit}>
          <LoginCard formik={formikProps} />
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
