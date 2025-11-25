import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🟢 GET — Fetch a single patient by ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(id) },
    });

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Error fetching patient" }, { status: 500 });
  }
}

// 🟡 PUT — Update patient by ID
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await req.json();

  try {
    const updated = await prisma.patient.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "Error updating patient" }, { status: 500 });
  }
}

// 🔴 DELETE — Delete patient by ID
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await prisma.patient.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Error deleting patient" }, { status: 500 });
  }
}
