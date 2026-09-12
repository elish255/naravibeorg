import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, RefreshCw } from "lucide-react";
import { approveManualPayment, getAdminPaymentRequests, rejectManualPayment } from "@/lib/kozena.functions";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type RequestItem = {
  id: string; user_id: string; phone: string; payment_phone: string | null; amount: number; currency: string; status: string; created_at: string;
  profiles: { full_name: string; username: string } | null;
};

function AdminPage() {
  const load = useServerFn(getAdminPaymentRequests);
  const approve = useServerFn(approveManualPayment);
  const reject = useServerFn(rejectManualPayment);
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true); setError("");
    try { setItems((await load({ data: undefined })) as RequestItem[]); }
    catch (e) { setError(e instanceof Error ? e.message : "Imeshindikana kupakia."); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function action(id: string, kind: "approve" | "reject") {
    setBusy(id); setError("");
    try { if (kind === "approve") await approve({ data: { paymentId: id } }); else await reject({ data: { paymentId: id } }); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Imeshindikana."); }
    finally { setBusy(null); }
  }

  return <main className="min-h-screen bg-k-slate-50 p-4 md:p-8 font-jost text-k-slate-800">
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between gap-3"><div><h1 className="text-2xl font-extrabold text-k-green-900">Admin — Malipo</h1><p className="text-sm text-k-slate-500">Thibitisha malipo ya manual kabla ya kumfungulia user chat.</p></div><button onClick={refresh} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold"><RefreshCw className="mr-2 inline h-4 w-4"/>Refresh</button></div>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {loading ? <div className="rounded-2xl bg-white p-8 text-center">Inapakia...</div> : items.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-slate-500">Hakuna malipo yanayosubiri.</div> : <div className="space-y-4">{items.map((x) => <div key={x.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="grid gap-3 md:grid-cols-2"><div><p className="text-lg font-bold">{x.profiles?.full_name || "—"}</p><p className="text-sm text-slate-500">Username: {x.profiles?.username || "—"}</p><p className="text-sm text-slate-500">ID: {x.user_id}</p></div><div className="text-sm"><p><b>Simu iliyosajiliwa:</b> {x.phone}</p><p><b>Simu iliyotumika kulipa:</b> {x.payment_phone || "—"}</p><p><b>Kiasi:</b> {Number(x.amount).toLocaleString()} {x.currency}</p><p><b>Tarehe:</b> {new Date(x.created_at).toLocaleString()}</p></div></div><div className="mt-4 flex gap-3"><button disabled={busy===x.id} onClick={() => action(x.id,"reject")} className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-700 disabled:opacity-50"><X className="mr-1 inline h-4 w-4"/> KATAA</button><button disabled={busy===x.id} onClick={() => action(x.id,"approve")} className="flex-1 rounded-xl bg-k-green-800 px-4 py-3 font-bold text-white disabled:opacity-50"><Check className="mr-1 inline h-4 w-4"/> THIBITISHA</button></div></div>)}</div>}
    </div>
  </main>;
}
