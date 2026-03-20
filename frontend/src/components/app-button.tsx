type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  color?: "primary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

const colors = {
  primary: "bg-violet-600 text-white hover:bg-violet-700",
  ghost: "text-zinc-300 hover:bg-zinc-800",
};

export default function AppButton({
  children,
  onClick,
  type = "button",
  color = "ghost",
  disabled = false,
  loading = false,
  loadingLabel,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${colors[color]}`}
    >
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
