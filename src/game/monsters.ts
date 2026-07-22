import type { DungeonDef, MonsterDef, ZoneDef } from './types';
import { declinePrefix, type Gender } from './items';

// ===================== MONSTER FAMILIES (30 families × 8+ tiers = 240+ monsters) =====================
export interface FamilyDef {
  id: string;
  name: string;
  icons: string[];   // one per tier
  color: string;
  adjectives: string[];
  g?: Gender;        // grammar gender (default m)
}

const ADJ = ['Слабый', 'Дикий', 'Злобный', 'Яростный', 'Свирепый', 'Древний', 'Проклятый', 'Абсолютный'];

export const FAMILIES: FamilyDef[] = [
  { id: 'slime',    name: 'Слайм',      icons: ['🟢', '🟩', '💚', '🫧', '🧪', '🦠', '☢️', '🌑'], color: '#4ade80', adjectives: ADJ },
  { id: 'rat',      name: 'Крысолюд',   icons: ['🐀', '🐁', '🦷', '🐭', '👁️', '🦴', '⚫', '👑'], color: '#a8a29e', adjectives: ADJ },
  { id: 'goblin',   name: 'Гоблин',     icons: ['👺', '🗡️', '🏹', '💣', '🛡️', '🔥', '👑', '💀'], color: '#84cc16', adjectives: ADJ },
  { id: 'skeleton', name: 'Скелет',     icons: ['💀', '🦴', '⚔️', '🛡️', '🏹', '🔮', '👑', '🌑'], color: '#e7e5e4', adjectives: ADJ },
  { id: 'zombie',   name: 'Зомби',      icons: ['🧟', '🧟‍♂️', '🧟‍♀️', '🪦', '☣️', '🧠', '👑', '🌑'], color: '#65a30d', adjectives: ADJ },
  { id: 'spider',   name: 'Паук',       icons: ['🕷️', '🕸️', '🦂', '👁️', '🥚', '💀', '👑', '🌑'], color: '#7c3aed', adjectives: ADJ },
  { id: 'wolf',     name: 'Волк',       icons: ['🐺', '🦷', '🌕', '❄️', '🔥', '⚡', '👑', '🌑'], color: '#64748b', adjectives: ADJ },
  { id: 'orc',      name: 'Орк',        icons: ['👹', '🪓', '🛡️', '🏹', '💪', '🔥', '👑', '🌑'], color: '#16a34a', adjectives: ADJ },
  { id: 'bandit',   name: 'Бандит',     icons: ['🥷', '🗡️', '💰', '🏴‍☠️', '⚔️', '🎯', '👑', '🌑'], color: '#b45309', adjectives: ADJ },
  { id: 'ghost',    name: 'Призрак',    icons: ['👻', '🕯️', '⚪', '🌫️', '😱', '💀', '👑', '🌑'], color: '#93c5fd', adjectives: ADJ },
  { id: 'vampire',  name: 'Вампир',     icons: ['🧛', '🧛‍♂️', '🦇', '🩸', '🍷', '🌹', '👑', '🌑'], color: '#dc2626', adjectives: ADJ },
  { id: 'golem',    name: 'Голем',      icons: ['🗿', '🪨', '⛰️', '💎', '🔥', '❄️', '👑', '🌑'], color: '#78716c', adjectives: ADJ },
  { id: 'cultist',  name: 'Культист',   icons: ['🕯️', '🔮', '📿', '☠️', '🩸', '👁️', '👑', '🌑'], color: '#9333ea', adjectives: ADJ },
  { id: 'demon',    name: 'Демон',      icons: ['😈', '🔥', '👿', '⚔️', '💀', '🌋', '👑', '🌑'], color: '#ef4444', adjectives: ADJ },
  { id: 'elemental_fire', name: 'Элементаль огня', icons: ['🔥', '🎇', '☄️', '🌋', '💥', '⚡', '👑', '🌑'], color: '#f97316', adjectives: ADJ },
  { id: 'elemental_ice',  name: 'Элементаль льда', icons: ['❄️', '🧊', '💠', '🌨️', '⛄', '💎', '👑', '🌑'], color: '#38bdf8', adjectives: ADJ },
  { id: 'elemental_storm',name: 'Элементаль бури', icons: ['⚡', '🌩️', '🌪️', '💨', '☁️', '🔮', '👑', '🌑'], color: '#facc15', adjectives: ADJ },
  { id: 'mushroom', name: 'Гриб',       icons: ['🍄', '🌿', '🟤', '☠️', '💚', '🔮', '👑', '🌑'], color: '#d946ef', adjectives: ADJ },
  { id: 'crab',     name: 'Краб',       icons: ['🦀', '🦞', '🦐', '🌊', '🐚', '💎', '👑', '🌑'], color: '#fb7185', adjectives: ADJ },
  { id: 'snake',    name: 'Змея',       icons: ['🐍', '🦎', '🥚', '☠️', '💚', '👁️', '👑', '🌑'], color: '#22c55e', adjectives: ADJ, g: 'f' },
  { id: 'scorpion', name: 'Скорпион',   icons: ['🦂', '🏜️', '☠️', '🔥', '💛', '👁️', '👑', '🌑'], color: '#eab308', adjectives: ADJ },
  { id: 'harpy',    name: 'Гарпия',     icons: ['🦅', '🪶', '💨', '🌪️', '👁️', '⚡', '👑', '🌑'], color: '#a3e635', adjectives: ADJ, g: 'f' },
  { id: 'bear',     name: 'Медведь',    icons: ['🐻', '🐾', '❄️', '🔥', '🌲', '💀', '👑', '🌑'], color: '#92400e', adjectives: ADJ },
  { id: 'mimic',    name: 'Мимик',      icons: ['📦', '🎁', '🪙', '👅', '🦷', '💎', '👑', '🌑'], color: '#f59e0b', adjectives: ADJ },
  { id: 'mage',     name: 'Тёмный маг', icons: ['🧙', '🧙‍♂️', '🔮', '📖', '⚡', '💀', '👑', '🌑'], color: '#8b5cf6', adjectives: ADJ },
  { id: 'knight',   name: 'Проклятый рыцарь', icons: ['🛡️', '⚔️', '🏇', '🎠', '💀', '🔥', '👑', '🌑'], color: '#475569', adjectives: ADJ },
  { id: 'dragon',   name: 'Дракон',     icons: ['🐉', '🐲', '🔥', '❄️', '⚡', '💎', '👑', '🌑'], color: '#dc2626', adjectives: ADJ },
  { id: 'wisp',     name: 'Дух',        icons: ['✨', '💫', '🌟', '🔆', '🕯️', '💀', '👑', '🌑'], color: '#fde68a', adjectives: ADJ },
  { id: 'construct',name: 'Механизм',   icons: ['⚙️', '🤖', '🔩', '🛰️', '💣', '🔥', '👑', '🌑'], color: '#94a3b8', adjectives: ADJ },
  { id: 'abyss',    name: 'Порождение Бездны', icons: ['🌑', '👁️', '🕳️', '🦑', '💜', '☄️', '👑', '🌌'], color: '#6d28d9', adjectives: ADJ, g: 'n' },
];

