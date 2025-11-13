import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const patients = await prisma.patient.findMany({
    include: { visits: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(patients);
}
