# NARAVIBE Firebase FIX5

This version removes the invalid `vercel.json` function runtime configuration that causes:
"Function Runtimes must have a valid version".

Node 22 is requested through `package.json` engines instead.

The Firebase Admin / Firestore ESM runtime issue is a separate deployment issue and should be checked after this build succeeds.
