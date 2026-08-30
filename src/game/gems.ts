import type { GemItem, GemTier, GemType, Item, RuneWordDef } from './types';

export const GEM_TIER_NAMES: Record<GemTier, string> = {
  1: 'Обычный',
  2: 'Безупречный',
  3: 'Королевский',
  4: 'Астральный',
  5: 'Божественный',
};

export const GEM_TIER_COLORS: Record<GemTier, string> = {
  1: '#94a3b8',
  2: '#38bdf8',
  3: '#a855f7',
  4: '#f59e0b',
  5: '#ef4444',
};

export const GEM_DEFS: Record<GemType, { name: string; icon: string; stat: 'dmg' | 'hp' | 'armor' | 'crit' | 'speed' | 'lifesteal'; baseVal: number; desc: string }> = {
  ruby: { name: 'Рубин', icon: '🔴', stat: 'dmg', baseVal: 15, desc: 'Увеличивает атаку и огненный урон.' },
  sapphire: { name: 'Сапфир', icon: '🔵', stat: 'hp', baseVal: 80, desc: 'Увеличивает здоровье и щиты.' },
  emerald: { name: 'Изумруд', icon: '🟢', stat: 'speed', baseVal: 0.05, desc: 'Увеличивает скорость атак.' },
  topaz: { name: 'Топаз', icon: '🟡', stat: 'crit', baseVal: 4, desc: 'Увеличивает шанс критического удара.' },
  diamond: { name: 'Алмаз', icon: '💎', stat: 'armor', baseVal: 25, desc: 'Увеличивает броню и сопротивления.' },
  amethyst: { name: 'Аметист', icon: '🟣', stat: 'lifesteal', baseVal: 2, desc: 'Дарует похищение здоровья при ударе.' },
};

export function createGem(type: GemType, tier: GemTier): GemItem {
  const def = GEM_DEFS[type];
  const mult = Math.pow(2.2, tier - 1);
  const val = def.stat === 'speed' ? Number((def.baseVal * tier).toFixed(2)) : Math.round(def.baseVal * mult);
  return {
    id: `gem_${type}_${tier}_${Date.now()}_${Math.random()}`,
    type,
    tier,
    name: `${GEM_TIER_NAMES[tier]} ${def.name}`,
    icon: def.icon,
    stat: def.stat,
    value: val,
    bonusDesc: def.stat === 'speed' ? `+${(val * 100).toFixed(0)}% к Скорости Атаки` : `+${val} к ${def.name === 'Рубин' ? 'Урону' : def.name === 'Сапфир' ? 'Здоровью' : def.name === 'Алмаз' ? 'Броне' : def.name === 'Топаз' ? 'Шансу Критического Удара' : 'Вампиризму'}`,
  };
}

