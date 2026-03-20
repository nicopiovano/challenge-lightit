import { Box, InputAdornment } from "@mui/material";
import TextFieldApp from "./app-text-input";

type Props = {
  prefix: string;
  phone: string;
  onPrefixChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  prefixError?: string;
  phoneError?: string;
};

const styles = {
  row: { display: "flex", gap: 1, alignItems: "flex-start" },
  prefix: { width: 110 },
} as const;

const prefixSlotProps = {
  input: {
    startAdornment: <InputAdornment position="start">+</InputAdornment>,
  },
};

export default function AppPhoneInput({
  prefix,
  phone,
  onPrefixChange,
  onPhoneChange,
  prefixError,
  phoneError,
}: Props) {
  return (
    <Box sx={styles.row}>
      <TextFieldApp
        label="Prefijo"
        value={prefix}
        onChange={(e) =>
          onPrefixChange(e.target.value.replace(/\D/g, "").slice(0, 4))
        }
        error={prefixError}
        inputMode="numeric"
        fullWidth={false}
        sx={styles.prefix}
        slotProps={prefixSlotProps}
      />
      <TextFieldApp
        label="Teléfono"
        placeholder="11-1111-1111"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        required
        error={phoneError}
        inputMode="tel"
      />
    </Box>
  );
}
