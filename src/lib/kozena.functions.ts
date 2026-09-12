import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase-admin";

export const PAYMENT_AMOUNT = 15000;
export const PAYMENT_CURRENCY = "TZS";
const MOBILIPA_BASE = "https://api.mobilipa.store";

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("255")) return digits;
  if (digits.startsWith("0")) return `255${digits.slice(1)}`;
  return `255${digits}`;
}

export const registerUser = createServerFn({ method: "POST" })
  .validator((input: { name: string; username: string; phone: string; email: string; country: string; password: string }) => {
    if (!input?.name?.trim() || !input?.username?.trim() || !input?.phone?.trim() || !input?.email?.trim() || !input?.password) throw new Error("Jaza taarifa zote zinazohitajika.");
    if (input.password.length < 6) throw new Error("Password iwe na angalau herufi 6.");
    return { ...input, name: input.name.trim(), username: input.username.trim(), phone: normalizePhone(input.phone), email: input.email.trim().toLowerCase(), country: input.country || "tz" };
  })
  .handler(async ({ data }) => {
    const db = getFirebaseAdminDb();
    const usernameSnap = await db.collection("profiles").where("usernameLower", "==", data.username.toLowerCase()).limit(1).get();
    if (!usernameSnap.empty) throw new Error("Username hiyo tayari inatumika.");
    let user;
    try {
      user = await getFirebaseAdminAuth().createUser({ email: data.email, password: data.password, emailVerified: true, displayName: data.name });
    } catch (e) { throw new Error(e instanceof Error ? e.message : "Imeshindikana kufungua akaunti."); }
    try {
      await db.collection("profiles").doc(user.uid).set({ id: user.uid, full_name: data.name, username: data.username, usernameLower: data.username.toLowerCase(), phone: data.phone, email: data.email, country: data.country, has_paid: false, role: "user", created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    } catch (e) {
      await getFirebaseAdminAuth().deleteUser(user.uid);
      throw new Error(e instanceof Error ? e.message : "Imeshindikana kuhifadhi taarifa za account.");
    }
    return { userId: user.uid, email: data.email };
  });

const requireFirebaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const header = getRequest()?.headers?.get("authorization");
  if (!header?.startsWith("Bearer ")) throw new Error("Unauthorized");
  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(header.slice(7).trim());
    return next({ context: { userId: decoded.uid, claims: decoded } });
  } catch { throw new Error("Unauthorized"); }
});

async function requireAdmin(context: { userId: string; claims: { email?: string } }) {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
  if (!context.claims.email || !allowed.includes(context.claims.email.toLowerCase())) throw new Error("Huna ruhusa ya admin.");
  return getFirebaseAdminDb();
}

export const loginWithUsername = createServerFn({ method: "POST" })
  .validator((input: { username: string; password: string }) => {
    if (!input?.username?.trim() || !input?.password) throw new Error("Weka username na password.");
    return { username: input.username.trim() };
  })
  .handler(async ({ data }) => {
    const snap = await getFirebaseAdminDb().collection("profiles").where("usernameLower", "==", data.username.toLowerCase()).limit(1).get();
    if (snap.empty) throw new Error("Username au password si sahihi.");
    const email = snap.docs[0].get("email");
    if (!email) throw new Error("Username au password si sahihi.");
    return { email };
  });

export const startPayment = createServerFn({ method: "POST" })
  .middleware([requireFirebaseAuth])
  .validator((input: { phone: string }) => {
    const digits = (input?.phone ?? "").replace(/\D/g, "");
    if (digits.length < 9) throw new Error("Namba ya simu si sahihi.");
    return { phone: digits };
  })
  .handler(async ({ data, context }) => {
    const msisdn = normalizePhone(data.phone);
    const profileSnap = await getFirebaseAdminDb().collection("profiles").doc(context.userId).get();
    const profile = profileSnap.data();
    const res = await fetch(`${MOBILIPA_BASE}/v1/payment/create_order`, { method: "POST", headers: { "Content-Type": "application/json", "X-API-KEY": process.env.MOBILIPA_API_KEY! }, body: JSON.stringify({ buyer_email: context.claims.email ?? "buyer@naravibe.site", buyer_name: profile?.full_name || profile?.username || "NARAVIBE Member", buyer_phone: msisdn, amount: PAYMENT_AMOUNT, currency: PAYMENT_CURRENCY }) });
    const json = await res.json().catch(() => null) as { status?: string; message?: string; data?: Record<string, unknown> } | null;
    if (!res.ok || json?.status !== "success" || !json?.data) throw new Error(json?.message ?? "Imeshindikana kutuma ombi la malipo. Jaribu tena.");
    const orderId = String(json.data.order_id ?? "");
    const reference = json.data.reference ? String(json.data.reference) : null;
    await getFirebaseAdminDb().collection("payments").add({ user_id: context.userId, phone: msisdn, amount: PAYMENT_AMOUNT, currency: PAYMENT_CURRENCY, order_id: orderId, reference, status: "PENDING", created_at: new Date().toISOString() });
    return { order_id: orderId, reference, message: json.message ?? "Push USSD imetumwa kwenye simu yako." };
  });

