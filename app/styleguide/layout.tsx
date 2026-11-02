import { notFound } from "next/navigation";

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  // Hide on the live Vercel production URL. Keep it on localhost and Preview deploys.
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}
