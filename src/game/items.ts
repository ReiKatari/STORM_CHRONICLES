import type { Item, ItemAffix, RarityDef, RarityId, SlotKind } from './types';

// ===================== RARITIES (7 tiers) =====================
export const RARITIES: RarityDef[] = [
  { id: 'common',    name: 'Обычный',     color: '#9ca3af', glow: 'rgba(156,163,175,0.35)', mult: 1.0,  affixes: 0, weight: 100 },
  { id: 'uncommon',  name: 'Необычный',   color: '#4ade80', glow: 'rgba(74,222,128,0.4)',  mult: 1.25, affixes: 1, weight: 55 },
  { id: 'rare',      name: 'Редкий',      color: '#60a5fa', glow: 'rgba(96,165,250,0.45)', mult: 1.6,  affixes: 2, weight: 26 },
  { id: 'epic',      name: 'Эпический',   color: '#c084fc', glow: 'rgba(192,132,252,0.5)', mult: 2.1,  affixes: 3, weight: 10 },
  { id: 'legendary', name: 'Легендарный', color: '#fb923c', glow: 'rgba(251,146,60,0.55)', mult: 2.8,  affixes: 4, weight: 3.4 },
  { id: 'mythic',    name: 'Мифический',  color: '#f472b6', glow: 'rgba(244,114,182,0.6)', mult: 3.7,  affixes: 5, weight: 0.9 },
  { id: 'divine',    name: 'Божественный',color: '#facc15', glow: 'rgba(250,204,21,0.7)',  mult: 5.0,  affixes: 6, weight: 0.18 },
];
export const rarityById = (id: RarityId) => RARITIES.find(r => r.id === id)!;

// ===================== SLOT DEFINITIONS =====================
export const SLOT_DEFS: { kind: SlotKind; name: string; icon: string }[] = [
  { kind: 'weapon',    name: 'Оружие',      icon: '⚔️' },
  { kind: 'helmet',    name: 'Шлем',        icon: '🪖' },
  { kind: 'armor',     name: 'Броня',       icon: '🛡️' },
  { kind: 'gloves',    name: 'Перчатки',    icon: '🧤' },
  { kind: 'kneepads',  name: 'Наколенники', icon: '🦵' },
  { kind: 'shoulders', name: 'Наплечники',  icon: '🎽' },
  { kind: 'boots',     name: 'Сапоги',      icon: '🥾' },
  { kind: 'pants',     name: 'Штаны',       icon: '👖' },
  { kind: 'ring',      name: 'Кольцо',      icon: '💍' },
  { kind: 'earring',   name: 'Серьга',      icon: '📿' },
  { kind: 'amulet',    name: 'Амулет',      icon: '🔮' },
  { kind: 'cloak',     name: 'Плащ',        icon: '🧣' },
  { kind: 'banner',    name: 'Знамя',       icon: '🚩' },
];

