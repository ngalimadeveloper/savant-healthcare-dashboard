
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { PatientNoteCard } from "@/components/PatientNoteCard";
import { PatientForm } from "@/components/PatientForm";
import { ConfirmModal } from "@/components/ConfirmModal";
import { NoteForm } from "@/components/NoteForm";
import { usePatient, usePatientNotes, usePatientSummary } from "@/hooks/usePatientView";
import { useAddPatientNote, useDeletePatientNote, useDeletePatient } from "@/hooks/usePatientMutations";

export function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const { ref, inView } = useInView({ rootMargin: "200px" });
  const action = searchParams.get("action");
  const showEditForm = action === "edit";
  const showNoteForm = action === "add-note";
  const showDeleteModal = action === "delete";

  const addNoteMutation = useAddPatientNote(id ?? "");
  const deleteNoteMutation = useDeletePatientNote(id ?? "");
  const deletePatientMutation = useDeletePatient();

  const { data: patient } = usePatient(id);
  const { data: patientSummary, isLoading: isLoadingSummary } = usePatientSummary(id);

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
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const addNote = async (text: string) => {
    await addNoteMutation.mutateAsync(text);
    setSearchParams({});
  };

  const deleteNote = async () => {
    if (noteToDelete === null) return;
    await deleteNoteMutation.mutateAsync(noteToDelete);
    setNoteToDelete(null);
  };

  if (!patient) return <p className="text-gray-600">Loading...</p>;

  const fullName = `${patient.first_name} ${patient.middle_name ? patient.middle_name + " " : ""}${patient.last_name}`;
  const address = patient.address;

  return (
    <div>
      {/* Profile Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 min-w-0 truncate">{fullName}</h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${patient.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-4">ID: {patient.id}</p>

        <div className="space-y-1">
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Email:</span> {patient.contact.email}</p>
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Phone:</span> {patient.contact.phone_number}</p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Address:</span>{" "}
            {address.street}{address.unit_number ? `, ${address.unit_number}` : ""}, {address.city}, {address.state} {address.zip_code}, {address.country}
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Patient Summary</h2>

        <div className="space-y-1 mb-4">
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Name:</span> {patientSummary?.full_name ?? fullName}</p>
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Age:</span> {patientSummary?.age ?? patient.age}</p>
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Blood Type:</span> {patientSummary?.bloodtype ?? "Unknown"}</p>
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Allergies:</span> {patientSummary?.allergies.length ? patientSummary.allergies.map(a => a.allergy_name).join(", ") : "None"}</p>
          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Conditions:</span> {patientSummary?.conditions.length ? patientSummary.conditions.map(c => c.condition_name).join(", ") : "None"}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes Summary</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {isLoadingSummary ? "Generating summary..." : patientSummary?.notes_summary ?? "Summary service is down, try again later."}
          </p>
        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Patient Notes</h2>
      </div>

      {notesError && <p className="text-center py-3 text-red-600">{notesErrorMessage}</p>}

      {!notesError && notes.length === 0 && !isLoadingNotes ? (
        <p className="text-center py-8 text-gray-500">Begin adding notes for this patient</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((note) => (
            <PatientNoteCard key={note.id} note={note} onDelete={(noteId) => setNoteToDelete(noteId)} />
          ))}
        </div>
      )}

      <div ref={ref} className="h-6" />
      {isFetchingNextPage && <p className="text-center mt-4 text-gray-600">Loading more notes...</p>}

      {showNoteForm && (
        <NoteForm
          onClose={() => setSearchParams({})}
          onSave={addNote}
          isPending={addNoteMutation.isPending}
        />
      )}

      {showEditForm && (
        <PatientForm
          patient={patient}
          onClose={() => setSearchParams({})}
          onSuccess={() => setSearchParams({})}
        />
      )}

      {noteToDelete !== null && (
        <ConfirmModal
          title="Delete Note"
          message="Are you sure you want to delete this note?"
          onConfirm={deleteNote}
          onClose={() => setNoteToDelete(null)}
          isPending={deleteNoteMutation.isPending}
          errorMessage={deleteNoteMutation.isError ? deleteNoteMutation.errorMessage : undefined}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Patient"
          message="Are you sure you want to delete this patient?"
          warning="This action is permanent and cannot be undone."
          onConfirm={async () => {
            if (!id) return;
            await deletePatientMutation.mutateAsync(id);
            navigate("/patients");
          }}
          onClose={() => setSearchParams({})}
          isPending={deletePatientMutation.isPending}
          errorMessage={deletePatientMutation.isError ? deletePatientMutation.errorMessage : undefined}
        />
      )}
    </div>
  );
}