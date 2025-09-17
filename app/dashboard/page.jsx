import Link from "next/link";

import { ListingTable } from "@/components/listings/ListingTable";
import { listings } from "@/lib/data/listings";

export const metadata = {
  title: "Operations Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-brand-gradient p-10 text-white">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-semibold">Operations dashboard</h1>
          <p className="mt-2 max-w-2xl text-white/70">
            This dashboard reuses the live listing table from the marketplace page. Wire it to real filters, bids, or carrier
            performance analytics as you go to production.
          </p>
        </div>
        <Link
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-accent/40"
          href="/"
        >
          Back to marketplace
        </Link>
      </header>
      <div className="mt-8">
        <ListingTable listings={listings} selectedId={listings[0].id} onSelect={() => undefined} />
      </div>
    </main>
  );
}
