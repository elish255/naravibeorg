import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PAYMENT_AMOUNT } from "@/lib/mobilipa.functions";
import { submitManualPayment } from "@/lib/kozena.functions";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Lipa — NARAVIBE" },
      {
        name: "description",
        content: "Lipia ada ya NARAVIBE kwa Lipa Namba kupitia mtandao wako wa simu.",
      },
      { property: "og:title", content: "Lipa — NARAVIBE" },
      { property: "og:description", content: "Chagua mtandao wako na tumia Lipa Namba." },
    ],
  }),
  component: PaymentPage,
});

type Operator = {
  id: string;
  name: string;
  ussd: string;
  logo: string;
  alt: string;
  steps: string[];
};

const LIPA_NUMBER = "354136248";

const operators: Operator[] = [
  {
    id: "vodacom",
    name: "Vodacom M-Pesa",
    ussd: "*150*00#",
    logo: "https://brandlogos.net/wp-content/uploads/2025/04/vodacom-logo_brandlogos.net_4uzfe.png",
    alt: "Vodacom",
    steps: [
      "Bonyeza *150*00#",
      "Chagua Lipa kwa M-PESA",
      "Chagua LIPA KWA SIMU HALOPESA",
      "Weka LIPA NAMBA: 354136248",
      "Weka kiasi 14,500 TZS",
      "Weka namba ya siri",
    ],
  },
  {
    id: "mixx",
    name: "Mixx by Yas",
    ussd: "*150*01#",
    logo: "https://www.uminolan.co.tz/assets/images/supa-agent/mixx-by-yas-seeklogo2.png",
    alt: "Mixx by Yas",
    steps: [
      "Bonyeza *150*01#",
      "Chagua Lipa kwa simu",
      "Chagua Kwenda mitandao mingine",
      "Chagua HALOPESA",
      "Weka LIPA NAMBA: 354136248",
      "Weka kiasi 14,500 TZS",
      "Weka namba ya siri",
    ],
  },
  {
    id: "airtel",
    name: "Airtel Money",
    ussd: "*150*60#",
    logo: "https://nikulipe.com/wp-content/uploads/2022/09/Airtel_logo_PNG1.png",
    alt: "Airtel",
    steps: [
      "Bonyeza *150*60#",
      "Chagua Lipia Bili",
      "Chagua LIPA KWA SIMU (MITANDAO YOTE)",
      "Chagua LIPA KWA HALOPESA",
      "Weka kiasi 14,500 TZS",
      "Ingiza kumbukumbu ya malipo: 354136248",
      "Ingiza namba ya siri kuruhusu muamala",
    ],
  },
  {
    id: "halopesa",
    name: "Halopesa",
    ussd: "*150*88#",
    logo: "https://halopesa.co.tz/images/applications-system.png",
    alt: "Halopesa",
    steps: [
      "Bonyeza *150*88#",
      "Chagua namba (5) Lipia Bidhaa",
      "Chagua HALOPESA",
      "Weka namba ya malipo: 354136248",
      "Weka kiasi 14,500 TZS",
      "Ingiza namba ya siri",
      "Bonyeza 1 kuruhusu muamala",
    ],
  },
];

function PaymentPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [openOperator, setOpenOperator] = useState<string | null>(null);
  const [paymentPhone, setPaymentPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState<{full_name?:string; username?:string; phone?:string; has_paid?:boolean} | null>(null);
  const manualSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sb = getSupabaseBrowserClient();
    if (!sb) { navigate({ to: "/register" }); return; }
    sb.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate({ to: "/register" }); return; }
      const { data: p } = await sb.from("profiles").select("full_name,username,phone,has_paid").eq("id", data.session.user.id).maybeSingle();
      setProfile(p);
      if (p?.has_paid) navigate({ to: "/dashboard" }); else setReady(true);
    });
  }, [navigate]);

  async function submitPayment() {
    if (!paymentPhone.trim()) return; setSubmitting(true);
    try { await submitManualPayment({ data: { paymentPhone } }); setSubmitted(true); }
    catch (e) { alert(e instanceof Error ? e.message : "Imeshindikana kutuma taarifa."); }
    finally { setSubmitting(false); }
  }

  function handlePayNow() {
    setShowPopup(true);
  }

  function handleClosePopup() {
    setShowPopup(false);
    window.setTimeout(() => {
      manualSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-k-slate-50 font-jost text-k-slate-500">
        Inapakia...
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-k-slate-50 font-jost text-k-slate-800">
      <header className="flex items-center justify-between bg-k-green-900 px-6 py-4">
        <span className="text-lg font-extrabold tracking-tight text-white">
          NARAVIBE <span className="text-k-amber-400">SITE</span>
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] tracking-wide text-k-green-100">
          MALIPO SALAMA
        </span>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-16 pt-7">
        <div className="mb-6 flex gap-3 rounded-2xl border-[1.5px] border-k-red-300 bg-k-red-50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-k-red-100 text-k-red-600">
            🛡
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-widest text-k-red-600">LINDA PESA YAKO</h2>
            <p className="mt-1 text-sm leading-relaxed text-k-red-900">
              Lipia kupitia mfumo huu pekee. Malipo nje ya mfumo huu ni batili na hayatakubaliwa.
            </p>
          </div>
        </div>

        <div className="mb-5 flex gap-2">
          <span className="flex items-center gap-2 rounded-full border-[1.5px] border-k-green-800 bg-k-green-800 px-4 py-2 text-[13px] text-white">
            🇹🇿 Tanzania
          </span>
        </div>

        <section className="mb-6 overflow-hidden rounded-3xl border-[1.5px] border-k-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-k-slate-100 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-k-green-50 text-k-green-700">
              💳
            </div>
            <div>
              <h3 className="font-semibold">Tanzania</h3>
              <p className="text-xs text-k-slate-500">Lipa kwa Lipa Namba</p>
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-k-green-50 px-4 py-3">
              <span className="text-sm text-k-green-700">Kiasi cha kulipa</span>
              <span className="text-lg font-bold text-k-green-900">
                {PAYMENT_AMOUNT.toLocaleString()} TZS
              </span>
            </div>

            <button type="button" onClick={handlePayNow} className="k-btn-green hover:opacity-90">
              🔒 LIPA SASA
            </button>
          </div>
        </section>

        <section ref={manualSectionRef} className="scroll-mt-5 overflow-hidden rounded-3xl border-[1.5px] border-k-slate-200 bg-white">
          <div className="px-5 pb-2 pt-5">
            <h2 className="text-xl font-extrabold text-k-green-900">Lipa namba hizi</h2>
            <p className="mt-1 text-sm text-k-slate-500">Chagua mtandao wako</p>
          </div>

          <div className="px-4 pb-5 pt-3">
            <div className="mb-5 rounded-2xl border border-k-green-200 bg-k-green-50 p-4">
              <label className="block text-sm font-bold text-k-green-900">Weka namba ya simu uliyotumia kulipia</label>
              <input value={paymentPhone} onChange={e=>setPaymentPhone(e.target.value.replace(/[^0-9+]/g,""))} inputMode="tel" placeholder="06XXXXXXXX" className="k-field mt-2 bg-white" />
              <button type="button" disabled={submitting || submitted} onClick={submitPayment} className="k-btn-green mt-3 disabled:opacity-50">{submitted ? "✓ TAARIFA IMETUMWA" : submitting ? "INATUMA..." : "NIMELIPIA"}</button>
              {submitted && <p className="mt-2 text-xs font-semibold text-k-green-800">Malipo yako yanasubiri kuthibitishwa na admin. Ukithibitishwa utaweza kuendelea.</p>}
            </div>
            {operators.map((operator) => {
              const isOpen = openOperator === operator.id;
              return (
                <div key={operator.id} className="overflow-hidden border-b border-k-slate-100 last:border-b-0">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-1 py-4 text-left"
                    onClick={() => setOpenOperator(isOpen ? null : operator.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-k-slate-200 bg-white p-2">
                      <img src={operator.logo} alt={operator.alt} className="max-h-full max-w-full object-contain" loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-k-slate-800">{operator.name}</div>
                      <div className="text-sm text-k-slate-500">{operator.ussd}</div>
                    </div>
                    <svg
                      className={`h-6 w-6 shrink-0 text-k-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="pb-5 pl-1 pr-1">
                      <ul className="space-y-2">
                        {operator.steps.map((step, index) => {
                          const containsNumber = step.includes(LIPA_NUMBER);
                          return (
                            <li
                              key={`${operator.id}-${index}`}
                              className={`flex items-start gap-3 rounded-xl px-3 py-3 text-sm ${containsNumber ? "border border-k-green-200 bg-k-green-50" : "bg-k-slate-50"}`}
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-k-green-800 text-xs font-bold text-white">
                                {index + 1}
                              </span>
                              <span className="min-w-0 flex-1 leading-relaxed">
                                {containsNumber ? (
                                  <>
                                    {step.split(LIPA_NUMBER)[0]}
                                    <strong className="text-k-green-900">{LIPA_NUMBER}</strong>
                                    {step.split(LIPA_NUMBER)[1]}
                                  </>
                                ) : (
                                  step
                                )}
                              </span>
                              {containsNumber && (
                                <button
                                  type="button"
                                  onClick={() => copyText(LIPA_NUMBER)}
                                  className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-k-green-800 shadow-sm ring-1 ring-k-green-200"
                                >
                                  Copy
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>

                      <div className="mt-3 rounded-xl border border-k-amber-200 bg-k-amber-50 px-4 py-3 text-sm text-k-slate-700">
                        Jina la Biashara: <strong>ASSERT BRIDGE</strong>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5" role="dialog" aria-modal="true" aria-labelledby="ussd-unavailable-title">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-k-red-50 text-2xl">
              ⚠️
            </div>
            <h2 id="ussd-unavailable-title" className="text-lg font-extrabold text-k-slate-900">
              NJIA YA USSD PUSH HAIPATIKANI KWA SASA
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-k-slate-500">
              TUMIA LIPA NAMBA
            </p>
            <button type="button" onClick={handleClosePopup} className="k-btn-green mt-5 hover:opacity-90">
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
