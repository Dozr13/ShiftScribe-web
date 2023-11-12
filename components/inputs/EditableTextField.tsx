import { TextField } from "@mui/material";
import React from "react";

interface EditableTextFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditableTextField: React.FC<EditableTextFieldProps> = ({
  value,
  onChange,
}) => {
  return (
    <TextField
      type="text"
      value={value}
      onChange={onChange}
      variant="outlined"
      size="small"
      fullWidth
    />
  );
};

export default EditableTextField;
