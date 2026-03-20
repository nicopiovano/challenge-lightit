import AppTextInput from "./app-text-input";

type Props = {
  prefix: string;
  phone: string;
  onPrefixChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  prefixError?: string;
  phoneError?: string;
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
    <div className="flex items-start gap-2">
      <AppTextInput
        label="Prefijo"
        value={prefix}
        onChange={(e) =>
          onPrefixChange(e.target.value.replace(/\D/g, "").slice(0, 4))
        }
        error={prefixError}
        inputMode="numeric"
        fullWidth={false}
        leftAdornment="+"
        className="w-28"
      />
      <AppTextInput
        label="Teléfono"
        placeholder="11-1111-1111"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        required
        error={phoneError}
        inputMode="tel"
      />
    </div>
  );
}
