
import { PatientNote } from "@/interfaces/patientNote";

interface PatientNoteProps {
  note: PatientNote;
  onDelete: (noteId: number) => void;
}

export function PatientNoteCard({ note, onDelete }: PatientNoteProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-900">{note.text}</p>
        <p className="text-xs text-gray-400 mt-1">{new Date(note.timestamp).toLocaleString()}</p>
      </div>
      <button onClick={() => onDelete(note.id)} className="text-red-500 hover:text-red-700 text-sm ml-4">Delete</button>
    </div>
  );
}