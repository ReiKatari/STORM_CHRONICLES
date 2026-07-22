import type { BaseStats, Item, RarityId, SlotId, SlotKind, StatId } from './types';

// ===================== 10 STATS =====================
export const STAT_DEFS: { id: StatId; name: string; icon: string; desc: string; color: string }[] = [
  { id: 'str', name: 'Сила', icon: '💪', desc: '+2 урона за очко', color: '#f87171' },
  { id: 'agi', name: 'Ловкость', icon: '🌀', desc: '+0.4% скорость атаки, +0.06% уклонение', color: '#4ade80' },
  { id: 'vit', name: 'Живучесть', icon: '❤️', desc: '+12 HP за очко', color: '#fb7185' },
  { id: 'int', name: 'Интеллект', icon: '🧠', desc: '+2 урона скиллам за очко', color: '#60a5fa' },
  { id: 'end', name: 'Выносливость', icon: '🛡️', desc: '+1.5 брони за очко', color: '#fbbf24' },
  { id: 'luk', name: 'Удача', icon: '🍀', desc: '+0.15% шанс крита, улучшает дроп', color: '#a3e635' },
  { id: 'wis', name: 'Мудрость', icon: '📖', desc: '+8 маны, +реген маны', color: '#38bdf8' },
  { id: 'per', name: 'Восприятие', icon: '👁️', desc: '+0.12% шанс крита, +точность', color: '#c084fc' },
  { id: 'cha', name: 'Харизма', icon: '✨', desc: '+1% золота за очко', color: '#f0abfc' },
  { id: 'wil', name: 'Воля', icon: '🔥', desc: '+1% урона скиллов, +сопротивление', color: '#fb923c' },
];

export const SLOT_ORDER: { id: SlotId; kind: SlotKind; name: string; icon: string }[] = [
  { id: 'weapon', kind: 'weapon', name: 'Оружие', icon: '⚔️' },
  { id: 'helmet', kind: 'helmet', name: 'Шлем', icon: '🪖' },
  { id: 'armor', kind: 'armor', name: 'Броня', icon: '🛡️' },
  { id: 'shoulders', kind: 'shoulders', name: 'Наплечники', icon: '🎽' },
  { id: 'gloves', kind: 'gloves', name: 'Перчатки', icon: '🧤' },
  { id: 'kneepads', kind: 'kneepads', name: 'Наколенники', icon: '🦵' },
  { id: 'pants', kind: 'pants', name: 'Штаны', icon: '👖' },
  { id: 'boots', kind: 'boots', name: 'Сапоги', icon: '🥾' },
  { id: 'cloak', kind: 'cloak', name: 'Плащ', icon: '🧣' },
  { id: 'amulet', kind: 'amulet', name: 'Амулет', icon: '🔮' },
  { id: 'ring1', kind: 'ring', name: 'Кольцо I', icon: '💍' },
  { id: 'ring2', kind: 'ring', name: 'Кольцо II', icon: '💍' },
  { id: 'earring1', kind: 'earring', name: 'Серьга I', icon: '📿' },
  { id: 'earring2', kind: 'earring', name: 'Серьга II', icon: '📿' },
  { id: 'banner', kind: 'banner', name: 'Знамя', icon: '🚩' },
];

// ===================== XP CURVE (hundreds of levels) =====================
export const MAX_LEVEL = 500;
export function xpForLevel(level: number): number {
  return Math.floor(80 * Math.pow(level, 1.65) + 40 * level);
}

// ===================== DERIVED STATS =====================
export interface DerivedStats {
  maxHp: number;
  maxMana: number;
  dmgMin: number;
  dmgMax: number;
  skillPower: number;
  armor: number;
  critChance: number;   // %
  critMult: number;     // x
  attackSpeed: number;  // attacks per second
  dodge: number;        // %
  goldBonus: number;    // %
  xpBonus: number;      // %
  dropBonus: number;    // %
  lifesteal: number;    // %
  cdReduction: number;  // %
  bossDmg: number;      // %
  regen: number;        // hp per tick
  manaRegen: number;    // mana per tick
}

