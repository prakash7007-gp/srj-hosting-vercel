"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPatient() {
  const { id } = useParams();
  const router = useRouter();
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
  });

  // Fetch existing patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`/api/patients/${id}`);
        const data = await res.json();
        if (res.ok) {
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            age: data.age || "",
            gender: data.gender || "",
            admissionDate: data.admissionDate ? data.admissionDate.slice(0, 10) : "",
            address: data.address || "",
            treatmentPurpose: data.treatmentPurpose || "",
            fees: data.fees || "",
            nextFollowup: data.nextFollowup ? data.nextFollowup.slice(0, 10) : "",
          });
        } else {
          alert("Patient not found");
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };
    fetchPatient();
  }, [id]);

  // Update patient
  const handleUpdate = async () => {
    const res = await fetch(`/api/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
        fees: Number(form.fees),
        admissionDate: form.admissionDate ? new Date(form.admissionDate) : null,
        nextFollowup: form.nextFollowup ? new Date(form.nextFollowup) : null,
      }),
    });

    if (res.ok) {
      alert("Patient updated successfully!");
      router.push("/patients");
    } else {
      alert("Failed to update patient.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-cyan-700 mb-6 text-center">
          Edit Patient Detailss
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />

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

          <Input label="Admission Date" type="date" value={form.admissionDate} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })} />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="Treatment Purpose" value={form.treatmentPurpose} onChange={(e) => setForm({ ...form, treatmentPurpose: e.target.value })} />
          <Input label="Fees (₹)" type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} />
          <Input label="Next Follow-Up" type="date" value={form.nextFollowup} onChange={(e) => setForm({ ...form, nextFollowup: e.target.value })} />
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={() => router.push("/patients")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Update Patient
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable input component
import React from "react";

function Input({ label, type = "text", value, onChange }: { label: string; type?: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition"
      />
    </div>
  );
}
