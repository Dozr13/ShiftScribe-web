import {
  Box,
  Button,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { FieldHookConfig, Form, Formik, useField } from "formik";
import { UpdatableEmployeeUserData } from "./EmployeeGrid";

interface EmployeeModalProps {
  employee: UpdatableEmployeeUserData | null;
  onSave: () => void;
  onEdit: (id: string, data: any) => Promise<void>;
  onUpdated: () => Promise<void>;
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

const EmployeeModal = ({
  employee,
  onSave,
  onEdit,
  onUpdated,
}: EmployeeModalProps) => {
  console.log("EMPLOYEE", employee);
  console.log("userData.displayName", employee?.displayName);
  return (
    <Box>
      <Typography>Edit information for {employee?.displayName}</Typography>
      <Formik
        initialValues={{
          displayName: employee?.displayName ?? "",
          email: employee?.email || "",
          accessLevel: employee?.accessLevel || "",
        }}
        onSubmit={async (values) => {
          if (employee) {
            await onEdit(employee.id, values);
          }
          onSave();
          onUpdated();
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
