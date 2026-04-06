import { PRESET_COMBOS } from "./genres-data";

export function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join(
    "",
  );
}

export function buildPreviewText(primary, secondary, period, mashOn) {
  if (!primary || !period) return "";

  if (mashOn && secondary) {
    const preset = PRESET_COMBOS.find(
      (p) => p.primary === primary && p.secondary === secondary,
    );
    if (preset) return `${preset.name} — ${preset.desc}`;
  }

  const periodLabels = {
    deep_past: "in the mythological age",
    historical_past: "in a historical era",
    recent_past: "in the recent past",
    present_day: "in the present day",
    near_future: "in the near future",
    far_future: "in the far future",
    alternate_history: "in an alternate timeline",
    timeless: "in a timeless, mythic setting",
  };

  const periodText = periodLabels[period] || period;

  if (mashOn && secondary) {
    return `${primary} meets ${secondary} — ${periodText}`;
  }
  return `${primary} — ${periodText}`;
}

export function detectPresetCombo(primary, secondary) {
  return (
    PRESET_COMBOS.find((p) => p.primary === primary && p.secondary === secondary) || null
  );
}