export const submitManualPayment = createServerFn({ method: "POST" })
  .middleware([requireFirebaseAuth])
  .validator((input: { paymentPhone: string }) => { if (!input?.paymentPhone?.trim()) throw new Error("Weka namba uliyotumia kulipia."); return { paymentPhone: normalizePhone(input.paymentPhone) }; })
  .handler(async ({ data, context }) => {
    const db = getFirebaseAdminDb();
    const profileSnap = await db.collection("profiles").doc(context.userId).get();
    const profile = profileSnap.data();
    if (!profile) throw new Error("Taarifa za account hazijapatikana.");
    if (profile.has_paid) return { status: "APPROVED" };
    const ref = db.collection("payments").doc();
    await ref.set({ user_id: context.userId, phone: profile.phone, payment_phone: data.paymentPhone, amount: PAYMENT_AMOUNT, currency: PAYMENT_CURRENCY, status: "PENDING_MANUAL", created_at: new Date().toISOString() });
    await db.collection("admin_notifications").add({ payment_id: ref.id, user_id: context.userId, type: "MANUAL_PAYMENT", message: `Malipo mapya kutoka ${profile.username ?? profile.full_name ?? context.userId}`, read: false, created_at: new Date().toISOString() });
    return { status: "PENDING_MANUAL", paymentId: ref.id };
  });

export const getAdminPaymentRequests = createServerFn({ method: "POST" }).middleware([requireFirebaseAuth]).handler(async ({ context }) => {
  const db = await requireAdmin(context);
  const snap = await db.collection("payments").where("status", "in", ["PENDING_MANUAL", "PENDING"]).get();
  const requests = await Promise.all(snap.docs.map(async d => {
    const x = d.data(); const p = x.user_id ? (await db.collection("profiles").doc(x.user_id).get()).data() : null;
    return { id: d.id, ...x, profiles: p ? { full_name: p.full_name, username: p.username } : null };
  }));
  requests.sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
  return { requests };
});

export const approveManualPayment = createServerFn({ method: "POST" }).middleware([requireFirebaseAuth]).validator((input: { paymentId: string }) => { if (!input?.paymentId) throw new Error("Payment ID inahitajika."); return input; }).handler(async ({ data, context }) => {
  const db = await requireAdmin(context); const ref = db.collection("payments").doc(data.paymentId); const snap = await ref.get(); if (!snap.exists) throw new Error("Payment haijapatikana.");
  const payment = snap.data()!; const batch = db.batch(); batch.update(ref, { status: "APPROVED", verified_at: new Date().toISOString(), verified_by: context.userId }); batch.update(db.collection("profiles").doc(payment.user_id), { has_paid: true, updated_at: new Date().toISOString() }); const notes = await db.collection("admin_notifications").where("payment_id", "==", data.paymentId).get(); notes.docs.forEach(n => batch.update(n.ref, { read: true })); await batch.commit(); return { ok: true };
});

export const rejectManualPayment = createServerFn({ method: "POST" }).middleware([requireFirebaseAuth]).validator((input: { paymentId: string }) => { if (!input?.paymentId) throw new Error("Payment ID inahitajika."); return input; }).handler(async ({ data, context }) => {
  const db = await requireAdmin(context); await db.collection("payments").doc(data.paymentId).update({ status: "REJECTED", verified_at: new Date().toISOString(), verified_by: context.userId }); const notes = await db.collection("admin_notifications").where("payment_id", "==", data.paymentId).get(); const batch = db.batch(); notes.docs.forEach(n => batch.update(n.ref, { read: true })); await batch.commit(); return { ok: true };
});

export const checkPaymentStatus = createServerFn({ method: "POST" }).middleware([requireFirebaseAuth]).validator((input: { orderId: string }) => { if (!input?.orderId) throw new Error("Order id inahitajika."); return input; }).handler(async ({ data, context }) => {
  const res = await fetch(`${MOBILIPA_BASE}/v1/payment/order_status`, { method: "POST", headers: { "Content-Type": "application/json", "X-API-KEY": process.env.MOBILIPA_API_KEY! }, body: JSON.stringify({ order_id: data.orderId }) });
  const json = await res.json().catch(() => null) as { status?: string; message?: string; data?: Record<string, unknown> } | null;
  const paymentStatus = String(json?.data?.payment_status ?? "PENDING").toUpperCase(); const transid = json?.data?.transid ? String(json.data.transid) : null;
  const snap = await getFirebaseAdminDb().collection("payments").where("order_id", "==", data.orderId).where("user_id", "==", context.userId).limit(1).get();
  if (!snap.empty) await snap.docs[0].ref.update({ status: paymentStatus, transid });
  return { payment_status: paymentStatus, transid, message: json?.message ?? null };
});
