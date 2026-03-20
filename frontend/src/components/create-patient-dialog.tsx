import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { CreatePatient, FormFields } from "../types/patient";
import {
  EMPTY_FORM,
  normalizePhone,
  validatePatientForm,
} from "../validations/patientValidations";
import AppTextField from "./form-text-field";
import PhoneInput from "./phone-input";
import PhotoDropzone from "./photo-dropzone";
import AppButton from "./app-button";

type FieldConfig = {
  key: keyof FormFields;
  label: string;
  type?: string;
  required?: boolean;
};

const FIELDS: FieldConfig[] = [
  { key: "name",      label: "Nombre",   required: true },
  { key: "last_name", label: "Apellido", required: true },
  { key: "email",     label: "Email",    type: "email", required: true },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreatePatient) => Promise<void>;
};

export default function CreatePatientDialog({ open, onClose, onCreate }: Props) {
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
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
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <Dialog.Title className="mb-4 text-lg font-semibold text-zinc-100">
            Crear paciente
          </Dialog.Title>

          <div className="flex flex-col gap-4">
            {FIELDS.map(({ key, label, type, required }) => (
              <AppTextField
                key={key}
                label={label}
                type={type}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                required={required}
                error={visibleErrors[key]}
              />
            ))}

            <PhoneInput
              prefix={form.prefix}
              phone={form.phone}
              onPrefixChange={(v) => handleChange("prefix", v)}
              onPhoneChange={(v) => handleChange("phone", v)}
              prefixError={visibleErrors.prefix}
              phoneError={visibleErrors.phone}
            />

            <PhotoDropzone
              file={photoFile}
              onChange={handlePhotoChange}
              error={visibleErrors.photo}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <AppButton onClick={onClose} disabled={submitting}>
              Cancelar
            </AppButton>
            <AppButton
              variant="primary"
              onClick={handleSubmit}
              loading={submitting}
              loadingLabel="Creando..."
            >
              Crear
            </AppButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
