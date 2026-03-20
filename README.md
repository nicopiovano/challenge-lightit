# Challenge Lightit (Fullstack)

Stack: React (TypeScript + MUI) + Laravel (API) + PostgreSQL.

## Levantar con Docker

1. Construir y ejecutar:
   ```sh
   docker compose up --build
   ```
2. Frontend: `http://localhost:5173`
3. Backend API: `http://localhost:8000/api/patients`

## Endpoints

- `GET /api/patients` -> listar pacientes
- `POST /api/patients` -> crear paciente (envía `multipart/form-data` con `photo`)

Los uploads de foto quedan en `backend/storage/app/public/patient-photos` y se sirven vía `/storage/...`.

