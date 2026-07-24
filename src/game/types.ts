// ===================== CORE TYPES =====================

export type StatId =
  | 'str' | 'agi' | 'vit' | 'int' | 'end'
  | 'luk' | 'wis' | 'per' | 'cha' | 'wil';

export interface StatDef {
  id: StatId;
  name: string;
  icon: string;
  desc: string;
  color: string;
}

export type BaseStats = Record<StatId, number>;

export type SlotId =
  | 'weapon' | 'helmet' | 'armor' | 'gloves' | 'kneepads' | 'shoulders'
  | 'boots' | 'pants' | 'ring1' | 'ring2' | 'earring1' | 'earring2'
  | 'amulet' | 'cloak' | 'banner';

export type SlotKind =
  | 'weapon' | 'helmet' | 'armor' | 'gloves' | 'kneepads' | 'shoulders'
  | 'boots' | 'pants' | 'ring' | 'earring' | 'amulet' | 'cloak' | 'banner';

export type RarityId =
  | 'common' | 'uncommon' | 'rare' | 'epic'
  | 'legendary' | 'mythic' | 'divine';

export interface RarityDef {
  id: RarityId;
  name: string;
  color: string;
  glow: string;
  mult: number;       // stat multiplier
  affixes: number;    // number of affixes
  weight: number;     // drop weight
}

export interface ItemAffix {
  stat: StatId | 'dmg' | 'hp' | 'armor' | 'crit' | 'speed' | 'gold' | 'xp';
  value: number;
}

export interface Item {
  id: string;
  name: string;
  slot: SlotKind;
  rarity: RarityId;
  ilvl: number;
  icon: string;
  base: { dmg?: number; armor?: number; hp?: number };
  affixes: ItemAffix[];
  sellPrice: number;
  score: number; // item power score
  setId?: string; // Set Item identifier
}

export interface SetBonus {
  reqPieces: number;
  desc: string;
  dmgBonus?: number;
  armorBonus?: number;
  hpBonus?: number;
  critBonus?: number;
  xpBonus?: number;
  goldBonus?: number;
}

export interface SetDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  pieces: string[]; // piece names
  bonuses: SetBonus[];
}

export interface WorldEventChoice {
  id: string;
  text: string;
  costHpPct?: number;
  costGold?: number;
  rewardText: string;
  effect: 'buff_dmg' | 'buff_gold' | 'buff_xp' | 'heal' | 'item' | 'gold';
  effectValue: number;
}

export interface WorldEvent {
  id: string;
  title: string;
  icon: string;
  desc: string;
  choices: WorldEventChoice[];
  expiresAt: number;
}

export interface ActiveBuff {
  id: string;
  name: string;
  icon: string;
  desc: string;
  stat: 'dmg' | 'gold' | 'xp' | 'armor' | 'hp';
  value: number; // percentage or flat
  expiresAt: number;
}

// ===================== MONSTERS / ZONES =====================

export interface MonsterDef {
  id: string;
  name: string;
  icon: string;
  family: string;
  tier: number;         // power tier inside zone
  isBoss?: boolean;
  isMiniBoss?: boolean;
  hpMult: number;
  dmgMult: number;
  xpMult: number;
  goldMult: number;
  color: string;
}

export interface ActiveMonster {
  def: MonsterDef;
  hp: number;
  maxHp: number;
  level: number;
  dmg: number;
  xp: number;
  gold: number;
  attackTimer: number;
  dotTimer: number;
  dots: { id: string; dmg: number; leftSec: number; intervalSec: number; elapsed: number }[];
}

export interface ZoneTheme {
  skyTop: string;
  skyBottom: string;
  ground: string;
  groundDark: string;
  tiles: string[];
  particles: string;
  fog: string;
}

export interface ZoneDef {
  id: string;
  name: string;
  icon: string;
  minLevel: number;
  stages: number;
  killsPerStage: number;
  monsterFamilies: string[];
  theme: ZoneTheme;
  bossName: string;
  bossIcon: string;
  miniBossName: string;
  miniBossIcon: string;
  desc: string;
  hidden?: boolean;
}

export interface DungeonRun {
  dungeonId: string;
  wave: number;       // current wave
  totalTimeSec: number;
  timeLeftSec: number;
}

