// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ManagePatients } from "@/pages/ManagePatients";
import { PatientView } from "@/pages/PatientView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<h1>Dashboard</h1>} />
          <Route path="/patients" element={<ManagePatients />} />
          <Route path="/patients/:id" element={<PatientView/>} />
          <Route path="/patients/:id/edit" element={<h1>PatientForm</h1>} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}