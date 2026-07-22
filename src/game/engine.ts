import type { BaseStats, DerivedStats, Item, SlotId, StatId } from './types';
import { SETS } from './items';

export const MAX_LEVEL = 500;

export function xpForLevel(level: number): number {
  return Math.floor(60 * Math.pow(level, 1.6) + level * 20);
}

export function fmt(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return Math.floor(num).toLocaleString('ru-RU');
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
  
  // set bonuses accumulation
  const setPieceCounts: Record<string, number> = {};

  Object.values(equipment).forEach(it => {
    if (!it) return;
    if (it.setId) setPieceCounts[it.setId] = (setPieceCounts[it.setId] ?? 0) + 1;
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

  const S = (id: StatId) => stats[id] + (iStats[id] ?? 0) + (talents['w_juggernaut'] ?? 0) * 5;
  const str = S('str'), agi = S('agi'), vit = S('vit'), int = S('int'), end = S('end');
  const luk = S('luk') + (talents['t_luck'] ?? 0) * 3, wis = S('wis') + (talents['m_archon'] ?? 0) * 5;
  const per = S('per'), cha = S('cha'), wil = S('wil');
  const intTotal = int + (talents['m_archon'] ?? 0) * 5;

  const t = (id: string) => talents[id] ?? 0;

  const hpMult = 1 + t('w_hp') * 0.08 - t('m_glass') * 0.03 + setHpPct / 100;
  const dmgMult = 1 + t('w_dmg') * 0.06 + t('m_glass') * 0.10 + setDmgPct / 100;
  const baseDmg = 8 + level * 1.6 + str * 2 + iDmg;

  return {
    maxHp: Math.floor((115 + level * 10 + vit * 12 + iHp) * hpMult),
    maxMana: Math.floor((50 + level * 4 + wis * 8) * (1 + t('m_mana') * 0.10)),
    dmgMin: Math.floor(baseDmg * 0.85 * dmgMult),
    dmgMax: Math.floor(baseDmg * 1.15 * dmgMult),
    skillPower: Math.floor((4 + level + intTotal * 2) * (1 + t('m_int') * 0.06 + wil * 0.01)),
    armor: Math.floor((end * 1.5 + iArmor) * (1 + t('w_armor') * 0.10 + setArmorPct / 100)),
    critChance: Math.min(75, 5 + luk * 0.15 + per * 0.12 + iCrit + t('w_crit') * 2 + setCritPct),
    critMult: 1.8 + per * 0.004,
    attackSpeed: Math.min(3.5, (1 + agi * 0.004 + iSpeed / 100) * (1 + t('w_rage') * 0.04)),
    dodge: Math.min(40, agi * 0.06 + t('t_dodge') * 1.5),
    goldBonus: cha * 1 + iGold + t('t_gold') * 10 + setGoldPct,
    xpBonus: iXp + t('t_xp') * 8 + setXpPct,
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
  return Math.max(1, Math.round(raw * (1 - red)));
}
