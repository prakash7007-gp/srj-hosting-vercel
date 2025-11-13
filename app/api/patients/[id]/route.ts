import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// 🟢 GET (Fetch one patient by ID)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(params.id) },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 🟡 PUT (Update patient)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    const updatedPatient = await prisma.patient.update({
      where: { id: Number(params.id) },
      data: {
        name: data.name,
        phone: data.phone,
        age: Number(data.age),
        gender: data.gender,
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : null,
        address: data.address,
        treatmentPurpose: data.treatmentPurpose,
        fees: Number(data.fees),
        nextFollowup: data.nextFollowup ? new Date(data.nextFollowup) : null,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

// 🔴 DELETE (Remove patient)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.patient.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
