"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  CLASSES,
  ABILITY_SCORES,
  getModifier,
  getUSB,
  calculateHP,
  FEATS,
  LEVEL_PROGRESSION,
  ALL_SKILLS,
} from "@/lib/character-data";

// ── Constants ──────────────────────────────────────────────
const SPIKE_LEVELS = new Set([3, 6, 9, 12, 15, 18, 20]);

const SPIKE_NAMES = {
  3: "First Identity Spike",
  6: "Core Build Spike",
  9: "Expansion Spike",
  12: "Mastery Spike",
  15: "Pre-Mythic Spike",
  18: "Final Spike",
  20: "Mythic Threshold",
};

const USB_INCREASE_LEVELS = new Set([5, 9, 13, 17]);

const PATHS_BY_CLASS = {
  warrior: ["Iron Warden", "Blood Reaver", "Storm Duelist"],
  rogue: ["Shadow Blade", "Mastermind", "Scout"],
  arcanist: ["Elementalist", "Void Caller", "Chronomancer"],
  warden: ["Oath of the Shield", "Oath of Vengeance", "Oath of the Realm"],
  hunter: ["Beastmaster", "Sharpshooter", "Stalker"],
  seeker: ["Oracle", "Void Walker", "Soul Binder"],
  speaker: ["Deceiver", "Commander", "Bard of the Rift"],
  catalyst: ["Alchemist", "Artificer", "Battle Medic"],
  netrunner: ["Ice Breaker", "Ghost Signal", "Architect"],
  gunslinger: ["Deadeye", "Outlaw", "Trick Shot"],
  pilot: ["Ace", "Smuggler", "War Pilot"],
  medic: ["Field Surgeon", "Bio-Enhancer", "Trauma Specialist"],
  monk: ["Way of the Open Hand", "Way of Shadow", "Way of the Elements"],
  shaman: ["Ancestor Caller", "Nature Warden", "Spirit Walker"],
  engineer: ["Demolitions", "Fabricator", "Drone Commander"],
  berserker: ["Totem Warrior", "Frenzied", "Ancestral Guardian"],
  psionicist: ["Telepath", "Telekinetic", "Mind Blade"],
};

const PATH_EVOLUTIONS = {
  9: {
    "Iron Warden": "Fortress Stance — immune to being moved or knocked prone.",
    "Blood Reaver": "Crimson Tide — attacks leave bleeding wounds that stack.",
    "Storm Duelist": "Lightning Riposte — counter every miss with a free strike.",
    "Shadow Blade": "Void Step — teleport 30ft as a bonus action.",
    Mastermind: "Puppet Master — redirect one attack per round to another target.",
    Scout: "Ghost Walk — move silently at full speed in any terrain.",
    Elementalist: "Elemental Mastery — dual-wield two elements simultaneously.",
    "Void Caller": "Rift Tear — open a small rift that damages everything nearby.",
    Chronomancer: "Time Lock — freeze one creature for one full round.",
    Oracle: "True Sight — see through all illusions and invisibility.",
    "Void Walker": "Phase Shift — become partially intangible for one minute.",
    "Soul Binder": "Soul Leash — bind a creature's soul, controlling its actions.",
  },
  15: {
    "Iron Warden": "Living Fortress — damage reduction 10. Allies behind you take half damage.",
    "Blood Reaver": "Blood Frenzy — at half HP gain double attack speed.",
    "Storm Duelist": "Thunder Walk — leave storm damage in your movement path.",
  },
};

// ── Components ─────────────────────────────────────────────

