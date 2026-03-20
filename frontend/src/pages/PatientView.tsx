// src/pages/PatientView.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Patient } from "@/interfaces/patient";
import type { PatientNote } from "@/interfaces/patientNote";
import { PatientNoteCard } from "@/components/PatientNoteCard";
import { PatientForm } from "@/components/PatientForm";

const PER_PAGE = 5;

export function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState<PatientNote[]>([]);
  const [page, setPage] = useState(1);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchPatient = () => {
    fetch(`http://localhost:8000/api/v1/patients/${id}`)
      .then((res) => res.json())
      .then((data) => setPatient(data));
  };

  const fetchNotes = () => {
    fetch(`http://localhost:8000/api/v1/patients/${id}/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data));
  };

  useEffect(() => {
    fetchPatient();
    fetchNotes();
  }, [id]);

  const deletePatient = async () => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    await fetch(`http://localhost:8000/api/v1/patients/${id}`, { method: "DELETE" });
    navigate("/patients");
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    await fetch(`http://localhost:8000/api/v1/patients/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: noteText }),
    });
    setNoteText("");
    setShowNoteForm(false);
    fetchNotes();
  };

  const deleteNote = async (noteId: number) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    await fetch(`http://localhost:8000/api/v1/patients/${id}/notes/${noteId}`, { method: "DELETE" });
    fetchNotes();
  };

  if (!patient) return <p className="text-gray-600">Loading...</p>;

  const totalPages = Math.ceil(notes.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visibleNotes = notes.slice(start, start + PER_PAGE);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {patient.first_name} {patient.middle_name} {patient.last_name}
          </h1>
          <p className="text-sm text-gray-600">ID: {patient.id}</p>
          <p className="text-sm text-gray-600">{patient.age} years old</p>
          <p className="text-sm text-gray-600 mb-4">Status: {patient.status}</p>
          <div className="flex gap-3">
            <button onClick={() => setShowEditForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Edit Patient</button>
            <button onClick={deletePatient} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete Patient</button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Patient Summary</h2>
          <p className="text-sm text-gray-500 italic">Summary will be generated here.</p>
        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Patient Notes</h2>
        <button onClick={() => setShowNoteForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add Note</button>
      </div>

      {notes.length === 0 ? (
        <p className="text-center py-8 text-gray-500">Begin adding notes for this patient</p>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleNotes.map((note) => (
            <PatientNoteCard key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:text-gray-400 hover:bg-gray-50">Previous</button>
          <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:text-gray-400 hover:bg-gray-50">Next</button>
        </div>
      )}

      {showNoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowNoteForm(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-md m-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Note</h3>
              <button onClick={() => setShowNoteForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter note..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={addNote} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Save Note</button>
              <button onClick={() => setShowNoteForm(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <PatientForm
          patient={patient}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            fetchPatient();
          }}
        />
      )}
    </div>
  );
}