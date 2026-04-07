// ============================================================
// Genesis: Echoes of Creation — Item Data Library v1
// All items, starter packs, class kits, and background kits
// ============================================================

// ── ITEM CATEGORIES ──────────────────────────────────────────
export const ITEM_CATEGORIES = {
  WEAPON: "Weapon",
  ARMOR: "Armor",
  ACCESSORY: "Accessory",
  CONSUMABLE: "Consumable",
  MATERIAL: "Material",
  TOOL: "Tool",
  QUEST: "Quest",
  UTILITY: "Utility",
  CURRENCY: "Currency",
  RELIC: "Relic",
  AMMO: "Ammo",
  TECH: "Tech",
  DOCUMENT: "Document",
};

// ── ITEM SIZE CLASSES ─────────────────────────────────────────
export const SIZE_CLASS = {
  MICRO: { label: "Micro", slotCost: 0, bulk: 0 },
  SMALL: { label: "Small", slotCost: 1, bulk: 1 },
  MEDIUM: { label: "Medium", slotCost: 2, bulk: 2 },
  LARGE: { label: "Large", slotCost: 3, bulk: 3 },
  HEAVY: { label: "Heavy", slotCost: 4, bulk: 4 },
};

// ── EQUIPMENT SLOTS ───────────────────────────────────────────
export const EQUIPMENT_SLOTS = [
  "main_hand",
  "off_hand",
  "head",
  "chest",
  "legs",
  "feet",
  "hands",
  "back",
  "neck",
  "ring_1",
  "ring_2",
  "belt",
  "relic_1",
  "relic_2",
];

// ── RARITY TIERS ─────────────────────────────────────────────
export const RARITY = {
  COMMON: { label: "Common", color: "#A8B8D0", affixes: 0 },
  UNCOMMON: { label: "Uncommon", color: "#1A6B2A", affixes: 1 },
  RARE: { label: "Rare", color: "#1A4A8B", affixes: 2 },
  EPIC: { label: "Epic", color: "#5B2D8E", affixes: 3 },
  LEGENDARY: { label: "Legendary", color: "#C9A84C", affixes: 3 },
  MYTHIC: { label: "Mythic", color: "#8B2020", affixes: 4 },
};

// ============================================================
// MASTER ITEM LIST
// genres: ['all'] means available in any genre
// classes: ['all'] means available to any class
// ============================================================

