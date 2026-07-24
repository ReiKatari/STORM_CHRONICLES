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

export interface SlotDefItem {
  id: SlotKind;
  kind: SlotKind;
  name: string;
  icon: string;
}

export const SLOT_DEFS: SlotDefItem[] = [
  { id: 'weapon', kind: 'weapon', name: 'Оружие', icon: '⚔️' },
  { id: 'helmet', kind: 'helmet', name: 'Шлем', icon: '🪖' },
  { id: 'armor', kind: 'armor', name: 'Броня', icon: '🛡️' },
  { id: 'gloves', kind: 'gloves', name: 'Перчатки', icon: '🧤' },
  { id: 'kneepads', kind: 'kneepads', name: 'Наколенники', icon: '🦵' },
  { id: 'shoulders', kind: 'shoulders', name: 'Наплечники', icon: '🎽' },
  { id: 'boots', kind: 'boots', name: 'Сапоги', icon: '🥾' },
  { id: 'pants', kind: 'pants', name: 'Штаны', icon: '👖' },
  { id: 'ring', kind: 'ring', name: 'Кольца', icon: '💍' },
  { id: 'earring', kind: 'earring', name: 'Серьги', icon: '📿' },
  { id: 'amulet', kind: 'amulet', name: 'Амулет', icon: '🔮' },
  { id: 'cloak', kind: 'cloak', name: 'Плащ', icon: '🧣' },
  { id: 'banner', kind: 'banner', name: 'Знамя', icon: '🚩' },
];

export type Gender = 'm' | 'f' | 'n' | 'p';

export function declinePrefix(adj: string, g?: Gender): string {
  if (!g || g === 'm') return adj;
  if (g === 'f') return adj.replace(/ый$/, 'ая').replace(/ий$/, 'ья').replace(/ой$/, 'ая');
  if (g === 'n') return adj.replace(/ый$/, 'ое').replace(/ий$/, 'ье').replace(/ой$/, 'ое');
  if (g === 'p') return adj.replace(/ый$/, 'ые').replace(/ий$/, 'ьи').replace(/ой$/, 'ые');
  return adj;
}

export interface BaseItem {
  name: string;
  icon: string;
  g?: Gender;
  dmg?: number;
  armor?: number;
  hp?: number;
}

