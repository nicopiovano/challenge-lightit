export type FormFields = {
  name: string
  last_name: string
  email: string
  phone: string
  prefix: string
}

export const EMPTY_FORM: FormFields = {
  name: '',
  last_name: '',
  email: '',
  phone: '',
  prefix: '54',
}

export const normalizePhone = (value: string): string =>
  value.trim().replace(/[\s-]/g, '')

type FieldValidator = (value: string) => string | null

const required = (v: string): string | null =>
  v.trim() ? null : 'Requerido.'

const noNumbers = (v: string): string | null =>
  /\d/.test(v) ? 'No puede contener números.' : null

const validEmail = (v: string): string | null =>
  /^\S+@\S+\.\S+$/.test(v.trim()) ? null : 'Debe ser del tipo email@dominio.com'

const validPhone = (v: string): string | null =>
  /^\d{10}$/.test(normalizePhone(v)) ? null : 'Debe tener exactamente 10 dígitos.'

const validPrefix = (v: string): string | null =>
  /^\d{2,4}$/.test(v.trim()) ? null : 'Prefijo: 2 a 4 dígitos.'

const fieldRules: Record<keyof FormFields, FieldValidator[]> = {
  name: [required, noNumbers],
  last_name: [required, noNumbers],
  email: [required, validEmail],
  phone: [required, validPhone],
  prefix: [required, validPrefix],
}

export function validatePatientForm(
  form: FormFields,
  photoFile: File | null,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const [field, validators] of Object.entries(fieldRules)) {
    for (const validate of validators) {
      const error = validate(form[field as keyof FormFields])
      if (error) {
        errors[field] = error
        break
      }
    }
  }

  if (!photoFile) errors.photo = 'Foto requerida.'

  return errors
}
