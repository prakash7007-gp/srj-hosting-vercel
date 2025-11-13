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
      const res = await fetch("https://srj-hosting-vercel.onrender.com/api/patients", { cache: "no-store" });
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
    const res = await fetch(`https://srj-hosting-vercel.onrender.com/api/patients/${pid}/followup`, {
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
    const res = await fetch(`https://srj-hosting-vercel.onrender.com/api/patients/${editingPatient.id}`, {
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
    const res = await fetch(`https://srj-hosting-vercel.onrender.com/api/patients/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Failed to delete patient");
    alert("Patient deleted successfully!");
    fetchPatients();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Patients" value={total} icon={Users} />
          <StatCard label="Active Patients" value={active} icon={HeartPulse} />
          <StatCard label="Discharged Patients" value={discharged} icon={UserCheck} />
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Patient Recordssss</h2>
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
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-cyan-600 text-white sticky top-0">
                  <tr>
                    <th className="p-4 text-left font-bold">Name</th>
                    <th className="p-4 text-left font-bold">Phone</th>
                    <th className="p-4 text-left font-bold">Gender</th>
                    <th className="p-4 text-left font-bold">Age</th>
                    <th className="p-4 text-left font-bold">Admission</th>
                    <th className="p-4 text-left font-bold">Next Follow-up</th>
                    <th className="p-4 text-center font-bold">Status</th>
                    <th className="p-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-green-900 capitalize">{p.name}</td>
                      <td className="p-4 text-gray-600">{p.phone}</td>
                      <td className="p-4 text-gray-600">{p.gender}</td>
                      <td className="p-4 text-gray-600">{p.age}</td>
                      <td className="p-4">{p.admissionDate ? p.admissionDate.slice(0, 10) : "-"}</td>

                      <td className="p-4 flex items-center gap-2">
                        {p.nextFollowup ? (
                          <span className="text-blue-600 font-medium">
                            {String(p.nextFollowup).slice(0, 10)}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not Scheduled</span>
                        )}

                        <button
                          onClick={() => updateFollowup(p.id)}
                          className="px-2 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white rounded"
                        >
                          Edit
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* ✅ Edit/Delete Buttons Added */}
                      <td className="p-4 flex items-center justify-center gap-3">
                        <button
                          onClick={() => setEditingPatient(p)}
                          className="text-cyan-600 hover:text-cyan-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-800"
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
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Patient</h2>
            <input
              type="text"
              value={editingPatient.name}
              onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
              placeholder="Name"
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="text"
              value={editingPatient.phone}
              onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
              placeholder="Phone"
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="number"
              value={editingPatient.age}
              onChange={(e) =>
                setEditingPatient({ ...editingPatient, age: parseInt(e.target.value) })
              }
              placeholder="Age"
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <select
              value={editingPatient.gender}
              onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-2"
            >
              <option>Male</option>
              <option>Female</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingPatient(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
