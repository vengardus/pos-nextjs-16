"use client";

import { useState } from "react"

import { ProviderOAuthButtons } from "./provider-oauth-buttons"

export const LoginSocial = () => {
  const [isPendingSocial, setIsPendingSocial] = useState(false)
  return (
    <>
      <ProviderOAuthButtons
        isPendingSocial={isPendingSocial}
        setIsPendingSocial={setIsPendingSocial}
      />
    </>
  )
}
