import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { orders } from "@/lib/data/orders";

export const metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-brand-gradient p-10 text-white">
      <h1 className="text-4xl font-semibold">Orders & Tracking</h1>
      <p className="mt-3 max-w-2xl text-white/70">
        Connect Stripe intents, messaging via WebSockets, and GPS webhooks to transform this mock data into live freight
        orchestration.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {orders.map((order) => (
          <OrderTimeline key={order.id} order={order} />
        ))}
      </div>
    </main>
  );
}
