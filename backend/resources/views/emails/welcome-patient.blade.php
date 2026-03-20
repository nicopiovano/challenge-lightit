<!DOCTYPE html>
<html>
<body>
  <h2>Bienvenido/a, {{ $patient->name }} {{ $patient->last_name }}</h2>
  <p>Tu registro fue completado exitosamente.</p>
  <ul>
    <li><strong>Nombre:</strong> {{ $patient->name }} {{ $patient->last_name }}</li>
    <li><strong>Email:</strong> {{ $patient->email }}</li>
    <li><strong>Teléfono:</strong> {{ $patient->phone }}</li>
  </ul>
</body>
</html>
