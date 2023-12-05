import { FormikProps } from "formik";

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface OrganizationIDProps {
  orgId: string;
}

export interface SignupTextFieldProps {
  formik: FormikProps<SignupFormValues>;
  name: keyof SignupFormValues;
  label: string;
  type?: string;
  autoComplete?: string;
}

export interface SignupFormValues {
  organization: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}
