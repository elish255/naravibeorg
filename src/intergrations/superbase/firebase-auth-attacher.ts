import { createMiddleware } from "@tanstack/react-start";
import { getFirebaseAuth } from "@/lib/firebase";

export const attachFirebaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    const token = user ? await user.getIdToken() : null;
    return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
  },
);
