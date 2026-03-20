type Props = {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  required?: boolean;
  type?: string;
  fullWidth?: boolean;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  leftAdornment?: React.ReactNode;
  className?: string;
};

export default function AppTextField({
  label,
  value,
  onChange,
  error,
  required,
  type,
  fullWidth = true,
  placeholder,
  inputMode,
  leftAdornment,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : ""} ${className}`}>
      <label className="text-sm text-zinc-400">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      <div
        className={`flex items-center rounded-lg border bg-zinc-900 transition-colors focus-within:border-violet-500 ${
          error ? "border-red-500" : "border-zinc-700"
        }`}
      >
        {leftAdornment && (
          <span className="select-none pl-3 text-zinc-500">{leftAdornment}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputMode={inputMode}
          className="w-full flex-1 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
