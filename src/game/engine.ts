import type { BaseStats, DerivedStats, Item, SlotId, StatId, StatDef } from './types';
import { SETS } from './items';

export const MAX_LEVEL = 500;

export const STAT_DEFS: StatDef[] = [
  { id: 'str', name: 'Сила',          icon: '💪', desc: 'Увеличивает физический урон (+2 к урону)', color: '#ef4444' },
  { id: 'agi', name: 'Ловкость',      icon: '🌀', desc: 'Увеличивает уворот и скорость атаки', color: '#38bdf8' },
  { id: 'vit', name: 'Живучесть',     icon: '❤️', desc: 'Увеличивает максимальное здоровье (+12 HP)', color: '#22c55e' },
  { id: 'int', name: 'Интеллект',     icon: '🧠', desc: 'Увеличивает силу заклинаний и скиллов', color: '#c084fc' },
  { id: 'end', name: 'Выносливость', icon: '🛡️', desc: 'Увеличивает броню и регенерацию HP', color: '#f59e0b' },
  { id: 'luk', name: 'Удача',         icon: '🍀', desc: 'Шанс крита и шанс выпадения лучшего лута', color: '#facc15' },
  { id: 'wis', name: 'Мудрость',      icon: '📖', desc: 'Максимальная мана (+8) и регенерация маны', color: '#818cf8' },
  { id: 'per', name: 'Восприятие',   icon: '👁️', desc: 'Множитель крита и критический урон', color: '#f43f5e' },
  { id: 'cha', name: 'Харизма',       icon: '✨', desc: 'Увеличивает количество получаемого золота', color: '#fbbf24' },
  { id: 'wil', name: 'Воля',          icon: '🔥', desc: 'Усиливает маневренность и стойкость', color: '#fb923c' },
];

export function xpForLevel(level: number): number {
  const l = isNaN(level) || level < 1 ? 1 : level;
  return Math.floor(60 * Math.pow(l, 1.6) + l * 20);
}

/**
 * Format numbers with thousand space separators (e.g. 221 212 or 2 122).
 */
export function fmt(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return '0';
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'divine'];

export function rarityAtLeast(rarity: string, minRarity: string): boolean {
  const rIdx = RARITY_ORDER.indexOf(rarity);
  const minIdx = RARITY_ORDER.indexOf(minRarity);
  if (rIdx === -1) return false;
  if (minIdx === -1) return true;
  return rIdx >= minIdx;
}

