import { listings } from "./listings";

const iso = (date, hours) => new Date(new Date(date).setHours(hours, 0, 0, 0)).toISOString();

export const orders = [
  {
    id: "ord-0001",
    listingId: listings[0].id,
    shipper: "Sierra Supply Co.",
    pickupDate: listings[0].pickupDate,
    dropoffDate: listings[0].dropoffDate,
    price: listings[0].price,
    status: "en_route",
    equipment: listings[0].equipment,
    trackingUrl: "https://track.backhauls.us/ord-0001",
    eta: iso(listings[0].dropoffDate, 14),
    timeline: [
      {
        id: "ord-0001-1",
        label: "Booked",
        timestamp: iso(listings[0].pickupDate, 8),
        description: "Shipper locked the lane via instant book.",
        status: "completed",
      },
      {
        id: "ord-0001-2",
        label: "Driver Dispatched",
        timestamp: iso(listings[0].pickupDate, 12),
        description: "Carrier assigned driver and equipment.",
        status: "completed",
      },
      {
        id: "ord-0001-3",
        label: "In Transit",
        timestamp: iso(listings[0].dropoffDate, 9),
        description: "GPS pinging every 15 minutes.",
        status: "current",
      },
      {
        id: "ord-0001-4",
        label: "Delivered",
        timestamp: iso(listings[0].dropoffDate, 17),
        description: "Awaiting proof of delivery upload.",
        status: "upcoming",
      },
    ],
  },
  {
    id: "ord-0002",
    listingId: listings[1].id,
    shipper: "Northshore Retail",
    pickupDate: listings[1].pickupDate,
    dropoffDate: listings[1].dropoffDate,
    price: listings[1].price,
    status: "confirmed",
    equipment: listings[1].equipment,
    trackingUrl: "https://track.backhauls.us/ord-0002",
    eta: iso(listings[1].dropoffDate, 10),
    timeline: [
      {
        id: "ord-0002-1",
        label: "Booked",
        timestamp: iso(listings[1].pickupDate, 9),
        description: "Documentation verified, awaiting dispatch.",
        status: "completed",
      },
      {
        id: "ord-0002-2",
        label: "Driver Pending",
        timestamp: iso(listings[1].pickupDate, 14),
        description: "Carrier prepping reefer inspection.",
        status: "current",
      },
      {
        id: "ord-0002-3",
        label: "In Transit",
        timestamp: iso(listings[1].dropoffDate, 6),
        description: "Auto-updates will trigger when the driver departs Seattle.",
        status: "upcoming",
      },
      {
        id: "ord-0002-4",
        label: "Delivered",
        timestamp: iso(listings[1].dropoffDate, 18),
        description: "Cold chain sensors must be uploaded within 2 hours of arrival.",
        status: "upcoming",
      },
    ],
  },
];

export const orderById = (id) => orders.find((order) => order.id === id);
