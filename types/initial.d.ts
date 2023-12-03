import { FormikHelpers } from "formik";

export interface SignInFormValues {
  email: string;
  password: string;
}

export interface SignInCardProps {
  initialValues: SignInFormValues;
  onSubmit: (
    values: SignInFormValues,
    { setSubmitting }: FormikHelpers<SignInFormValues>,
  ) => Promise<void>;
}
