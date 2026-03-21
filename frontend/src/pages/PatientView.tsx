// src/pages/PatientView.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { PatientNoteCard } from "@/components/PatientNoteCard";
import { PatientForm } from "@/components/PatientForm";
import { usePatient, usePatientNotes, usePatientSummary } from "@/hooks/usePatientView";
import { createPatientNote, deletePatientById, deletePatientNote } from "@/services/patientService";
import { getErrorMessage } from "@/services/apiClient";

export function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState("");
  const wasInView = useRef(false);
  const { ref, inView } = useInView({ rootMargin: "200px" });
  const action = searchParams.get("action");
  const showEditForm = action === "edit";
  const showNoteForm = action === "add-note";
  const showDeleteModal = action === "delete";

  const { data: patient, refetch: refetchPatient } = usePatient(id);
  const { data: patientSummary, refetch: refetchSummary, isLoading: isLoadingSummary } = usePatientSummary(id);

  const {
    notes,
    isLoading: isLoadingNotes,
    isError: notesError,
    errorMessage: notesErrorMessage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePatientNotes(id);

  useEffect(() => {
    const enteredView = inView && !wasInView.current;
    if (enteredView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    wasInView.current = inView;
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const addNote = async () => {
    if (!noteText.trim()) {
      setNoteError("Note text cannot be empty.");
      return;
    }

    setNoteError("");
    if (!id) return;

    try {
      await createPatientNote(id, noteText);
    } catch (error) {
      setNoteError(getErrorMessage(error, "Could not save note. Please try again."));
      return;
    }

    setNoteText("");
    setSearchParams({});
    queryClient.invalidateQueries({ queryKey: ["patient-notes", id] });
  };

  const deleteNote = async (noteId: number) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    if (!id) return;
    try {
      await deletePatientNote(id, noteId);
    } catch (error) {
      setNoteError(getErrorMessage(error, "Failed to delete note"));
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["patient-notes", id] });
  };

  if (!patient) return <p className="text-gray-600">Loading...</p>;

  const allergies = patientSummary?.allergies.map((item) => item.allergy_name) ?? [];
  const conditions = patientSummary?.conditions.map((item) => item.condition_name) ?? [];
  const fullName = patientSummary?.full_name || `${patient.first_name} ${patient.middle_name ?? ""} ${patient.last_name}`.trim();
  const age = patientSummary?.age ?? patient.age;
  const bloodType = patientSummary?.bloodtype ?? "Unknown";
  const narrativeSummary = isLoadingSummary
    ? "Generating summary..."
    : patientSummary?.summary || "Summary will be generated here.";

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Patient Summary</h1>

        <div className="space-y-1 mb-4">
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Name:</span> {fullName}</p>
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Age:</span> {age}</p>
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Blood Type:</span> {bloodType}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-1">Summary</h2>
          <p className="text-sm text-gray-700">{narrativeSummary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Allergies</h3>
            <p className="text-sm text-gray-600">{allergies.length ? allergies.join(", ") : "None"}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Conditions</h3>
            <p className="text-sm text-gray-600">{conditions.length ? conditions.join(", ") : "None"}</p>
          </div>
        </div>

      </div>

      <hr className="border-gray-200 mb-6" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Patient Notes</h2>
      </div>

      {notesError ? (
        <p className="text-center py-8 text-red-600">{notesErrorMessage}</p>
      ) : notes.length === 0 && !isLoadingNotes ? (
        <p className="text-center py-8 text-gray-500">Begin adding notes for this patient</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((note) => (
            <PatientNoteCard key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      )}

      <div ref={ref} className="h-6" />
      {isFetchingNextPage && <p className="text-center mt-4 text-gray-600">Loading more notes...</p>}

      {showNoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              setNoteError("");
              setSearchParams({});
            }}
          />
          <div className="relative bg-white rounded-lg w-full max-w-md m-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Note</h3>
              <button
                onClick={() => {
                  setNoteError("");
                  setSearchParams({});
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            {noteError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-sm">
                {noteError}
              </div>
            )}
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter note..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={addNote} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Save Note</button>
              <button onClick={() => {
                setNoteError("");
                setSearchParams({});
              }} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <PatientForm
          patient={patient}
          onClose={() => {
            setSearchParams({});
          }}
          onSuccess={() => {
            setSearchParams({});
            refetchPatient();
            refetchSummary();
          }}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSearchParams({})} />
          <div className="relative bg-white rounded-lg w-full max-w-md m-4 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Patient</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this patient?</p>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (!id) {
                    setSearchParams({});
                    return;
                  }
                  await deletePatientById(id);
                  navigate("/patients");
                }}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setSearchParams({})}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}