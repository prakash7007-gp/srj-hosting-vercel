import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const id = Number(params.id);
  const { nextFollowup, fees, notes } = await req.json();

  const visit = await prisma.visit.create({
    data: {
      patientId: id,
      nextFollowup: nextFollowup ? new Date(nextFollowup) : null,
      fees: fees ? Number(fees) : null,
      notes,
    },
  });

  return NextResponse.json(visit);
}
