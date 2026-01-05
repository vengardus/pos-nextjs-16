import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";
import { cache } from "react";

export const getAuthCached = cache(async () => {
    const session = await authGetSessionUseCase();
    return session;
});