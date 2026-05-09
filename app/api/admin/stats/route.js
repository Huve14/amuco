import { cookies } from "next/headers";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { LOCATIONS } from "@/lib/locations";

const VALID_SCENTS = ["Summer Rain", "Shisanyama", "Amagwinya"];

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

function buildStats(data, today) {
  const total = data.length;

  const scentTally = VALID_SCENTS.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
  data.forEach((r) => { if (scentTally[r.favorite_scent] !== undefined) scentTally[r.favorite_scent]++; });

  const ageBuckets = { "Under 18": 0, "18–24": 0, "25–34": 0, "35–44": 0, "45+": 0 };
  data.forEach((r) => {
    const a = r.age;
    if (a < 18) ageBuckets["Under 18"]++;
    else if (a <= 24) ageBuckets["18–24"]++;
    else if (a <= 34) ageBuckets["25–34"]++;
    else if (a <= 44) ageBuckets["35–44"]++;
    else ageBuckets["45+"]++;
  });

  const avgAge = total > 0
    ? Math.round(data.reduce((sum, r) => sum + (r.age || 0), 0) / total)
    : 0;

  const todayCount = data.filter((r) => new Date(r.created_at).toDateString() === today).length;

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

  const leadingScent = Object.entries(scentTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const recent = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20);

  return { total, avgAge, todayCount, leadingScent, scentTally, ageBuckets, byDay, recent };
}

export async function GET(req) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const locationFilter = searchParams.get("location");

  const { data: allData, error } = await supabase
    .from("participants")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return Response.json({ error: "Failed to fetch data." }, { status: 500 });

  const today = new Date().toDateString();

  // Filter data if location tab selected
  const filteredData = locationFilter && LOCATIONS[locationFilter]
    ? allData.filter((r) => r.location === locationFilter)
    : allData;

  const mainStats = buildStats(filteredData, today);

  // Per-location leaderboard (always uses all data)
  const locationStats = Object.entries(LOCATIONS).map(([slug, meta]) => {
    const rows = allData.filter((r) => r.location === slug);
    const scentTally = VALID_SCENTS.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    rows.forEach((r) => { if (scentTally[r.favorite_scent] !== undefined) scentTally[r.favorite_scent]++; });
    const leadingScent = Object.entries(scentTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const todayCount = rows.filter((r) => new Date(r.created_at).toDateString() === today).length;
    const isLive = new Date(meta.launch) <= new Date();
    return { slug, ...meta, total: rows.length, todayCount, leadingScent, scentTally, isLive };
  }).sort((a, b) => b.total - a.total);

  return Response.json({ ...mainStats, locationStats, activeFilter: locationFilter || null });
}