function StepBadge({ number, done, active }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: done ? "rgba(26,107,42,0.2)" : active ? "rgba(201,168,76,0.15)" : "rgba(13,27,53,0.5)",
        border: `1px solid ${done ? "#1A6B2A" : active ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.1)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontSize: 12,
        color: done ? "#1A9B4A" : active ? "var(--gold)" : "var(--silver)",
        transition: "all 0.3s",
      }}
    >
      {done ? "✓" : number}
    </div>
  );
}

function ChoiceCard({ label, sub, desc, selected, onClick, disabled, color }) {
  const [hovered, setHovered] = useState(false);
  const c = color || "rgba(201,168,76,0.4)";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "20px",
        background: selected ? "rgba(201,168,76,0.1)" : hovered ? "rgba(201,168,76,0.04)" : "rgba(13,27,53,0.4)",
        border: selected
          ? `1px solid ${c}`
          : hovered
            ? "1px solid rgba(201,168,76,0.2)"
            : "1px solid rgba(201,168,76,0.07)",
        borderLeft: `3px solid ${selected ? c : "transparent"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left",
        outline: "none",
        transition: "all 0.2s",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 600,
          color: selected ? "var(--mist)" : "var(--silver)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 9,
            letterSpacing: "0.15em",
            color: selected ? c : "rgba(201,168,76,0.3)",
            marginBottom: 8,
          }}
        >
          {sub}
        </div>
      )}
      {desc && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--silver)",
            opacity: 0.6,
            lineHeight: 1.5,
          }}
        >
          {desc}
        </div>
      )}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────
