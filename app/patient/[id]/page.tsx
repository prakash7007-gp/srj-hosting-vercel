import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PatientDetails(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const patientId = Number(id);

  if (isNaN(patientId)) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Invalid Patient ID</h1>
        <Link href="/patient" className="text-cyan-500 underline mt-4 block">Go back</Link>
      </div>
    );
  }

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  // Fetch followup history for the patient
  const followups = await prisma.followup.findMany({
    where: { patientId },
    orderBy: { date: 'desc' },
  });

  if (!patient) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Patient not found</h1>
        <Link href="/patient" className="text-cyan-500 underline mt-4 block">Go back</Link>
      </div>
    );
  }

  // Compute YYYYMMDD integer for nextFollowup when present (e.g. 20251124)
  const nextFollowupYMD = patient.nextFollowup
    ? (() => {
      const d = new Date(patient.nextFollowup as any);
      return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    })()
    : null;

  return (
    <div className="max-w-7xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200 ">

      {/* Header Section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-cyan-600 text-white text-4xl font-bold flex items-center justify-center shadow-lg animate-bounce-slow">
          {patient.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">{patient.name}</h1>
          <p className="text-gray-600 text-lg">Patient Complete Profile</p>
        </div>
      </div>

      {/* Horizontal Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-10">

        {/* LEFT: Basic Details */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner border">
          <h2 className="text-2xl font-bold text-cyan-700 mb-4">Personal Details</h2>

          <div className="space-y-3 text-lg text-gray-700">
            <p><strong className="text-gray-900">📞 Phone:</strong> {patient.phone}</p>
            <p><strong className="text-gray-900">⚧ Gender:</strong> {patient.gender}</p>
            <p><strong className="text-gray-900">🎂 Age:</strong> {patient.age}</p>
            <p><strong className="text-gray-900">🏠 Address:</strong> {patient.address}</p>
            <p><strong className="text-gray-900">💊 Treatment Purpose:</strong> {patient.treatmentPurpose}</p>
          </div>
        </div>

      
      </div>

      {/* Action Buttons - Aligned */}
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/patient"
          className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 hover:shadow-xl transition-all text-center"
        >
          ← Back to Patients
        </Link>
        <Link
          href={`/patient/${patientId}/followup`}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 hover:shadow-xl transition-all text-center"
        >
          + Add Follow-Up
        </Link>
      </div>

      {/* Followup History Table */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-2xl font-bold text-cyan-700 mb-4">📋 Followup History</h2>
        {followups.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-cyan-100 border-b-2 border-cyan-600">
                <tr>
                  <th className="p-3 text-left font-bold text-gray-800">Date</th>
                  <th className="p-3 text-left font-bold text-gray-800">Fees Paid (₹)</th>
                  <th className="p-3 text-left font-bold text-gray-800">Next Date</th>
                  <th className="p-3 text-left font-bold text-gray-800">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {followups.map((followup) => (
                  <tr key={followup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-gray-700">
                      {new Date(followup.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-700">
                      {followup.feesPaid ? `₹ ${followup.feesPaid}` : "-"}
                    </td>
                    <td className="p-3 text-gray-700">
                      {followup.nextDate
                        ? new Date(followup.nextDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3 text-gray-700">{followup.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 italic">No followup records found</p>
        )}


      </div>



    </div>
  );
}
