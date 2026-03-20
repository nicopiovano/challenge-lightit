import { getApiUrl } from '../types/patient'

const BASE_URL = getApiUrl()

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  })
  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = typeof json?.message === 'string' ? json.message : 'Error en la solicitud'
    throw new Error(message)
  }

  return json as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: FormData | object) => {
    const isFormData = body instanceof FormData
    return request<T>(path, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    })
  },
}