export default function LevelUpPage({ character, levelLog, existingCards, userId }) {
  void existingCards;
  void userId;
  void getModifier;
  void LEVEL_PROGRESSION;
  void ALL_SKILLS;

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const level = character.level || 1;
  const isSpike = SPIKE_LEVELS.has(level);
  const spikeName = SPIKE_NAMES[level];
  const usb = getUSB(level);
  const classData = CLASSES.find((c) => c.id === character.archetype);
  const abilityScores = character.ability_scores || {};
  const hp = calculateHP(classData, abilityScores.constitution, level);

  const alreadyDone = levelLog.some((l) => l.level_reached === level && l.feat_chosen);

  const availableFeats = useMemo(() => {
    const owned = new Set(character.feats || []);
    return FEATS.filter((f) => f.level <= level && !owned.has(f.id));
  }, [level, character.feats]);

  const needsPath = level === 3 && !character.path;
  const pathEvolves = level === 9 && character.path;
  const pathTranscends = level === 15 && character.path;
  const needsSkillUp = isSpike;
  const getsPatch = level % 4 === 0;

  const paths = PATHS_BY_CLASS[character.archetype] || [];
  const evolutionDesc = character.path
    ? PATH_EVOLUTIONS[9]?.[character.path] || PATH_EVOLUTIONS[15]?.[character.path] || null
    : null;

  const [chosenFeat, setChosenFeat] = useState(null);
  const [chosenPath, setChosenPath] = useState(character.path || null);
  const [chosenSkillUp, setChosenSkillUp] = useState(null);
  const [chosenAbilityUp, setChosenAbilityUp] = useState(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const steps = useMemo(() => {
    const s = [];
    s.push({ id: "feat", label: "Choose a Feat", required: true });
    if (needsPath) s.push({ id: "path", label: "Choose Your Path", required: true });
    if (pathEvolves || pathTranscends) s.push({ id: "evolve", label: "Path Evolution", required: false });
    if (needsSkillUp) s.push({ id: "skill", label: "Advance a Skill", required: true });
    if (getsPatch) s.push({ id: "ability", label: "Ability Score Improvement", required: true });
    return s;
  }, [needsPath, pathEvolves, pathTranscends, needsSkillUp, getsPatch]);

  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  function isDone(stepId) {
    if (stepId === "feat") return Boolean(chosenFeat);
    if (stepId === "path") return Boolean(chosenPath);
    if (stepId === "evolve") return true;
    if (stepId === "skill") return Boolean(chosenSkillUp);
    if (stepId === "ability") return Boolean(chosenAbilityUp);
    return false;
  }

  function canFinish() {
    return steps.every((st) => !st.required || isDone(st.id));
  }

  async function handleConfirm() {
    if (!canFinish()) return;
    setSaving(true);
    setError(null);

    try {
      const updates = {};

      if (chosenFeat) {
        const currentFeats = character.feats || [];
        updates.feats = [...currentFeats, chosenFeat.id];
      }

      if (chosenPath && !character.path) {
        updates.path = chosenPath;
      }

      if (chosenSkillUp) {
        const currentSkills = character.skills || {};
        const currentLevel = currentSkills[chosenSkillUp];
        updates.skills = {
          ...currentSkills,
          [chosenSkillUp]:
            currentLevel === "secondary" ? "primary" : currentLevel === "primary" ? "legendary" : "primary",
        };
      }

      if (chosenAbilityUp) {
        const currentScores = character.ability_scores || {};
        updates.ability_scores = {
          ...currentScores,
          [chosenAbilityUp]: Math.min(20, (currentScores[chosenAbilityUp] || 10) + 1),
        };
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateErr } = await supabase.from("characters").update(updates).eq("id", character.id);

        if (updateErr) throw updateErr;
      }

      await supabase
        .from("level_up_log")
        .update({
          feat_chosen: chosenFeat?.name || null,
          path_choice: chosenPath || null,
          skill_advanced: chosenSkillUp || null,
        })
        .eq("character_id", character.id)
        .eq("level_reached", level);

      setDone(true);

      setTimeout(() => router.push(`/character/${character.id}`), 2500);
    } catch (err) {
      console.error("Level up save error:", err);
      setError("Could not save your choices. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--void)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: 40 }}>
          <div
            style={{
              fontFamily: "var(--font-deco)",
              fontSize: 48,
              color: "var(--gold)",
              marginBottom: 16,
              animation: "rift-pulse 2s ease-in-out infinite",
            }}
          >
            ✦
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--mist)",
              marginBottom: 12,
            }}
          >
            Level {level} — Confirmed
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--silver)",
              opacity: 0.7,
            }}
          >
            Returning to your character sheet...
          </p>
        </div>
      </div>
    );
  }

  if (alreadyDone) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--void)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.25em",
              color: "var(--silver)",
              opacity: 0.5,
              marginBottom: 16,
            }}
          >
            LEVEL {level} ALREADY PROCESSED
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "var(--silver)",
              opacity: 0.6,
              marginBottom: 32,
            }}
          >
            Your Level {level} upgrades have already been chosen. Complete another campaign to reach the next level.
          </p>
          <Link
            href={`/character/${character.id}`}
            style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, var(--gold), #E8B94F)",
              color: "var(--void)",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              letterSpacing: "0.1em",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            ← Back to Character Sheet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--void)", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <img
          src="/genesis-bg-rift-tinted.png"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(7,8,15,0.80)" }} />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "40px 24px 120px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Link
            href={`/character/${character.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              marginBottom: 40,
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.15em",
              color: "var(--silver)",
              opacity: 0.4,
            }}
          >
            ← {character.name}
          </Link>

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "var(--gold)",
              opacity: 0.7,
              marginBottom: 12,
            }}
          >
            LEVEL UP
          </div>

          <div
            style={{
              fontFamily: "var(--font-deco)",
              fontSize: "clamp(56px, 10vw, 96px)",
              color: "var(--gold)",
              lineHeight: 1,
              marginBottom: 12,
            }}
          >
            {level}
          </div>

          {isSpike && (
            <div
              style={{
                display: "inline-block",
                padding: "6px 20px",
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--gold)",
                marginBottom: 16,
              }}
            >
              ⚡ {spikeName}
            </div>
          )}

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--silver)",
              opacity: 0.6,
            }}
          >
            {character.name || "Your character"} advances. Make your choices.
          </p>
        </div>

        <div
          style={{
            padding: "24px 28px",
            background: "rgba(13,27,53,0.4)",
            border: "1px solid rgba(201,168,76,0.1)",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "var(--silver)",
              opacity: 0.5,
              marginBottom: 16,
            }}
          >
            AUTOMATIC GAINS — NO CHOICE REQUIRED
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 2,
            }}
          >
            {[
              { label: "New HP", value: hp, note: "Total hit points" },
              { label: "USB", value: `+${usb}`, note: "Universal Scaling Bonus" },
              { label: "Hit Die", value: classData?.hitDie || "d8", note: "Per level" },
              USB_INCREASE_LEVELS.has(level) && {
                label: "USB +1",
                value: "Increased",
                note: `USB now +${usb}`,
              },
              level % 3 === 0 && { label: "Ability Card", value: "1 Card", note: "Added to your hand" },
              level === 20 && { label: "Ascension", value: "Available", note: "You may now Ascend" },
            ]
              .filter(Boolean)
              .map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "14px 16px",
                    background: "rgba(201,168,76,0.05)",
                    border: "1px solid rgba(201,168,76,0.08)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-deco)",
                      fontSize: 24,
                      color: "var(--gold)",
                      marginBottom: 4,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 10,
                      color: "var(--mist)",
                      marginBottom: 2,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--silver)",
                      opacity: 0.4,
                    }}
                  >
                    {stat.note}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentStep(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                background:
                  i === currentStep ? "rgba(201,168,76,0.1)" : isDone(s.id) ? "rgba(26,107,42,0.08)" : "transparent",
                border:
                  i === currentStep
                    ? "1px solid rgba(201,168,76,0.3)"
                    : isDone(s.id)
                      ? "1px solid rgba(26,107,42,0.2)"
                      : "1px solid rgba(201,168,76,0.07)",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s",
                flex: "1 1 auto",
              }}
            >
              <StepBadge number={i + 1} done={isDone(s.id)} active={i === currentStep} />
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    color: i === currentStep ? "var(--gold)" : isDone(s.id) ? "#1A9B4A" : "var(--silver)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.label}
                </div>
                {s.required && !isDone(s.id) && (
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 8,
                      letterSpacing: "0.1em",
                      color: "rgba(192,64,64,0.7)",
                    }}
                  >
                    REQUIRED
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {step?.id === "feat" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--mist)",
                  marginBottom: 6,
                }}
              >
                Choose 1 Feat
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  color: "var(--silver)",
                  opacity: 0.6,
                }}
              >
                Feats up to Level {level} are available. You cannot choose feats you already own. More become available as
                you level up.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 2,
              }}
            >
              {availableFeats.length === 0 ? (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontStyle: "italic",
                    fontSize: 15,
                    color: "var(--silver)",
                    opacity: 0.4,
                    padding: 24,
                    gridColumn: "1 / -1",
                  }}
                >
                  You have unlocked all available feats at this level.
                </div>
              ) : (
                availableFeats.map((feat) => (
                  <ChoiceCard
                    key={feat.id}
                    label={feat.name}
                    sub={`Level ${feat.level} Feat${feat.prereq ? ` — Requires: ${feat.prereq}` : ""}`}
                    desc={feat.desc}
                    selected={chosenFeat?.id === feat.id}
                    onClick={() => setChosenFeat(feat)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {step?.id === "path" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--mist)",
                  marginBottom: 6,
                }}
              >
                Choose Your Path
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  color: "var(--silver)",
                  opacity: 0.6,
                }}
              >
                Your path defines your specialisation as a {character.class}. This choice shapes your abilities at Levels 9
                and 15. Choose carefully — it cannot be changed.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 2,
              }}
            >
              {paths.map((path) => (
                <ChoiceCard
                  key={path}
                  label={path}
                  sub={`${character.class} Path`}
                  desc={`Choosing ${path} defines your combat identity and unlocks unique abilities at Levels 9 and 15.`}
                  selected={chosenPath === path}
                  onClick={() => setChosenPath(path)}
                  color="#4A7FD4"
                />
              ))}
            </div>
          </div>
        )}

        {step?.id === "evolve" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--mist)",
                  marginBottom: 6,
                }}
              >
                {level === 9 ? "Path Evolution" : "Path Transcendence"}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  color: "var(--silver)",
                  opacity: 0.6,
                }}
              >
                Your path deepens. A new ability unlocks automatically.
              </p>
            </div>
            <div
              style={{
                padding: "28px 32px",
                background: "rgba(74,127,212,0.1)",
                border: "1px solid rgba(74,127,212,0.25)",
                borderLeft: "3px solid #4A7FD4",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-deco)",
                  fontSize: 20,
                  color: "var(--gold)",
                  marginBottom: 12,
                }}
              >
                {character.path}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  color: "var(--mist)",
                  lineHeight: 1.7,
                }}
              >
                {evolutionDesc ||
                  `Your ${character.path} path grows stronger. The Chronicler will acknowledge this evolution in your next session.`}
              </p>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "#4A7FD4",
                  opacity: 0.7,
                }}
              >
                AUTOMATICALLY APPLIED — NO CHOICE REQUIRED
              </div>
            </div>
          </div>
        )}

        {step?.id === "skill" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--mist)",
                  marginBottom: 6,
                }}
              >
                Advance a Skill
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  color: "var(--silver)",
                  opacity: 0.6,
                }}
              >
                Spike levels allow you to advance one skill tier. Secondary → Primary, or Primary → Legendary.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 2,
              }}
            >
              {Object.entries(character.skills || {}).map(([skillName, type]) => {
                const next =
                  type === "secondary" ? "Primary (Expert)" : type === "primary" ? "Legendary" : null;
                if (!next) return null;
                return (
                  <ChoiceCard
                    key={skillName}
                    label={skillName}
                    sub={`${type.toUpperCase()} → ${next.toUpperCase()}`}
                    selected={chosenSkillUp === skillName}
                    onClick={() => setChosenSkillUp(skillName)}
                    color="#5B2D8E"
                  />
                );
              })}
              {Object.keys(character.skills || {}).length === 0 && (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    color: "var(--silver)",
                    opacity: 0.4,
                    fontStyle: "italic",
                    padding: 24,
                    gridColumn: "1 / -1",
                  }}
                >
                  No skills to advance yet.
                </div>
              )}
            </div>
          </div>
        )}

        {step?.id === "ability" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--mist)",
                  marginBottom: 6,
                }}
              >
                Ability Score Improvement
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  color: "var(--silver)",
                  opacity: 0.6,
                }}
              >
                Choose one ability score to increase by 1. Maximum score is 20.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 2,
              }}
            >
              {ABILITY_SCORES.map((ability) => {
                const current = abilityScores[ability.id] || 10;
                const atMax = current >= 20;
                return (
                  <ChoiceCard
                    key={ability.id}
                    label={ability.name}
                    sub={`${current} → ${Math.min(20, current + 1)}`}
                    desc={atMax ? "Already at maximum" : ability.desc}
                    selected={chosenAbilityUp === ability.id}
                    onClick={() => !atMax && setChosenAbilityUp(ability.id)}
                    disabled={atMax}
                    color="#1A6B2A"
                  />
                );
              })}
            </div>
          </div>
        )}

        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 24px",
            background: "rgba(7,8,15,0.95)",
            borderTop: "1px solid rgba(201,168,76,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backdropFilter: "blur(12px)",
            zIndex: 50,
          }}
        >
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            style={{
              padding: "12px 28px",
              background: "transparent",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "var(--silver)",
              fontFamily: "var(--font-display)",
              fontSize: 12,
              letterSpacing: "0.1em",
              cursor: "pointer",
              opacity: currentStep === 0 ? 0.3 : 1,
            }}
          >
            ← BACK
          </button>

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--silver)",
              opacity: 0.4,
            }}
          >
            {currentStep + 1} / {steps.length}
          </div>

          {error && (
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#FF6060" }}>{error}</div>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              style={{
                padding: "12px 32px",
                background: "linear-gradient(135deg, var(--gold), #E8B94F)",
                border: "none",
                color: "var(--void)",
                fontFamily: "var(--font-display)",
                fontSize: 13,
                letterSpacing: "0.1em",
                cursor: "pointer",
                clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
              }}
            >
              NEXT →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={!canFinish() || saving}
              style={{
                padding: "12px 32px",
                background:
                  canFinish() && !saving
                    ? "linear-gradient(135deg, var(--gold), #E8B94F)"
                    : "rgba(201,168,76,0.1)",
                border: "none",
                color: canFinish() && !saving ? "var(--void)" : "var(--silver)",
                fontFamily: "var(--font-display)",
                fontSize: 13,
                letterSpacing: "0.1em",
                cursor: canFinish() && !saving ? "pointer" : "not-allowed",
                clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
              }}
            >
              {saving ? "SAVING..." : "✦ CONFIRM LEVEL UP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
