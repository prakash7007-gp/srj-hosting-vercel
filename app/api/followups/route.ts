import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const followup = await prisma.followup.create({
      data
    });
    return NextResponse.json(followup, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to add followup" }, { status: 500 });
  }
}
