"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { GENRES, TIME_PERIODS, PRESET_COMBOS } from "@/lib/genres-data";
import { computeContentRating, ratingNeedsWarning, RATING_CONFIG } from "@/lib/content-rating";
import { buildPreviewText, generateRoomCode, detectPresetCombo } from "@/lib/world-preview";

const DIFFICULTIES = [
  {
    id: "casual",
    label: "Casual",
    icon: "🌿",
    desc: "Forgiving. The world helps you. Perfect for new players or story lovers.",
  },
  {
    id: "easy",
    label: "Easy",
    icon: "⚔️",
    desc: "Some challenge, mostly story. Consequences are rarely severe.",
  },
  {
    id: "medium",
    label: "Medium",
    icon: "🎯",
    desc: "Balanced challenge and story in equal measure. Recommended.",
  },
  {
    id: "hard",
    label: "Hard",
    icon: "🔥",
    desc: "Real consequences. Smart play required. The world pushes back.",
  },
  {
    id: "expert",
    label: "Expert",
    icon: "💀",
    desc: "Brutal. Every decision matters. Failure is always an option.",
  },
  {
    id: "god_mode",
    label: "God Mode",
    icon: "⚡",
    desc: "Maximum chaos. No mercy. No guardrails. The Rift decides everything.",
  },
];

