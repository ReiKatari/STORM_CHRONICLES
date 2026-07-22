export interface RuneDef {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'divine';
  tier: number;
  stat: 'dmg' | 'armor' | 'hp' | 'crit' | 'speed' | 'gold' | 'xp' | 'str' | 'int';
  value: number;
  desc: string;
  color: string;
}

export const RUNES: RuneDef[] = [
  // --- RUBIES (DMG / STR) ---
  { id: 'ruby_1', name: 'Малый Алый Рубин', icon: '🔻', rarity: 'common', tier: 1, stat: 'dmg', value: 8, desc: '+8 к урону', color: '#ef4444' },
  { id: 'ruby_2', name: 'Огненный Рубин', icon: '♦️', rarity: 'rare', tier: 2, stat: 'dmg', value: 25, desc: '+25 к урону', color: '#ef4444' },
  { id: 'ruby_3', name: 'Око Драконьего Пламени', icon: '💎', rarity: 'legendary', tier: 3, stat: 'dmg', value: 75, desc: '+75 к урону', color: '#f97316' },

  // --- EMERALDS (HP / VIT) ---
  { id: 'emerald_1', name: 'Малый Изумруд Жизни', icon: '🟢', rarity: 'common', tier: 1, stat: 'hp', value: 40, desc: '+40 к HP', color: '#22c55e' },
  { id: 'emerald_2', name: 'Изумруд Древнего Леса', icon: '❇️', rarity: 'rare', tier: 2, stat: 'hp', value: 120, desc: '+120 к HP', color: '#22c55e' },
  { id: 'emerald_3', name: 'Сердце Природы', icon: '❇️', rarity: 'legendary', tier: 3, stat: 'hp', value: 350, desc: '+350 к HP', color: '#10b981' },

  // --- SAPPHIRES (ARMOR / MANA) ---
  { id: 'sapphire_1', name: 'Малый Голубой Сапфир', icon: '🔹', rarity: 'common', tier: 1, stat: 'armor', value: 10, desc: '+10 к броне', color: '#38bdf8' },
  { id: 'sapphire_2', name: 'Сапфир Океана', icon: '🔷', rarity: 'rare', tier: 2, stat: 'armor', value: 30, desc: '+30 к броне', color: '#38bdf8' },
  { id: 'sapphire_3', name: 'Око Звездного Неба', icon: '🌌', rarity: 'legendary', tier: 3, stat: 'armor', value: 90, desc: '+90 к броне', color: '#6366f1' },

  // --- ASTRAL VOID RUNES (CRIT / SPEED) ---
  { id: 'rune_void_1', name: 'Руна Теневого Крита', icon: '🔮', rarity: 'epic', tier: 2, stat: 'crit', value: 5, desc: '+5% к шансу крита', color: '#a855f7' },
  { id: 'rune_speed_1', name: 'Руна Скорости Ветра', icon: '⚡', rarity: 'epic', tier: 2, stat: 'speed', value: 8, desc: '+8% к скорости атаки', color: '#facc15' },
  { id: 'rune_divine_1', name: 'Божественная Руна Творца', icon: '👑', rarity: 'divine', tier: 4, stat: 'dmg', value: 200, desc: '+200 к урону и сила всех аффиксов', color: '#e0e7ff' },
];

export function runeById(id: string): RuneDef {
  return RUNES.find(r => r.id === id) ?? RUNES[0];
}
