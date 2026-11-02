// Client-side events. Names match the PRD: check_started, otp_sent, lead_submitted,
// result_viewed, cta_clicked, whatsapp_clicked.

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}, eventId?: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  window.clarity?.("event", event);
  // Meta: lead_submitted is the standard Lead event; the same eventId goes to the
  // Conversions API from the server so Meta can drop the duplicate.
  if (event === "lead_submitted") {
    window.fbq?.("track", "Lead", params, { eventID: eventId });
  } else {
    window.fbq?.("trackCustom", event, params);
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"];
const STORE = "utm";

export function captureUtm() {
  const search = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = search.get(key);
    if (value) found[key] = value.slice(0, 200);
  }
  if (Object.keys(found).length) sessionStorage.setItem(STORE, JSON.stringify(found));
}

export function readUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) ?? "{}");
  } catch {
    return {};
  }
}
