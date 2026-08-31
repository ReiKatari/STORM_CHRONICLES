import type { Item, ItemAffix, RarityDef, RarityId, SlotKind, SetDef } from './types';

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

// HUNDREDS OF BASE ITEMS ACROSS ALL 13 SLOTS
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
    { name: 'Посох Солнечного Феникса', icon: '🪄', dmg: 34 },
    { name: 'Ледяной Клинок Левиафана', icon: '⚔️', dmg: 32 },
    { name: 'Меч Божественного Света', icon: '⚔️', dmg: 38 },
    { name: 'Жезл Проклятых Душ', icon: '🪄', dmg: 31 },
    { name: 'Молот Каменного Великана', icon: '🔨', dmg: 36 },
    { name: 'Рапира Искажения Времени', icon: '🗡️', dmg: 29 },
    { name: 'Парные Клинки Преисподней', icon: '⚔️', dmg: 33 },
    { name: 'Копье Солнечного Луча', icon: '🔱', dmg: 35 },
    { name: 'Клинок Хаотического Разлома', icon: '⚔️', dmg: 37 },
    { name: 'Скипетр Трансмутации', icon: '🪄', dmg: 27 },
    { name: 'Эфирный Кинжал', icon: '🗡️', dmg: 28 },
    { name: 'Трезубец Морского Дракона', icon: '🔱', dmg: 36 },
    { name: 'Гладиус Победителя', icon: '⚔️', dmg: 34 },
    { name: 'Рунический Клинок Одина', icon: '⚔️', dmg: 39 },
    { name: 'Охотничий Лук Вожака', icon: '🏹', dmg: 31 },
    { name: 'Посох Рождения Сверхновой', icon: '🪄', dmg: 42 },
    { name: 'Пылающий Двуручник Ада', icon: '⚔️', dmg: 40 },
    { name: 'Лук Небесного Урагана', icon: '🏹', dmg: 33 },
    { name: 'Скальпель Черного Мора', icon: '🗡️', dmg: 26 },
    { name: 'Дубина Ледяного Йети', icon: '🔨', dmg: 35 },
    { name: 'Копье Ядовитого Жала', icon: '🔱', dmg: 34 },
    { name: 'Якорь Морского Чудовища', icon: '⚓', dmg: 38 },
    { name: 'Изогнутый Сабля Джинна', icon: '⚔️', dmg: 33 },
    { name: 'Клинок Правосудия', icon: '⚔️', dmg: 44 },
    { name: 'Экзекутор Инквизиции', icon: '⚔️', dmg: 36 },
    { name: 'Царский Скипетр Власти', icon: '🪄', dmg: 37 },
    { name: 'Игла Ткача Созвездий', icon: '🪄', dmg: 39 },
    { name: 'Кровавая Коса Затмения', icon: '🪓', dmg: 41 },
    { name: 'Обсидиановый Бастард', icon: '⚔️', dmg: 38 },
    { name: 'Меч Утренней Зари', icon: '⚔️', dmg: 36 },
    { name: 'Клинок Архистратига', icon: '⚔️', dmg: 46 },
    { name: 'Скипетр Астрального Владыки', icon: '🪄', dmg: 45 },
    { name: 'Копье Королевы Валькирий', icon: '🔱', dmg: 43 },
    { name: 'Крушитель Драконов', icon: '🔨', dmg: 48 },
    { name: 'Коса Монарха Тьмы', icon: '🪓', dmg: 47 },
    { name: 'Молот Небесного Гнева', icon: '🔨', dmg: 50 },
    { name: 'Буревестник Семи Ветров', icon: '🏹', dmg: 44 },
    { name: 'Кровавый Эсток Императора', icon: '🗡️', dmg: 45 },
    { name: 'Хроно-Клинок Вечности', icon: '⚔️', dmg: 46 },
    { name: 'Орудие Небесного Стража', icon: '⚔️', dmg: 48 },
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
    { name: 'Венец Огненного Пепла', icon: '👑', armor: 19, hp: 105 },
    { name: 'Корона Вечной Мерзлоты', icon: '👑', armor: 24, hp: 115 },
    { name: 'Шлем Небесного Разряда', icon: '🪖', armor: 21, hp: 125 },
    { name: 'Капюшон Истинной Тьмы', icon: '🪖', armor: 18, hp: 110 },
    { name: 'Шлем Небесного Серафима', icon: '👑', armor: 28, hp: 160 },
    { name: 'Череп Древнего Лича', icon: '💀', armor: 16, hp: 95 },
    { name: 'Базальтовый Шлем', icon: '🪖', armor: 32, hp: 170 },
    { name: 'Диадема Хроноса', icon: '👑', armor: 17, hp: 100 },
    { name: 'Маска Охотника на Нечисть', icon: '🎭', armor: 20, hp: 115 },
    { name: 'Крылатый Шлем Валькирии', icon: '🪖', armor: 25, hp: 135 },
    { name: 'Маска Хаоса', icon: '🎭', armor: 22, hp: 120 },
    { name: 'Капюшон Зельевара', icon: '🪖', armor: 15, hp: 90 },
    { name: 'Призрачный Капюшон', icon: '🪖', armor: 16, hp: 95 },
    { name: 'Корона Глубоких Вод', icon: '👑', armor: 23, hp: 130 },
    { name: 'Шлем Непобедимого Чемпиона', icon: '🪖', armor: 27, hp: 145 },
    { name: 'Рунический Венец Мудрости', icon: '👑', armor: 22, hp: 130 },
    { name: 'Шлем Звериной Ярости', icon: '🪖', armor: 20, hp: 115 },
    { name: 'Звездная Корона Бесконечности', icon: '👑', armor: 35, hp: 210 },
    { name: 'Рогатый Шлем Демонорда', icon: '🪖', armor: 29, hp: 155 },
    { name: 'Капюшон Ветра', icon: '🪖', armor: 18, hp: 100 },
    { name: 'Клювовидная Маска Доктора', icon: '🎭', armor: 19, hp: 105 },
    { name: 'Шлем Снежного Гиганта', icon: '🪖', armor: 30, hp: 165 },
    { name: 'Шлем Пустынной Мантикоры', icon: '🪖', armor: 24, hp: 125 },
    { name: 'Маска Ктулху', icon: '🎭', armor: 26, hp: 140 },
    { name: 'Тюрбан Золотого Песка', icon: '👑', armor: 20, hp: 115 },
    { name: 'Венец Справедливости', icon: '👑', armor: 33, hp: 190 },
    { name: 'Капюшон Инквизитора', icon: '🪖', armor: 22, hp: 120 },
    { name: 'Императорская Корона', icon: '👑', armor: 28, hp: 160 },
    { name: 'Венец Звездной Пыли', icon: '👑', armor: 25, hp: 145 },
    { name: 'Маска Вампирского Графа', icon: '🎭', armor: 23, hp: 130 },
    { name: 'Шлем Лавового Камня', icon: '🪖', armor: 31, hp: 175 },
    { name: 'Венец Первого Луча', icon: '👑', armor: 26, hp: 150 },
    { name: 'Венец Архистратига', icon: '👑', armor: 34, hp: 195 },
    { name: 'Диадема Астрального Императора', icon: '👑', armor: 36, hp: 215 },
    { name: 'Корона Королевы Валькирий', icon: '👑', armor: 32, hp: 185 },
    { name: 'Шлем Первородного Драконоборца', icon: '🪖', armor: 35, hp: 200 },
    { name: 'Капюшон Монарха Тьмы', icon: '🪖', armor: 30, hp: 180 },
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
    { name: 'Мантия Пламенного Возрождения', icon: '🥋', armor: 26, hp: 170 },
    { name: 'Панцирь Ледяного Владыки', icon: '🛡️', armor: 36, hp: 210 },
    { name: 'Латный Панцирь Грозы', icon: '🛡️', armor: 32, hp: 190 },
    { name: 'Одеяние Теневой Бездны', icon: '🥋', armor: 28, hp: 175 },
    { name: 'Кираса Архангела', icon: '🛡️', armor: 42, hp: 260 },
    { name: 'Мантия Чумного Мора', icon: '🥋', armor: 24, hp: 150 },
    { name: 'Плита Земного Колосса', icon: '🛡️', armor: 48, hp: 300 },
    { name: 'Плащ Временной Петли', icon: '🧥', armor: 25, hp: 160 },
    { name: 'Кожаный Доспех Палача', icon: '🧥', armor: 30, hp: 180 },
    { name: 'Латная Броня Зари', icon: '🛡️', armor: 38, hp: 220 },
    { name: 'Доспех Переменчивой Реальности', icon: '🥋', armor: 31, hp: 190 },
    { name: 'Халат Мудреца Алхимии', icon: '🥋', armor: 22, hp: 140 },
    { name: 'Саван Невидимости', icon: '🧥', armor: 25, hp: 155 },
    { name: 'Чешуйчатый Панцирь Океана', icon: '🛡️', armor: 35, hp: 225 },
    { name: 'Нагрудник Гладиатора', icon: '🛡️', armor: 37, hp: 215 },
    { name: 'Мантия Старшего Футарка', icon: '🥋', armor: 30, hp: 195 },
    { name: 'Кольчуга Лесного Следопыта', icon: '🛡️', armor: 28, hp: 170 },
    { name: 'Мантия Квазара', icon: '🥋', armor: 45, hp: 290 },
    { name: 'Лавовый Панцирь', icon: '🛡️', armor: 42, hp: 245 },
    { name: 'Легкая Куртка Бури', icon: '🧥', armor: 26, hp: 160 },
    { name: 'Кожаный Плащ Чумника', icon: '🧥', armor: 27, hp: 165 },
    { name: 'Шкура Владыки Снегов', icon: '🛡️', armor: 44, hp: 270 },
    { name: 'Панцирь Крылатого Зверя', icon: '🛡️', armor: 34, hp: 205 },
    { name: 'Одеяние Океанической Тьмы', icon: '🥋', armor: 33, hp: 210 },
    { name: 'Шелковый Халат Султана', icon: '🥋', armor: 26, hp: 175 },
    { name: 'Мантия Высшего Суда', icon: '🥋', armor: 44, hp: 280 },
    { name: 'Тяжелая Кольчуга Истины', icon: '🛡️', armor: 35, hp: 210 },
    { name: 'Мантия Монарха', icon: '🥋', armor: 36, hp: 230 },
    { name: 'Одеяние Галактик', icon: '🥋', armor: 38, hp: 240 },
    { name: 'Алый Плащ Ночи', icon: '🧥', armor: 32, hp: 200 },
    { name: 'Обсидиановый Панцирь', icon: '🛡️', armor: 46, hp: 285 },
    { name: 'Латы Сияющего Дня', icon: '🛡️', armor: 40, hp: 250 },
    { name: 'Кираса Архистратига Света', icon: '🛡️', armor: 49, hp: 310 },
    { name: 'Одеяние Астрального Императора', icon: '🥋', armor: 47, hp: 300 },
    { name: 'Латный Доспех Королевы Валькирий', icon: '🛡️', armor: 45, hp: 280 },
    { name: 'Панцирь Древнего Драконоборца', icon: '🛡️', armor: 50, hp: 320 },
    { name: 'Мантия Монарха Глубинной Тьмы', icon: '🥋', armor: 43, hp: 275 },
  ],
  gloves: [
    { name: 'Тканевые перчатки', icon: '🧤', armor: 2, hp: 8, g: 'p' },
    { name: 'Кожаные краги', icon: '🧤', armor: 4, hp: 18, g: 'p' },
    { name: 'Латные рукавицы', icon: '🧤', armor: 8, hp: 35, g: 'p' },
    { name: 'Перчатки убийцы', icon: '🧤', armor: 10, hp: 45, g: 'p' },
    { name: 'Драконьи когти', icon: '🧤', armor: 15, hp: 75, g: 'p' },
    { name: 'Рукавицы Пламенного Дракона', icon: '🧤', armor: 18, hp: 90, g: 'p' },
    { name: 'Перчатки Астрального Шока', icon: '🧤', armor: 14, hp: 70, g: 'p' },
    { name: 'Перчатки Скорпиона', icon: '🧤', armor: 19, hp: 95, g: 'p' },
    { name: 'Наручи Очищения', icon: '🧤', armor: 21, hp: 105, g: 'p' },
    { name: 'Наручи Триумфатора', icon: '🧤', armor: 23, hp: 115, g: 'p' },
    { name: 'Перчатки Архистратига', icon: '🧤', armor: 25, hp: 130, g: 'p' },
    { name: 'Наручи Небесного Гнева', icon: '🧤', armor: 26, hp: 135, g: 'p' },
  ],
  kneepads: [
    { name: 'Кожаные щитки', icon: '🦵', armor: 2, hp: 10, g: 'p' },
    { name: 'Стальные наколенники', icon: '🦵', armor: 5, hp: 22, g: 'p' },
    { name: 'Наколенники Титана', icon: '🦵', armor: 10, hp: 45, g: 'p' },
    { name: 'Щитки Несокрушимого Защитника', icon: '🦵', armor: 16, hp: 70, g: 'p' },
    { name: 'Наколенники Алого Легиона', icon: '🦵', armor: 20, hp: 95, g: 'p' },
    { name: 'Наколенники Гранитной Тверди', icon: '🦵', armor: 24, hp: 115, g: 'p' },
    { name: 'Щитки Архистратига', icon: '🦵', armor: 28, hp: 140, g: 'p' },
  ],
  shoulders: [
    { name: 'Кожаные наплечники', icon: '🎽', armor: 3, hp: 12, g: 'p' },
    { name: 'Стальные эполеты', icon: '🎽', armor: 7, hp: 28, g: 'p' },
    { name: 'Наплечники Титана', icon: '🎽', armor: 14, hp: 60, g: 'p' },
    { name: 'Эполеты Драконьего Рыцаря', icon: '🎽', armor: 22, hp: 100, g: 'p' },
    { name: 'Наплечники Кровавого Охотника', icon: '🎽', armor: 24, hp: 110, g: 'p' },
    { name: 'Эполеты Архистратига', icon: '🎽', armor: 29, hp: 145, g: 'p' },
  ],
  boots: [
    { name: 'Легкие сапоги', icon: '🥾', armor: 2, hp: 10, g: 'p' },
    { name: 'Кованые ботинки', icon: '🥾', armor: 5, hp: 22, g: 'p' },
    { name: 'Боевые сабатоны', icon: '🥾', armor: 9, hp: 40, g: 'p' },
    { name: 'Сапоги Скорости Ветра', icon: '🥾', armor: 12, hp: 55, g: 'p' },
    { name: 'Сабатоны Повелителя Бездны', icon: '🥾', armor: 18, hp: 90, g: 'p' },
    { name: 'Сапоги Абсолютного Нуля', icon: '🥾', armor: 20, hp: 95, g: 'p' },
    { name: 'Боевые Сапоги Камнепада', icon: '🥾', armor: 24, hp: 120, g: 'p' },
    { name: 'Призрачные Сапоги', icon: '🥾', armor: 16, hp: 80, g: 'p' },
    { name: 'Огненные Сапоги Преисподней', icon: '🥾', armor: 22, hp: 105, g: 'p' },
    { name: 'Сапоги Порыва Ветра', icon: '🥾', armor: 19, hp: 90, g: 'p' },
    { name: 'Тяжелые Снегоступы', icon: '🥾', armor: 23, hp: 110, g: 'p' },
    { name: 'Сабатоны Архистратига', icon: '🥾', armor: 27, hp: 135, g: 'p' },
    { name: 'Сапоги Астрального Императора', icon: '🥾', armor: 28, hp: 140, g: 'p' },
  ],
  pants: [
    { name: 'Холщовые штаны', icon: '👖', armor: 2, hp: 12, g: 'p' },
    { name: 'Кожаные поножи', icon: '👖', armor: 5, hp: 25, g: 'p' },
    { name: 'Латные поножи', icon: '👖', armor: 10, hp: 50, g: 'p' },
    { name: 'Поножи Титана', icon: '👖', armor: 16, hp: 80, g: 'p' },
    { name: 'Штаны Древнего Чернокнижника', icon: '👖', armor: 22, hp: 110, g: 'p' },
    { name: 'Обсидиановые Поножи', icon: '👖', armor: 26, hp: 130, g: 'p' },
    { name: 'Поножи Архистратига', icon: '👖', armor: 30, hp: 155, g: 'p' },
  ],
  ring: [
    { name: 'Медное кольцо', icon: '💍', hp: 10, g: 'n' },
    { name: 'Серебряное кольцо', icon: '💍', hp: 20, g: 'n' },
    { name: 'Золотое кольцо', icon: '💍', hp: 35, g: 'n' },
    { name: 'Кольцо Огня', icon: '💍', hp: 45, g: 'n' },
    { name: 'Рунический перстень', icon: '💍', hp: 60, g: 'n' },
    { name: 'Перстень Бездны', icon: '💍', hp: 85, g: 'n' },
    { name: 'Кольцо Бессмертной Души', icon: '💍', hp: 120, g: 'n' },
    { name: 'Кольцо Сердца Феникса', icon: '💍', hp: 130, g: 'n' },
    { name: 'Перстень Вечной Пустоты', icon: '💍', hp: 140, g: 'n' },
    { name: 'Перстень Искажения', icon: '💍', hp: 125, g: 'n' },
    { name: 'Рунический Перстень Судьбы', icon: '💍', hp: 135, g: 'n' },
    { name: 'Кольцо Черной Дыры', icon: '💍', hp: 170, g: 'n' },
    { name: 'Перстень Тысячи Желаний', icon: '💍', hp: 145, g: 'n' },
    { name: 'Перстень Вечного Закона', icon: '💍', hp: 160, g: 'n' },
    { name: 'Кольцо Королевской Династии', icon: '💍', hp: 140, g: 'n' },
    { name: 'Перстень Кровавой Жажды', icon: '💍', hp: 150, g: 'n' },
    { name: 'Кольцо Архистратига Света', icon: '💍', hp: 180, g: 'n' },
    { name: 'Перстень Космической Сингулярности', icon: '💍', hp: 195, g: 'n' },
  ],
  earring: [
    { name: 'Медная серьга', icon: '📿', hp: 8, g: 'f' },
    { name: 'Серебряная клипса', icon: '📿', hp: 18, g: 'f' },
    { name: 'Золотая серьга', icon: '📿', hp: 30, g: 'f' },
    { name: 'Серьга Звезд', icon: '📿', hp: 50, g: 'f' },
    { name: 'Подвеска Космического Дракона', icon: '📿', hp: 80, g: 'f' },
    { name: 'Серьга Архистратига', icon: '📿', hp: 110, g: 'f' },
  ],
  amulet: [
    { name: 'Амулет Силы', icon: '🔮', hp: 25 },
    { name: 'Талисман Мудрости', icon: '🔮', hp: 45 },
    { name: 'Кулон Дракона', icon: '🔮', hp: 70 },
    { name: 'Око Бездны', icon: '👁️', hp: 100 },
    { name: 'Сердце Огненного Титана', icon: '💎', hp: 150 },
    { name: 'Амулет Пожирателя Душ', icon: '🔮', hp: 140 },
    { name: 'Песочные Часы Вечности', icon: '⏳', hp: 135 },
    { name: 'Флакон Философского Камня', icon: '🧪', hp: 130 },
    { name: 'Амулет Сердца Бездны', icon: '🔮', hp: 155 },
    { name: 'Клыкастый Амулет', icon: '🦷', hp: 120 },
    { name: 'Склянка Смертельного Яда', icon: '🧪', hp: 125 },
    { name: 'Амулет Чернил Бездны', icon: '🔮', hp: 145 },
    { name: 'Амулет Туманности', icon: '🔮', hp: 165 },
    { name: 'Амулет Архистратига', icon: '🔮', hp: 185 },
  ],
  cloak: [
    { name: 'Шерстяной плащ', icon: '🧣', armor: 2, hp: 10 },
    { name: 'Плащ Теневого Вора', icon: '🧣', armor: 5, hp: 25 },
    { name: 'Драконий Крылач', icon: '🧣', armor: 10, hp: 50 },
    { name: 'Саван Вечного Мрака', icon: '🧣', armor: 18, hp: 95 },
    { name: 'Крылатый Плащ Света', icon: '🧣', armor: 25, hp: 140 },
    { name: 'Плащ Архистратига Света', icon: '🧣', armor: 32, hp: 175 },
  ],
  banner: [
    { name: 'Знамя Гильдии', icon: '🚩', hp: 20 },
    { name: 'Стяг Победы', icon: '🚩', hp: 45 },
    { name: 'Штандарт Бездны', icon: '🚩', hp: 80 },
    { name: 'Хоругвь Божественного Света', icon: '🚩', hp: 130 },
    { name: 'Знамя Громового Шторма', icon: '🚩', hp: 140 },
    { name: 'Знамя Вальхаллы', icon: '🚩', hp: 145 },
    { name: 'Штандарт Арены', icon: '🚩', hp: 150 },
    { name: 'Хоругвь Абсолютного Бытия', icon: '🚩', hp: 190 },
    { name: 'Штандарт Абсолютной Истины', icon: '🚩', hp: 180 },
    { name: 'Знамя Новой Эры', icon: '🚩', hp: 160 },
    { name: 'Хоругвь Архистратига', icon: '🚩', hp: 220 },
  ],
};

