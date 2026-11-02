// Saved sample answers in the shapes the engines return. They are hand-written to match the formats we ask for
// (numbered bold list, bullets, a paragraph with no list, citation markers). Replace or add real captured
// answers here once API keys are available, then re-run `npm test`.

export const numberedBold = [
  "1. **Orchid Dental Care** - well reviewed for family dentistry",
  "2. **Nova Dental Studio** - modern clinic with evening hours",
  "3. **SmileCare Dental Pvt Ltd** - good for root canals",
  "4. **Pune Dental Hub** - affordable",
].join("\n");

export const bulletsWithCitations = [
  "- Orchid Dental Care [1]: trusted by locals",
  "- Pune Dental Hub [2]: budget friendly",
  "* Nova Dental Studio (Baner): open late",
].join("\n");

export const paragraphOnly =
  "Several clinics in Pune are well regarded, including Orchid Dental Care and Nova Dental Studio. Check recent reviews before booking.";

export const withOwnSiteCitation = ["1. **Orchid Dental Care** - well reviewed", "2. **Nova Dental Studio** - modern"].join("\n");
