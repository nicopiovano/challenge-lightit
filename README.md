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

## Emails (Mailtrap)

Al crear un paciente se envía un email de bienvenida de forma **asíncrona** mediante un queue worker independiente.

### Configurar Mailtrap

1. Crear cuenta en [mailtrap.io](https://mailtrap.io)
2. Ir a **Email Testing → Inboxes → SMTP Settings**
3. Copiar las credenciales en `backend/.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_username
MAIL_PASSWORD=tu_password
```

4. Levantar el worker:

```bash
docker compose up queue -d
```

## Tests

**Frontend** — Vitest (desde `/frontend`):

```bash
npm test
```

**Backend** — PHPUnit (dentro del container):

```bash
docker exec challenge-lightit-backend-1 php artisan test
```

