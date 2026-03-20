//Obj que viene del back
export type Patient = {
  id: number
  name: string
  last_name: string
  email: string
  phone: string
  photo: string
}

//Obj que se envia al back
export type CreatePatient = {
  name: string
  last_name: string
  email: string
  phone: string
  photoFile: File
}

export const getApiUrl = (): string =>
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export const getApiOrigin = (apiUrl: string): string => new URL(apiUrl).origin

export const getPhotoUrl = (photo: string, apiOrigin: string): string =>
  photo.startsWith('http') ? photo : `${apiOrigin}${photo}`

