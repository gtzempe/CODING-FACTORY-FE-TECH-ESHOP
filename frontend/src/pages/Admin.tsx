import {type FormEvent, useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import AdminCatalog from "@/components/AdminCatalog.tsx";
import {
  currency, loadOrders, orderDate, orderStatusLabels, saveOrderStatus,
  loadCatalog, type CatalogProduct, type OrderStatus, type ShopOrder,
} from "@/api/shopManagement.ts";
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/hooks/useAuth.ts";

const card = "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm";
const field = "rounded-lg border border-gray-300 bg-white p-2 focus-visible:outline-2 focus-visible:outline-emerald-700";
const lowStockLimit = 5;

export default function Admin() {
  const {loading, user, accessToken} = useAuth();

  if (loading) return <p className="p-6" role="status">Φόρτωση λογαριασμού…</p>;
  if (!accessToken) return <Navigate to="/login" state={{from: "/admin"}} replace/>;
  if (!user?.roles?.includes("ADMIN")) {
    return <p className="p-6" role="alert">Η σελίδα είναι διαθέσιμη μόνο σε διαχειριστές.</p>;
  }

  return <Dashboard key={accessToken} token={accessToken}/>;
}

function Dashboard({token}: {token: string}) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([loadCatalog(token, controller.signal), loadOrders(token, false, controller.signal)])
      .then(([catalog, shopOrders]) => {
        if (!controller.signal.aborted) {
          setProducts(catalog);
          setOrders(shopOrders);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Αδυναμία φόρτωσης στοιχείων διαχείρισης.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [token]);

  async function updateStatus(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const status = new FormData(event.currentTarget).get("status") as OrderStatus;
    setSaving(true);
    setFeedback("");
    try {
      const updated = await saveOrderStatus(token, id, status);
      setOrders(previous => previous.map(order => order.id === id ? updated : order));
      setFeedback("Η κατάσταση ενημερώθηκε.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Η ενημέρωση παραγγελίας απέτυχε.");
    } finally {
      setSaving(false);
    }
  }

  const completed = orders.filter(order => order.status === "completed");

  const monthFormatter = new Intl.DateTimeFormat("el-GR", {month: "short", year: "numeric"});
  const now = new Date();
  const monthlyTotals = Array.from({length: 6}, (_, index) => {
    const start = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const amount = completed.reduce((total, order) => {
      const created = new Date(order.createdAt);
      return created >= start && created < end ? total + order.totalCost : total;
    }, 0);
    return {month: monthFormatter.format(start), amount};
  });
  const peak = Math.max(1, ...monthlyTotals.map(month => month.amount));
  const totals = [
    ["Αξία ολοκληρωμένων παραγγελιών", currency.format(completed.reduce((total, order) => total + order.totalCost, 0))],
    ["Ολοκληρωμένες παραγγελίες", completed.length],
    ["Παραγγελίες σε εκκρεμότητα", orders.filter(order => order.status === "pending").length],
    ["Προϊόντα με απόθεμα κάτω από 5", products.filter(product => product.status === "active" && product.stock < lowStockLimit).length],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold text-emerald-950">Διαχείριση καταστήματος</h1>
        <p className="mt-2 text-gray-600">Πωλήσεις, αποθέματα και παραγγελίες</p>
      </header>
      {loading && <p role="status">Φόρτωση dashboard…</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <p role="status" className="empty:hidden">{feedback}</p>
      {!loading && !error && (
        <>
          <section aria-label="Στατιστικά πωλήσεων" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {totals.map(([label, value]) => (
              <dl key={label} className={card}>
                <dt className="text-sm text-gray-600">{label}</dt>
                <dd className="mt-2 text-3xl font-bold text-emerald-900">{value}</dd>
              </dl>
            ))}
          </section>
          <section className={card}>
            <h2 className="mb-4 text-xl font-semibold">Αξία ολοκληρωμένων παραγγελιών ανά μήνα</h2>
            <ul className="space-y-3">
              {monthlyTotals.map(({month, amount}) => (
                <li key={month} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-2 text-sm sm:gap-4">
                  <span>{month}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-emerald-50" aria-hidden="true">
                    <div className="h-full rounded-full bg-emerald-700" style={{width: (100 * amount / peak) + "%"}}/>
                  </div>
                  <span className="font-semibold tabular-nums">{currency.format(amount)}</span>
                </li>
              ))}
            </ul>
          </section>
          <AdminCatalog token={token} products={products} setProducts={setProducts}/>
          <section className={card}>
            <h2 className="mb-4 text-xl font-semibold">Παραγγελίες</h2>
            {orders.length === 0 && <p>Δεν υπάρχουν παραγγελίες.</p>}
            <ul className="divide-y divide-gray-200">
              {[...orders].sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)).map(order => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">#{order.id.slice(-8)} · {order.username}</p>
                    <p className="text-sm text-gray-600">{orderDate.format(new Date(order.createdAt))} · {currency.format(order.totalCost)} · {orderStatusLabels[order.status]}</p>
                  </div>
                  <form className="flex flex-wrap gap-2" onSubmit={event => void updateStatus(event, order.id)}>
                    <select key={order.status} className={field} name="status" defaultValue={order.status} aria-label={"Κατάσταση παραγγελίας " + order.id.slice(-8)}>
                      {Object.entries(orderStatusLabels).map(([status, label]) => (
                        <option key={status} value={status}>{label}</option>
                      ))}
                    </select>
                    <Button variant="outline" disabled={saving}>Αποθήκευση</Button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}