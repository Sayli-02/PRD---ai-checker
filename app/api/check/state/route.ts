import type { CheckResult } from "@/lib/check/analyze";
import { db, json } from "@/lib/check/server";

type Check = {
  status: "created" | "running" | "done" | "failed";
  domain: string;
  category: string;
  city: string;
  result: CheckResult | null;
};

// Lets the page resume after a reload. The result is only returned once the mobile is verified.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: "Check not found" }, 404);

  const supabase = db();
  const { data } = await supabase
    .from("checks")
    .select("status, domain, category, city, result")
    .eq("id", id)
    .maybeSingle();
  const check = data as Check | null;
  if (!check) return json({ error: "Check not found" }, 404);

  const { data: lead } = await supabase.from("leads").select("verified_at").eq("check_id", id).maybeSingle();
  const verified = !!(lead as { verified_at: string | null } | null)?.verified_at;

  const business = { domain: check.domain, category: check.category, city: check.city };
  if (!verified || !check.result) return json({ status: check.status, business });

  // The rest of the report stays locked: only these fields leave the server.
  const { score, mentions, total, competitors, sourceCount, quickFix } = check.result;
  return json({
    status: "verified",
    business,
    result: { score, mentions, total, competitors, sourceCount, quickFix },
  });
}
