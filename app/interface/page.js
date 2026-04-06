"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import CharacterCreator from "@/components/CharacterCreator";

const INTERFACES = [
  {
    id: "telegram",
    icon: "✈",
    badge: "RECOMMENDED",
    badgeColor: "var(--gold)",
    title: "Telegram",
    subtitle: "The Classic Experience",
    description:
      "Free. Works on every phone. Voice notes in and out. Play at your own pace — the story waits for you.",
    features: ["Voice + text input", "All 30 worlds", "NPC individual voices", "Offline-first"],
    cta: "Open in Telegram",
    available: true,
    glow: "rgba(201,168,76,0.15)",
  },
  {
    id: "browser",
    icon: "🌐",
    badge: "PLAY NOW",
    badgeColor: "#4A7FD4",
    title: "Browser",
    subtitle: "The Visual Experience",
    description:
      "Play right here. Animated 3D die. Background music that shifts with the scene. Voice enabled.",
    features: ["Animated d20 die", "Scene mood music", "Browser voice input", "No install needed"],
    cta: "Play in Browser",
    available: true,
    glow: "rgba(74,127,212,0.15)",
  },
  {
    id: "phone",
    icon: "📞",
    badge: "MOST IMMERSIVE",
    badgeColor: "#6B4A7F",
    title: "Phone Call",
    subtitle: "The Pure Voice Experience",
    description:
      "Call a number. The Chronicler answers. Background music plays. Pure audio storytelling.",
    features: ["Call any number", "Music + voice mixed", "Multi-party conferences", "Director Mode"],
    cta: "Coming Soon",
    available: false,
    soon: "Coming in Sprint 8",
    glow: "rgba(107,74,127,0.15)",
  },
];

