"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { buildStarterPack, getItemById, ITEMS } from "@/lib/items-data";
import {
  CLASSES,
  BACKGROUNDS,
  ABILITY_SCORES,
  ALL_SKILLS,
  GENDERS,
  getRacesForGenre,
  getFeatsForLevel,
  getModifier,
  calculateHP,
  getUSB,
  ROLL_SCORE_TABLE,
} from "@/lib/character-data";

function Emoji({ children, size = 32 }) {
  return (
    <span
      style={{
        fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
        fontSize: size,
        lineHeight: 1,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

const STEPS = [
  { id: "race", label: "Race", icon: "🧬" },
  { id: "gender", label: "Gender", icon: "🧑" },
  { id: "class", label: "Class", icon: "⚔️" },
  { id: "scores", label: "Ability Scores", icon: "🎲" },
  { id: "background", label: "Background", icon: "📖" },
  { id: "skills", label: "Skills", icon: "🎯" },
  { id: "feats", label: "Feats", icon: "⭐" },
  { id: "name", label: "Name & Finish", icon: "✦" },
  { id: "inventory", label: "Starting Pack", icon: "🎒" },
];

function applyRacialBonuses(scores, race) {
  if (!race || !scores) return scores;
  const result = { ...scores };
  const bonus = race.abilityBonus || {};
  for (const [stat, val] of Object.entries(bonus)) {
    if (stat === "any") continue;
    if (result[stat] !== undefined) result[stat] = Math.min(20, result[stat] + val);
  }
  return result;
}

export default function CharacterCreator({
  campaignId,
  userId,
  primaryGenre,
  secondaryGenre,
  timePeriod,
  onComplete,
}) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedBackgrounds, setSelectedBackgrounds] = useState([]);
  const [rolledScores, setRolledScores] = useState({});
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedFeats, setSelectedFeats] = useState([]);
  const [selectedLanguages] = useState(["Common"]);
  const [characterName, setCharacterName] = useState("");
  const [characterAge, setCharacterAge] = useState("");
  const [customItem1, setCustomItem1] = useState("");
  const [customItem2, setCustomItem2] = useState("");
  const [starterPack, setStarterPack] = useState(null);

  const races = useMemo(
    () => getRacesForGenre(primaryGenre, secondaryGenre, timePeriod),
    [primaryGenre, secondaryGenre, timePeriod],
  );
  const startingFeats = useMemo(() => getFeatsForLevel(1), []);
  const currentStepId = STEPS[step]?.id;

  /* eslint-disable react-hooks/set-state-in-effect -- starter pack derived from class, backgrounds, and genres */
  useEffect(() => {
    void ITEMS;
    if (selectedClass) {
      const pack = buildStarterPack(
        selectedClass.id,
        selectedBackgrounds.map((b) => b.id),
        primaryGenre,
        secondaryGenre,
      );
      setStarterPack(pack);
    } else {
      setStarterPack(null);
    }
  }, [selectedClass, selectedBackgrounds, primaryGenre, secondaryGenre]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const abilityScores = useMemo(() => {
    if (Object.keys(rolledScores).length !== 6) return {};
    const base = {};
    for (const [id, data] of Object.entries(rolledScores)) {
      base[id] = data.score;
    }
    return applyRacialBonuses(base, selectedRace);
  }, [rolledScores, selectedRace]);

  function rollAbilityScore() {
    const roll = Math.floor(Math.random() * 20) + 1;
    const group = ROLL_SCORE_TABLE.find((g) => g.rolls.includes(roll));
    return { roll, score: group?.score || 10, label: group?.label || "Average" };
  }

  function rollAllScores() {
    const rolled = {};
    for (const ability of ABILITY_SCORES) {
      rolled[ability.id] = rollAbilityScore();
    }
    setRolledScores(rolled);
  }

  function toggleBackground(bg) {
    setSelectedBackgrounds((prev) => {
      if (prev.find((b) => b.id === bg.id)) return prev.filter((b) => b.id !== bg.id);
      if (prev.length >= 3) return prev;
      return [...prev, bg];
    });
  }

  function toggleSkill(skillName, type) {
    setSelectedSkills((prev) => {
      const existing = prev.find((s) => s.name === skillName);
      if (existing) return prev.filter((s) => s.name !== skillName);
      const primaryCount = prev.filter((s) => s.type === "primary").length;
      const secondaryCount = prev.filter((s) => s.type === "secondary").length;
      if (type === "primary" && primaryCount >= 6) return prev;
      if (type === "secondary" && secondaryCount >= 3) return prev;
      return [...prev, { name: skillName, type }];
    });
  }

  function calculateProficiencies() {
    return {
      armor: [...(selectedClass?.armorProf || [])],
      weapons: [...(selectedClass?.weaponProf || [])],
      tools: [...selectedBackgrounds.flatMap((b) => b.tools || [])],
      savingThrows: [...(selectedClass?.savingThrows || [])],
      languages: [...new Set(selectedLanguages)],
    };
  }

  async function saveCharacter() {
    if (!characterName.trim()) {
      setError("Please enter a character name.");
      return;
    }
    if (!campaignId) {
      setError("Missing campaign. Return to the world builder and try again.");
      return;
    }
    if (!userId) {
      setError("You must be signed in to save a character.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const finalScores = abilityScores;
    const profs = calculateProficiencies();
    const hp = calculateHP(selectedClass, finalScores.constitution || 10, 1);

    const characterData = {
      campaign_id: campaignId,
      user_id: userId,
      name: characterName.trim(),
      race: selectedRace?.name || "Human",
      gender: selectedGender?.id || "undefined",
      class: selectedClass?.name || "Warrior",
      archetype: selectedClass?.id || "warrior",
      age: characterAge || null,
      ability_scores: finalScores,
      skills: Object.fromEntries(selectedSkills.map((s) => [s.name, s.type])),
      proficiencies: profs,
      feats: selectedFeats.map((f) => f.id),
      background: selectedBackgrounds.map((b) => b.name).join(" / "),
      languages: selectedLanguages,
      level: 1,
      experience: 0,
      backstory_json: {
        race_traits: selectedRace?.traits || [],
        class_paths: selectedClass?.paths || [],
        backgrounds: selectedBackgrounds.map((b) => b.id),
        hp,
        hit_die: selectedClass?.hitDie || "d8",
        usb: getUSB(1),
        starter_pack: starterPack?.items || [],
        pack_slots: starterPack?.packSlots || 12,
        quick_slots: starterPack?.quickSlots || 4,
        bulk_limit: starterPack?.bulkLimit || 12,
        custom_item_1: customItem1.trim() || null,
        custom_item_2: customItem2.trim() || null,
      },
      is_template: false,
      transferable: false,
      created_by: userId,
    };

    const { data, error: saveError } = await supabase
      .from("characters")
      .insert(characterData)
      .select("id, name")
      .single();

    if (saveError) {
      console.error("Character save error:", saveError);
      setError(saveError.message || "Could not save character. Please try again.");
      setSaving(false);
      return;
    }

    if (data?.id && starterPack?.items) {
      const inventoryRows = starterPack.items
        .filter((i) => !i.isCustom)
        .map((i) => ({
          character_id: data.id,
          item_id: i.itemId,
          item_name: getItemById(i.itemId)?.name || i.itemId,
          quantity: i.quantity || 1,
          slot_location: "pack",
          is_equipped: false,
          is_custom: false,
          acquired_from: "starter_pack",
        }));

      if (inventoryRows.length > 0) {
        const { error: invErr } = await supabase.from("character_inventory").insert(inventoryRows);
        if (invErr) console.error("character_inventory insert:", invErr);
      }

      if (customItem1.trim() || customItem2.trim()) {
        const customRequests = [customItem1, customItem2]
          .filter((c) => c.trim().length > 0)
          .map((desc) => ({
            character_id: data.id,
            user_id: userId,
            item_name: desc.split(" ").slice(0, 4).join(" "),
            item_description: desc.trim(),
            approved: null,
          }));
        if (customRequests.length > 0) {
          const { error: reqErr } = await supabase.from("custom_item_requests").insert(customRequests);
          if (reqErr) console.error("custom_item_requests insert:", reqErr);
        }
      }
    }

    await supabase.from("campaigns").update({ play_mode: "character_create" }).eq("id", campaignId);

    onComplete?.(data);
    setSaving(false);
  }

  function canProceed() {
    switch (currentStepId) {
      case "race":
        return Boolean(selectedRace);
      case "gender":
        return Boolean(selectedGender);
      case "class":
        return Boolean(selectedClass);
      case "scores":
        return Object.keys(abilityScores).length === 6;
      case "background":
        return selectedBackgrounds.length >= 1;
      case "skills":
        return selectedSkills.filter((s) => s.type === "primary").length >= 1;
      case "feats":
        return true;
      case "name":
        return characterName.trim().length >= 2;
      case "inventory":
        return true;
      default:
        return false;
    }
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 24px 120px",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ display: "flex", gap: 4, marginBottom: 48, flexWrap: "wrap" }}>
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              background:
                i === step
                  ? "rgba(201,168,76,0.12)"
                  : i < step
                    ? "rgba(26,107,42,0.1)"
                    : "transparent",
              border:
                i === step
                  ? "1px solid rgba(201,168,76,0.3)"
                  : i < step
                    ? "1px solid rgba(26,107,42,0.3)"
                    : "1px solid rgba(201,168,76,0.06)",
              opacity: i > step ? 0.4 : 1,
            }}
          >
            <span style={{ fontSize: 12 }}>{i < step ? "✓" : s.icon}</span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 9,
                letterSpacing: "0.1em",
                color: i === step ? "var(--gold)" : i < step ? "#1A9B4A" : "var(--silver)",
              }}
            >
              {s.label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {currentStepId === "race" && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            Choose Your Race
          </h2>
          <p style={{ color: "var(--silver)", marginBottom: 32, opacity: 0.7 }}>
            Your race determines your innate traits, ability bonuses, and place in the world.
            {secondaryGenre &&
              ` Races from both ${primaryGenre} and ${secondaryGenre} are available.`}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 2,
            }}
          >
            {races.map((race) => (
              <button
                key={race.id}
                type="button"
                onClick={() => setSelectedRace(race)}
                style={{
                  padding: "20px",
                  textAlign: "left",
                  cursor: "pointer",
                  background: selectedRace?.id === race.id ? "rgba(201,168,76,0.1)" : "rgba(13,27,53,0.4)",
                  border:
                    selectedRace?.id === race.id
                      ? "1px solid rgba(201,168,76,0.4)"
                      : "1px solid rgba(201,168,76,0.06)",
                  borderLeft: selectedRace?.id === race.id ? "3px solid var(--gold)" : "3px solid transparent",
                  outline: "none",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--mist)",
                    marginBottom: 6,
                  }}
                >
                  {race.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--silver)", opacity: 0.7, marginBottom: 10, lineHeight: 1.5 }}>
                  {race.desc}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {race.traits.map((t) => (
                    <span
                      key={t}
                      style={{
                        padding: "2px 8px",
                        fontSize: 10,
                        background: "rgba(201,168,76,0.08)",
                        border: "1px solid rgba(201,168,76,0.15)",
                        color: "var(--gold)",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 11,
                    color: "rgba(201,168,76,0.6)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {Object.entries(race.abilityBonus)
                    .filter(([k]) => k !== "any")
                    .map(([k, v]) => {
                      const abbr = k.slice(0, 3).toUpperCase();
                      const mod = typeof v === "number" && v >= 0 ? `+${v}` : `${v}`;
                      return `${abbr} ${mod}`;
                    })
                    .join(" · ")}
                  {race.abilityBonus.any ? ` · Any +${race.abilityBonus.any}` : ""}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStepId === "gender" && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            Choose Your Gender
          </h2>
          <p
            style={{
              color: "var(--silver)",
              marginBottom: 32,
              opacity: 0.7,
              fontFamily: "var(--font-body)",
              fontSize: 16,
            }}
          >
            This shapes how NPCs and the world address your character. All choices are equal — the Chronicler adapts
            accordingly.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {GENDERS.map((g) => {
              const isSelected = selectedGender?.id === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGender(g)}
                  style={{
                    padding: "24px 20px",
                    background: isSelected ? "rgba(201,168,76,0.12)" : "rgba(13,27,53,0.4)",
                    border: isSelected ? "1px solid rgba(201,168,76,0.45)" : "1px solid rgba(201,168,76,0.07)",
                    borderLeft: isSelected ? "3px solid var(--gold)" : "3px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    outline: "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: isSelected ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.06)",
                      border: isSelected ? "1px solid rgba(201,168,76,0.5)" : "1px solid rgba(201,168,76,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-deco)",
                      fontSize: 16,
                      color: isSelected ? "var(--gold)" : "rgba(201,168,76,0.5)",
                      transition: "all 0.2s",
                      boxShadow: isSelected ? "0 0 12px rgba(201,168,76,0.2)" : "none",
                    }}
                  >
                    {g.initial}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: isSelected ? "var(--mist)" : "var(--silver)",
                        marginBottom: 4,
                        transition: "color 0.2s",
                      }}
                    >
                      {g.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--silver)",
                        opacity: 0.5,
                        lineHeight: 1.3,
                      }}
                    >
                      {g.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentStepId === "class" && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            Choose Your Class
          </h2>
          <p style={{ color: "var(--silver)", marginBottom: 32, opacity: 0.7 }}>
            Your class defines your combat role, abilities, and how you shape the world.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 2,
            }}
          >
            {CLASSES.map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => setSelectedClass(cls)}
                style={{
                  padding: "24px",
                  textAlign: "left",
                  cursor: "pointer",
                  background: selectedClass?.id === cls.id ? "rgba(201,168,76,0.1)" : "rgba(13,27,53,0.4)",
                  border:
                    selectedClass?.id === cls.id
                      ? "1px solid rgba(201,168,76,0.4)"
                      : "1px solid rgba(201,168,76,0.06)",
                  borderLeft: selectedClass?.id === cls.id ? "3px solid var(--gold)" : "3px solid transparent",
                  outline: "none",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Emoji size={26}>{cls.icon}</Emoji>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--mist)",
                    }}
                  >
                    {cls.name}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: "var(--font-display)",
                      fontSize: 10,
                      color: "var(--gold)",
                      opacity: 0.7,
                    }}
                  >
                    HD {cls.hitDie}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "var(--silver)", opacity: 0.7, lineHeight: 1.5, marginBottom: 10 }}>
                  {cls.desc}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: "var(--silver)",
                    opacity: 0.4,
                    marginBottom: 4,
                  }}
                >
                  PRIMARY: {cls.primaryStats.map((s) => s.toUpperCase()).join(" · ")}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: "rgba(201,168,76,0.5)",
                  }}
                >
                  PATHS: {cls.paths.join(" · ")}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStepId === "scores" && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            Roll Your Ability Scores
          </h2>
          <p style={{ color: "var(--silver)", marginBottom: 24, opacity: 0.7 }}>
            Roll the d20 — groups of 4 determine each score. Racial bonuses applied automatically.
          </p>
          <button
            type="button"
            onClick={rollAllScores}
            style={{
              padding: "14px 32px",
              marginBottom: 32,
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
            🎲 ROLL ALL SCORES
          </button>

          {Object.keys(abilityScores).length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 2,
              }}
            >
              {ABILITY_SCORES.map((ability) => {
                const score = abilityScores[ability.id] || 10;
                const rolled = rolledScores[ability.id];
                const mod = getModifier(score);
                return (
                  <div
                    key={ability.id}
                    style={{
                      padding: "20px 16px",
                      background: "rgba(13,27,53,0.5)",
                      border: "1px solid rgba(201,168,76,0.12)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        color: "var(--silver)",
                        opacity: 0.5,
                        marginBottom: 8,
                      }}
                    >
                      {ability.abbr}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-deco)",
                        fontSize: 36,
                        color: "var(--gold)",
                        lineHeight: 1,
                        marginBottom: 4,
                      }}
                    >
                      {score}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 14,
                        color: mod >= 0 ? "#1A9B4A" : "#C04040",
                        marginBottom: 8,
                      }}
                    >
                      {mod >= 0 ? `+${mod}` : mod}
                    </div>
                    {rolled && (
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 9,
                          color: "var(--silver)",
                          opacity: 0.4,
                        }}
                      >
                        Rolled {rolled.roll} — {rolled.label}
                      </div>
                    )}
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        color: "var(--silver)",
                        opacity: 0.4,
                        marginTop: 6,
                        lineHeight: 1.3,
                      }}
                    >
                      {ability.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {Object.keys(abilityScores).length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--silver)",
                opacity: 0.4,
                fontStyle: "italic",
              }}
            >
              Click Roll All Scores to begin
            </div>
          )}
        </div>
      )}

      {currentStepId === "background" && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            Choose Your Background
          </h2>
          <p style={{ color: "var(--silver)", marginBottom: 8, opacity: 0.7 }}>
            Choose up to 3 backgrounds to create a unique history. Each adds skills, tools, and languages.
          </p>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              color: "var(--gold)",
              marginBottom: 24,
              opacity: 0.7,
            }}
          >
            {selectedBackgrounds.length}/3 SELECTED
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 2,
            }}
          >
            {BACKGROUNDS.map((bg) => {
              const isSelected = selectedBackgrounds.find((b) => b.id === bg.id);
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => toggleBackground(bg)}
                  style={{
                    padding: "18px",
                    textAlign: "left",
                    cursor: "pointer",
                    background: isSelected ? "rgba(201,168,76,0.1)" : "rgba(13,27,53,0.4)",
                    border: isSelected
                      ? "1px solid rgba(201,168,76,0.4)"
                      : "1px solid rgba(201,168,76,0.06)",
                    borderLeft: isSelected ? "3px solid var(--gold)" : "3px solid transparent",
                    outline: "none",
                    transition: "all 0.2s",
                    opacity: !isSelected && selectedBackgrounds.length >= 3 ? 0.35 : 1,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--mist)",
                      marginBottom: 6,
                    }}
                  >
                    {bg.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--silver)", opacity: 0.6, lineHeight: 1.5, marginBottom: 8 }}>
                    {bg.desc}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 9,
                      color: "rgba(201,168,76,0.6)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {bg.skills.join(" · ")}
                    {bg.tools.length > 0 && ` · ${bg.tools.join(" · ")}`}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 9,
                      color: "rgba(74,127,212,0.7)",
                      letterSpacing: "0.1em",
                      marginTop: 4,
                    }}
                  >
                    FEATURE: {bg.feature}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentStepId === "skills" && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            Choose Your Skills
          </h2>
          <p style={{ color: "var(--silver)", marginBottom: 8, opacity: 0.7 }}>
            Choose up to 6 primary skills and 3 secondary skills.
          </p>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                color: "var(--gold)",
                opacity: 0.7,
              }}
            >
              PRIMARY: {selectedSkills.filter((s) => s.type === "primary").length}/6
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                color: "var(--silver)",
                opacity: 0.5,
              }}
            >
              SECONDARY: {selectedSkills.filter((s) => s.type === "secondary").length}/3
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {ALL_SKILLS.map((skill) => {
              const selected = selectedSkills.find((s) => s.name === skill.name);
              const primaryFull = selectedSkills.filter((s) => s.type === "primary").length >= 6;
              const secondaryFull = selectedSkills.filter((s) => s.type === "secondary").length >= 3;
              const isClassSkill = selectedClass?.skills.includes(skill.name);
              const isBgSkill = selectedBackgrounds.some((b) => b.skills.includes(skill.name));
              return (
                <div
                  key={skill.name}
                  style={{
                    padding: "12px 14px",
                    background: selected ? "rgba(201,168,76,0.08)" : "rgba(13,27,53,0.3)",
                    border: selected ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(201,168,76,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--mist)" }}>
                      {skill.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 9,
                        color: "var(--silver)",
                        opacity: 0.4,
                      }}
                    >
                      {skill.stat.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  {(isClassSkill || isBgSkill) && (
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 8,
                        color: "rgba(74,127,212,0.6)",
                        marginBottom: 6,
                      }}
                    >
                      {isClassSkill ? "CLASS SKILL" : "BG SKILL"}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => toggleSkill(skill.name, "primary")}
                      disabled={!selected && primaryFull}
                      style={{
                        flex: 1,
                        padding: "4px 0",
                        background: selected?.type === "primary" ? "rgba(201,168,76,0.2)" : "transparent",
                        border: "1px solid rgba(201,168,76,0.2)",
                        color: "var(--gold)",
                        cursor: "pointer",
                        fontFamily: "var(--font-display)",
                        fontSize: 8,
                        letterSpacing: "0.1em",
                        opacity: !selected && primaryFull ? 0.3 : 1,
                      }}
                    >
                      PRIMARY
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSkill(skill.name, "secondary")}
                      disabled={!selected && secondaryFull}
                      style={{
                        flex: 1,
                        padding: "4px 0",
                        background: selected?.type === "secondary" ? "rgba(201,168,76,0.1)" : "transparent",
                        border: "1px solid rgba(201,168,76,0.1)",
                        color: "var(--silver)",
                        cursor: "pointer",
                        fontFamily: "var(--font-display)",
                        fontSize: 8,
                        letterSpacing: "0.1em",
                        opacity: !selected && secondaryFull ? 0.3 : 1,
                      }}
                    >
                      2ND
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentStepId === "feats" && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            Choose a Starting Feat
          </h2>
          <p style={{ color: "var(--silver)", marginBottom: 8, opacity: 0.7 }}>
            At level 1 you may choose one feat. More unlock at levels 4, 8, 12, 16, 19.
          </p>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              color: "var(--gold)",
              marginBottom: 24,
              opacity: 0.7,
            }}
          >
            {selectedFeats.length}/1 SELECTED — skip if undecided
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 2,
            }}
          >
            {startingFeats.map((feat) => {
              const isSelected = selectedFeats.find((f) => f.id === feat.id);
              const canSelect = selectedFeats.length < 1 || isSelected;
              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => {
                    setSelectedFeats((prev) =>
                      prev.find((f) => f.id === feat.id)
                        ? prev.filter((f) => f.id !== feat.id)
                        : prev.length < 1
                          ? [...prev, feat]
                          : prev,
                    );
                  }}
                  style={{
                    padding: "18px",
                    textAlign: "left",
                    cursor: canSelect ? "pointer" : "not-allowed",
                    background: isSelected ? "rgba(201,168,76,0.1)" : "rgba(13,27,53,0.4)",
                    border: isSelected
                      ? "1px solid rgba(201,168,76,0.4)"
                      : "1px solid rgba(201,168,76,0.06)",
                    borderLeft: isSelected ? "3px solid var(--gold)" : "3px solid transparent",
                    outline: "none",
                    transition: "all 0.2s",
                    opacity: !canSelect ? 0.3 : 1,
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
                  <div style={{ fontSize: 12, color: "var(--silver)", opacity: 0.6, lineHeight: 1.5 }}>
                    {feat.desc}
                  </div>
                  {feat.prereq && (
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 9,
                        color: "rgba(74,127,212,0.6)",
                        marginTop: 8,
                      }}
                    >
                      REQ: {feat.prereq.toUpperCase()}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentStepId === "name" && (
        <div style={{ maxWidth: 560 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            Name Your Character
          </h2>
          <p style={{ color: "var(--silver)", marginBottom: 32, opacity: 0.7 }}>
            The last piece. Who are you?
          </p>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--silver)",
                opacity: 0.6,
                marginBottom: 8,
              }}
            >
              CHARACTER NAME *
            </label>
            <input
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter your character's name..."
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(13,27,53,0.5)",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "var(--mist)",
                fontFamily: "var(--font-body)",
                fontSize: 18,
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--silver)",
                opacity: 0.6,
                marginBottom: 8,
              }}
            >
              AGE (OPTIONAL)
            </label>
            <input
              value={characterAge}
              onChange={(e) => setCharacterAge(e.target.value)}
              placeholder="How old is your character?"
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(13,27,53,0.5)",
                border: "1px solid rgba(201,168,76,0.1)",
                color: "var(--mist)",
                fontFamily: "var(--font-body)",
                fontSize: 16,
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              padding: "24px",
              marginBottom: 24,
              background: "rgba(13,27,53,0.4)",
              border: "1px solid rgba(201,168,76,0.1)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "var(--silver)",
                opacity: 0.5,
                marginBottom: 16,
              }}
            >
              CHARACTER SUMMARY
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["Race", selectedRace?.name || "—"],
                ["Gender", selectedGender?.label || "—"],
                ["Class", selectedClass?.name || "—"],
                ["HP", calculateHP(selectedClass, abilityScores.constitution || 10, 1)],
                ["Background", selectedBackgrounds.map((b) => b.name).join(", ") || "—"],
                ["USB", `+${getUSB(1)}`],
              ].map(([label, val]) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 9,
                      color: "var(--silver)",
                      opacity: 0.4,
                      marginBottom: 2,
                    }}
                  >
                    {label.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--gold)" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStepId === "inventory" && (
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--mist)",
              marginBottom: 8,
            }}
          >
            Your Starting Pack
          </h2>
          <p
            style={{
              color: "var(--silver)",
              marginBottom: 8,
              fontFamily: "var(--font-body)",
              fontSize: 16,
              opacity: 0.7,
            }}
          >
            Built from your class and background choices. Review what you carry into the Rift.
          </p>

          {starterPack && (
            <div
              style={{
                display: "flex",
                gap: 2,
                marginBottom: 32,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Pack Slots", value: starterPack.packSlots, icon: "🎒" },
                { label: "Quick Slots", value: starterPack.quickSlots, icon: "⚡" },
                { label: "Bulk Limit", value: starterPack.bulkLimit, icon: "⚖️" },
                {
                  label: "Items",
                  value: starterPack.items.filter((i) => !i.isCustom).length,
                  icon: "📦",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    flex: "1 1 120px",
                    padding: "16px 20px",
                    background: "rgba(13,27,53,0.5)",
                    border: "1px solid rgba(201,168,76,0.12)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Apple Color Emoji","Segoe UI Emoji",sans-serif',
                      fontSize: 24,
                      marginBottom: 8,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-deco)",
                      fontSize: 24,
                      color: "var(--gold)",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {stat.value}
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
                    {stat.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {starterPack &&
            (() => {
              const grouped = {};
              for (const entry of starterPack.items) {
                if (entry.isCustom) continue;
                const item = getItemById(entry.itemId);
                if (!item) continue;
                const cat = item.category;
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push({ ...item, quantity: entry.quantity, note: entry.note });
              }

              const categoryOrder = [
                "Weapon",
                "Armor",
                "Accessory",
                "Ammo",
                "Consumable",
                "Tool",
                "Utility",
                "Material",
                "Currency",
                "Tech",
                "Relic",
              ];

              const categoryColors = {
                Weapon: "#8B2020",
                Armor: "#1A4A8B",
                Accessory: "#5B2D8E",
                Ammo: "#6B4A0E",
                Consumable: "#1A6B2A",
                Tool: "#3A4A5A",
                Utility: "#2A3A4A",
                Material: "#4A3A1A",
                Currency: "#6B5A0E",
                Tech: "#0E4A6B",
                Relic: "#6B0E6B",
              };

              return (
                <div style={{ marginBottom: 40 }}>
                  {categoryOrder
                    .filter((cat) => grouped[cat])
                    .map((cat) => (
                      <div key={cat} style={{ marginBottom: 24 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: categoryColors[cat] || "var(--gold)",
                              flexShrink: 0,
                            }}
                          />
                          <div
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: 11,
                              letterSpacing: "0.2em",
                              color: "var(--silver)",
                              opacity: 0.6,
                            }}
                          >
                            {cat.toUpperCase()}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: 2,
                          }}
                        >
                          {grouped[cat].map((item) => (
                            <div
                              key={item.id}
                              style={{
                                padding: "14px 16px",
                                background: "rgba(13,27,53,0.35)",
                                border: "1px solid rgba(201,168,76,0.07)",
                                borderLeft: `3px solid ${categoryColors[cat] || "rgba(201,168,76,0.3)"}`,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  marginBottom: 6,
                                }}
                              >
                                <div
                                  style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--mist)",
                                  }}
                                >
                                  {item.name}
                                </div>
                                {item.quantity > 1 && (
                                  <div
                                    style={{
                                      fontFamily: "var(--font-deco)",
                                      fontSize: 16,
                                      color: "var(--gold)",
                                      flexShrink: 0,
                                      marginLeft: 8,
                                    }}
                                  >
                                    ×{item.quantity}
                                  </div>
                                )}
                              </div>
                              <div
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: 12,
                                  color: "var(--silver)",
                                  opacity: 0.55,
                                  lineHeight: 1.4,
                                  marginBottom:
                                    item.effects && Object.keys(item.effects).length > 0 ? 8 : 0,
                                }}
                              >
                                {item.desc}
                              </div>
                              {item.effects &&
                                Object.keys(item.effects).filter((k) => item.effects[k]).length > 0 && (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 4,
                                    }}
                                  >
                                    {Object.entries(item.effects)
                                      .filter(([, v]) => v)
                                      .map(([k, v]) => (
                                        <span
                                          key={k}
                                          style={{
                                            padding: "2px 8px",
                                            background: `${categoryColors[cat] || "rgba(201,168,76,0.1)"}20`,
                                            border: `1px solid ${categoryColors[cat] || "rgba(201,168,76,0.2)"}40`,
                                            fontFamily: "var(--font-display)",
                                            fontSize: 9,
                                            letterSpacing: "0.1em",
                                            color: categoryColors[cat] || "var(--gold)",
                                            opacity: 0.8,
                                          }}
                                        >
                                          {k}: {String(v)}
                                        </span>
                                      ))}
                                  </div>
                                )}
                              {item.tags && item.tags.length > 0 && (
                                <div
                                  style={{
                                    marginTop: 6,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 3,
                                  }}
                                >
                                  {item.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      style={{
                                        padding: "1px 6px",
                                        background: "rgba(201,168,76,0.04)",
                                        border: "1px solid rgba(201,168,76,0.08)",
                                        fontFamily: "var(--font-display)",
                                        fontSize: 8,
                                        letterSpacing: "0.1em",
                                        color: "var(--silver)",
                                        opacity: 0.4,
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              );
            })()}

          <div
            style={{
              padding: "28px 28px",
              background: "rgba(27,58,107,0.12)",
              border: "1px solid rgba(201,168,76,0.15)",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: "var(--gold)",
                marginBottom: 6,
              }}
            >
              ✦ Custom Item Slots
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--silver)",
                opacity: 0.7,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              You have 2 personal item slots. Describe something you want to carry — something that fits your
              character and your world. The Chronicler will assess whether it&apos;s plausible before your adventure
              begins.
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                letterSpacing: "0.15em",
                color: "var(--silver)",
                opacity: 0.4,
                marginBottom: 20,
              }}
            >
              NOTE — Items that grant unfair advantages or are impossible in your world will not be approved.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  color: "var(--silver)",
                  opacity: 0.5,
                  marginBottom: 8,
                }}
              >
                CUSTOM ITEM 1 (OPTIONAL)
              </label>
              <input
                value={customItem1}
                onChange={(e) => setCustomItem1(e.target.value)}
                placeholder='Describe your item — e.g. "A worn pocket watch that belonged to my father"'
                maxLength={200}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(13,27,53,0.5)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  color: "var(--mist)",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(201,168,76,0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(201,168,76,0.15)";
                }}
              />
              <div
                style={{
                  textAlign: "right",
                  marginTop: 4,
                  fontFamily: "var(--font-display)",
                  fontSize: 9,
                  color: "var(--silver)",
                  opacity: 0.3,
                }}
              >
                {customItem1.length}/200
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  color: "var(--silver)",
                  opacity: 0.5,
                  marginBottom: 8,
                }}
              >
                CUSTOM ITEM 2 (OPTIONAL)
              </label>
              <input
                value={customItem2}
                onChange={(e) => setCustomItem2(e.target.value)}
                placeholder='Describe your item — e.g. "A salvaged scanner that still works half the time"'
                maxLength={200}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(13,27,53,0.5)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  color: "var(--mist)",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(201,168,76,0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(201,168,76,0.15)";
                }}
              />
              <div
                style={{
                  textAlign: "right",
                  marginTop: 4,
                  fontFamily: "var(--font-display)",
                  fontSize: 9,
                  color: "var(--silver)",
                  opacity: 0.3,
                }}
              >
                {customItem2.length}/200
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "20px 24px",
              background: "rgba(13,27,53,0.3)",
              border: "1px solid rgba(201,168,76,0.08)",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "var(--silver)",
                opacity: 0.4,
                marginBottom: 12,
              }}
            >
              PACK SUMMARY
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
                fontSize: 15,
                color: "var(--silver)",
                opacity: 0.6,
                lineHeight: 1.6,
              }}
            >
              {starterPack
                ? `${starterPack.items.filter((i) => !i.isCustom).length} items packed. ${starterPack.packSlots} pack slots available. ${customItem1.trim() || customItem2.trim() ? "Custom items pending Chronicler review." : "No custom items requested."}`
                : "Calculating your pack..."}
            </div>
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
          gap: 16,
          flexWrap: "wrap",
          backdropFilter: "blur(12px)",
          zIndex: 50,
        }}
      >
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            padding: "12px 28px",
            background: "transparent",
            border: "1px solid rgba(201,168,76,0.2)",
            color: "var(--silver)",
            fontFamily: "var(--font-display)",
            fontSize: 12,
            letterSpacing: "0.1em",
            cursor: "pointer",
            opacity: step === 0 ? 0.3 : 1,
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
          {step + 1} / {STEPS.length}
        </div>

        {error ? (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#FF6060", flex: "1 1 200px" }}>
            {error}
          </div>
        ) : (
          <div style={{ flex: "1 1 auto" }} />
        )}

        {isLast ? (
          <button
            type="button"
            onClick={() => void saveCharacter()}
            disabled={!canProceed() || saving}
            style={{
              padding: "12px 32px",
              background:
                canProceed() && !saving
                  ? "linear-gradient(135deg, var(--gold), #E8B94F)"
                  : "rgba(201,168,76,0.1)",
              border: "none",
              color: canProceed() && !saving ? "var(--void)" : "var(--silver)",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              letterSpacing: "0.1em",
              cursor: canProceed() && !saving ? "pointer" : "not-allowed",
              clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            }}
          >
            {saving ? "CREATING..." : "⚔ ENTER THE RIFT"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            style={{
              padding: "12px 32px",
              background: canProceed()
                ? "linear-gradient(135deg, var(--gold), #E8B94F)"
                : "rgba(201,168,76,0.1)",
              border: "none",
              color: canProceed() ? "var(--void)" : "var(--silver)",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              letterSpacing: "0.1em",
              cursor: canProceed() ? "pointer" : "not-allowed",
              clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            }}
          >
            NEXT →
          </button>
        )}
      </div>
    </div>
  );
}
