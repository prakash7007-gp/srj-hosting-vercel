"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function FollowupPage() {
  const { id } = useParams(); // patient id
  const patientId = Number(id);
  const router = useRouter();

  const [followups, setFollowups] = useState([]);
  const [form, setForm] = useState({
    date: "",
    notes: "",
    feesPaid: "",
    nextDate: ""
  });

  const fetchFollowups = async () => {
    const res = await fetch(`/api/followups?patientId=${patientId}`);
    const data = await res.json();
    setFollowups(data);
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const submitFollowup = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/followups", {
      method: "POST",
      body: JSON.stringify({
        patientId,
        ...form
      }),
    });

    if (res.ok) {
      alert("Follow-up Added!");
      setForm({ date: "", notes: "", feesPaid: "", nextDate: "" });
      fetchFollowups();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Follow-up History</h1>

      {/* ADD FOLLOWUP FORM */}
      <form onSubmit={submitFollowup} className="bg-gray-100 p-4 rounded mb-6 space-y-4">
        <h2 className="text-xl font-semibold">Add Follow-Up</h2>

        <input
          type="date"
          className="w-full p-2 border rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Fees Paid"
          className="w-full p-2 border rounded"
          value={form.feesPaid}
          onChange={(e) => setForm({ ...form, feesPaid: e.target.value })}
        />

        <input
          type="date"
          className="w-full p-2 border rounded"
          value={form.nextDate}
          onChange={(e) => setForm({ ...form, nextDate: e.target.value })}
          placeholder="Next Follow-up Date"
        />

        <textarea
          placeholder="Notes"
          className="w-full p-2 border rounded"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Follow-Up
        </button>
      </form>

      {/* FOLLOWUP HISTORY LIST */}
      <div>
        <h2 className="text-xl font-bold mb-3">Previous Follow-ups</h2>

        <div className="space-y-4">
          {followups.length === 0 && (
            <p className="text-gray-500">No follow-ups recorded.</p>
          )}

          {followups.map((fu: any) => (
            <div key={fu.id} className="border p-4 rounded bg-white shadow">
              <p><strong>Date:</strong> {fu.date?.slice(0, 10)}</p>
              <p><strong>Fees Paid:</strong> ₹{fu.feesPaid || 0}</p>
              <p><strong>Next Date:</strong> {fu.nextDate?.slice(0, 10) || "Not set"}</p>
              <p><strong>Notes:</strong> {fu.notes || "—"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