// ===================== ITEM BASES (per slot, ~16 each) =====================
const BASES: Record<SlotKind, { name: string; icon: string }[]> = {
  weapon: [
    { name: 'Меч', icon: '🗡️' }, { name: 'Топор', icon: '🪓' }, { name: 'Молот', icon: '🔨' },
    { name: 'Копьё', icon: '🔱' }, { name: 'Посох', icon: '🪄' }, { name: 'Кинжал', icon: '🗡️' },
    { name: 'Арбалет', icon: '🏹' }, { name: 'Лук', icon: '🏹' }, { name: 'Катана', icon: '⚔️' },
    { name: 'Глефа', icon: '⚔️' }, { name: 'Рапира', icon: '⚔️' }, { name: 'Клеймор', icon: '⚔️' },
    { name: 'Скипетр', icon: '🪄' }, { name: 'Булава', icon: '🔨' }, { name: 'Алебарда', icon: '🪓' },
    { name: 'Жезл', icon: '🪄' },
  ],
  helmet: [
    { name: 'Капюшон', icon: '🪖' }, { name: 'Шлем', icon: '🪖' }, { name: 'Барбют', icon: '🪖' },
    { name: 'Кольчужный койф', icon: '🪖' }, { name: 'Тиара', icon: '👑' }, { name: 'Корона', icon: '👑' },
    { name: 'Маска', icon: '🎭' }, { name: 'Шляпа', icon: '🎩' }, { name: 'Обруч', icon: '👑' },
    { name: 'Кабассет', icon: '🪖' }, { name: 'Салад', icon: '🪖' }, { name: 'Армет', icon: '🪖' },
    { name: 'Венец', icon: '👑' }, { name: 'Капор', icon: '🪖' }, { name: 'Морион', icon: '🪖' },
    { name: 'Червяной шлем', icon: '🪖' },
  ],
  armor: [
    { name: 'Куртка', icon: '🛡️' }, { name: 'Кольчуга', icon: '🛡️' }, { name: 'Кираса', icon: '🛡️' },
    { name: 'Латы', icon: '🛡️' }, { name: 'Хауберк', icon: '🛡️' }, { name: 'Бригандина', icon: '🛡️' },
    { name: 'Роба', icon: '🥻' }, { name: 'Мантия', icon: '🥻' }, { name: 'Жилет', icon: '🦺' },
    { name: 'Доспех', icon: '🛡️' }, { name: 'Панцирь', icon: '🛡️' }, { name: 'Кожаный доспех', icon: '🛡️' },
    { name: 'Чешуя', icon: '🛡️' }, { name: 'Хитон', icon: '🥻' }, { name: 'Сурама', icon: '🛡️' },
    { name: 'Пластрон', icon: '🛡️' },
  ],
  gloves: [
    { name: 'Перчатки', icon: '🧤' }, { name: 'Рукавицы', icon: '🧤' }, { name: 'Латные рукавицы', icon: '🧤' },
    { name: 'Наручи', icon: '🧤' }, { name: 'Когти', icon: '🧤' }, { name: 'Захваты', icon: '🧤' },
    { name: 'Митенки', icon: '🧤' }, { name: 'Красчуги', icon: '🧤' }, { name: 'Боевые перчатки', icon: '🧤' },
    { name: 'Шёлковые перчатки', icon: '🧤' }, { name: 'Кандалы', icon: '⛓️' }, { name: 'Браслеты', icon: '🧤' },
    { name: 'Лапы', icon: '🧤' }, { name: 'Длани', icon: '🧤' }, { name: 'Тикаи', icon: '🧤' },
    { name: 'Оковы', icon: '⛓️' },
  ],
  kneepads: [
    { name: 'Наколенники', icon: '🦵' }, { name: 'Коленные щитки', icon: '🦵' }, { name: 'Полиены', icon: '🦵' },
    { name: 'Коленники', icon: '🦵' }, { name: 'Латные наколенники', icon: '🦵' }, { name: 'Стражи колен', icon: '🦵' },
    { name: 'Жабры колен', icon: '🦵' }, { name: 'Охраны', icon: '🦵' }, { name: 'Плетёные наколенники', icon: '🦵' },
    { name: 'Чешуйчатые щитки', icon: '🦵' }, { name: 'Костяные наколенники', icon: '🦵' }, { name: 'Быстрые наколенники', icon: '🦵' },
    { name: 'Ритуальные щитки', icon: '🦵' }, { name: 'Оковы колен', icon: '🦵' }, { name: 'Поляры', icon: '🦵' },
    { name: 'Коленные пластины', icon: '🦵' },
  ],
  shoulders: [
    { name: 'Наплечники', icon: '🎽' }, { name: 'Паулдроны', icon: '🎽' }, { name: 'Эполеты', icon: '🎽' },
    { name: 'Плечники', icon: '🎽' }, { name: 'Оплечье', icon: '🎽' }, { name: 'Наплечные пластины', icon: '🎽' },
    { name: 'Шипованные наплечники', icon: '🎽' }, { name: 'Крылатые наплечники', icon: '🎽' }, { name: 'Мантия плеч', icon: '🎽' },
    { name: 'Боевые эполеты', icon: '🎽' }, { name: 'Костяные плечи', icon: '🎽' }, { name: 'Гвардейские плечи', icon: '🎽' },
    { name: 'Демонические плечи', icon: '🎽' }, { name: 'Ангельские крылья', icon: '🎽' }, { name: 'Грозовые плечи', icon: '🎽' },
    { name: 'Титановые наплечники', icon: '🎽' },
  ],
  boots: [
    { name: 'Сапоги', icon: '🥾' }, { name: 'Ботинки', icon: '🥾' }, { name: 'Сабатоны', icon: '🥾' },
    { name: 'Башмаки', icon: '🥾' }, { name: 'Постолы', icon: '🥾' }, { name: 'Латные сапоги', icon: '🥾' },
    { name: 'Быстрые сапоги', icon: '🥾' }, { name: 'Мокасины', icon: '🥾' }, { name: 'Кованые сапоги', icon: '🥾' },
    { name: 'Следопытские ботинки', icon: '🥾' }, { name: 'Крылатые сандалии', icon: '🥾' }, { name: 'Тяжёлые сабатоны', icon: '🥾' },
    { name: 'Теневые постолы', icon: '🥾' }, { name: 'Лёгкие ботинки', icon: '🥾' }, { name: 'Гномьи сапоги', icon: '🥾' },
    { name: 'Эльфийские постолы', icon: '🥾' },
  ],
  pants: [
    { name: 'Штаны', icon: '👖' }, { name: 'Поножи', icon: '👖' }, { name: 'Кюлоты', icon: '👖' },
    { name: 'Леггинсы', icon: '👖' }, { name: 'Бриджи', icon: '👖' }, { name: 'Латные поножи', icon: '👖' },
    { name: 'Кольчужные штаны', icon: '👖' }, { name: 'Плащ-ноги', icon: '👖' }, { name: 'Юбка', icon: '👗' },
    { name: 'Килт', icon: '👗' }, { name: 'Хакама', icon: '👖' }, { name: 'Гамаши', icon: '👖' },
    { name: 'Кожаные штаны', icon: '👖' }, { name: 'Боевые поножи', icon: '👖' }, { name: 'Стеганые штаны', icon: '👖' },
    { name: 'Шаровары', icon: '👖' },
  ],
  ring: [
    { name: 'Кольцо', icon: '💍' }, { name: 'Перстень', icon: '💍' }, { name: 'Обручальное кольцо', icon: '💍' },
    { name: 'Печатка', icon: '💍' }, { name: 'Серебряное кольцо', icon: '💍' }, { name: 'Золотое кольцо', icon: '💍' },
    { name: 'Костяное кольцо', icon: '💍' }, { name: 'Руническое кольцо', icon: '💍' }, { name: 'Кольцо-змея', icon: '💍' },
    { name: 'Кольцо-череп', icon: '💍' }, { name: 'Обруч силы', icon: '💍' }, { name: 'Кольцо власти', icon: '💍' },
    { name: 'Плетёное кольцо', icon: '💍' }, { name: 'Кольцо судьбы', icon: '💍' }, { name: 'Кольцо-глаз', icon: '💍' },
    { name: 'Вечное кольцо', icon: '💍' },
  ],
  earring: [
    { name: 'Серьга', icon: '📿' }, { name: 'Серьга-капля', icon: '📿' }, { name: 'Серьга-кольцо', icon: '📿' },
    { name: 'Клипса', icon: '📿' }, { name: 'Серьга-коготь', icon: '📿' }, { name: 'Серьга-перо', icon: '📿' },
    { name: 'Серьга-звезда', icon: '📿' }, { name: 'Серьга-луна', icon: '📿' }, { name: 'Серьга-череп', icon: '📿' },
    { name: 'Серьга-руна', icon: '📿' }, { name: 'Золотая серьга', icon: '📿' }, { name: 'Жемчужная серьга', icon: '📿' },
    { name: 'Серьга-слеза', icon: '📿' }, { name: 'Серьга-шип', icon: '📿' }, { name: 'Костяная серьга', icon: '📿' },
    { name: 'Серьга ветров', icon: '📿' },
  ],
  amulet: [
    { name: 'Амулет', icon: '🔮' }, { name: 'Подвеска', icon: '🔮' }, { name: 'Талисман', icon: '🔮' },
    { name: 'Ожерелье', icon: '📿' }, { name: 'Медальон', icon: '🏅' }, { name: 'Кулон', icon: '🔮' },
    { name: 'Оберег', icon: '🔮' }, { name: 'Филактерия', icon: '🔮' }, { name: 'Скарабей', icon: '🔮' },
    { name: 'Глаз дракона', icon: '🔮' }, { name: 'Сердце бури', icon: '🔮' }, { name: 'Звёздный камень', icon: '🔮' },
    { name: 'Рунный камень', icon: '🔮' }, { name: 'Клык зверя', icon: '🔮' }, { name: 'Капля крови', icon: '🔮' },
    { name: 'Осколок души', icon: '🔮' },
  ],
  cloak: [
    { name: 'Плащ', icon: '🧣' }, { name: 'Накидка', icon: '🧣' }, { name: 'Мантия', icon: '🧣' },
    { name: 'Кейп', icon: '🧣' }, { name: 'Шаль', icon: '🧣' }, { name: 'Бурнус', icon: '🧣' },
    { name: 'Плащ теней', icon: '🧣' }, { name: 'Плащ ветров', icon: '🧣' }, { name: 'Меховой плащ', icon: '🧣' },
    { name: 'Плащ странника', icon: '🧣' }, { name: 'Королевская мантия', icon: '🧣' }, { name: 'Плащ невидимости', icon: '🧣' },
    { name: 'Плащ-парус', icon: '🧣' }, { name: 'Плащ-крыло', icon: '🧣' }, { name: 'Паутинный плащ', icon: '🧣' },
    { name: 'Плащ пепла', icon: '🧣' },
  ],
  banner: [
    { name: 'Знамя', icon: '🚩' }, { name: 'Штандарт', icon: '🚩' }, { name: 'Вымпел', icon: '🚩' },
    { name: 'Горгулья-флаг', icon: '🚩' }, { name: 'Боевое знамя', icon: '🚩' }, { name: 'Тотем', icon: '🗿' },
    { name: 'Стяг', icon: '🚩' }, { name: 'Гонфалон', icon: '🚩' }, { name: 'Хоругвь', icon: '🚩' },
    { name: 'Знамя клана', icon: '🚩' }, { name: 'Флаг победы', icon: '🚩' }, { name: 'Знамя войны', icon: '🚩' },
    { name: 'Кровавый стяг', icon: '🚩' }, { name: 'Знамя света', icon: '🚩' }, { name: 'Теневое знамя', icon: '🚩' },
    { name: 'Древнее знамя', icon: '🚩' },
  ],
};