// generate monster def for a family + tier + level scaling
export function makeMonster(familyId: string, tier: number, opts?: { boss?: boolean; mini?: boolean; name?: string; icon?: string }): MonsterDef {
  const fam = FAMILIES.find(f => f.id === familyId) ?? FAMILIES[0];
  const t = Math.min(tier, fam.icons.length - 1);
  const isBoss = !!opts?.boss;
  const isMini = !!opts?.mini;
  const adj = declinePrefix(fam.adjectives[t] ?? fam.adjectives[0], fam.g ?? 'm');
  const name = opts?.name ?? `${adj} ${fam.name.toLowerCase()}`;
  const tierMult = 1 + t * 0.35;
  const bossMult = isBoss ? 6 : isMini ? 2.6 : 1;
  return {
    id: `${familyId}_${t}_${isBoss ? 'b' : isMini ? 'm' : 'n'}`,
    name,
    icon: opts?.icon ?? fam.icons[t],
    family: familyId,
    tier: t,
    isBoss,
    isMiniBoss: isMini,
    hpMult: tierMult * bossMult * (isBoss ? 2.2 : 1),
    dmgMult: tierMult * (isBoss ? 1.8 : isMini ? 1.4 : 1),
    xpMult: tierMult * (isBoss ? 12 : isMini ? 4 : 1),
    goldMult: tierMult * (isBoss ? 15 : isMini ? 5 : 1),
    color: fam.color,
  };
}

