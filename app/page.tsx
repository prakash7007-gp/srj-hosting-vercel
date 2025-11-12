"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserPlus, Users, HeartPulse, UserCheck } from "lucide-react";

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

  // fetch patients (no cache)
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

    // re-fetch when another page dispatches update event
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

  // Filter
  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search)
  );

  const updateFollowup = async (pid) => {
    const input = prompt("Enter New Follow-Up Date (YYYY-MM-DD)");
    if (!input) return;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      alert("Invalid format. Use YYYY-MM-DD");
      return;
    }

    const res = await fetch(`/api/patients/${id}/followup`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextFollowup: d.toISOString() }),
    });


    if (!res.ok) return alert("Error updating");

    window.dispatchEvent(new Event("patientsUpdated"));
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
                          <span className="text-blue-600 font-medium">{String(p.nextFollowup).slice(0, 10)}</span>
                        ) : (
                          <span className="text-gray-400">Not Scheduled</span>
                        )}

                        <button onClick={() => updateFollowup(p.id)} className="px-2 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white rounded">
                          Edit
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