// ===================== PREFIXES & SUFFIXES =====================
const PREFIXES: { name: string; affix: ItemAffix }[] = [
  { name: 'Пылающий', affix: { stat: 'dmg', value: 3 } },
  { name: 'Ледяной', affix: { stat: 'armor', value: 2 } },
  { name: 'Громовой', affix: { stat: 'crit', value: 1 } },
  { name: 'Теневой', affix: { stat: 'agi', value: 2 } },
  { name: 'Святой', affix: { stat: 'wil', value: 2 } },
  { name: 'Демонический', affix: { stat: 'str', value: 2 } },
  { name: 'Ангельский', affix: { stat: 'wis', value: 2 } },
  { name: 'Древний', affix: { stat: 'xp', value: 2 } },
  { name: 'Золотой', affix: { stat: 'gold', value: 3 } },
  { name: 'Кровавый', affix: { stat: 'vit', value: 2 } },
  { name: 'Ядовитый', affix: { stat: 'per', value: 2 } },
  { name: 'Железный', affix: { stat: 'end', value: 2 } },
  { name: 'Рунический', affix: { stat: 'int', value: 2 } },
  { name: 'Королевский', affix: { stat: 'cha', value: 2 } },
  { name: 'Волчий', affix: { stat: 'agi', value: 1 } },
  { name: 'Драконий', affix: { stat: 'dmg', value: 4 } },
  { name: 'Проклятый', affix: { stat: 'dmg', value: 5 } },
  { name: 'Благословенный', affix: { stat: 'hp', value: 8 } },
  { name: 'Астральный', affix: { stat: 'int', value: 3 } },
  { name: 'Бездонный', affix: { stat: 'wil', value: 3 } },
  { name: 'Штормовой', affix: { stat: 'speed', value: 2 } },
  { name: 'Скальный', affix: { stat: 'end', value: 3 } },
  { name: 'Солнечный', affix: { stat: 'cha', value: 3 } },
  { name: 'Лунный', affix: { stat: 'wis', value: 3 } },
  { name: 'Звёздный', affix: { stat: 'per', value: 3 } },
  { name: 'Хаотичный', affix: { stat: 'crit', value: 2 } },
  { name: 'Титановый', affix: { stat: 'str', value: 3 } },
  { name: 'Мифриловый', affix: { stat: 'armor', value: 3 } },
  { name: 'Обсидиановый', affix: { stat: 'dmg', value: 4 } },
  { name: 'Кристальный', affix: { stat: 'int', value: 4 } },
  { name: 'Костяной', affix: { stat: 'vit', value: 3 } },
  { name: 'Пепельный', affix: { stat: 'str', value: 4 } },
  { name: 'Северный', affix: { stat: 'end', value: 4 } },
  { name: 'Южный', affix: { stat: 'cha', value: 4 } },
  { name: 'Восточный', affix: { stat: 'agi', value: 4 } },
  { name: 'Западный', affix: { stat: 'per', value: 4 } },
  { name: 'Эфирный', affix: { stat: 'xp', value: 3 } },
  { name: 'Бездны', affix: { stat: 'dmg', value: 6 } },
  { name: 'Вечный', affix: { stat: 'hp', value: 12 } },
  { name: 'Сияющий', affix: { stat: 'gold', value: 5 } },
];

