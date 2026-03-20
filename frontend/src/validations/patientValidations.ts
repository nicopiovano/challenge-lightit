import type { FormFields } from '../types/patient'

export type { FormFields }

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

const minMax = (min: number, max: number) => (v: string): string | null =>
  v.trim().length < min || v.trim().length > max ? `Entre ${min} y ${max} caracteres.` : null

const validEmail = (v: string): string | null =>
  /^\S+@\S+\.\S+$/.test(v.trim()) ? null : 'Debe ser del tipo email@dominio.com'

const validPhone = (v: string): string | null => {
  const digits = normalizePhone(v)
  return digits.length >= 6 && digits.length <= 12 ? null : 'Entre 6 y 12 dígitos.'
}

const validPrefix = (v: string): string | null =>
  /^\d{2,4}$/.test(v.trim()) ? null : 'Prefijo: 2 a 4 dígitos.'

const fieldRules: Record<keyof FormFields, FieldValidator[]> = {
  name:      [required, noNumbers, minMax(3, 15)],
  last_name: [required, noNumbers, minMax(2, 30)],
  email:     [required, minMax(5, 25), validEmail],
  phone:     [required, validPhone],
  prefix:    [required, validPrefix],
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
  else if (photoFile.size > 2 * 1024 * 1024) errors.photo = 'La imagen debe ser menor a 2MB.'

  return errors
}
