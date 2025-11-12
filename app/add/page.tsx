"use client";
import { useState, useEffect } from "react";
import Link from "next/link";


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
  });

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));
  }, []);

  const handleSubmit = async () => {
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

    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));

    setForm({ name: "", phone: "", age: "", gender: "", admissionDate: "", address: "", treatmentPurpose: "", fees: "", nextFollowup: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Patient Name</label>
              <input
                className="p-3 border border-gray-300  rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition shadow-2xl"
                value={form.name}
                placeholder="Enter name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                className="p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
                value={form.phone}
                placeholder="Enter phone number"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Age</label>
              <input
                type="number"
                className="p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
                value={form.age}
                placeholder="Enter age"
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Gender</label>
              <select
                className="p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Admission Date</label>
              <input
                type="date"
                className="p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
                value={form.admissionDate}
                onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="font-semibold text-gray-700 mb-1">Address</label>
              <input
                className="p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
                value={form.address}
                placeholder="Enter address"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="font-semibold text-gray-700 mb-1">Treatment Purpose</label>
              <input
                className="p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
                value={form.treatmentPurpose}
                placeholder="Enter treatment details"
                onChange={(e) => setForm({ ...form, treatmentPurpose: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Fees (Rs)</label>
              <input
                type="number"
                className="p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
                value={form.fees}
                placeholder="Enter fees amount"
                onChange={(e) => setForm({ ...form, fees: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Next Follow-up Date</label>
              <input
                type="date"
                className="p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 outline-none transition"
                value={form.nextFollowup}
                onChange={(e) => setForm({ ...form, nextFollowup: e.target.value })}
              />
            </div>

          </div>

          <button
            onClick={handleSubmit}
            className="mt-10 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition"
          >
            Save Patient
          </button>
        </div>

        {/* Patient List */}
        {/* Patient List Section */}
        <div className="bg-white border border-gray-300 shadow-xl rounded-xl p-6 mt-12 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-cyan-700">
              Patient Records
            </h2>
          </div>

          {patients.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No patient records found.</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <div className="max-h-96 overflow-y-auto custom-scrollbar">

                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-cyan-50 text-cyan-800 text-sm font-semibold border-b">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Gender</th>
                      <th className="p-3 text-left">Age</th>
                      <th className="p-3 text-left">Admission</th>
                      <th className="p-3 text-left">Next Follow-Up</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 border-b transition">
                        <td className="p-3 font-semibold capitalize text-gray-800">{p.name}</td>
                        <td className="p-3 text-gray-700">{p.phone}</td>
                        <td className="p-3 text-gray-700">{p.gender}</td>
                        <td className="p-3 text-gray-700">{p.age}</td>
                        <td className="p-3 text-amber-600">{p.admissionDate ? p.admissionDate.slice(0, 10) : "-"}</td>
                        <td className="p-3 text-red-600">{p.nextFollowup ? p.nextFollowup.slice(0, 10) : "Not Scheduled"}</td>

                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 text-xs rounded-full ${p.status === "Active"
                            ? "bg-green-100 text-green-700 border border-green-400"
                            : "bg-gray-200 text-gray-600"
                            }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