const SUFFIXES: { name: string; affix: ItemAffix }[] = [
  { name: 'Силы', affix: { stat: 'str', value: 2 } },
  { name: 'Ловкости', affix: { stat: 'agi', value: 2 } },
  { name: 'Живучести', affix: { stat: 'vit', value: 2 } },
  { name: 'Разума', affix: { stat: 'int', value: 2 } },
  { name: 'Стойкости', affix: { stat: 'end', value: 2 } },
  { name: 'Удачи', affix: { stat: 'luk', value: 2 } },
  { name: 'Мудрости', affix: { stat: 'wis', value: 2 } },
  { name: 'Восприятия', affix: { stat: 'per', value: 2 } },
  { name: 'Обаяния', affix: { stat: 'cha', value: 2 } },
  { name: 'Воли', affix: { stat: 'wil', value: 2 } },
  { name: 'Разрушения', affix: { stat: 'dmg', value: 3 } },
  { name: 'Защиты', affix: { stat: 'armor', value: 2 } },
  { name: 'Жизни', affix: { stat: 'hp', value: 10 } },
  { name: 'Крита', affix: { stat: 'crit', value: 1 } },
  { name: 'Скорости', affix: { stat: 'speed', value: 1 } },
  { name: 'Жадности', affix: { stat: 'gold', value: 3 } },
  { name: 'Опыта', affix: { stat: 'xp', value: 2 } },
  { name: 'Титана', affix: { stat: 'str', value: 3 } },
  { name: 'Тени', affix: { stat: 'agi', value: 3 } },
  { name: 'Горы', affix: { stat: 'vit', value: 3 } },
  { name: 'Архимага', affix: { stat: 'int', value: 3 } },
  { name: 'Крепости', affix: { stat: 'end', value: 3 } },
  { name: 'Фортуны', affix: { stat: 'luk', value: 3 } },
  { name: 'Пророка', affix: { stat: 'wis', value: 3 } },
  { name: 'Сокола', affix: { stat: 'per', value: 3 } },
  { name: 'Императора', affix: { stat: 'cha', value: 3 } },
  { name: 'Аскета', affix: { stat: 'wil', value: 3 } },
  { name: 'Бури', affix: { stat: 'dmg', value: 4 } },
  { name: 'Несокрушимости', affix: { stat: 'armor', value: 3 } },
  { name: 'Бессмертия', affix: { stat: 'hp', value: 15 } },
  { name: 'Палача', affix: { stat: 'crit', value: 2 } },
  { name: 'Ветра', affix: { stat: 'speed', value: 2 } },
  { name: 'Скупца', affix: { stat: 'gold', value: 5 } },
  { name: 'Гения', affix: { stat: 'xp', value: 3 } },
  { name: 'Бездны', affix: { stat: 'dmg', value: 5 } },
  { name: 'Вечности', affix: { stat: 'hp', value: 20 } },
  { name: 'Хаоса', affix: { stat: 'crit', value: 3 } },
  { name: 'Порядка', affix: { stat: 'armor', value: 4 } },
  { name: 'Возмездия', affix: { stat: 'dmg', value: 6 } },
  { name: 'Истины', affix: { stat: 'per', value: 4 } },
];

