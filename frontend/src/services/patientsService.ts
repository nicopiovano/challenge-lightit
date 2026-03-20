import type { CreatePatient, Patient } from '../types/patient'
import { apiClient } from './apiClient'
import { endpoints } from './endpoints'

export async function listPatients(): Promise<Patient[]> {
  const json = await apiClient.get<{ data: Patient[] }>(endpoints.patients.list)
  return json.data ?? []
}

export async function createPatient(payload: CreatePatient): Promise<void> {
  const { photoFile, ...fields } = payload
  const formData = new FormData()
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value))
  formData.append('photo', photoFile)

  await apiClient.post(endpoints.patients.create, formData)
}
