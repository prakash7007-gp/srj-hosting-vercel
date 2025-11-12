"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditFollowup({ params }: any) {
  const router = useRouter();
  const { id } = params;

  const [patient, setPatient] = useState<any>(null);
  const [nextFollowup, setNextFollowup] = useState("");

  useEffect(() => {
    fetch(`/api/patients/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPatient(data);
        setNextFollowup(data.nextFollowup ? data.nextFollowup.slice(0, 10) : "");
      });
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`/api/patients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nextFollowup: nextFollowup ? new Date(nextFollowup) : null,
      }),
    });

    router.push("/");
  };

  if (!patient) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Update Next Follow-Up
        </h1>

        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <p className="text-gray-800 text-lg font-semibold">
            {patient.name}
          </p>
          <p className="text-sm text-gray-600">
            {patient.gender}, {patient.age} years
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Admission: {patient.admissionDate ? patient.admissionDate.slice(0, 10) : "-"}
          </p>
        </div>

        <label className="text-sm text-gray-700 mb-1">Next Follow-up Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded-lg text-gray-900 mb-6 focus:ring focus:ring-blue-200"
          value={nextFollowup}
          onChange={(e) => setNextFollowup(e.target.value)}
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Update Follow-Up
        </button>

        <Link
          href="/"
          className="block text-center mt-4 text-gray-600 hover:text-black transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