// slot → which base stats it rolls
const SLOT_BASE: Record<SlotKind, { dmg?: number; armor?: number; hp?: number }> = {
  weapon:    { dmg: 8, hp: 3 },
  helmet:    { armor: 3, hp: 4 },
  armor:     { armor: 6, hp: 8 },
  gloves:    { dmg: 2, armor: 1 },
  kneepads:  { armor: 2, hp: 3 },
  shoulders: { armor: 3, hp: 3 },
  boots:     { armor: 2, hp: 2 },
  pants:     { armor: 4, hp: 5 },
  ring:      { dmg: 2 },
  earring:   { hp: 3 },
  amulet:    { dmg: 1, hp: 4 },
  cloak:     { armor: 2, hp: 3 },
  banner:    { dmg: 2, hp: 3 },
};

// ===================== RUSSIAN GRAMMAR: gender/number agreement =====================
export type Gender = 'm' | 'f' | 'n' | 'pl';
const WORD_GENDER: Record<string, Gender> = { 'знамя': 'n', 'хоругвь': 'f', 'хакама': 'pl' };
const ADJ_RE = /(ий|ый|ой|ая|яя|ое|ее|ие|ые|ний|ный|ной|вой)$/i;

function wordGender(raw: string): Gender {
  const w = raw.toLowerCase();
  if (WORD_GENDER[w]) return WORD_GENDER[w];
  if (/[ыи]$/.test(w)) return 'pl';
  if (/[ая]$/.test(w)) return 'f';
  if (/[ое]$/.test(w)) return 'n';
  return 'm';
}

