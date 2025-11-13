import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET specific patient's visit history
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = Number(params.id);

    if (isNaN(patientId)) {
      return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
    }

    // ✅ Include related visits if you have a separate visit table
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        visits: true, // remove this line if you don’t have a `Visit` model
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching patient:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
