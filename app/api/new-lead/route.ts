import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("Nuevo lead P&P Remodeling:", body);

  return NextResponse.json({ ok: true }, { status: 200 });
}
