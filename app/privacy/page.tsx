import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${brand.name} collects, uses and protects your details, in line with India's Digital Personal Data Protection Act.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  const email = brand.contact.email;
  return (
    <LegalPage title="Privacy policy" updated="2 November 2026">
      <p>
        This page explains what {brand.name} collects when you use the free AI Visibility Check, why we collect it
        and what you can ask us to do. We collect only what is listed here.
      </p>

      <h2>What we collect and why</h2>
      <ul>
        <li>
          <strong>Website, business category and city.</strong> To run your check.
        </li>
        <li>
          <strong>Name, mobile number and email.</strong> To confirm your mobile with a code, show your result,
          send your full report and talk to you about it.
        </li>
        <li>
          <strong>Your consent and when you gave it.</strong> To show that you agreed to be contacted by call and
          WhatsApp.
        </li>
        <li>
          <strong>The AI answers behind your result.</strong> Saved with your check so our team can prepare your
          report.
        </li>
        <li>
          <strong>Where you came from (UTM and ad details).</strong> To learn which ads and pages work.
        </li>
        <li>
          <strong>A scrambled form of your IP address.</strong> To stop misuse. Our own database does not keep the
          address itself.
        </li>
      </ul>

      <h2>Who else handles your details</h2>
      <p>We use trusted services to run the site. Each receives only what it needs.</p>
      <ul>
        <li>Hosting and database providers store your check and details.</li>
        <li>OpenAI, Google (Gemini) and Perplexity receive the questions we ask, which contain your business category and city.</li>
        <li>An SMS provider receives your mobile number to send the code.</li>
        <li>Cloudflare checks that a form is filled by a person.</li>
        <li>
          Google Analytics, Meta (Pixel and Conversions API) and Microsoft Clarity measure how the site and our ads
          perform. When you unlock your result, Meta receives scrambled forms of your email and mobile number,
          plus your IP address and browser details, so it can match the visit to our ads.
          Clarity records how pages are used.
        </li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        We keep your details only as long as we need them for the reasons above, and we delete them when you ask.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to show you what we hold, correct it, delete it, or stop calling or messaging you. You can
        withdraw consent at any time. You can also raise a complaint with us first, and then with the Data Protection
        Board of India.
      </p>

      <h2>Contact us</h2>
      <p>
        {email ? (
          <>
            Write to <a href={`mailto:${email}`}>{email}</a>.
          </>
        ) : (
          <>Use the contact details in the page footer.</>
        )}
      </p>
    </LegalPage>
  );
}
