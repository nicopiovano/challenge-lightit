import { getApiUrl } from '../types/patient'

const BASE_URL = getApiUrl()

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  })
  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    const fieldErrors = json?.errors
    if (fieldErrors && typeof fieldErrors === 'object') {
      const first = Object.values(fieldErrors as Record<string, string[]>)[0]
      if (Array.isArray(first) && first.length > 0) {
        throw new Error(first[0])
      }
    }
    const message = typeof json?.message === 'string' ? json.message : 'Error en la solicitud'
    throw new Error(message)
  }

  return json
}

export const apiClient = {
  get: (path: string) => request(path),
  post: (path: string, body: FormData | object) => {
    const isFormData = body instanceof FormData
    return request(path, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    })
  },
}
