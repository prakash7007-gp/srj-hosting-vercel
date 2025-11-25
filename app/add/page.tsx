"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddPatient() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    admissionDate: "",
    address: "",
    treatmentPurpose: "",
    fees: "",
    nextFollowup: "",
    aadhar: "", // ✅ Added Aadhaar
  });

  const [patients, setPatients] = useState<any[]>([]);   
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
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
        fees: Number(form.fees),
        admissionDate: form.admissionDate ? new Date(form.admissionDate) : null,
        nextFollowup: form.nextFollowup ? new Date(form.nextFollowup) : null,
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
      fees: "",
      nextFollowup: "",
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
            <h1 className="text-3xl font-extrabold text-cyan-700 tracking-wide">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Patient Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormInput label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <FormInput type="number" label="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
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
            <FormInput label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <FormInput label="Treatment Purpose" value={form.treatmentPurpose} onChange={(e) => setForm({ ...form, treatmentPurpose: e.target.value })} />
            <FormInput type="number" label="Fees (₹)" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} />

            <FormInput type="date" label="Next Follow-up" value={form.nextFollowup} onChange={(e) => setForm({ ...form, nextFollowup: e.target.value })} />
            <FormInput
              label="Aadhaar Number"
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

        {/* Patient List */}
        {/* <div className="bg-white border border-gray-300 shadow-xl rounded-xl p-6 mt-12">
          <h2 className="text-2xl font-bold text-cyan-700 mb-4">Patient Records</h2>
          {patients.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No patient records found.</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-cyan-50 text-cyan-800 text-sm font-semibold border-b">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Gender</th>
                    <th className="p-3 text-left">Age</th>
                    <th className="p-3 text-left">Admission</th>
                    <th className="p-3 text-left">Next Follow-Up</th>
                    <th className="p-3 text-left">Aadhaar</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 border-b transition">
                      <td className="p-3 font-semibold capitalize text-gray-800">{p.name}</td>
                      <td className="p-3 text-gray-700">{p.phone}</td>
                      <td className="p-3 text-gray-700">{p.gender}</td>
                      <td className="p-3 text-gray-700">{p.age}</td>
                      <td className="p-3 text-amber-600">{p.admissionDate?.slice(0, 10) || "-"}</td>
                      <td className="p-3 text-red-600">{p.nextFollowup?.slice(0, 10) || "Not Scheduled"}</td>
                      <td className="p-3 text-gray-700">{p.aadhar || "-"}</td>
                      <td className="p-3 text-center relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === p.id ? null : p.id);
                          }}
                          className="px-2 py-1 rounded hover:bg-gray-100 text-gray-600 font-bold"
                        >
                          ⋮
                        </button>

                        {openMenuId === p.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-4 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg w-36 text-sm z-20"
                          >
                            <button onClick={() => handleView(p.id)} className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600">
                              View Details
                            </button>
                            <button onClick={() => handleEdit(p.id)} className="block w-full text-left px-4 py-2 hover:bg-yellow-50 text-yellow-600">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

// Helper Component
import React from "react";

function FormInput({ label, value, onChange, type = "text" }: { label: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className="p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