export interface DungeonDef {
  id: string;
  name: string;
  icon: string;
  minLevel: number;
  waves: number;
  familyPool: string[];
  bossName: string;
  bossIcon: string;
  lootBonus: number;   // rarity bonus
  xpMult: number;
  goldMult: number;
  desc: string;
}

// ===================== SKILLS / TALENTS =====================

export interface SkillDef {
  id: string;
  name: string;
  icon: string;
  unlockLevel: number;
  maxRank: number;
  manaCost: number;
  cooldown: number;
  desc: string;
  color: string;
}

export interface TalentDef {
  id: string;
  name: string;
  icon: string;
  branch: 'warrior' | 'mage' | 'wanderer';
  row: number;         // 0..4
  maxRank: number;
  desc: string;
  per: (rank: number) => string;
}

export interface BranchDef {
  id: 'warrior' | 'mage' | 'wanderer';
  name: string;
  icon: string;
  color: string;
}

// ===================== QUESTS =====================

export interface QuestDef {
  id: string;
  name: string;
  desc: string;
  type: 'kills' | 'bosses' | 'level' | 'gold' | 'dungeons' | 'stage';
  count: number;
  reward: {
    gold?: number;
    xp?: number;
    statPoints?: number;
    talentPoints?: number;
    skillPoints?: number;
    itemRarity?: RarityId;
  };
}

export interface QuestState {
  progress: number;
  done: boolean;
  claimed: boolean;
}

// ===================== DERIVED STATS =====================

export interface DerivedStats {
  maxHp: number;
  maxMana: number;
  playerAtk: number;
  playerDmgMin: number;
  playerDmgMax: number;
  armor: number;
  critChance: number;
  critMult: number;
  dodgeChance: number;
  regen: number;
  manaRegen: number;
  goldBonusPct: number;
  xpBonusPct: number;
  dropRatePct: number;
  lifestealPct: number;
  skillPower: number;
  attackSpeed: number;
}

// ===================== LOG & FX =====================

export type FxType =
  | 'playerHit' | 'crit' | 'monsterHit' | 'dodge'
  | 'heal' | 'skill' | 'death' | 'levelup'
  | 'loot' | 'bossSpawn' | 'quest';

export interface FxEvent {
  id: number;
  type: FxType;
  value?: number;
  text?: string;
  color?: string;
  skillId?: string;
  skillFx?: string;
}

export interface LogEntry {
  id: number;
  text: string;
  color: string;
  time: number;
}

// ===================== LABYRINTH TYPES =====================

export type LabyrinthRoomType = 'start' | 'empty' | 'combat' | 'trap' | 'chest' | 'shrine' | 'boss';

export interface LabyrinthRoom {
  x: number;
  y: number;
  type: LabyrinthRoomType;
  visited: boolean;
  cleared: boolean;
  title: string;
  desc: string;
  icon: string;
}

export interface LabyrinthState {
  size: number;
  currentX: number;
  currentY: number;
  rooms: Record<string, LabyrinthRoom>;
  clearedRoomsCount: number;
  totalRooms: number;
  completed: boolean;
}

// ===================== TOWER OF TRIALS TYPES =====================

export interface TowerModifier {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
}

export interface TowerFloorState {
  floor: number;
  maxFloorReached: number;
  currentModifier: TowerModifier | null;
  active: boolean;
}

// ===================== RUNE SOCKETING TYPES =====================

export interface RuneDef {
  id: string;
  name: string;
  icon: string;
  rarity: RarityId;
  bonusDesc: string;
  stat: StatId | 'dmg' | 'armor' | 'hp' | 'crit';
  value: number;
}

export interface RuneWordDef {
  id: string;
  name: string;
  icon: string;
  runes: string[]; // rune IDs required
  effectDesc: string;
  bonusDmgPct?: number;
  bonusArmorPct?: number;
  bonusCritPct?: number;
}

// Extend Item with sockets & inserted runes
export interface SocketedItem extends Item {
  sockets?: number;
  insertedRunes?: string[]; // array of rune IDs
  activeRuneWord?: RuneWordDef;
}

// ===================== TREASURE MAP TYPES =====================

export interface TreasureMapVault {
  id: string;
  title: string;
  difficulty: number;
  chestLocked: boolean;
  pinsCount: number;
  solvedPins: number;
  rewards: {
    gold: number;
    xp: number;
    runes: string[];
    itemRarity: RarityId;
  };
}
