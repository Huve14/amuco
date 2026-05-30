"use client";
import { useState, useEffect, Component } from "react";
import { resolveLocation } from "@/lib/locations";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ backgroundColor: "#0e1111", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ color: "#ff8a80", textAlign: "center", maxWidth: "400px" }}>
            <p style={{ fontSize: "clamp(14px, 2vw, 18px)", marginBottom: "8px" }}>Something went wrong.</p>
            <p style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: "rgba(255,255,255,0.4)", wordBreak: "break-all" }}>{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: "16px", padding: "8px 24px", backgroundColor: "#b8f568", color: "#112000", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const SCENTS = [
  {
    id: "Summer Rain",
    label: "Summer Rain",
    description: "The crisp electric smell of asphalt meeting afternoon rain.",
    icon: "water_drop",
    iconColor: "text-[#b8f568]",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBZwutAiknR_w1mZYmSehVM7dENUxD95KZyifuGAAk6rrayNxXgSYW4_WboG14fwKr3QwYu98RzFcV_4rY4Fo2T111TIhZhyDlhOTbebwhz_BeoMv0X4KlyP8P42dUg8ShUGJ6YvSJCXdaU4eNk6lbYS_F2uX8nmYoIBEyDWK3i4s9EJ5G_2-gDk_aSIq3cKbFnVHdMmXA7C5FNoGqn6Cx1KnKxiSv6pUbG9CPSq_DmA-rs7cY4T8a58eR98sYBfwwTcfzsbxDZdI",
  },
  {
    id: "Shisanyama",
    label: "Shisanyama",
    description: "Smoky woodfire, charcoal, and the soul of a community fire.",
    icon: "local_fire_department",
    iconColor: "text-[#fd9924]",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_ZedsPaM2u3PPCUyYwoA7spcFhcPPN4nt0mjhPDAtskAD877i1VM8iaaFfa_ozP9z-AM6B0QV2RbBAQRKq01YjihwVFgZOXUrHlj92ptZZMeDEyog-WD0oRpauJRMzROQHYqFznB7VtoHOyTtb0J9eJ2zRqxBpCfsxRa16DC9l-ISJJgPdQjYKMF8JzrjQFP-5UDpOKWOgsNEWZLKx9rDes2EPaDwZBPFsG7j47B_cJyjgzDvB6Tg_QoJdca-PapcqrVr_N84lAE",
  },
  {
    id: "Amagwinya",
    label: "Amagwinya",
    description: "Hot dough pockets straight from the pan, the taste of home.",
    icon: "restaurant",
    iconColor: "text-[#b8f568]",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGSwDl8QAo2j8j8ocFKcNeygk4Xnf6CpF__6agCvBEoPD3nLelk62Cyetn6OFre-4LOBtfdmdKrI5EcxhfKnbyNadxvbyCG9t9Kd0HeIWK3h-l2usuXz73X8oFqmUaYdncVevOk8p0xevDI4zf4uEdB80Z-oI2LKxW4kEKg5HDGDzMTKgRe0oruRsOc9WYSzXP0ssHWOb0_YiUUrEm6lsBAYVMsUympFbBdlCK2VNg-XQlfq2j_0WEb2Z6XlcaQmgsf8Zz3SQHm6k",
  },
];

function SurveyForm() {
  const [locSlug, setLocSlug] = useState(null);
  const [locationMeta, setLocationMeta] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("loc");
    setLocSlug(slug);
    setLocationMeta(resolveLocation(slug));
  }, []);

  const [selectedScent, setSelectedScent] = useState("Summer Rain");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!age || isNaN(parseInt(age)) || parseInt(age) < 1 || parseInt(age) > 120)
      return setError("Please enter a valid age.");
    if (!email.trim() && !contactNumber.trim())
      return setError("Please enter your email address or contact number.");
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError("Please enter a valid email address.");
    if (!selectedScent) return setError("Please select a scent.");

    setLoading(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          age: parseInt(age),
          email: email.trim() || null,
          contact_number: contactNumber.trim() || null,
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
      <div style={{ backgroundColor: "#0e1111", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px, 4vw, 32px)" }}>
        <div style={{ textAlign: "center", width: "100%", maxWidth: "clamp(280px, 50vw, 480px)" }}>
          <div style={{
            width: "clamp(72px, 12vw, 112px)",
            height: "clamp(72px, 12vw, 112px)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto clamp(20px, 4vw, 36px)",
            backgroundColor: "#b8f568",
            boxShadow: "0 0 40px rgba(184,245,104,0.4)",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "clamp(32px, 6vw, 56px)", color: "#112000" }}>bolt</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 44px)", fontWeight: 900, color: "white", marginBottom: "clamp(8px, 1.5vw, 14px)", letterSpacing: "-0.02em" }}>
            Vibe <span style={{ color: "#b8f568", fontStyle: "italic" }}>activated.</span>
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 20px)", marginBottom: "6px", color: "#c2c9b3" }}>
            Your essence has been captured —
          </p>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 700, color: "white", marginBottom: "8px" }}>{scent?.label}</p>
          <p style={{ fontSize: "clamp(12px, 1.5vw, 15px)", marginBottom: "clamp(24px, 5vw, 48px)", color: "#c2c9b3" }}>
            Thanks {fullName.split(" ")[0]}. We've locked in your signature.
          </p>
          <button
            onClick={() => { setSubmitted(false); setFullName(""); setAge(""); setEmail(""); setContactNumber(""); setSelectedScent("Summer Rain"); }}
            style={{ padding: "clamp(10px, 1.5vw, 14px) clamp(24px, 4vw, 40px)", borderRadius: "9999px", border: "1px solid #424938", fontSize: "clamp(12px, 1.5vw, 14px)", fontWeight: 600, color: "#c2c9b3", background: "transparent", cursor: "pointer" }}
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0e1111", minHeight: "100dvh", paddingBottom: "clamp(80px, 12vh, 120px)" }}>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, width: "100%",
        height: "clamp(56px, 8vh, 80px)",
        backgroundColor: "rgba(17,20,20,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "0 clamp(16px, 4vw, 32px)", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px, 1vw, 10px)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "clamp(22px, 3.5vw, 32px)", color: "#b8f568" }}>bubble_chart</span>
            <span style={{ fontSize: "clamp(16px, 2.5vw, 24px)", fontWeight: 900, fontStyle: "italic", color: "white", letterSpacing: "-0.02em" }}>ScentVibe</span>
          </div>
          <button style={{ color: "#c2c9b3", background: "none", border: "none", cursor: "pointer" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "clamp(20px, 3vw, 28px)" }}>account_circle</span>
          </button>
        </div>
      </header>

      <main>
        <div style={{ maxWidth: "clamp(320px, 90vw, 680px)", margin: "0 auto", padding: "clamp(24px, 5vw, 56px) clamp(16px, 4vw, 32px)" }}>

          {/* Logo + location badge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "clamp(24px, 5vw, 56px)", gap: "clamp(8px, 1.5vw, 14px)" }}>
            <div style={{ padding: "clamp(8px, 1.5vw, 14px)", borderRadius: "12px", backgroundColor: "white", boxShadow: "0 0 40px rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <img src="/amuco-logo.jpg" alt="AMUCO 600" style={{ height: "clamp(28px, 5vw, 48px)", width: "auto", objectFit: "contain", display: "block" }} />
            </div>
            {locationMeta && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "clamp(4px, 0.8vw, 8px) clamp(10px, 2vw, 16px)", borderRadius: "9999px", backgroundColor: "rgba(184,245,104,0.1)", border: "1px solid rgba(184,245,104,0.2)", color: "#b8f568" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "clamp(14px, 2vw, 18px)" }}>location_on</span>
                <span style={{ fontSize: "clamp(10px, 1.5vw, 13px)", fontWeight: 700 }}>{locationMeta.name}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "clamp(24px, 5vw, 56px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(8px, 1.5vw, 14px)" }}>
              <span style={{ fontSize: "clamp(8px, 1.2vw, 11px)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#b8f568" }}>Discovery Phase</span>
              <span style={{ fontSize: "clamp(8px, 1.2vw, 11px)", fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>STEP 01/02</span>
            </div>
            <div style={{ height: "clamp(3px, 0.5vw, 5px)", width: "100%", borderRadius: "9999px", display: "flex", gap: "4px", backgroundColor: "rgba(255,255,255,0.05)" }}>
              <div className="step-active" style={{ height: "100%", width: "50%", borderRadius: "9999px" }} />
              <div style={{ height: "100%", width: "50%", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.05)" }} />
            </div>
          </div>

          {/* Heading */}
          <section style={{ marginBottom: "clamp(24px, 5vw, 56px)", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 900, color: "white", marginBottom: "clamp(10px, 2vw, 18px)", lineHeight: 1, letterSpacing: "-0.02em" }}>
              Capture{" "}
              <span style={{ color: "#b8f568", fontStyle: "italic" }}>the Vibe</span>
            </h2>
            <p style={{ color: "#c2c9b3", fontSize: "clamp(13px, 2vw, 17px)", lineHeight: 1.5, maxWidth: "85%", margin: "0 auto" }}>
              Introduce yourself and help us isolate your signature Mzansi essence.
            </p>
          </section>

          {/* Form */}
          <form id="survey-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 5vw, 52px)" }}>

            {/* Name + Age */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 4vw, 40px)" }}>
              <div className="relative">
                <input id="full_name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder=" " maxLength={100} className="minimal-input peer" />
                <label htmlFor="full_name" className="float-label">Identity / Full Name</label>
              </div>
              <div className="relative">
                <input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)}
                  placeholder=" " min="1" max="120" className="minimal-input peer" />
                <label htmlFor="age" className="float-label">How old are you?</label>
              </div>
            </div>

            {/* Stay Connected */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 16px)", marginBottom: "clamp(14px, 3vw, 26px)" }}>
                <h3 style={{ fontSize: "clamp(9px, 1.3vw, 12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", whiteSpace: "nowrap", color: "#b8f568" }}>Stay Connected</h3>
                <div style={{ height: "1px", flexGrow: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
                <span style={{ fontSize: "clamp(8px, 1.1vw, 11px)", whiteSpace: "nowrap", color: "rgba(255,255,255,0.35)" }}>one is enough</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 4vw, 40px)" }}>
                <div className="relative">
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder=" " maxLength={150} className="minimal-input peer" />
                  <label htmlFor="email" className="float-label">Email Address</label>
                </div>
                <div className="relative">
                  <input id="contact_number" type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
                    placeholder=" " maxLength={20} className="minimal-input peer" />
                  <label htmlFor="contact_number" className="float-label">Contact Number</label>
                </div>
              </div>
            </div>

            {/* Scent Gallery */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 16px)", marginBottom: "clamp(14px, 3vw, 26px)" }}>
                <h3 style={{ fontSize: "clamp(9px, 1.3vw, 12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", whiteSpace: "nowrap", color: "#fd9924" }}>Select Your Aura</h3>
                <div style={{ height: "1px", flexGrow: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.5vw, 16px)" }}>
                {SCENTS.map((scent) => (
                  <label key={scent.id} style={{ display: "block", position: "relative", cursor: "pointer" }}>
                    <input type="radio" name="favorite_scent" value={scent.id}
                      checked={selectedScent === scent.id} onChange={() => setSelectedScent(scent.id)}
                      className="sr-only custom-radio" />
                    <div className="selection-card"
                      style={{
                        position: "relative",
                        height: "clamp(100px, 18vh, 200px)",
                        borderRadius: "clamp(12px, 2vw, 20px)",
                        overflow: "hidden",
                        border: "2px solid transparent",
                        backgroundImage: `url('${scent.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        transition: "all 0.5s",
                      }}>
                      <div className="card-overlay" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", transition: "background-color 0.5s" }} />
                      <div style={{ position: "absolute", inset: 0, padding: "clamp(12px, 2.5vw, 24px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                          <div>
                            <h4 style={{ color: "white", fontSize: "clamp(16px, 3vw, 26px)", fontWeight: 700, marginBottom: "clamp(2px, 0.5vw, 6px)" }}>{scent.label}</h4>
                            <p style={{ fontSize: "clamp(10px, 1.5vw, 14px)", lineHeight: 1.4, color: "rgba(255,255,255,0.7)", maxWidth: "80%" }}>{scent.description}</p>
                          </div>
                          <span className={`material-symbols-outlined ${scent.iconColor}`} style={{ fontSize: "clamp(22px, 4vw, 36px)" }}>{scent.icon}</span>
                        </div>
                      </div>
                      <div className="check-badge" style={{ position: "absolute", top: "clamp(8px, 1.5vw, 16px)", right: "clamp(8px, 1.5vw, 16px)", borderRadius: "50%", padding: "4px", opacity: 0, transform: "scale(0.5)", transition: "all 0.3s", backgroundColor: "#b8f568" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "clamp(14px, 2.5vw, 20px)", display: "block", color: "#112000" }}>check</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ borderRadius: "12px", padding: "clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 18px)", fontSize: "clamp(12px, 1.8vw, 14px)", backgroundColor: "rgba(186,26,26,0.15)", border: "1px solid rgba(186,26,26,0.4)", color: "#ff8a80" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <div style={{ paddingTop: "clamp(4px, 1vw, 10px)" }}>
              <button type="submit" disabled={loading} className="glow-button"
                style={{ width: "100%", padding: "clamp(14px, 2.5vw, 22px) clamp(20px, 4vw, 36px)", borderRadius: "clamp(12px, 2vw, 20px)", fontWeight: 700, fontSize: "clamp(14px, 2.2vw, 20px)", display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(6px, 1vw, 12px)", background: "linear-gradient(90deg, #fd9924, #b8f568)", color: "#112000", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, transition: "all 0.3s" }}>
                <span style={{ letterSpacing: "-0.02em" }}>{loading ? "ACTIVATING..." : "ACTIVATE MY SCENT"}</span>
                {!loading && <span className="material-symbols-outlined" style={{ fontSize: "clamp(18px, 3vw, 28px)", animation: "pulse 2s infinite" }}>bolt</span>}
              </button>
              <p style={{ textAlign: "center", fontSize: "clamp(8px, 1.1vw, 10px)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "clamp(12px, 2.5vw, 24px)", color: "rgba(255,255,255,0.25)" }}>
                Secured via ScentVibe Encrypted Vibe Protocol
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Consent */}
      <div style={{ maxWidth: "clamp(320px, 90vw, 680px)", margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) clamp(16px, 3vw, 32px)", textAlign: "center" }}>
        <p style={{ fontSize: "clamp(8px, 1.1vw, 11px)", lineHeight: 1.6, color: "rgba(255,255,255,0.3)" }}>
          By submitting this form you consent to the collection and processing of your personal information
          in accordance with POPIA (Act 4 of 2013). Your data is collected solely for this survey and will
          not be shared without your consent.
        </p>
      </div>

      {/* Bottom nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 50,
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "clamp(10px, 2vw, 18px) clamp(16px, 4vw, 32px)",
        borderRadius: "clamp(20px, 4vw, 36px) clamp(20px, 4vw, 36px) 0 0",
        backgroundColor: "rgba(14,17,17,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <button type="submit" form="survey-form"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "clamp(12px, 2vw, 18px)", padding: "clamp(8px, 1.5vw, 14px) clamp(28px, 6vw, 56px)", backgroundColor: "#b8f568", color: "#112000", border: "none", cursor: "pointer", boxShadow: "0 0 20px rgba(184,245,104,0.3)", transition: "all 0.2s" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "clamp(18px, 3vw, 26px)", marginBottom: "2px" }}>bolt</span>
          <span style={{ fontSize: "clamp(8px, 1.2vw, 11px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Activate</span>
        </button>
      </nav>
    </div>
  );
}

export default function SurveyPage() {
  return (
    <ErrorBoundary>
      <SurveyForm />
    </ErrorBoundary>
  );
}
