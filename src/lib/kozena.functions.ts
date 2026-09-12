import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

export const PAYMENT_AMOUNT = 15000;
export const PAYMENT_CURRENCY = "TZS";

export const registerUser = createServerFn({ method: "POST" })
  .validator((input: { name: string; username: string; phone: string; email: string; country: string; password: string }) => {
    if (!input?.name?.trim() || !input?.username?.trim() || !input?.phone?.trim() || !input?.email?.trim() || !input?.password) {
      throw new Error("Jaza taarifa zote zinazohitajika.");
    }
    if (input.password.length < 6) throw new Error("Password iwe na angalau herufi 6.");
    return { ...input, name: input.name.trim(), username: input.username.trim(), phone: normalizePhone(input.phone), email: input.email.trim().toLowerCase(), country: input.country || "tz" };
  })
  .handler(async ({ data }) => {
    const admin = getAdminClient();
    const { data: existing } = await admin.from("profiles").select("id").ilike("username", data.username).maybeSingle();
    if (existing) throw new Error("Username hiyo tayari inatumika.");
    const { data: created, error } = await admin.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true, user_metadata: { full_name: data.name, username: data.username, phone: data.phone, country: data.country } });
    if (error || !created.user) throw new Error(error?.message ?? "Imeshindikana kufungua akaunti.");
    const { error: profileError } = await admin.from("profiles").upsert({ id: created.user.id, full_name: data.name, username: data.username, phone: data.phone, country: data.country, has_paid: false }, { onConflict: "id" });
    if (profileError) { await admin.auth.admin.deleteUser(created.user.id); throw new Error(profileError.message); }
    return { userId: created.user.id };
  });

const MOBILIPA_BASE = "https://api.mobilipa.store";

const requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Missing Supabase environment variables.");

  const request = getRequest();
  const authHeader = request?.headers?.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

  const token = authHeader.slice(7).trim();
  if (!token || token.split(".").length !== 3) throw new Error("Unauthorized");

  const supabase = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) throw new Error("Unauthorized");

  return next({ context: { supabase, userId: data.claims.sub, claims: data.claims } });
});

function getAdminClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("255")) return digits;
  if (digits.startsWith("0")) return `255${digits.slice(1)}`;
  return `255${digits}`;
}

/** Sign in with a username instead of an email address. */
export const loginWithUsername = createServerFn({ method: "POST" })
  .validator((input: { username: string; password: string }) => {
    if (!input?.username?.trim() || !input?.password) {
      throw new Error("Weka username na password.");
    }
    return { username: input.username.trim(), password: input.password };
  })
  .handler(async ({ data }) => {
    const supabaseAdmin = getAdminClient();

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", data.username)
      .maybeSingle();

    if (!profile) throw new Error("Username au password si sahihi.");

    const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(profile.id);
    const email = userRes?.user?.email;
    if (!email) throw new Error("Username au password si sahihi.");

    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const anon = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data: signIn, error } = await anon.auth.signInWithPassword({
      email,
      password: data.password,
    });
    if (error || !signIn.session) throw new Error("Username au password si sahihi.");

    return {
      access_token: signIn.session.access_token,
      refresh_token: signIn.session.refresh_token,
    };
  });

