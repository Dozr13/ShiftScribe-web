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
import { OrgJob } from "../../types/data";

interface JobModalProps {
  isAddMode: boolean;
  job: OrgJob;
  onSave: (updatedJob: Partial<OrgJob>) => void;
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

const JobModal = ({ isAddMode, job, onSave }: JobModalProps) => {
  const validationSchema = Yup.object().shape({
    jobName: Yup.string().required("Job Name is required"),
    jobNumber: Yup.string().optional(),
    jobAddress: Yup.string().optional(),
  });

  const initialValues = {
    jobName: job.jobName,
    jobNumber: job.jobNumber,
    jobAddress: job.jobAddress,
  };

  return (
    <Box>
      <Typography>
        {isAddMode ? "Add New Job" : `Edit Job: ${job.jobName}`}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const updatedJob = {
            jobName: values.jobName,
            jobNumber: values.jobNumber,
            jobAddress: values.jobAddress,
          };

          onSave(updatedJob);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={2}>
              <FormikTextField
                name="jobName"
                type="text"
                label="Name"
                placeholder="Enter name"
                fullWidth
                margin="normal"
              />
              <FormikTextField
                name="jobNumber"
                type="text"
                label="Number"
                placeholder="Enter number"
                fullWidth
                margin="normal"
              />
              <FormikTextField
                name="jobAddress"
                type="text"
                label="Address"
                placeholder="Enter address"
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
                {isAddMode ? "Add Job" : "Save Changes"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default JobModal;
