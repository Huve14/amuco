"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { resolveLocation } from "@/lib/locations";

const SCENTS = [
  {
    id: "Summer Rain",
    label: "Summer Rain",
    description: "The crisp electric smell of asphalt meeting afternoon rain.",
    icon: "water_drop",
    iconColor: "text-[#b8f568]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBZwutAiknR_w1mZYmSehVM7dENUxD95KZyifuGAAk6rrayNxXgSYW4_WboG14fwKr3QwYu98RzFcV_4rY4Fo2T111TIhZhyDlhOTbebwhz_BeoMv0X4KlyP8P42dUg8ShUGJ6YvSJCXdaU4eNk6lbYS_F2uX8nmYoIBEyDWK3i4s9EJ5G_2-gDk_aSIq3cKbFnVHdMmXA7C5FNoGqn6Cx1KnKxiSv6pUbG9CPSq_DmA-rs7cY4T8a58eR98sYBfwwTcfzsbxDZdI",
  },
  {
    id: "Shishanyama",
    label: "Shishanyama",
    description: "Smoky woodfire, charcoal, and the soul of a community fire.",
    icon: "local_fire_department",
    iconColor: "text-[#fd9924]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_ZedsPaM2u3PPCUyYwoA7spcFhcPPN4nt0mjhPDAtskAD877i1VM8iaaFfa_ozP9z-AM6B0QV2RbBAQRKq01YjihwVFgZOXUrHlj92ptZZMeDEyog-WD0oRpauJRMzROQHYqFznB7VtoHOyTtb0J9eJ2zRqxBpCfsxRa16DC9l-ISJJgPdQjYKMF8JzrjQFP-5UDpOKWOgsNEWZLKx9rDes2EPaDwZBPFsG7j47B_cJyjgzDvB6Tg_QoJdca-PapcqrVr_N84lAE",
  },
  {
    id: "Amagwinya",
    label: "Amagwinya",
    description: "Hot dough pockets straight from the pan, the taste of home.",
    icon: "restaurant",
    iconColor: "text-[#b8f568]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGSwDl8QAo2j8j8ocFKcNeygk4Xnf6CpF__6agCvBEoPD3nLelk62Cyetn6OFre-4LOBtfdmdKrI5EcxhfKnbyNadxvbyCG9t9Kd0HeIWK3h-l2usuXz73X8oFqmUaYdncVevOk8p0xevDI4zf4uEdB80Z-oI2LKxW4kEKg5HDGDzMTKgRe0oruRsOc9WYSzXP0ssHWOb0_YiUUrEm6lsBAYVMsUympFbBdlCK2VNg-XQlfq2j_0WEb2Z6XlcaQmgsf8Zz3SQHm6k",
  },
];