const GAME_MODES = [
  {
    id: "narration",
    label: "Narration Mode",
    icon: "📖",
    desc: "Story-first. Dice rolls only for boss/nemesis moments (~15%). Perfect for ambient listening.",
    rollPercent: 15,
    color: "#4A7FD4",
  },
  {
    id: "story",
    label: "Story Mode",
    icon: "🎭",
    desc: "Rich narrative with dice at key dramatic moments (~40%). The story leads.",
    rollPercent: 40,
    color: "#1A6B2A",
  },
  {
    id: "adventure",
    label: "Adventure Mode",
    icon: "🗺",
    desc: "Balanced story and action. Frequent dice rolls (~60%). Every scene has stakes.",
    rollPercent: 60,
    color: "#8B6A0E",
    recommended: true,
  },
  {
    id: "action",
    label: "Action Mode",
    icon: "⚔️",
    desc: "Combat and conflict-heavy. Constant dice rolls (~80%). Fast-paced and tense.",
    rollPercent: 80,
    color: "#8B2020",
  },
  {
    id: "rift_decides",
    label: "The Rift Decides",
    icon: "🌀",
    desc: "The Rift randomly varies between Story, Adventure, and Action each session.",
    rollPercent: null,
    color: "#5B2D8E",
  },
];

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: i < current ? 32 : 8,
              height: 2,
              background: i < current ? "var(--gold)" : "rgba(201,168,76,0.2)",
              transition: "all 0.4s ease",
              borderRadius: 1,
            }}
          />
          {i < total - 1 ? (
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i + 1 <= current ? "var(--gold)" : "rgba(201,168,76,0.2)",
                transition: "all 0.3s ease",
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function GenreCard({ genre, selected, disabled, onClick, showPreset, presetName }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "20px 18px",
        background: selected
          ? `linear-gradient(135deg, ${genre.color}22 0%, ${genre.color}11 100%)`
          : hovered
            ? "rgba(201,168,76,0.04)"
            : "rgba(13,27,53,0.3)",
        border: selected
          ? `1px solid ${genre.color}60`
          : hovered
            ? "1px solid rgba(201,168,76,0.2)"
            : "1px solid rgba(201,168,76,0.06)",
        borderLeft: `3px solid ${selected ? genre.color : "transparent"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.3 : 1,
        outline: "none",
        transform: selected ? "translateY(-2px)" : hovered ? "translateY(-1px)" : "none",
        boxShadow: selected ? `0 4px 20px ${genre.color}20` : "none",
      }}
    >
      {showPreset && presetName ? (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: "2px 8px",
            background: "rgba(201,168,76,0.15)",
            border: "1px solid rgba(201,168,76,0.3)",
            fontFamily: "var(--font-display)",
            fontSize: 9,
            letterSpacing: "0.15em",
            color: "var(--gold)",
          }}
        >
          PRESET
        </div>
      ) : null}
      {selected ? (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: showPreset && presetName ? 52 : 8,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: genre.color,
            boxShadow: `0 0 8px ${genre.color}`,
          }}
        />
      ) : null}
      <div style={{ fontSize: 24, marginBottom: 8 }}>{genre.emoji}</div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 600,
          color: selected ? "var(--mist)" : "var(--silver)",
          marginBottom: 4,
          transition: "color 0.2s",
        }}
      >
        {genre.name}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "var(--silver)",
          opacity: 0.6,
          lineHeight: 1.4,
        }}
      >
        {genre.description}
      </div>
    </button>
  );
}

function PeriodPill({ period, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "12px 20px",
        borderRadius: 2,
        border: selected
          ? "1px solid rgba(201,168,76,0.5)"
          : hovered
            ? "1px solid rgba(201,168,76,0.25)"
            : "1px solid rgba(201,168,76,0.1)",
        background: selected
          ? "rgba(201,168,76,0.1)"
          : hovered
            ? "rgba(201,168,76,0.04)"
            : "transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none",
        textAlign: "left",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: selected ? "var(--gold)" : "var(--silver)",
          marginBottom: 4,
          transition: "color 0.2s",
        }}
      >
        {period.label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--silver)",
          opacity: 0.5,
        }}
      >
        {period.desc}
      </div>
    </button>
  );
}

function RatingGate({ rating, onConfirm, onBack }) {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const isNC17 = rating === "NC-17";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(7,8,15,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          padding: "56px 48px",
          background: "linear-gradient(135deg, rgba(139,32,32,0.15) 0%, rgba(7,8,15,0.9) 100%)",
          border: "1px solid rgba(139,32,32,0.3)",
          animation: "fade-up 0.4s ease both",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "#C04040",
            marginBottom: 24,
          }}
        >
          {isNC17 ? "ADULTS ONLY — NC-17" : "MATURE CONTENT — RATED R"}
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            color: "#FFFFFF",
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          Your world selection contains themes of violence, horror, and mature subject matter.
          {isNC17
            ? " This is the highest content tier — intended for adults only."
            : null}
        </p>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            marginBottom: 16,
            cursor: "pointer",
          }}
        >
          <div
            role="presentation"
            onClick={() => setChecked(!checked)}
            style={{
              width: 20,
              height: 20,
              flexShrink: 0,
              marginTop: 2,
              border: `2px solid ${checked ? "#C04040" : "rgba(192,64,64,0.4)"}`,
              background: checked ? "rgba(192,64,64,0.2)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {checked ? <span style={{ color: "#C04040", fontSize: 12 }}>✓</span> : null}
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#FFFFFF" }}>
            I confirm that I am 18 years of age or older.
          </span>
        </label>

        {isNC17 ? (
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              marginBottom: 16,
              cursor: "pointer",
            }}
          >
            <div
              role="presentation"
              onClick={() => setChecked2(!checked2)}
              style={{
                width: 20,
                height: 20,
                flexShrink: 0,
                marginTop: 2,
                border: `2px solid ${checked2 ? "#C04040" : "rgba(192,64,64,0.4)"}`,
                background: checked2 ? "rgba(192,64,64,0.2)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {checked2 ? <span style={{ color: "#C04040", fontSize: 12 }}>✓</span> : null}
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#FFFFFF" }}>
              I accept full responsibility and confirm no minors are present or will access this
              campaign.
            </span>
          </label>
        ) : null}

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          By proceeding you confirm you meet the age requirement. Genesis generates content using
          AI. Content may include mature themes appropriate to your chosen genre.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" onClick={onBack} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
            Change World
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!checked || (isNC17 && !checked2)}
            className="btn-primary"
            style={{
              flex: 1,
              justifyContent: "center",
              opacity: !checked || (isNC17 && !checked2) ? 0.4 : 1,
              cursor: !checked || (isNC17 && !checked2) ? "not-allowed" : "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorldBuilder({ userId }) {
  const router = useRouter();
  const [primary, setPrimary] = useState(null);
  const [period, setPeriod] = useState(null);
  const [mashOn, setMashOn] = useState(false);
  const [secondary, setSecondary] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showGate, setShowGate] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [difficulty, setDifficulty] = useState("medium");
  const [gameMode, setGameMode] = useState("adventure");

  const rating = useMemo(
    () => computeContentRating(primary, period, mashOn, secondary),
    [primary, period, mashOn, secondary],
  );

  const preview = useMemo(() => {
    if (!primary || !period) return null;
    if (mashOn && !secondary) return `${primary} + ??? — pick a second genre`;
    return buildPreviewText(primary, mashOn ? secondary : null, period, mashOn);
  }, [primary, secondary, period, mashOn]);

  const preset = useMemo(() => {
    if (!mashOn || !secondary) return null;
    return detectPresetCombo(primary, secondary);
  }, [primary, secondary, mashOn]);

  const canContinue = Boolean(primary && period) && (!mashOn || Boolean(secondary));
  const ratingConfig = rating ? RATING_CONFIG[rating] : null;

  function handlePresetSelect(p) {
    setPrimary(p.primary);
    setSecondary(p.secondary);
    setPeriod(p.period);
    setMashOn(true);
    setActiveTab("browse");
  }

  async function handleContinue() {
    if (!canContinue) return;
    if (ratingNeedsWarning(rating)) {
      setShowGate(true);
      return;
    }
    await doSave();
  }

  async function doSave() {
    setSaving(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const row = {
      user_id: userId,
      primary_genre: primary,
      secondary_genre: mashOn ? secondary : null,
      time_period: period,
      mash_enabled: mashOn,
      content_rating: rating,
      preview_text: preview,
      room_code: generateRoomCode(),
      difficulty: difficulty,
      game_mode: gameMode,
    };

    for (let attempt = 0; attempt < 8; attempt++) {
      if (attempt > 0) row.room_code = generateRoomCode();
      const { data, error: insertError } = await supabase
        .from("campaigns")
        .insert(row)
        .select("id, room_code")
        .single();

      if (!insertError && data?.id) {
        const q = new URLSearchParams({
          campaign: data.id,
          room: data.room_code,
        });
        router.push(`/interface?${q.toString()}`);
        return;
      }
      if (insertError?.code !== "23505") {
        setError(insertError?.message || "Could not save your world.");
        setSaving(false);
        return;
      }
    }
    setError("Could not generate a unique Rift code. Please try again.");
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px 80px" }}>
      {showGate ? (
        <RatingGate
          rating={rating}
          onConfirm={() => {
            setShowGate(false);
            void doSave();
          }}
          onBack={() => setShowGate(false)}
        />
      ) : null}

      <div style={{ marginBottom: 56 }}>
        <StepIndicator current={3} total={4} />
        <div className="section-label" style={{ marginBottom: 12 }}>
          Step 3 of 4
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 600,
            color: "var(--mist)",
            marginBottom: 12,
          }}
        >
          Choose Your World
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            color: "var(--silver)",
            maxWidth: 480,
          }}
        >
          Three choices. One world. The Chronicler handles everything else.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 48,
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        {[
          { id: "browse", label: "Browse Genres" },
          { id: "presets", label: "✦ Named Presets" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "14px 28px",
              background: "transparent",
              border: "none",
              borderBottom:
                activeTab === tab.id ? "2px solid var(--gold)" : "2px solid transparent",
              fontFamily: "var(--font-display)",
              fontSize: 12,
              letterSpacing: "0.15em",
              color: activeTab === tab.id ? "var(--gold)" : "var(--silver)",
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: -1,
            }}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "presets" ? (
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "var(--silver)",
              marginBottom: 32,
              opacity: 0.7,
            }}
          >
            Famous genre combinations with names. Click one to instantly configure your world.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 2,
            }}
          >
            {PRESET_COMBOS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handlePresetSelect(p)}
                style={{
                  padding: "28px 24px",
                  background: "rgba(13,27,53,0.4)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
                  e.currentTarget.style.background = "rgba(13,27,53,0.7)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)";
                  e.currentTarget.style.background = "rgba(13,27,53,0.4)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-deco)",
                    fontSize: 16,
                    color: "var(--gold)",
                    marginBottom: 8,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    color: "var(--silver)",
                    opacity: 0.5,
                    marginBottom: 12,
                  }}
                >
                  {p.primary.toUpperCase()} + {p.secondary.toUpperCase()}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--silver)",
                    lineHeight: 1.5,
                  }}
                >
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <section style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: primary ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.05)",
                  border: `1px solid ${primary ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  color: primary ? "var(--gold)" : "var(--silver)",
                  transition: "all 0.3s",
                }}
              >
                {primary ? "✓" : "1"}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "var(--mist)",
                }}
              >
                PRIMARY GENRE
              </h2>
              {primary ? (
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "var(--gold)",
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    padding: "3px 10px",
                  }}
                >
                  {primary.toUpperCase()}
                </span>
              ) : null}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 2,
              }}
            >
              {GENRES.map((g) => (
                <GenreCard
                  key={g.name}
                  genre={g}
                  selected={primary === g.name}
                  disabled={false}
                  onClick={() => {
                    setPrimary(g.name);
                    if (secondary === g.name) setSecondary(null);
                  }}
                  showPreset={mashOn && secondary}
                  presetName={
                    mashOn && secondary ? detectPresetCombo(g.name, secondary)?.name : null
                  }
                />
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: period ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.05)",
                  border: `1px solid ${period ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  color: period ? "var(--gold)" : "var(--silver)",
                  transition: "all 0.3s",
                }}
              >
                {period ? "✓" : "2"}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "var(--mist)",
                }}
              >
                TIME PERIOD
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 2,
              }}
            >
              {TIME_PERIODS.map((p) => (
                <PeriodPill
                  key={p.id}
                  period={p}
                  selected={period === p.id}
                  onClick={() => setPeriod(p.id)}
                />
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: "rgba(201,168,76,0.05)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  color: "var(--silver)",
                }}
              >
                3
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "var(--mist)",
                }}
              >
                GENRE MASH
              </h2>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "var(--silver)",
                  opacity: 0.4,
                }}
              >
                OPTIONAL
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setMashOn((v) => !v);
                if (mashOn) setSecondary(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 24px",
                background: mashOn ? "rgba(201,168,76,0.08)" : "rgba(13,27,53,0.3)",
                border: mashOn
                  ? "1px solid rgba(201,168,76,0.3)"
                  : "1px solid rgba(201,168,76,0.08)",
                cursor: "pointer",
                marginBottom: 24,
                transition: "all 0.3s ease",
                outline: "none",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 24,
                  background: mashOn ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.1)",
                  borderRadius: 12,
                  padding: 3,
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: mashOn ? "var(--gold)" : "rgba(201,168,76,0.4)",
                    transform: mashOn ? "translateX(20px)" : "translateX(0)",
                    transition: "all 0.3s ease",
                    boxShadow: mashOn ? "0 0 8px rgba(201,168,76,0.5)" : "none",
                  }}
                />
              </div>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: mashOn ? "var(--gold)" : "var(--silver)",
                    letterSpacing: "0.05em",
                    transition: "color 0.2s",
                  }}
                >
                  Mix with a second genre
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--silver)",
                    opacity: 0.5,
                  }}
                >
                  Creates a unique hybrid world — the Chronicler blends both
                </div>
              </div>
            </button>

            {mashOn ? (
              <div style={{ animation: "fade-up 0.3s ease both" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 2,
                  }}
                >
                  {GENRES.map((g) => (
                    <GenreCard
                      key={`sec-${g.name}`}
                      genre={g}
                      selected={secondary === g.name}
                      disabled={g.name === primary}
                      onClick={() => setSecondary(g.name)}
                      showPreset={Boolean(primary)}
                      presetName={primary ? detectPresetCombo(primary, g.name)?.name : null}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {/* ── STEP 4: Difficulty ── */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: "rgba(201,168,76,0.15)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  color: "var(--gold)",
                }}
              >
                4
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "var(--mist)",
                }}
              >
                DIFFICULTY
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 2,
              }}
            >
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  style={{
                    padding: "16px 14px",
                    textAlign: "left",
                    cursor: "pointer",
                    outline: "none",
                    background: difficulty === d.id ? "rgba(201,168,76,0.1)" : "rgba(13,27,53,0.3)",
                    border:
                      difficulty === d.id
                        ? "1px solid rgba(201,168,76,0.4)"
                        : "1px solid rgba(201,168,76,0.06)",
                    borderLeft:
                      difficulty === d.id ? "3px solid var(--gold)" : "3px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{d.icon}</div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: difficulty === d.id ? "var(--gold)" : "var(--silver)",
                      marginBottom: 6,
                    }}
                  >
                    {d.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--silver)",
                      opacity: 0.55,
                      lineHeight: 1.4,
                    }}
                  >
                    {d.desc}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── STEP 5: Game Mode ── */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: "rgba(201,168,76,0.15)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  color: "var(--gold)",
                }}
              >
                5
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "var(--mist)",
                }}
              >
                GAME MODE
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: 2,
              }}
            >
              {GAME_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setGameMode(m.id)}
                  style={{
                    padding: "20px 18px",
                    textAlign: "left",
                    cursor: "pointer",
                    outline: "none",
                    position: "relative",
                    background: gameMode === m.id ? `${m.color}18` : "rgba(13,27,53,0.3)",
                    border:
                      gameMode === m.id
                        ? `1px solid ${m.color}50`
                        : "1px solid rgba(201,168,76,0.06)",
                    borderLeft: gameMode === m.id ? `3px solid ${m.color}` : "3px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  {m.recommended ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        padding: "2px 8px",
                        background: "rgba(201,168,76,0.12)",
                        border: "1px solid rgba(201,168,76,0.25)",
                        fontFamily: "var(--font-display)",
                        fontSize: 8,
                        letterSpacing: "0.15em",
                        color: "var(--gold)",
                      }}
                    >
                      DEFAULT
                    </div>
                  ) : null}
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{m.icon}</div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: gameMode === m.id ? "var(--mist)" : "var(--silver)",
                      marginBottom: 8,
                    }}
                  >
                    {m.label}
                  </div>
                  {m.rollPercent !== null ? (
                    <div style={{ marginBottom: 8 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                          fontFamily: "var(--font-display)",
                          fontSize: 9,
                          color: m.color,
                          opacity: 0.7,
                        }}
                      >
                        <span>STORY</span>
                        <span>DICE {m.rollPercent}%</span>
                      </div>
                      <div
                        style={{
                          height: 3,
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: 2,
                        }}
                      >
                        <div
                          style={{
                            width: `${m.rollPercent}%`,
                            height: "100%",
                            background: m.color,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--silver)",
                      opacity: 0.55,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.desc}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "linear-gradient(to top, rgba(7,8,15,0.98) 80%, transparent)",
          paddingTop: 40,
          paddingBottom: 32,
          marginTop: 32,
        }}
      >
        <div
          style={{
            padding: "28px 32px",
            background: "rgba(13,27,53,0.6)",
            border: "1px solid rgba(201,168,76,0.15)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                letterSpacing: "0.25em",
                color: "var(--silver)",
                opacity: 0.5,
                marginBottom: 8,
              }}
            >
              LIVE PREVIEW
            </div>

            {preview ? (
              <div>
                {preset ? (
                  <div
                    style={{
                      fontFamily: "var(--font-deco)",
                      fontSize: 18,
                      color: "var(--gold)",
                      marginBottom: 4,
                    }}
                  >
                    {preset.name}
                  </div>
                ) : null}
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 17,
                    color: "var(--mist)",
                    fontStyle: preset ? "italic" : "normal",
                  }}
                >
                  {preset ? preset.desc : preview}
                </div>
              </div>
            ) : (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  color: "var(--silver)",
                  opacity: 0.4,
                  fontStyle: "italic",
                }}
              >
                Select a genre and time period to preview your world...
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {ratingConfig ? (
              <div
                style={{
                  padding: "8px 16px",
                  background: ratingConfig.bg,
                  border: `1px solid ${ratingConfig.color}40`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: ratingConfig.color,
                  }}
                >
                  {ratingConfig.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: ratingConfig.color,
                    opacity: 0.7,
                  }}
                >
                  {ratingConfig.desc.toUpperCase()}
                </span>
                {ratingNeedsWarning(rating) ? <span style={{ fontSize: 14 }}>⚠️</span> : null}
              </div>
            ) : null}

            <button
              type="button"
              disabled={!canContinue || saving}
              onClick={handleContinue}
              className="btn-primary"
              style={{
                opacity: !canContinue || saving ? 0.4 : 1,
                cursor: !canContinue || saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Opening the Rift..." : canContinue ? "Continue ⚔" : "Choose Genre + Period"}
            </button>
          </div>

          {error ? (
            <div
              style={{
                width: "100%",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "#C04040",
                paddingTop: 8,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