function InterfacePageContent() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign");
  const telegramBot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "GenesisChroniclerBot";
  const [copied, setCopied] = useState(false);
  const [playMode, setPlayMode] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [user, setUser] = useState(null);

  const roomCode = searchParams.get("room") || "—";

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    void supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    if (campaignId) {
      void supabase
        .from("campaigns")
        .select("primary_genre, secondary_genre, difficulty, game_mode, time_period")
        .eq("id", campaignId)
        .single()
        .then(({ data }) => setCampaign(data ?? null));
    } else {
      void Promise.resolve().then(() => setCampaign(null));
    }
  }, [campaignId]);

  function copyRoomCode() {
    if (roomCode === "—") return;
    void navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--void)",
        padding: "80px 40px 60px",
        position: "relative",
      }}
    >
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <Image
          src="/genesis-bg-rift-tinted.png"
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "center 25%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(7,8,15,0.60)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(7,8,15,0.65) 0%, transparent 20%, transparent 75%, rgba(7,8,15,0.85) 100%)",
          }}
        />
      </div>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(201,168,76,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.015) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              marginBottom: 48,
            }}
          >
            <Image src="/logo.svg" alt="Genesis" width={32} height={32} />
            <span
              style={{
                fontFamily: "var(--font-deco)",
                fontSize: 16,
                color: "var(--gold)",
                letterSpacing: "0.1em",
              }}
            >
              GENESIS
            </span>
          </Link>
          <div className="section-label" style={{ marginBottom: 16 }}>
            Step 4 of 4
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 600,
              color: "var(--mist)",
              marginBottom: 16,
            }}
          >
            Choose How You Play
          </h1>
          <p
            style={{
              color: "var(--silver)",
              fontFamily: "var(--font-body)",
              fontSize: 18,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Your world is ready. The Chronicler waits. Pick the interface that suits you.
          </p>
        </div>

        {campaignId && roomCode !== "—" ? (
          <div
            style={{
              maxWidth: 500,
              margin: "0 auto 60px",
              padding: "24px 32px",
              background: "rgba(27,58,107,0.2)",
              border: "1px solid rgba(201,168,76,0.2)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "var(--silver)",
                marginBottom: 12,
                opacity: 0.6,
              }}
            >
              SHARE YOUR RIFT CODE
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-deco)",
                  fontSize: 36,
                  letterSpacing: "0.3em",
                  color: "var(--gold)",
                }}
              >
                {roomCode}
              </span>
              <button
                type="button"
                onClick={copyRoomCode}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: copied ? "var(--gold)" : "var(--silver)",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "COPIED ✓" : "COPY"}
              </button>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--silver)",
                opacity: 0.5,
                marginTop: 12,
              }}
            >
              Friends enter your Rift at genesis-game.world/join — no account needed
            </p>
          </div>
        ) : null}

        {!playMode && (
          <div style={{ maxWidth: 700, margin: "0 auto 60px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div className="section-label" style={{ marginBottom: 12 }}>
                How Do You Want to Play?
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  color: "var(--mist)",
                  marginBottom: 12,
                }}
              >
                Choose Your Path
              </h2>
              <p
                style={{
                  color: "var(--silver)",
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  opacity: 0.7,
                }}
              >
                Jump straight into the story — or forge your legend first.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <button
                type="button"
                onClick={() => setPlayMode("quickstart")}
                style={{
                  padding: "40px 28px",
                  cursor: "pointer",
                  textAlign: "left",
                  background: "rgba(27,58,107,0.2)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(27,58,107,0.4)";
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(27,58,107,0.2)";
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 16 }}>⚔️</div>
                <div
                  style={{
                    fontFamily: "var(--font-deco)",
                    fontSize: 22,
                    color: "var(--gold)",
                    marginBottom: 8,
                  }}
                >
                  QuickStart
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: "rgba(201,168,76,0.5)",
                    marginBottom: 14,
                  }}
                >
                  RECOMMENDED
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--silver)",
                    lineHeight: 1.6,
                    opacity: 0.7,
                  }}
                >
                  The Chronicler introduces your character through the story. Fast, immersive, no setup
                  required.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setPlayMode("character_create")}
                style={{
                  padding: "40px 28px",
                  cursor: "pointer",
                  textAlign: "left",
                  background: "rgba(13,27,53,0.3)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(13,27,53,0.5)";
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(13,27,53,0.3)";
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)";
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 16 }}>📜</div>
                <div
                  style={{
                    fontFamily: "var(--font-deco)",
                    fontSize: 22,
                    color: "var(--gold)",
                    marginBottom: 8,
                  }}
                >
                  Character Create
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: "rgba(201,168,76,0.3)",
                    marginBottom: 14,
                  }}
                >
                  FULL RPG SYSTEM
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--silver)",
                    lineHeight: 1.6,
                    opacity: 0.7,
                  }}
                >
                  Choose race, class, ability scores, skills and feats. Your character persists across all
                  campaigns.
                </p>
              </button>
            </div>
          </div>
        )}

        {playMode === "character_create" && (
          <div>
            <button
              type="button"
              onClick={() => setPlayMode(null)}
              style={{
                display: "block",
                margin: "0 auto 32px",
                padding: "8px 24px",
                background: "transparent",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "var(--silver)",
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              ← BACK
            </button>
            <CharacterCreator
              campaignId={campaignId}
              userId={user?.id}
              primaryGenre={campaign?.primary_genre}
              secondaryGenre={campaign?.secondary_genre}
              timePeriod={campaign?.time_period}
              onComplete={() => setPlayMode("quickstart")}
            />
          </div>
        )}

        {playMode === "quickstart" && (
          <div>
            <div
              style={{
                maxWidth: 1100,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 2,
              }}
            >
              {INTERFACES.map((iface) => (
                <div
                  key={iface.id}
                  style={{
                    padding: "48px 36px",
                    background: iface.available
                      ? `linear-gradient(135deg, ${iface.glow} 0%, rgba(7,8,15,0.8) 100%)`
                      : "rgba(7,8,15,0.5)",
                    border: iface.available
                      ? "1px solid rgba(201,168,76,0.2)"
                      : "1px solid rgba(201,168,76,0.06)",
                    opacity: iface.available ? 1 : 0.6,
                    position: "relative",
                    transition: "all 0.3s ease",
                  }}
                >
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                background:
                  iface.id === "telegram"
                    ? "rgba(201,168,76,0.12)"
                    : `${iface.badgeColor}26`,
                border:
                  iface.id === "telegram"
                    ? "1px solid rgba(201,168,76,0.35)"
                    : `1px solid ${iface.badgeColor}66`,
                fontFamily: "var(--font-display)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: iface.badgeColor,
                marginBottom: 24,
              }}
            >
              {iface.badge}
            </div>

            <div style={{ fontSize: 40, marginBottom: 20 }}>{iface.icon}</div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--mist)",
                marginBottom: 4,
              }}
            >
              {iface.title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--gold)",
                opacity: 0.7,
                marginBottom: 20,
              }}
            >
              {iface.subtitle.toUpperCase()}
            </p>
            <p
              style={{
                color: "var(--silver)",
                fontFamily: "var(--font-body)",
                fontSize: 16,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              {iface.description}
            </p>

            <ul style={{ listStyle: "none", marginBottom: 36 }}>
              {iface.features.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                    color: "var(--silver)",
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                  }}
                >
                  <span style={{ color: "var(--gold)", fontSize: 10 }}>◆</span>
                  {f}
                </li>
              ))}
            </ul>

            {iface.available ? (
              <a
                href={
                  iface.id === "telegram"
                    ? `https://t.me/${telegramBot}${campaignId ? `?start=${campaignId}` : ""}`
                    : `/play/${campaignId}`
                }
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", display: "flex" }}
                target={iface.id === "telegram" ? "_blank" : undefined}
                rel={iface.id === "telegram" ? "noopener noreferrer" : undefined}
              >
                {iface.cta}
              </a>
            ) : (
              <div>
                <div
                  style={{
                    width: "100%",
                    padding: "15px",
                    background: "rgba(201,168,76,0.03)",
                    border: "1px solid rgba(201,168,76,0.1)",
                    textAlign: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 12,
                    letterSpacing: "0.15em",
                    color: "var(--silver)",
                    opacity: 0.4,
                  }}
                >
                  {iface.cta}
                </div>
                {iface.soon ? (
                  <p
                    style={{
                      textAlign: "center",
                      marginTop: 12,
                      fontFamily: "var(--font-display)",
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      color: "var(--gold)",
                      opacity: 0.4,
                    }}
                  >
                    {iface.soon.toUpperCase()}
                  </p>
                ) : null}
              </div>
            )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 60 }}>
          <Link
            href="/world"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.15em",
              color: "var(--silver)",
              textDecoration: "none",
              opacity: 0.4,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.4";
            }}
          >
            ← CHOOSE A DIFFERENT WORLD
          </Link>
        </div>
      </div>
    </div>
  );
}

function InterfaceFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--void)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--silver)",
        fontFamily: "var(--font-display)",
        fontSize: 12,
        letterSpacing: "0.2em",
      }}
    >
      LOADING…
    </div>
  );
}

export default function InterfacePage() {
  return (
    <Suspense fallback={<InterfaceFallback />}>
      <InterfacePageContent />
    </Suspense>
  );
}
