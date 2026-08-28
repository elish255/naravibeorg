# NaraVibe - SPCK / GitHub / Vercel

## Important
Copy the whole project contents into the SPCK project before committing. Do not only copy changed route files.

The following files are required by the payment/auth flow:
- src/integrations/supabase/client.ts
- src/integrations/supabase/client.server.ts
- src/integrations/supabase/auth-middleware.ts
- src/integrations/supabase/auth-attacher.ts
- src/integrations/supabase/previewAuthStorage.ts
- src/integrations/supabase/cron-auth.ts
- src/integrations/supabase/types.ts

## SPCK
1. Replace the existing project files with this project.
2. Git -> Changes.
3. Confirm `src/integrations/supabase/` appears in Changes.
4. Stage all required files.
5. Commit.
6. Push to `elish255/naravibeorg`.

Do not commit `.env`. Use Vercel Environment Variables instead.

## Vercel environment variables
Set:
- SUPABASE_URL
- SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_SUPABASE_PROJECT_ID
- MOBILIPA_API_KEY

## Payment endpoint
Mobilipa status polling uses:
POST https://api.mobilipa.store/v1/payment/order_status
