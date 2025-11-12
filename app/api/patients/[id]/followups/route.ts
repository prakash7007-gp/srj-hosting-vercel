import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(_req: Request, { params }: any) {
  const { id } = params;
  const followups = await prisma.followup.findMany({
    where: { patientId: Number(id) },
    orderBy: { date: "desc" }
  });
  return NextResponse.json(followups);
}
