import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return <main className="k-auth-bg flex min-h-screen items-center justify-center px-4 py-10"><div className="k-card w-full max-w-lg p-8 text-center"><h1 className="text-2xl font-bold">Jisajili kwanza</h1><p className="mt-3 text-sm text-k-slate-500">Kwa sasa hakuna mfumo wa login/database. Jaza fomu ya usajili kisha utaelekezwa moja kwa moja kwenye ukurasa wa malipo.</p><Link to="/register" className="k-btn mt-6 inline-flex">JISJILI SASA</Link></div></main>;
}
