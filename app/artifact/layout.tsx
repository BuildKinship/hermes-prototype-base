"use client";
// Layout for all /artifact/* routes
// Signs visitors in anonymously and silently — enables Firestore writes

import { AnonAuthGate } from "@/components/auth/AnonAuthGate";
import React from "react";

export default function ArtifactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnonAuthGate>{children}</AnonAuthGate>;
}
