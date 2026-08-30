import type { HerbItem, AlchemyPotionDef } from './types';

export const HERBS_CATALOG: HerbItem[] = [
  { id: 'herb_moon', name: 'Луноцвет', icon: '🌸', count: 0, rarity: 'common', desc: 'Растет в залитых лунным светом рощах.', color: '#38bdf8' },
  { id: 'herb_fire', name: 'Огнецвет', icon: '🌺', count: 0, rarity: 'uncommon', desc: 'Питается жаром лавовых озер.', color: '#f97316' },
  { id: 'herb_ice', name: 'Ледяная Лилия', icon: '❄️', count: 0, rarity: 'rare', desc: 'Вечноцветущий бутон в ледниках.', color: '#7dd3fc' },
  { id: 'herb_astral', name: 'Астральный Корень', icon: '🌿', count: 0, rarity: 'epic', desc: 'Впитывает космические эманации.', color: '#c084fc' },
  { id: 'herb_gold', name: 'Золотой Лотос', icon: '🪷', count: 0, rarity: 'legendary', desc: 'Редчайший цветок древних царей.', color: '#facc15' },
  { id: 'herb_void', name: 'Слеза Бездны', icon: '🌑', count: 0, rarity: 'mythic', desc: 'Капля чистой первозданной тьмы.', color: '#a855f7' },
];

export const ALCHEMY_RECIPES: AlchemyPotionDef[] = [
  {
    id: 'pot_berserk',
    name: 'Эликсир Берсерка',
    icon: '🍷',
    desc: '+35% к урону и +15% к скорости атак на 10 минут.',
    durationSec: 600,
    rarity: 'uncommon',
    color: '#ef4444',
    statBonus: { playerAtk: 35, attackSpeed: 0.25 },
    recipe: [
      { herbId: 'herb_fire', count: 3 },
      { herbId: 'herb_moon', count: 2 },
    ],
  },
  {
    id: 'pot_titan',
    name: 'Настойка Титана',
    icon: '🧪',
    desc: '+40% к броне и +30% к максимальному здоровью на 10 минут.',
    durationSec: 600,
    rarity: 'rare',
    color: '#3b82f6',
    statBonus: { armor: 40, maxHp: 30 },
    recipe: [
      { herbId: 'herb_ice', count: 3 },
      { herbId: 'herb_moon', count: 3 },
    ],
  },
  {
    id: 'pot_greed',
    name: 'Фильтр Жадности Гоблина',
    icon: '💰',
    desc: '+60% к добыче золота и +40% к опыту на 12 минут.',
    durationSec: 720,
    rarity: 'epic',
    color: '#facc15',
    statBonus: { goldBonusPct: 60, xpBonusPct: 40 },
    recipe: [
      { herbId: 'herb_gold', count: 2 },
      { herbId: 'herb_astral', count: 2 },
    ],
  },
  {
    id: 'pot_astral_crit',
    name: 'Зелье Астральной Сингулярности',
    icon: '🔮',
    desc: '+25% к шансу критического удара и +60% к критическому урону на 15 минут.',
    durationSec: 900,
    rarity: 'legendary',
    color: '#c084fc',
    statBonus: { critChance: 25, critMult: 0.6 },
    recipe: [
      { herbId: 'herb_astral', count: 3 },
      { herbId: 'herb_gold', count: 2 },
      { herbId: 'herb_ice', count: 2 },
    ],
  },
  {
    id: 'pot_phoenix_flame',
    name: 'Пламя Солнечного Феникса',
    icon: '🔥',
    desc: '+75% к урону огнем и непрерывная регенерация 5% здоровья в секунду на 15 минут.',
    durationSec: 900,
    rarity: 'legendary',
    color: '#f97316',
    statBonus: { playerAtk: 75, maxHp: 40 },
    recipe: [
      { herbId: 'herb_fire', count: 4 },
      { herbId: 'herb_gold', count: 2 },
    ],
  },
  {
    id: 'pot_dragons_blood',
    name: 'Драконья Кровь Ярости',
    icon: '🐉',
    desc: '+90% к урону и +35% к шансу критического удара на 15 минут.',
    durationSec: 900,
    rarity: 'mythic',
    color: '#dc2626',
    statBonus: { playerAtk: 90, critChance: 35 },
    recipe: [
      { herbId: 'herb_void', count: 2 },
      { herbId: 'herb_fire', count: 4 },
      { herbId: 'herb_astral', count: 2 },
    ],
  },
  {
    id: 'pot_god_essence',
    name: 'Эссенция Вседержителя',
    icon: '🌟',
    desc: '+50% ко всем боевым характеристикам и 15% вампиризма на 20 минут.',
    durationSec: 1200,
    rarity: 'divine',
    color: '#fde047',
    statBonus: { playerAtk: 50, armor: 50, maxHp: 50, critChance: 20, lifestealPct: 15 },
    recipe: [
      { herbId: 'herb_void', count: 3 },
      { herbId: 'herb_gold', count: 3 },
      { herbId: 'herb_astral', count: 3 },
    ],
  },
];

export function getHerbDef(id: string): HerbItem {
  return HERBS_CATALOG.find(h => h.id === id) ?? HERBS_CATALOG[0];
}
