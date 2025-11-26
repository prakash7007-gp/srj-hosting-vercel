import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");

    const where = patientId ? { patientId: Number(patientId) } : {};

    const followups = await prisma.followup.findMany({
      where,
      orderBy: { date: "asc" },
      include: {
        patient: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(followups);
  } catch (error) {
    console.error("Error fetching followups:", error);
    return NextResponse.json({ error: "Failed to load followups" }, { status: 500 });
  }
}

// POST - Add New Follow-up
export async function POST(req: Request) {
  try {
    const { patientId, date, notes, feesPaid, nextDate } = await req.json();

    const followup = await prisma.followup.create({
      data: {
        patientId: Number(patientId),
        date: new Date(date),
        notes,
        feesPaid: Number(feesPaid),
        nextDate: nextDate ? new Date(nextDate) : null,
      },
    });

    // also update Patient table with next followup date
    if (nextDate) {
      await prisma.patient.update({
        where: { id: Number(patientId) },
        data: { nextFollowup: new Date(nextDate) },
      });
    }

    return NextResponse.json(followup);
  } catch (e) {
    console.log("ERROR:", e);
    return NextResponse.json({ error: "Failed to create follow-up" }, { status: 500 });
  }
}
