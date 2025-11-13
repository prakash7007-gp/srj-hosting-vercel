"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [newVisit, setNewVisit] = useState({ nextFollowup: "", fees: "", notes: "" });

  const fetchPatient = async () => {
    const res = await fetch(`/api/followups/${id}`);
    const data = await res.json();
    setPatient(data);
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const addVisit = async () => {
    if (!newVisit.nextFollowup || !newVisit.fees) return alert("All fields required");

    await fetch(`/api/followups/${id}/addvisit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVisit),
    });
    setNewVisit({ nextFollowup: "", fees: "", notes: "" });
    fetchPatient(); // refresh list
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">
        {patient.name} — Visit History
      </h1>

      <div className="mb-4">
        <p><b>Phone:</b> {patient.phone}</p>
        <p><b>Gender:</b> {patient.gender || "-"}</p>
        <p><b>Address:</b> {patient.address || "-"}</p>
      </div>

      <h2 className="text-lg font-semibold mb-2">Add New Visit</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={newVisit.nextFollowup}
          onChange={(e) => setNewVisit({ ...newVisit, nextFollowup: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Fees"
          value={newVisit.fees}
          onChange={(e) => setNewVisit({ ...newVisit, fees: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Notes"
          value={newVisit.notes}
          onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
          className="border px-2 py-1 rounded flex-1"
        />
        <button onClick={addVisit} className="bg-green-600 text-white px-3 rounded">
          Add
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-indigo-100">
          <tr>
            <th className="p-2 text-left">Visit Date</th>
            <th className="p-2 text-left">Next Follow-Up</th>
            <th className="p-2 text-left">Fees</th>
            <th className="p-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {patient.visits?.map((v) => (
            <tr key={v.id} className="border-b">
              <td className="p-2">{new Date(v.visitDate).toLocaleDateString()}</td>
              <td className="p-2">
                {v.nextFollowup
                  ? new Date(v.nextFollowup).toLocaleDateString()
                  : "-"}
              </td>
              <td className="p-2">₹{v.fees || "-"}</td>
              <td className="p-2">{v.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

