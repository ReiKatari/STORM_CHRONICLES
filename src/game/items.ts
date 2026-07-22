import type { Item, ItemAffix, RarityDef, RarityId, SlotKind, StatId, SetDef } from './types';

export const RARITIES: RarityDef[] = [
  { id: 'common',    name: 'Обычный',     color: '#94a3b8', glow: 'rgba(148,163,184,0.3)', mult: 1.0, affixes: 1, weight: 50 },
  { id: 'uncommon',  name: 'Необычный',   color: '#4ade80', glow: 'rgba(74,222,128,0.4)',  mult: 1.3, affixes: 2, weight: 30 },
  { id: 'rare',      name: 'Редкий',      color: '#38bdf8', glow: 'rgba(56,189,248,0.5)',  mult: 1.7, affixes: 3, weight: 14 },
  { id: 'epic',      name: 'Эпический',   color: '#c084fc', glow: 'rgba(192,132,252,0.6)', mult: 2.2, affixes: 4, weight: 5 },
  { id: 'legendary', name: 'Легендарный', color: '#facc15', glow: 'rgba(250,204,21,0.7)',  mult: 3.0, affixes: 5, weight: 1.0 },
  { id: 'mythic',    name: 'Мифический',  color: '#f97316', glow: 'rgba(249,115,22,0.85)', mult: 4.2, affixes: 6, weight: 0.1 },
  { id: 'divine',    name: 'Божественный',color: '#e0e7ff', glow: 'rgba(224,231,255,1.0)', mult: 6.0, affixes: 7, weight: 0.01 },
];

export function rarityById(id: RarityId): RarityDef {
  return RARITIES.find(r => r.id === id) ?? RARITIES[0];
}

export type Gender = 'm' | 'f' | 'n' | 'p';

export interface BaseItem {
  name: string;
  icon: string;
  g?: Gender;
  dmg?: number;
  armor?: number;
  hp?: number;
}

