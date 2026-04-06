"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } catch {
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
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.5";
        }}
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

        <div style={{ textAlign: "center", marginBottom: 48 }}>
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

        <div className="divider-gold" style={{ marginBottom: 40 }} />

        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: 17,
            fontStyle: "italic",
            color: "var(--silver)",
            marginBottom: 36,
            lineHeight: 1.5,
          }}
        >
          The Rift recognises returning travellers.
          <br />
          Step through to continue your story.
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
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
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path
              fill="#FFC107"
              d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.6 39.5 16.3 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.2 5.2C40.7 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"
            />
          </svg>
          {loading ? "Opening the Rift..." : "Continue with Google"}
        </button>

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
