"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FollowupList({ params }: any) {
  const patientId = params.id;

  const [list, setList] = useState([]);

  useEffect(() => {
    fetch(`/api/followup/${patientId}`)
      .then((res) => res.json())
      .then((data) => setList(data));
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">
        Follow-Up History
      </h1>

      <Link
        href={`/patient/${patientId}/followup`}
        className="mb-4 inline-block bg-cyan-600 text-white px-4 py-2 rounded"
      >
        Add Follow-Up
      </Link>

      <div className="space-y-4">
        {list.length === 0 ? (
          <p className="text-gray-500">No follow-ups yet.</p>
        ) : (
          list.map((f: any) => (
            <div
              key={f.id}
              className="p-4 border rounded-xl bg-white shadow"
            >
              <p>
                <strong>Date:</strong> {f.date?.slice(0, 10)}
              </p>
              <p>
                <strong>Notes:</strong> {f.notes || "-"}
              </p>
              <p>
                <strong>Fees Paid:</strong> ₹{f.feesPaid || 0}
              </p>
              <p>
                <strong>Next Follow-up:</strong>{" "}
                <span className="text-orange-600">
                  {f.nextDate?.slice(0, 10) || "Not Set"}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