export const SETS: SetDef[] = [
  // --- CORE SETS ---
  {
    id: 'set_dragon',
    name: 'Комплект Драконьего Владыки',
    icon: '🐉',
    color: '#ef4444',
    pieces: ['Шлем Дракона', 'Драконий панцирь', 'Драконьи когти', 'Драконий Крылач'],
    bonuses: [
      { reqPieces: 2, desc: '+25% к урону', dmgBonus: 25 },
      { reqPieces: 4, desc: '+50% к урону, +30% к шансу критического удара', dmgBonus: 50, critBonus: 30 },
    ],
  },
  {
    id: 'set_shadow',
    name: 'Комплект Теневого Жнеца',
    icon: '🗡️',
    color: '#a855f7',
    pieces: ['Перчатки убийцы', 'Одеяние тени', 'Плащ Теневого Вора'],
    bonuses: [
      { reqPieces: 2, desc: '+20% к урону и шансу критического удара', dmgBonus: 20, critBonus: 15 },
      { reqPieces: 3, desc: '+40% к шансу критического удара и +20% к скорости атаки', critBonus: 40 },
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
      { reqPieces: 2, desc: '+30% к броне и +20% к здоровью', armorBonus: 30, hpBonus: 20 },
      { reqPieces: 4, desc: '+50% к броне, +40% к здоровью и +25% к урону', armorBonus: 50, hpBonus: 40, dmgBonus: 25 },
    ],
  },
  {
    id: 'set_berserk',
    name: 'Комплект Неистовой Ярости',
    icon: '🪓',
    color: '#dc2626',
    pieces: ['Секира Разрушения', 'Латные поножи', 'Боевые сабатоны'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к урону', dmgBonus: 35 },
      { reqPieces: 3, desc: '+70% к урону и +25% к шансу критического удара', dmgBonus: 70, critBonus: 25 },
    ],
  },
  {
    id: 'set_vampire',
    name: 'Комплект Алого Вампира',
    icon: '🩸',
    color: '#e11d48',
    pieces: ['Амулет Силы', 'Око Бездны', 'Кольцо Огня'],
    bonuses: [
      { reqPieces: 2, desc: '+25% к здоровью и +15% к урону', hpBonus: 25, dmgBonus: 15 },
      { reqPieces: 3, desc: '+50% к здоровью и +35% к урону', hpBonus: 50, dmgBonus: 35 },
    ],
  },
  {
    id: 'set_stormcaller',
    name: 'Комплект Владыки Штормов',
    icon: '⚡',
    color: '#38bdf8',
    pieces: ['Светящийся Катана', 'Венец Звездного Неба', 'Перчатки Астрального Шока', 'Сапоги Скорости Ветра'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к скорости атаки и +15% к шансу критического удара', critBonus: 15 },
      { reqPieces: 4, desc: '+60% к скорости атаки, +40% к шансу критического удара и цепные молнии', critBonus: 40, dmgBonus: 45 },
    ],
  },
  {
    id: 'set_bloodlord',
    name: 'Комплект Кровавого Владыки',
    icon: '🍷',
    color: '#b91c1c',
    pieces: ['Топор Кровавой Луны', 'Жилет Алого Вампира', 'Наколенники Алого Легиона', 'Кулон Дракона'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к урону и +25% к здоровью', dmgBonus: 30, hpBonus: 25 },
      { reqPieces: 4, desc: '+70% к урону и сокрушение слабых монстров', dmgBonus: 70, hpBonus: 50 },
    ],
  },
  {
    id: 'set_creator',
    name: 'Одеяние Древнего Творца Миров',
    icon: '👑',
    color: '#facc15',
    pieces: ['Двуручник Бессмертного', 'Шлем Несокрушимого Владыки', 'Плита Несокрушимости', 'Кольцо Бессмертной Души', 'Хоругвь Божественного Света'],
    bonuses: [
      { reqPieces: 2, desc: '+40% ко всем боевым характеристикам', dmgBonus: 40, armorBonus: 40, hpBonus: 40 },
      { reqPieces: 4, desc: '+90% к урону, броне и здоровью', dmgBonus: 90, armorBonus: 90, hpBonus: 90 },
      { reqPieces: 5, desc: '+150% к урону и несокрушимость в критический момент!', dmgBonus: 150, armorBonus: 120, hpBonus: 150 },
    ],
  },
  {
    id: 'set_abyss_walker',
    name: 'Снаряжение Странника Бездны',
    icon: '🌌',
    color: '#818cf8',
    pieces: ['Коса Жнеца Бездны', 'Корона Бездны', 'Саван Вечного Мрака', 'Сердце Огненного Титана'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к броне и +30% к урону', armorBonus: 35, dmgBonus: 30 },
      { reqPieces: 4, desc: '+80% к броне, +60% к урону и иммунитет к проклятиям', armorBonus: 80, dmgBonus: 60, hpBonus: 60 },
    ],
  },

  // --- HIGH-TIER SETS (EXPANDED CATALOG) ---
  {
    id: 'set_phoenix',
    name: 'Комплект Бессмертного Феникса',
    icon: '🔥',
    color: '#f97316',
    pieces: ['Посох Солнечного Феникса', 'Венец Огненного Пепла', 'Мантия Пламенного Возрождения', 'Кольцо Сердца Феникса'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к урону огнем и +20% к шансу критического удара', dmgBonus: 35, critBonus: 20 },
      { reqPieces: 4, desc: '+80% к урону, +50% к здоровью и мгновенное восстановление сил', dmgBonus: 80, hpBonus: 50 },
    ],
  },
  {
    id: 'set_frost_emperor',
    name: 'Одеяния Ледяного Императора',
    icon: '❄️',
    color: '#06b6d4',
    pieces: ['Ледяной Клинок Левиафана', 'Корона Вечной Мерзлоты', 'Панцирь Ледяного Владыки', 'Сапоги Абсолютного Нуля'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к броне и замедление атак врагов', armorBonus: 30 },
      { reqPieces: 4, desc: '+70% к броне, +45% к урону и ледяные вспышки', armorBonus: 70, dmgBonus: 45 },
    ],
  },
  {
    id: 'set_thunder_god',
    name: 'Доспехи Бога Грома',
    icon: '⚡',
    color: '#eab308',
    pieces: ['Молот Громовержца', 'Шлем Небесного Разряда', 'Латный Панцирь Грозы', 'Перчатки Астрального Шока', 'Знамя Громового Шторма'],
    bonuses: [
      { reqPieces: 2, desc: '+25% к скорости атаки и +15% к шансу критического удара', critBonus: 15 },
      { reqPieces: 4, desc: '+55% к скорости атаки, +40% к урону и разряды молний', dmgBonus: 40, critBonus: 25 },
      { reqPieces: 5, desc: '+120% к урону, +60% к шансу критического удара и аура небесного шторма', dmgBonus: 120, critBonus: 60 },
    ],
  },
  {
    id: 'set_void_reaper',
    name: 'Жатва Первородной Бездны',
    icon: '🌌',
    color: '#6366f1',
    pieces: ['Коса Жнеца Бездны', 'Капюшон Истинной Тьмы', 'Одеяние Теневой Бездны', 'Перстень Вечной Пустоты'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к урону и +20% к вытягиванию жизни', dmgBonus: 35, hpBonus: 20 },
      { reqPieces: 4, desc: '+85% к урону, +40% к шансу критического удара и сокрушение врагов', dmgBonus: 85, critBonus: 40 },
    ],
  },
  {
    id: 'set_seraphim',
    name: 'Священный Доспех Серафима',
    icon: '👼',
    color: '#fbbf24',
    pieces: ['Меч Божественного Света', 'Шлем Небесного Серафима', 'Кираса Архангела', 'Крылатый Плащ Света', 'Хоругвь Божественного Света'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к здоровью и +25% к броне', hpBonus: 35, armorBonus: 25 },
      { reqPieces: 4, desc: '+75% к здоровью, +60% к броне и непрерывное исцеление', hpBonus: 75, armorBonus: 60 },
      { reqPieces: 5, desc: '+140% ко всем боевым параметрам и сияющий защитный купол', dmgBonus: 140, hpBonus: 140, armorBonus: 140 },
    ],
  },
  {
    id: 'set_necromancer',
    name: 'Одеяние Владыки Мертвых',
    icon: '💀',
    color: '#10b981',
    pieces: ['Жезл Проклятых Душ', 'Череп Древнего Лича', 'Мантия Чумного Мора', 'Амулет Пожирателя Душ'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к урону темной магией', dmgBonus: 30 },
      { reqPieces: 4, desc: '+75% к урону, +40% к здоровью и взрывы душ', dmgBonus: 75, hpBonus: 40 },
    ],
  },
  {
    id: 'set_colossus',
    name: 'Броня Земного Колосса',
    icon: '🗿',
    color: '#78716c',
    pieces: ['Молот Каменного Великана', 'Базальтовый Шлем', 'Плита Земного Колосса', 'Наколенники Гранитной Тверди', 'Боевые Сапоги Камнепада'],
    bonuses: [
      { reqPieces: 2, desc: '+50% к броне', armorBonus: 50 },
      { reqPieces: 4, desc: '+100% к броне и +80% к здоровью', armorBonus: 100, hpBonus: 80 },
      { reqPieces: 5, desc: '+200% к броне и отражение половины урона обратно во врага', armorBonus: 200, hpBonus: 100 },
    ],
  },
  {
    id: 'set_chrono',
    name: 'Хроно-Сдвиг Властелина Времени',
    icon: '⏳',
    color: '#ec4899',
    pieces: ['Рапира Искажения Времени', 'Диадема Хроноса', 'Плащ Временной Петли', 'Песочные Часы Вечности'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к скорости атаки и +20% к опыту', xpBonus: 20 },
      { reqPieces: 4, desc: '+70% к скорости атаки, +50% к урону и шанс мгновенного удара', dmgBonus: 50, xpBonus: 40 },
    ],
  },
  {
    id: 'set_demon_slayer',
    name: 'Снаряжение Истребителя Демонов',
    icon: '👹',
    color: '#dc2626',
    pieces: ['Парные Клинки Преисподней', 'Маска Охотника на Нечисть', 'Кожаный Доспех Палача', 'Наплечники Кровавого Охотника'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к урону по боссам и монстрам', dmgBonus: 30 },
      { reqPieces: 4, desc: '+80% к урону, +35% к шансу критического удара и воспламенение целей', dmgBonus: 80, critBonus: 35 },
    ],
  },
  {
    id: 'set_valkyrie',
    name: 'Благословение Солнечной Валькирии',
    icon: '☀️',
    color: '#fde047',
    pieces: ['Копье Солнечного Луча', 'Крылатый Шлем Валькирии', 'Латная Броня Зари', 'Знамя Вальхаллы'],
    bonuses: [
      { reqPieces: 2, desc: '+25% к урону и +20% к скорости атаки', dmgBonus: 25 },
      { reqPieces: 4, desc: '+65% к урону, +50% к шансу критического удара и сияющий натиск', dmgBonus: 65, critBonus: 50 },
    ],
  },
  {
    id: 'set_chaos',
    name: 'Аватар Первозданного Хаоса',
    icon: '🌀',
    color: '#d946ef',
    pieces: ['Клинок Хаотического Разлома', 'Маска Хаоса', 'Доспех Переменчивой Реальности', 'Перстень Искажения'],
    bonuses: [
      { reqPieces: 2, desc: '+40% к стихийному урону', dmgBonus: 40 },
      { reqPieces: 4, desc: '+100% к урону при критических ударах и хаотические взрывы', dmgBonus: 100, critBonus: 40 },
    ],
  },
  {
    id: 'set_alchemist',
    name: 'Наряд Верховного Алхимика',
    icon: '🧪',
    color: '#84cc16',
    pieces: ['Скипетр Трансмутации', 'Капюшон Зельевара', 'Халат Мудреца Алхимии', 'Флакон Философского Камня'],
    bonuses: [
      { reqPieces: 2, desc: '+40% к золоту и +25% к опыту', goldBonus: 40, xpBonus: 25 },
      { reqPieces: 4, desc: '+100% к золоту, +50% к урону ядом и целебные эликсиры', goldBonus: 100, dmgBonus: 50 },
    ],
  },
  {
    id: 'set_phantom',
    name: 'Призрачный Саван Скорби',
    icon: '👻',
    color: '#94a3b8',
    pieces: ['Эфирный Кинжал', 'Призрачный Капюшон', 'Саван Невидимости', 'Призрачные Сапоги'],
    bonuses: [
      { reqPieces: 2, desc: '+25% к увороту и +20% к урону', dmgBonus: 20 },
      { reqPieces: 4, desc: '+50% к увороту, +60% к шансу критического удара и кража душ', critBonus: 60, dmgBonus: 40 },
    ],
  },
  {
    id: 'set_leviathan',
    name: 'Владыка Глубин Левиафана',
    icon: '🌊',
    color: '#0284c7',
    pieces: ['Трезубец Морского Дракона', 'Корона Глубоких Вод', 'Чешуйчатый Панцирь Океана', 'Амулет Сердца Бездны'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к здоровью и +25% к броне', hpBonus: 30, armorBonus: 25 },
      { reqPieces: 4, desc: '+70% к здоровью, +50% к урону и сокрушительные цунами', hpBonus: 70, dmgBonus: 50 },
    ],
  },
  {
    id: 'set_gladiator_king',
    name: 'Триумф Чемпиона Колизея',
    icon: '🏆',
    color: '#b45309',
    pieces: ['Гладиус Победителя', 'Шлем Непобедимого Чемпиона', 'Нагрудник Гладиатора', 'Наручи Триумфатора', 'Штандарт Арены'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к физическому урону', dmgBonus: 30 },
      { reqPieces: 4, desc: '+75% к урону и +40% к шансу критического удара', dmgBonus: 75, critBonus: 40 },
      { reqPieces: 5, desc: '+150% к урону и неудержимый боевой раж', dmgBonus: 150, hpBonus: 60 },
    ],
  },
  {
    id: 'set_rune_master',
    name: 'Владыка Древнескандинавских Рун',
    icon: 'ᚱ',
    color: '#8b5cf6',
    pieces: ['Рунический Клинок Одина', 'Рунический Венец Мудрости', 'Мантия Старшего Футарка', 'Рунический Перстень Судьбы'],
    bonuses: [
      { reqPieces: 2, desc: '+35% ко всем магическим характеристикам', dmgBonus: 35, hpBonus: 20 },
      { reqPieces: 4, desc: '+80% к урону способностей, +50% к броне и рунические барьеры', dmgBonus: 80, armorBonus: 50 },
    ],
  },
  {
    id: 'set_beast_master',
    name: 'Повелитель Диких Прайдов',
    icon: '🐺',
    color: '#15803d',
    pieces: ['Охотничий Лук Вожака', 'Шлем Звериной Ярости', 'Кольчуга Лесного Следопыта', 'Клыкастый Амулет'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к урону питомца и +20% к скорости атаки', dmgBonus: 20 },
      { reqPieces: 4, desc: '+100% к урону питомца, +50% к урону героя и стайный вой', dmgBonus: 50, critBonus: 30 },
    ],
  },
  {
    id: 'set_cosmic_infinity',
    name: 'Космическая Бесконечность Творца',
    icon: '🌌',
    color: '#e0e7ff',
    pieces: ['Посох Рождения Сверхновой', 'Звездная Корона Бесконечности', 'Мантия Квазара', 'Кольцо Черной Дыры', 'Хоругвь Абсолютного Бытия'],
    bonuses: [
      { reqPieces: 2, desc: '+50% ко всем боевым параметрам', dmgBonus: 50, hpBonus: 50, armorBonus: 50 },
      { reqPieces: 4, desc: '+120% к урону, здоровью и броне', dmgBonus: 120, hpBonus: 120, armorBonus: 120 },
      { reqPieces: 5, desc: '+250% к урону и сокрушительный луч сверхновой', dmgBonus: 250, critBonus: 80 },
    ],
  },
  {
    id: 'set_inferno_warlord',
    name: 'Инфернальный Полководец',
    icon: '🔥',
    color: '#991b1b',
    pieces: ['Пылающий Двуручник Ада', 'Рогатый Шлем Демонорда', 'Лавовый Панцирь', 'Огненные Сапоги Преисподней'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к урону огнем', dmgBonus: 35 },
      { reqPieces: 4, desc: '+80% к урону, +40% к здоровью и взрывы раскаленной магмы', dmgBonus: 80, hpBonus: 40 },
    ],
  },
  {
    id: 'set_gale_strider',
    name: 'Странник Штормовых Ветров',
    icon: '🌪️',
    color: '#38bdf8',
    pieces: ['Лук Небесного Урагана', 'Капюшон Ветра', 'Легкая Куртка Бури', 'Сапоги Порыва Ветра'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к скорости атаки и +15% к увороту', critBonus: 15 },
      { reqPieces: 4, desc: '+80% к скорости атаки, +50% к шансу критического удара и вихри', dmgBonus: 45, critBonus: 50 },
    ],
  },
  {
    id: 'set_plague_doctor',
    name: 'Маска Чумного Целителя',
    icon: '☣️',
    color: '#65a30d',
    pieces: ['Скальпель Черного Мора', 'Клювовидная Маска Доктора', 'Кожаный Плащ Чумника', 'Склянка Смертельного Яда'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к урону ядом и +25% к броне', dmgBonus: 30, armorBonus: 25 },
      { reqPieces: 4, desc: '+75% к урону ядом и заражение всех врагов на арене', dmgBonus: 75, hpBonus: 35 },
    ],
  },
  {
    id: 'set_yeti_frostpeak',
    name: 'Шкура Владыки Снегов',
    icon: '❄️',
    color: '#93c5fd',
    pieces: ['Дубина Ледяного Йети', 'Шлем Снежного Гиганта', 'Шкура Владыки Снегов', 'Тяжелые Снегоступы'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к броне и +30% к здоровью', armorBonus: 35, hpBonus: 30 },
      { reqPieces: 4, desc: '+80% к броне, +60% к здоровью и непробиваемый ледяной щит', armorBonus: 80, hpBonus: 60 },
    ],
  },
  {
    id: 'set_manticore_venom',
    name: 'Ярость Пустынной Мантикоры',
    icon: '🦂',
    color: '#ea580c',
    pieces: ['Копье Ядовитого Жала', 'Шлем Пустынной Мантикоры', 'Панцирь Крылатого Зверя', 'Перчатки Скорпиона'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к урону и +20% к шансу критического удара', dmgBonus: 30, critBonus: 20 },
      { reqPieces: 4, desc: '+70% к урону, +40% к шансу критического удара и ядовитый шквал', dmgBonus: 70, critBonus: 40 },
    ],
  },
  {
    id: 'set_kraken_tentacle',
    name: 'Глубинное Щупальце Кракена',
    icon: '🐙',
    color: '#0f766e',
    pieces: ['Якорь Морского Чудовища', 'Маска Ктулху', 'Одеяние Океанической Тьмы', 'Амулет Чернил Бездны'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к здоровью и +25% к урону', hpBonus: 35, dmgBonus: 25 },
      { reqPieces: 4, desc: '+80% к здоровью, +60% к урону и сокрушительное сдавливание', hpBonus: 80, dmgBonus: 60 },
    ],
  },
  {
    id: 'set_djinn_wish',
    name: 'Желание Золотого Джинна',
    icon: '🧞',
    color: '#eab308',
    pieces: ['Изогнутый Сабля Джинна', 'Тюрбан Золотого Песка', 'Шелковый Халат Султана', 'Перстень Тысячи Желаний'],
    bonuses: [
      { reqPieces: 2, desc: '+50% к золоту и +30% к опыту', goldBonus: 50, xpBonus: 30 },
      { reqPieces: 4, desc: '+120% к золоту, +60% к опыту и каскад магических заклинаний', goldBonus: 120, xpBonus: 60, dmgBonus: 40 },
    ],
  },
  {
    id: 'set_divine_arbiter',
    name: 'Божественный Арбитр Судеб',
    icon: '⚖️',
    color: '#f8fafc',
    pieces: ['Клинок Правосудия', 'Венец Справедливости', 'Мантия Высшего Суда', 'Перстень Вечного Закона', 'Штандарт Абсолютной Истины'],
    bonuses: [
      { reqPieces: 2, desc: '+45% ко всем боевым параметрам', dmgBonus: 45, armorBonus: 45, hpBonus: 45 },
      { reqPieces: 4, desc: '+100% к урону, броне и здоровью', dmgBonus: 100, armorBonus: 100, hpBonus: 100 },
      { reqPieces: 5, desc: '+220% к урону и небесный суд над врагами', dmgBonus: 220, critBonus: 70 },
    ],
  },
  {
    id: 'set_dark_inquisitor',
    name: 'Печать Темного Инквизитора',
    icon: '⚖️',
    color: '#475569',
    pieces: ['Экзекутор Инквизиции', 'Капюшон Инквизитора', 'Тяжелая Кольчуга Истины', 'Наручи Очищения'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к урону и +25% к броне', dmgBonus: 30, armorBonus: 25 },
      { reqPieces: 4, desc: '+75% к урону, +40% к шансу критического удара и очищающий костер', dmgBonus: 75, critBonus: 40 },
    ],
  },
  {
    id: 'set_royal_sovereign',
    name: 'Царственное Величие Власти',
    icon: '👑',
    color: '#ca8a04',
    pieces: ['Царский Скипетр Власти', 'Императорская Корона', 'Мантия Монарха', 'Кольцо Королевской Династии'],
    bonuses: [
      { reqPieces: 2, desc: '+40% к золоту и +25% к броне', goldBonus: 40, armorBonus: 25 },
      { reqPieces: 4, desc: '+90% к золоту, +50% к здоровью и царский приказ о сокрушении', goldBonus: 90, hpBonus: 50, dmgBonus: 45 },
    ],
  },
  {
    id: 'set_astral_weaver',
    name: 'Ткач Звездных Нитей',
    icon: '✨',
    color: '#a855f7',
    pieces: ['Игла Ткача Созвездий', 'Венец Звездной Пыли', 'Одеяние Галактик', 'Амулет Туманности'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к урону способностей и +25% к опыту', dmgBonus: 30, xpBonus: 25 },
      { reqPieces: 4, desc: '+75% к урону, +50% к шансу критического удара и взрывы созвездий', dmgBonus: 75, critBonus: 50 },
    ],
  },
  {
    id: 'set_blood_reaper',
    name: 'Жнец Алой Луны',
    icon: '🩸',
    color: '#881337',
    pieces: ['Кровавая Коса Затмения', 'Маска Вампирского Графа', 'Алый Плащ Ночи', 'Перстень Кровавой Жажды'],
    bonuses: [
      { reqPieces: 2, desc: '+35% к вытягиванию жизни и +25% к урону', hpBonus: 35, dmgBonus: 25 },
      { reqPieces: 4, desc: '+80% к урону, +50% к здоровью и волны алого взрыва', dmgBonus: 80, hpBonus: 50 },
    ],
  },
  {
    id: 'set_obsidian_knight',
    name: 'Обсидиановый Рыцарь Вулкан',
    icon: '🌋',
    color: '#18181b',
    pieces: ['Обсидиановый Бастард', 'Шлем Лавового Камня', 'Обсидиановый Панцирь', 'Обсидиановые Поножи'],
    bonuses: [
      { reqPieces: 2, desc: '+40% к броне и +20% к урону', armorBonus: 40, dmgBonus: 20 },
      { reqPieces: 4, desc: '+90% к броне, +60% к урону и стойкость к пламени', armorBonus: 90, dmgBonus: 60 },
    ],
  },
  {
    id: 'set_radiant_dawn',
    name: 'Сияющий Рассвет Надежды',
    icon: '🌅',
    color: '#fef08a',
    pieces: ['Меч Утренней Зари', 'Венец Первого Луча', 'Латы Сияющего Дня', 'Знамя Новой Эры'],
    bonuses: [
      { reqPieces: 2, desc: '+30% к здоровью и +25% к опыту', hpBonus: 30, xpBonus: 25 },
      { reqPieces: 4, desc: '+70% к здоровью, +50% к опыту и ослепляющие лучи зари', hpBonus: 70, xpBonus: 50, dmgBonus: 40 },
    ],
  },
  // --- NEW ADDITIONAL SUPREME SETS ---
  {
    id: 'set_archangel_dawn',
    name: 'Священный Архистратиг Света',
    icon: '🪽',
    color: '#fef08a',
    pieces: ['Клинок Архистратига', 'Венец Архистратига', 'Кираса Архистратига Света', 'Перчатки Архистратига', 'Плащ Архистратига Света', 'Хоругвь Архистратига'],
    bonuses: [
      { reqPieces: 2, desc: '+40% к здоровью и +30% к броне', hpBonus: 40, armorBonus: 30 },
      { reqPieces: 4, desc: '+90% к здоровью, +70% к броне и непрерывное исцеление', hpBonus: 90, armorBonus: 70 },
      { reqPieces: 6, desc: '+200% ко всем характеристикам и крылья бессмертия', dmgBonus: 200, hpBonus: 200, armorBonus: 200 },
    ],
  },
  {
    id: 'set_astral_emperor',
    name: 'Астральный Император Вселенной',
    icon: '🌌',
    color: '#818cf8',
    pieces: ['Скипетр Астрального Владыки', 'Диадема Астрального Императора', 'Одеяние Астрального Императора', 'Сапоги Астрального Императора'],
    bonuses: [
      { reqPieces: 2, desc: '+45% к урону способностей и +30% к опыту', dmgBonus: 45, xpBonus: 30 },
      { reqPieces: 4, desc: '+110% к урону способностей, +80% к критическому удару и астральные штормы', dmgBonus: 110, critBonus: 80 },
    ],
  },
  {
    id: 'set_valkyrie_queen',
    name: 'Корона Королевы Валькирий',
    icon: '👑',
    color: '#fbbf24',
    pieces: ['Копье Королевы Валькирий', 'Корона Королевы Валькирий', 'Латный Доспех Королевы Валькирий'],
    bonuses: [
      { reqPieces: 2, desc: '+40% к скорости атаки и +30% к урону', dmgBonus: 30 },
      { reqPieces: 3, desc: '+90% к урону, +60% к шансу критического удара и натиск валькирий', dmgBonus: 90, critBonus: 60 },
    ],
  },
  {
    id: 'set_dragonslayer_prime',
    name: 'Первородный Драконоборец',
    icon: '🐉',
    color: '#b91c1c',
    pieces: ['Крушитель Драконов', 'Шлем Первородного Драконоборца', 'Панцирь Древнего Драконоборца'],
    bonuses: [
      { reqPieces: 2, desc: '+45% к урону по боссам и драконам', dmgBonus: 45 },
      { reqPieces: 3, desc: '+110% к урону, +50% к шансу критического удара и сокрушение чешуи', dmgBonus: 110, critBonus: 50 },
    ],
  },
  {
    id: 'set_abyss_monarch',
    name: 'Монарх Глубинной Тьмы',
    icon: '🌑',
    color: '#475569',
    pieces: ['Коса Монарха Тьмы', 'Капюшон Монарха Тьмы', 'Мантия Монарха Глубинной Тьмы'],
    bonuses: [
      { reqPieces: 2, desc: '+40% к броне и +35% к вытягиванию жизни', armorBonus: 40, hpBonus: 35 },
      { reqPieces: 3, desc: '+100% к урону, +70% к броне и поглощение душ врагов', dmgBonus: 100, armorBonus: 70 },
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

  // Set Item Identification
  let setId: string | undefined;
  const matchingSets = SETS.filter(s => s.pieces.some(p => p.toLowerCase().trim() === baseDef.name.toLowerCase().trim() || p.toLowerCase().includes(baseDef.name.toLowerCase())));
  if (matchingSets.length > 0) {
    if (rarity === 'legendary' || rarity === 'mythic' || rarity === 'divine') {
      setId = matchingSets[0].id;
    } else if (rarity === 'epic' && Math.random() < 0.65) {
      setId = matchingSets[0].id;
    } else if (rarity === 'rare' && Math.random() < 0.35) {
      setId = matchingSets[0].id;
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
  dmg: { name: 'Дополнительный Урон', icon: '⚔️' },
  armor: { name: 'Дополнительная Броня', icon: '🛡️' },
  hp: { name: 'Дополнительное Здоровье', icon: '❤️' },
  crit: { name: 'Шанс Критического Удара', icon: '💥', suffix: '%' },
  speed: { name: 'Скорость Атаки', icon: '⚡', suffix: '%' },
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
  { id: 'pot_hp_small', name: 'Малое Зелье Здоровья', icon: '🧪', rarity: 'common', desc: 'Мгновенно восстанавливает +200 Здоровья.', sellPrice: 15 },
  { id: 'pot_hp_mid', name: 'Среднее Зелье Здоровья', icon: '🧪', rarity: 'uncommon', desc: 'Мгновенно восстанавливает +500 Здоровья.', sellPrice: 35 },
  { id: 'pot_hp_grand', name: 'Великое Зелье Здоровья', icon: '🧪', rarity: 'rare', desc: 'Восстанавливает 100% Здоровья и даёт +300 Силового Щита.', sellPrice: 85 },
  { id: 'pot_mana_small', name: 'Малый Эликсир Маны', icon: '🔮', rarity: 'common', desc: 'Восстанавливает +150 Маны.', sellPrice: 20 },
  { id: 'pot_mana_mid', name: 'Средний Эликсир Маны', icon: '🔮', rarity: 'uncommon', desc: 'Восстанавливает +400 Маны.', sellPrice: 45 },
  { id: 'pot_mana_grand', name: 'Астральный Эликсир Маны', icon: '🔮', rarity: 'rare', desc: 'Восстанавливает 100% Маны и сбрасывает перезарядку всех способностей.', sellPrice: 110 },
  { id: 'pot_berserk', name: 'Настойка Яростного Берсерка', icon: '🍷', rarity: 'rare', desc: '+35% к Урону и +20% к Шансу Критического Удара на бой.', sellPrice: 150 },
  { id: 'pot_ironhide', name: 'Завар Твёрдой Стали', icon: '🛡️', rarity: 'uncommon', desc: '+50% к Броне.', sellPrice: 90 },
  { id: 'pot_fortune', name: 'Зелье Удачной Зачистки', icon: '🍀', rarity: 'epic', desc: '+100% к Золоту и +75% к Опыту со всех врагов.', sellPrice: 220 },
  { id: 'pot_swift', name: 'Эликсир Стремительности', icon: '⚡', rarity: 'uncommon', desc: '+25% к Скорости Атаки.', sellPrice: 75 },
  { id: 'pot_crit', name: 'Настойка Меткости', icon: '🎯', rarity: 'rare', desc: '+25% к Шансу Критического Удара.', sellPrice: 130 },
  { id: 'pot_astral', name: 'Катализатор Астральной Руды', icon: '💎', rarity: 'epic', desc: 'Синтезирует +15 единиц Астральной Руды.', sellPrice: 300 },
  { id: 'pot_titan', name: 'Эликсир Титанического Щита', icon: '🛡️', rarity: 'epic', desc: 'Накладывает +600 единиц Непробиваемого Астрального Щита.', sellPrice: 280 },
  { id: 'pot_rejuvenation', name: 'Эликсир Омоложения', icon: '✨', rarity: 'rare', desc: 'Восстанавливает 100% Здоровья и 100% Маны.', sellPrice: 160 },
  { id: 'pot_vampirism', name: 'Тоник Вампиризма', icon: '🩸', rarity: 'rare', desc: '+20% Похищения Жизни.', sellPrice: 140 },
  { id: 'pot_dragon_blood', name: 'Кровь Дракона', icon: '🔥', rarity: 'legendary', desc: '+50% к Урону и поджигает все удары драконьим пламенем.', sellPrice: 450 },
  { id: 'pot_phoenix_tears', name: 'Слёзы Феникса', icon: '🪶', rarity: 'legendary', desc: 'Воскрешает с 100% Здоровья при смертельном уроне.', sellPrice: 600 },
  { id: 'pot_shadow_brew', name: 'Теневая Выжимка', icon: '🌌', rarity: 'epic', desc: '+40% Дополнительного Урона из тени.', sellPrice: 250 },
  { id: 'pot_divine_nectar', name: 'Нектар Богов', icon: '👑', rarity: 'divine', desc: '+100% ко всем характеристикам и полное исцеление.', sellPrice: 1000 },
  { id: 'pot_golem_skin', name: 'Каменный Эликсир Голема', icon: '🗿', rarity: 'uncommon', desc: '+200 Брони и блокирует 15% урона.', sellPrice: 110 },
  { id: 'pot_arcane_surge', name: 'Всплеск Арканы', icon: '⚡', rarity: 'rare', desc: 'Сбрасывает расход маны всех способностей до нуля.', sellPrice: 190 },
  { id: 'pot_poison_resist', name: 'Антидот Ядовитого Тумана', icon: '🌿', rarity: 'common', desc: 'Снимает эффекты отравления и кровотечения.', sellPrice: 30 },
  { id: 'pot_frost_guard', name: 'Защитный Завар Мороза', icon: '❄️', rarity: 'uncommon', desc: '+30% Защиты от магии.', sellPrice: 80 },
  { id: 'pot_holy_water', name: 'Святая Вода Ордена', icon: '☀️', rarity: 'rare', desc: '+50% Урона по Демонам и Нежити.', sellPrice: 170 },
  { id: 'pot_gold_magnet', name: 'Приманка Золотого Дракона', icon: '💰', rarity: 'epic', desc: 'Удваивает всё выпадающее золото.', sellPrice: 320 },
  { id: 'pot_alchemist_master', name: 'Высший Эликсир Алхимика', icon: '👑', rarity: 'legendary', desc: 'Полный комплекс высших усилений персонажа.', sellPrice: 500 },
];