export function computeDerived(
  level: number,
  stats: BaseStats,
  equipment: Partial<Record<SlotId, Item>>,
  talents: Record<string, number>,
): DerivedStats {
  let iDmg = 0, iArmor = 0, iHp = 0;
  const iStats: Partial<Record<StatId, number>> = {};
  let iCrit = 0, iSpeed = 0, iGold = 0, iXp = 0;

  const setPieceCounts: Record<string, number> = {};

  if (equipment && typeof equipment === 'object') {
    Object.values(equipment).forEach(it => {
      if (!it) return;
      if (it.setId) setPieceCounts[it.setId] = (setPieceCounts[it.setId] ?? 0) + 1;
      if (it.base) {
        iDmg += it.base.dmg ?? 0;
        iArmor += it.base.armor ?? 0;
        iHp += it.base.hp ?? 0;
      }
      if (Array.isArray(it.affixes)) {
        it.affixes.forEach(a => {
          if (!a) return;
          if (a.stat === 'dmg') iDmg += a.value ?? 0;
          else if (a.stat === 'armor') iArmor += a.value ?? 0;
          else if (a.stat === 'hp') iHp += a.value ?? 0;
          else if (a.stat === 'crit') iCrit += a.value ?? 0;
          else if (a.stat === 'speed') iSpeed += a.value ?? 0;
          else if (a.stat === 'gold') iGold += a.value ?? 0;
          else if (a.stat === 'xp') iXp += a.value ?? 0;
          else if (a.stat) iStats[a.stat] = (iStats[a.stat] ?? 0) + (a.value ?? 0);
        });
      }
    });
  }

  let setDmgPct = 0;
  let setArmorPct = 0;
  let setHpPct = 0;
  let setCritPct = 0;
  let setXpPct = 0;
  let setGoldPct = 0;

  Object.entries(setPieceCounts).forEach(([setId, count]) => {
    const setDef = SETS.find(s => s.id === setId);
    if (!setDef) return;
    setDef.bonuses.forEach(b => {
      if (count >= b.reqPieces) {
        if (b.dmgBonus) setDmgPct += b.dmgBonus;
        if (b.armorBonus) setArmorPct += b.armorBonus;
        if (b.hpBonus) setHpPct += b.hpBonus;
        if (b.critBonus) setCritPct += b.critBonus;
        if (b.xpBonus) setXpPct += b.xpBonus;
        if (b.goldBonus) setGoldPct += b.goldBonus;
      }
    });
  });

  const safeStats = stats || { str: 5, agi: 5, vit: 5, int: 5, end: 5, luk: 5, wis: 5, per: 5, cha: 5, wil: 5 };
  const safeTalents = talents || {};

  const S = (id: StatId) => (safeStats[id] ?? 5) + (iStats[id] ?? 0) + (safeTalents['w_juggernaut'] ?? 0) * 5;
  const str = S('str'), agi = S('agi'), vit = S('vit'), int = S('int'), end = S('end');
  const luk = S('luk') + (safeTalents['t_luck'] ?? 0) * 3, wis = S('wis') + (safeTalents['m_archon'] ?? 0) * 5;
  const per = S('per'), cha = S('cha'), wil = S('wil');
  const intTotal = int + (safeTalents['m_archon'] ?? 0) * 5;

  const t = (id: string) => safeTalents[id] ?? 0;

  const hpMult = 1 + t('w_hp') * 0.08 + setHpPct / 100;
  const dmgMult = 1 + t('w_dmg') * 0.06 + t('m_glass') * 0.10 + setDmgPct / 100;
  const lvl = isNaN(level) || level < 1 ? 1 : level;
  const baseDmg = 8 + lvl * 1.6 + str * 2 + iDmg;

  const safeVal = (v: number, fallback: number) => isNaN(v) || v <= 0 ? fallback : v;

  return {
    maxHp: safeVal(Math.floor((115 + lvl * 10 + vit * 12 + iHp) * hpMult), 150),
    maxMana: safeVal(Math.floor((50 + lvl * 4 + wis * 8) * (1 + t('m_mana') * 0.10)), 60),
    dmgMin: safeVal(Math.floor(baseDmg * 0.85 * dmgMult), 10),
    dmgMax: safeVal(Math.floor(baseDmg * 1.15 * dmgMult), 15),
    skillPower: safeVal(Math.floor((4 + lvl + intTotal * 2) * (1 + t('m_int') * 0.06 + wil * 0.01)), 10),
    armor: safeVal(Math.floor((end * 1.5 + iArmor) * (1 + t('w_armor') * 0.10 + setArmorPct / 100)), 5),
    critChance: Math.min(75, safeVal(5 + luk * 0.15 + per * 0.12 + iCrit + t('w_crit') * 2 + setCritPct, 5)),
    critMult: safeVal(1.8 + per * 0.004, 1.8),
    attackSpeed: Math.min(3.5, safeVal((1 + agi * 0.004 + iSpeed / 100) * (1 + t('w_rage') * 0.04), 1.0)),
    dodge: Math.min(40, safeVal(agi * 0.06 + t('t_dodge') * 1.5, 0)),
    goldBonus: safeVal(cha * 1 + iGold + t('t_gold') * 10 + setGoldPct, 0),
    xpBonus: safeVal(iXp + t('t_xp') * 8 + setXpPct, 0),
    dropBonus: safeVal(luk * 0.8 + t('t_drop') * 8, 0),
    lifesteal: safeVal(t('w_lifesteal') * 1, 0),
    cdReduction: Math.min(50, safeVal(t('m_cd') * 4, 0)),
    bossDmg: safeVal(t('w_execute') * 15, 0),
    regen: safeVal((2.0 + end * 0.15) * (1 + t('t_second') * 0.5), 2.0),
    manaRegen: safeVal((1 + wis * 0.15) * (1 + t('m_regen') * 0.15), 1.0),
  };
}

export function monsterStats(level: number, hpMult: number, dmgMult: number) {
  const lvl = isNaN(level) || level < 1 ? 1 : level;
  const hp = Math.floor((45 + Math.pow(lvl, 1.72) * 9) * (hpMult || 1.0));
  const dmg = Math.floor((4 + Math.pow(lvl, 1.45) * 1.6) * (dmgMult || 1.0));
  return { hp: Math.max(20, hp), dmg: Math.max(2, dmg) };
}

export function monsterReward(level: number, xpMult: number, goldMult: number) {
  const lvl = isNaN(level) || level < 1 ? 1 : level;
  return {
    xp: Math.floor((12 + Math.pow(lvl, 1.55) * 5) * (xpMult || 1.0)),
    gold: Math.floor((6 + Math.pow(lvl, 1.5) * 2.2) * (goldMult || 1.0)),
  };
}

export function mitigate(raw: number, armor: number): number {
  const r = isNaN(raw) || raw < 1 ? 1 : raw;
  const a = isNaN(armor) || armor < 0 ? 0 : armor;
  const red = a / (a + 80 + r * 0.15);
  return Math.max(1, Math.round(r * (1 - red)));
}