export function computeDerived(
  level: number,
  stats: BaseStats,
  equipment: Partial<Record<SlotId, Item>>,
  talents: Record<string, number>,
): DerivedStats {
  // aggregate item bonuses
  let iDmg = 0, iArmor = 0, iHp = 0;
  const iStats: Partial<Record<StatId, number>> = {};
  let iCrit = 0, iSpeed = 0, iGold = 0, iXp = 0;
  Object.values(equipment).forEach(it => {
    if (!it) return;
    iDmg += it.base.dmg ?? 0;
    iArmor += it.base.armor ?? 0;
    iHp += it.base.hp ?? 0;
    it.affixes.forEach(a => {
      if (a.stat === 'dmg') iDmg += a.value;
      else if (a.stat === 'armor') iArmor += a.value;
      else if (a.stat === 'hp') iHp += a.value;
      else if (a.stat === 'crit') iCrit += a.value;
      else if (a.stat === 'speed') iSpeed += a.value;
      else if (a.stat === 'gold') iGold += a.value;
      else if (a.stat === 'xp') iXp += a.value;
      else iStats[a.stat] = (iStats[a.stat] ?? 0) + a.value;
    });
  });

  const S = (id: StatId) => stats[id] + (iStats[id] ?? 0) + (talents['w_juggernaut'] ?? 0) * 5;
  const str = S('str'), agi = S('agi'), vit = S('vit'), int = S('int'), end = S('end');
  const luk = S('luk') + (talents['t_luck'] ?? 0) * 3, wis = S('wis') + (talents['m_archon'] ?? 0) * 5;
  const per = S('per'), cha = S('cha'), wil = S('wil');
  const intTotal = int + (talents['m_archon'] ?? 0) * 5;

  const t = (id: string) => talents[id] ?? 0;

  const hpMult = 1 + t('w_hp') * 0.08 - t('m_glass') * 0.03;
  const dmgMult = 1 + t('w_dmg') * 0.06 + t('m_glass') * 0.10;
  const baseDmg = 8 + level * 1.6 + str * 2 + iDmg;

  return {
    maxHp: Math.floor((115 + level * 10 + vit * 12 + iHp) * hpMult),
    maxMana: Math.floor((50 + level * 4 + wis * 8) * (1 + t('m_mana') * 0.10)),
    dmgMin: Math.floor(baseDmg * 0.85 * dmgMult),
    dmgMax: Math.floor(baseDmg * 1.15 * dmgMult),
    skillPower: Math.floor((4 + level + intTotal * 2) * (1 + t('m_int') * 0.06 + wil * 0.01)),
    armor: Math.floor((end * 1.5 + iArmor) * (1 + t('w_armor') * 0.10)),
    critChance: Math.min(65, 5 + luk * 0.15 + per * 0.12 + iCrit + t('w_crit') * 2),
    critMult: 1.8 + per * 0.004,
    attackSpeed: Math.min(3.5, (1 + agi * 0.004 + iSpeed / 100) * (1 + t('w_rage') * 0.04)),
    dodge: Math.min(40, agi * 0.06 + t('t_dodge') * 1.5),
    goldBonus: cha * 1 + iGold + t('t_gold') * 10,
    xpBonus: iXp + t('t_xp') * 8,
    dropBonus: luk * 0.8 + t('t_drop') * 8,
    lifesteal: t('w_lifesteal') * 1,
    cdReduction: Math.min(50, t('m_cd') * 4),
    bossDmg: t('w_execute') * 15,
    regen: (2.0 + end * 0.15) * (1 + t('t_second') * 0.5),
    manaRegen: (1 + wis * 0.15) * (1 + t('m_regen') * 0.15),
  };
}

// ===================== MONSTER SCALING =====================
export function monsterStats(level: number, hpMult: number, dmgMult: number) {
  const hp = Math.floor((45 + Math.pow(level, 1.72) * 9) * hpMult);
  const dmg = Math.floor((4 + Math.pow(level, 1.45) * 1.6) * dmgMult);
  return { hp, dmg };
}

export function monsterReward(level: number, xpMult: number, goldMult: number) {
  return {
    xp: Math.floor((12 + Math.pow(level, 1.55) * 5) * xpMult),
    gold: Math.floor((6 + Math.pow(level, 1.5) * 2.2) * goldMult),
  };
}

// damage mitigation from armor
export function mitigate(raw: number, armor: number): number {
  const red = armor / (armor + 80 + raw * 0.15);
  return Math.max(1, Math.round(raw * (1 - Math.min(0.75, red))));
}

export const RARITY_ORDER: RarityId[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'divine'];
export function rarityAtLeast(r: RarityId, min: RarityId): boolean {
  return RARITY_ORDER.indexOf(r) >= RARITY_ORDER.indexOf(min);
}

export const fmt = (n: number): string => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toLocaleString('ru-RU');
};
