"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LOCATIONS } from "@/lib/locations";

const SCENT_META = {
  "Summer Rain":                   { emoji: "🌧️", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  "Shishanyama":                   { emoji: "🔥", color: "#fd9924", bg: "rgba(253,153,36,0.15)" },
  "Your mom is cooking briyani":   { emoji: "🍛", color: "#b8f568", bg: "rgba(184,245,104,0.15)" },
};

const RANK_ICONS = ["emoji_events", "workspace_premium", "military_tech"];
const RANK_COLORS = ["#fbbf24", "#94a3b8", "#cd7c2f"];

function KpiCard({ icon, label, value, sub, accent }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-3"
      style={{ backgroundColor: "#111414", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#c2c9b3" }}>{label}</span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: accent + "22" }}
        >
          <span className="material-symbols-outlined text-lg" style={{ color: accent }}>{icon}</span>
        </div>
      </div>
      <p className="text-4xl font-black text-white tracking-tight">{value}</p>
      {sub && <p className="text-xs" style={{ color: "#c2c9b3" }}>{sub}</p>}
    </div>
  );
}

function BarRow({ label, emoji, count, total, color, bg }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-white">
          <span>{emoji}</span>
          <span className="truncate max-w-[180px]">{label}</span>
        </span>
        <span className="font-black text-lg text-white ml-4">{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}
        />
      </div>
      <p className="text-xs" style={{ color: "#c2c9b3" }}>{count} vote{count !== 1 ? "s" : ""}</p>
    </div>
  );
}

function MiniBar({ label, count, max }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-16 text-right shrink-0" style={{ color: "#c2c9b3" }}>{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#b8f568" }} />
      </div>
      <span className="text-xs font-bold text-white w-6 shrink-0">{count}</span>
    </div>
  );
}

function SparkBar({ label, count, max }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="w-full flex flex-col justify-end" style={{ height: "60px" }}>
        <div
          className="w-full rounded-t"
          style={{
            height: `${Math.max(pct, count > 0 ? 8 : 0)}%`,
            backgroundColor: count > 0 ? "#b8f568" : "rgba(255,255,255,0.06)",
            minHeight: count > 0 ? "4px" : "0",
          }}
        />
      </div>
      <span className="text-[9px] text-center leading-tight" style={{ color: "#c2c9b3" }}>{label}</span>
    </div>
  );
}

