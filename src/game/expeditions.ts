import type { ExpeditionMission, MercenarySquad } from './types';

export const MERCENARIES_CATALOG: MercenarySquad[] = [
  { id: 'merc_wolves', name: 'Отряд Железных Волков', icon: '🐺', level: 1, power: 120, cost: 5000, hired: true },
  { id: 'merc_shadows', name: 'Астральные Тени', icon: '👤', level: 1, power: 280, cost: 25000, hired: false },
  { id: 'merc_dragons', name: 'Гвардия Драконьего Клыка', icon: '🐉', level: 1, power: 650, cost: 100000, hired: false },
  { id: 'merc_paladins', name: 'Орден Золотого Света', icon: '🛡️', level: 1, power: 1500, cost: 500000, hired: false },
  { id: 'merc_phoenix', name: 'Легион Солнечного Феникса', icon: '🦅', level: 1, power: 3200, cost: 1500000, hired: false },
  { id: 'merc_cosmic', name: 'Гвардейцы Космического Творца', icon: '🌌', level: 1, power: 7500, cost: 5000000, hired: false },
];

export const EXPEDITIONS_CATALOG: ExpeditionMission[] = [
  {
    id: 'exp_mines',
    name: 'Заброшенные Гномьи Шахты',
    icon: '⛏️',
    desc: 'Добыча руды и камней заточки в забытых штольнях подгорных мастеров.',
    durationSec: 180, // 3 minutes
    minPower: 100,
    rewardGold: 8000,
    rewardXp: 5000,
    rewardStones: 5,
    herbDropId: 'herb_fire',
    herbDropCount: 4,
    gemChance: 0.35,
  },
  {
    id: 'exp_sunken_ship',
    name: 'Затонувший Фрегат Пиратов',
    icon: '⚓',
    desc: 'Поиск сундуков с золотом и жемчугом на морском дне.',
    durationSec: 360, // 6 minutes
    minPower: 250,
    rewardGold: 25000,
    rewardXp: 18000,
    rewardStones: 12,
    herbDropId: 'herb_moon',
    herbDropCount: 6,
    gemChance: 0.55,
  },
  {
    id: 'exp_ancient_ruins',
    name: 'Руины Небесного Храма',
    icon: '🏛️',
    desc: 'Исследование летающих островов древней цивилизации архангелов.',
    durationSec: 600, // 10 minutes
    minPower: 600,
    rewardGold: 75000,
    rewardXp: 60000,
    rewardStones: 25,
    herbDropId: 'herb_astral',
    herbDropCount: 5,
    gemChance: 0.75,
  },
  {
    id: 'exp_magma_core',
    name: 'Жерло Огненного Вулкана',
    icon: '🌋',
    desc: 'Сбор кристаллизованной магмы и огненных самоцветов на дне кратера.',
    durationSec: 900, // 15 minutes
    minPower: 1000,
    rewardGold: 150000,
    rewardXp: 120000,
    rewardStones: 40,
    herbDropId: 'herb_gold',
    herbDropCount: 4,
    gemChance: 0.85,
  },
  {
    id: 'exp_void_rift',
    name: 'Врата Бездны и Хаоса',
    icon: '🌌',
    desc: 'Опаснейшая вылазка в разлом пространства за первозданной материей.',
    durationSec: 1200, // 20 minutes
    minPower: 1500,
    rewardGold: 300000,
    rewardXp: 250000,
    rewardStones: 70,
    herbDropId: 'herb_void',
    herbDropCount: 5,
    gemChance: 0.95,
  },
  {
    id: 'exp_nexus_creation',
    name: 'Нексус Первозданного Творца',
    icon: '🪐',
    desc: 'Экспедиция в сердце Вселенной за божественными кристаллами сотворения.',
    durationSec: 1800, // 30 minutes
    minPower: 3500,
    rewardGold: 1000000,
    rewardXp: 800000,
    rewardStones: 150,
    herbDropId: 'herb_void',
    herbDropCount: 10,
    gemChance: 1.0,
  },
];
