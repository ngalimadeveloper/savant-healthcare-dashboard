// src/components/PatientForm.tsx
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { PatientFormData } from "@/interfaces/patientForm";
import type { Patient } from "@/interfaces/patient";
import { useCreatePatient, useUpdatePatient } from "@/hooks/usePatientMutations";

interface PatientFormProps {
  onClose: () => void;
  onSuccess: (patientId: number) => void;
  patient?: Patient;
}

const getInput = (error?: boolean) =>
  `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-gray-300"}`;

const section = "text-sm text-gray-500 sm:col-span-2 mt-2";

export function PatientForm({ onClose, onSuccess, patient }: PatientFormProps) {
  const [serverError, setServerError] = useState("");
  const [formError, setFormError] = useState("");
  const isEditing = !!patient;
  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient(patient?.id ?? 0);
  const isSubmitting = createPatientMutation.isPending || updatePatientMutation.isPending;

  const { register, handleSubmit, control, formState: { errors, isDirty } } = useForm<PatientFormData>({
    defaultValues: isEditing
      ? {
          first_name: patient.first_name,
          middle_name: patient.middle_name || "",
          last_name: patient.last_name,
          dob: patient.dob,
          status: patient.status,
          blood_type: patient.blood_type || "",
          contact: {
            email: patient.contact.email,
            phone_number: patient.contact.phone_number,
          },
          address: {
            street: patient.address.street,
            unit_number: patient.address.unit_number || "",
            city: patient.address.city,
            state: patient.address.state,
            zip_code: patient.address.zip_code,
            country: patient.address.country,
          },
          allergies: [],
          conditions: [],
        }
      : {
          status: "active" as const,
          address: { country: "United States" },
          allergies: [],
          conditions: [],
        },
  });

  const allergies = useFieldArray({ control, name: "allergies" });
  const conditions = useFieldArray({ control, name: "conditions" });

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const onSubmit = async (data: PatientFormData) => {
    setServerError("");
    setFormError("");

    if (isEditing && !isDirty) {
      setFormError("No changes made.");
      return;
    }

    try {
      const result = isEditing
        ? await updatePatientMutation.mutateAsync(data)
        : await createPatientMutation.mutateAsync(data);

      onSuccess(isEditing ? patient.id : result.id);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  const onError = () => {
    setFormError("Please fix the highlighted fields");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Patient" : "Add Patient"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {isEditing && !isDirty && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
            No changes detected.
          </div>
        )}

        {serverError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{serverError}</div>}
        {formError && <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">{formError}</div>}

        <form onSubmit={handleSubmit(onSubmit, onError)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p className={section}>Patient Info</p>
          <input {...register("first_name", { required: true })} placeholder="First Name *" className={getInput(!!errors.first_name)} />
          <input {...register("middle_name", { setValueAs: (v) => v === "" ? null : v })} placeholder="Middle Name" className={getInput()} />
          <input {...register("last_name", { required: true })} placeholder="Last Name *" className={getInput(!!errors.last_name)} />
          <input type="date" {...register("dob", { required: true })} max={today} className={getInput(!!errors.dob)} />
          <select {...register("status", { required: true })} className={getInput(!!errors.status)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <p className={section}>Blood Type</p>
          <select {...register("blood_type", { setValueAs: (v) => v === "" ? null : v })} className={getInput()}>
            <option value="">None / Unknown</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => <option key={bt} value={bt}>{bt}</option>)}
          </select>

          <p className={section}>Contact</p>
          <input
            type="email"
            {...register("contact.email", {
              required: true,
              pattern: /\S+@\S+\.\S+/,
              setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
            })}
            placeholder="Email *"
            className={getInput(!!errors.contact?.email)}
          />
          <input
            {...register("contact.phone_number", {
              required: true,
              pattern: /^[\d\s\-\+\(\)]{7,15}$/,
              setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
            })}
            placeholder="Phone Number *"
            className={getInput(!!errors.contact?.phone_number)}
          />

          <p className={section}>Address</p>
          <input {...register("address.street", { required: true })} placeholder="Street *" className={`${getInput(!!errors.address?.street)} sm:col-span-2`} />
          <input {...register("address.unit_number", { setValueAs: (v) => v === "" ? null : v })} placeholder="Unit Number" className={getInput()} />
          <input {...register("address.city", { required: true })} placeholder="City *" className={getInput(!!errors.address?.city)} />
          <input {...register("address.state", { required: true })} placeholder="State *" className={getInput(!!errors.address?.state)} />
          <input {...register("address.zip_code", { required: true })} placeholder="Zip Code *" className={getInput(!!errors.address?.zip_code)} />
          <input {...register("address.country", { required: true })} placeholder="Country *" className={getInput(!!errors.address?.country)} />

          {!isEditing && (
            <>
              <div className="sm:col-span-2 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Allergies</span>
                  <button type="button" onClick={() => allergies.append({ allergy_name: "" })} className="text-sm text-blue-600">+ Add</button>
                </div>
                {allergies.fields.map((field, i) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <input {...register(`allergies.${i}.allergy_name`, { required: true })} placeholder="Allergy name" className={getInput(!!errors.allergies?.[i]?.allergy_name)} />
                    <button type="button" onClick={() => allergies.remove(i)} className="text-red-500 px-2">✕</button>
                  </div>
                ))}
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Conditions</span>
                  <button type="button" onClick={() => conditions.append({ condition_name: "" })} className="text-sm text-blue-600">+ Add</button>
                </div>
                {conditions.fields.map((field, i) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <input {...register(`conditions.${i}.condition_name`, { required: true })} placeholder="Condition name" className={getInput(!!errors.conditions?.[i]?.condition_name)} />
                    <button type="button" onClick={() => conditions.remove(i)} className="text-red-500 px-2">✕</button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="sm:col-span-2 flex gap-3 mt-2">
            <button type="submit" disabled={isSubmitting || (isEditing && !isDirty)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
              {isEditing ? "Save" : "Save Patient"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}