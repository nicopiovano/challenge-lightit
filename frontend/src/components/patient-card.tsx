import { useState } from "react";
import type { Patient } from "../types/patient";

type Props = {
  patient: Patient;
  photoUrl: string;
};

export default function PatientCard({ patient, photoUrl }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800"
      >
        <img
          src={photoUrl}
          alt={`${patient.name} ${patient.last_name}`}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-100">
            {patient.name} {patient.last_name}
          </p>
          <p className="text-xs text-zinc-400 truncate">{patient.email}</p>
        </div>
        <svg
          className={`h-4 w-4 text-zinc-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="flex flex-wrap gap-4 border-t border-zinc-800 px-4 py-4">
          <img
            src={photoUrl}
            alt={`${patient.name} ${patient.last_name}`}
            className="h-36 w-36 rounded-lg object-cover"
          />
          <div className="flex flex-col gap-1 text-sm text-zinc-300">
            <p>
              <span className="text-zinc-500">Teléfono: </span>
              {patient.phone}
            </p>
            <p>
              <span className="text-zinc-500">Email: </span>
              {patient.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
