"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash } from "lucide-react";

export default function AddPatient() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    admissionDate: "",
    address: "",
    treatmentPurpose: "",
    aadhar: "", // ✅ Added Aadhaar
  });

  const [patients, setPatients] = useState<any[]>([]);   
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch all patients
  const fetchPatients = async () => {
    const res = await fetch("/api/patients");
    const data = await res.json();
    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Add new patient
  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert("Please fill all required fields");
      return;
    }

    await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
        admissionDate: form.admissionDate ? new Date(form.admissionDate) : null,
      }),
    });

    await fetchPatients();

    setForm({
      name: "",
      phone: "",
      age: "",
      gender: "",
      admissionDate: "",
      address: "",
      treatmentPurpose: "",
      aadhar: "", // ✅ Added Aadhaar
    });
  };

  // View details (redirect to patient details page)
  const handleView = (id: number) => {
    router.push(`/patients/${id}`);
  };

  // Edit patient (redirect to edit page)
  const handleEdit = (id: number) => {
    router.push(`/patients/edit/${id}`);
  };

  // Delete patient
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this patient?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Patient deleted successfully!");
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete patient.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Form Section */}
        <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-200 mb-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-gray-700 tracking-wide">
              Add Patient Details
            </h1>
            <Link
              href="/"
              className="flex items-center gap-2 bg-red-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md"
            >
              ← Back
            </Link>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            <FormInput label="Patient Name" placeholder="Enter patient name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormInput label="Phone Number" placeholder="Enter phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <FormInput type="number" label="Age" placeholder="Enter age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Gender</label>
              <select
                className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <FormInput type="date" label="Admission Date" value={form.admissionDate} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })} />
            <FormInput label="Address" placeholder="Enter address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <FormInput label="Treatment Purpose" placeholder="Enter treatment purpose" value={form.treatmentPurpose} onChange={(e) => setForm({ ...form, treatmentPurpose: e.target.value })} />
            <FormInput
              label="Aadhaar Number"
              placeholder="Enter Aadhaar number"
              value={form.aadhar}
              onChange={(e) => setForm({ ...form, aadhar: e.target.value })}
            />

          </div>

          <button
            onClick={handleSubmit}
            className="mt-10 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition"
          >
            Save Patient
          </button>
        </div>

        {/* Patient Records Section */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mt-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Patient Records</h2>
              <p className="text-sm text-gray-500 mt-1">Manage and track patient information</p>
            </div>
          </div>

          {patients.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No patient records found.</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-cyan-600 text-white sticky top-0">
                      <tr>
                        <th className="p-4 text-left font-bold">Name</th>
                        <th className="p-4 text-left font-bold">Phone</th>
                        <th className="p-4 text-left font-bold">Gender</th>
                        <th className="p-4 text-left font-bold">Age</th>
                        <th className="p-4 text-left font-bold">Admission</th>
                        <th className="p-4 text-left font-bold">Aadhaar Number</th>
                        <th className="p-4 text-center font-bold">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {patients.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-bold text-green-900 capitalize">
                            <Link
                              href={`/patient/${p.id}`}
                              className="hover:text-cyan-600 underline transition"
                            >
                              {p.name}
                            </Link>
                          </td>
                          <td className="p-4 text-gray-600">{p.phone}</td>
                          <td className="p-4 text-gray-600">{p.gender}</td>
                          <td className="p-4 text-gray-600">{p.age}</td>
                          <td className="p-4 text-gray-600">{p.admissionDate ? p.admissionDate.slice(0, 10) : "-"}</td>
                          <td className="p-4 text-gray-600">{p.aadhar}</td>
                          <td className="p-4 flex gap-3 justify-center">
                            <button
                              onClick={() => setEditingPatient(p)}
                              className="text-cyan-600 hover:text-cyan-800 p-2 rounded"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="text-red-700 hover:text-red-800 p-2 rounded"
                              title="Delete"
                            >
                              <Trash size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {patients.map((p) => (
                  <div key={p.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-lg font-bold text-green-900 capitalize">{p.name}</div>
                        <div className="text-sm text-gray-600">{p.phone} • {p.gender} • {p.age}</div>
                        <div className="text-sm text-gray-600 mt-2">Admission: {p.admissionDate ? p.admissionDate.slice(0, 10) : "-"}</div>
                        <div className="text-sm text-gray-600">Aadhaar: {p.aadhar}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Link href={`/patient/${p.id}`} className="text-cyan-600 underline text-sm">View</Link>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingPatient(p)} className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded">Edit</button>
                          <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Component
import React from "react";

function FormInput({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
