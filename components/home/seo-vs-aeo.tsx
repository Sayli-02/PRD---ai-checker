import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { home } from "@/content/home";
import { Reveal } from "./reveal";

const c = home.compare;

// A real table for screen readers. Below md each row stacks and each cell prints its column name.
export function SeoVsAeo() {
  return (
    <Section tone="cream" containerClassName="py-14 md:py-20">
      <Reveal>
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-[2.25rem] leading-[1.08] sm:text-5xl">{c.title}</h2>
      </Reveal>

      <table className="mt-8 block w-full border-collapse md:table">
        <caption className="sr-only">{c.title}</caption>
        <thead className="sr-only md:not-sr-only md:table-header-group">
          <tr className="border-b border-tone-line text-left">
            <td className="w-1/4" />
            {c.columns.map((col, i) => (
              <th key={col} scope="col" className="px-4 py-3 align-bottom font-normal">
                <span className="block font-serif text-3xl">{col}</span>
                <span className="text-sm text-tone-muted">{c.subtitles[i]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {c.rows.map((row) => (
            <tr key={row.label} className="block border-b border-tone-line py-4 md:table-row md:py-0">
              <th scope="row" className="block pb-2 text-left font-semibold md:table-cell md:px-0 md:py-5 md:pr-4 md:align-top">
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td
                  key={c.columns[i]}
                  data-label={c.columns[i]}
                  className="block py-1 before:mr-2 before:text-xs before:font-semibold before:tracking-[0.14em] before:text-accent-strong before:content-[attr(data-label)] md:table-cell md:px-4 md:py-5 md:align-top md:before:hidden"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 max-w-xl text-lg text-tone-muted">{c.note}</p>
    </Section>
  );
}