export function genderOfBase(name: string): Gender {
  const hyph = name.split('-');
  if (hyph.length > 1) return wordGender(hyph[0]);
  const parts = name.split(' ');
  if (parts.length > 1) {
    return ADJ_RE.test(parts[0]) ? wordGender(parts[parts.length - 1]) : wordGender(parts[0]);
  }
  return wordGender(name);
}

const PREFIX_SPECIAL: Record<string, [string, string, string] | 'fixed'> = {
  'Волчий': ['Волчья', 'Волчье', 'Волчьи'],
  'Драконий': ['Драконья', 'Драконье', 'Драконьи'],
  'Бездны': 'fixed',
};

export function declinePrefix(masc: string, g: Gender): string {
  const sp = PREFIX_SPECIAL[masc];
  if (sp === 'fixed' || g === 'm') return masc;
  if (sp) return sp[g === 'f' ? 0 : g === 'n' ? 1 : 2];
  if (masc.endsWith('ний')) return masc.slice(0, -3) + (g === 'f' ? 'няя' : g === 'n' ? 'нее' : 'ние');
  if (masc.endsWith('ный')) return masc.slice(0, -3) + (g === 'f' ? 'ная' : g === 'n' ? 'ное' : 'ные');
  if (masc.endsWith('вой')) return masc.slice(0, -3) + (g === 'f' ? 'вая' : g === 'n' ? 'вое' : 'вые');
  if (masc.endsWith('ой')) return masc.slice(0, -2) + (g === 'f' ? 'ая' : g === 'n' ? 'ое' : 'ые');
  if (masc.endsWith('ий')) return masc.slice(0, -2) + (g === 'f' ? 'ая' : g === 'n' ? 'ее' : 'ие');
  if (masc.endsWith('ый')) return masc.slice(0, -2) + (g === 'f' ? 'ая' : g === 'n' ? 'ое' : 'ые');
  return masc;
}

