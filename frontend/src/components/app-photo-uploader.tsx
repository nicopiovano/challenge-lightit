import { useEffect, useRef, useState } from "react";

type Props = {
  file: File | null;
  onChange: (file: File) => void;
  error?: string;
};

export default function AppPhotoUploader({ file, onChange, error }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setLoading(false);
      return;
    }
    const url = URL.createObjectURL(file);
    setLoading(true);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePick = (picked: File | null | undefined) => {
    if (picked) onChange(picked);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handlePick(e.dataTransfer.files?.[0]);
      }}
      role="button"
      tabIndex={0}
      className="cursor-pointer rounded-lg border border-dashed border-zinc-700 bg-zinc-900 p-4 text-center transition-colors hover:border-violet-500"
    >
      <p className="text-sm font-semibold text-zinc-300">Arrastrar y soltar foto</p>
      <p className="text-xs text-zinc-500">o click para seleccionar</p>

      {previewUrl && (
        <div className="mt-3 flex min-h-40 items-center justify-center">
          {loading && (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-violet-500" />
          )}
          <img
            src={previewUrl}
            alt="Vista previa"
            onLoad={() => setLoading(false)}
            className={`h-40 w-40 rounded-lg object-cover ${loading ? "hidden" : "block"}`}
          />
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handlePick(e.target.files?.[0])}
      />
    </div>
  );
}
