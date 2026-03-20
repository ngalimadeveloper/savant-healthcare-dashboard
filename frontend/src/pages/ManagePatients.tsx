// src/pages/ManagePatients.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Patient } from "@/interfaces/patient";
import { PatientCard } from "@/components/PatientCard";
import { PatientForm } from "@/components/PatientForm";

const PER_PAGE = 10;

export function ManagePatients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("name-az");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const fetchPatients = () => {
    fetch("http://localhost:8000/api/v1/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));
  };

  useEffect(() => { fetchPatients(); }, []);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const totalPages = Math.ceil(patients.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = patients.slice(start, start + PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <button onClick={() => setShowForm(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input type="text" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Filter</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="deceased">Deceased</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sort</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="name-az">Name A-Z</option>
              <option value="name-za">Name Z-A</option>
              <option value="visit-recent">Most Recent Visit</option>
              <option value="visit-oldest">Oldest Visit</option>
            </select>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-center py-12 text-gray-600">No patients found</p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((p) => <PatientCard key={p.id} patient={p} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:text-gray-400 hover:bg-gray-50">Previous</button>
          <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:text-gray-400 hover:bg-gray-50">Next</button>
        </div>
      )}

    {showForm && (
      <PatientForm
        onClose={() => setShowForm(false)}
        onSuccess={(patientId) => {
          setShowForm(false);
          navigate(`/patients/${patientId}`);
        }}
      />
    )}
    </div>
  );
}