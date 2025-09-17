import { Clock, MapPin } from "lucide-react";

import { formatDate } from "@/lib/utils/format";

export function OrderTimeline({ order }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Live order</p>
          <h3 className="text-xl font-semibold">{order.shipper}</h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/50">
          {order.status}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent-light" /> {order.listingId.toUpperCase()}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent-light" /> ETA {formatDate(order.eta)}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {order.timeline.map((event) => (
          <div key={event.id} className="flex items-start gap-4">
            <div
              className={`mt-1 h-3 w-3 rounded-full ${
                event.status === "completed"
                  ? "bg-accent"
                  : event.status === "current"
                    ? "bg-accent-light animate-pulse"
                    : "bg-white/30"
              }`}
            />
            <div>
              <p className="text-sm font-semibold text-white/80">{event.label}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">{formatDate(event.timestamp)}</p>
              <p className="mt-1 text-xs text-white/60">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-xs text-white/60">
        Tracking URL: <span className="text-accent-light">{order.trackingUrl}</span>
      </div>
    </div>
  );
}
