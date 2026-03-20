import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import type { CreatePatient } from "../types/patient";
import {
  type FormFields,
  EMPTY_FORM,
  normalizePhone,
  validatePatientForm,
} from "../validations/patientValidations";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreatePatient) => Promise<void>;
};

export default function CreatePatientDialog({
  open,
  onClose,
  onCreate,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const errors = useMemo(
    () => validatePatientForm(form, photoFile),
    [form, photoFile],
  );
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([key]) => touched.has(key)),
  );

  const handleChange = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => new Set(prev).add(field));
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setTouched(new Set());
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!open) {
      reset();
      setPhotoPreviewUrl(null);
    }
  }, [open]);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl(null);
      setPhotoLoading(false);
      return;
    }

    const url = URL.createObjectURL(photoFile);
    setPhotoLoading(true);
    setPhotoPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const handlePickFile = (file: File | null | undefined) => {
    if (!file) return;
    setPhotoFile(file);
    setTouched((prev) => new Set(prev).add("photo"));
  };

  const handleSubmit = async () => {
    if (Object.keys(errors).length > 0) {
      setTouched(new Set(Object.keys(errors)));
      return;
    }
    if (!photoFile) return;

    setSubmitting(true);
    try {
      await onCreate({
        name: form.name,
        last_name: form.last_name,
        email: form.email,
        phone: `+${form.prefix}${normalizePhone(form.phone)}`,
        photoFile,
      });
      onClose();
    } catch {
      // El snackbar del App se encarga del mensaje.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear paciente</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            error={Boolean(visibleErrors.name)}
            helperText={visibleErrors.name}
            fullWidth
          />
          <TextField
            label="Apellido"
            value={form.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            required
            error={Boolean(visibleErrors.last_name)}
            helperText={visibleErrors.last_name}
            fullWidth
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            error={Boolean(visibleErrors.email)}
            helperText={visibleErrors.email}
            fullWidth
            type="email"
          />
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            <TextField
              label="Prefijo"
              value={form.prefix}
              onChange={(e) =>
                handleChange(
                  "prefix",
                  e.target.value.replace(/\D/g, "").slice(0, 4),
                )
              }
              error={Boolean(visibleErrors.prefix)}
              helperText={visibleErrors.prefix}
              inputMode="numeric"
              sx={{ width: 110 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">+</InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Teléfono"
              placeholder="11-1111-1111"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
              error={Boolean(visibleErrors.phone)}
              helperText={visibleErrors.phone}
              fullWidth
              inputMode="tel"
            />
          </Box>

          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              handlePickFile(file);
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

            {photoPreviewUrl ? (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 160,
                }}
              >
                {photoLoading && <CircularProgress size={40} />}
                <Box
                  component="img"
                  src={photoPreviewUrl}
                  alt="Vista previa de la foto"
                  onLoad={() => setPhotoLoading(false)}
                  sx={{
                    width: 160,
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 2,
                    display: photoLoading ? "none" : "block",
                  }}
                />
              </Box>
            ) : null}

            {visibleErrors.photo ? (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {visibleErrors.photo}
              </Typography>
            ) : null}
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handlePickFile(e.target.files?.[0])}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {submitting ? "Creando..." : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
