import AppTextField from "./form-text-field";

type Props = {
  prefix: string;
  phone: string;
  onPrefixChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  prefixError?: string;
  phoneError?: string;
};

export default function PhoneInput({
  prefix,
  phone,
  onPrefixChange,
  onPhoneChange,
  prefixError,
  phoneError,
}: Props) {
  return (
    <div className="flex gap-2 items-start">
      <AppTextField
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
      <AppTextField
        label="Teléfono"
        placeholder="11-1234-5678"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        required
        error={phoneError}
        inputMode="tel"
      />
    </div>
  );
}
