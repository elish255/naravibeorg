# NARAVIBE — Firebase + Vercel setup

This version no longer uses Supabase. Authentication uses Firebase Authentication and application data uses Cloud Firestore.

## 1. Firebase Console

Create/select a Firebase project, then:

1. Authentication → Sign-in method → enable **Email/Password**.
2. Firestore Database → Create database → choose a location and start in production mode.
3. Project settings → Your apps → Add web app and copy the Firebase web config.
4. Project settings → Service accounts → Generate new private key. Keep the downloaded JSON secret.

## 2. Vercel environment variables

Add these variables to the Vercel project (Production, Preview, and Development as needed):

Public browser config:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

Server-only secrets:
- FIREBASE_SERVICE_ACCOUNT_JSON = the complete service-account JSON on one line
- ADMIN_EMAILS = admin email(s), comma separated
- MOBILIPA_API_KEY = Mobilipa API key

Never put FIREBASE_SERVICE_ACCOUNT_JSON in a VITE_ variable.

## 3. Firestore security rules

Deploy `firestore.rules`. The browser can read only its own profile. Payment and admin collections are server-only, so users cannot set `has_paid` themselves.

## 4. Data model

`profiles/{uid}` stores account/profile data including `has_paid` and `role`.

`payments/{paymentId}` stores manual/USSD payment requests.

`admin_notifications/{notificationId}` stores admin notifications.

## 5. Admin

Set `ADMIN_EMAILS` to the exact Firebase Auth email used by the administrator. The existing `/admin` page remains the place to approve/reject manual payments.
