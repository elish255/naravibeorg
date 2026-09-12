import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin")({ component: AdminPage });
function AdminPage(){ return <main className="min-h-screen bg-k-slate-50 p-6"><div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow"><h1 className="text-2xl font-extrabold">NARAVIBE</h1><p className="mt-3 text-k-slate-500">Mfumo wa database/admin umezimwa kwa sasa.</p></div></main>; }