// total distinct normal monsters (family × 8 tiers)
export const TOTAL_MONSTERS = FAMILIES.length * 8 + 16 + 8 + 6; // + zone bosses + minibosses + dungeon bosses

// ===================== ZONES (12 + 4 hidden, tiles change per zone) =====================
export const ZONES: ZoneDef[] = [
  {
    id: 'hills', name: 'Зелёные холмы', icon: '🌿', minLevel: 1, stages: 10, killsPerStage: 8,
    monsterFamilies: ['slime', 'rat', 'goblin'],
    theme: { skyTop: '#7dd3fc', skyBottom: '#d9f99d', ground: '#4d7c0f', groundDark: '#3f6212', tiles: ['🌿', '🌱', '🍀', '🌼', '🌾'], particles: 'rgba(190,242,100,0.6)', fog: 'rgba(217,249,157,0.12)' },
    bossName: 'Король Гоблинов Гнус', bossIcon: '👑', miniBossName: 'Гоблин-вожак', miniBossIcon: '🛡️',
    desc: 'Мирные луга, кишащие мелкой нечистью.',
  },
  {
    id: 'forest', name: 'Тёмный лес', icon: '🌲', minLevel: 8, stages: 10, killsPerStage: 9,
    monsterFamilies: ['wolf', 'spider', 'goblin', 'wisp'],
    theme: { skyTop: '#0f2027', skyBottom: '#2c5364', ground: '#14532d', groundDark: '#052e16', tiles: ['🌲', '🌳', '🍂', '🍄', '🌫️'], particles: 'rgba(74,222,128,0.5)', fog: 'rgba(6,78,59,0.25)' },
    bossName: 'Арахна Матка', bossIcon: '🕷️', miniBossName: 'Альфа-волк', miniBossIcon: '🐺',
    desc: 'Вековой лес, где ветви скрывают небо.',
  },
  {
    id: 'mine', name: 'Заброшенная шахта', icon: '⛏️', minLevel: 18, stages: 10, killsPerStage: 10,
    monsterFamilies: ['skeleton', 'rat', 'golem', 'mimic'],
    theme: { skyTop: '#1c1917', skyBottom: '#44403c', ground: '#57534e', groundDark: '#292524', tiles: ['⛏️', '🪨', '💎', '🕯️', '🛢️'], particles: 'rgba(251,191,36,0.5)', fog: 'rgba(68,64,60,0.3)' },
    bossName: 'Каменный Голем Грак', bossIcon: '🗿', miniBossName: 'Смотритель шахты', miniBossIcon: '💀',
    desc: 'Гномы ушли. Кто-то остался.',
  },
  {
    id: 'ashen', name: 'Пепельные пустоши', icon: '🌋', minLevel: 30, stages: 10, killsPerStage: 10,
    monsterFamilies: ['elemental_fire', 'demon', 'scorpion', 'bandit'],
    theme: { skyTop: '#450a0a', skyBottom: '#f97316', ground: '#7c2d12', groundDark: '#431407', tiles: ['🌋', '🔥', '☄️', '🪨', '💀'], particles: 'rgba(249,115,22,0.6)', fog: 'rgba(154,52,18,0.3)' },
    bossName: 'Ифрит Пеплогрив', bossIcon: '🔥', miniBossName: 'Демон-погонщик', miniBossIcon: '😈',
    desc: 'Земля, выжженная древним катаклизмом.',
  },
  {
    id: 'frost', name: 'Ледяной фронтир', icon: '❄️', minLevel: 42, stages: 10, killsPerStage: 11,
    monsterFamilies: ['elemental_ice', 'bear', 'wolf', 'ghost'],
    theme: { skyTop: '#0c4a6e', skyBottom: '#e0f2fe', ground: '#bae6fd', groundDark: '#7dd3fc', tiles: ['❄️', '🧊', '⛄', '🌨️', '💠'], particles: 'rgba(224,242,254,0.8)', fog: 'rgba(186,230,253,0.25)' },
    bossName: 'Ледяной Властелин Борей', bossIcon: '🧊', miniBossName: 'Снежный монолит', miniBossIcon: '⛄',
    desc: 'Вечная мерзлота и воющие ветра.',
  },
  {
    id: 'desert', name: 'Пустыня золота', icon: '🏜️', minLevel: 55, stages: 10, killsPerStage: 11,
    monsterFamilies: ['scorpion', 'snake', 'bandit', 'mimic', 'construct'],
    theme: { skyTop: '#f59e0b', skyBottom: '#fde68a', ground: '#d97706', groundDark: '#b45309', tiles: ['🌵', '🏜️', '🦂', '💰', '🐫'], particles: 'rgba(253,230,138,0.6)', fog: 'rgba(245,158,11,0.2)' },
    bossName: 'Золотой Султан', bossIcon: '👑', miniBossName: 'Гнев пустыни', miniBossIcon: '🌪️',
    desc: 'Пески, поглотившие великую империю.',
  },
  {
    id: 'swamp', name: 'Болото чумы', icon: '☠️', minLevel: 70, stages: 10, killsPerStage: 12,
    monsterFamilies: ['zombie', 'snake', 'mushroom', 'slime', 'wisp'],
    theme: { skyTop: '#1a2e05', skyBottom: '#4d7c0f', ground: '#365314', groundDark: '#1a2e05', tiles: ['☠️', '🍄', '🐸', '🌿', '💀'], particles: 'rgba(132,204,22,0.5)', fog: 'rgba(77,124,15,0.3)' },
    bossName: 'Чумная Гидра', bossIcon: '🐍', miniBossName: 'Болотная ведьма', miniBossIcon: '🧙‍♀️',
    desc: 'Вода здесь дышит. И кусается.',
  },
  {
    id: 'skyruins', name: 'Небесные руины', icon: '☁️', minLevel: 85, stages: 10, killsPerStage: 12,
    monsterFamilies: ['harpy', 'elemental_storm', 'knight', 'golem', 'wisp'],
    theme: { skyTop: '#312e81', skyBottom: '#a5b4fc', ground: '#c7d2fe', groundDark: '#818cf8', tiles: ['☁️', '🏛️', '⚡', '🪨', '✨'], particles: 'rgba(199,210,254,0.7)', fog: 'rgba(165,180,252,0.25)' },
    bossName: 'Грозовой Титан Керавн', bossIcon: '⚡', miniBossName: 'Рухнувший колосс', miniBossIcon: '🏛️',
    desc: 'Парящие острова погибшей цивилизации.',
  },
  {
    id: 'cavern', name: 'Бездонная пещера', icon: '🕳️', minLevel: 105, stages: 10, killsPerStage: 13,
    monsterFamilies: ['spider', 'abyss', 'ghost', 'crab', 'cultist'],
    theme: { skyTop: '#020617', skyBottom: '#1e1b4b', ground: '#1e293b', groundDark: '#0f172a', tiles: ['🕳️', '💎', '🦇', '🕸️', '👁️'], particles: 'rgba(139,92,246,0.5)', fog: 'rgba(30,27,75,0.4)' },
    bossName: 'Мать Тьмы Ша-Нар', bossIcon: '👁️', miniBossName: 'Страж глубин', miniBossIcon: '🦑',
    desc: 'Спуск, из которого не все возвращаются.',
  },
  {
    id: 'rift', name: 'Демонический разлом', icon: '🔥', minLevel: 125, stages: 10, killsPerStage: 13,
    monsterFamilies: ['demon', 'elemental_fire', 'abyss', 'knight', 'cultist'],
    theme: { skyTop: '#1a0000', skyBottom: '#991b1b', ground: '#450a0a', groundDark: '#1c0a0a', tiles: ['🔥', '😈', '💀', '🌋', '⚔️'], particles: 'rgba(239,68,68,0.6)', fog: 'rgba(153,27,27,0.3)' },
    bossName: 'Повелитель Разлома Азгор', bossIcon: '😈', miniBossName: 'Демон-инквизитор', miniBossIcon: '👿',
    desc: 'Рана в мире, из которой сочится зло.',
  },
  {
    id: 'crystal', name: 'Хрустальные чертоги', icon: '💎', minLevel: 150, stages: 10, killsPerStage: 14,
    monsterFamilies: ['golem', 'mage', 'construct', 'elemental_ice', 'wisp', 'mimic'],
    theme: { skyTop: '#164e63', skyBottom: '#67e8f9', ground: '#155e75', groundDark: '#0e7490', tiles: ['💎', '🔮', '✨', '🧊', '💠'], particles: 'rgba(103,232,249,0.7)', fog: 'rgba(103,232,249,0.2)' },
    bossName: 'Хрустальный Серафим', bossIcon: '💠', miniBossName: 'Зеркальный страж', miniBossIcon: '🪞',
    desc: 'Залы, где свет преломляется в вечность.',
  },
  {
    id: 'throne', name: 'Трон Бездны', icon: '🌑', minLevel: 180, stages: 10, killsPerStage: 15,
    monsterFamilies: ['abyss', 'dragon', 'demon', 'knight', 'mage', 'vampire'],
    theme: { skyTop: '#000000', skyBottom: '#4c1d95', ground: '#2e1065', groundDark: '#1e1b4b', tiles: ['🌑', '👁️', '☄️', '💜', '🗡️'], particles: 'rgba(168,85,247,0.6)', fog: 'rgba(76,29,149,0.35)' },
    bossName: 'Аватар Бездны', bossIcon: '🌑', miniBossName: 'Глашатай конца', miniBossIcon: '☄️',
    desc: 'Последний рубеж. Дальше — только тьма.',
  },
  // ===== HIDDEN ZONES =====
  {
    id: 'shroom', name: 'Грибная роща', icon: '🍄', minLevel: 12, stages: 6, killsPerStage: 8,
    monsterFamilies: ['mushroom', 'wisp', 'slime'], hidden: true, unlockHint: 'Выполните квест «Тихая охота»',
    theme: { skyTop: '#4a044e', skyBottom: '#d946ef', ground: '#701a75', groundDark: '#4a044e', tiles: ['🍄', '✨', '🌙', '💜', '🫧'], particles: 'rgba(217,70,239,0.6)', fog: 'rgba(162,28,175,0.3)' },
    bossName: 'Мицелий-Император', bossIcon: '🍄', miniBossName: 'Споровый страж', miniBossIcon: '🌿',
    desc: 'Скрытая роща светящихся грибов.',
  },
  {
    id: 'sunken', name: 'Затонувший храм', icon: '🌊', minLevel: 35, stages: 6, killsPerStage: 9,
    monsterFamilies: ['crab', 'ghost', 'snake', 'abyss'], hidden: true, unlockHint: 'Победите 5 боссов',
    theme: { skyTop: '#082f49', skyBottom: '#0ea5e9', ground: '#075985', groundDark: '#0c4a6e', tiles: ['🌊', '🐚', '🦀', '⛲', '💠'], particles: 'rgba(56,189,248,0.6)', fog: 'rgba(14,165,233,0.25)' },
    bossName: 'Древний Левиафан', bossIcon: '🦑', miniBossName: 'Жрец глубин', miniBossIcon: '🐚',
    desc: 'Храм, поглощённый океаном времён.',
  },
  {
    id: 'graveyard', name: 'Кладбище героев', icon: '🪦', minLevel: 60, stages: 6, killsPerStage: 10,
    monsterFamilies: ['ghost', 'skeleton', 'vampire', 'knight', 'wisp'], hidden: true, unlockHint: 'Достигните 50 уровня',
    theme: { skyTop: '#0f172a', skyBottom: '#475569', ground: '#334155', groundDark: '#1e293b', tiles: ['🪦', '🕯️', '👻', '🌫️', '💀'], particles: 'rgba(148,163,184,0.6)', fog: 'rgba(71,85,105,0.35)' },
    bossName: 'Первый Герой', bossIcon: '⚔️', miniBossName: 'Капитан стражи', miniBossIcon: '🛡️',
    desc: 'Здесь покоятся легенды. Почти.',
  },
  {
    id: 'mechgarden', name: 'Механический сад', icon: '⚙️', minLevel: 95, stages: 6, killsPerStage: 11,
    monsterFamilies: ['construct', 'golem', 'harpy', 'elemental_storm'], hidden: true, unlockHint: 'Пройдите 3 подземелья',
    theme: { skyTop: '#27272a', skyBottom: '#a1a1aa', ground: '#52525b', groundDark: '#3f3f46', tiles: ['⚙️', '🔩', '🤖', '💡', '🛰️'], particles: 'rgba(250,204,21,0.5)', fog: 'rgba(161,161,170,0.25)' },
    bossName: 'Садовник Прайм', bossIcon: '🤖', miniBossName: 'Секатор-9000', miniBossIcon: '⚙️',
    desc: 'Сад, где цветы выращивают из стали.',
  },
];

