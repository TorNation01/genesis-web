"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "How It Works", id: "how-it-works" },
  { label: "Worlds", id: "worlds" },
  { label: "Pricing", id: "pricing" },
];

function Particle({ config }) {
  return (
    <div
      style={{
        position: "absolute",
        width: "2px",
        height: "2px",
        borderRadius: "50%",
        background: "rgba(201,168,76,0.6)",
        animation: `particle-drift ${config.duration}s linear ${config.delay}s infinite`,
        left: config.left,
        bottom: "-10px",
        opacity: config.opacity,
      }}
    />
  );
}

function TheRift({ size = 280 }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size * 1.4,
        margin: "0 auto",
      }}
    >
      {[1.0, 0.85, 0.7].map((scale, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `1px solid rgba(201,168,76,${0.15 - i * 0.04})`,
            transform: `scale(${scale})`,
            animation: `rift-pulse ${3 + i}s ease-in-out ${i * 0.5}s infinite`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: size * 0.35,
          height: size * 0.85,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, #4A7FD4 0%, #1B3A6B 40%, #0D1B35 70%, #07080F 100%)",
          boxShadow:
            "0 0 60px rgba(74,127,212,0.4), 0 0 120px rgba(27,58,107,0.3), inset 0 0 40px rgba(74,127,212,0.2)",
          animation: "rift-pulse 4s ease-in-out infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "10%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 40% 30%, rgba(74,127,212,0.6) 0%, transparent 70%)",
            animation: "rift-pulse 2s ease-in-out infinite reverse",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: size * 0.35,
          height: size * 0.85,
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.5)",
          boxShadow: "0 0 20px rgba(201,168,76,0.2)",
        }}
      />
      {[0, 90, 180, 270].map((angle) => (
        <div
          key={angle}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "1px",
            height: size * 0.18,
            background: "linear-gradient(to bottom, rgba(201,168,76,0.8), transparent)",
            transformOrigin: "top center",
            transform: `translateX(-50%) rotate(${angle}deg) translateY(-${size * 0.45}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--ember, #E8B94F)",
          boxShadow: "0 0 20px rgba(232,185,79,0.8)",
        }}
      />
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "I played a Weird West campaign by calling a phone number. The AI ran the whole thing. I'm not over it.",
    name: "Beta Tester, Perth",
  },
  {
    quote:
      "The Witness voice told me how my character felt before I even knew. That's when I realised this was something different.",
    name: "Beta Tester, London",
  },
  {
    quote:
      "My group of four played from three different countries. Rift code, five minutes, we were all in the same story.",
    name: "Beta Tester, Toronto",
  },
];

const FEATURES = [
  {
    icon: "🎭",
    title: "Two Narrators",
    body: "The Chronicler sets the stage. The Witness tells you how it feels. Together they create something no solo AI voice ever could.",
  },
  {
    icon: "🌍",
    title: "30 Worlds to Explore",
    body: "Fantasy, Sci-Fi, Horror, Weird West, Cyberpunk and 25 more. Mix two genres together. Add a time period. The Chronicler handles the rest.",
  },
  {
    icon: "🎲",
    title: "Real Dice. Real Stakes.",
    body: "Photo your d20. Speak your roll. Tap a button. However you play, the Echo Die system makes every roll matter.",
  },
  {
    icon: "🧠",
    title: "The World Remembers",
    body: "Hidden morality. A Nemesis that grows. Reputation that spreads. Your choices reshape the world whether you intend it or not.",
  },
  {
    icon: "👥",
    title: "Solo or With Friends",
    body: "One Rift code. Friends join from anywhere. No accounts needed for guests. Director Mode for same-Rift play.",
  },
  {
    icon: "📱",
    title: "Any Device, Any Time",
    body: "Telegram, browser, or phone call. Play at 2am on your phone or gather friends around a speaker. Genesis comes to you.",
  },
];

/** Deterministic “random” layout for particles (avoids impure Math.random during render). */
const PARTICLE_CONFIGS = Array.from({ length: 20 }, (_, i) => ({
  left: `${((i * 47 + 11) % 100) || 1}%`,
  duration: 8 + ((i * 13) % 12),
  delay: ((i * 7) % 8) + (i % 3) * 0.3,
  opacity: 0.3 + ((i * 19) % 40) / 100,
}));

const PRICING = [
  {
    name: "Wanderer",
    price: "Free",
    period: "forever",
    highlight: false,
    features: [
      "1 active campaign",
      "2 sessions per week",
      "All 30 worlds + time periods",
      "Dual Chronicler voices",
      "Echo Die system",
      "Text + voice play",
    ],
    cta: "Start Free",
    href: "/signin",
  },
  {
    name: "Adventurer",
    price: "$5",
    period: "per month",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited sessions",
      "3 active campaigns",
      "NPC individual voices",
      "Session recap narration",
      "Browser play interface",
      "Multiplayer as guest",
    ],
    cta: "Begin Your Quest",
    href: "/signin",
  },
  {
    name: "Hero",
    price: "$10",
    period: "per month",
    highlight: false,
    features: [
      "Everything in Adventurer",
      "300 phone call minutes",
      "Premium AI voices",
      "Host multiplayer sessions",
      "Living Novel export",
      "Director Mode",
    ],
    cta: "Become a Hero",
    href: "/signin",
  },
];

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        background: "var(--void)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          background: "linear-gradient(to bottom, rgba(7,8,15,0.95), transparent)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Image
            src="/genesis-logo.png"
            alt="Genesis"
            width={40}
            height={40}
          priority
            style={{ objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "var(--font-deco)",
              fontSize: 18,
              color: "var(--gold)",
              letterSpacing: "0.1em",
            }}
          >
            GENESIS
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          <div
            className="landing-nav-links"
            style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}
          >
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="landing-nav-link">
                {item.label}
              </a>
            ))}
          </div>
          <Link href="/signin" className="btn-primary" style={{ padding: "10px 24px", fontSize: 12 }}>
            Begin
          </Link>
        </div>
      </nav>

      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "120px 40px 80px",
          overflow: "hidden",
        }}
      >
        {/* ── Rift background image ── */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <img
            src="/genesis-bg-rift.png"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 35%",
              display: "block",
            }}
          />
        </div>

        {/* Dark tint — 68% opacity base */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(7, 8, 15, 0.68)",
          }}
        />

        {/* Radial edge darkening — edges darker than portal */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(7,8,15,0.0) 0%, rgba(7,8,15,0.55) 100%)",
          }}
        />

        {/* Top/bottom gradient — merges cleanly with nav and next section */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(7,8,15,0.85) 0%, transparent 18%, transparent 68%, rgba(7,8,15,0.98) 100%)",
          }}
        />

        {/* Blue rift enhancement — pulls out the portal glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 38%, rgba(27,58,107,0.2) 0%, transparent 55%)",
          }}
        />

        {/* Gold warmth at bottom — matches fire in the image */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: "linear-gradient(to top, rgba(201,168,76,0.05) 0%, transparent 100%)",
          }}
        />

        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
    linear-gradient(rgba(201,168,76,0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201,168,76,0.012) 1px, transparent 1px)
  `,
            backgroundSize: "60px 60px",
          }}
        />

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {PARTICLE_CONFIGS.map((p, i) => (
            <Particle key={i} config={p} />
          ))}
        </div>

        <div style={{ position: "relative", textAlign: "center", maxWidth: 900 }}>
          <div
            className="section-label"
            style={{
              marginBottom: 32,
              opacity: 0.7,
              animation: "fade-up 0.8s ease 0.2s both",
            }}
          >
            The AI Dungeon Master in Your Pocket
          </div>

          <h1
            style={{
              fontFamily: "var(--font-deco)",
              fontSize: "clamp(52px, 8vw, 96px)",
              fontWeight: 400,
              lineHeight: 1,
              marginBottom: 12,
              animation: "fade-up 0.8s ease 0.4s both",
            }}
            className="gold-shimmer"
          >
            GENESIS
          </h1>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(14px, 2vw, 18px)",
              letterSpacing: "0.3em",
              color: "var(--silver)",
              marginBottom: 32,
              animation: "fade-up 0.8s ease 0.5s both",
            }}
          >
            ECHOES OF CREATION
          </p>

          <div
            className="divider-gold"
            style={{ marginBottom: 40, animation: "fade-up 0.8s ease 0.55s both" }}
          />

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(18px, 2.5vw, 24px)",
              color: "var(--silver)",
              maxWidth: 640,
              margin: "0 auto 48px",
              lineHeight: 1.6,
              animation: "fade-up 0.8s ease 0.6s both",
            }}
          >
            Two AI narrators. Thirty worlds. Any time period. Real dice or digital. Play alone, with
            friends, or by calling a phone number.
            <em style={{ color: "var(--gold)" }}> It costs nothing to start.</em>
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              animation: "fade-up 0.8s ease 0.7s both",
            }}
          >
            <Link href="/signin" className="btn-primary">
              ⚔ Begin Your Story
            </Link>
            <a href="#how-it-works" className="btn-ghost">
              How It Works
            </a>
          </div>

          <p
            style={{
              marginTop: 48,
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "var(--silver)",
              opacity: 0.5,
              animation: "fade-up 0.8s ease 0.8s both",
            }}
          >
            NO CREDIT CARD · NO APP DOWNLOAD · WORKS ON ANY DEVICE
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: 1,
              height: 60,
              background: "linear-gradient(to bottom, var(--gold), transparent)",
            }}
          />
        </div>
      </section>

      {/* ── NARRATORS REVEAL ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          maxHeight: 600,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: 600 }}>
          <Image
            src="/genesis-dms.png"
            alt="The Master Chronicler and Master Witness — your AI narrators"
            fill
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(7,8,15,0.5) 0%, transparent 30%, transparent 60%, rgba(7,8,15,0.9) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(7,8,15,0.6) 0%, transparent 25%, transparent 75%, rgba(7,8,15,0.6) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "40px 60px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  color: "var(--gold)",
                  marginBottom: 8,
                  opacity: 0.8,
                }}
              >
                YOUR NARRATORS
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-deco)",
                  fontSize: "clamp(24px, 4vw, 40px)",
                  color: "var(--mist)",
                  lineHeight: 1.1,
                }}
              >
                The Chronicler & The Witness
              </h2>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--silver)",
                maxWidth: 400,
                textAlign: "right",
                lineHeight: 1.5,
              }}
            >
              Two voices. One world.
              <br />
              <em style={{ color: "var(--gold)" }}>Neither could tell your story alone.</em>
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          borderTop: "1px solid rgba(201,168,76,0.1)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          background: "rgba(27,58,107,0.08)",
          padding: "60px 40px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 48,
              color: "var(--gold)",
              opacity: 0.3,
              fontFamily: "var(--font-deco)",
              lineHeight: 1,
              marginBottom: 16,
            }}
          >
            &ldquo;
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(18px, 3vw, 24px)",
              fontStyle: "italic",
              color: "var(--mist)",
              lineHeight: 1.5,
              marginBottom: 24,
              minHeight: 80,
              transition: "opacity 0.5s",
            }}
          >
            {TESTIMONIALS[activeTestimonial].quote}
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "var(--gold)",
              opacity: 0.7,
            }}
          >
            — {TESTIMONIALS[activeTestimonial].name}
          </p>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginTop: 24,
            }}
          >
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: i === activeTestimonial ? 24 : 8,
                  height: 2,
                  background:
                    i === activeTestimonial ? "var(--gold)" : "rgba(201,168,76,0.3)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>
            The Experience
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px,5vw,52px)",
              fontWeight: 600,
              color: "var(--mist)",
              marginBottom: 20,
            }}
          >
            From Zero to Story in <span style={{ color: "var(--gold)" }}>90 Seconds</span>
          </h2>
          <p
            style={{
              color: "var(--silver)",
              maxWidth: 520,
              margin: "0 auto",
              fontSize: 18,
              fontFamily: "var(--font-body)",
            }}
          >
            No tutorials. No character sheets. No setup forms. The Chronicler asks your name. You
            answer. The story begins.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            gap: 2,
            marginBottom: 80,
          }}
        >
          {[
            {
              num: "01",
              title: "Choose Your World",
              body: "Pick from 30 genres, a time period, and optionally mix two genres together. The Chronicler adapts instantly.",
            },
            {
              num: "02",
              title: "Meet the Narrators",
              body: "The Chronicler and The Witness introduce themselves. Two voices, one story, unlike anything else available.",
            },
            {
              num: "03",
              title: "Play Your Way",
              body: "Type, speak, or send a voice note. Roll a real die or tap the digital grid. The story shapes to you.",
            },
            {
              num: "04",
              title: "The World Responds",
              body: "Choices have consequences. A Nemesis forms. Your reputation spreads. The world is alive.",
            },
          ].map((step, i) => (
            <div
              key={step.num}
              style={{
                padding: "48px 32px",
                background:
                  "linear-gradient(135deg, rgba(27,58,107,0.12) 0%, rgba(7,8,15,0.4) 100%)",
                border: "1px solid rgba(201,168,76,0.08)",
                borderLeft: i === 0 ? "1px solid rgba(201,168,76,0.08)" : "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  fontFamily: "var(--font-deco)",
                  fontSize: 64,
                  fontWeight: 700,
                  color: "rgba(201,168,76,0.05)",
                  lineHeight: 1,
                }}
              >
                {step.num}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  color: "var(--gold)",
                  marginBottom: 16,
                }}
              >
                STEP {step.num}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--mist)",
                  marginBottom: 16,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  color: "var(--silver)",
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="worlds"
        style={{
          padding: "120px 40px",
          background:
            "linear-gradient(180deg, var(--void) 0%, rgba(13,27,53,0.3) 50%, var(--void) 100%)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>
              What Makes Genesis Different
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px,5vw,52px)",
                fontWeight: 600,
                color: "var(--mist)",
              }}
            >
              Built for <span style={{ color: "var(--gold)" }}>Real Players</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: "40px 36px",
                  background: "rgba(13,27,53,0.3)",
                  border: "1px solid rgba(201,168,76,0.08)",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
                  e.currentTarget.style.background = "rgba(13,27,53,0.5)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.08)";
                  e.currentTarget.style.background = "rgba(13,27,53,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 20 }}>{f.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--gold)",
                    marginBottom: 12,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "var(--silver)",
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    lineHeight: 1.7,
                  }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE TWO NARRATORS ── */}
      <section style={{ padding: "120px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>
              Two Voices. One World.
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px,4vw,48px)",
                fontWeight: 600,
                color: "var(--mist)",
              }}
            >
              Meet Your Narrators
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRight: "none",
              }}
            >
              <div style={{ position: "relative", height: 480 }}>
                <Image
                  src="/genesis-chronicler.png"
                  alt="The Master Chronicler — Keeper of Stories, Weaver of Time, Voice of the Ages"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, transparent 40%, rgba(7,8,15,0.98) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, rgba(7,8,15,0.3) 0%, transparent 30%)",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "32px 40px 48px",
                  background:
                    "linear-gradient(135deg, rgba(27,58,107,0.2) 0%, rgba(7,8,15,0.8) 100%)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-deco)",
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    color: "var(--gold)",
                    marginBottom: 8,
                  }}
                >
                  THE CHRONICLER
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "var(--silver)",
                    opacity: 0.5,
                    marginBottom: 20,
                  }}
                >
                  KEEPER OF STORIES · WEAVER OF TIME · VOICE OF THE AGES
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 17,
                    fontStyle: "italic",
                    color: "var(--mist)",
                    lineHeight: 1.7,
                    marginBottom: 20,
                    borderLeft: "2px solid rgba(201,168,76,0.3)",
                    paddingLeft: 20,
                  }}
                >
                  &ldquo;The ruins loom before you, ancient stones slicked with rain. Three figures
                  emerge from the shadows. Roll for me.&rdquo;
                </p>
                <p
                  style={{
                    color: "var(--silver)",
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    lineHeight: 1.7,
                    opacity: 0.8,
                  }}
                >
                  Deep, authoritative, world-building. The Chronicler drives action, sets scenes,
                  describes consequences, and demands your decisions. He carries the weight of the
                  story.
                </p>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <div style={{ position: "relative", height: 480 }}>
                <Image
                  src="/genesis-witness.png"
                  alt="The Master Witness — Seeker of Truths, Keeper of Secrets, Guardian of Realms"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, transparent 40%, rgba(7,8,15,0.98) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to left, rgba(7,8,15,0.3) 0%, transparent 30%)",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "32px 40px 48px",
                  background:
                    "linear-gradient(135deg, rgba(107,27,107,0.12) 0%, rgba(7,8,15,0.8) 100%)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-deco)",
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    color: "var(--gold)",
                    marginBottom: 8,
                  }}
                >
                  THE WITNESS
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "var(--silver)",
                    opacity: 0.5,
                    marginBottom: 20,
                  }}
                >
                  SEEKER OF TRUTHS · KEEPER OF SECRETS · GUARDIAN OF REALMS
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 17,
                    fontStyle: "italic",
                    color: "var(--mist)",
                    lineHeight: 1.7,
                    marginBottom: 20,
                    borderLeft: "2px solid rgba(201,168,76,0.3)",
                    paddingLeft: 20,
                  }}
                >
                  &ldquo;Something feels wrong. The silence is too complete — like the forest itself
                  is holding its breath.&rdquo;
                </p>
                <p
                  style={{
                    color: "var(--silver)",
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    lineHeight: 1.7,
                    opacity: 0.8,
                  }}
                >
                  Warm, intimate, perceptive. The Witness tells you what your character feels — the
                  fear, the wonder, the weight of every choice before you make it.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 2,
              padding: "40px 48px",
              background:
                "linear-gradient(135deg, rgba(27,58,107,0.15) 0%, rgba(7,8,15,0.6) 100%)",
              border: "1px solid rgba(201,168,76,0.1)",
              borderTop: "none",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 20,
                fontStyle: "italic",
                color: "var(--gold)",
                letterSpacing: "0.05em",
              }}
            >
              &ldquo;Together, we are your storytellers. Together, we are your world.&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                letterSpacing: "0.25em",
                color: "var(--silver)",
                opacity: 0.4,
                marginTop: 12,
              }}
            >
              THE CHRONICLER & THE WITNESS — FROM THE GENESIS INTRO SEQUENCE
            </p>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        style={{
          padding: "120px 40px",
          background: "linear-gradient(180deg, var(--void) 0%, rgba(13,27,53,0.2) 100%)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>
              Simple Pricing
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px,5vw,52px)",
                fontWeight: 600,
                color: "var(--mist)",
                marginBottom: 20,
              }}
            >
              Free to Start. <span style={{ color: "var(--gold)" }}>Always.</span>
            </h2>
            <p style={{ color: "var(--silver)", fontFamily: "var(--font-body)", fontSize: 18 }}>
              No credit card. No trial period. No catch.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 2,
            }}
          >
            {PRICING.map((tier) => (
              <div
                key={tier.name}
                style={{
                  padding: "48px 36px",
                  background: tier.highlight
                    ? "linear-gradient(135deg, rgba(27,58,107,0.4) 0%, rgba(13,27,53,0.6) 100%)"
                    : "rgba(13,27,53,0.2)",
                  border: tier.highlight
                    ? "1px solid rgba(201,168,76,0.35)"
                    : "1px solid rgba(201,168,76,0.08)",
                  position: "relative",
                  boxShadow: tier.highlight ? "var(--glow-gold)" : "none",
                }}
              >
                {tier.badge ? (
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, var(--gold), var(--ember))",
                      color: "var(--void)",
                      fontFamily: "var(--font-display)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      padding: "4px 16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tier.badge}
                  </div>
                ) : null}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    letterSpacing: "0.2em",
                    color: "var(--gold)",
                    marginBottom: 24,
                    marginTop: tier.badge ? 16 : 0,
                  }}
                >
                  {tier.name.toUpperCase()}
                </div>
                <div style={{ marginBottom: 32 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 48,
                      fontWeight: 700,
                      color: "var(--mist)",
                    }}
                  >
                    {tier.price}
                  </span>
                  {tier.period ? (
                    <span
                      style={{
                        color: "var(--silver)",
                        fontSize: 14,
                        marginLeft: 8,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      /{tier.period}
                    </span>
                  ) : null}
                </div>
                <div className="divider-gold" style={{ margin: "0 0 32px", width: 40 }} />
                <ul style={{ listStyle: "none", marginBottom: 40 }}>
                  {tier.features.map((feat) => (
                    <li
                      key={feat}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        marginBottom: 12,
                        color: "var(--silver)",
                        fontFamily: "var(--font-body)",
                        fontSize: 16,
                      }}
                    >
                      <span
                        style={{
                          color: "var(--gold)",
                          marginTop: 2,
                          flexShrink: 0,
                          fontSize: 12,
                        }}
                      >
                        ◆
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={tier.highlight ? "btn-primary" : "btn-ghost"}
                  style={{ width: "100%", justifyContent: "center", display: "flex" }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "120px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(27,58,107,0.2) 0%, transparent 70%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div className="animate-float" style={{ marginBottom: 48 }}>
            <TheRift size={140} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px,5vw,56px)",
              fontWeight: 600,
              color: "var(--mist)",
              marginBottom: 24,
            }}
          >
            Your story is waiting.
          </h2>
          <p
            style={{
              color: "var(--silver)",
              fontFamily: "var(--font-body)",
              fontSize: 20,
              marginBottom: 48,
              lineHeight: 1.6,
            }}
          >
            Thirty worlds. Two narrators. Infinite stories. Free forever to start.
          </p>
          <Link href="/signin" className="btn-primary" style={{ fontSize: 16, padding: "20px 56px" }}>
            ⚔ Open the Rift
          </Link>
        </div>
      </section>

      <footer
        style={{
          borderTop: "1px solid rgba(201,168,76,0.08)",
          padding: "48px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image
            src="/genesis-logo.png"
            alt="Genesis"
            width={32}
            height={32}
            style={{ objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "var(--font-deco)",
              fontSize: 14,
              color: "var(--gold)",
              letterSpacing: "0.1em",
            }}
          >
            GENESIS
          </span>
        </div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {["genesis-game.world", "genesis-game.chat", "genesis-game.online"].map((domain) => (
            <span
              key={domain}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--silver)",
                opacity: 0.4,
              }}
            >
              {domain}
            </span>
          ))}
        </div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--silver)",
            opacity: 0.3,
          }}
        >
          © 2025 GENESIS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