/** Create a Mobilipa order and trigger the USSD push to the customer's phone. */
export const startPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { phone: string }) => {
    const digits = (input?.phone ?? "").replace(/\D/g, "");
    if (digits.length < 9) throw new Error("Namba ya simu si sahihi.");
    return { phone: digits };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;
    const msisdn = normalizePhone(data.phone);

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, username")
      .eq("id", userId)
      .maybeSingle();

    const res = await fetch(`${MOBILIPA_BASE}/v1/payment/create_order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env["MOBILIPA_API_KEY"]!,
      },
      body: JSON.stringify({
        buyer_email: (claims as { email?: string })?.email ?? "buyer@kozenasite.site",
        buyer_name: profile?.full_name || profile?.username || "KOZENA Member",
        buyer_phone: msisdn,
        amount: PAYMENT_AMOUNT,
        currency: PAYMENT_CURRENCY,
      }),
    });

    const json = (await res.json().catch(() => null)) as
      | { status?: string; message?: string; data?: Record<string, unknown> }
      | null;

    if (!res.ok || json?.status !== "success" || !json?.data) {
      throw new Error(json?.message ?? "Imeshindikana kutuma ombi la malipo. Jaribu tena.");
    }

    const orderId = String(json.data["order_id"] ?? "");
    const reference = json.data["reference"] ? String(json.data["reference"]) : null;

    const supabaseAdmin = getAdminClient();
    await supabaseAdmin.from("payments").insert({
      user_id: userId,
      phone: msisdn,
      amount: PAYMENT_AMOUNT,
      currency: PAYMENT_CURRENCY,
      order_id: orderId,
      reference,
      status: "PENDING",
    });

    return {
      order_id: orderId,
      reference,
      message: json.message ?? "Push USSD imetumwa kwenye simu yako.",
    };
  });

function isAdminEmail(email?: string | null) {
  const allowed = (process.env["ADMIN_EMAILS"] ?? "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  return !!email && allowed.includes(email.toLowerCase());
}

async function requireAdmin(context: { userId: string; claims: unknown }) {
  const claims = context.claims as { email?: string };
  if (!isAdminEmail(claims.email)) throw new Error("Huna ruhusa ya admin.");
  return getAdminClient();
}

export const submitManualPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { paymentPhone: string }) => {
    if (!input?.paymentPhone?.trim()) throw new Error("Weka namba uliyotumia kulipia.");
    return { paymentPhone: normalizePhone(input.paymentPhone) };
  })
  .handler(async ({ data, context }) => {
    const admin = getAdminClient();
    const { data: profile, error: pe } = await admin.from("profiles").select("full_name,username,phone,has_paid").eq("id", context.userId).single();
    if (pe || !profile) throw new Error("Taarifa za account hazijapatikana.");
    if (profile.has_paid) return { status: "APPROVED" };
    const { data: payment, error } = await admin.from("payments").insert({ user_id: context.userId, phone: profile.phone, payment_phone: data.paymentPhone, amount: PAYMENT_AMOUNT, currency: PAYMENT_CURRENCY, status: "PENDING_MANUAL" }).select("id").single();
    if (error) throw new Error(error.message);
    await admin.from("admin_notifications").insert({ payment_id: payment.id, user_id: context.userId, type: "MANUAL_PAYMENT", message: `Malipo mapya kutoka ${profile.username ?? profile.full_name ?? context.userId}`, read: false });
    return { status: "PENDING_MANUAL", paymentId: payment.id };
  });

export const getAdminPaymentRequests = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await requireAdmin(context);
    const { data, error } = await admin.from("payments").select("id,user_id,phone,payment_phone,amount,currency,status,created_at,profiles(full_name,username)").in("status", ["PENDING_MANUAL", "PENDING"]).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { requests: data ?? [] };
  });

export const approveManualPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { paymentId: string }) => { if (!input?.paymentId) throw new Error("Payment ID inahitajika."); return input; })
  .handler(async ({ data, context }) => {
    const admin = await requireAdmin(context);
    const { data: payment, error } = await admin.from("payments").update({ status: "APPROVED", verified_at: new Date().toISOString(), verified_by: context.userId }).eq("id", data.paymentId).select("user_id").single();
    if (error || !payment) throw new Error(error?.message ?? "Payment haijapatikana.");
    const { error: profileError } = await admin.from("profiles").update({ has_paid: true }).eq("id", payment.user_id);
    if (profileError) throw new Error(profileError.message);
    await admin.from("admin_notifications").update({ read: true }).eq("payment_id", data.paymentId);
    return { ok: true };
  });

export const rejectManualPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { paymentId: string }) => { if (!input?.paymentId) throw new Error("Payment ID inahitajika."); return input; })
  .handler(async ({ data, context }) => {
    const admin = await requireAdmin(context);
    const { error } = await admin.from("payments").update({ status: "REJECTED", verified_at: new Date().toISOString(), verified_by: context.userId }).eq("id", data.paymentId);
    if (error) throw new Error(error.message);
    await admin.from("admin_notifications").update({ read: true }).eq("payment_id", data.paymentId);
    return { ok: true };
  });

/** Poll Mobilipa for the order status and unlock the dashboard when it completes. */
export const checkPaymentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { orderId: string }) => {
    if (!input?.orderId) throw new Error("Order id inahitajika.");
    return { orderId: input.orderId };
  })
  .handler(async ({ data, context }) => {
    const { userId } = context;

    const res = await fetch(`${MOBILIPA_BASE}/v1/payment/order_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env["MOBILIPA_API_KEY"]!,
      },
      body: JSON.stringify({ order_id: data.orderId }),
    });

    const json = (await res.json().catch(() => null)) as
      | { status?: string; message?: string; data?: Record<string, unknown> }
      | null;

    const paymentStatus = String(json?.data?.["payment_status"] ?? "PENDING").toUpperCase();
    const transid = json?.data?.["transid"] ? String(json.data["transid"]) : null;

    const supabaseAdmin = getAdminClient();
    await supabaseAdmin
      .from("payments")
      .update({ status: paymentStatus, transid })
      .eq("order_id", data.orderId)
      .eq("user_id", userId);

    return { payment_status: paymentStatus, transid, message: json?.message ?? null };
  });
