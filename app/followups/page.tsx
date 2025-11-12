"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FollowUpPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("/api/followups", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setPatients(data));
  }, []);

  const updateFollowup = async (id: number) => {
    const nextDate = prompt("Enter new follow-up date (YYYY-MM-DD)");
    if (!nextDate) return;

    const res = await fetch(`/api/patients/${id}/followup`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextFollowup: nextDate }),
    });

    if (!res.ok) {
      alert("Failed to update date ❌");
      return;
    }

    // ✅ After DB update, fetch fresh data again
    fetch("/api/followups", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setPatients(data));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-indigo-700">Follow-Up Management</h1>
        <Link href="/" className="px-4 py-2 bg-gray-800 text-white rounded-md">
          Back Home
        </Link>
      </div>

      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-indigo-100 text-indigo-800 font-semibold">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Next Follow-Up</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p: any) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.phone}</td>
              <td className="p-3 text-red-600">{p.nextFollowup?.slice(0, 10) ?? "-"}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => updateFollowup(p.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                >
                  Update Follow-Up
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
