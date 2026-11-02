import { Globe, Layers, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";
import { Section } from "@/components/layout/section";
import { AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { Select } from "@/components/ui/select";
import { brand } from "@/config/brand";

export const metadata = { title: "Styleguide", robots: { index: false } };

function Palette() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Object.entries(brand.colors).map(([name, hex]) => (
        <li key={name} className="flex items-center gap-2.5 text-sm">
          <span className="size-8 shrink-0 rounded-control border border-tone-line" style={{ background: hex }} />
          <span>
            <span className="block font-semibold">{name}</span>
            <span className="text-tone-muted">{hex}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Kit() {
  return (
    <div className="grid gap-12">
      <div>
        <Eyebrow>Typography</Eyebrow>
        <h1 className="mt-3 text-[2.25rem] leading-[1.05] sm:text-6xl">
          Be the business AI tools <em className="text-accent italic">recommend.</em>
        </h1>
        <h2 className="mt-6 text-4xl">AI tools are already recommending your competitors.</h2>
        <p className="mt-3 max-w-prose text-lg text-tone-muted">
          Body is Hanken Grotesk. Headings are Newsreader. Tabular figures: 11 / 15 · 72 / 100.
        </p>
      </div>

      <div>
        <Eyebrow>Buttons</Eyebrow>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button>Run Free Check</Button>
          <Button variant="cream">Check My Visibility</Button>
          <Button variant="soft">See an example</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:max-w-md">
        <Eyebrow>Controls</Eyebrow>
        <Field id="sg-url" label="Your website URL">
          <Input id="sg-url" icon={Globe} placeholder="Your website URL" />
        </Field>
        <Field id="sg-cat" label="Business category">
          <Select id="sg-cat" icon={Layers} defaultValue="">
            <option value="" disabled>
              Business category
            </option>
            <option value="dental">Dental clinics</option>
          </Select>
        </Field>
        <Field id="sg-city" label="City" error="Enter a city.">
          <Input id="sg-city" icon={MapPin} placeholder="City (e.g. Pune)" aria-invalid aria-describedby="sg-city-error" />
        </Field>
      </div>

      <div>
        <Eyebrow>Surfaces</Eyebrow>
        <Card className="mt-3 max-w-md p-5">
          <p className="font-serif text-2xl">Free AI Visibility Check</p>
          <p className="mt-1 text-tone-muted">A card follows the section tone.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>See an example</Pill>
            <Badge>Neutral</Badge>
            <Badge tone="success">Done</Badge>
            <Badge tone="warning">Waiting</Badge>
            <Badge tone="danger">Failed</Badge>
          </div>
        </Card>
      </div>

      <div className="max-w-xl">
        <Eyebrow>Accordion</Eyebrow>
        <div className="mt-2">
          <AccordionItem question="What is AEO?" name="sg-faq">
            Answer Engine Optimisation: making your business easy for AI assistants to find and name.
          </AccordionItem>
          <AccordionItem question="Is the check free?" name="sg-faq">
            Yes. You leave a verified mobile number so the team can send the full report.
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <Section tone="dark" containerClassName="py-12 sm:py-16">
        <Logo />
        <p className="mt-6 max-w-prose text-tone-muted">
          Dev-only. 404 in production. Dark tone, then cream, using the same components.
        </p>
        <div className="mt-10">
          <Eyebrow>Colour</Eyebrow>
          <div className="mt-4">
            <Palette />
          </div>
        </div>
        <div className="mt-14">
          <Kit />
        </div>
      </Section>
      <Section tone="cream" containerClassName="py-12 sm:py-16">
        <Eyebrow>Cream tone</Eyebrow>
        <div className="mt-10">
          <Kit />
        </div>
      </Section>
    </>
  );
}
