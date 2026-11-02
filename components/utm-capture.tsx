"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/analytics";

export function UtmCapture() {
  useEffect(captureUtm, []);
  return null;
}
