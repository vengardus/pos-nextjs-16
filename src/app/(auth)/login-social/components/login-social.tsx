"use client";

import { useState } from "react";
import GuestButton from "./guest-button";
import { ProviderOAuthButtons } from "./provider-oauth-buttons";

export const LoginSocial = () => {
    const [isPendingSocial, setIsPendingSocial] = useState(false);
  return (
    <>
      <GuestButton isPendingSocial={isPendingSocial} setIsPendingSocial={setIsPendingSocial} />

      <div className="flex items-center w-full mb-6">
        <div className="flex-grow h-px bg-gray-600"></div>
        <div className="px-4">O</div>
        <div className="flex-grow h-px bg-gray-600"></div>
      </div>

      <ProviderOAuthButtons isPendingSocial={isPendingSocial} setIsPendingSocial={setIsPendingSocial} />
    </>
  );
};
