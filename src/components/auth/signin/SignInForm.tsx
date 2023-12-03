"use client";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { SignInFormValues } from "../../../../types/initial";
import signIn from "../../../services/signin";
import SignInCard from "./SignInCard";
import validationSchema from "./validation";

const SignInForm = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (
    values: SignInFormValues,
    actions: FormikHelpers<SignInFormValues>,
  ) => {
    try {
      await signIn({ email: values.email, password: values.password });
      enqueueSnackbar("Successfully logged in!", { variant: "success" });
      router.push("/");
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
          <SignInCard formik={formikProps} />
        </form>
      )}
    </Formik>
  );
};

export default SignInForm;
