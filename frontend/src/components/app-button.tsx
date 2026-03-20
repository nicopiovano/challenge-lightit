import { Button } from "@mui/material";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "text" | "contained" | "outlined";
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

export default function AppButton({
  children,
  onClick,
  variant = "text",
  disabled = false,
  loading = false,
  loadingLabel,
}: Props) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && loadingLabel ? loadingLabel : children}
    </Button>
  );
}
