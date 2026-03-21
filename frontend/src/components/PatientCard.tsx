
import { useNavigate } from "react-router-dom";
import type { Patient } from "@/interfaces/patient";

export function PatientCard({ patient }: { patient: Patient }) {
  const navigate = useNavigate();

  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  return (
    <div
      onClick={() => navigate(`/patients/${patient.id}`)}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
    >
      <div>
        <h3 className="font-bold text-gray-900">
          {patient.first_name} {patient.middle_name ? `${patient.middle_name} ` : ""}{patient.last_name}
        </h3>
        <p className="text-sm text-gray-600">{patient.age} years old</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          {patient.last_visit
            ? `Last visit: ${new Date(patient.last_visit).toLocaleDateString()}`
            : "No visits yet"}
        </span>
        <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${statusColors[patient.status]}`}>
          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
        </span>
      </div>
    </div>
  );
}