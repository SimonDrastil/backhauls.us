"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Filter, MessageCircle, Radar, Settings } from "lucide-react";

import { BackhaulMap } from "@/components/map/BackhaulMap";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { ListingDetailDrawer } from "@/components/listings/ListingDetailDrawer";
import { ListingTable } from "@/components/listings/ListingTable";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { listings } from "@/lib/data/listings";
import { orders } from "@/lib/data/orders";

const heroStats = [
  {
    label: "Verified carriers",
    value: "2.4k",
  },
  {
    label: "Active shippers",
    value: "8.1k",
  },
  {
    label: "Average savings",
    value: "18%",
  },
];

export default function HomePage() {
  const [selectedListing, setSelectedListing] = useState(listings[0]);
  const liveOrder = useMemo(() => orders[0], []);

  return (
    <main className="relative flex min-h-screen flex-col gap-8 p-6 md:p-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/60">
            <Radar className="h-4 w-4 text-accent" />
            Live marketplace demo
          </div>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">Backhauls.US</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/70">
            Book verified return trips in seconds. Map, detail drawer, pricing, and analytics stay synchronized so your ops team
            never misses an opportunity.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/60">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-full bg-white/10 px-4 py-2">
                <span className="text-accent-light">{stat.value}</span>
                <span className="ml-2 uppercase tracking-[0.35em]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 self-start rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm text-white/70">
          <MessageCircle className="h-4 w-4 text-accent-light" />
          Messaging hooks primed
          <Settings className="h-4 w-4 text-accent-light" />
          Admin mode live
          <Bell className="h-4 w-4 text-accent-light" />
          SLA alerts armed
        </div>
      </header>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <BackhaulMap
          listings={listings}
          selectedId={selectedListing?.id}
          onSelect={(id) => setSelectedListing(listings.find((item) => item.id === id))}
        />
        <motion.div
          className="flex h-full flex-col gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ListingDetailDrawer listing={selectedListing} />
          <AnalyticsDashboard />
        </motion.div>
      </section>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="glass-panel flex h-full flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Filter lanes</p>
              <h2 className="text-2xl font-semibold">Operational queue</h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70 hover:border-accent/50">
              <Filter className="h-4 w-4" /> Refine results
            </button>
          </div>
          <ListingTable
            listings={listings}
            selectedId={selectedListing?.id}
            onSelect={(id) => setSelectedListing(listings.find((item) => item.id === id))}
          />
        </div>
        <OrderTimeline order={liveOrder} />
      </section>
    </main>
  );
}
