import { NextResponse } from "next/server";
import { z } from "zod";

import { listingById } from "@/lib/data/listings";
import { orders } from "@/lib/data/orders";

const orderPayloadSchema = z.object({
  listingId: z.string(),
  shipper: z.string().min(2),
  pickupDate: z.string().optional(),
  dropoffDate: z.string().optional(),
  paymentIntentId: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ data: orders });
}

export async function POST(request) {
  const body = await request.json();
  const parsed = orderPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid payload",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  const listing = listingById(parsed.data.listingId);
  if (!listing) {
    return NextResponse.json({ error: `Listing ${parsed.data.listingId} not found` }, { status: 404 });
  }

  const orderId = `ord-${Math.floor(Math.random() * 10_000)
    .toString()
    .padStart(4, "0")}`;
  const order = {
    id: orderId,
    listingId: listing.id,
    shipper: parsed.data.shipper,
    pickupDate: parsed.data.pickupDate ?? listing.pickupDate,
    dropoffDate: parsed.data.dropoffDate ?? listing.dropoffDate,
    price: listing.price,
    status: "confirmed",
    equipment: listing.equipment,
    trackingUrl: `https://track.backhauls.us/${orderId}`,
    eta: listing.dropoffDate,
    timeline: [
      {
        id: `${orderId}-1`,
        label: "Booked",
        timestamp: new Date().toISOString(),
        description: "Order confirmed via API",
        status: "completed",
      },
      {
        id: `${orderId}-2`,
        label: "Driver Pending",
        timestamp: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        description: "Carrier dispatch notified.",
        status: "current",
      },
      {
        id: `${orderId}-3`,
        label: "In Transit",
        timestamp: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        description: "GPS tracking ready for streaming via BullMQ worker.",
        status: "upcoming",
      },
    ],
  };

  return NextResponse.json({ data: order }, { status: 201 });
}
