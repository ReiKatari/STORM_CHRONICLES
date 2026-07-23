export interface RuneDef {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'divine';
  tier: number;
  stat: 'dmg' | 'armor' | 'hp' | 'crit' | 'speed' | 'gold' | 'xp' | 'str' | 'int';
  value: number;
  oreCost: number;
  essenceCost: number;
  desc: string;
  color: string;
}

export const RUNES: RuneDef[] = [
  // --- RUBIES (DMG / STR) ---
  { id: 'ruby_1', name: 'Малый Алый Рубин', icon: '🔻', rarity: 'common', tier: 1, stat: 'dmg', value: 12, oreCost: 20, essenceCost: 5, desc: '+12 к урону', color: '#ef4444' },
  { id: 'ruby_2', name: 'Огненный Рубин Сопряжения', icon: '♦️', rarity: 'rare', tier: 2, stat: 'dmg', value: 35, oreCost: 60, essenceCost: 15, desc: '+35 к урону', color: '#ef4444' },
  { id: 'ruby_3', name: 'Око Драконьего Пламени', icon: '💎', rarity: 'legendary', tier: 3, stat: 'dmg', value: 100, oreCost: 150, essenceCost: 40, desc: '+100 к урону', color: '#f97316' },

  // --- EMERALDS (HP / VIT) ---
  { id: 'emerald_1', name: 'Малый Изумруд Жизни', icon: '🟢', rarity: 'common', tier: 1, stat: 'hp', value: 50, oreCost: 20, essenceCost: 5, desc: '+50 к HP', color: '#22c55e' },
  { id: 'emerald_2', name: 'Изумруд Древнего Леса', icon: '❇️', rarity: 'rare', tier: 2, stat: 'hp', value: 150, oreCost: 60, essenceCost: 15, desc: '+150 к HP', color: '#22c55e' },
  { id: 'emerald_3', name: 'Сердце Живой Природы', icon: '🌱', rarity: 'legendary', tier: 3, stat: 'hp', value: 450, oreCost: 150, essenceCost: 40, desc: '+450 к HP', color: '#10b981' },

  // --- SAPPHIRES (ARMOR / MANA) ---
  { id: 'sapphire_1', name: 'Малый Голубой Сапфир', icon: '🔹', rarity: 'common', tier: 1, stat: 'armor', value: 15, oreCost: 20, essenceCost: 5, desc: '+15 к броне', color: '#38bdf8' },
  { id: 'sapphire_2', name: 'Сапфир Океанской Глубины', icon: '🔷', rarity: 'rare', tier: 2, stat: 'armor', value: 45, oreCost: 60, essenceCost: 15, desc: '+45 к броне', color: '#38bdf8' },
  { id: 'sapphire_3', name: 'Око Звездного Небосвода', icon: '🌌', rarity: 'legendary', tier: 3, stat: 'armor', value: 120, oreCost: 150, essenceCost: 40, desc: '+120 к броне', color: '#6366f1' },

  // --- ASTRAL VOID RUNES (CRIT / SPEED / GOLD / XP) ---
  { id: 'rune_crit_1', name: 'Руна Теневого Крита', icon: '🔮', rarity: 'epic', tier: 2, stat: 'crit', value: 5, oreCost: 80, essenceCost: 25, desc: '+5% к шансу крита', color: '#a855f7' },
  { id: 'rune_crit_2', name: 'Руна Кровавого Охотника', icon: '🩸', rarity: 'mythic', tier: 3, stat: 'crit', value: 12, oreCost: 200, essenceCost: 60, desc: '+12% к шансу крита', color: '#ec4899' },
  { id: 'rune_speed_1', name: 'Руна Скорости Штормового Ветра', icon: '⚡', rarity: 'epic', tier: 2, stat: 'speed', value: 8, oreCost: 80, essenceCost: 25, desc: '+8% к скорости атаки', color: '#facc15' },
  { id: 'rune_gold_1', name: 'Руна Алчности Гномов', icon: '💰', rarity: 'rare', tier: 2, stat: 'gold', value: 25, oreCost: 70, essenceCost: 20, desc: '+25% к выпадаемому золоту', color: '#eab308' },
  { id: 'rune_xp_1', name: 'Руна Мудрости Астральных Чародеев', icon: '📜', rarity: 'rare', tier: 2, stat: 'xp', value: 20, oreCost: 70, essenceCost: 20, desc: '+20% к получаемому опыту', color: '#818cf8' },
  { id: 'rune_divine_1', name: 'Божественная Руна Солярного Творца', icon: '👑', rarity: 'divine', tier: 4, stat: 'dmg', value: 250, oreCost: 350, essenceCost: 100, desc: '+250 к урону и сила всех параметров', color: '#e0e7ff' },
];

export function runeById(id: string): RuneDef {
  return RUNES.find(r => r.id === id) ?? RUNES[0];
}
