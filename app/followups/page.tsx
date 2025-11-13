"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FollowUpPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("/api/followups")
      .then((res) => res.json())
      .then(setPatients);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">Follow-Up Management</h1>

      <table className="w-full border">
        <thead className="bg-indigo-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Last Follow-Up</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.phone}</td>
              <td className="p-3">
                {p.visits?.[0]?.nextFollowup
                  ? new Date(p.visits[0].nextFollowup).toLocaleDateString()
                  : "-"}
              </td>
              <td className="p-3 text-center">
                <Link
                  href={`/followups/${p.id}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md"
                >
                  ⋮ View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