function LocationCard({ loc, rank }) {
  const rankIcon = RANK_ICONS[rank];
  const rankColor = RANK_COLORS[rank] || "#c2c9b3";
  const leadingMeta = loc.leadingScent ? SCENT_META[loc.leadingScent] : null;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
      style={{
        backgroundColor: "#111414",
        border: rank === 0 ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: rank === 0 ? "0 0 24px rgba(251,191,36,0.08)" : "none",
      }}
    >
      {/* Rank badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {rankIcon && (
            <span className="material-symbols-outlined text-base" style={{ color: rankColor }}>{rankIcon}</span>
          )}
          <span className="text-xs font-black uppercase tracking-wider" style={{ color: rankColor }}>
            #{rank + 1}
          </span>
        </div>
        {loc.isLive ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(184,245,104,0.12)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#b8f568] animate-pulse" />
            <span className="text-[10px] font-bold" style={{ color: "#b8f568" }}>LIVE</span>
          </div>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#c2c9b3" }}>
            UPCOMING
          </span>
        )}
      </div>

      {/* Location info */}
      <div>
        <p className="font-black text-white text-base leading-tight">{loc.name}</p>
        <p className="text-xs mt-0.5" style={{ color: "#c2c9b3" }}>{loc.area}</p>
      </div>

      {/* Stats */}
      <div className="flex items-end justify-between mt-auto pt-1">
        <div>
          <p className="text-3xl font-black text-white tracking-tight">{loc.total}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "#c2c9b3" }}>
            responses · {loc.todayCount} today
          </p>
        </div>
        {leadingMeta && (
          <div
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
            style={{ backgroundColor: leadingMeta.color + "18", color: leadingMeta.color }}
          >
            <span>{leadingMeta.emoji}</span>
            <span className="hidden sm:inline truncate max-w-[80px]">{loc.leadingScent}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // null = All Locations
  const router = useRouter();

  const fetchStats = useCallback((locationSlug) => {
    setLoading(true);
    const url = locationSlug ? `/api/admin/stats?location=${locationSlug}` : "/api/admin/stats";
    fetch(url)
      .then((r) => {
        if (r.status === 401) { setAuthError(true); setLoading(false); return null; }
        return r.json();
      })
      .then((d) => { if (d) { setStats(d); setLoading(false); } })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStats(activeTab);
  }, [activeTab, fetchStats]);

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0e1111" }}>
        <div className="text-center">
          <p className="text-white font-bold mb-4">Session expired or not authorised.</p>
          <button onClick={() => router.push("/admin")} className="px-6 py-3 rounded-xl text-sm font-bold" style={{ backgroundColor: "#b8f568", color: "#112000" }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0e1111" }}>
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 rounded-full mx-auto animate-spin" style={{ borderColor: "#b8f568", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "#c2c9b3" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const scentEntries = Object.entries(stats.scentTally);
  const ageEntries = Object.entries(stats.ageBuckets);
  const maxAge = Math.max(...ageEntries.map(([, v]) => v), 1);
  const dayEntries = Object.entries(stats.byDay);
  const maxDay = Math.max(...dayEntries.map(([, v]) => v), 1);
  const leadingMeta = SCENT_META[stats.leadingScent] || { emoji: "🫧", color: "#b8f568" };
  const locationList = stats.locationStats || [];

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: "#0e1111" }}>

      {/* Header */}
      <header
        className="sticky top-0 z-50 w-full h-16 border-b"
        style={{ backgroundColor: "rgba(14,17,17,0.9)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/amuco-logo.jpg" alt="AMUCO 600" className="h-7 w-auto object-contain" />
            <div className="h-5 w-px mx-1" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base" style={{ color: "#b8f568" }}>analytics</span>
              <span className="text-sm font-bold text-white tracking-wide">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(184,245,104,0.1)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#b8f568] animate-pulse" />
              <span className="text-xs font-bold" style={{ color: "#b8f568" }}>LIVE</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:text-white"
              style={{ color: "#c2c9b3", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Page title */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-1" style={{ color: "#b8f568" }}>Amuco 600 · Survey Intelligence</p>
          <h1 className="text-3xl font-black text-white tracking-tight">Scent <span style={{ color: "#b8f568", fontStyle: "italic" }}>Analytics</span></h1>
        </div>

        {/* Location Leaderboard */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#fd9924" }}>
              Location Leaderboard
            </h2>
            <div className="h-px flex-grow" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {locationList.map((loc, i) => (
              <LocationCard key={loc.slug} loc={loc} rank={i} />
            ))}
          </div>
        </div>

        {/* Location Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab(null)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={
              activeTab === null
                ? { backgroundColor: "#b8f568", color: "#112000" }
                : { backgroundColor: "rgba(255,255,255,0.05)", color: "#c2c9b3", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            All Locations
          </button>
          {Object.entries(LOCATIONS).map(([slug, meta]) => (
            <button
              key={slug}
              onClick={() => setActiveTab(slug)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={
                activeTab === slug
                  ? { backgroundColor: "#b8f568", color: "#112000" }
                  : { backgroundColor: "rgba(255,255,255,0.05)", color: "#c2c9b3", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {meta.name}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon="group" label="Total Responses" value={stats.total} sub={activeTab ? LOCATIONS[activeTab]?.name : "All locations"} accent="#b8f568" />
          <KpiCard icon="today" label="Today" value={stats.todayCount} sub="New submissions" accent="#fd9924" />
          <KpiCard icon="person" label="Avg. Age" value={stats.avgAge > 0 ? stats.avgAge : "—"} sub="Years old" accent="#60a5fa" />
          <KpiCard
            icon="emoji_nature"
            label="Leading Scent"
            value={leadingMeta.emoji}
            sub={stats.leadingScent !== "—" ? stats.leadingScent : "No data yet"}
            accent={leadingMeta.color}
          />
        </div>

        {/* Middle row: Scent breakdown + Age distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Scent Breakdown */}
          <div
            className="rounded-2xl p-6 space-y-6"
            style={{ backgroundColor: "#111414", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-base">Scent Breakdown</h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(184,245,104,0.12)", color: "#b8f568" }}>
                {stats.total} votes
              </span>
            </div>
            {stats.total === 0 ? (
              <p className="text-sm py-8 text-center" style={{ color: "#c2c9b3" }}>No responses yet.</p>
            ) : (
              <div className="space-y-5">
                {scentEntries.sort((a, b) => b[1] - a[1]).map(([scent, count]) => {
                  const meta = SCENT_META[scent] || { emoji: "🫧", color: "#b8f568" };
                  return (
                    <BarRow
                      key={scent}
                      label={scent}
                      emoji={meta.emoji}
                      count={count}
                      total={stats.total}
                      color={meta.color}
                      bg={meta.bg}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Age Distribution */}
          <div
            className="rounded-2xl p-6 space-y-5"
            style={{ backgroundColor: "#111414", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-base">Age Distribution</h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>
                Avg: {stats.avgAge || "—"}
              </span>
            </div>
            {stats.total === 0 ? (
              <p className="text-sm py-8 text-center" style={{ color: "#c2c9b3" }}>No responses yet.</p>
            ) : (
              <div className="space-y-3 pt-2">
                {ageEntries.map(([label, count]) => (
                  <MiniBar key={label} label={label} count={count} max={maxAge} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Response Timeline */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "#111414", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-white text-base">Response Timeline</h2>
            <span className="text-xs" style={{ color: "#c2c9b3" }}>Last 14 days</span>
          </div>
          {stats.total === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: "#c2c9b3" }}>No responses yet.</p>
          ) : (
            <div className="flex items-end gap-1.5 overflow-x-auto pb-1">
              {dayEntries.map(([label, count]) => (
                <SparkBar key={label} label={label} count={count} max={maxDay} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Responses Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "#111414", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="font-bold text-white text-base">Recent Responses</h2>
            <span className="text-xs" style={{ color: "#c2c9b3" }}>Last {stats.recent.length}</span>
          </div>
          {stats.recent.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-4xl block mb-3">🫧</span>
              <p className="text-sm" style={{ color: "#c2c9b3" }}>No responses yet. Share the survey link!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Name", "Age", "Scent", "Location", "Submitted"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: "#c2c9b3" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((r) => {
                    const meta = SCENT_META[r.favorite_scent] || { emoji: "🫧", color: "#b8f568" };
                    const locMeta = r.location ? LOCATIONS[r.location] : null;
                    return (
                      <tr key={r.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td className="px-6 py-3.5 font-medium text-white">{r.full_name}</td>
                        <td className="px-6 py-3.5" style={{ color: "#c2c9b3" }}>{r.age}</td>
                        <td className="px-6 py-3.5">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: meta.color + "18", color: meta.color }}
                          >
                            {meta.emoji} {r.favorite_scent}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          {locMeta ? (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{ backgroundColor: "rgba(184,245,104,0.08)", color: "#b8f568", border: "1px solid rgba(184,245,104,0.15)" }}
                            >
                              <span className="material-symbols-outlined text-xs">location_on</span>
                              {locMeta.name}
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-xs" style={{ color: "#c2c9b3" }}>
                          {new Date(r.created_at).toLocaleDateString("en-ZA", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
