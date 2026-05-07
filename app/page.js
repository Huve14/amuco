"use client";
import { useState } from "react";

const SCENTS = [
  {
    id: "Summer Rain",
    emoji: "🌧️",
    label: "Summer Rain",
    description: "That first drop hitting hot concrete. Cool, earthy, electric.",
    palette: "from-blue-900 to-slate-800",
    border: "border-blue-500",
    ring: "ring-blue-400",
    badge: "bg-blue-500/20 text-blue-300",
  },
  {
    id: "Shishanyama",
    emoji: "🔥",
    label: "Shishanyama",
    description: "Smoke, char, and braai vibes. The smell of a Friday done right.",
    palette: "from-orange-900 to-red-900",
    border: "border-orange-500",
    ring: "ring-orange-400",
    badge: "bg-orange-500/20 text-orange-300",
  },
  {
    id: "Your mom is cooking briyani",
    emoji: "🍛",
    label: "Your mom is cooking briyani",
    description: "Cardamom, saffron, love. The whole street knows something good is happening.",
    palette: "from-yellow-900 to-amber-900",
    border: "border-yellow-500",
    ring: "ring-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300",
  },
];

export default function SurveyPage() {
  const [step, setStep] = useState("survey");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [selectedScent, setSelectedScent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!age || isNaN(parseInt(age)) || parseInt(age) < 1 || parseInt(age) > 120)
      return setError("Please enter a valid age.");
    if (!selectedScent) return setError("Please pick your scent.");

    setLoading(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName.trim(), age: parseInt(age), favorite_scent: selectedScent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStep("success");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (step === "success") {
    const scent = SCENTS.find((s) => s.id === selectedScent);
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6 animate-bounce">{scent?.emoji}</div>
          <h1 className="text-3xl font-bold text-white mb-3">You smell like a vibe.</h1>
          <p className="text-gray-400 text-lg mb-2">
            <span className="text-white font-semibold">{scent?.label}</span> — that tracks.
          </p>
          <p className="text-gray-500 text-sm mt-6">
            Thanks {fullName.split(" ")[0]}. Your pick has been captured.
          </p>
          <button
            onClick={() => { setStep("survey"); setFullName(""); setAge(""); setSelectedScent(null); }}
            className="mt-8 px-6 py-3 rounded-full border border-white/20 text-white/60 text-sm hover:text-white hover:border-white/40 transition-all"
          >
            Take it again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="flex justify-center mb-8">
          <img
            src="/amuco-logo.jpg"
            alt="Amuco 600"
            className="h-16 md:h-20 w-auto object-contain"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          What does your SA<br />smell like?
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Close your eyes. Pick the one that hits different.<br />
          No wrong answers — only real ones.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 pb-20 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              maxLength={100}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              min="1"
              max="120"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-gray-500 mb-4 block">Pick your scent</label>
          <div className="space-y-3">
            {SCENTS.map((scent) => {
              const selected = selectedScent === scent.id;
              return (
                <button
                  key={scent.id}
                  type="button"
                  onClick={() => setSelectedScent(scent.id)}
                  className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 ${
                    selected
                      ? `bg-gradient-to-r ${scent.palette} ${scent.border} ring-2 ${scent.ring}`
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl flex-shrink-0">{scent.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-white text-base">{scent.label}</span>
                        {selected && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scent.badge}`}>
                            selected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 leading-snug">{scent.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      selected ? `${scent.border} bg-white` : "border-white/20"
                    }`}>
                      {selected && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-base"
        >
          {loading ? "Sending..." : "Submit my pick →"}
        </button>

        <p className="text-center text-xs text-gray-600">
          Your response is used for product research only.
        </p>
      </form>
    </div>
  );
}