export const zoneById = (id: string) => ZONES.find(z => z.id === id)!;

// ===================== DUNGEONS (8) =====================
export const DUNGEONS: DungeonDef[] = [
  { id: 'crypt', name: 'Склеп забвения', icon: '⚰️', minLevel: 5, waves: 6, familyPool: ['skeleton', 'zombie', 'ghost'], bossName: 'Лич Мордегай', bossIcon: '💀', lootBonus: 3, xpMult: 2, goldMult: 2, desc: 'Крипта древнего некроманта.' },
  { id: 'lair', name: 'Логово пауков', icon: '🕸️', minLevel: 15, waves: 7, familyPool: ['spider', 'slime'], bossName: 'Королева Арахнидов', bossIcon: '🕷️', lootBonus: 4, xpMult: 2.2, goldMult: 2.2, desc: 'Коконы висят до горизонта.' },
  { id: 'forge', name: 'Пылающая кузня', icon: '⚒️', minLevel: 28, waves: 8, familyPool: ['elemental_fire', 'construct', 'demon'], bossName: 'Кузнец Рока', bossIcon: '🔥', lootBonus: 5, xpMult: 2.5, goldMult: 2.5, desc: 'Здесь куют оружие для армий тьмы.' },
  { id: 'icevault', name: 'Ледяное хранилище', icon: '🧊', minLevel: 45, waves: 8, familyPool: ['elemental_ice', 'ghost', 'bear'], bossName: 'Хранитель Фрост', bossIcon: '❄️', lootBonus: 6, xpMult: 2.8, goldMult: 2.8, desc: 'Сокровища, замороженные навеки.' },
  { id: 'sandtomb', name: 'Гробница песков', icon: '🏺', minLevel: 60, waves: 9, familyPool: ['scorpion', 'snake', 'mimic', 'construct'], bossName: 'Фараон Сетех', bossIcon: '👑', lootBonus: 7, xpMult: 3.2, goldMult: 3.5, desc: 'Проклятие ждёт грабителей.' },
  { id: 'stormspire', name: 'Штормовой шпиль', icon: '🗼', minLevel: 80, waves: 9, familyPool: ['elemental_storm', 'harpy', 'mage'], bossName: 'Архимаг Темпест', bossIcon: '🌩️', lootBonus: 8, xpMult: 3.6, goldMult: 3.8, desc: 'Башня, притягивающая молнии.' },
  { id: 'bloodhall', name: 'Чертог крови', icon: '🩸', minLevel: 100, waves: 10, familyPool: ['vampire', 'knight', 'cultist'], bossName: 'Князь Влад Цепеш', bossIcon: '🧛', lootBonus: 9, xpMult: 4, goldMult: 4, desc: 'Пир вампиров длится веками.' },
  { id: 'abysscore', name: 'Ядро Бездны', icon: '🌌', minLevel: 140, waves: 12, familyPool: ['abyss', 'demon', 'dragon'], bossName: 'Око Пустоты', bossIcon: '👁️', lootBonus: 12, xpMult: 5, goldMult: 5, desc: 'Сердце самой тьмы.' },
];

export const dungeonById = (id: string) => DUNGEONS.find(d => d.id === id)!;