// HUNDREDS OF BASE ITEMS FOR EVERY SINGLE SLOT
export const BASES: Record<SlotKind, BaseItem[]> = {
  weapon: [
    { name: 'Меч Стальных Небес', icon: '⚔️', dmg: 14 },
    { name: 'Топор Кровавой Луны', icon: '🪓', dmg: 18 },
    { name: 'Молот Громовержца', icon: '🔨', dmg: 20 },
    { name: 'Копьё Сокрушителя', icon: '🔱', dmg: 16 },
    { name: 'Посох Астрала', icon: '🪄', dmg: 15 },
    { name: 'Кинжал Тени', icon: '🗡️', dmg: 12 },
    { name: 'Арбалет Драконоборца', icon: '🏹', dmg: 17 },
    { name: 'Ледяной Лук', icon: '🏹', dmg: 15 },
    { name: 'Кастеты Ярости', icon: '🥊', dmg: 16 },
    { name: 'Паровой Клинок', icon: '⚙️', dmg: 22 },
    { name: 'Молот Завета', icon: '🔨', dmg: 24 },
    { name: 'Секира Разрушения', icon: '🪓', dmg: 28 },
    { name: 'Двуручник Бессмертного', icon: '⚔️', dmg: 32 },
    { name: 'Коса Жнеца Бездны', icon: '🪓', dmg: 35 },
    { name: 'Светящийся Катана', icon: '⚔️', dmg: 30 },
    { name: 'Огненный Трезубец', icon: '🔱', dmg: 26 },
    { name: 'Скипетр Всевластия', icon: '🪄', dmg: 29 },
    { name: 'Кинжал Душегуб', icon: '🗡️', dmg: 25 },
  ],
  helmet: [
    { name: 'Кожаный капюшон', icon: '🪖', armor: 3, hp: 10 },
    { name: 'Стальной салад', icon: '🪖', armor: 6, hp: 20 },
    { name: 'Титановый рогач', icon: '🪖', armor: 12, hp: 45 },
    { name: 'Астральный венец', icon: '👑', armor: 8, hp: 60 },
    { name: 'Шлем Дракона', icon: '🪖', armor: 15, hp: 80 },
    { name: 'Корона Бездны', icon: '👑', armor: 22, hp: 120 },
    { name: 'Маска Огненного Демона', icon: '🎭', armor: 18, hp: 95 },
    { name: 'Шлем Несокрушимого Владыки', icon: '🪖', armor: 26, hp: 140 },
    { name: 'Капюшон Теневого Клинка', icon: '🪖', armor: 14, hp: 75 },
    { name: 'Венец Звездного Неба', icon: '👑', armor: 20, hp: 110 },
  ],
  armor: [
    { name: 'Кожаная куртка', icon: '🧥', armor: 5, hp: 25 },
    { name: 'Кольчуга Паладина', icon: '🛡️', armor: 10, hp: 50 },
    { name: 'Латный панцирь', icon: '🛡️', armor: 18, hp: 90 },
    { name: 'Одеяние тени', icon: '🧥', armor: 12, hp: 70 },
    { name: 'Драконий панцирь', icon: '🛡️', armor: 25, hp: 140 },
    { name: 'Панцирь Титана', icon: '🛡️', armor: 35, hp: 200 },
    { name: 'Мантия Астрального Архимага', icon: '🥋', armor: 20, hp: 160 },
    { name: 'Плита Несокрушимости', icon: '🛡️', armor: 40, hp: 250 },
    { name: 'Жилет Алого Вампира', icon: '🧥', armor: 22, hp: 150 },
  ],
  gloves: [
    { name: 'Тканевые перчатки', icon: '🧤', armor: 2, hp: 8, g: 'p' },
    { name: 'Кожаные краги', icon: '🧤', armor: 4, hp: 18, g: 'p' },
    { name: 'Латные рукавицы', icon: '🧤', armor: 8, hp: 35, g: 'p' },
    { name: 'Перчатки убийцы', icon: '🧤', armor: 10, hp: 45, g: 'p' },
    { name: 'Драконьи когти', icon: '🧤', armor: 15, hp: 75, g: 'p' },
    { name: 'Рукавицы Пламенного Дракона', icon: '🧤', armor: 18, hp: 90, g: 'p' },
    { name: 'Перчатки Астрального Шока', icon: '🧤', armor: 14, hp: 70, g: 'p' },
  ],
  kneepads: [
    { name: 'Кожаные щитки', icon: '🦵', armor: 2, hp: 10, g: 'p' },
    { name: 'Стальные наколенники', icon: '🦵', armor: 5, hp: 22, g: 'p' },
    { name: 'Наколенники Титана', icon: '🦵', armor: 10, hp: 45, g: 'p' },
    { name: 'Щитки Несокрушимого Защитника', icon: '🦵', armor: 16, hp: 70, g: 'p' },
    { name: 'Наколенники Алого Легиона', icon: '🦵', armor: 20, hp: 95, g: 'p' },
  ],
  shoulders: [
    { name: 'Кожаные наплечники', icon: '🎽', armor: 3, hp: 12, g: 'p' },
    { name: 'Стальные эполеты', icon: '🎽', armor: 7, hp: 28, g: 'p' },
    { name: 'Наплечники Титана', icon: '🎽', armor: 14, hp: 60, g: 'p' },
    { name: 'Эполеты Драконьего Рыцаря', icon: '🎽', armor: 22, hp: 100, g: 'p' },
  ],
  boots: [
    { name: 'Легкие сапоги', icon: '🥾', armor: 2, hp: 10, g: 'p' },
    { name: 'Кованые ботинки', icon: '🥾', armor: 5, hp: 22, g: 'p' },
    { name: 'Боевые сабатоны', icon: '🥾', armor: 9, hp: 40, g: 'p' },
    { name: 'Сапоги Скорости Ветра', icon: '🥾', armor: 12, hp: 55, g: 'p' },
    { name: 'Сабатоны Повелителя Бездны', icon: '🥾', armor: 18, hp: 90, g: 'p' },
  ],
  pants: [
    { name: 'Холщовые штаны', icon: '👖', armor: 2, hp: 12, g: 'p' },
    { name: 'Кожаные поножи', icon: '👖', armor: 5, hp: 25, g: 'p' },
    { name: 'Латные поножи', icon: '👖', armor: 10, hp: 50, g: 'p' },
    { name: 'Поножи Титана', icon: '👖', armor: 16, hp: 80, g: 'p' },
    { name: 'Штаны Древнего Чернокнижника', icon: '👖', armor: 22, hp: 110, g: 'p' },
  ],
  ring: [
    { name: 'Медное кольцо', icon: '💍', hp: 10, g: 'n' },
    { name: 'Серебряное кольцо', icon: '💍', hp: 20, g: 'n' },
    { name: 'Золотое кольцо', icon: '💍', hp: 35, g: 'n' },
    { name: 'Кольцо Огня', icon: '💍', hp: 45, g: 'n' },
    { name: 'Рунический перстень', icon: '💍', hp: 60, g: 'n' },
    { name: 'Перстень Бездны', icon: '💍', hp: 85, g: 'n' },
    { name: 'Кольцо Бессмертной Души', icon: '💍', hp: 120, g: 'n' },
  ],
  earring: [
    { name: 'Медная серьга', icon: '📿', hp: 8, g: 'f' },
    { name: 'Серебряная клипса', icon: '📿', hp: 18, g: 'f' },
    { name: 'Золотая серьга', icon: '📿', hp: 30, g: 'f' },
    { name: 'Серьга Звезд', icon: '📿', hp: 50, g: 'f' },
    { name: 'Подвеска Космического Дракона', icon: '📿', hp: 80, g: 'f' },
  ],
  amulet: [
    { name: 'Амулет Силы', icon: '🔮', hp: 25 },
    { name: 'Талисман Мудрости', icon: '🔮', hp: 45 },
    { name: 'Кулон Дракона', icon: '🔮', hp: 70 },
    { name: 'Око Бездны', icon: '👁️', hp: 100 },
    { name: 'Сердце Огненного Титана', icon: '💎', hp: 150 },
  ],
  cloak: [
    { name: 'Шерстяной плащ', icon: '🧣', armor: 2, hp: 10 },
    { name: 'Плащ Теневого Вора', icon: '🧣', armor: 5, hp: 25 },
    { name: 'Драконий Крылач', icon: '🧣', armor: 10, hp: 50 },
    { name: 'Саван Вечного Мрака', icon: '🧣', armor: 18, hp: 95 },
  ],
  banner: [
    { name: 'Знамя Гильдии', icon: '🚩', hp: 20 },
    { name: 'Стяг Победы', icon: '🚩', hp: 45 },
    { name: 'Штандарт Бездны', icon: '🚩', hp: 80 },
    { name: 'Хоругвь Божественного Света', icon: '🚩', hp: 130 },
  ],
};