function SurveyForm() {
  const searchParams = useSearchParams();
  const locSlug = searchParams.get("loc");
  const locationMeta = resolveLocation(locSlug);

  const [selectedScent, setSelectedScent] = useState("Summer Rain");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!age || isNaN(parseInt(age)) || parseInt(age) < 1 || parseInt(age) > 120)
      return setError("Please enter a valid age.");
    if (!selectedScent) return setError("Please select a scent.");

    setLoading(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          age: parseInt(age),
          favorite_scent: selectedScent,
          location: locSlug,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (submitted) {
    const scent = SCENTS.find((s) => s.id === selectedScent);
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0e1111" }}>
        <div className="text-center max-w-md">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: "#b8f568", boxShadow: "0 0 40px rgba(184,245,104,0.4)" }}
          >
            <span className="material-symbols-outlined text-5xl" style={{ color: "#112000" }}>bolt</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            Vibe <span style={{ color: "#b8f568", fontStyle: "italic" }}>activated.</span>
          </h1>
          <p className="text-lg mb-1" style={{ color: "#c2c9b3" }}>
            Your essence has been captured —
          </p>
          <p className="text-xl font-bold text-white mb-2">{scent?.label}</p>
          <p className="text-sm mb-10" style={{ color: "#c2c9b3" }}>
            Thanks {fullName.split(" ")[0]}. We've locked in your signature.
          </p>
          <button
            onClick={() => { setSubmitted(false); setFullName(""); setAge(""); setSelectedScent("Summer Rain"); }}
            className="px-8 py-3 rounded-full border text-sm font-semibold transition-all"
            style={{ borderColor: "#424938", color: "#c2c9b3" }}
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32" style={{ backgroundColor: "#0e1111", minHeight: "100vh" }}>

      {/* Sticky TopAppBar */}
      <header
        className="sticky top-0 z-50 w-full h-20 border-b"
        style={{ backgroundColor: "rgba(17,20,20,0.85)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex justify-between items-center w-full px-6 h-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl font-bold" style={{ color: "#b8f568" }}>bubble_chart</span>
            <span className="text-2xl font-black italic text-white tracking-tight">ScentVibe</span>
          </div>
          <button style={{ color: "#c2c9b3" }} className="hover:text-white transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <main>
        <div className="max-w-xl mx-auto px-6 py-12">

          {/* Amuco Logo */}
          <div className="flex flex-col items-center mb-12 gap-3">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: "white", boxShadow: "0 0 40px rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <img src="/amuco-logo.jpg" alt="AMUCO 600" className="h-10 w-auto object-contain" />
            </div>
            {locationMeta && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: "rgba(184,245,104,0.1)", border: "1px solid rgba(184,245,104,0.2)", color: "#b8f568" }}
              >
                <span className="material-symbols-outlined text-sm">location_on</span>
                {locationMeta.name} · {locationMeta.area}
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#b8f568" }}>
                Discovery Phase
              </span>
              <span className="text-[10px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                STEP 01/02
              </span>
            </div>
            <div className="h-1 w-full rounded-full flex gap-1" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
              <div className="h-full w-1/2 rounded-full step-active" />
              <div className="h-full w-1/2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
            </div>
          </div>

          {/* Header */}
          <section className="mb-12 text-center">
            <h2 className="font-black text-white mb-4" style={{ fontSize: "44px", lineHeight: 1, letterSpacing: "-0.02em" }}>
              Capture{" "}
              <span style={{ color: "#b8f568", fontStyle: "italic" }}>the Vibe</span>
            </h2>
            <p className="mx-auto max-w-[85%]" style={{ color: "#c2c9b3", fontSize: "16px", lineHeight: 1.5 }}>
              Introduce yourself and help us isolate your signature Mzansi essence.
            </p>
          </section>

          {/* Form */}
          <form id="survey-form" onSubmit={handleSubmit} className="space-y-12">

            {/* Name + Age — floating label inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="relative">
                <input
                  id="full_name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder=" "
                  maxLength={100}
                  className="minimal-input peer"
                />
                <label
                  htmlFor="full_name"
                  className="float-label"
                >
                  Identity / Full Name
                </label>
              </div>
              <div className="relative">
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder=" "
                  min="1"
                  max="120"
                  className="minimal-input peer"
                />
                <label
                  htmlFor="age"
                  className="float-label"
                >
                  How old are you?
                </label>
              </div>
            </div>

            {/* Scent Gallery */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h3
                  className="text-xs font-bold uppercase tracking-[0.3em] whitespace-nowrap"
                  style={{ color: "#fd9924" }}
                >
                  Select Your Aura
                </h3>
                <div className="h-px flex-grow" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
              </div>

              <div className="flex flex-col gap-4">
                {SCENTS.map((scent) => (
                  <label key={scent.id} className="relative block cursor-pointer">
                    <input
                      type="radio"
                      name="favorite_scent"
                      value={scent.id}
                      checked={selectedScent === scent.id}
                      onChange={() => setSelectedScent(scent.id)}
                      className="sr-only custom-radio"
                    />
                    <div
                      className="selection-card relative h-48 rounded-2xl overflow-hidden border-2 border-transparent transition-all duration-500"
                      style={{
                        backgroundImage: `url('${scent.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                      }}
                    >
                      {/* Dark overlay */}
                      <div
                        className="card-overlay absolute inset-0 transition-colors duration-500"
                        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                      />
                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="flex justify-between items-end">
                          <div>
                            <h4 className="text-white text-2xl font-bold mb-1">{scent.label}</h4>
                            <p className="text-sm leading-snug max-w-[80%]" style={{ color: "rgba(255,255,255,0.7)" }}>
                              {scent.description}
                            </p>
                          </div>
                          <span className={`material-symbols-outlined text-3xl ${scent.iconColor}`}>
                            {scent.icon}
                          </span>
                        </div>
                      </div>
                      {/* Check badge */}
                      <div
                        className="check-badge absolute top-4 right-4 rounded-full p-1 opacity-0 scale-50 transition-all duration-300"
                        style={{ backgroundColor: "#b8f568" }}
                      >
                        <span className="material-symbols-outlined text-lg block" style={{ color: "#112000" }}>
                          check
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: "rgba(186,26,26,0.15)", border: "1px solid rgba(186,26,26,0.4)", color: "#ff8a80" }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="glow-button w-full py-5 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(90deg, #fd9924, #b8f568)",
                  color: "#112000",
                }}
              >
                <span className="tracking-tight">
                  {loading ? "ACTIVATING..." : "ACTIVATE MY SCENT"}
                </span>
                {!loading && (
                  <span className="material-symbols-outlined text-2xl" style={{ animation: "pulse 2s infinite" }}>
                    bolt
                  </span>
                )}
              </button>
              <p
                className="text-center text-[10px] uppercase tracking-widest mt-6"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                Secured via ScentVibe Encrypted Vibe Protocol
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Consent Notice */}
      <div className="max-w-xl mx-auto px-6 pb-8 text-center">
        <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
          By submitting this form you consent to the collection and processing of your personal information
          (name and age) in accordance with the Protection of Personal Information Act (POPIA), Act 4 of 2013.
          Your data is collected solely for the purpose of this survey and will not be shared with third parties
          without your consent. You may request access to or deletion of your information at any time.
        </p>
      </div>

      {/* Bottom Navigation — Activate only */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center px-4 py-4 rounded-t-[32px]"
        style={{
          backgroundColor: "rgba(14,17,17,0.92)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <button
          type="submit"
          form="survey-form"
          className="flex flex-col items-center justify-center rounded-2xl px-10 py-3 transition-all active:scale-90"
          style={{
            backgroundColor: "#b8f568",
            color: "#112000",
            boxShadow: "0 0 20px rgba(184,245,104,0.3)",
          }}
        >
          <span className="material-symbols-outlined mb-0.5">bolt</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Activate</span>
        </button>
      </nav>
    </div>
  );
}

export default function SurveyPage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "#0e1111", minHeight: "100vh" }} />}>
      <SurveyForm />
    </Suspense>
  );
}
