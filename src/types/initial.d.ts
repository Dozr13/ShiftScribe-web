import { FormikHelpers } from "formik";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginCardProps {
  initialValues: LoginFormValues;
  onSubmit: (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>,
  ) => Promise<void>;
}
