import "server-only";
import { createHash, createHmac } from "node:crypto";
import { getEnv } from "./env";

function salt() {
  const value = getEnv().IP_HASH_SALT;
  if (value) return value;
  if (process.env.NODE_ENV === "production") throw new Error("IP_HASH_SALT is not set");
  return "dev-only-salt";
}

/** Keyed hash for IPs and OTPs, so raw values are never stored. */
export const hmac = (value: string) => createHmac("sha256", salt()).update(value).digest("hex");

/** Plain hash, for fields Meta's Conversions API wants hashed. */
export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