let uidCounter = 1;
const uid = () => `it_${Date.now().toString(36)}_${uidCounter++}`;

// weighted rarity roll; luck & bonus shift odds toward higher tiers
export function rollRarity(luckBonus = 0, rarityBonus = 0): RarityId {
  const roll = Math.random() * 100;
  const boost = luckBonus * 0.25 + rarityBonus;
  let acc = 0;
  // check from rarest down: higher boost raises chance of top tiers
  const tiers: [RarityId, number][] = [
    ['divine', 0.18 + boost * 0.03],
    ['mythic', 0.9 + boost * 0.12],
    ['legendary', 3.4 + boost * 0.4],
    ['epic', 10 + boost * 1.1],
    ['rare', 26 + boost * 2.2],
    ['uncommon', 55],
  ];
  let r = roll;
  for (const [id, w] of tiers) {
    acc += w;
    if (r < acc) return id;
  }
  return 'common';
}

export function generateItem(ilvl: number, luckBonus = 0, rarityBonus = 0, forceRarity?: RarityId, forceSlot?: SlotKind): Item {
  const slot: SlotKind = forceSlot ?? SLOT_DEFS[Math.floor(Math.random() * SLOT_DEFS.length)].kind;
  const rarity = rarityById(forceRarity ?? rollRarity(luckBonus, rarityBonus));
  const basePool = BASES[slot];
  const base = basePool[Math.floor(Math.random() * basePool.length)];

  const affixes: ItemAffix[] = [];
  const lvlMult = 1 + ilvl * 0.06;
  const slotBase = SLOT_BASE[slot];
  const itemBase: Item['base'] = {};
  (Object.keys(slotBase) as (keyof typeof slotBase)[]).forEach(k => {
    itemBase[k] = Math.round((slotBase[k]! * lvlMult * rarity.mult) * (0.85 + Math.random() * 0.3));
  });

  // affixes: rarity.affixes count, drawn from prefixes+suffixes pools
  const used = new Set<number>();
  const pool = [...PREFIXES.map(p => ({ n: p.name, a: p.affix, pre: true })), ...SUFFIXES.map(s => ({ n: s.name, a: s.affix, pre: false }))];
  for (let i = 0; i < rarity.affixes; i++) {
    let idx = Math.floor(Math.random() * pool.length);
    let guard = 0;
    while (used.has(idx) && guard++ < 40) idx = Math.floor(Math.random() * pool.length);
    used.add(idx);
    const p = pool[idx];
    affixes.push({
      stat: p.a.stat,
      value: Math.max(1, Math.round(p.a.value * lvlMult * rarity.mult * (0.8 + Math.random() * 0.4))),
    });
  }

  // build name
  const prefix = rarity.affixes >= 1 ? PREFIXES[Math.floor(Math.random() * PREFIXES.length)] : null;
  const suffix = rarity.affixes >= 2 ? SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)] : null;
  let name = base.name;
  const gender = genderOfBase(base.name);
  if (prefix) name = `${declinePrefix(prefix.name, gender)} ${base.name.toLowerCase()}`;
  if (suffix) name += ` ${suffix.name}`;

  const score = Math.round(
    (itemBase.dmg ?? 0) * 3 + (itemBase.armor ?? 0) * 2 + (itemBase.hp ?? 0) * 0.5 +
    affixes.reduce((s, a) => s + a.value * (a.stat === 'dmg' ? 3 : a.stat === 'hp' ? 0.5 : a.stat === 'armor' ? 2 : 1.2), 0)
  );

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
  };
}

export function countCombinations(): number {
  // rough number of distinct items the generator can produce
  const bases = Object.values(BASES).reduce((s, b) => s + b.length, 0);
  return bases * PREFIXES.length * SUFFIXES.length * RARITIES.length * 500; // × ilvls
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
  // deterministic index selection based on item name string char codes
  let charSum = 0;
  for (let i = 0; i < item.name.length; i++) charSum += item.name.charCodeAt(i);
  return pool[charSum % pool.length];
}

