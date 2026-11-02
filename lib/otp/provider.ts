import "server-only";
import { getEnv } from "../env";
import { msg91 } from "./msg91";

/** Sends a one-time code by SMS. Swap the provider by returning a different implementation here. */
export interface OtpProvider {
  send(mobileE164: string, code: string): Promise<void>;
}

/**
 * In development without provider keys a FIXED code is used and logged. This is only ever true outside
 * production, so a production server without keys fails instead of accepting 123456.
 */
export const DEV_FIXED_CODE = "123456";
export const usesDevCode = () => process.env.NODE_ENV !== "production" && !getEnv().OTP_PROVIDER_KEY;

export function getOtpProvider(): OtpProvider {
  if (usesDevCode()) {
    return {
      async send(mobile, code) {
        console.log(`[otp:dev] ${mobile} -> ${code}`);
      },
    };
  }
  return msg91;
}