export const BASES: Record<SlotKind, BaseItem[]> = {
  weapon: [
    { name: 'Меч', icon: '⚔️', dmg: 14 },
    { name: 'Топор', icon: '🪓', dmg: 18 },
    { name: 'Молот', icon: '🔨', dmg: 20 },
    { name: 'Копьё', icon: '🔱', dmg: 16 },
    { name: 'Посох', icon: '🪄', dmg: 15 },
    { name: 'Кинжал', icon: '🗡️', dmg: 12 },
    { name: 'Арбалет', icon: '🏹', dmg: 17 },
    { name: 'Лук', icon: '🏹', dmg: 15 },
    { name: 'Катана', icon: '⚔️', dmg: 19 },
    { name: 'Глефа', icon: '🪓', dmg: 21 },
    { name: 'Рапира', icon: '🗡️', dmg: 13 },
    { name: 'Клеймор', icon: '⚔️', dmg: 24 },
    { name: 'Скипетр', icon: '🪄', dmg: 16 },
    { name: 'Булава', icon: '🔨', dmg: 19 },
    { name: 'Алебарда', icon: '🔱', dmg: 22 },
    { name: 'Жезл', icon: '🪄', dmg: 15 },
  ],
  helmet: [
    { name: 'Кожаный шлем', icon: '🪖', armor: 3, hp: 10 },
    { name: 'Железный шлем', icon: '🪖', armor: 6, hp: 18 },
    { name: 'Лёгкий капюшон', icon: '🧢', armor: 2, hp: 12 },
    { name: 'Шлем стражника', icon: '🪖', armor: 8, hp: 22 },
    { name: 'Титановый рогач', icon: '🪖', armor: 11, hp: 30 },
    { name: 'Корона пламени', icon: '👑', armor: 9, hp: 35 },
    { name: 'Шлем дракона', icon: '🪖', armor: 14, hp: 45 },
    { name: 'Астральный венец', icon: '👑', armor: 10, hp: 40 },
  ],
  armor: [
    { name: 'Кожаный кушак', icon: '🎽', armor: 5, hp: 20 },
    { name: 'Стальная кираса', icon: '🛡️', armor: 12, hp: 40 },
    { name: 'Мантия мага', icon: '🥋', armor: 4, hp: 30 },
    { name: 'Доспехи рыцаря', icon: '🛡️', armor: 16, hp: 55 },
    { name: 'Панцирь титана', icon: '🛡️', armor: 22, hp: 80 },
    { name: 'Одеяние тени', icon: '🎽', armor: 8, hp: 35 },
    { name: 'Драконий панцирь', icon: '🛡️', armor: 28, hp: 100 },
    { name: 'Чешуя левиафана', icon: '🛡️', armor: 25, hp: 90 },
  ],
  gloves: [
    { name: 'Кожаные перчатки', icon: '🧤', armor: 2, hp: 5, g: 'p' },
    { name: 'Стальные рукавицы', icon: '🧤', armor: 5, hp: 12, g: 'p' },
    { name: 'Шёлковые перчатки', icon: '🧤', armor: 1, hp: 8, g: 'p' },
    { name: 'Перчатки убийцы', icon: '🧤', armor: 4, hp: 15, g: 'p' },
    { name: 'Рукавицы пламени', icon: '🧤', armor: 7, hp: 20, g: 'p' },
    { name: 'Драконьи когти', icon: '🧤', armor: 10, hp: 30, g: 'p' },
  ],
  kneepads: [
    { name: 'Кожаные наколенники', icon: '🦵', armor: 2, hp: 8, g: 'p' },
    { name: 'Стальные наколенники', icon: '🦵', armor: 5, hp: 15, g: 'p' },
    { name: 'Титановые щитки', icon: '🦵', armor: 8, hp: 22, g: 'p' },
    { name: 'Драконьи щитки', icon: '🦵', armor: 11, hp: 32, g: 'p' },
  ],
  shoulders: [
    { name: 'Кожаные наплечники', icon: '🎽', armor: 3, hp: 10, g: 'p' },
    { name: 'Стальные наплечники', icon: '🎽', armor: 7, hp: 20, g: 'p' },
    { name: 'Наплечники виверны', icon: '🎽', armor: 10, hp: 28, g: 'p' },
    { name: 'Наплечники титана', icon: '🎽', armor: 14, hp: 40, g: 'p' },
  ],
  boots: [
    { name: 'Кожаные сапоги', icon: '🥾', armor: 2, hp: 8, g: 'p' },
    { name: 'Железные сапоги', icon: '🥾', armor: 5, hp: 15, g: 'p' },
    { name: 'Сапоги ветра', icon: '🥾', armor: 3, hp: 12, g: 'p' },
    { name: 'Драконьи боты', icon: '🥾', armor: 9, hp: 25, g: 'p' },
  ],
  pants: [
    { name: 'Кожаные штаны', icon: '👖', armor: 4, hp: 15, g: 'p' },
    { name: 'Железные поножи', icon: '👖', armor: 9, hp: 30, g: 'p' },
    { name: 'Шелковые шаровары', icon: '👖', armor: 3, hp: 20, g: 'p' },
    { name: 'Поножи титана', icon: '👖', armor: 15, hp: 50, g: 'p' },
  ],
  ring: [
    { name: 'Медное кольцо', icon: '💍', hp: 10, g: 'n' },
    { name: 'Серебряное кольцо', icon: '💍', hp: 20, g: 'n' },
    { name: 'Золотое кольцо', icon: '💍', hp: 35, g: 'n' },
    { name: 'Кольцо огня', icon: '💍', hp: 45, g: 'n' },
    { name: 'Рунический перстень', icon: '💍', hp: 60, g: 'n' },
    { name: 'Перстень Бездны', icon: '💍', hp: 85, g: 'n' },
  ],
  earring: [
    { name: 'Медная серьга', icon: '📿', hp: 8, g: 'f' },
    { name: 'Серебряная клипса', icon: '📿', hp: 18, g: 'f' },
    { name: 'Золотая серьга', icon: '📿', hp: 30, g: 'f' },
    { name: 'Серьга звезд', icon: '📿', hp: 50, g: 'f' },
  ],
  amulet: [
    { name: 'Амулет силы', icon: '🔮', hp: 25 },
    { name: 'Талисман мудрости', icon: '🔮', hp: 45 },
    { name: 'Кулон дракона', icon: '🔮', hp: 70 },
    { name: 'Око Бездны', icon: '👁️', hp: 100 },
  ],
  cloak: [
    { name: 'Шерстяной плащ', icon: '🧣', armor: 2, hp: 10 },
    { name: 'Плащ теневого вора', icon: '🧣', armor: 5, hp: 25 },
    { name: 'Драконий крылач', icon: '🧣', armor: 10, hp: 50 },
  ],
  banner: [
    { name: 'Знамя гильдии', icon: '🚩', hp: 20 },
    { name: 'Стяг победы', icon: '🚩', hp: 45 },
    { name: 'Штандарт Бездны', icon: '🚩', hp: 80 },
  ],
};

