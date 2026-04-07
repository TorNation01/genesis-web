"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ABILITY_SCORES,
  CLASSES,
  getModifier,
  calculateHP,
  getUSB,
  getFeatsForLevel,
} from "@/lib/character-data";

// ── Helpers ────────────────────────────────────────────────
const TIER_COLORS = {
  common: "#A8B8D0",
  uncommon: "#1A6B2A",
  rare: "#1A4A8B",
  epic: "#5B2D8E",
  legendary: "#C9A84C",
  mythic: "#8B2020",
};

const LEVEL_PROGRESSION = [
  { level: 1, campaignsNeeded: 0 },
  { level: 2, campaignsNeeded: 1 },
  { level: 3, campaignsNeeded: 2 },
  { level: 4, campaignsNeeded: 4 },
  { level: 5, campaignsNeeded: 6 },
  { level: 6, campaignsNeeded: 8 },
  { level: 7, campaignsNeeded: 11 },
  { level: 8, campaignsNeeded: 14 },
  { level: 9, campaignsNeeded: 18 },
  { level: 10, campaignsNeeded: 22 },
  { level: 11, campaignsNeeded: 27 },
  { level: 12, campaignsNeeded: 32 },
  { level: 13, campaignsNeeded: 38 },
  { level: 14, campaignsNeeded: 44 },
  { level: 15, campaignsNeeded: 51 },
  { level: 16, campaignsNeeded: 58 },
  { level: 17, campaignsNeeded: 66 },
  { level: 18, campaignsNeeded: 75 },
  { level: 19, campaignsNeeded: 85 },
  { level: 20, campaignsNeeded: 96 },
];

const SPIKE_LEVELS = new Set([3, 6, 9, 12, 15, 18, 20]);

function getNextThreshold(level) {
  const next = LEVEL_PROGRESSION.find((t) => t.level === level + 1);
  return next?.campaignsNeeded ?? null;
}

function StatCard({ label, score }) {
  const mod = getModifier(score || 10);
  return (
    <div
      style={{
        padding: "16px 12px",
        background: "rgba(13,27,53,0.5)",
        border: "1px solid rgba(201,168,76,0.1)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "var(--silver)",
          opacity: 0.5,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-deco)",
          fontSize: 32,
          color: "var(--gold)",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {score || 10}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 14,
          color: mod >= 0 ? "#1A9B4A" : "#C04040",
        }}
      >
        {mod >= 0 ? `+${mod}` : mod}
      </div>
    </div>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 11,
          letterSpacing: "0.25em",
          color: "var(--gold)",
          opacity: 0.7,
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--silver)",
            opacity: 0.5,
          }}
        >
          {sub}
        </div>
      )}
      <div
        style={{
          height: 1,
          marginTop: 8,
          background: "linear-gradient(to right, rgba(201,168,76,0.3), transparent)",
        }}
      />
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "12px 24px",
        background: "transparent",
        border: "none",
        borderBottom: active ? "2px solid var(--gold)" : "2px solid transparent",
        fontFamily: "var(--font-display)",
        fontSize: 11,
        letterSpacing: "0.15em",
        color: active ? "var(--gold)" : "var(--silver)",
        cursor: "pointer",
        transition: "all 0.2s",
        opacity: active ? 1 : 0.5,
        marginBottom: -1,
      }}
    >
      {label}
    </button>
  );
}