export const SETS: SetDef[] = [
  {
    id: 'set_dragon',
    name: 'Комплект Драконьего Владыки',
    icon: '🐉',
    color: '#ef4444',
    pieces: ['Шлем Дракона', 'Драконий панцирь', 'Драконьи когти', 'Драконий Крылач'],
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
    pieces: ['Перчатки убийцы', 'Одеяние тени', 'Плащ Теневого Вора'],
    bonuses: [
      { reqPieces: 2, desc: '+20% к урону и критам', dmgBonus: 20, critBonus: 15 },
      { reqPieces: 3, desc: '+40% к криту и +20% к скорости', critBonus: 40 },
    ],
  },
  {
    id: 'set_titan',
    name: 'Комплект Защитника Титана',
    icon: '🛡️',
    color: '#38bdf8',
    pieces: ['Панцирь Титана', 'Титановый рогач', 'Наплечники Титана', 'Поножи Титана'],
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
    pieces: ['Астральный венец', 'Талисман Мудрости', 'Серьга Звезд', 'Перстень Бездны'],
    bonuses: [
      { reqPieces: 2, desc: '+25% к получаемому опыту', xpBonus: 25 },
      { reqPieces: 4, desc: '+60% к опыту и +30% к урону', xpBonus: 60, dmgBonus: 30 },
    ],
  },
  {
    id: 'set_fortune',
    name: 'Комплект Фортуны Сокровищ',
    icon: '💰',
    color: '#facc15',
    pieces: ['Золотое кольцо', 'Золотая серьга', 'Штандарт Бездны'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к выпадающему золоту', goldBonus: 35 },
      { reqPieces: 3, desc: '+80% к золоту и +40% к опыту', goldBonus: 80, xpBonus: 40 },
    ],
  },
  {
    id: 'set_paladin',
    name: 'Комплект Несокрушимого Паладина',
    icon: '☀️',
    color: '#fbbf24',
    pieces: ['Молот Завета', 'Латный панцирь', 'Латные рукавицы', 'Стяг Победы'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к Броне и +20% HP', armorBonus: 30, hpBonus: 20 },
      { reqPieces: 4, desc: '+50% к Броне, +40% HP и +25% Урона', armorBonus: 50, hpBonus: 40, dmgBonus: 25 },
    ],
  },
  {
    id: 'set_berserk',
    name: 'Комплект Неистовой Ярости',
    icon: '🪓',
    color: '#dc2626',
    pieces: ['Секира Разрушения', 'Латные поножи', 'Боевые сабатоны'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к Урону', dmgBonus: 35 },
      { reqPieces: 3, desc: '+70% к Урону и +25% Крита', dmgBonus: 70, critBonus: 25 },
    ],
  },
  {
    id: 'set_vampire',
    name: 'Комплект Алого Вампира',
    icon: '🩸',
    color: '#e11d48',
    pieces: ['Амулет Силы', 'Око Бездны', 'Кольцо Огня'],
    bonuses: [
      { reqPieces: 2, desc: '+25% HP и +15% Урона', hpBonus: 25, dmgBonus: 15 },
      { reqPieces: 3, desc: '+50% HP и +35% Урона', hpBonus: 50, dmgBonus: 35 },
    ],
  },
];

