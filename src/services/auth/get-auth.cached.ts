import { authGetSession } from "@/actions/auth/auth.get-session.action";
import { cache } from "react";

export const getAuthCached = cache(async () => {
    const session = await authGetSession();
    return session;
});