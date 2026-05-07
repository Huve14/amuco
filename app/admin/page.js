"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0e1111" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="p-3 rounded-xl" style={{ backgroundColor: "white" }}>
            <img src="/amuco-logo.jpg" alt="AMUCO 600" className="h-9 w-auto object-contain" />
          </div>
        </div>

        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "rgba(184,245,104,0.1)", border: "1px solid rgba(184,245,104,0.2)" }}
          >
            <span className="material-symbols-outlined text-3xl" style={{ color: "#b8f568" }}>lock</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Admin Access</h1>
          <p className="text-sm" style={{ color: "#c2c9b3" }}>Enter your password to view the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-4 rounded-xl text-white text-sm font-medium focus:outline-none transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid #424938",
                caretColor: "#b8f568",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#b8f568")}
              onBlur={(e) => (e.target.style.borderColor = "#424938")}
            />
          </div>

          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
              style={{ backgroundColor: "rgba(186,26,26,0.15)", border: "1px solid rgba(186,26,26,0.4)", color: "#ff8a80" }}
            >
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="glow-button w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(90deg, #fd9924, #b8f568)", color: "#112000" }}
          >
            {loading ? "Verifying..." : "Enter Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs mt-8" style={{ color: "rgba(255,255,255,0.2)" }}>
          Amuco 600 · Admin Portal
        </p>
      </div>
    </div>
  );
}
