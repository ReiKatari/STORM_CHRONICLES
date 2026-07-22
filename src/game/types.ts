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

export interface ZoneDef {
  id: string;
  name: string;
  icon: string;
  minLevel: number;      // player level to enter
  stages: number;        // stages (stage N/2 miniboss, stage N boss)
  killsPerStage: number;
  monsterFamilies: string[];
  // visual theme — tiles change per zone
  theme: {
    skyTop: string;
    skyBottom: string;
    ground: string;
    groundDark: string;
    tiles: string[];     // decorative ground tiles (emoji)
    particles: string;   // ambient particle color
    fog: string;
  };
  hidden?: boolean;
  unlockHint?: string;
  bossName: string;
  bossIcon: string;
  miniBossName: string;
  miniBossIcon: string;
  desc: string;
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
  desc: string;
  unlockLevel: number;
  maxRank: number;
  manaCost: number;
  cooldown: number;   // seconds
  kind: 'damage' | 'heal' | 'buff' | 'dot';
  basePower: number;  // % of main dmg or flat for heal
  scaling: 'str' | 'int' | 'wil' | 'wis';
  color: string;
  fx: 'slash' | 'fire' | 'ice' | 'lightning' | 'heal' | 'poison' | 'meteor' | 'shield' | 'blood' | 'summon';
}

export interface TalentDef {
  id: string;
  branch: 'warrior' | 'mage' | 'wanderer';
  name: string;
  icon: string;
  desc: string;
  maxRank: number;
  row: number;         // 0..4, requires row*2 points in branch
  per: (rank: number) => string;
}

// ===================== QUESTS =====================

export type QuestKind =
  | 'kill'        // kill X of family (any zone)
  | 'killAny'     // kill X any monsters
  | 'boss'        // kill X bosses
  | 'level'       // reach level X
  | 'dungeon'     // clear X dungeons
  | 'loot'        // loot X items of rarity+
  | 'gold'        // earn X gold total
  | 'secret';     // discover secret zone

export interface QuestDef {
  id: string;
  name: string;
  desc: string;
  kind: QuestKind;
  target: string;      // family id / rarity id / zone id / ''
  count: number;
  reward: {
    gold: number;
    xp: number;
    statPoints?: number;
    talentPoints?: number;
    skillPoints?: number;
    itemRarity?: RarityId;
  };
}

export interface QuestState {
  id: string;
  progress: number;
  done: boolean;      // ready to claim
  claimed: boolean;
}

// ===================== SAVE STATE =====================

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
  dots: { dmg: number; ticks: number }[];
}

export interface DungeonRun {
  dungeonId: string;
  wave: number;
  active: boolean;
}

export interface FxEvent {
  id: number;
  type: 'playerHit' | 'monsterHit' | 'crit' | 'skill' | 'death' | 'levelup' | 'loot' | 'heal' | 'dodge' | 'bossSpawn' | 'quest';
  text?: string;
  color?: string;
  skillFx?: string;
  value?: number;
}

export interface LogEntry {
  id: number;
  text: string;
  color: string;
  time: number;
}
