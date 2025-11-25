"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Followup = {
  id: number;
  date: string;
  feesPaid?: number;
  nextDate?: string;
  notes?: string;
  patient?: { name?: string };
};

export default function FollowupDetailsPage() {
  const [allFollowups, setAllFollowups] = useState<Followup[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [customDate, setCustomDate] = useState<string>("");

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  };

  // Get today's and tomorrow's dates
  const todayStr = formatDate(new Date());
  const tomorrowStr = formatDate(new Date(Date.now() + 86400000));

  useEffect(() => {
    fetch("/api/followups")
      .then((res) => res.json())
      .then((data: Followup[]) => {
        // Filter to show only today and future dates (upcoming followups)
        const upcomingOnly = data.filter(f => {
          const fDate = new Date(formatDate(f.date));
          const today = new Date(todayStr);
          return fDate >= today;
        });
        setAllFollowups(upcomingOnly);
      });
  }, [todayStr]);

  // Filter followups based on selected filter
  let filtered = allFollowups;
  if (filter === "today") {
    filtered = allFollowups.filter(f => formatDate(f.date) === todayStr);
  } else if (filter === "tomorrow") {
    filtered = allFollowups.filter(f => formatDate(f.date) === tomorrowStr);
  } else if (filter === "date" && customDate) {
    filtered = allFollowups.filter(f => formatDate(f.date) === customDate);
  }
  // else: "all" filter shows all upcoming followups

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-cyan-700">Follow-Up Details</h1>
        <div className="flex gap-2 items-center">
          <button
            className={`px-4 py-2 rounded-lg font-semibold border ${filter === "all" ? "bg-cyan-600 text-white" : "bg-gray-100 text-cyan-700"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold border ${filter === "today" ? "bg-cyan-600 text-white" : "bg-gray-100 text-cyan-700"}`}
            onClick={() => setFilter("today")}
          >
            Today
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold border ${filter === "tomorrow" ? "bg-cyan-600 text-white" : "bg-gray-100 text-cyan-700"}`}
            onClick={() => setFilter("tomorrow")}
          >
            Tomorrow
          </button>
          <input
            type="date"
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 outline-none"
            value={customDate}
            onChange={(e) => { setCustomDate(e.target.value); setFilter("date"); }}
          />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg border p-6">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-cyan-100 border-b-2 border-cyan-600">
                <tr>
                  <th className="p-3 text-left font-bold text-gray-800">Date</th>
                  <th className="p-3 text-left font-bold text-gray-800">Patient</th>
                  <th className="p-3 text-left font-bold text-gray-800">Fees Paid (₹)</th>
                  <th className="p-3 text-left font-bold text-gray-800">Next Date</th>
                  <th className="p-3 text-left font-bold text-gray-800">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((followup) => (
                  <tr key={followup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-gray-700">{formatDate(followup.date)}</td>
                    <td className="p-3 text-gray-700">{followup.patient?.name || "-"}</td>
                    <td className="p-3 text-gray-700">{followup.feesPaid ? `₹ ${followup.feesPaid}` : "-"}</td>
                    <td className="p-3 text-gray-700">{followup.nextDate ? formatDate(followup.nextDate) : "-"}</td>
                    <td className="p-3 text-gray-700">{followup.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 italic">No followup records found for selected filter.</p>
        )}
      </div>
      <div className="mt-8 text-center">
        <Link href="/patient" className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition-all">
          ← Back to Patients
        </Link>
      </div>
    </div>
  );
}