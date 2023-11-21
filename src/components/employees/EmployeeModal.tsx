"use client";
import {
  Box,
  Button,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { FieldHookConfig, Form, Formik, useField } from "formik";
import * as Yup from "yup";
import { Employee } from "../../types/data";

interface EmployeeModalProps {
  onSave: (updatedEmployee: Employee) => void;
  employee: Employee;
}

type FormikTextFieldProps = FieldHookConfig<string> & TextFieldProps;

const FormikTextField = (props: FormikTextFieldProps) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      {...field}
      {...props}
      helperText={errorText}
      error={!!errorText}
    />
  );
};

const EmployeeModal = ({ employee, onSave }: EmployeeModalProps) => {
  const validationSchema = Yup.object().shape({
    displayName: Yup.string().required("Employee Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    accessLevel: Yup.number()
      .required("Access Level is required")
      .min(0, "Access Level must be between 0 and 4")
      .max(4, "Access Level must be between 0 and 4"),
  });

  const initialValues = {
    displayName: employee?.userData?.displayName,
    email: employee?.userData?.email,
    organization: employee?.userData?.organization,
    accessLevel: employee?.accessLevel,
  };

  console.log(initialValues);
  return (
    <Box>
      <Typography>Edit information for {initialValues.displayName}</Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const updatedEmployee: Employee = {
            ...employee,
            userData: {
              displayName: values.displayName,
              email: values.email,
              organization: values.organization,
            },
            accessLevel: values.accessLevel,
          };

          console.log("Submitting updated employee:", updatedEmployee);
          onSave(updatedEmployee);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={2}>
              <FormikTextField
                name="displayName"
                type="text"
                label="Name"
                placeholder="Enter name"
                fullWidth
                margin="normal"
              />
              <FormikTextField
                name="email"
                type="email"
                label="Email"
                placeholder="Enter email"
                fullWidth
                margin="normal"
              />
              {/* Assuming organization is not editable */}
              <FormikTextField
                name="organization"
                type="text"
                label="Organization"
                placeholder="Enter organization"
                fullWidth
                margin="normal"
                disabled
              />
              <FormikTextField
                name="accessLevel"
                type="number"
                label="Access Level"
                placeholder="Enter access level"
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
              >
                Save Changes
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EmployeeModal;
