"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Flame, Package, Truck } from "lucide-react";

import { formatCurrency, formatDate, formatDistance } from "@/lib/utils/format";

const ModeIcon = ({ mode }) => {
  const base = "h-4 w-4";
  switch (mode) {
    case "Air":
      return <Flame className={`${base} text-accent-light`} />;
    case "Ocean":
      return <Package className={`${base} text-sky-300`} />;
    default:
      return <Truck className={`${base} text-accent-light`} />;
  }
};

export function ListingTable({ listings, selectedId, onSelect }) {
  return (
    <div className="glass-panel w-full overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Marketplace lanes</p>
          <h2 className="text-2xl font-semibold">Return trips ready to book</h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-accent/40 transition hover:bg-accent-light">
          Instant book
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-6 grid grid-cols-[1.2fr,0.9fr,1fr,1fr,0.7fr] gap-2 px-6 text-left text-xs uppercase tracking-widest text-white/50">
        <span>Lane</span>
        <span>Carrier</span>
        <span>Schedule</span>
        <span>Distance</span>
        <span className="text-right">Rate</span>
      </div>
      <div className="scrollbar-thin mt-2 max-h-[320px] overflow-y-auto px-3 pb-6">
        <div className="space-y-3">
          {listings.map((listing) => {
            const isActive = listing.id === selectedId;
            return (
              <motion.button
                key={listing.id}
                onClick={() => onSelect(listing.id)}
                className={`table-row w-full text-left transition ${isActive ? "active" : "bg-white/5"}`}
                layout
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="flex items-center gap-3 font-semibold text-sm">
                  <ModeIcon mode={listing.mode} />
                  <div>
                    <p>
                      {listing.lane.origin}, {listing.lane.originState}
                      <span className="mx-2 text-white/40">→</span>
                      {listing.lane.destination}, {listing.lane.destinationState}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
                      {listing.mode} · {listing.equipment.join(" · ")}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-white/80">{listing.carrier}</div>
                <div className="text-sm text-white/80">
                  {formatDate(listing.pickupDate)} → {formatDate(listing.dropoffDate)}
                </div>
                <div className="text-sm text-white/80">{formatDistance(listing.distanceMiles)}</div>
                <div className="text-right text-lg font-semibold text-accent-light">
                  {formatCurrency(listing.price)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
