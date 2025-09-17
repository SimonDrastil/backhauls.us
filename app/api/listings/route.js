import { NextResponse } from "next/server";

import { listings } from "@/lib/data/listings";

export async function GET() {
  return NextResponse.json({ data: listings });
}