export const SETS: SetDef[] = [
  {
    id: 'set_dragon',
    name: 'Комплект Драконьего Владыки',
    icon: '🐉',
    color: '#ef4444',
    pieces: ['Драконий панцирь', 'Шлем дракона', 'Драконьи когти', 'Драконий крылач'],
    bonuses: [
      { reqPieces: 2, desc: '+25% к урону', dmgBonus: 25 },
      { reqPieces: 4, desc: '+50% к урону, +30% к шансу крита', dmgBonus: 50, critBonus: 30 },
    ],
  },
  {
    id: 'set_shadow',
    name: 'Комплект Теневого Жнеца',
    icon: '🗡️',
    color: '#a855f7',
    pieces: ['Перчатки убийцы', 'Одеяние тени', 'Плащ теневого вора'],
    bonuses: [
      { reqPieces: 2, desc: '+20% к урон и критическим ударам', dmgBonus: 20, critBonus: 15 },
      { reqPieces: 3, desc: '+40% к криту и +20% к скорости', critBonus: 40 },
    ],
  },
  {
    id: 'set_titan',
    name: 'Комплект Защитника Титана',
    icon: '🛡️',
    color: '#38bdf8',
    pieces: ['Панцирь титана', 'Титановый рогач', 'Наплечники титана', 'Поножи титана'],
    bonuses: [
      { reqPieces: 2, desc: '+40% к броне', armorBonus: 40 },
      { reqPieces: 4, desc: '+80% к здоровью и +60% к броне', hpBonus: 80, armorBonus: 60 },
    ],
  },
  {
    id: 'set_astral',
    name: 'Комплект Астрального Архимага',
    icon: '🔮',
    color: '#c084fc',
    pieces: ['Астральный венец', 'Талисман мудрости', 'Серьга звезд', 'Перстень Бездны'],
    bonuses: [
      { reqPieces: 2, desc: '+25% к получаемому опыту', xpBonus: 25 },
      { reqPieces: 4, desc: '+60% к опыту и +30% к урону', xpBonus: 60, dmgBonus: 30 },
    ],
  },
  {
    id: 'set_fortune',
    name: 'Комплект Искателя Фортуны',
    icon: '💰',
    color: '#facc15',
    pieces: ['Золотое кольцо', 'Золотая серьга', 'Знамя гильдии'],
    bonuses: [
      { reqPieces: 2, desc: '+50% к выпадению золота', goldBonus: 50 },
      { reqPieces: 3, desc: '+100% к золото и +25% к опыту', goldBonus: 100, xpBonus: 25 },
    ],
  },
];

export function getSetById(setId: string): SetDef | undefined {
  return SETS.find(s => s.id === setId);
}

export function declinePrefix(prefix: string, g: Gender = 'm'): string {
  if (g === 'm') return prefix;
  if (g === 'f') {
    if (prefix.endsWith('ый')) return prefix.slice(0, -2) + 'ая';
    if (prefix.endsWith('ий')) return prefix.slice(0, -2) + 'яя';
    if (prefix.endsWith('ой')) return prefix.slice(0, -2) + 'ая';
  }
  if (g === 'n') {
    if (prefix.endsWith('ый')) return prefix.slice(0, -2) + 'ое';
    if (prefix.endsWith('ий')) return prefix.slice(0, -2) + 'ее';
    if (prefix.endsWith('ой')) return prefix.slice(0, -2) + 'ое';
  }
  if (g === 'p') {
    if (prefix.endsWith('ый')) return prefix.slice(0, -2) + 'ые';
    if (prefix.endsWith('ий')) return prefix.slice(0, -2) + 'ие';
    if (prefix.endsWith('ой')) return prefix.slice(0, -2) + 'ые';
  }
  return prefix;
}

export const PREFIXES = [
  'Сияющий', 'Древний', 'Теневой', 'Огненный', 'Ледяной',
  'Грозовой', 'Кровавый', 'Проклятый', 'Священный', 'Астральный',
  'Титанический', 'Рунический', 'Ядовитый', 'Звёздный', 'Солнечный',
  'Драконий', 'Хаотический', 'Призрачный', 'Бессмертный', 'Абсолютный',
];

export const SUFFIXES = [
  'Ветра', 'Бури', 'Пламени', 'Бездны', 'Хаоса',
  'Ночи', 'Зари', 'Титанов', 'Духов', 'Ярости',
  'Крови', 'Владык', 'Теней', 'Света', 'Космоса',
  'Королей', 'Смерти', 'Судьбы', 'Гроза', 'Вечности',
];

