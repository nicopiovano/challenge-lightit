import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

type Props = {
  file: File | null;
  onChange: (file: File) => void;
  error?: string;
};

const styles = {
  dropzone: {
    border: "1px dashed",
    borderColor: "divider",
    borderRadius: 2,
    p: 2,
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  previewWrapper: {
    mt: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 160,
  },
  previewImg: {
    width: 160,
    height: 160,
    objectFit: "cover",
    borderRadius: 2,
  },
  error: { mt: 1 },
} as const;

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
    <Box
      sx={styles.dropzone}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handlePick(e.dataTransfer.files?.[0]);
      }}
      role="button"
      tabIndex={0}
    >
      <Typography variant="body1" fontWeight={600}>
        Arrastrar y soltar foto
      </Typography>
      <Typography variant="body2" color="text.secondary">
        o click para seleccionar
      </Typography>

      {previewUrl && (
        <Box sx={styles.previewWrapper}>
          {loading && <CircularProgress size={40} />}
          <Box
            component="img"
            src={previewUrl}
            alt="Vista previa de la foto"
            onLoad={() => setLoading(false)}
            sx={{ ...styles.previewImg, display: loading ? "none" : "block" }}
          />
        </Box>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={styles.error}>
          {error}
        </Typography>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handlePick(e.target.files?.[0])}
      />
    </Box>
  );
}
