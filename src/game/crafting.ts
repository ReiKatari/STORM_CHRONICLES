import type { Item, RarityId } from './types';
import { generateItem, SETS } from './items';

export interface CraftingRecipe {
  id: string;
  name: string;
  icon: string;
  targetRarity: RarityId;
  targetSetId?: string;
  oreCost: number;
  essenceCost: number;
  slot?: string;
  desc: string;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'cr_dragon_set',
    name: 'Чертёж: Доспехи Драконьего Владыки',
    icon: '🐉',
    targetRarity: 'legendary',
    targetSetId: 'set_dragon',
    oreCost: 50,
    essenceCost: 10,
    slot: 'Нагрудник / Шлем',
    desc: 'Гарантированное создание сетового предмета Драконьего Владыки (+50% к Урону, +30% к Шансу Критического Удара).',
  },
  {
    id: 'cr_shadow_set',
    name: 'Чертёж: Одеяние Теневого Жнеца',
    icon: '🗡️',
    targetRarity: 'epic',
    targetSetId: 'set_shadow',
    oreCost: 35,
    essenceCost: 5,
    slot: 'Перчатки / Плащ',
    desc: 'Создание эпического сетового предмета Теневого Жнеца (+40% к Шансу Критического Удара).',
  },
  {
    id: 'cr_titan_set',
    name: 'Чертёж: Панцирь Защитника Титана',
    icon: '🛡️',
    targetRarity: 'legendary',
    targetSetId: 'set_titan',
    oreCost: 60,
    essenceCost: 15,
    slot: 'Латный Доспех',
    desc: 'Непробиваемый сетовый панцирь Защитника Титана (+80% к Здоровью, +60% к Броне).',
  },
  {
    id: 'cr_storm_set',
    name: 'Чертёж: Клинок Владыки Штормов',
    icon: '⚡',
    targetRarity: 'legendary',
    targetSetId: 'set_stormcaller',
    oreCost: 80,
    essenceCost: 20,
    slot: 'Оружие / Шлем',
    desc: 'Легендарное снаряжение Владыки Штормов (+60% к Скорости Атаки, цепные молнии).',
  },
  {
    id: 'cr_blood_set',
    name: 'Чертёж: Топор Кровавого Владыки',
    icon: '🍷',
    targetRarity: 'legendary',
    targetSetId: 'set_bloodlord',
    oreCost: 90,
    essenceCost: 25,
    slot: 'Оружие / Доспех',
    desc: 'Кровавое снаряжение с 25% Вампиризмом и +70% к Урону.',
  },
  {
    id: 'cr_phoenix_set',
    name: 'Чертёж: Комплект Бессмертного Феникса',
    icon: '🔥',
    targetRarity: 'legendary',
    targetSetId: 'set_phoenix',
    oreCost: 95,
    essenceCost: 30,
    slot: 'Посох / Мантия',
    desc: 'Пламенное снаряжение Феникса (+80% к Урону, +50% к Здоровью и возрождение).',
  },
  {
    id: 'cr_frost_set',
    name: 'Чертёж: Одеяния Ледяного Императора',
    icon: '❄️',
    targetRarity: 'legendary',
    targetSetId: 'set_frost_emperor',
    oreCost: 90,
    essenceCost: 25,
    slot: 'Клинок / Панцирь',
    desc: 'Абсолютный мороз (+70% к Броне, +45% к Урону и замедление врагов).',
  },
  {
    id: 'cr_thunder_set',
    name: 'Чертёж: Доспехи Бога Грома',
    icon: '⚡',
    targetRarity: 'legendary',
    targetSetId: 'set_thunder_god',
    oreCost: 110,
    essenceCost: 35,
    slot: 'Молот / Панцирь',
    desc: 'Божественный гром (+120% к Урону, +60% к Критическому Удару).',
  },
  {
    id: 'cr_seraph_set',
    name: 'Чертёж: Священный Доспех Серафима',
    icon: '👼',
    targetRarity: 'mythic',
    targetSetId: 'set_seraphim',
    oreCost: 150,
    essenceCost: 45,
    slot: 'Меч / Кираса',
    desc: 'Священный артефакт небес (+140% ко всем характеристикам и защитный купол).',
  },
  {
    id: 'cr_colossus_set',
    name: 'Чертёж: Броня Земного Колосса',
    icon: '🗿',
    targetRarity: 'legendary',
    targetSetId: 'set_colossus',
    oreCost: 100,
    essenceCost: 30,
    slot: 'Молот / Плита',
    desc: 'Глыба монолита (+200% к Броне и 50% отражения полученного урона).',
  },
  {
    id: 'cr_chrono_set',
    name: 'Чертёж: Хроно-Сдвиг Властелина Времени',
    icon: '⏳',
    targetRarity: 'legendary',
    targetSetId: 'set_chrono',
    oreCost: 105,
    essenceCost: 35,
    slot: 'Рапира / Диадема',
    desc: 'Искажение времени (+70% к Скорости Атаки, +50% к Урону).',
  },
  {
    id: 'cr_demon_slayer_set',
    name: 'Чертёж: Снаряжение Истребителя Демонов',
    icon: '👹',
    targetRarity: 'legendary',
    targetSetId: 'set_demon_slayer',
    oreCost: 100,
    essenceCost: 30,
    slot: 'Парные Клинки / Доспех',
    desc: 'Кара нечисти (+80% к Урону, +35% к Шансу Критического Удара).',
  },
  {
    id: 'cr_valkyrie_set',
    name: 'Чертёж: Благословение Валькирии',
    icon: '☀️',
    targetRarity: 'legendary',
    targetSetId: 'set_valkyrie',
    oreCost: 110,
    essenceCost: 35,
    slot: 'Копье / Броня',
    desc: 'Свет Вальхаллы (+65% к Урону, +50% к Шансу Критического Удара).',
  },
  {
    id: 'cr_rune_master_set',
    name: 'Чертёж: Владыка Рун Одина',
    icon: 'ᚱ',
    targetRarity: 'legendary',
    targetSetId: 'set_rune_master',
    oreCost: 115,
    essenceCost: 35,
    slot: 'Рунический Клинок / Мантия',
    desc: 'Старший Футарк (+80% к Урону Способностей, +50% к Броне).',
  },
  {
    id: 'cr_beast_master_set',
    name: 'Чертёж: Повелитель Диких Прайдов',
    icon: '🐺',
    targetRarity: 'legendary',
    targetSetId: 'set_beast_master',
    oreCost: 95,
    essenceCost: 25,
    slot: 'Охотничий Лук / Кольчуга',
    desc: 'Стайный вожак (+100% к Урону Питомца, +50% к Урону Героя).',
  },
  {
    id: 'cr_creator_set',
    name: 'Чертёж: Венец Древнего Творца',
    icon: '👑',
    targetRarity: 'mythic',
    targetSetId: 'set_creator',
    oreCost: 180,
    essenceCost: 50,
    slot: 'Полный Комплект',
    desc: 'Мифическое снаряжение Творца Миров (+150% к Урону и Броне).',
  },
  {
    id: 'cr_cosmic_set',
    name: 'Чертёж: Космическая Бесконечность',
    icon: '🌌',
    targetRarity: 'mythic',
    targetSetId: 'set_cosmic_infinity',
    oreCost: 220,
    essenceCost: 65,
    slot: 'Посох / Звездная Корона',
    desc: 'Энергия Сверхновой (+250% к Урону, +80% к Критическому Удару).',
  },
  {
    id: 'cr_divine_arbiter_set',
    name: 'Чертёж: Божественный Арбитр Судеб',
    icon: '⚖️',
    targetRarity: 'divine',
    targetSetId: 'set_divine_arbiter',
    oreCost: 300,
    essenceCost: 90,
    slot: 'Клинок / Венец Справедливости',
    desc: 'Высший Божественный Суд (+220% к Урону, +70% к Критическому Удару).',
  },
  {
    id: 'cr_divine_weapon',
    name: 'Чертёж: Божественный Клинок Небес',
    icon: '⚔️',
    targetRarity: 'divine',
    oreCost: 250,
    essenceCost: 80,
    slot: 'Божественное Оружие',
    desc: 'Выплавка высочайшего Божественного Оружия с 7 мощными аффиксами.',
  },
];

export function salvageItem(item: Item): { ore: number; essence: number } {
  const mults: Record<string, { ore: number; essence: number }> = {
    common: { ore: 4, essence: 0 },
    uncommon: { ore: 8, essence: 1 },
    rare: { ore: 18, essence: 3 },
    epic: { ore: 35, essence: 6 },
    legendary: { ore: 70, essence: 15 },
    mythic: { ore: 140, essence: 35 },
    divine: { ore: 300, essence: 80 },
  };

  return mults[item.rarity] ?? { ore: 4, essence: 0 };
}

export function craftFromRecipe(recipe: CraftingRecipe, level: number): Item {
  const item = generateItem(level, recipe.targetRarity);
  if (recipe.targetSetId) {
    item.setId = recipe.targetSetId;
    const setDef = SETS.find(s => s.id === recipe.targetSetId);
    if (setDef && setDef.pieces.length > 0) {
      item.name = setDef.pieces[Math.floor(Math.random() * setDef.pieces.length)];
    }
  }
  return item;
}
