import type { Item, RarityId } from './types';
import { generateItem, SETS } from './items';

export interface CraftingRecipe {
  id: string;
  name: string;
  icon: string;
  targetRarity: RarityId;
  targetSetId?: string;
  reqOre: number;
  reqEssence: number;
  desc: string;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'cr_dragon_set',
    name: 'Чертеж: Драконий Панцирь',
    icon: '🐉',
    targetRarity: 'legendary',
    targetSetId: 'set_dragon',
    reqOre: 50,
    reqEssence: 10,
    desc: 'Гарантированное создание редкого сетового предмета Драконьего Владыки.',
  },
  {
    id: 'cr_shadow_set',
    name: 'Чертеж: Одеяние Теневого Жнеца',
    icon: '🗡️',
    targetRarity: 'epic',
    targetSetId: 'set_shadow',
    reqOre: 35,
    reqEssence: 5,
    desc: 'Создание эпического сетового предмета Теневого Жнеца.',
  },
  {
    id: 'cr_titan_set',
    name: 'Чертеж: Панцирь Защитника Титана',
    icon: '🛡️',
    targetRarity: 'legendary',
    targetSetId: 'set_titan',
    reqOre: 60,
    reqEssence: 15,
    desc: 'Непробиваемый сетовый панцирь Защитника Титана.',
  },
  {
    id: 'cr_divine_weapon',
    name: 'Чертеж: Божественный Клинок Небес',
    icon: '⚔️',
    targetRarity: 'divine',
    reqOre: 200,
    reqEssence: 50,
    desc: 'Выплавка высочайшего Божественного Оружия с 7 мощными аффиксами.',
  },
];

export function salvageItem(item: Item): { ore: number; essence: number } {
  const mults: Record<string, { ore: number; essence: number }> = {
    common: { ore: 2, essence: 0 },
    uncommon: { ore: 5, essence: 0 },
    rare: { ore: 12, essence: 1 },
    epic: { ore: 25, essence: 3 },
    legendary: { ore: 50, essence: 8 },
    mythic: { ore: 100, essence: 20 },
    divine: { ore: 250, essence: 50 },
  };

  return mults[item.rarity] ?? { ore: 2, essence: 0 };
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