export default function CharacterSheet({ character, inventory, cards, sparkLog, levelLog, userId }) {
  void userId;

  const [activeTab, setActiveTab] = useState("stats");

  const level = character.level || 1;
  const usb = getUSB(level);
  const campaignsDone = character.campaigns_completed || 0;
  const nextThreshold = getNextThreshold(level);
  const progressPct = nextThreshold
    ? Math.min(
        100,
        ((campaignsDone - (LEVEL_PROGRESSION.find((t) => t.level === level)?.campaignsNeeded || 0)) /
          (nextThreshold - (LEVEL_PROGRESSION.find((t) => t.level === level)?.campaignsNeeded || 0))) *
          100,
      )
    : 100;

  const abilityScores = character.ability_scores || {};
  const skills = character.skills || {};
  const proficiencies = character.proficiencies || {};
  const feats = character.feats || [];
  const classData = CLASSES.find((c) => c.id === character.archetype);
  const hp = calculateHP(classData, abilityScores.constitution, level);
  const spark = character.spark || 0;
  const sparkMax = character.spark_max || 10;

  const equippedItems = inventory.filter((i) => i.is_equipped);
  const packItems = inventory.filter((i) => !i.is_equipped);
  const isSpike = SPIKE_LEVELS.has(level);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--void)",
        position: "relative",
      }}
    >
      {/* Background */}
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
        {/* ── TOP NAV ── */}
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
          <div style={{ display: "flex", gap: 16 }}>
            <Link
              href={`/character/${character.id}/levelup`}
              style={{
                padding: "8px 20px",
                background: isSpike ? "rgba(201,168,76,0.15)" : "transparent",
                border: `1px solid ${isSpike ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.15)"}`,
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--gold)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              {isSpike ? "⚡ LEVEL UP AVAILABLE" : "LEVEL UP"}
            </Link>
            <Link
              href={`/character/${character.id}/cards`}
              style={{
                padding: "8px 20px",
                background: "transparent",
                border: "1px solid rgba(201,168,76,0.15)",
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--silver)",
                textDecoration: "none",
              }}
            >
              🃏 CARDS ({cards.length})
            </Link>
          </div>
        </div>

        {/* ── CHARACTER HEADER ── */}
        <div
          style={{
            padding: "32px 36px",
            background: "rgba(13,27,53,0.4)",
            border: "1px solid rgba(201,168,76,0.12)",
            marginBottom: 2,
            display: "flex",
            gap: 40,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {/* Identity */}
          <div style={{ flex: "1 1 260px" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "var(--gold)",
                opacity: 0.6,
                marginBottom: 8,
              }}
            >
              CHARACTER
            </div>
            <h1
              style={{
                fontFamily: "var(--font-deco)",
                fontSize: "clamp(28px, 4vw, 40px)",
                color: "var(--mist)",
                marginBottom: 8,
                lineHeight: 1.1,
              }}
            >
              {character.name || "Unnamed"}
            </h1>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {[character.race, character.class, character.background].filter(Boolean).map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "3px 12px",
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    fontFamily: "var(--font-display)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    color: "var(--gold)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {character.gender && (
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "var(--silver)",
                  opacity: 0.4,
                }}
              >
                {character.gender.toUpperCase().replace("_", " ")}
              </div>
            )}
          </div>

          {/* Level and progress */}
          <div style={{ flex: "0 0 auto", minWidth: 180 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "var(--silver)",
                opacity: 0.5,
                marginBottom: 8,
              }}
            >
              LEVEL
            </div>
            <div
              style={{
                fontFamily: "var(--font-deco)",
                fontSize: 56,
                color: isSpike ? "var(--gold)" : "var(--mist)",
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {level}
            </div>
            {isSpike && (
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  color: "var(--gold)",
                  marginBottom: 12,
                }}
              >
                ⚡ SPIKE LEVEL
              </div>
            )}
            {/* Progress bar */}
            {level < 20 && nextThreshold && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: "var(--silver)",
                    opacity: 0.4,
                    marginBottom: 6,
                  }}
                >
                  <span>{campaignsDone} campaigns</span>
                  <span>Next: {nextThreshold}</span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: "rgba(201,168,76,0.1)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progressPct}%`,
                      height: "100%",
                      background: "linear-gradient(to right, var(--gold), #E8B94F)",
                      borderRadius: 2,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            )}
            {level === 20 && (
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "var(--gold)",
                }}
              >
                MAX LEVEL — ASCENSION AVAILABLE
              </div>
            )}
          </div>

          {/* Core stats */}
          <div style={{ flex: "0 0 auto" }}>
            {[
              { label: "HP", value: hp, color: "#1A6B2A" },
              { label: "USB", value: `+${usb}`, color: "#4A7FD4" },
              { label: "HIT DIE", value: classData?.hitDie || "d8", color: "#8B6A0E" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    color: "var(--silver)",
                    opacity: 0.4,
                    width: 60,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-deco)",
                    fontSize: 24,
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Spark */}
          <div style={{ flex: "0 0 auto" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "var(--silver)",
                opacity: 0.5,
                marginBottom: 12,
              }}
            >
              SPARK
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 140, marginBottom: 8 }}>
              {Array.from({ length: sparkMax }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: i < spark ? "var(--gold)" : "rgba(201,168,76,0.12)",
                    boxShadow: i < spark ? "0 0 6px rgba(201,168,76,0.5)" : "none",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontFamily: "var(--font-deco)",
                fontSize: 22,
                color: "var(--gold)",
              }}
            >
              {spark}
              <span style={{ fontSize: 14, opacity: 0.4 }}>/{sparkMax}</span>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid rgba(201,168,76,0.1)",
            marginBottom: 32,
            background: "rgba(7,8,15,0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          {[
            { id: "stats", label: "STATS" },
            { id: "skills", label: "SKILLS" },
            { id: "inventory", label: "INVENTORY" },
            { id: "cards", label: "CARDS" },
            { id: "history", label: "HISTORY" },
          ].map((tab) => (
            <Tab key={tab.id} label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
          ))}
        </div>

        {/* ── STATS TAB ── */}
        {activeTab === "stats" && (
          <div>
            <SectionHeader title="ABILITY SCORES" sub="Base scores with racial bonuses applied" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: 2,
                marginBottom: 40,
              }}
            >
              {ABILITY_SCORES.map((ability) => (
                <StatCard key={ability.id} label={ability.abbr} score={abilityScores[ability.id]} />
              ))}
            </div>

            <SectionHeader title="SAVING THROWS" sub="From class proficiency" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 2,
                marginBottom: 40,
              }}
            >
              {ABILITY_SCORES.map((ability) => {
                const isProficient =
                  proficiencies?.savingThrows?.includes(ability.id) || classData?.savingThrows?.includes(ability.id);
                const score = abilityScores[ability.id] || 10;
                const mod = getModifier(score) + (isProficient ? usb : 0);
                return (
                  <div
                    key={ability.id}
                    style={{
                      padding: "12px 16px",
                      background: isProficient ? "rgba(201,168,76,0.07)" : "rgba(13,27,53,0.3)",
                      border: isProficient
                        ? "1px solid rgba(201,168,76,0.2)"
                        : "1px solid rgba(201,168,76,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 11,
                          color: isProficient ? "var(--gold)" : "var(--silver)",
                          marginBottom: 2,
                        }}
                      >
                        {ability.name}
                      </div>
                      {isProficient && (
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 8,
                            letterSpacing: "0.1em",
                            color: "var(--gold)",
                            opacity: 0.5,
                          }}
                        >
                          PROFICIENT
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-deco)",
                        fontSize: 20,
                        color: mod >= 0 ? "#1A9B4A" : "#C04040",
                      }}
                    >
                      {mod >= 0 ? `+${mod}` : mod}
                    </div>
                  </div>
                );
              })}
            </div>

            <SectionHeader title="PROFICIENCIES" sub="Armor, weapons, and tools" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 2,
                marginBottom: 40,
              }}
            >
              {[
                { label: "Armor", items: proficiencies?.armor || classData?.armorProf || [] },
                { label: "Weapons", items: proficiencies?.weapons || classData?.weaponProf || [] },
                { label: "Tools", items: proficiencies?.tools || [] },
                { label: "Languages", items: proficiencies?.languages || [] },
              ].map((group) => (
                <div
                  key={group.label}
                  style={{
                    padding: "16px",
                    background: "rgba(13,27,53,0.35)",
                    border: "1px solid rgba(201,168,76,0.07)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      color: "var(--silver)",
                      opacity: 0.5,
                      marginBottom: 10,
                    }}
                  >
                    {group.label.toUpperCase()}
                  </div>
                  {group.items.length > 0 ? (
                    group.items.map((item) => (
                      <div
                        key={item}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          color: "var(--silver)",
                          marginBottom: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ color: "var(--gold)", fontSize: 8 }}>◆</span>
                        {item}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--silver)",
                        opacity: 0.3,
                        fontStyle: "italic",
                      }}
                    >
                      None
                    </div>
                  )}
                </div>
              ))}
            </div>

            {feats.length > 0 && (
              <>
                <SectionHeader title="FEATS" sub="Unlocked abilities" />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 2,
                    marginBottom: 40,
                  }}
                >
                  {feats.map((featId) => {
                    const allFeats = getFeatsForLevel(20);
                    const feat = allFeats.find((f) => f.id === featId);
                    if (!feat) return null;
                    return (
                      <div
                        key={featId}
                        style={{
                          padding: "16px",
                          background: "rgba(13,27,53,0.35)",
                          border: "1px solid rgba(201,168,76,0.08)",
                          borderLeft: "3px solid var(--gold)",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 13,
                            color: "var(--mist)",
                            marginBottom: 6,
                          }}
                        >
                          {feat.name}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            color: "var(--silver)",
                            opacity: 0.6,
                            lineHeight: 1.5,
                          }}
                        >
                          {feat.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SKILLS TAB ── */}
        {activeTab === "skills" && (
          <div>
            <SectionHeader title="SKILLS" sub="Primary and secondary proficiencies" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 2,
              }}
            >
              {Object.entries(skills).map(([skillName, type]) => {
                const isPrimary = type === "primary";
                const isSecondary = type === "secondary";
                const skillBonus = isPrimary ? usb * 2 : isSecondary ? usb : 0;
                return (
                  <div
                    key={skillName}
                    style={{
                      padding: "14px 16px",
                      background: isPrimary ? "rgba(201,168,76,0.08)" : "rgba(13,27,53,0.35)",
                      border: isPrimary
                        ? "1px solid rgba(201,168,76,0.2)"
                        : "1px solid rgba(201,168,76,0.06)",
                      borderLeft: `3px solid ${isPrimary ? "var(--gold)" : "rgba(201,168,76,0.2)"}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 12,
                          color: isPrimary ? "var(--mist)" : "var(--silver)",
                          marginBottom: 3,
                        }}
                      >
                        {skillName}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 8,
                          letterSpacing: "0.12em",
                          color: isPrimary ? "var(--gold)" : "rgba(201,168,76,0.4)",
                        }}
                      >
                        {isPrimary ? "PRIMARY — EXPERT" : "SECONDARY — TRAINED"}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-deco)",
                        fontSize: 20,
                        color: isPrimary ? "#1A9B4A" : "#4A7FD4",
                      }}
                    >
                      +{skillBonus}
                    </div>
                  </div>
                );
              })}
              {Object.keys(skills).length === 0 && (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    color: "var(--silver)",
                    opacity: 0.4,
                    fontStyle: "italic",
                    padding: 24,
                    gridColumn: "1 / -1",
                  }}
                >
                  No skills selected yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── INVENTORY TAB ── */}
        {activeTab === "inventory" && (
          <div>
            {equippedItems.length > 0 && (
              <>
                <SectionHeader title="EQUIPPED" sub="Currently worn or held" />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: 2,
                    marginBottom: 32,
                  }}
                >
                  {equippedItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "14px 16px",
                        background: "rgba(27,58,107,0.2)",
                        border: "1px solid rgba(74,127,212,0.2)",
                        borderLeft: "3px solid #4A7FD4",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 12,
                          color: "var(--mist)",
                          marginBottom: 4,
                        }}
                      >
                        {item.item_name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 8,
                          letterSpacing: "0.12em",
                          color: "#4A7FD4",
                          opacity: 0.7,
                        }}
                      >
                        EQUIPPED — {(item.slot_location || "pack").replace("_", " ").toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <SectionHeader title="PACK" sub={`${packItems.length} items`} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 2,
              }}
            >
              {packItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "14px 16px",
                    background: item.is_custom ? "rgba(27,58,107,0.12)" : "rgba(13,27,53,0.35)",
                    border: item.is_custom
                      ? "1px solid rgba(201,168,76,0.2)"
                      : "1px solid rgba(201,168,76,0.06)",
                    borderLeft: item.is_custom ? "3px solid var(--gold)" : "3px solid transparent",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 12,
                        color: "var(--mist)",
                      }}
                    >
                      {item.item_name}
                    </div>
                    {item.quantity > 1 && (
                      <div
                        style={{
                          fontFamily: "var(--font-deco)",
                          fontSize: 16,
                          color: "var(--gold)",
                        }}
                      >
                        ×{item.quantity}
                      </div>
                    )}
                  </div>
                  {item.notes && (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--silver)",
                        opacity: 0.5,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.notes}
                    </div>
                  )}
                  {item.is_custom && (
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 8,
                        letterSpacing: "0.12em",
                        color: "var(--gold)",
                        opacity: 0.6,
                        marginTop: 6,
                      }}
                    >
                      ✦ PERSONAL ITEM
                    </div>
                  )}
                </div>
              ))}
              {packItems.length === 0 && (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    color: "var(--silver)",
                    opacity: 0.4,
                    fontStyle: "italic",
                    padding: 24,
                    gridColumn: "1 / -1",
                  }}
                >
                  Pack is empty.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CARDS TAB ── */}
        {activeTab === "cards" && (
          <div>
            <SectionHeader title="ABILITY CARDS" sub={`${cards.length} cards in hand`} />
            {cards.length === 0 ? (
              <div
                style={{
                  padding: "48px 32px",
                  background: "rgba(13,27,53,0.3)",
                  border: "1px solid rgba(201,168,76,0.08)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontStyle: "italic",
                    fontSize: 16,
                    color: "var(--silver)",
                    opacity: 0.5,
                    marginBottom: 16,
                  }}
                >
                  No cards in hand.
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "var(--silver)",
                    opacity: 0.3,
                  }}
                >
                  Reach Level 3 to earn your first ability card.
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 2,
                }}
              >
                {cards.map((card) => {
                  const tierKey = (card.tier || "common").toLowerCase();
                  const color = TIER_COLORS[tierKey] || "var(--silver)";
                  return (
                    <div
                      key={card.id}
                      style={{
                        padding: "24px 20px",
                        background: `${color}10`,
                        border: `1px solid ${color}30`,
                        borderTop: `3px solid ${color}`,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 9,
                          letterSpacing: "0.2em",
                          color,
                          opacity: 0.7,
                          marginBottom: 8,
                        }}
                      >
                        {String(card.tier || "common").toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 15,
                          fontWeight: 600,
                          color: "var(--mist)",
                          marginBottom: 10,
                        }}
                      >
                        {card.card_name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          color: "var(--silver)",
                          lineHeight: 1.6,
                          marginBottom: 12,
                          opacity: 0.75,
                        }}
                      >
                        {card.card_name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 9,
                          letterSpacing: "0.1em",
                          color: "var(--silver)",
                          opacity: 0.4,
                        }}
                      >
                        Earned: {card.earned_from || "Unknown"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === "history" && (
          <div>
            {levelLog.length > 0 && (
              <>
                <SectionHeader title="LEVEL HISTORY" sub="Milestone progression" />
                <div style={{ marginBottom: 40 }}>
                  {levelLog.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        padding: "14px 20px",
                        background: "rgba(13,27,53,0.35)",
                        border: "1px solid rgba(201,168,76,0.07)",
                        borderLeft: `3px solid ${SPIKE_LEVELS.has(entry.level_reached) ? "var(--gold)" : "rgba(201,168,76,0.2)"}`,
                        marginBottom: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 13,
                            color: "var(--mist)",
                          }}
                        >
                          Level {entry.level_reached}
                          {SPIKE_LEVELS.has(entry.level_reached) && (
                            <span style={{ color: "var(--gold)", marginLeft: 8 }}>⚡</span>
                          )}
                        </div>
                        {entry.feat_chosen && (
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 12,
                              color: "var(--silver)",
                              opacity: 0.5,
                            }}
                          >
                            Feat: {entry.feat_chosen}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 10,
                          color: "var(--silver)",
                          opacity: 0.3,
                        }}
                      >
                        {new Date(entry.triggered_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {sparkLog.length > 0 && (
              <>
                <SectionHeader title="SPARK HISTORY" sub="Recent spark events" />
                <div>
                  {sparkLog.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        padding: "12px 20px",
                        background: "rgba(13,27,53,0.3)",
                        border: "1px solid rgba(201,168,76,0.05)",
                        marginBottom: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          color: "var(--silver)",
                        }}
                      >
                        {entry.reason}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-deco)",
                          fontSize: 18,
                          color: entry.direction === "earn" ? "#1A9B4A" : "#C04040",
                        }}
                      >
                        {entry.direction === "earn" ? "+" : "−"}
                        {entry.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {levelLog.length === 0 && sparkLog.length === 0 && (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "var(--silver)",
                  opacity: 0.4,
                  padding: 24,
                }}
              >
                No history yet. Start playing to build your legend.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
