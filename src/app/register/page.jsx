"use client";

export const dynamic = "force-dynamic";

import React from "react";
import AuthSlidingDualPanel from "@/features/auth/components/AuthSlidingDualPanel";

export default function RegisterPage() {
  return <AuthSlidingDualPanel defaultMode="register" />;
}