"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserPlus, Users, HeartPulse, UserCheck, Edit, Trash } from "lucide-react";

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-green-600 text-white">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-900">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingPatient, setEditingPatient] = useState<any | null>(null);

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients", { cache: "no-store" });
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("fetchPatients error:", err);
    }
  };
     
  useEffect(() => {
    fetchPatients();
    const onPatientsUpdated = () => fetchPatients();
    const onFocus = () => fetchPatients();
    window.addEventListener("patientsUpdated", onPatientsUpdated as EventListener);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("patientsUpdated", onPatientsUpdated as EventListener);
      window.removeEventListener("focus", onFocus); 
    };
  }, []);

  const total = patients.length;
  const active = patients.filter((p) => p.status === "Active").length;
  const discharged = patients.filter((p) => p.status === "Discharged").length;

  // Count patients created today (local date)
  const todayCount = patients.filter((p) => {
    if (!p.createdAt) return false;
    const d = new Date(p.createdAt);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }).length;

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search)
  );

  const updateFollowup = async (pid: number) => {
    const input = prompt("Enter New Follow-Up Date (YYYY-MM-DD)");
    if (!input) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      alert("Invalid format. Use YYYY-MM-DD");
      return;
    }
    const newDate = new Date(input);
    if (isNaN(newDate.getTime())) {
      alert("Invalid date entered.");
      return;
    }
    const res = await fetch(`/api/patients/${pid}/followup`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextFollowup: newDate.toISOString() }),
    });
    if (!res.ok) {
      alert("Error updating follow-up date");
      return;
    }
    alert("Follow-up date updated successfully!");
    window.dispatchEvent(new Event("patientsUpdated"));
  };

  // 🧠 Edit Patient Save
  const saveEdit = async () => {
    if (!editingPatient) return;
    const res = await fetch(`/api/patients/${editingPatient.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingPatient),
    });
    if (res.ok) {
      alert("Patient updated successfully!");
      setEditingPatient(null);
      fetchPatients();
    } else {
      alert("Failed to update patient");
    }
  };

  // 🧠 Delete Patient
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Failed to delete patient");
    alert("Patient deleted successfully!");
    fetchPatients();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Patients" value={total} icon={Users} />
          <StatCard label="Active Patients" value={active} icon={HeartPulse} />
          <StatCard label="Today's Patients" value={todayCount} icon={UserPlus} />
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Patient Records</h2>
              <p className="text-sm text-gray-500 mt-1">Manage and track patient information</p>
            </div>

            <Link href="/add" className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md">
              Add Patient
            </Link>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full md:w-1/3 px-4 py-2 border border-gray-700 text-gray-700 rounded-md"
            />
          </div>

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
                    <th className="p-4 text-left font-bold">Adhar Number</th>
                    <th className="p-4 text-left font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map((p) => (
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



                      <td className="p-2 text-gray-600">{p.aadhar}</td>
                      {/* ✅ Edit/Delete Buttons Added */}
                      <td className="p-4 flex gap-3">
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
            {filteredPatients.map((p) => (
              <div key={p.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="text-lg font-bold text-green-900 capitalize">{p.name}</div>
                    <div className="text-sm text-gray-600">{p.phone} • {p.gender} • {p.age}</div>
                    <div className="text-sm text-gray-600 mt-2">Admission: {p.admissionDate ? p.admissionDate.slice(0,10) : '-'}</div>
                    <div className="text-sm text-gray-600">Aadhar: {p.aadhar}</div>
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
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {editingPatient && (
        <div className="fixed inset-0 text-gray-700 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-cyan-900/30 w-full max-w-lg overflow-y-auto max-h-[90vh] transform transition-all duration-300 scale-100 hover:scale-[1.01]">
            <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">
              ✏️ Edit Patient Details
            </h2>

            {/* Name */}
            <input
              type="text"
              value={editingPatient.name}
              onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
              placeholder="Patient Name"
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            />

            {/* Phone */}
            <input
              type="text"
              value={editingPatient.phone}
              onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
              placeholder="Phone Number"
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            />

            {/* Aadhaar */}
            <input
              type="text"
              value={editingPatient.aadhar || ""}
              onChange={(e) => setEditingPatient({ ...editingPatient, aadhar: e.target.value })}
              placeholder="Aadhaar Number"
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            />

            {/* Age */}
            <input
              type="number"
              value={editingPatient.age}
              onChange={(e) => setEditingPatient({ ...editingPatient, age: parseInt(e.target.value) })}
              placeholder="Age"
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            />

            {/* Gender */}
            <select
              value={editingPatient.gender || ""}
              onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value })}
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            {/* Address */}
            <textarea
              value={editingPatient.address || ""}
              onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
              placeholder="Address"
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            ></textarea>

            {/* Treatment Purpose */}
            <input
              type="text"
              value={editingPatient.treatmentPurpose || ""}
              onChange={(e) => setEditingPatient({ ...editingPatient, treatmentPurpose: e.target.value })}
              placeholder="Treatment Purpose"
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            />

            {/* Fees */}
            <input
              type="number"
              value={editingPatient.fees || ""}
              onChange={(e) => setEditingPatient({ ...editingPatient, fees: parseInt(e.target.value) })}
              placeholder="Fees (₹)"
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            />

            {/* Admission Date */}
            <input
              type="date"
              value={editingPatient.admissionDate ? editingPatient.admissionDate.split("T")[0] : ""}
              onChange={(e) => setEditingPatient({ ...editingPatient, admissionDate: e.target.value })}
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            />

            {/* Next Follow-up */}
            <input
              type="date"
              value={editingPatient.nextFollowup ? editingPatient.nextFollowup.split("T")[0] : ""}
              onChange={(e) => setEditingPatient({ ...editingPatient, nextFollowup: e.target.value })}
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            />

            {/* Status */}
            <select
              value={editingPatient.status || "Active"}
              onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value })}
              className="w-full border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 px-3 py-2 rounded-lg mb-3 transition"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>    
            

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingPatient(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow-md hover:bg-cyan-700 hover:shadow-lg transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
