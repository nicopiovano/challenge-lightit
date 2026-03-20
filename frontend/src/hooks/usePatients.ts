import { useCallback, useEffect, useState } from 'react'
import type { Patient } from '../types/patient'
import { listPatients } from '../services/patientsService'

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listPatients()
      setPatients(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar pacientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { patients, loading, error, refresh }
}

