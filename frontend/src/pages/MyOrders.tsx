import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {currency, loadOrders, orderDate, orderStatusLabels, type ShopOrder} from "@/api/shopManagement.ts";
import {useAuth} from "@/hooks/useAuth.ts";

export default function MyOrders() {
  const {loading, accessToken} = useAuth();

  if (loading) return <p className="p-6" role="status">Φόρτωση λογαριασμού…</p>;
  if (!accessToken) return <Navigate to="/login" state={{from: "/orders"}} replace/>;

  return <OrderHistory key={accessToken} token={accessToken}/>;
}

function OrderHistory({token}: {token: string}) {
  const [orders, setOrders] = useState<ShopOrder[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    loadOrders(token, true, controller.signal)
      .then(setOrders)
      .catch(error => {
        if (!controller.signal.aborted) {
          setError(error instanceof Error ? error.message : "Αδυναμία φόρτωσης παραγγελιών.");
        }
      });
    return () => controller.abort();
  }, [token]);

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-8">
      <h1 className="text-3xl font-bold text-emerald-950">Οι παραγγελίες μου</h1>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!orders && !error && <p role="status">Φόρτωση παραγγελιών…</p>}
      {orders?.length === 0 && <p>Δεν έχετε κάνει ακόμη παραγγελίες.</p>}
      {orders?.map(order => (
        <article key={order.id} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <header className="flex flex-wrap justify-between gap-2">
            <div>
              <h2 className="font-semibold">Παραγγελία #{order.id.slice(-8)}</h2>
              <p className="text-sm text-gray-600">{orderDate.format(new Date(order.createdAt))}</p>
            </div>
            <span className="self-start rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-900">
              {orderStatusLabels[order.status]}
            </span>
          </header>
          <ul className="divide-y divide-gray-100">
            {order.items.map((item, index) => (
              <li key={item.productId + ":" + index} className="flex justify-between gap-3 py-2 text-sm">
                <span>{item.product} × {item.quantity}</span>
                <span>{currency.format(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="text-right font-semibold">Σύνολο {currency.format(order.totalCost)}</p>
        </article>
      ))}
    </div>
  );
}