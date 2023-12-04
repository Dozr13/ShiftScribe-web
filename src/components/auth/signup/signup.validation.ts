import * as Yup from "yup";
import {
  LOWERCASE_REGEX,
  NUMERIC_REGEX,
  UPPERCASE_REGEX,
} from "../../../../constants/regex";

export const signupSchema = Yup.object().shape({
  organization: Yup.string().required("Organization is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(LOWERCASE_REGEX, "At least one lowercase letter required.")
    .matches(UPPERCASE_REGEX, "At least one uppercase letter required.")
    .matches(NUMERIC_REGEX, "At least one number required.")
    .min(5, "Minimum 5 characters required"),
  confirmPassword: Yup.string()
    .required("Re-enter your password")
    .oneOf([Yup.ref("password")], "Passwords must match."),
  displayName: Yup.string().required("Name is required"),
});