export const STAT_POOL: ItemAffix['stat'][] = [
  'str', 'agi', 'vit', 'int', 'end', 'luk', 'wis', 'per', 'cha', 'wil',
  'dmg', 'hp', 'armor', 'crit', 'speed', 'gold', 'xp',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randRange(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

let uidCounter = 0;
function uid(): string {
  return `itm_${Date.now()}_${++uidCounter}`;
}

export function generateItem(ilvl: number, forceRarity?: RarityId): Item {
  let rarity: RarityDef;
  if (forceRarity) {
    rarity = rarityById(forceRarity);
  } else {
    const totalW = RARITIES.reduce((s, r) => s + r.weight, 0);
    let rVal = Math.random() * totalW;
    rarity = RARITIES[0];
    for (const r of RARITIES) {
      if (rVal <= r.weight) { rarity = r; break; }
      rVal -= r.weight;
    }
  }

  const slotKeys = Object.keys(BASES) as SlotKind[];
  const slot = pick(slotKeys);
  const baseList = BASES[slot];
  const base = pick(baseList);

  const prefix = pick(PREFIXES);
  const suffix = pick(SUFFIXES);
  const g = base.g ?? 'm';
  const name = `${declinePrefix(prefix, g)} ${base.name.toLowerCase()} ${suffix}`;

  const itemBase: Item['base'] = {};
  if (base.dmg) itemBase.dmg = Math.round(base.dmg * (1 + ilvl * 0.15) * rarity.mult);
  if (base.armor) itemBase.armor = Math.round(base.armor * (1 + ilvl * 0.15) * rarity.mult);
  if (base.hp) itemBase.hp = Math.round(base.hp * (1 + ilvl * 0.25) * rarity.mult);

  const affixes: ItemAffix[] = [];
  const usedStats = new Set<string>();
  for (let i = 0; i < rarity.affixes; i++) {
    const stat = pick(STAT_POOL.filter(s => !usedStats.has(s)));
    usedStats.add(stat);
    let val = 0;
    if (stat === 'crit' || stat === 'speed') {
      val = Math.round((1 + Math.random() * 3 * rarity.mult));
    } else if (stat === 'gold' || stat === 'xp') {
      val = Math.round((3 + Math.random() * 6 * rarity.mult));
    } else if (stat === 'dmg' || stat === 'armor') {
      val = Math.round((2 + ilvl * 0.8) * rarity.mult * (0.8 + Math.random() * 0.4));
    } else if (stat === 'hp') {
      val = Math.round((8 + ilvl * 2) * rarity.mult * (0.8 + Math.random() * 0.4));
    } else {
      val = Math.round((1 + ilvl * 0.4) * rarity.mult * (0.8 + Math.random() * 0.4));
    }
    affixes.push({ stat, value: Math.max(1, val) });
  }

  const score = Math.round(
    ilvl * 3 + rarity.mult * 20 +
    (itemBase.dmg ?? 0) * 3 + (itemBase.armor ?? 0) * 2 + (itemBase.hp ?? 0) * 0.5 +
    affixes.reduce((s, a) => s + a.value * (a.stat === 'dmg' ? 3 : a.stat === 'hp' ? 0.5 : a.stat === 'armor' ? 2 : 1.2), 0)
  );

  // Check if item matches a set piece
  let matchedSetId: string | undefined = undefined;
  if (rarity.id === 'epic' || rarity.id === 'legendary' || rarity.id === 'mythic' || rarity.id === 'divine') {
    if (Math.random() < 0.35) {
      const setMatch = SETS.find(s => s.pieces.some(p => base.name.includes(p) || p.includes(base.name)));
      if (setMatch) matchedSetId = setMatch.id;
    }
  }

  return {
    id: uid(),
    name,
    slot,
    rarity: rarity.id,
    ilvl,
    icon: base.icon,
    base: itemBase,
    affixes,
    sellPrice: Math.round((5 + ilvl * 2) * rarity.mult * (1 + rarity.affixes * 0.3)),
    score,
    setId: matchedSetId,
  };
}

export function countCombinations(): number {
  const bases = Object.values(BASES).reduce((s, b) => s + b.length, 0);
  return bases * PREFIXES.length * SUFFIXES.length * RARITIES.length * 500;
}

export const AFFIX_LABELS: Record<ItemAffix['stat'], { name: string; icon: string; suffix?: string }> = {
  str: { name: 'Сила', icon: '💪' },
  agi: { name: 'Ловкость', icon: '🌀' },
  vit: { name: 'Живучесть', icon: '❤️' },
  int: { name: 'Интеллект', icon: '🧠' },
  end: { name: 'Выносливость', icon: '🛡️' },
  luk: { name: 'Удача', icon: '🍀' },
  wis: { name: 'Мудрость', icon: '📖' },
  per: { name: 'Восприятие', icon: '👁️' },
  cha: { name: 'Харизма', icon: '✨' },
  wil: { name: 'Воля', icon: '🔥' },
  dmg: { name: 'Урон', icon: '⚔️' },
  hp: { name: 'Здоровье', icon: '❤️' },
  armor: { name: 'Броня', icon: '🛡️' },
  crit: { name: 'Шанс крита', icon: '💥', suffix: '%' },
  speed: { name: 'Скорость атаки', icon: '⚡', suffix: '%' },
  gold: { name: 'Золото', icon: '💰', suffix: '%' },
  xp: { name: 'Опыт', icon: '📈', suffix: '%' },
};

const LORE_TEMPLATES: Record<RarityId, string[]> = {
  common: [
    'Простое, надежное снаряжение ремесленников, спасавшее не одного начинающего искателя приключений.',
    'Стандартный предмет городского ополчения. Выполнен из простого сплава для повседневных битв.',
    'Обыденная вещь из местных кузниц, проверенная временем и дорожной пылью.',
  ],
  uncommon: [
    'Закаленный предмет с легкими руническими чарами. Ощущается непривычная легкая вибрация при касании.',
    'Снаряжение ветеранов приграничных войн. Качественная сталь с нанесенными знаками защиты.',
    'Выковано подмастерьями высшей гильдии. Материал впитал крупицы природной магии.',
  ],
  rare: [
    'Старинная реликвия, извлеченная из заброшенных катакомб Древнего Ордена. Металл не поддается ржавчине и в темноте испускает мягкий таинственный свет.',
    'Принадлежало легендарному следопыту Забытого Дола. Хранит память о десятках побед над нежитью и монстрами Бездны.',
    'Закалено в астральном пламени под свет Кровавой Луны. Магические знаки на поверхности до сих пор шепчут древние заклятия.',
  ],
  epic: [
    'Овеянное легендами снаряжение великих чемпионов прошлой эпохи. В его глубинах пульсирует дремлющее пламя упавшей звезды, готовое вырваться наружу.',
    'Выковано гномьими владыками из руды глубоких подземных жил. Легенды гласят, что этот предмет способно расколоть лишь оружие богов.',
    'Найденный артефакт из сокровищницы Драконьего Владыки. Несет в себе отголоски пламени, сожгшего сотни древних королевств.',
  ],
  legendary: [
    'Легендарный артефакт, выкованный в самом сердце Потустороннего Вулкана. Его прошлые владельцы становились нерушимыми правителями империи и в одиночку поворачивали ход войн.',
    'Создано из слез древних стихийных духов и закалено в крови Высших Демонов. Обладает собственной волей и шепчет воину забытые секреты Бездны.',
    'Мифическое оружие Первозданных Героев. Каждая нить металла пропитана силой, способной раскалывать небеса и призывать грозы.',
  ],
  mythic: [
    'Мифическое сокровище Первозданного Хаоса. Материя предмета не принадлежит земному миру — это кристаллизованная энергия угасших созвездий. Владение им разрывает саму ткань пространства вокруг воина.',
    'Артефакт Древнейших Титанов, существовавших до появления солнца. Его аура искривляет гравитацию и дарует волю над судьбами царств.',
    'Сокровище из астральной кузни Бездны. Каждая руна на нем выжжена первородной магией создания, неподвластной смертному разуму.',
  ],
  divine: [
    'БОЖЕСТВЕННЫЙ АПОКРИФ СОЗДАНИЯ. Сотворен Высшим Архитектором Вселенной зари времен. Каждый разум, глядящий на него, испытывает благоговейный трепет перед абсолютной мощью.',
    'СВЯЩЕННАЯ РЕЛИКВИЯ БОГОВ. Несет в себе свет перворожденного космоса и тьму поглощенных галактик. Держащий этот предмет сам становится воплощением Судьбы и Владыкой Бездны.',
  ],
};

export function getItemLore(item: Item): string {
  const pool = LORE_TEMPLATES[item.rarity] || LORE_TEMPLATES.common;
  let charSum = 0;
  for (let i = 0; i < item.name.length; i++) charSum += item.name.charCodeAt(i);
  return pool[charSum % pool.length];
}