// 15+ Legendary Runewords
export const RUNEWORDS_CATALOG: RuneWordDef[] = [
  {
    id: 'rw_heart_of_fire',
    name: 'Пламенное Сердце Дракона',
    icon: '🔥',
    runes: ['r_sol', 'r_vex', 'r_jah'],
    effectDesc: '+50% к урону огнем и +25% к шансу критического удара',
    bonusDmgPct: 50,
    bonusCritPct: 25,
  },
  {
    id: 'rw_breath_of_death',
    name: 'Дыхание Бездны',
    icon: '☠️',
    runes: ['r_nef', 'r_ohm', 'r_zod'],
    effectDesc: '+80% к урону и 20% похищения жизни',
    bonusDmgPct: 80,
  },
  {
    id: 'rw_aegis_of_light',
    name: 'Эгида Архангела',
    icon: '🛡️',
    runes: ['r_tir', 'r_sur', 'r_ber'],
    effectDesc: '+100% к броне и поглощение входящего урона',
    bonusArmorPct: 100,
  },
  {
    id: 'rw_enigma',
    name: 'Загадка Творца (Энигма)',
    icon: '🌌',
    runes: ['r_jah', 'r_ith', 'r_ber'],
    effectDesc: '+120% к урону, +40% к увороту и мгновенный шаг сквозь тень',
    bonusDmgPct: 120,
  },
  {
    id: 'rw_infinity',
    name: 'Бесконечность Стихий',
    icon: '⚡',
    runes: ['r_ber', 'r_mal', 'r_ber', 'r_ist'],
    effectDesc: '+150% к урону молнией и снятие сопротивлений врагов',
    bonusDmgPct: 150,
    bonusCritPct: 35,
  },
  {
    id: 'rw_phoenix_rebirth',
    name: 'Возрождение Феникса',
    icon: '🪶',
    runes: ['r_vex', 'r_vex', 'r_lo', 'r_jah'],
    effectDesc: '+90% к урону огнем, аура очищения и мгновенное исцеление',
    bonusDmgPct: 90,
  },
  {
    id: 'rw_fortitude',
    name: 'Несокрушимая Стойкость',
    icon: '🗿',
    runes: ['r_el', 'r_sol', 'r_dol', 'r_lo'],
    effectDesc: '+80% к броне, +100% к здоровью и сопротивление оглушению',
    bonusArmorPct: 80,
  },
  {
    id: 'rw_grief',
    name: 'Скорбь Падших',
    icon: '🗡️',
    runes: ['r_eth', 'r_tir', 'r_lo', 'r_mal', 'r_ral'],
    effectDesc: '+140% к физическому урону и смертоносный яд',
    bonusDmgPct: 140,
    bonusCritPct: 30,
  },
  {
    id: 'rw_chaos_fury',
    name: 'Ярость Хаоса',
    icon: '🌀',
    runes: ['r_fal', 'r_ohm', 'r_um'],
    effectDesc: '+100% к урону и каскадные хаотические взрывы',
    bonusDmgPct: 100,
    bonusCritPct: 40,
  },
  {
    id: 'rw_last_wish',
    name: 'Последнее Желание',
    icon: '👑',
    runes: ['r_jah', 'r_mal', 'r_jah', 'r_sur', 'r_jah', 'r_ber'],
    effectDesc: '+200% к урону, +60% к критическому удару и аура всевластия',
    bonusDmgPct: 200,
    bonusCritPct: 60,
    bonusArmorPct: 80,
  },
  {
    id: 'rw_faith_valkyrie',
    name: 'Вера Валькирии',
    icon: '☀️',
    runes: ['r_ohm', 'r_jah', 'r_lem', 'r_eld'],
    effectDesc: '+80% к скорости атак и +70% к урону союзников',
    bonusDmgPct: 70,
  },
  {
    id: 'rw_beast_pack',
    name: 'Дикий Зверь',
    icon: '🐺',
    runes: ['r_ber', 'r_tir', 'r_um', 'r_mal', 'r_lum'],
    effectDesc: '+100% к урону питомца и превращение в яростного вожака',
    bonusDmgPct: 80,
  },
  {
    id: 'rw_exile_shield',
    name: 'Изгнание Тьмы',
    icon: '🛡️',
    runes: ['r_vex', 'r_ohm', 'r_ist', 'r_dol'],
    effectDesc: '+120% к броне и непрерывное похищение жизни',
    bonusArmorPct: 120,
  },
  {
    id: 'rw_chains_of_honor',
    name: 'Цепи Чести',
    icon: '⛓️',
    runes: ['r_dol', 'r_um', 'r_ber', 'r_ist'],
    effectDesc: '+75% ко всем характеристикам, +50% к урону по демонам',
    bonusDmgPct: 75,
    bonusArmorPct: 50,
  },
];

// Calculate Astral Refinement (+1..+20)
export function getRefinementInfo(currentLevel: number) {
  const nextLvl = currentLevel + 1;
  if (nextLvl > 20) return null;
  const goldCost = Math.round(800 * Math.pow(1.52, currentLevel));
  const stonesCost = Math.max(1, Math.floor(currentLevel * 1.1) + 1);
  const successChance = Math.max(12, Math.round(100 - Math.pow(currentLevel, 1.45) * 1.5));
  return {
    nextLevel: nextLvl,
    goldCost,
    stonesCost,
    successChance,
    statMultBonus: Number((nextLvl * 0.07).toFixed(2)),
  };
}

// Apply Refinement stats to Item
export function applyUpgradeToItem(item: Item): Item {
  const curLvl = item.upgradeLevel ?? 0;
  const newLvl = curLvl + 1;
  const factor = 1 + newLvl * 0.06;

  return {
    ...item,
    upgradeLevel: newLvl,
    base: {
      dmg: item.base.dmg ? Math.round(item.base.dmg * factor) : undefined,
      armor: item.base.armor ? Math.round(item.base.armor * factor) : undefined,
      hp: item.base.hp ? Math.round(item.base.hp * factor) : undefined,
    },
    score: Math.round(item.score * (1 + newLvl * 0.05)),
  };
}
