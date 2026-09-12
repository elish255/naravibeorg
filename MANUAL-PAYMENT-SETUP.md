# NARAVIBE manual payment workflow

## Vercel environment variables

Required server variables:
- `SUPABASE_URL` = Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY` = Supabase publishable key
- `SUPABASE_SERVICE_ROLE_KEY` = Supabase service-role/secret key (server only)
- `MOBILIPA_API_KEY` = Mobilipa API key if the old USSD Push endpoint is retained
- `ADMIN_EMAILS` = comma-separated email(s) allowed to open `/admin`, e.g. `you@example.com`

Required browser variables for this Vite app:
- `VITE_SUPABASE_URL` = Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` = Supabase publishable key

Never put a service-role/secret key in `VITE_*` or `NEXT_PUBLIC_*`.

## Flow

1. Registration creates a real Supabase Auth user and a `profiles` record.
2. User is signed in and sent to `/payment`.
3. User pays `14,500 TZS` using Lipa Namba `354136248`.
4. User enters the phone number used for the payment and presses **NIMELIPIA**.
5. A `payments` record is created with the user's account ID, registered phone and payment phone. An `admin_notifications` record is also created.
6. Admin signs in with an email listed in `ADMIN_EMAILS` and opens `/admin`.
7. Admin checks the payment and presses **THIBITISHA**. This sets `profiles.has_paid = true`.
8. The user can then access the dashboard and chats.
9. Each chat uses the profile's configured `minutes`; when the timer reaches zero, the chat is locked and a popup lets the user close it and choose another chat.

## Important

After changing Vercel environment variables, redeploy the project. The Supabase SQL file is `supabase-schema.sql`.
