import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { site } from "@/content/site";

export function Faq() {
  const f = site.faq;
  return (
    <section id="faq" className="on-paper scroll-mt-16 bg-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:py-20">
        <h2 className="text-4xl font-bold sm:text-5xl">{f.title}</h2>
        <Accordion className="border-y-2 border-ink">
          {f.items.map((item, i) => (
            <AccordionItem key={item.q} value={i} className="border-rule">
              <AccordionTrigger className="items-center rounded-none py-4 text-lg font-semibold hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-ink-muted">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
