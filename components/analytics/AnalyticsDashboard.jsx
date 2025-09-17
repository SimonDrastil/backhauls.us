import { TrendingDown, TrendingUp } from "lucide-react";

import { analyticsSnapshots } from "@/lib/data/analytics";

export function AnalyticsDashboard() {
  return (
    <div className="glass-panel h-full w-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Command center</p>
          <h2 className="text-2xl font-semibold">Marketplace intelligence</h2>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/50">
          Admin sync
        </span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {analyticsSnapshots.map((snapshot) => (
          <div key={snapshot.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">{snapshot.title}</p>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${snapshot.isPositive ? "bg-accent/20 text-accent-light" : "bg-red-500/20 text-red-200"}`}
              >
                {snapshot.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {snapshot.delta}
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold">{snapshot.value}</p>
            <p className="mt-2 text-xs leading-5 text-white/60">{snapshot.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/10 p-5 text-sm text-white/80">
        <p className="font-semibold text-accent-light">Stripe payouts staged</p>
        <p className="mt-2 text-xs leading-5 text-white/70">
          Wire instant payouts, reconcile disputes, and push BullMQ webhooks from the same dashboard. Connect live data when you
          flip from demo to production.
        </p>
      </div>
    </div>
  );
}
