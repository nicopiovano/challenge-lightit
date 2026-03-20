<x-mail::message>
# Bienvenido/a, {{ $patient->name }} {{ $patient->last_name }}

Tu registro fue completado exitosamente.

Estos son tus datos:

- **Nombre:** {{ $patient->name }} {{ $patient->last_name }}
- **Email:** {{ $patient->email }}
- **Teléfono:** {{ $patient->phone }}

Gracias por registrarte.
</x-mail::message>
