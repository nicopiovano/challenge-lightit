import { useMemo, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Container, Snackbar, Typography } from '@mui/material'
import PatientCard from './components/patient-card'
import CreatePatientDialog from './components/create-patient-dialog'
import { usePatients } from './hooks/usePatients'
import { createPatient } from './services/patientsService'
import type { CreatePatient } from './types/patient'
import { getApiOrigin, getApiUrl, getPhotoUrl } from './types/patient'

type SnackbarState = {
  open: boolean
  severity: 'success' | 'error'
  message: string
}

export default function App() {
  const apiUrl = useMemo(() => getApiUrl(), [])
  const apiOrigin = useMemo(() => getApiOrigin(apiUrl), [apiUrl])

  const { patients, loading, error, refresh } = usePatients()
  const [openDialog, setOpenDialog] = useState(false)
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    severity: 'success',
    message: '',
  })

  const handleCreate = async (formData: CreatePatient) => {
    try {
      await createPatient(formData)
      await refresh()
      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Paciente creado correctamente.',
      })
    } catch (e) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: e instanceof Error ? e.message : 'Error al crear el paciente.',
      })
      throw e
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Pacientes
          </Typography>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Crear
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : patients.length === 0 ? (
          <Typography color="text.secondary">No hay pacientes todavía.</Typography>
        ) : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {patients.map((patient) => {
              const photoUrl = getPhotoUrl(patient.photo, apiOrigin)
              return (
                <Box key={patient.id}>
                  <PatientCard patient={patient} photoUrl={photoUrl} />
                </Box>
              )
            })}
          </Box>
        )}
      </Container>

      <CreatePatientDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onCreate={handleCreate}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          sx={{ width: '100%', alignItems: 'center' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
