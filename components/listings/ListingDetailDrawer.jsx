"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Calendar, Fuel, Gauge, Leaf, MapPin, Navigation, ShieldCheck } from "lucide-react";

import { formatCurrency, formatDate, formatDistance } from "@/lib/utils/format";

const infoVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function ListingDetailDrawer({ listing }) {
  if (!listing) {
    return (
      <div className="glass-panel flex h-full items-center justify-center text-white/70">
        Choose a backhaul from the map or table to preview equipment, rates, and instant booking.
      </div>
    );
  }

  return (
    <motion.div
      className="glass-panel flex h-full flex-col"
      initial="hidden"
      animate="visible"
      variants={infoVariant}
      transition={{ duration: 0.4 }}
      key={listing.id}
    >
      <div className="flex items-start justify-between px-8 pt-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">{listing.mode} backhaul</p>
          <h2 className="text-3xl font-semibold">
            {listing.lane.origin}, {listing.lane.originState}
            <span className="mx-3 text-white/40">→</span>
            {listing.lane.destination}, {listing.lane.destinationState}
          </h2>
        </div>
        <span className={`badge ${listing.status === "booked" ? "badge-booked" : "badge-available"}`}>
          {listing.status === "booked" ? "Booked" : "Open"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6 px-8 py-6">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm font-semibold text-white/80">Pickup</p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-accent-light" />
            <span>
              {listing.lane.origin}, {listing.lane.originState}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
            <Calendar className="h-4 w-4 text-white/50" />
            {formatDate(listing.pickupDate)}
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm font-semibold text-white/80">Drop off</p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <Navigation className="h-4 w-4 text-accent-light" />
            <span>
              {listing.lane.destination}, {listing.lane.destinationState}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
            <Calendar className="h-4 w-4 text-white/50" />
            {formatDate(listing.dropoffDate)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 px-8">
        {listing.equipment.map((equipment) => (
          <span key={equipment} className="badge badge-available bg-white/10 text-white">
            <ShieldCheck className="mr-2 h-4 w-4" /> {equipment}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 px-8 py-6">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Lane distance</p>
          <p className="mt-2 text-xl font-semibold">{formatDistance(listing.distanceMiles)}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Instant book</p>
          <p className="mt-2 text-2xl font-semibold text-accent-light">{formatCurrency(listing.price)}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Estimated CO₂</p>
          <p className="mt-2 flex items-center gap-2 text-xl font-semibold text-emerald-300">
            <Leaf className="h-5 w-5" />
            {listing.carbonEstimateKg.toLocaleString()} kg
          </p>
        </div>
      </div>
      <div className="mt-auto px-8 pb-8">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-inner shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/50">Boosted performance</p>
              <p className="mt-2 text-lg text-white/80">
                <BadgeCheck className="mr-2 inline h-5 w-5 text-accent" /> Verified carrier, telemetry synced, messaging ready.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-accent/40 transition hover:bg-accent-light"
            >
              Reserve & pay with Stripe
            </motion.button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-accent-light" /> Smart telematics live
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-accent-light" /> Fuel advance available
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent-light" /> Cargo insurance synced
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
