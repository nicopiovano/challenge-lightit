import { useMemo, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AppButton from "./app-button";
import type { CreatePatient } from "../types/patient";
import {
  type FormFields,
  normalizePhone,
  validatePatientForm,
  EMPTY_FORM,
} from "../validations/patientValidations";
import AppTextInput from "./app-text-input";
import AppPhoneInput from "./app-phone-input";
import AppPhotoUploader from "./app-photo-uploader";

type FieldConfig = {
  key: keyof FormFields;
  label: string;
  type?: string;
  required?: boolean;
};

const FIELDS: FieldConfig[] = [
  { key: "name", label: "Nombre", required: true },
  { key: "last_name", label: "Apellido", required: true },
  { key: "email", label: "Email", type: "email", required: true },
];

const styles = {
  form: { display: "flex", flexDirection: "column", gap: 2, mt: 1 },
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (nvoPaciente: CreatePatient) => Promise<void>;
};

export default function CreatePatientDialog({
  open,
  onClose,
  onCreate,
}: Props) {
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Valido los campos que se han tocado para mostrar los errores
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

  const handlePhotoChange = (file: File) => {
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
    <Dialog
      open={open}
      onClose={onClose}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Crear paciente</DialogTitle>
      <DialogContent>
        <Box sx={styles.form}>
          {FIELDS.map(({ key, label, type, required }) => (
            <AppTextInput
              key={key}
              label={label}
              type={type}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              required={required}
              error={visibleErrors[key]}
            />
          ))}

          <AppPhoneInput
            prefix={form.prefix}
            phone={form.phone}
            onPrefixChange={(v) => handleChange("prefix", v)}
            onPhoneChange={(v) => handleChange("phone", v)}
            prefixError={visibleErrors.prefix}
            phoneError={visibleErrors.phone}
          />

          <AppPhotoUploader
            file={photoFile}
            onChange={handlePhotoChange}
            error={visibleErrors.photo}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <AppButton onClick={onClose} disabled={submitting}>
          Cancelar
        </AppButton>
        <AppButton
          variant="contained"
          onClick={handleSubmit}
          loading={submitting}
          loadingLabel="Creando..."
        >
          Crear
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
