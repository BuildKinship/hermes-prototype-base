"use client";
// Layout for all internal routes — requires @buildkinship.com Google sign-in

import { GoogleAuthGate } from "@/components/auth/GoogleAuthGate";
import React from "react";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GoogleAuthGate>{children}</GoogleAuthGate>;
}
