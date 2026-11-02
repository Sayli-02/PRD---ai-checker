import "server-only";
import { getEnv } from "../env";
import type { OtpProvider } from "./provider";

// MSG91 OTP API with a DLT-registered template. https://docs.msg91.com/otp
export const msg91: OtpProvider = {
  async send(mobileE164, code) {
    const { OTP_PROVIDER_KEY, OTP_DLT_TEMPLATE_ID, OTP_SENDER_ID } = getEnv();
    if (!OTP_PROVIDER_KEY || !OTP_DLT_TEMPLATE_ID) throw new Error("SMS OTP is not configured");
    const url = new URL("https://control.msg91.com/api/v5/otp");
    url.search = new URLSearchParams({
      template_id: OTP_DLT_TEMPLATE_ID,
      mobile: mobileE164.replace("+", ""),
      otp: code,
      ...(OTP_SENDER_ID ? { sender: OTP_SENDER_ID } : {}),
    }).toString();
    const res = await fetch(url, {
      method: "POST",
      headers: { authkey: OTP_PROVIDER_KEY, "content-type": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.type === "error") throw new Error(`OTP provider: ${data.message ?? res.status}`);
  },
};
