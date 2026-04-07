"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Card definitions (mirrors the bot) ────────────────────
const CARD_DEFS = {
  lucky_break: {
    name: "Lucky Break",
    tier: "common",
    icon: "🍀",
    desc: "Once: reroll any single die. You must take the new result.",
    limit: "Once per session",
  },
  quick_recovery: {
    name: "Quick Recovery",
    tier: "common",
    icon: "💚",
    desc: "Once: recover 1d6 HP instantly as a free action.",
    limit: "Once per session",
  },
  steady_hand: {
    name: "Steady Hand",
    tier: "common",
    icon: "🎯",
    desc: "Once: your next attack or skill check has advantage — roll twice, take the higher.",
    limit: "Once per session",
  },
  battlecry: {
    name: "Battle Cry",
    tier: "common",
    icon: "📣",
    desc: "Once: your words inspire. In solo play you gain +3 to your next roll.",
    limit: "Once per session",
  },
  iron_will: {
    name: "Iron Will",
    tier: "uncommon",
    icon: "🪨",
    desc: "Once: ignore all consequences of one failed roll. The failure still happened but nothing bad results.",
    limit: "Once per campaign",
  },
  shadow_step: {
    name: "Shadow Step",
    tier: "uncommon",
    icon: "🌑",
    desc: "Once: move to any location in the current scene unseen. No roll required.",
    limit: "Once per session",
  },
  counter_strike: {
    name: "Counter Strike",
    tier: "uncommon",
    icon: "⚔️",
    desc: "Once: immediately after being hit, make a free attack back against the attacker.",
    limit: "Once per session",
  },
  read_the_room: {
    name: "Read the Room",
    tier: "uncommon",
    icon: "👁️",
    desc: "Once: the Chronicler reveals one hidden truth about the current scene.",
    limit: "Once per session",
  },
  overcharge: {
    name: "Overcharge",
    tier: "uncommon",
    icon: "⚡",
    desc: "Once: double the damage or effect of your next successful action.",
    limit: "Once per session",
  },
  second_wind: {
    name: "Second Wind",
    tier: "rare",
    icon: "💨",
    desc: "Once: recover 2d8 + character level HP as a free action.",
    limit: "Once per campaign",
  },
  fate_twist: {
    name: "Fate Twist",
    tier: "rare",
    icon: "🌀",
    desc: "Once: force the Chronicler to reroll any story outcome.",
    limit: "Once per campaign",
  },
  allies_appear: {
    name: "Unexpected Allies",
    tier: "rare",
    icon: "🤝",
    desc: "Once: one or more unexpected allies arrive at the right moment.",
    limit: "Once per campaign",
  },
  echo_surge: {
    name: "Echo Surge",
    tier: "rare",
    icon: "🌟",
    desc: "Once: your next action is treated as a natural 20 result regardless of what you roll.",
    limit: "Once per session",
  },
  reality_anchor: {
    name: "Reality Anchor",
    tier: "mythic",
    icon: "⚓",
    desc: "Once: negate any single story event entirely — it did not happen.",
    limit: "Once per campaign",
  },
  rift_step: {
    name: "Rift Step",
    tier: "mythic",
    icon: "🌀",
    desc: "Once: teleport to any location you have previously visited in this campaign.",
    limit: "Once per campaign",
  },
  nemesis_token: {
    name: "Nemesis Token",
    tier: "mythic",
    icon: "👁️",
    desc: "Once: reduce your Nemesis's strength by one tier and gain information about their next move.",
    limit: "Once per campaign",
  },
  legendary_strike: {
    name: "Legendary Strike",
    tier: "mythic",
    icon: "⚡",
    desc: "Once: one attack deals maximum possible damage and applies all possible status effects.",
    limit: "Once per campaign",
  },
};

const TIER_ORDER = ["common", "uncommon", "rare", "mythic"];
const TIER_COLORS = {
  common: {
    border: "#A8B8D0",
    bg: "rgba(168,184,208,0.06)",
    label: "COMMON",
    glow: "rgba(168,184,208,0.1)",
  },
  uncommon: {
    border: "#1A6B2A",
    bg: "rgba(26,107,42,0.08)",
    label: "UNCOMMON",
    glow: "rgba(26,107,42,0.15)",
  },
  rare: {
    border: "#1A4A8B",
    bg: "rgba(26,74,139,0.1)",
    label: "RARE",
    glow: "rgba(26,74,139,0.2)",
  },
  mythic: {
    border: "#8B2020",
    bg: "rgba(139,32,32,0.12)",
    label: "MYTHIC",
    glow: "rgba(139,32,32,0.25)",
  },
};

