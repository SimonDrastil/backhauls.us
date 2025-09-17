import { NextResponse } from "next/server";

import { orderById } from "@/lib/data/orders";

export async function GET(_request, { params }) {
  const order = orderById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ data: order });
}
