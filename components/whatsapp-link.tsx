"use client";

import { MessageCircle } from "lucide-react";
import { brand } from "@/config/brand";
import { home } from "@/content/home";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Renders nothing until NEXT_PUBLIC_WHATSAPP_NUMBER is set.
export function WhatsAppLink({ location, className }: { location: string; className?: string }) {
  const number = brand.contact.whatsapp.replace(/\D/g, "");
  if (!number) return null;
  const href = `https://wa.me/${number}?text=${encodeURIComponent(home.footer.whatsappMessage)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_clicked", { location })}
      className={cn("inline-flex items-center gap-2 font-semibold underline", className)}
    >
      <MessageCircle aria-hidden className="size-5" />
      {home.footer.whatsappLabel}
    </a>
  );
}