export const ITEMS = [
  { id: "dagger", name: "Dagger", category: "Weapon", subcategory: "Blade", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "A short blade. Fast, concealable, and always useful.", effects: { damage: "1d4", type: "piercing" }, tags: ["finesse", "light", "thrown"], equipSlot: "main_hand", genres: ["all"], classes: ["all"], value: 2 },
  { id: "shortsword", name: "Shortsword", category: "Weapon", subcategory: "Blade", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Reliable and well-balanced. A soldier's first choice.", effects: { damage: "1d6", type: "piercing" }, tags: ["finesse", "light"], equipSlot: "main_hand", genres: ["all"], classes: ["warrior", "rogue", "hunter", "warden"], value: 10 },
  { id: "longsword", name: "Longsword", category: "Weapon", subcategory: "Blade", tier: 1, rarity: "common", size: "medium", bulk: 3, slotCost: 2, desc: "The classic sword. Versatile in every situation.", effects: { damage: "1d8", type: "slashing" }, tags: ["versatile"], equipSlot: "main_hand", genres: ["Fantasy", "Mythology & Legend", "Gothic Romance", "Steampunk", "Weird West"], classes: ["warrior", "warden"], value: 15 },
  { id: "greatsword", name: "Greatsword", category: "Weapon", subcategory: "Blade", tier: 1, rarity: "common", size: "large", bulk: 4, slotCost: 3, desc: "Two hands required. The damage speaks for itself.", effects: { damage: "2d6", type: "slashing" }, tags: ["heavy", "two-handed"], equipSlot: "main_hand", genres: ["Fantasy", "Mythology & Legend"], classes: ["warrior", "berserker"], value: 25 },
  { id: "handaxe", name: "Handaxe", category: "Weapon", subcategory: "Axe", tier: 1, rarity: "common", size: "small", bulk: 2, slotCost: 1, desc: "Light enough to throw, heavy enough to hurt.", effects: { damage: "1d6", type: "slashing" }, tags: ["light", "thrown"], equipSlot: "main_hand", genres: ["all"], classes: ["warrior", "berserker", "hunter"], value: 5 },
  { id: "battleaxe", name: "Battleaxe", category: "Weapon", subcategory: "Axe", tier: 1, rarity: "common", size: "medium", bulk: 3, slotCost: 2, desc: "Designed to cut through armour. Brutal and effective.", effects: { damage: "1d8", type: "slashing" }, tags: ["versatile", "armor-pierce"], equipSlot: "main_hand", genres: ["Fantasy", "Post-Apocalyptic", "Weird West"], classes: ["warrior", "berserker"], value: 12 },
  { id: "warhammer", name: "Warhammer", category: "Weapon", subcategory: "Blunt", tier: 1, rarity: "common", size: "medium", bulk: 3, slotCost: 2, desc: "Shatters bone and armour alike. Heavy and satisfying.", effects: { damage: "1d8", type: "bludgeoning" }, tags: ["versatile", "stun"], equipSlot: "main_hand", genres: ["Fantasy", "Steampunk", "Mythology & Legend"], classes: ["warrior", "warden", "berserker"], value: 12 },
  { id: "quarterstaff", name: "Quarterstaff", category: "Weapon", subcategory: "Polearm", tier: 1, rarity: "common", size: "large", bulk: 2, slotCost: 2, desc: "Simple wood, endlessly useful. Both a weapon and a tool.", effects: { damage: "1d6", type: "bludgeoning" }, tags: ["versatile", "reach"], equipSlot: "main_hand", genres: ["all"], classes: ["arcanist", "seeker", "shaman", "monk"], value: 2 },
  { id: "spear", name: "Spear", category: "Weapon", subcategory: "Polearm", tier: 1, rarity: "common", size: "large", bulk: 3, slotCost: 2, desc: "Reach advantage in combat. Thrown when necessary.", effects: { damage: "1d6", type: "piercing" }, tags: ["thrown", "reach", "versatile"], equipSlot: "main_hand", genres: ["all"], classes: ["warrior", "hunter", "warden"], value: 5 },
  { id: "rapier", name: "Rapier", category: "Weapon", subcategory: "Blade", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Precision over power. Built for those who think before they strike.", effects: { damage: "1d8", type: "piercing" }, tags: ["finesse"], equipSlot: "main_hand", genres: ["Fantasy", "Pirate / Age of Sail", "Gothic Romance", "Steampunk"], classes: ["rogue", "speaker"], value: 25 },
  { id: "combat_knife", name: "Combat Knife", category: "Weapon", subcategory: "Blade", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Military-grade blade. Tough enough for field use.", effects: { damage: "1d4", type: "piercing" }, tags: ["light", "finesse", "utility"], equipSlot: "main_hand", genres: ["Military & War", "Spy & Espionage", "Post-Apocalyptic", "Cyberpunk"], classes: ["all"], value: 8 },
  { id: "brass_knuckles", name: "Brass Knuckles", category: "Weapon", subcategory: "Unarmed", tier: 1, rarity: "common", size: "micro", bulk: 0, slotCost: 1, desc: "Fits in a pocket. Lets you punch harder.", effects: { damage: "1d4", type: "bludgeoning" }, tags: ["light", "unarmed"], equipSlot: "main_hand", genres: ["Noir / Detective", "Cyberpunk", "Post-Apocalyptic", "Western"], classes: ["all"], value: 5 },
  { id: "katana", name: "Katana", category: "Weapon", subcategory: "Blade", tier: 2, rarity: "uncommon", size: "medium", bulk: 2, slotCost: 2, desc: "Folded steel, disciplined art. Cut with intent.", effects: { damage: "1d8", type: "slashing" }, tags: ["finesse", "precision"], equipSlot: "main_hand", genres: ["Martial Arts / Wuxia", "Cyberpunk", "Fantasy"], classes: ["rogue", "warrior", "monk"], value: 40 },
  { id: "void_blade", name: "Void Blade", category: "Weapon", subcategory: "Blade", tier: 3, rarity: "rare", size: "medium", bulk: 2, slotCost: 2, desc: "Forged where matter ends. Cuts through more than flesh.", effects: { damage: "1d10", type: "void", bonus: "ignore 5 resistance" }, tags: ["magical", "finesse"], equipSlot: "main_hand", genres: ["Cosmic Horror", "Science Fiction", "Fantasy"], classes: ["arcanist", "seeker", "warrior"], value: 200 },
  { id: "shortbow", name: "Shortbow", category: "Weapon", subcategory: "Bow", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Quick to draw, quiet to fire.", effects: { damage: "1d6", type: "piercing", range: "80/320ft" }, tags: ["ranged", "two-handed"], equipSlot: "main_hand", genres: ["Fantasy", "Mythology & Legend", "Post-Apocalyptic", "Survival"], classes: ["hunter", "rogue"], value: 25 },
  { id: "longbow", name: "Longbow", category: "Weapon", subcategory: "Bow", tier: 1, rarity: "common", size: "large", bulk: 2, slotCost: 3, desc: "Devastating range. Requires discipline to master.", effects: { damage: "1d8", type: "piercing", range: "150/600ft" }, tags: ["ranged", "two-handed", "heavy"], equipSlot: "main_hand", genres: ["Fantasy", "Mythology & Legend", "Survival"], classes: ["hunter"], value: 50 },
  { id: "crossbow", name: "Crossbow", category: "Weapon", subcategory: "Crossbow", tier: 1, rarity: "common", size: "medium", bulk: 3, slotCost: 2, desc: "More power than a bow. Slower to reload.", effects: { damage: "1d8", type: "piercing", range: "100/400ft" }, tags: ["ranged", "loading", "two-handed"], equipSlot: "main_hand", genres: ["Fantasy", "Steampunk", "Dieselpunk"], classes: ["hunter", "warrior", "rogue"], value: 25 },
  { id: "revolver", name: "Revolver", category: "Weapon", subcategory: "Firearm", tier: 2, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Six shots. Make them count.", effects: { damage: "2d6", type: "piercing", range: "40/160ft", ammo: 6 }, tags: ["firearm", "reload"], equipSlot: "main_hand", genres: ["Western", "Weird West", "Post-Apocalyptic"], classes: ["gunslinger", "warrior"], value: 35 },
  { id: "rifle", name: "Rifle", category: "Weapon", subcategory: "Firearm", tier: 2, rarity: "common", size: "large", bulk: 3, slotCost: 3, desc: "Long range precision. One shot, one consequence.", effects: { damage: "2d10", type: "piercing", range: "300/1200ft", ammo: 5 }, tags: ["firearm", "two-handed", "heavy", "reload"], equipSlot: "main_hand", genres: ["Military & War", "Western", "Post-Apocalyptic", "Spy & Espionage"], classes: ["gunslinger", "hunter"], value: 75 },
  { id: "shotgun", name: "Shotgun", category: "Weapon", subcategory: "Firearm", tier: 2, rarity: "common", size: "large", bulk: 3, slotCost: 3, desc: "Devastating at close range. Terrible at distance.", effects: { damage: "3d6", type: "piercing", range: "15/60ft", ammo: 2 }, tags: ["firearm", "two-handed", "spread", "reload"], equipSlot: "main_hand", genres: ["Western", "Post-Apocalyptic", "Military & War", "Zombie Apocalypse"], classes: ["gunslinger", "warrior"], value: 50 },
  { id: "sidearm", name: "Sidearm Pistol", category: "Weapon", subcategory: "Firearm", tier: 2, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Standard issue. Reliable when everything else fails.", effects: { damage: "1d10", type: "piercing", range: "30/120ft", ammo: 12 }, tags: ["firearm", "reload"], equipSlot: "main_hand", genres: ["Military & War", "Cyberpunk", "Science Fiction", "Spy & Espionage"], classes: ["all"], value: 40 },
  { id: "plasma_rifle", name: "Plasma Rifle", category: "Weapon", subcategory: "Energy", tier: 3, rarity: "rare", size: "large", bulk: 3, slotCost: 3, desc: "Superheated plasma. Armour is not a suggestion when this fires.", effects: { damage: "3d8", type: "fire", range: "120/480ft", ammo: 20 }, tags: ["energy", "two-handed", "heavy"], equipSlot: "main_hand", genres: ["Science Fiction", "Space Opera", "Cyberpunk"], classes: ["warrior", "engineer", "gunslinger"], value: 300 },
  { id: "neural_disruptor", name: "Neural Disruptor", category: "Weapon", subcategory: "Energy", tier: 3, rarity: "rare", size: "small", bulk: 1, slotCost: 1, desc: "Overloads nervous systems. Non-lethal until it isn't.", effects: { damage: "2d6", type: "psychic", range: "30/90ft", ammo: 8 }, tags: ["energy", "stun"], equipSlot: "main_hand", genres: ["Science Fiction", "Cyberpunk", "Space Opera"], classes: ["netrunner", "spy", "rogue"], value: 180 },
  { id: "leather_armor", name: "Leather Armour", category: "Armor", subcategory: "Light", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Flexible protection. Won't stop a greataxe but stops most things.", effects: { ac: 11, maxDex: 99 }, tags: ["light"], equipSlot: "chest", genres: ["all"], classes: ["rogue", "hunter", "speaker", "shaman"], value: 10 },
  { id: "studded_leather", name: "Studded Leather", category: "Armor", subcategory: "Light", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Reinforced leather with metal studs. More protection, same mobility.", effects: { ac: 12, maxDex: 99 }, tags: ["light"], equipSlot: "chest", genres: ["all"], classes: ["rogue", "hunter", "warrior"], value: 45 },
  { id: "chain_mail", name: "Chain Mail", category: "Armor", subcategory: "Medium", tier: 1, rarity: "common", size: "large", bulk: 4, slotCost: 3, desc: "Interlocked rings. Noisy but effective against blades.", effects: { ac: 16, maxDex: 0, stealthDis: true }, tags: ["medium"], equipSlot: "chest", genres: ["Fantasy", "Mythology & Legend", "Pirate / Age of Sail"], classes: ["warrior", "warden"], value: 75 },
  { id: "plate_armor", name: "Plate Armour", category: "Armor", subcategory: "Heavy", tier: 2, rarity: "common", size: "large", bulk: 5, slotCost: 3, desc: "The pinnacle of physical protection. Slow but almost impenetrable.", effects: { ac: 18, maxDex: 0, stealthDis: true }, tags: ["heavy"], equipSlot: "chest", genres: ["Fantasy", "Mythology & Legend"], classes: ["warrior", "warden"], value: 1500 },
  { id: "robe", name: "Arcane Robe", category: "Armor", subcategory: "Cloth", tier: 1, rarity: "common", size: "medium", bulk: 1, slotCost: 2, desc: "Minimal physical protection. Channels arcane energy more effectively.", effects: { ac: 10, spellBonus: 1 }, tags: ["cloth", "magic"], equipSlot: "chest", genres: ["Fantasy", "Horror", "Gothic Romance"], classes: ["arcanist", "seeker", "catalyst"], value: 20 },
  { id: "tactical_vest", name: "Tactical Vest", category: "Armor", subcategory: "Light", tier: 2, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Ballistic panels and MOLLE webbing. Modern protection for modern threats.", effects: { ac: 13, extraSlots: 2 }, tags: ["light", "tactical", "modern"], equipSlot: "chest", genres: ["Military & War", "Spy & Espionage", "Post-Apocalyptic", "Cyberpunk"], classes: ["all"], value: 120 },
  { id: "combat_fatigues", name: "Combat Fatigues", category: "Armor", subcategory: "Light", tier: 1, rarity: "common", size: "medium", bulk: 1, slotCost: 2, desc: "Standard issue military clothing. Blends into field environments.", effects: { ac: 11, stealthBonus: 1 }, tags: ["light", "camouflage"], equipSlot: "chest", genres: ["Military & War", "Post-Apocalyptic", "Survival"], classes: ["all"], value: 30 },
  { id: "exosuit", name: "Exo-Suit", category: "Armor", subcategory: "Heavy", tier: 3, rarity: "rare", size: "heavy", bulk: 5, slotCost: 3, desc: "Powered armour that augments strength and provides heavy protection.", effects: { ac: 20, strengthBonus: 4 }, tags: ["heavy", "powered", "tech"], equipSlot: "chest", genres: ["Science Fiction", "Military & War", "Cyberpunk"], classes: ["warrior", "engineer"], value: 2000 },
  { id: "trenchcoat", name: "Trenchcoat", category: "Armor", subcategory: "Light", tier: 1, rarity: "common", size: "medium", bulk: 1, slotCost: 2, desc: "Not armour exactly. But it hides a lot of things and keeps off the rain.", effects: { ac: 10, concealSlots: 3 }, tags: ["light", "conceal"], equipSlot: "chest", genres: ["Noir / Detective", "Cyberpunk", "Western", "Spy & Espionage"], classes: ["all"], value: 15 },
  { id: "shadowweave", name: "Shadowweave Cloak", category: "Armor", subcategory: "Light", tier: 2, rarity: "uncommon", size: "medium", bulk: 1, slotCost: 2, desc: "Cloth woven with enchantments. Difficult to see in low light.", effects: { ac: 11, stealthBonus: 3 }, tags: ["light", "magic", "stealth"], equipSlot: "back", genres: ["Fantasy", "Horror", "Gothic Romance"], classes: ["rogue", "seeker", "hunter"], value: 150 },
  { id: "wooden_shield", name: "Wooden Shield", category: "Armor", subcategory: "Shield", tier: 1, rarity: "common", size: "medium", bulk: 3, slotCost: 2, desc: "Basic protection. Better than nothing. Not much better.", effects: { acBonus: 2 }, tags: ["shield"], equipSlot: "off_hand", genres: ["Fantasy", "Mythology & Legend", "Survival"], classes: ["warrior", "warden"], value: 10 },
  { id: "steel_shield", name: "Steel Shield", category: "Armor", subcategory: "Shield", tier: 1, rarity: "common", size: "medium", bulk: 4, slotCost: 2, desc: "Standard military shield. Deflects blades and arrows reliably.", effects: { acBonus: 2 }, tags: ["shield"], equipSlot: "off_hand", genres: ["Fantasy", "Mythology & Legend", "Military & War"], classes: ["warrior", "warden"], value: 20 },
  { id: "leather_helm", name: "Leather Helm", category: "Armor", subcategory: "Helmet", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Basic head protection. Keeps the skull mostly intact.", effects: { acBonus: 1 }, tags: ["helmet", "light"], equipSlot: "head", genres: ["all"], classes: ["all"], value: 5 },
  { id: "steel_helmet", name: "Steel Helmet", category: "Armor", subcategory: "Helmet", tier: 1, rarity: "common", size: "small", bulk: 2, slotCost: 1, desc: "Solid protection for the head. Heavy but reliable.", effects: { acBonus: 2 }, tags: ["helmet", "heavy"], equipSlot: "head", genres: ["Fantasy", "Military & War", "Mythology & Legend"], classes: ["warrior", "warden"], value: 15 },
  { id: "tactical_helmet", name: "Tactical Helmet", category: "Armor", subcategory: "Helmet", tier: 2, rarity: "common", size: "small", bulk: 2, slotCost: 1, desc: "Ballistic protection with visor and comms integration.", effects: { acBonus: 2, perceptionBonus: 1 }, tags: ["helmet", "tech"], equipSlot: "head", genres: ["Military & War", "Science Fiction", "Cyberpunk"], classes: ["all"], value: 80 },
  { id: "ring_protection", name: "Ring of Protection", category: "Accessory", subcategory: "Ring", tier: 2, rarity: "uncommon", size: "micro", bulk: 0, slotCost: 1, desc: "A simple enchanted band. Turns aside blows that should have landed.", effects: { acBonus: 1, savingThrowBonus: 1 }, tags: ["magical", "ring"], equipSlot: "ring_1", genres: ["Fantasy", "Gothic Romance", "Mythology & Legend"], classes: ["all"], value: 200 },
  { id: "amulet_health", name: "Amulet of Health", category: "Accessory", subcategory: "Amulet", tier: 2, rarity: "uncommon", size: "micro", bulk: 0, slotCost: 1, desc: "Warmth radiates from this pendant. Sets constitution to 19 if lower.", effects: { constitutionFloor: 19 }, tags: ["magical", "amulet"], equipSlot: "neck", genres: ["Fantasy", "Gothic Romance"], classes: ["all"], value: 250 },
  { id: "cloak_resistance", name: "Cloak of Resistance", category: "Accessory", subcategory: "Cloak", tier: 2, rarity: "uncommon", size: "small", bulk: 1, slotCost: 1, desc: "Shimmers faintly. +1 to all saving throws.", effects: { savingThrowBonus: 1 }, tags: ["magical", "cloak"], equipSlot: "back", genres: ["Fantasy", "Gothic Romance"], classes: ["all"], value: 180 },
  { id: "neural_interface", name: "Neural Interface", category: "Accessory", subcategory: "Tech", tier: 3, rarity: "rare", size: "micro", bulk: 0, slotCost: 1, desc: "Surgically implanted. Think faster. React faster. Hurt more too.", effects: { initiativeBonus: 3, hackingBonus: 2 }, tags: ["tech", "implant"], equipSlot: "neck", genres: ["Cyberpunk", "Science Fiction"], classes: ["netrunner", "psionicist"], value: 400 },
  { id: "compass_true", name: "True Compass", category: "Accessory", subcategory: "Utility", tier: 1, rarity: "uncommon", size: "micro", bulk: 0, slotCost: 1, desc: "Points toward whatever you need most, not north.", effects: { navigationBonus: 3 }, tags: ["magical", "utility"], equipSlot: "belt", genres: ["Fantasy", "Pirate / Age of Sail", "Adventure"], classes: ["hunter", "explorer"], value: 100 },
  { id: "healing_potion", name: "Healing Potion", category: "Consumable", subcategory: "Potion", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 5, desc: "Red liquid, sweet smell, instant relief. The adventurer's best friend.", effects: { healHP: "2d4+2" }, tags: ["healing", "potion"], genres: ["Fantasy", "Gothic Romance", "Mythology & Legend"], classes: ["all"], value: 50 },
  { id: "healing_potion_greater", name: "Greater Healing Potion", category: "Consumable", subcategory: "Potion", tier: 2, rarity: "uncommon", size: "small", bulk: 1, slotCost: 1, stackLimit: 5, desc: "Stronger formula. For when a standard potion won't cut it.", effects: { healHP: "4d4+4" }, tags: ["healing", "potion"], genres: ["Fantasy", "Gothic Romance"], classes: ["all"], value: 150 },
  { id: "stim_pack", name: "Stim Pack", category: "Consumable", subcategory: "Medical", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 5, desc: "Auto-inject field medicine. Works fast, wears off faster.", effects: { healHP: "2d4+2", duration: "1 hour" }, tags: ["medical", "tech"], genres: ["Military & War", "Science Fiction", "Cyberpunk", "Post-Apocalyptic"], classes: ["all"], value: 40 },
  { id: "medkit", name: "Field Medkit", category: "Consumable", subcategory: "Medical", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, stackLimit: 1, desc: "Bandages, antiseptic, and tools. Proper treatment takes a minute.", effects: { healHP: "4d4+4", castTime: "1 minute" }, tags: ["medical", "tool"], genres: ["Military & War", "Science Fiction", "Survival", "Post-Apocalyptic"], classes: ["medic", "all"], value: 60 },
  { id: "antidote", name: "Antidote", category: "Consumable", subcategory: "Potion", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 5, desc: "Neutralises poison in the bloodstream. Always worth carrying.", effects: { curePoison: true }, tags: ["medical", "potion"], genres: ["all"], classes: ["all"], value: 50 },
  { id: "ration", name: "Field Ration", category: "Consumable", subcategory: "Food", tier: 1, rarity: "common", size: "micro", bulk: 0, slotCost: 1, stackLimit: 10, desc: "Tasteless but functional. One day's sustenance in a pack.", effects: { sustenance: "1 day" }, tags: ["food", "survival"], genres: ["all"], classes: ["all"], value: 5 },
  { id: "energy_drink", name: "Synth-Stim", category: "Consumable", subcategory: "Food", tier: 1, rarity: "common", size: "micro", bulk: 0, slotCost: 1, stackLimit: 10, desc: "Chemical wake-up call. Ignore fatigue for 4 hours.", effects: { ignoreFatigue: "4 hours" }, tags: ["food", "stimulant"], genres: ["Cyberpunk", "Science Fiction", "Military & War"], classes: ["all"], value: 8 },
  { id: "smoke_bomb", name: "Smoke Bomb", category: "Consumable", subcategory: "Tactical", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 5, desc: "Instant visual cover. Buys time and conceals movement.", effects: { smokeRadius: "20ft", duration: "1 minute" }, tags: ["tactical", "thrown"], genres: ["all"], classes: ["rogue", "warrior", "hunter", "spy"], value: 20 },
  { id: "flashbang", name: "Flashbang", category: "Consumable", subcategory: "Tactical", tier: 2, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 5, desc: "Blinding light and deafening sound. Clears a room without killing it.", effects: { blindRadius: "30ft", stunDuration: "1 round" }, tags: ["tactical", "thrown"], genres: ["Military & War", "Spy & Espionage", "Cyberpunk"], classes: ["all"], value: 35 },
  { id: "molotov", name: "Molotov Cocktail", category: "Consumable", subcategory: "Tactical", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 5, desc: "Glass bottle. Flammable liquid. A rage problem in a bottle.", effects: { fireDamage: "2d6", burnRadius: "10ft", duration: "1 minute" }, tags: ["fire", "thrown"], genres: ["Post-Apocalyptic", "Zombie Apocalypse", "Western", "Weird West"], classes: ["all"], value: 10 },
  { id: "poison_vial", name: "Poison Vial", category: "Consumable", subcategory: "Poison", tier: 2, rarity: "uncommon", size: "micro", bulk: 0, slotCost: 1, stackLimit: 5, desc: "Applied to a blade. Target must save or take ongoing damage.", effects: { poisonDamage: "1d4", duration: "6 rounds", save: "CON 15" }, tags: ["poison", "blade-coat"], genres: ["Fantasy", "Horror", "Spy & Espionage"], classes: ["rogue", "hunter", "catalyst"], value: 100 },
  { id: "arrows", name: "Arrows", category: "Ammo", subcategory: "Arrow", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 20, desc: "Standard wooden shaft with iron tip. Fletching intact.", effects: {}, tags: ["ammo", "bow"], genres: ["all"], classes: ["hunter", "warrior"], value: 1 },
  { id: "bolts", name: "Crossbow Bolts", category: "Ammo", subcategory: "Bolt", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 20, desc: "Short, heavy bolts for crossbows. Punches through armour.", effects: {}, tags: ["ammo", "crossbow"], genres: ["all"], classes: ["hunter", "warrior"], value: 1 },
  { id: "bullets_pistol", name: "Pistol Rounds", category: "Ammo", subcategory: "Bullet", tier: 1, rarity: "common", size: "micro", bulk: 0, slotCost: 1, stackLimit: 50, desc: "Standard pistol ammunition.", effects: {}, tags: ["ammo", "firearm"], genres: ["Western", "Military & War", "Cyberpunk", "Post-Apocalyptic"], classes: ["all"], value: 0.2 },
  { id: "bullets_rifle", name: "Rifle Rounds", category: "Ammo", subcategory: "Bullet", tier: 1, rarity: "common", size: "micro", bulk: 1, slotCost: 1, stackLimit: 20, desc: "High-powered rifle cartridges. Long range, hard impact.", effects: {}, tags: ["ammo", "firearm", "rifle"], genres: ["Western", "Military & War", "Post-Apocalyptic"], classes: ["all"], value: 0.5 },
  { id: "energy_cell", name: "Energy Cell", category: "Ammo", subcategory: "Energy", tier: 2, rarity: "common", size: "micro", bulk: 0, slotCost: 1, stackLimit: 20, desc: "Compact power source for energy weapons. Handle with care.", effects: {}, tags: ["ammo", "energy", "tech"], genres: ["Science Fiction", "Cyberpunk", "Space Opera"], classes: ["all"], value: 10 },
  { id: "thieves_tools", name: "Thieves' Tools", category: "Tool", subcategory: "Kit", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Lockpicks, tension wrenches, and associated guilt.", effects: { lockpickBonus: 2 }, tags: ["tool", "stealth"], genres: ["all"], classes: ["rogue", "criminal", "spy"], value: 25 },
  { id: "herbalism_kit", name: "Herbalism Kit", category: "Tool", subcategory: "Kit", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Mortar, pestle, pouches, and basic reagents. Brew potions in the field.", effects: { craftingBonus: "alchemy", usesPerRest: 3 }, tags: ["tool", "crafting", "nature"], genres: ["Fantasy", "Horror", "Survival", "Weird West"], classes: ["catalyst", "shaman", "healer"], value: 5 },
  { id: "hacking_rig", name: "Hacking Rig", category: "Tool", subcategory: "Tech", tier: 2, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Custom hardware for cracking systems. Gets warm under heavy use.", effects: { hackingBonus: 3 }, tags: ["tool", "tech"], genres: ["Cyberpunk", "Science Fiction"], classes: ["netrunner", "engineer"], value: 150 },
  { id: "repair_kit", name: "Repair Kit", category: "Tool", subcategory: "Kit", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Wrenches, solder, patches. Fix most things in the field.", effects: { repairDurability: 30, craftingBonus: "engineering" }, tags: ["tool", "tech", "crafting"], genres: ["Steampunk", "Dieselpunk", "Science Fiction", "Post-Apocalyptic"], classes: ["engineer", "pilot"], value: 30 },
  { id: "disguise_kit", name: "Disguise Kit", category: "Tool", subcategory: "Kit", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Makeup, wigs, false documents, spirit gum. Become someone else.", effects: { disguiseBonus: 3 }, tags: ["tool", "social"], genres: ["all"], classes: ["spy", "rogue", "speaker"], value: 25 },
  { id: "climbers_kit", name: "Climber's Kit", category: "Tool", subcategory: "Kit", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Pitons, hammer, rope clips, and harness. Conquer vertical terrain.", effects: { climbingBonus: 3 }, tags: ["tool", "outdoor"], genres: ["all"], classes: ["hunter", "warrior", "explorer"], value: 25 },
  { id: "alchemist_kit", name: "Alchemist's Kit", category: "Tool", subcategory: "Kit", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Flasks, burners, tubing, and base reagents. Create compounds in the field.", effects: { craftingBonus: "alchemy", craftSlots: 3 }, tags: ["tool", "crafting", "science"], genres: ["Fantasy", "Steampunk", "Science Fiction"], classes: ["catalyst", "arcanist"], value: 50 },
  { id: "forgery_kit", name: "Forgery Kit", category: "Tool", subcategory: "Kit", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Inks, seals, blank documents, and practiced impersonation.", effects: { forgeryBonus: 3 }, tags: ["tool", "document"], genres: ["all"], classes: ["spy", "rogue", "criminal"], value: 15 },
  { id: "medics_bag", name: "Medical Bag", category: "Tool", subcategory: "Kit", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Sutures, bandages, painkillers, and sterile tools. For real treatment.", effects: { medicineBonus: 3, healingBonus: "1d6" }, tags: ["tool", "medical"], genres: ["all"], classes: ["medic", "healer"], value: 50 },
  { id: "navigation_charts", name: "Navigation Charts", category: "Tool", subcategory: "Document", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Detailed maps of known regions. Essential for long journeys.", effects: { navigationBonus: 2 }, tags: ["document", "navigation"], genres: ["all"], classes: ["hunter", "pilot", "explorer"], value: 10 },
  { id: "rope_50ft", name: "Rope (50ft)", category: "Utility", subcategory: "Gear", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Hempen rope. Solves more problems than expected.", effects: {}, tags: ["utility", "climbing"], genres: ["all"], classes: ["all"], value: 1 },
  { id: "torch", name: "Torch", category: "Utility", subcategory: "Light", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 5, desc: "Wooden stick, oiled cloth. An hour of light.", effects: { lightRadius: "20ft", duration: "1 hour" }, tags: ["light", "fire"], genres: ["Fantasy", "Horror", "Mythology & Legend"], classes: ["all"], value: 0.01 },
  { id: "lantern", name: "Hooded Lantern", category: "Utility", subcategory: "Light", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Better than a torch. Can be hooded for stealth movement.", effects: { lightRadius: "30ft" }, tags: ["light", "utility"], genres: ["Fantasy", "Horror", "Gothic Romance", "Western"], classes: ["all"], value: 5 },
  { id: "flashlight", name: "Flashlight", category: "Utility", subcategory: "Light", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Battery-powered. Works in rain. Doesn't set things on fire.", effects: { lightRadius: "60ft", battery: "8 hours" }, tags: ["light", "tech"], genres: ["Military & War", "Horror", "Post-Apocalyptic", "Cyberpunk"], classes: ["all"], value: 10 },
  { id: "grappling_hook", name: "Grappling Hook", category: "Utility", subcategory: "Gear", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Folding hook on a strong line. Reach places you shouldn't.", effects: { climbRange: "60ft" }, tags: ["utility", "climbing"], genres: ["all"], classes: ["rogue", "hunter", "warrior"], value: 2 },
  { id: "lockpicks", name: "Lockpicks", category: "Utility", subcategory: "Gear", tier: 1, rarity: "common", size: "micro", bulk: 0, slotCost: 1, stackLimit: 3, desc: "Five picks of varying tension. Three is usually enough.", effects: { lockpickBonus: 1 }, tags: ["utility", "stealth"], genres: ["all"], classes: ["rogue", "criminal"], value: 5 },
  { id: "binoculars", name: "Binoculars", category: "Utility", subcategory: "Gear", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Magnified lenses. See threats before they see you.", effects: { perceptionBonus: 3, range: "extreme" }, tags: ["utility", "perception"], genres: ["Military & War", "Spy & Espionage", "Western", "Survival"], classes: ["hunter", "warrior", "spy"], value: 35 },
  { id: "comm_unit", name: "Comm Unit", category: "Utility", subcategory: "Tech", tier: 2, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Encrypted short-range communication. Range: 5 miles.", effects: { communication: "5 miles", encrypted: true }, tags: ["tech", "communication"], genres: ["Military & War", "Science Fiction", "Cyberpunk", "Spy & Espionage"], classes: ["all"], value: 80 },
  { id: "journal", name: "Journal", category: "Utility", subcategory: "Document", tier: 1, rarity: "common", size: "small", bulk: 1, slotCost: 1, desc: "Blank pages. Everything important gets written down.", effects: { memoryAid: true }, tags: ["document", "utility"], genres: ["all"], classes: ["all"], value: 1 },
  { id: "spellbook", name: "Spellbook", category: "Utility", subcategory: "Document", tier: 1, rarity: "common", size: "medium", bulk: 1, slotCost: 2, desc: "Pages of arcane notation. Stores prepared spells.", effects: { spellStorage: 20 }, tags: ["magical", "document"], genres: ["Fantasy", "Gothic Romance", "Horror"], classes: ["arcanist", "seeker", "catalyst"], value: 50 },
  { id: "tinderbox", name: "Tinderbox", category: "Utility", subcategory: "Gear", tier: 1, rarity: "common", size: "micro", bulk: 0, slotCost: 1, desc: "Flint, steel, and dry tinder. Fire when you need it.", effects: { startFire: true }, tags: ["utility", "fire", "survival"], genres: ["all"], classes: ["all"], value: 0.05 },
  { id: "tent", name: "Shelter Tent", category: "Utility", subcategory: "Camp", tier: 1, rarity: "common", size: "large", bulk: 4, slotCost: 3, desc: "Lightweight field shelter. Keeps rain and wind out.", effects: { shelter: "2 person", restBonus: 1 }, tags: ["camp", "survival"], genres: ["all"], classes: ["all"], value: 2 },
  { id: "bedroll", name: "Bedroll", category: "Utility", subcategory: "Camp", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, desc: "Padded roll. Sleeping on hard ground becomes almost comfortable.", effects: { restBonus: 1 }, tags: ["camp", "survival"], genres: ["all"], classes: ["all"], value: 1 },
  { id: "iron_ore", name: "Iron Ore", category: "Material", subcategory: "Metal", tier: 1, rarity: "common", size: "small", bulk: 2, slotCost: 1, stackLimit: 20, desc: "Unrefined iron. The basis of most metal equipment.", effects: {}, tags: ["crafting", "metal"], genres: ["all"], classes: ["all"], value: 1 },
  { id: "iron_ingot", name: "Iron Ingot", category: "Material", subcategory: "Metal", tier: 1, rarity: "common", size: "small", bulk: 2, slotCost: 1, stackLimit: 20, desc: "Smelted and ready to work. The smith's building block.", effects: {}, tags: ["crafting", "metal", "refined"], genres: ["all"], classes: ["all"], value: 3 },
  { id: "magic_dust", name: "Arcane Dust", category: "Material", subcategory: "Essence", tier: 2, rarity: "uncommon", size: "micro", bulk: 0, slotCost: 1, stackLimit: 20, desc: "Ground from enchanted items. Used in magical crafting.", effects: {}, tags: ["crafting", "magical", "essence"], genres: ["Fantasy", "Gothic Romance", "Supernatural / Paranormal"], classes: ["arcanist", "catalyst", "seeker"], value: 50 },
  { id: "circuit_board", name: "Circuit Board", category: "Material", subcategory: "Tech", tier: 2, rarity: "common", size: "small", bulk: 1, slotCost: 1, stackLimit: 10, desc: "Standard electronics component. Basis of most tech crafting.", effects: {}, tags: ["crafting", "tech"], genres: ["Science Fiction", "Cyberpunk", "Steampunk"], classes: ["engineer", "netrunner"], value: 20 },
  { id: "beast_hide", name: "Beast Hide", category: "Material", subcategory: "Organic", tier: 1, rarity: "common", size: "medium", bulk: 2, slotCost: 2, stackLimit: 5, desc: "Tanned hide from a medium creature. Good for leather armour.", effects: {}, tags: ["crafting", "organic"], genres: ["all"], classes: ["hunter", "shaman"], value: 10 },
  { id: "gold_coin", name: "Gold Coin", category: "Currency", subcategory: "Gold", tier: 1, rarity: "common", size: "micro", bulk: 0, slotCost: 1, stackLimit: 999, desc: "Standard currency. Accepted almost everywhere.", effects: {}, tags: ["currency"], genres: ["Fantasy", "Mythology & Legend", "Pirate / Age of Sail"], classes: ["all"], value: 1 },
  { id: "credits", name: "Credits", category: "Currency", subcategory: "Digital", tier: 1, rarity: "common", size: "micro", bulk: 0, slotCost: 1, stackLimit: 999, desc: "Digital currency. Untraceable until it's traced.", effects: {}, tags: ["currency", "digital"], genres: ["Cyberpunk", "Science Fiction", "Space Opera"], classes: ["all"], value: 1 },
  { id: "rift_shard", name: "Rift Shard", category: "Relic", subcategory: "Relic", tier: 3, rarity: "rare", size: "small", bulk: 1, slotCost: 1, desc: "A fragment of crystallised Rift energy. Pulses with stories untold.", effects: { sparkBonus: 2, cosmicResistance: true }, tags: ["relic", "magical", "rift"], genres: ["all"], classes: ["all"], value: 1000 },
  { id: "nemesis_token", name: "Nemesis Token", category: "Relic", subcategory: "Relic", tier: 4, rarity: "legendary", size: "micro", bulk: 0, slotCost: 1, desc: "A token from your Nemesis. Somehow you feel them through it.", effects: { nemesisTracking: true, darkResonance: true }, tags: ["relic", "nemesis"], genres: ["all"], classes: ["all"], value: 0 },
];
// ============================================================
// STARTER PACKS
// Every player gets the universal pack + their class pack
// + their background pack (items from each background selected)
// + 2 custom item slots assessed by the AI
// ============================================================

export const UNIVERSAL_STARTER_PACK = [
  { itemId: "ration", quantity: 5, note: "Five days of basic sustenance" },
  { itemId: "rope_50ft", quantity: 1, note: "Standard adventuring rope" },
  { itemId: "tinderbox", quantity: 1, note: "Fire when you need it" },
  { itemId: "bedroll", quantity: 1, note: "For resting in the field" },
  { itemId: "journal", quantity: 1, note: "Record your story" },
];

export const UNIVERSAL_BY_GENRE = {
  Fantasy: [
    { itemId: "torch", quantity: 3 },
    { itemId: "healing_potion", quantity: 1 },
  ],
  "Science Fiction": [
    { itemId: "flashlight", quantity: 1 },
    { itemId: "stim_pack", quantity: 2 },
    { itemId: "energy_cell", quantity: 2 },
  ],
  Horror: [
    { itemId: "torch", quantity: 5 },
    { itemId: "antidote", quantity: 1 },
  ],
  Western: [
    { itemId: "bullets_pistol", quantity: 20 },
    { itemId: "bullets_rifle", quantity: 10 },
  ],
  Cyberpunk: [
    { itemId: "flashlight", quantity: 1 },
    { itemId: "energy_cell", quantity: 3 },
    { itemId: "comm_unit", quantity: 1 },
  ],
  "Military & War": [
    { itemId: "comm_unit", quantity: 1 },
    { itemId: "medkit", quantity: 1 },
    { itemId: "flashlight", quantity: 1 },
  ],
  Survival: [
    { itemId: "torch", quantity: 5 },
    { itemId: "antidote", quantity: 2 },
    { itemId: "rope_50ft", quantity: 1 },
  ],
  "Post-Apocalyptic": [
    { itemId: "bullets_pistol", quantity: 15 },
    { itemId: "stim_pack", quantity: 1 },
    { itemId: "flashlight", quantity: 1 },
  ],
  "Noir / Detective": [
    { itemId: "flashlight", quantity: 1 },
    { itemId: "forgery_kit", quantity: 1 },
  ],
  "Pirate / Age of Sail": [
    { itemId: "rope_50ft", quantity: 2 },
    { itemId: "lantern", quantity: 1 },
  ],
  "Gothic Romance": [
    { itemId: "lantern", quantity: 1 },
    { itemId: "healing_potion", quantity: 1 },
  ],
  "Weird West": [
    { itemId: "bullets_pistol", quantity: 20 },
    { itemId: "antidote", quantity: 1 },
  ],
  "Spy & Espionage": [
    { itemId: "comm_unit", quantity: 1 },
    { itemId: "disguise_kit", quantity: 1 },
  ],
};

export const CLASS_STARTER_KITS = {
  warrior: {
    name: "Warrior's Kit",
    desc: "A warrior's standard loadout. Tested, trusted, effective.",
    items: [
      { itemId: "longsword", quantity: 1 },
      { itemId: "steel_shield", quantity: 1 },
      { itemId: "chain_mail", quantity: 1 },
      { itemId: "steel_helmet", quantity: 1 },
      { itemId: "handaxe", quantity: 2 },
      { itemId: "healing_potion", quantity: 2 },
      { itemId: "climbers_kit", quantity: 1 },
    ],
    packSlots: 12,
    quickSlots: 4,
    bulkLimit: 16,
  },
  rogue: {
    name: "Rogue's Kit",
    desc: "Light, quiet, and hidden. A rogue travels prepared for any situation.",
    items: [
      { itemId: "rapier", quantity: 1 },
      { itemId: "dagger", quantity: 3 },
      { itemId: "studded_leather", quantity: 1 },
      { itemId: "thieves_tools", quantity: 1 },
      { itemId: "smoke_bomb", quantity: 3 },
      { itemId: "disguise_kit", quantity: 1 },
      { itemId: "lockpicks", quantity: 3 },
      { itemId: "grappling_hook", quantity: 1 },
    ],
    packSlots: 12,
    quickSlots: 5,
    bulkLimit: 12,
  },
  arcanist: {
    name: "Arcanist's Kit",
    desc: "Books, components, and a dangerous amount of potential energy.",
    items: [
      { itemId: "quarterstaff", quantity: 1 },
      { itemId: "dagger", quantity: 1 },
      { itemId: "robe", quantity: 1 },
      { itemId: "spellbook", quantity: 1 },
      { itemId: "alchemist_kit", quantity: 1 },
      { itemId: "magic_dust", quantity: 5 },
      { itemId: "healing_potion", quantity: 1 },
    ],
    packSlots: 12,
    quickSlots: 3,
    bulkLimit: 10,
  },
  warden: {
    name: "Warden's Kit",
    desc: "Built to protect. Everything in this kit exists to keep others alive.",
    items: [
      { itemId: "longsword", quantity: 1 },
      { itemId: "steel_shield", quantity: 1 },
      { itemId: "plate_armor", quantity: 1 },
      { itemId: "steel_helmet", quantity: 1 },
      { itemId: "healing_potion", quantity: 3 },
      { itemId: "medics_bag", quantity: 1 },
      { itemId: "rope_50ft", quantity: 1 },
    ],
    packSlots: 12,
    quickSlots: 4,
    bulkLimit: 18,
  },
  hunter: {
    name: "Hunter's Kit",
    desc: "Tracker's essentials. Designed for moving fast and striking first.",
    items: [
      { itemId: "shortbow", quantity: 1 },
      { itemId: "arrows", quantity: 20 },
      { itemId: "dagger", quantity: 2 },
      { itemId: "studded_leather", quantity: 1 },
      { itemId: "leather_helm", quantity: 1 },
      { itemId: "navigation_charts", quantity: 1 },
      { itemId: "climbers_kit", quantity: 1 },
      { itemId: "binoculars", quantity: 1 },
    ],
    packSlots: 14,
    quickSlots: 4,
    bulkLimit: 13,
  },
  seeker: {
    name: "Seeker's Kit",
    desc: "Tools for those who peer beyond the veil.",
    items: [
      { itemId: "quarterstaff", quantity: 1 },
      { itemId: "robe", quantity: 1 },
      { itemId: "spellbook", quantity: 1 },
      { itemId: "magic_dust", quantity: 3 },
      { itemId: "healing_potion", quantity: 1 },
      { itemId: "journal", quantity: 2 },
    ],
    packSlots: 12,
    quickSlots: 3,
    bulkLimit: 10,
  },
  speaker: {
    name: "Speaker's Kit",
    desc: "Charm, deception, and enough backup to survive when both fail.",
    items: [
      { itemId: "rapier", quantity: 1 },
      { itemId: "dagger", quantity: 1 },
      { itemId: "studded_leather", quantity: 1 },
      { itemId: "disguise_kit", quantity: 1 },
      { itemId: "forgery_kit", quantity: 1 },
      { itemId: "healing_potion", quantity: 1 },
      { itemId: "smoke_bomb", quantity: 2 },
    ],
    packSlots: 12,
    quickSlots: 4,
    bulkLimit: 11,
  },
  catalyst: {
    name: "Catalyst's Kit",
    desc: "Half laboratory, half arsenal. Always ready to synthesise something useful.",
    items: [
      { itemId: "dagger", quantity: 1 },
      { itemId: "leather_armor", quantity: 1 },
      { itemId: "alchemist_kit", quantity: 1 },
      { itemId: "herbalism_kit", quantity: 1 },
      { itemId: "poison_vial", quantity: 2 },
      { itemId: "healing_potion", quantity: 2 },
      { itemId: "antidote", quantity: 2 },
      { itemId: "magic_dust", quantity: 3 },
    ],
    packSlots: 14,
    quickSlots: 5,
    bulkLimit: 11,
  },
  netrunner: {
    name: "Netrunner's Kit",
    desc: "The battlefield is digital. This kit conquers it.",
    items: [
      { itemId: "sidearm", quantity: 1 },
      { itemId: "bullets_pistol", quantity: 20 },
      { itemId: "tactical_vest", quantity: 1 },
      { itemId: "hacking_rig", quantity: 1 },
      { itemId: "comm_unit", quantity: 1 },
      { itemId: "neural_interface", quantity: 1 },
      { itemId: "energy_cell", quantity: 4 },
      { itemId: "smoke_bomb", quantity: 2 },
    ],
    packSlots: 12,
    quickSlots: 4,
    bulkLimit: 10,
  },
  gunslinger: {
    name: "Gunslinger's Kit",
    desc: "Fast, accurate, and always loaded. The shooter's standard kit.",
    items: [
      { itemId: "revolver", quantity: 1 },
      { itemId: "rifle", quantity: 1 },
      { itemId: "bullets_pistol", quantity: 30 },
      { itemId: "bullets_rifle", quantity: 15 },
      { itemId: "tactical_vest", quantity: 1 },
      { itemId: "leather_helm", quantity: 1 },
      { itemId: "smoke_bomb", quantity: 2 },
      { itemId: "binoculars", quantity: 1 },
    ],
    packSlots: 14,
    quickSlots: 5,
    bulkLimit: 13,
  },
  pilot: {
    name: "Pilot's Kit",
    desc: "For those who fight best when moving at speed.",
    items: [
      { itemId: "sidearm", quantity: 1 },
      { itemId: "bullets_pistol", quantity: 20 },
      { itemId: "tactical_vest", quantity: 1 },
      { itemId: "tactical_helmet", quantity: 1 },
      { itemId: "comm_unit", quantity: 1 },
      { itemId: "repair_kit", quantity: 1 },
      { itemId: "navigation_charts", quantity: 1 },
      { itemId: "flashlight", quantity: 1 },
    ],
    packSlots: 12,
    quickSlots: 4,
    bulkLimit: 12,
  },
  medic: {
    name: "Combat Medic's Kit",
    desc: "Keeping people alive is the mission. This kit makes it possible.",
    items: [
      { itemId: "combat_knife", quantity: 1 },
      { itemId: "sidearm", quantity: 1 },
      { itemId: "bullets_pistol", quantity: 15 },
      { itemId: "tactical_vest", quantity: 1 },
      { itemId: "medics_bag", quantity: 1 },
      { itemId: "medkit", quantity: 2 },
      { itemId: "stim_pack", quantity: 3 },
      { itemId: "antidote", quantity: 2 },
    ],
    packSlots: 14,
    quickSlots: 5,
    bulkLimit: 12,
  },
  monk: {
    name: "Monk's Kit",
    desc: "The body is the weapon. Everything else is discipline.",
    items: [
      { itemId: "quarterstaff", quantity: 1 },
      { itemId: "dagger", quantity: 2 },
      { itemId: "leather_armor", quantity: 1 },
      { itemId: "healing_potion", quantity: 1 },
      { itemId: "rope_50ft", quantity: 1 },
      { itemId: "journal", quantity: 1 },
    ],
    packSlots: 10,
    quickSlots: 3,
    bulkLimit: 10,
  },
  shaman: {
    name: "Shaman's Kit",
    desc: "Nature and spirit in balance. Everything needed to commune and survive.",
    items: [
      { itemId: "quarterstaff", quantity: 1 },
      { itemId: "dagger", quantity: 1 },
      { itemId: "leather_armor", quantity: 1 },
      { itemId: "herbalism_kit", quantity: 1 },
      { itemId: "beast_hide", quantity: 2 },
      { itemId: "healing_potion", quantity: 1 },
      { itemId: "antidote", quantity: 1 },
      { itemId: "rope_50ft", quantity: 1 },
    ],
    packSlots: 12,
    quickSlots: 3,
    bulkLimit: 12,
  },
  engineer: {
    name: "Engineer's Kit",
    desc: "If it's broken, fix it. If it's not broken, improve it.",
    items: [
      { itemId: "combat_knife", quantity: 1 },
      { itemId: "sidearm", quantity: 1 },
      { itemId: "bullets_pistol", quantity: 15 },
      { itemId: "tactical_vest", quantity: 1 },
      { itemId: "repair_kit", quantity: 2 },
      { itemId: "circuit_board", quantity: 3 },
      { itemId: "flashlight", quantity: 1 },
      { itemId: "comm_unit", quantity: 1 },
    ],
    packSlots: 14,
    quickSlots: 4,
    bulkLimit: 13,
  },
  berserker: {
    name: "Berserker's Kit",
    desc: "Heavy weapons and the will to use them. That's the whole plan.",
    items: [
      { itemId: "greatsword", quantity: 1 },
      { itemId: "handaxe", quantity: 2 },
      { itemId: "chain_mail", quantity: 1 },
      { itemId: "leather_helm", quantity: 1 },
      { itemId: "healing_potion", quantity: 2 },
      { itemId: "rope_50ft", quantity: 1 },
    ],
    packSlots: 12,
    quickSlots: 3,
    bulkLimit: 17,
  },
  psionicist: {
    name: "Psionicist's Kit",
    desc: "The mind is the battlefield. Focus determines everything.",
    items: [
      { itemId: "dagger", quantity: 1 },
      { itemId: "robe", quantity: 1 },
      { itemId: "neural_interface", quantity: 1 },
      { itemId: "journal", quantity: 2 },
      { itemId: "healing_potion", quantity: 1 },
      { itemId: "antidote", quantity: 1 },
    ],
    packSlots: 12,
    quickSlots: 3,
    bulkLimit: 10,
  },
};

export const BACKGROUND_STARTER_ITEMS = {
  soldier: [
    { itemId: "combat_fatigues", quantity: 1 },
    { itemId: "medkit", quantity: 1 },
    { itemId: "binoculars", quantity: 1 },
  ],
  criminal: [
    { itemId: "thieves_tools", quantity: 1 },
    { itemId: "lockpicks", quantity: 3 },
    { itemId: "dagger", quantity: 1 },
  ],
  scholar: [
    { itemId: "journal", quantity: 2 },
    { itemId: "navigation_charts", quantity: 1 },
  ],
  noble: [
    { itemId: "journal", quantity: 1 },
    { itemId: "disguise_kit", quantity: 1 },
  ],
  outlander: [
    { itemId: "climbers_kit", quantity: 1 },
    { itemId: "herbalism_kit", quantity: 1 },
    { itemId: "rope_50ft", quantity: 1 },
  ],
  acolyte: [
    { itemId: "healing_potion", quantity: 1 },
    { itemId: "antidote", quantity: 1 },
    { itemId: "journal", quantity: 1 },
  ],
  entertainer: [
    { itemId: "disguise_kit", quantity: 1 },
    { itemId: "smoke_bomb", quantity: 2 },
  ],
  merchant: [
    { itemId: "navigation_charts", quantity: 1 },
    { itemId: "journal", quantity: 1 },
  ],
  hermit: [
    { itemId: "herbalism_kit", quantity: 1 },
    { itemId: "healing_potion", quantity: 1 },
    { itemId: "bedroll", quantity: 1 },
  ],
  spy: [
    { itemId: "disguise_kit", quantity: 1 },
    { itemId: "forgery_kit", quantity: 1 },
    { itemId: "comm_unit", quantity: 1 },
  ],
  street_urchin: [
    { itemId: "thieves_tools", quantity: 1 },
    { itemId: "dagger", quantity: 1 },
    { itemId: "smoke_bomb", quantity: 1 },
  ],
  explorer: [
    { itemId: "navigation_charts", quantity: 1 },
    { itemId: "climbers_kit", quantity: 1 },
    { itemId: "binoculars", quantity: 1 },
  ],
  revolutionary: [
    { itemId: "forgery_kit", quantity: 1 },
    { itemId: "comm_unit", quantity: 1 },
    { itemId: "dagger", quantity: 1 },
  ],
  healer: [
    { itemId: "medics_bag", quantity: 1 },
    { itemId: "herbalism_kit", quantity: 1 },
    { itemId: "antidote", quantity: 2 },
  ],
  pirate: [
    { itemId: "rope_50ft", quantity: 2 },
    { itemId: "grappling_hook", quantity: 1 },
    { itemId: "dagger", quantity: 1 },
  ],
  gladiator: [
    { itemId: "healing_potion", quantity: 2 },
    { itemId: "leather_helm", quantity: 1 },
  ],
  scientist: [
    { itemId: "alchemist_kit", quantity: 1 },
    { itemId: "journal", quantity: 2 },
  ],
  hacker: [
    { itemId: "hacking_rig", quantity: 1 },
    { itemId: "comm_unit", quantity: 1 },
    { itemId: "energy_cell", quantity: 2 },
  ],
  corporate: [
    { itemId: "comm_unit", quantity: 1 },
    { itemId: "disguise_kit", quantity: 1 },
    { itemId: "forgery_kit", quantity: 1 },
  ],
  cultist: [
    { itemId: "journal", quantity: 1 },
    { itemId: "antidote", quantity: 1 },
    { itemId: "dagger", quantity: 1 },
  ],
  pilot_bg: [
    { itemId: "navigation_charts", quantity: 1 },
    { itemId: "comm_unit", quantity: 1 },
    { itemId: "repair_kit", quantity: 1 },
  ],
  nomad: [
    { itemId: "navigation_charts", quantity: 1 },
    { itemId: "bedroll", quantity: 1 },
    { itemId: "binoculars", quantity: 1 },
  ],
  monk_bg: [
    { itemId: "healing_potion", quantity: 1 },
    { itemId: "journal", quantity: 1 },
  ],
  journalist: [
    { itemId: "journal", quantity: 2 },
    { itemId: "comm_unit", quantity: 1 },
    { itemId: "disguise_kit", quantity: 1 },
  ],
  bounty_hunter: [
    { itemId: "binoculars", quantity: 1 },
    { itemId: "rope_50ft", quantity: 1 },
    { itemId: "comm_unit", quantity: 1 },
  ],
};

export function buildStarterPack(characterClass, backgrounds = [], primaryGenre, secondaryGenre) {
  const items = [];
  const seenItems = new Map();

  function addItems(itemList) {
    for (const entry of itemList) {
      if (seenItems.has(entry.itemId)) {
        seenItems.get(entry.itemId).quantity += entry.quantity;
      } else {
        const copy = { ...entry };
        seenItems.set(entry.itemId, copy);
        items.push(copy);
      }
    }
  }

  addItems(UNIVERSAL_STARTER_PACK);

  const genreItems = UNIVERSAL_BY_GENRE[primaryGenre] || [];
  const genre2Items = secondaryGenre ? UNIVERSAL_BY_GENRE[secondaryGenre] || [] : [];
  addItems(genreItems);
  addItems(genre2Items);

  const classKit = CLASS_STARTER_KITS[characterClass];
  if (classKit) addItems(classKit.items);

  for (const bg of backgrounds.slice(0, 3)) {
    const bgItems = BACKGROUND_STARTER_ITEMS[bg] || [];
    addItems(bgItems);
  }

  items.push({
    itemId: "custom_1",
    quantity: 1,
    isCustom: true,
    note: "Custom item slot 1 — tell the Chronicler what you want to carry",
  });
  items.push({
    itemId: "custom_2",
    quantity: 1,
    isCustom: true,
    note: "Custom item slot 2 — tell the Chronicler what you want to carry",
  });

  return {
    items,
    packSlots: classKit?.packSlots ?? 12,
    quickSlots: classKit?.quickSlots ?? 4,
    bulkLimit: classKit?.bulkLimit ?? 12,
  };
}

export function getItemById(id) {
  return ITEMS.find((i) => i.id === id) || null;
}

export function getItemsByCategory(category) {
  return ITEMS.filter((i) => i.category === category);
}

export function getItemsByGenre(genre) {
  return ITEMS.filter((i) => i.genres.includes("all") || i.genres.includes(genre));
}

export function getItemsByClass(classId) {
  return ITEMS.filter((i) => i.classes.includes("all") || i.classes.includes(classId));
}

export function formatInventoryForAudio(inventoryItems) {
  if (!inventoryItems || inventoryItems.length === 0) {
    return "Your pack is empty, traveller. You carry nothing but your will.";
  }

  const equipped = inventoryItems.filter((i) => i.is_equipped);
  const pack = inventoryItems.filter((i) => !i.is_equipped && !i.isCustom);
  const custom = inventoryItems.filter((i) => i.isCustom && !i.is_equipped);

  const lines = [];

  if (equipped.length > 0) {
    lines.push("Currently equipped:");
    for (const item of equipped) {
      lines.push(`${item.item_name}${item.quantity > 1 ? `, quantity ${item.quantity}` : ""}.`);
    }
  }

  if (pack.length > 0) {
    lines.push("In your pack:");
    for (const item of pack) {
      lines.push(`${item.item_name}${item.quantity > 1 ? `, times ${item.quantity}` : ""}.`);
    }
  }

  if (custom.length > 0) {
    lines.push("Special items:");
    for (const item of custom) {
      if (item.item_name && item.item_name !== "custom_1" && item.item_name !== "custom_2") {
        lines.push(`${item.item_name}.`);
      }
    }
  }

  return lines.join(" ");
}

export function formatInventoryForText(inventoryItems) {
  if (!inventoryItems || inventoryItems.length === 0) return "Empty";

  const categories = {};
  for (const item of inventoryItems) {
    const cat = item.is_equipped ? "Equipped" : item.category || "Pack";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(`${item.item_name}${item.quantity > 1 ? ` ×${item.quantity}` : ""}`);
  }

  return Object.entries(categories)
    .map(([cat, list]) => `**${cat}:** ${list.join(", ")}`)
    .join("\n");
}

export const CUSTOM_ITEM_ASSESSMENT_PROMPT = `
You are assessing a custom item request for a Genesis: Echoes of Creation player.

RULES FOR APPROVAL:
1. The item must be plausible in the campaign's genre and time period
2. The item must not grant an unfair mechanical advantage over the challenge level
3. The item must not trivialise the campaign (e.g. infinite wishes, god-mode powers)
4. The item should have a narrative purpose and feel earned
5. The item should have realistic limitations

RULES FOR REJECTION:
- Any item that bypasses core game mechanics entirely (e.g. genie with unlimited wishes)
- Any item that is vastly more powerful than the character's current level warrants
- Any item that is thematically impossible for the world (e.g. a smartphone in ancient mythology)
- Any weapon of mass destruction
- Any item that removes all tension from the story

If approved: state the item name, describe it in 1-2 sentences, and define ONE limitation it has.
If rejected: explain clearly and suggest a modified version that could work.

Respond in JSON format:
{
  "approved": true/false,
  "item_name": "...",
  "description": "...",
  "limitation": "...",
  "rejection_reason": "...",
  "suggested_alternative": "..."
}
`;