export function getSetById(id: string): SetDef | null {
  return SETS.find(s => s.id === id) ?? null;
}

const ADJECTIVES = [
  { name: 'Древний', color: '#94a3b8' },
  { name: 'Теневой', color: '#a855f7' },
  { name: 'Огненный', color: '#f97316' },
  { name: 'Ледяной', color: '#38bdf8' },
  { name: 'Священный', color: '#facc15' },
  { name: 'Проклятый', color: '#ef4444' },
  { name: 'Сияющий', color: '#fde047' },
  { name: 'Призрачный', color: '#a7f3d0' },
  { name: 'Хаотический', color: '#ec4899' },
  { name: 'Абсолютный', color: '#e0e7ff' },
  { name: 'Ядовитый', color: '#84cc16' },
  { name: 'Звёздный', color: '#38bdf8' },
  { name: 'Грозовой', color: '#facc15' },
];

const SUFFIXES = [
  'Ярости', 'Бури', 'Света', 'Теней', 'Бездны',
  'Вечности', 'Хаоса', 'Крови', 'Фортуны', 'Титанов',
];

export function generateItem(level: number, forceRarity?: RarityId): Item {
  const slotKindKeys = Object.keys(BASES) as SlotKind[];
  const slot = slotKindKeys[Math.floor(Math.random() * slotKindKeys.length)];
  const bases = BASES[slot];
  const baseDef = bases[Math.floor(Math.random() * bases.length)];

  let rarity = forceRarity;
  if (!rarity) {
    const totalW = RARITIES.reduce((s, r) => s + r.weight, 0);
    let rnd = Math.random() * totalW;
    rarity = RARITIES[0].id;
    for (const r of RARITIES) {
      if (rnd <= r.weight) { rarity = r.id; break; }
      rnd -= r.weight;
    }
  }

  const rDef = rarityById(rarity);

  let setId: string | undefined;
  if ((rarity === 'epic' || rarity === 'legendary' || rarity === 'mythic' || rarity === 'divine') && Math.random() < 0.35) {
    const matchingSets = SETS.filter(s => s.pieces.some(p => p.toLowerCase().includes(baseDef.name.toLowerCase())));
    if (matchingSets.length > 0) {
      setId = matchingSets[Math.floor(Math.random() * matchingSets.length)].id;
    }
  }

  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const suf = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];

  let fullName = `${declinePrefix(adj.name, baseDef.g)} ${baseDef.name}`;
  if (rarity === 'legendary' || rarity === 'mythic' || rarity === 'divine') {
    fullName += ` ${suf}`;
  }

  const ilvl = Math.max(1, level);
  const mult = rDef.mult * (1 + (ilvl - 1) * 0.15);

  const base: Item['base'] = {};
  if (baseDef.dmg) base.dmg = Math.floor(baseDef.dmg * mult);
  if (baseDef.armor) base.armor = Math.floor(baseDef.armor * mult);
  if (baseDef.hp) base.hp = Math.floor(baseDef.hp * mult);

  const affixes: ItemAffix[] = [];
  const possibleStats: ItemAffix['stat'][] = ['str', 'agi', 'vit', 'int', 'end', 'luk', 'wis', 'per', 'cha', 'wil', 'crit', 'speed', 'gold', 'xp'];
  for (let i = 0; i < rDef.affixes; i++) {
    const st = possibleStats[Math.floor(Math.random() * possibleStats.length)];
    const val = st === 'crit' || st === 'speed' ? Math.floor(2 + Math.random() * 5 * mult) : Math.floor(3 + Math.random() * 8 * mult);
    affixes.push({ stat: st, value: val });
  }

  const baseVal = (base.dmg ?? 0) * 2 + (base.armor ?? 0) * 1.5 + (base.hp ?? 0) * 0.5;
  const score = Math.floor(baseVal + rDef.affixes * 12 * rDef.mult + ilvl * 4);
  const sellPrice = Math.floor(score * 0.8 + ilvl * 2);

  return {
    id: `it_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: fullName,
    slot,
    rarity,
    ilvl,
    icon: baseDef.icon,
    base,
    affixes,
    sellPrice,
    score,
    setId,
  };
}

export function getItemLore(item: Item): string {
  const seed = item.name.length + item.ilvl;
  
  if (item.rarity === 'common') {
    const stories = [
      '«Простой предмет армейской ковки, созданный без лишних изысков кузнецами срединных земель.»',
      '«Обычное надежное снаряжение, прослужившее не одному стражнику в походах против мелких монстров.»',
      '«Простая ковка из стандартной стали. Сохраняет хорошую остроту и выдерживает тяжелые тренировки.»',
    ];
    return stories[seed % stories.length];
  }

  if (item.rarity === 'uncommon') {
    const stories = [
      '«Закаленное в пламени приграничных кузниц снаряжение. Хранит слабые следы первобытных рунических чар.»',
      '«Изготовлено мастера́ми ремесленных гильдий. Прочность сплава проверена в стычках с заставами гоблинов.»',
      '«На поверхности видны резные защитные символы. Оружие и доспехи этого качества ценятся опытными наемниками.»',
    ];
    return stories[seed % stories.length];
  }

  if (item.rarity === 'rare') {
    const stories = [
      '«Снаряжение былых ветеранов гильдии Искателей. Качественная закаленная сталь и древние узоры наделяют владельца небывалой стойкостью и уверенностью в бою.»',
      '«Принадлежало элитному офицеру подземелий. Овеяно астральными чарами, повышающими реакцию и силу атак.»',
      '«Изготовлено по восстановленным чертежам древних гномьих кузниц. Легкое, но невероятно прочное.»',
    ];
    return stories[seed % stories.length];
  }

  if (item.rarity === 'epic') {
    const stories = [
      '«Редчайший артефакт, выкованный мастера́ми драконьих кланов из астральных металлов. Внутри конструкции мерцает древнее стихийное пламя, дарующее мощь и сокрушительную силу в жестоких схватках.»',
      '«Извлечено из глубоких подземных гробниц древних королей. Покрыто руническими письменами, защищающими от проклятий и усиливающими критический урон.»',
      '«Создано из переплавленных метеоритов. Снаряжение обладает собственной аурой, заставляющей врагов терять координацию.»',
    ];
    return stories[seed % stories.length];
  }

  if (item.rarity === 'legendary') {
    const stories = [
      '«Легендарная реликвия эпохи Перворожденных Титанов. По преданию, этот предмет был закален в драконьей крови и впитал в себя ярость сотен забытых битв Бездны. Его присутствие на поле боя заставляет содрогаться даже самых свирепых чудовищ и дарует владельцу непревзойденное могущество.»',
      '«Создано древними эльфийскими чародеями во время Первой Войны Созвездий. Впитало чистую манию и жизненную энергию погибших владык, пробивая любую броню.»',
    ];
    return stories[seed % stories.length];
  }

  if (item.rarity === 'mythic') {
    const stories = [
      '«Мифический сокрушитель эпохи Великого Разлома. Отлитый из астрального метеоритного железа на самом дне Огненной Пропасти. Его дух помнит падение старых богов и гибель целых древних цивилизаций. Каждый изгиб пропитан неограниченной мифической энергией Бездны, разрывающей врагов на куски.»',
      '«Овеян легендами мрачных фолиантов. Владелец этого мифического артефакта получает способность повелевать временем и разрушать самые стойкие барьеры.»',
    ];
    return stories[seed % stories.length];
  }

  // Divine
  return '«Священный артефакт Божественного Создания. Сотворён лично древними архидемонами и небесными зодчими до зарождения смертных миров. Вылупился из чистого света первозданных звёзд. Владелец этого предмета обретает абсолютную власть над жизнью, смертью и стихиями бытия.»';
}

export const AFFIX_LABELS: Record<string, { name: string; icon: string; suffix?: string }> = {
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
  dmg: { name: 'Доп. Урон', icon: '⚔️' },
  armor: { name: 'Доп. Броня', icon: '🛡️' },
  hp: { name: 'Доп. Здоровье', icon: '❤️' },
  crit: { name: 'Шанс Крита', icon: '💥', suffix: '%' },
  speed: { name: 'Скорость', icon: '⚡', suffix: '%' },
  gold: { name: 'Бонус Золота', icon: '💰', suffix: '%' },
  xp: { name: 'Бонус Опыта', icon: '📈', suffix: '%' },
};

export interface PotionItemDef {
  id: string;
  name: string;
  icon: string;
  rarity: RarityId;
  desc: string;
  sellPrice: number;
}

export const POTIONS_CATALOG: PotionItemDef[] = [
  { id: 'pot_hp_small', name: 'Малое Зелье Здоровья', icon: '🧪', rarity: 'common', desc: 'Восстанавливает +200 HP.', sellPrice: 15 },
  { id: 'pot_hp_mid', name: 'Среднее Зелье Здоровья', icon: '🧪', rarity: 'uncommon', desc: 'Восстанавливает +500 HP.', sellPrice: 35 },
  { id: 'pot_hp_grand', name: 'Великое Зелье Здоровья', icon: '🧪', rarity: 'rare', desc: 'Восстанавливает +100% HP и даёт +300 Щита.', sellPrice: 85 },
  { id: 'pot_mana_small', name: 'Малый Эликсир Маны', icon: '🔮', rarity: 'common', desc: 'Восстанавливает +150 Маны.', sellPrice: 20 },
  { id: 'pot_mana_grand', name: 'Астральный Эликсир Маны', icon: '🔮', rarity: 'rare', desc: 'Восстанавливает +100% Маны и сбрасывает КД.', sellPrice: 110 },
  { id: 'pot_berserk', name: 'Настойка Яростного Берсерка', icon: '🍷', rarity: 'rare', desc: '+35% Урона и +20% Крита.', sellPrice: 150 },
  { id: 'pot_ironhide', name: 'Завар Твёрдой Стали', icon: '🛡️', rarity: 'uncommon', desc: '+50% Брони.', sellPrice: 90 },
  { id: 'pot_fortune', name: 'Зелье Удачной Зачистки', icon: '🍀', rarity: 'epic', desc: '+100% Золота и +75% Опыта.', sellPrice: 220 },
  { id: 'pot_swift', name: 'Эликсир Стремительности', icon: '⚡', rarity: 'uncommon', desc: '+25% К Скорости Атаки.', sellPrice: 75 },
  { id: 'pot_crit', name: 'Настойка Меткости', icon: '🎯', rarity: 'rare', desc: '+25% К Крит Шансу.', sellPrice: 130 },
  { id: 'pot_astral', name: 'Катализатор Астральной Руды', icon: '💎', rarity: 'epic', desc: 'Дает +15 ед. Астральной Руды.', sellPrice: 300 },
  { id: 'pot_titan', name: 'Эликсир Титанического Щита', icon: '🛡️', rarity: 'epic', desc: 'Наккладывает +600 ед. Астрального Щита.', sellPrice: 280 },
  { id: 'pot_rejuvenation', name: 'Эликсир Омоложения', icon: '✨', rarity: 'rare', desc: 'Восстанавливает 100% HP и 100% Маны.', sellPrice: 160 },
  { id: 'pot_vampirism', name: 'Тоник Вампиризма', icon: '🩸', rarity: 'rare', desc: '+20% Похищения жизни.', sellPrice: 140 },
  { id: 'pot_alchemist_master', name: 'Высший Эликсир Алхимика', icon: '👑', rarity: 'legendary', desc: 'Полный комплекс усилений всех характеристик.', sellPrice: 500 },
];
