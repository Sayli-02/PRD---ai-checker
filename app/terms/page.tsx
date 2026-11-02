import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Terms",
  description: `The terms for using the ${brand.name} website and its free AI Visibility Check.`,
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <LegalPage title="Terms" updated="2 November 2026">
      <p>By using this website and the free AI Visibility Check, you agree to these terms.</p>

      <h2>What the check is</h2>
      <p>
        The check asks AI assistants questions a customer might ask, and reports whether they named your business.
        It is a snapshot of the answers on the day. AI answers change from one run to the next, so the result is
        not a ranking, a promise or advice.
      </p>

      <h2>No guarantees</h2>
      <p>
        We do not guarantee any ranking, mention or result in Google or in any AI assistant. Those systems are run
        by others and change without notice.
      </p>

      <h2>Fair use</h2>
      <ul>
        <li>Give true details and only check a website you own or are allowed to check.</li>
        <li>One check is allowed for each verified mobile number and each website every 30 days.</li>
        <li>Do not use bots or scripts, and do not try to get around these limits.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        By unlocking your result you agree that our team may call you or message you on WhatsApp about your report.
        Our <Link href="/privacy">privacy policy</Link> explains how we handle your details.
      </p>

      <h2>Our content</h2>
      <p>
        The text, design and reports on this site belong to {brand.name}. You may use your own report for your own
        business, but do not copy the site.
      </p>

      <h2>Liability</h2>
      <p>
        The free check is provided as it is. To the extent the law allows, {brand.name} is not responsible for
        decisions you make based on it.
      </p>

      <h2>Changes and law</h2>
      <p>We may update these terms and will change the date above when we do. These terms follow the laws of India.</p>
    </LegalPage>
  );
}
