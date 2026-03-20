import { useState } from "react";
import PatientCard from "./components/patient-card";
import CreatePatientDialog from "./components/create-patient-dialog";
import AppButton from "./components/app-button";
import { usePatients } from "./hooks/usePatients";
import { createPatient } from "./services/patientsService";
import { getApiOrigin, getApiUrl, getPhotoUrl } from "./types/patient";
import type { CreatePatient } from "./types/patient";

type Toast = {
  open: boolean;
  type: "success" | "error";
  message: string;
};

const apiOrigin = getApiOrigin(getApiUrl());

export default function App() {

  const { patients, loading, error, refresh } = usePatients();
  const [openDialog, setOpenDialog] = useState(false);
  const [toast, setToast] = useState<Toast>({
    open: false,
    type: "success",
    message: "",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 5000);
  };

  const handleCreate = async (formData: CreatePatient) => {
    try {
      await createPatient(formData);
      await refresh();
      showToast("success", "Paciente creado correctamente.");
    } catch (e) {
      showToast(
        "error",
        e instanceof Error ? e.message : "Error al crear el paciente.",
      );
      throw e;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-8 text-zinc-100">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-100">Pacientes</h1>
          <AppButton color="primary" onClick={() => setOpenDialog(true)}>
            Crear
          </AppButton>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        ) : patients.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay pacientes todavía.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                photoUrl={getPhotoUrl(patient.photo, apiOrigin)}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePatientDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onCreate={handleCreate}
      />

      {toast.open && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg px-5 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
