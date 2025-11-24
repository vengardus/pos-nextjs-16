import { authGetSession } from "@/lib/data/auth/auth.get-session";
import { cache } from "react";

export const getAuthCached = cache(async () => {
    const session = await authGetSession();
    return session;
});