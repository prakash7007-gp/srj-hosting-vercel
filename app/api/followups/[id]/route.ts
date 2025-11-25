import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = parseInt(params.id);
    const body = await req.json();

    const visit = await prisma.visit.create({
      data: {
        patientId,
        treatment: body.treatment,
        doctorNotes: body.doctorNotes,
        followUpDate: new Date(body.followUpDate),
        fees: body.fees,
        paymentMode: body.paymentMode,
        status: "Pending",
      },
    });

    return NextResponse.json(visit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add follow-up" }, { status: 500 });
  }
}
