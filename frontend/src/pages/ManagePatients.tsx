// src/pages/ManagePatients.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { PatientCard } from "@/components/PatientCard";
import { PatientForm } from "@/components/PatientForm";
import { usePatientsList } from "@/hooks/usePatientsList";
import type { PatientStatus } from "@/interfaces/patient";

export function ManagePatients() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PatientStatus>("all");
  const wasInView = useRef(false);
  const { ref, inView } = useInView({ rootMargin: "200px" });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const showForm = searchParams.get("add") === "true";

  const {
    patients,
    isLoading,
    isError,
    errorMessage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePatientsList({
    search,
    status: statusFilter,
  });

  useEffect(() => {
    const enteredView = inView && !wasInView.current;
    if (enteredView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    wasInView.current = inView;
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Patients</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input type="text" placeholder="Search patients..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | PatientStatus)} className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {isError ? (
        <p className="text-center py-12 text-red-600">{errorMessage}</p>
      ) : patients.length === 0 && !isLoading ? (
        <p className="text-center py-12 text-gray-600">No patients found</p>
      ) : (
        <div className="flex flex-col gap-3">
          {patients.map((p) => <PatientCard key={p.id} patient={p} />)}
        </div>
      )}

      <div ref={ref} className="h-6" />
      {isFetchingNextPage && <p className="text-center mt-4 text-gray-600">Loading more...</p>}

    {showForm && (
      <PatientForm
        onClose={() => {
          setSearchParams({});
        }}
        onSuccess={(patientId) => {
          setSearchParams({});
          navigate(`/patients/${patientId}`);
        }}
      />
    )}
    </div>
  );
}