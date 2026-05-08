"use client";
import { useState, useEffect } from "react";

const SCENT_META = {
  "Summer Rain": { emoji: "🌧️", color: "bg-blue-500" },
  "Shishanyama": { emoji: "🔥", color: "bg-orange-500" },
  "Amagwinya": { emoji: "🥟", color: "bg-yellow-500" },
};

export default function ResultsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/survey")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Could not load results."); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const total = data?.total || 0;

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <div className="flex mb-5">
            <img src="/amuco-logo.jpg" alt="Amuco 600" className="h-10 w-auto object-contain" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">Survey · Results</p>
          <h1 className="text-3xl font-bold mb-2">What does SA smell like?</h1>
          <p className="text-gray-400">{total} response{total !== 1 ? "s" : ""} so far</p>
        </div>

        {total > 0 && (
          <div className="space-y-4 mb-12">
            {Object.entries(data.tally || {}).map(([scent, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const meta = SCENT_META[scent] || { emoji: "🫧", color: "bg-gray-500" };
              return (
                <div key={scent} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meta.emoji}</span>
                      <span className="font-medium text-sm">{scent}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">{pct}%</span>
                      <span className="text-gray-500 text-xs ml-2">{count} votes</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${meta.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {total === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-4">🫧</p>
            <p>No responses yet. Share the link!</p>
          </div>
        )}


        <div className="mt-8 text-center">
          <a href="/" className="text-gray-600 text-sm hover:text-gray-400 transition-colors">← Back to survey</a>
        </div>
      </div>
    </div>
  );
}