// ── Card visual ────────────────────────────────────────────
function AbilityCard({ cardRow, used = false }) {
  const [flipped, setFlipped] = useState(false);
  const def = CARD_DEFS[cardRow.card_id] || {
    name: cardRow.card_name,
    tier: cardRow.tier || "common",
    icon: "🃏",
    desc: "An ability card.",
    limit: "Varies",
  };
  const tier = def.tier;
  const colors = TIER_COLORS[tier] || TIER_COLORS.common;

  function toggleFlip() {
    if (!used) setFlipped((f) => !f);
  }

  return (
    <div
      role={used ? undefined : "button"}
      tabIndex={used ? undefined : 0}
      onClick={toggleFlip}
      onKeyDown={(e) => {
        if (used) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleFlip();
        }
      }}
      style={{
        cursor: used ? "default" : "pointer",
        position: "relative",
        padding: "24px 20px",
        background: used ? "rgba(13,27,53,0.15)" : colors.bg,
        border: `1px solid ${used ? "rgba(201,168,76,0.05)" : `${colors.border}40`}`,
        borderTop: `3px solid ${used ? "rgba(201,168,76,0.1)" : colors.border}`,
        opacity: used ? 0.45 : 1,
        transition: "all 0.2s ease",
        boxShadow: used ? "none" : flipped ? `0 0 20px ${colors.glow}` : "none",
        transform: flipped ? "translateY(-4px)" : "none",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "2px 10px",
          background: `${colors.border}15`,
          border: `1px solid ${colors.border}30`,
          fontFamily: "var(--font-display)",
          fontSize: 8,
          letterSpacing: "0.2em",
          color: used ? "rgba(201,168,76,0.3)" : colors.border,
          marginBottom: 14,
        }}
      >
        {colors.label}
      </div>

      {used && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontFamily: "var(--font-display)",
            fontSize: 9,
            letterSpacing: "0.15em",
            color: "rgba(201,168,76,0.3)",
          }}
        >
          USED
        </div>
      )}

      <div
        style={{
          fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
          fontSize: 36,
          marginBottom: 14,
          filter: used ? "grayscale(1)" : "none",
        }}
      >
        {def.icon}
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 15,
          fontWeight: 600,
          color: used ? "rgba(168,184,208,0.4)" : "var(--mist)",
          marginBottom: 10,
          lineHeight: 1.2,
        }}
      >
        {def.name}
      </div>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: used ? "rgba(168,184,208,0.3)" : "var(--silver)",
          lineHeight: 1.6,
          opacity: flipped || used ? 0.8 : 0.5,
          marginBottom: 14,
          transition: "opacity 0.2s",
        }}
      >
        {def.desc}
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 9,
          letterSpacing: "0.12em",
          color: used ? "rgba(201,168,76,0.2)" : colors.border,
          opacity: 0.7,
          marginBottom: 8,
        }}
      >
        {def.limit.toUpperCase()}
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 8,
          letterSpacing: "0.1em",
          color: "var(--silver)",
          opacity: 0.25,
        }}
      >
        {used
          ? `Used ${cardRow.used_at ? new Date(cardRow.used_at).toLocaleDateString() : ""}`
          : `Earned: ${cardRow.earned_from || "Unknown"}`}
      </div>

      {!used && !flipped && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 14,
            fontFamily: "var(--font-display)",
            fontSize: 8,
            letterSpacing: "0.1em",
            color: colors.border,
            opacity: 0.4,
          }}
        >
          TAP TO REVEAL ↗
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────
export default function CardsPage({ character, availableCards, usedCards }) {
  const [showUsed, setShowUsed] = useState(false);
  const [filterTier, setFilterTier] = useState("all");

  const filteredAvailable = availableCards.filter((card) => {
    if (filterTier === "all") return true;
    const def = CARD_DEFS[card.card_id];
    return def?.tier === filterTier;
  });

  const tierCounts = TIER_ORDER.reduce((acc, tier) => {
    acc[tier] = availableCards.filter((c) => CARD_DEFS[c.card_id]?.tier === tier).length;
    return acc;
  }, {});

  const level = character.level || 1;
  const nextMilestone = [3, 6, 9, 12, 15, 18, 20].find((l) => l > level) || null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--void)", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <img
          src="/genesis-bg-rift-tinted.png"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(7,8,15,0.82)" }} />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <div
          style={{
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(201,168,76,0.08)",
            marginBottom: 40,
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image src="/genesis-logo.png" alt="Genesis" width={32} height={32} style={{ objectFit: "contain" }} />
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
          </Link>
          <Link
            href={`/character/${character.id}`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.15em",
              color: "var(--silver)",
              opacity: 0.5,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            ← {character.name}
          </Link>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "var(--gold)",
              opacity: 0.7,
              marginBottom: 8,
            }}
          >
            ABILITY CARDS
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 600,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            {character.name}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--silver)", opacity: 0.5 }}>
            {availableCards.length} card{availableCards.length !== 1 ? "s" : ""} in hand
            {usedCards.length > 0 && ` · ${usedCards.length} used`}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 2,
            marginBottom: 32,
          }}
        >
          <button
            type="button"
            onClick={() => setFilterTier("all")}
            style={{
              padding: "12px 16px",
              background: filterTier === "all" ? "rgba(201,168,76,0.1)" : "rgba(13,27,53,0.3)",
              border:
                filterTier === "all" ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(201,168,76,0.07)",
              cursor: "pointer",
              outline: "none",
              textAlign: "center",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontFamily: "var(--font-deco)", fontSize: 20, color: "var(--gold)", marginBottom: 4 }}>
              {availableCards.length}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 9,
                letterSpacing: "0.15em",
                color: "var(--silver)",
                opacity: 0.5,
              }}
            >
              ALL
            </div>
          </button>

          {TIER_ORDER.map((tier) => {
            const colors = TIER_COLORS[tier];
            const count = tierCounts[tier] || 0;
            const active = filterTier === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setFilterTier(tier)}
                style={{
                  padding: "12px 16px",
                  background: active ? colors.bg : "rgba(13,27,53,0.3)",
                  border: active ? `1px solid ${colors.border}50` : "1px solid rgba(201,168,76,0.07)",
                  cursor: "pointer",
                  outline: "none",
                  textAlign: "center",
                  transition: "all 0.2s",
                  opacity: count === 0 ? 0.3 : 1,
                }}
              >
                <div style={{ fontFamily: "var(--font-deco)", fontSize: 20, color: colors.border, marginBottom: 4 }}>
                  {count}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    color: colors.border,
                    opacity: 0.7,
                  }}
                >
                  {colors.label}
                </div>
              </button>
            );
          })}
        </div>

        {filteredAvailable.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 2,
              marginBottom: 48,
            }}
          >
            {filteredAvailable.map((card) => (
              <AbilityCard key={card.id} cardRow={card} used={false} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "56px 32px",
              background: "rgba(13,27,53,0.3)",
              border: "1px solid rgba(201,168,76,0.07)",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            {filterTier !== "all" ? (
              <>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontStyle: "italic",
                    fontSize: 16,
                    color: "var(--silver)",
                    opacity: 0.4,
                    marginBottom: 12,
                  }}
                >
                  No {filterTier} cards in hand.
                </div>
                <button
                  type="button"
                  onClick={() => setFilterTier("all")}
                  style={{
                    padding: "8px 20px",
                    background: "transparent",
                    border: "1px solid rgba(201,168,76,0.2)",
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    color: "var(--silver)",
                    cursor: "pointer",
                  }}
                >
                  SHOW ALL CARDS
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontStyle: "italic",
                    fontSize: 18,
                    color: "var(--silver)",
                    opacity: 0.4,
                    marginBottom: 16,
                  }}
                >
                  No ability cards in hand yet.
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "var(--silver)",
                    opacity: 0.3,
                    lineHeight: 1.8,
                  }}
                >
                  {nextMilestone
                    ? `Reach Level ${nextMilestone} to earn your next card.`
                    : "Cards are earned through story moments and level milestones."}
                </div>
              </>
            )}
          </div>
        )}

        <div
          style={{
            padding: "24px 28px",
            background: "rgba(13,27,53,0.25)",
            border: "1px solid rgba(201,168,76,0.07)",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "var(--silver)",
              opacity: 0.4,
              marginBottom: 16,
            }}
          >
            HOW TO EARN CARDS
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {[
              { icon: "⚡", label: "Milestone Levels", desc: "Levels 3, 6, 9, 12, 15, 18, 20" },
              { icon: "💀", label: "Boss Defeats", desc: "Rare card awarded automatically" },
              { icon: "✦", label: "Rift Events", desc: "Rare random story moments" },
              { icon: "🎭", label: "Exceptional Play", desc: "Chronicler awards for outstanding roleplay" },
              { icon: "👁️", label: "Nemesis Resolved", desc: "Major card for major victories" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
                    fontSize: 20,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 11,
                      color: "var(--mist)",
                      marginBottom: 3,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--silver)",
                      opacity: 0.45,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {usedCards.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowUsed((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                marginBottom: 16,
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "var(--silver)",
                  opacity: 0.4,
                }}
              >
                USED CARDS ({usedCards.length})
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  color: "var(--silver)",
                  opacity: 0.3,
                }}
              >
                {showUsed ? "▲" : "▼"}
              </div>
            </button>

            {showUsed && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 2,
                }}
              >
                {usedCards.map((card) => (
                  <AbilityCard key={card.id} cardRow={card} used={true} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
