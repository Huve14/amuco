import { cookies } from "next/headers";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

const VALID_SCENTS = ["Summer Rain", "Shishanyama", "Your mom is cooking briyani"];

function getSessionToken() {
  return crypto
    .createHash("sha256")
    .update("amuco-admin::" + process.env.ADMIN_PASSWORD?.trim())
    .digest("hex");
}

async function isAuthenticated() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === getSessionToken();
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return Response.json({ error: "Failed to fetch data." }, { status: 500 });

  const total = data.length;

  // Scent tally
  const scentTally = VALID_SCENTS.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
  data.forEach((r) => { if (scentTally[r.favorite_scent] !== undefined) scentTally[r.favorite_scent]++; });

  // Age distribution
  const ageBuckets = { "Under 18": 0, "18–24": 0, "25–34": 0, "35–44": 0, "45+": 0 };
  data.forEach((r) => {
    const a = r.age;
    if (a < 18) ageBuckets["Under 18"]++;
    else if (a <= 24) ageBuckets["18–24"]++;
    else if (a <= 34) ageBuckets["25–34"]++;
    else if (a <= 44) ageBuckets["35–44"]++;
    else ageBuckets["45+"]++;
  });

  // Average age
  const avgAge = total > 0
    ? Math.round(data.reduce((sum, r) => sum + (r.age || 0), 0) / total)
    : 0;

  // Today's responses
  const today = new Date().toDateString();
  const todayCount = data.filter((r) => new Date(r.created_at).toDateString() === today).length;

  // Responses by day (last 14 days)
  const byDay = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    byDay[d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })] = 0;
  }
  data.forEach((r) => {
    const label = new Date(r.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
    if (label in byDay) byDay[label]++;
  });

  // Leading scent
  const leadingScent = Object.entries(scentTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  // Recent 20
  const recent = [...data].reverse().slice(0, 20);

  return Response.json({
    total,
    avgAge,
    todayCount,
    leadingScent,
    scentTally,
    ageBuckets,
    byDay,
    recent,
  });
}
