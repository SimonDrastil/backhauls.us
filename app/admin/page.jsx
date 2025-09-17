import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata = {
  title: "Backhauls Admin",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-brand-gradient p-10 text-white">
      <h1 className="text-4xl font-semibold">Admin Control Center</h1>
      <p className="mt-3 max-w-2xl text-white/70">
        Extend this view with real authentication, dispute workflows, BullMQ jobs, and live Stripe payouts. The cards below reuse
        the same analytics snapshot powering the homepage drawer.
      </p>
      <div className="mt-8 max-w-5xl">
        <AnalyticsDashboard />
      </div>
    </main>
  );
}
