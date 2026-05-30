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
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>Something went wrong.</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", wordBreak: "break-all" }}>{this.state.error?.message}</p>
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
    iconColor: "#b8f568",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBZwutAiknR_w1mZYmSehVM7dENUxD95KZyifuGAAk6rrayNxXgSYW4_WboG14fwKr3QwYu98RzFcV_4rY4Fo2T111TIhZhyDlhOTbebwhz_BeoMv0X4KlyP8P42dUg8ShUGJ6YvSJCXdaU4eNk6lbYS_F2uX8nmYoIBEyDWK3i4s9EJ5G_2-gDk_aSIq3cKbFnVHdMmXA7C5FNoGqn6Cx1KnKxiSv6pUbG9CPSq_DmA-rs7cY4T8a58eR98sYBfwwTcfzsbxDZdI",
  },
  {
    id: "Shisanyama",
    label: "Shisanyama",
    description: "Smoky woodfire, charcoal, and the soul of a community fire.",
    icon: "local_fire_department",
    iconColor: "#fd9924",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_ZedsPaM2u3PPCUyYwoA7spcFhcPPN4nt0mjhPDAtskAD877i1VM8iaaFfa_ozP9z-AM6B0QV2RbBAQRKq01YjihwVFgZOXUrHlj92ptZZMeDEyog-WD0oRpauJRMzROQHYqFznB7VtoHOyTtb0J9eJ2zRqxBpCfsxRa16DC9l-ISJJgPdQjYKMF8JzrjQFP-5UDpOKWOgsNEWZLKx9rDes2EPaDwZBPFsG7j47B_cJyjgzDvB6Tg_QoJdca-PapcqrVr_N84lAE",
  },
  {
    id: "Amagwinya",
    label: "Amagwinya",
    description: "Hot dough pockets straight from the pan, the taste of home.",
    icon: "restaurant",
    iconColor: "#b8f568",
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
      <div className="success-screen">
        <div className="success-inner">
          <div className="success-icon">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <h1 className="success-title">Vibe <em>activated.</em></h1>
          <p className="success-sub">Your essence has been captured —</p>
          <p className="success-scent">{scent?.label}</p>
          <p className="success-name">Thanks {fullName.split(" ")[0]}. We've locked in your signature.</p>
          <button className="success-btn"
            onClick={() => { setSubmitted(false); setFullName(""); setAge(""); setEmail(""); setContactNumber(""); setSelectedScent("Summer Rain"); }}>
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="brand">
            <span className="material-symbols-outlined brand-icon">bubble_chart</span>
            <span className="brand-name">ScentVibe</span>
          </div>
          <span className="material-symbols-outlined" style={{ color: "#c2c9b3" }}>account_circle</span>
        </div>
      </header>

      <main className="main-content">
        <div className="logo-block">
          <div className="logo-wrap">
            <img src="/amuco-logo.jpg" alt="AMUCO 600" className="logo-img" />
          </div>
          {locationMeta && (
            <div className="location-badge">
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>location_on</span>
              {locationMeta.name}
            </div>
          )}
        </div>

        <div className="progress-bar-wrap">
          <div className="progress-labels">
            <span className="progress-label">Discovery Phase</span>
            <span className="progress-step">STEP 01/02</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill step-active" />
            <div className="progress-empty" />
          </div>
        </div>

        <div className="heading-block">
          <h2 className="heading">Capture <em>the Vibe</em></h2>
          <p className="subheading">Introduce yourself and help us isolate your signature Mzansi essence.</p>
        </div>

        <form id="survey-form" onSubmit={handleSubmit} className="survey-form">
          <div className="field-row">
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

          <div className="section-block">
            <div className="section-header">
              <span className="section-label" style={{ color: "#b8f568" }}>Stay Connected</span>
              <div className="section-rule" />
              <span className="section-hint">one is enough</span>
            </div>
            <div className="field-row">
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

          <div className="section-block">
            <div className="section-header">
              <span className="section-label" style={{ color: "#fd9924" }}>Select Your Aura</span>
              <div className="section-rule" />
            </div>
            <div className="scent-list">
              {SCENTS.map((scent) => (
                <label key={scent.id} className="scent-label">
                  <input type="radio" name="favorite_scent" value={scent.id}
                    checked={selectedScent === scent.id} onChange={() => setSelectedScent(scent.id)}
                    className="sr-only custom-radio" />
                  <div className="selection-card scent-card"
                    style={{ backgroundImage: `url('${scent.image}')` }}>
                    <div className="card-overlay" />
                    <div className="scent-content">
                      <div>
                        <h4 className="scent-title">{scent.label}</h4>
                        <p className="scent-desc">{scent.description}</p>
                      </div>
                      <span className="material-symbols-outlined scent-icon" style={{ color: scent.iconColor }}>{scent.icon}</span>
                    </div>
                    <div className="check-badge">
                      <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#112000" }}>check</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" disabled={loading} className="glow-button submit-btn">
            <span>{loading ? "ACTIVATING..." : "ACTIVATE MY SCENT"}</span>
            {!loading && <span className="material-symbols-outlined">bolt</span>}
          </button>
        </form>

        <p className="consent-text">
          By submitting you consent to collection of your personal information under POPIA (Act 4 of 2013) for survey purposes only.
        </p>
      </main>

      <nav className="bottom-nav">
        <button type="submit" form="survey-form" className="activate-btn">
          <span className="material-symbols-outlined">bolt</span>
          <span className="activate-label">Activate</span>
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
