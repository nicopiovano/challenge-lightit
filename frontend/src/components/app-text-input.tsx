import { TextField } from "@mui/material";

type Props = {
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  type?: string;
  fullWidth?: boolean;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  sx?: object;
  slotProps?: object;
};

export default function AppTextInput({ error, ...props }: Props) {
  return (
    <TextField
      {...props}
      error={Boolean(error)}
      helperText={error}
      fullWidth={props.fullWidth ?? true}
    />
  );
}
