import { describe, it, expect } from 'vitest'
import { normalizePhone, validatePatientForm, EMPTY_FORM } from './patientValidations'

const validForm = {
  name: 'Juan',
  last_name: 'Pérez',
  email: 'juan@example.com',
  phone: '11-1234-5678',
  prefix: '54',
}

const mockPhoto = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })

// --- normalizePhone ---

describe('normalizePhone', () => {
  it('elimina espacios y guiones', () => {
    expect(normalizePhone('11 1234-5678')).toBe('1112345678')
  })

  it('no modifica un número limpio', () => {
    expect(normalizePhone('1112345678')).toBe('1112345678')
  })

  it('elimina espacios al inicio y al final', () => {
    expect(normalizePhone('  1112345678  ')).toBe('1112345678')
  })
})

// --- validatePatientForm ---

describe('validatePatientForm', () => {
  it('no retorna errores con datos válidos', () => {
    const errors = validatePatientForm(validForm, mockPhoto)
    expect(errors).toEqual({})
  })

  it('retorna error si falta el nombre', () => {
    const errors = validatePatientForm({ ...validForm, name: '' }, mockPhoto)
    expect(errors.name).toBeDefined()
  })

  it('retorna error si el nombre tiene números', () => {
    const errors = validatePatientForm({ ...validForm, name: 'Juan123' }, mockPhoto)
    expect(errors.name).toBeDefined()
  })

  it('retorna error si el email es inválido', () => {
    const errors = validatePatientForm({ ...validForm, email: 'no-es-email' }, mockPhoto)
    expect(errors.email).toBeDefined()
  })

  it('retorna error si el teléfono no tiene 10 dígitos', () => {
    const errors = validatePatientForm({ ...validForm, phone: '12345' }, mockPhoto)
    expect(errors.phone).toBeDefined()
  })

  it('retorna error si el prefijo tiene menos de 2 dígitos', () => {
    const errors = validatePatientForm({ ...validForm, prefix: '5' }, mockPhoto)
    expect(errors.prefix).toBeDefined()
  })

  it('retorna error si no hay foto', () => {
    const errors = validatePatientForm(validForm, null)
    expect(errors.photo).toBeDefined()
  })

  it('retorna todos los errores con el form vacío', () => {
    const errors = validatePatientForm(EMPTY_FORM, null)
    expect(Object.keys(errors).length).toBeGreaterThan(0)
  })
})
