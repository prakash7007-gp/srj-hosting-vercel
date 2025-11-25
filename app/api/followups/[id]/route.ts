import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = parseInt(params.id);
    const body = await req.json();

    const visit = await prisma.visit.create({
      data: {
        patientId,
        // Prisma Visit model fields: nextFollowup, fees, notes
        nextFollowup: body.nextFollowup ? new Date(body.nextFollowup) : null,
        fees: body.fees ? Number(body.fees) : null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(visit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add follow-up" }, { status: 500 });
  }
}
