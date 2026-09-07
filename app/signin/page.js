"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSignIn(e) {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Enter a name to begin.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not sign in");
      }
      router.push("/world");
    } catch (err) {
      setError(err.message || "Could not sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--void)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
          linear-gradient(rgba(201,168,76,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.02) 1px, transparent 1px)
        `,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(27,58,107,0.15) 0%, transparent 65%)",
        }}
      />

      <Link
        href="/"
        style={{
          position: "fixed",
          top: 32,
          left: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-display)",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "var(--silver)",
          textDecoration: "none",
          opacity: 0.5,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
      >
        ← GENESIS
      </Link>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          padding: "60px 48px",
          background: "linear-gradient(135deg, rgba(13,27,53,0.8) 0%, rgba(7,8,15,0.9) 100%)",
          border: "1px solid rgba(201,168,76,0.15)",
          animation: "fade-up 0.6s ease both",
        }}
      >
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => (
          <div
            key={corner}
            style={{
              position: "absolute",
              [corner.includes("top") ? "top" : "bottom"]: -1,
              [corner.includes("left") ? "left" : "right"]: -1,
              width: 20,
              height: 20,
              borderTop: corner.includes("top") ? "2px solid var(--gold)" : "none",
              borderBottom: corner.includes("bottom") ? "2px solid var(--gold)" : "none",
              borderLeft: corner.includes("left") ? "2px solid var(--gold)" : "none",
              borderRight: corner.includes("right") ? "2px solid var(--gold)" : "none",
            }}
          />
        ))}

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="animate-float" style={{ marginBottom: 20 }}>
            <Image
              src="/genesis-logo.png"
              alt="Genesis"
              width={80}
              height={80}
              style={{ margin: "0 auto", display: "block", objectFit: "contain" }}
            />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-deco)",
              fontSize: 28,
              color: "var(--gold)",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            GENESIS
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.25em",
              color: "var(--silver)",
              opacity: 0.6,
            }}
          >
            ECHOES OF CREATION
          </p>
        </div>

        <div className="divider-gold" style={{ marginBottom: 36 }} />

        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: 17,
            fontStyle: "italic",
            color: "var(--silver)",
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          The Rift recognises returning travellers.
          <br />
          Step through to continue your story.
        </p>

        <form onSubmit={handleSignIn}>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            style={{
              width: "100%",
              padding: "14px 18px",
              marginBottom: 12,
              background: "rgba(7,8,15,0.6)",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "var(--mist)",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              outline: "none",
            }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            autoComplete="email"
            style={{
              width: "100%",
              padding: "14px 18px",
              marginBottom: 20,
              background: "rgba(7,8,15,0.6)",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "var(--mist)",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              outline: "none",
            }}
          />

          {error ? (
            <p
              style={{
                textAlign: "center",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "#e07a5f",
                marginBottom: 16,
              }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              padding: "16px 24px",
              background: loading ? "rgba(201,168,76,0.05)" : "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.25)",
              color: "var(--mist)",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              letterSpacing: "0.12em",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
            }}
          >
            {loading ? "Opening the Rift..." : "Enter the Rift"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 32,
            fontFamily: "var(--font-display)",
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "var(--silver)",
            opacity: 0.35,
            lineHeight: 1.8,
          }}
        >
          NO CREDIT CARD · NO APP DOWNLOAD
          <br />
          YOUR STORY PERSISTS BETWEEN SESSIONS
        </p>
      </div>
    </div>
  );
}
