import type { DungeonDef, MonsterDef, ZoneDef } from './types';
import { declinePrefix, type Gender } from './items';

// ===================== MONSTER FAMILIES (50 families × 10 tiers = 500+ monsters) =====================
export interface FamilyDef {
  id: string;
  name: string;
  icons: string[];   // one per tier
  color: string;
  adjectives: string[];
  g?: Gender;        // grammar gender (default m)
  artSrc?: string;   // optional image artwork source
}

const ADJ = [
  'Слабый', 'Дикий', 'Злобный', 'Яростный', 'Свирепый',
  'Древний', 'Проклятый', 'Титанический', 'Астральный', 'Абсолютный'
];

export const FAMILIES: FamilyDef[] = [
  { id: 'slime',           name: 'Слайм',             icons: ['🟢', '🟩', '💚', '🫧', '🧪', '🦠', '☢️', '🧫', '❇️', '🌑'], color: '#4ade80', adjectives: ADJ, artSrc: '/monsters/slime.jpg' },
  { id: 'rat',             name: 'Крысолюд',          icons: ['🐀', '🐁', '🦷', '🐭', '👁️', '🦴', '⚫', '🩸', '💀', '👑'], color: '#a8a29e', adjectives: ADJ, artSrc: '/monsters/rat.jpg' },
  { id: 'goblin',          name: 'Гоблин',            icons: ['👺', '🗡️', '🏹', '💣', '🛡️', '🔥', '👑', '⚡', '💥', '💀'], color: '#84cc16', adjectives: ADJ, artSrc: '/monsters/goblin.jpg' },
  { id: 'skeleton',        name: 'Скелет',            icons: ['💀', '🦴', '⚔️', '🛡️', '🏹', '🔮', '👑', '🕯️', '☠️', '🌑'], color: '#e7e5e4', adjectives: ADJ, artSrc: '/monsters/skeleton.jpg' },
  { id: 'zombie',          name: 'Зомби',             icons: ['🧟', '🧟‍♂️', '🧟‍♀️', '🪦', '☣️', '🧠', '👑', '🩸', '☠️', '🌑'], color: '#65a30d', adjectives: ADJ, artSrc: '/monsters/zombie.jpg' },
  { id: 'spider',          name: 'Паук',              icons: ['🕷️', '🕸️', '🦂', '👁️', '🥚', '💀', '👑', '🟣', '🔮', '🌑'], color: '#7c3aed', adjectives: ADJ, artSrc: '/monsters/spider.jpg' },
  { id: 'wolf',            name: 'Волк',              icons: ['🐺', '🦷', '🌕', '❄️', '🔥', '⚡', '👑', '🌌', '🌠', '🌑'], color: '#64748b', adjectives: ADJ, artSrc: '/monsters/wolf.jpg' },
  { id: 'orc',             name: 'Орк',               icons: ['👹', '🪓', '🛡️', '🏹', '💪', '🔥', '👑', '⚔️', '🌋', '🌑'], color: '#16a34a', adjectives: ADJ, artSrc: '/monsters/orc.jpg' },
  { id: 'bandit',          name: 'Бандит',            icons: ['🥷', '🗡️', '💰', '🏴‍☠️', '⚔️', '🎯', '👑', '💣', '⚡', '🌑'], color: '#b45309', adjectives: ADJ, artSrc: '/monsters/bandit.jpg' },
  { id: 'ghost',           name: 'Призрак',           icons: ['👻', '🕯️', '⚪', '🌫️', '😱', '💀', '👑', '❄️', '🌌', '🌑'], color: '#93c5fd', adjectives: ADJ, artSrc: '/monsters/ghost.jpg' },
  { id: 'vampire',         name: 'Вампир',            icons: ['🧛', '🧛‍♂️', '🦇', '🩸', '🍷', '🌹', '👑', '🩸', '🔮', '🌑'], color: '#dc2626', adjectives: ADJ, artSrc: '/monsters/vampire.jpg' },
  { id: 'golem',           name: 'Голем',             icons: ['🗿', '🪨', '⛰️', '💎', '🔥', '❄️', '👑', '⚡', '🌋', '🌑'], color: '#78716c', adjectives: ADJ, artSrc: '/monsters/golem.jpg' },
  { id: 'cultist',         name: 'Культист',          icons: ['🕯️', '🔮', '📿', '☠️', '🩸', '👁️', '👑', '🖤', '🌌', '🌑'], color: '#9333ea', adjectives: ADJ, artSrc: '/monsters/cultist.jpg' },
  { id: 'demon',           name: 'Демон',             icons: ['😈', '🔥', '👿', '⚔️', '💀', '🌋', '👑', '🩸', '⚡', '🌑'], color: '#ef4444', adjectives: ADJ, artSrc: '/monsters/demon.jpg' },
  { id: 'elemental_fire',  name: 'Элементаль огня',   icons: ['🔥', '🎇', '☄️', '🌋', '💥', '⚡', '👑', '☀️', '🌟', '🌑'], color: '#f97316', adjectives: ADJ, artSrc: '/monsters/fire_elemental.jpg' },
  { id: 'elemental_ice',   name: 'Элементаль льда',   icons: ['❄️', '🧊', '💠', '🌨️', '⛄', '💎', '👑', '🌐', '🌌', '🌑'], color: '#38bdf8', adjectives: ADJ, artSrc: '/monsters/elemental_ice.jpg' },
  { id: 'elemental_storm', name: 'Элементаль бури',  icons: ['⚡', '🌩️', '🌪️', '💨', '☁️', '🔮', '👑', '🌟', '⚡', '🌑'], color: '#facc15', adjectives: ADJ },
  { id: 'mushroom',        name: 'Гриб',              icons: ['🍄', '🌿', '🟤', '☠️', '💚', '🔮', '👑', '🧪', '✨', '🌑'], color: '#d946ef', adjectives: ADJ },
  { id: 'crab',            name: 'Краб',              icons: ['🦀', '🦞', '🦐', '🌊', '🐚', '💎', '👑', '🫧', '🌊', '🌑'], color: '#fb7185', adjectives: ADJ },
  { id: 'snake',           name: 'Змея',              icons: ['🐍', '🦎', '🥚', '☠️', '💚', '👁️', '👑', '🧪', '🩸', '🌑'], color: '#22c55e', adjectives: ADJ, g: 'f' },
  { id: 'scorpion',        name: 'Скорпион',          icons: ['🦂', '🏜️', '☠️', '🔥', '💛', '👁️', '👑', '⚡', '💥', '🌑'], color: '#eab308', adjectives: ADJ },
  { id: 'harpy',           name: 'Гарпия',            icons: ['🦅', '🪶', '💨', '🌪️', '👁️', '⚡', '👑', '🌟', '✨', '🌑'], color: '#a3e635', adjectives: ADJ, g: 'f' },
  { id: 'bear',            name: 'Медведь',           icons: ['🐻', '🐾', '❄️', '🔥', '🌲', '💀', '👑', '⚡', '🌟', '🌑'], color: '#92400e', adjectives: ADJ, artSrc: '/monsters/bear.jpg' },
  { id: 'mimic',           name: 'Мимик',             icons: ['📦', '🎁', '🪙', '👅', '🦷', '💎', '👑', '💰', '✨', '🌑'], color: '#f59e0b', adjectives: ADJ, artSrc: '/monsters/mimic.jpg' },
  { id: 'mage',            name: 'Тёмный маг',        icons: ['🧙', '🧙‍♂️', '🔮', '📖', '⚡', '💀', '👑', '🌌', '✨', '🌑'], color: '#8b5cf6', adjectives: ADJ },
  { id: 'knight',          name: 'Проклятый рыцарь',  icons: ['🛡️', '⚔️', '🏇', '🎠', '💀', '🔥', '👑', '⚡', '🌟', '🌑'], color: '#475569', adjectives: ADJ, artSrc: '/monsters/knight.jpg' },
  { id: 'dragon',          name: 'Дракон',            icons: ['🐉', '🐲', '🔥', '❄️', '⚡', '💎', '👑', '🌟', '🌌', '🌑'], color: '#dc2626', adjectives: ADJ, artSrc: '/monsters/dragon.jpg' },
  { id: 'wisp',            name: 'Дух',               icons: ['✨', '💫', '🌟', '🔆', '🕯️', '💀', '👑', '🌌', '⚡', '🌑'], color: '#fde68a', adjectives: ADJ },
  { id: 'construct',       name: 'Механизм',          icons: ['⚙️', '🤖', '🔩', '🛰️', '💣', '🔥', '👑', '⚡', '💥', '🌑'], color: '#94a3b8', adjectives: ADJ },
  { id: 'abyss',           name: 'Порождение Бездны', icons: ['🌑', '👁️', '🕳️', '🦑', '💜', '☄️', '👑', '🌌', '✨', '🪐'], color: '#6d28d9', adjectives: ADJ, g: 'n', artSrc: '/monsters/abyss.jpg' },

  // New Monster Families T30-T50
  { id: 'lich',            name: 'Лич',               icons: ['🧙‍♂️', '💀', '🔮', '🕯️', '⚡', '📜', '👑', '🟣', '🌌', '🌑'], color: '#06b6d4', adjectives: ADJ, artSrc: '/monsters/lich.jpg' },
  { id: 'gargoyle',        name: 'Гаргулья',          icons: ['🗿', '🦅', '🦇', '🪨', '⛓️', '👁️', '👑', '⚡', '🌟', '🌑'], color: '#64748b', adjectives: ADJ, g: 'f', artSrc: '/monsters/gargoyle.jpg' },
  { id: 'minotaur',        name: 'Минотавр',          icons: ['🐂', '🪓', '🛡️', '🪵', '🌋', '🔥', '👑', '⚔️', '💥', '🌑'], color: '#b45309', adjectives: ADJ, artSrc: '/monsters/minotaur.jpg' },
  { id: 'hydra',           name: 'Гидра',             icons: ['🐍', '🐉', '🌊', '🧪', '💚', '🔥', '👑', '⚡', '💥', '🌑'], color: '#059669', adjectives: ADJ, g: 'f', artSrc: '/monsters/hydra.jpg' },
  { id: 'siren',           name: 'Сирена',            icons: ['🧜‍♀️', '🐚', '🌊', '🔮', '🎵', '💫', '👑', '✨', '🌐', '🌑'], color: '#0284c7', adjectives: ADJ, g: 'f' },
  { id: 'treant',          name: 'Древень',           icons: ['🪵', '🌳', '🌲', '🌿', '🍄', '🍃', '👑', '🌱', '✨', '🌑'], color: '#15803d', adjectives: ADJ, artSrc: '/monsters/treant.jpg' },
  { id: 'wyvern',          name: 'Виверна',           icons: ['🦎', '🦅', '💨', '⚡', '🐉', '🔥', '👑', '🌟', '🌌', '🌑'], color: '#ea580c', adjectives: ADJ, g: 'f', artSrc: '/monsters/wyvern.jpg' },
  { id: 'necromancer',     name: 'Некромант',         icons: ['💀', '🧙‍♂️', '📜', '🕯️', '🩸', '🔮', '👑', '🟣', '🌌', '🌑'], color: '#7e22ce', adjectives: ADJ },
  { id: 'shadow',          name: 'Тень',              icons: ['👤', '🖤', '🕶️', '🌑', '👁️', '🔮', '👑', '⚡', '🌌', '🪐'], color: '#334155', adjectives: ADJ, g: 'f' },
  { id: 'phoenix',         name: 'Феникс',            icons: ['🐦', '🔥', '☀️', '🎇', '🪶', '🌟', '👑', '✨', '⚡', '💥'], color: '#f59e0b', adjectives: ADJ, artSrc: '/monsters/phoenix.jpg' },
  { id: 'beholder',        name: 'Бехолдер',          icons: ['👁️', '🔮', '🔴', '⚡', '👾', '🧠', '👑', '🟣', '🌌', '🪐'], color: '#c084fc', adjectives: ADJ, artSrc: '/monsters/beholder.jpg' },
  { id: 'kraken',          name: 'Кракен',            icons: ['🦑', '🐙', '🌊', '⚓', '🌊', '💎', '👑', '⚡', '🌐', '🌑'], color: '#0369a1', adjectives: ADJ, artSrc: '/monsters/kraken.jpg' },
  { id: 'leviathan',       name: 'Левиафан',          icons: ['🐋', '🌊', '⚡', '❄️', '💎', '🌌', '👑', '✨', '🪐', '🌑'], color: '#0f766e', adjectives: ADJ },
  { id: 'manticore',       name: 'Мантикора',         icons: ['🦁', '🦂', '🦅', '🔥', '☠️', '⚡', '👑', '💥', '🌌', '🌑'], color: '#d97706', adjectives: ADJ, g: 'f' },
  { id: 'basilisk',        name: 'Василиск',          icons: ['🦎', '🐍', '👁️', '🪨', '🧪', '☠️', '👑', '⚡', '💥', '🌑'], color: '#65a30d', adjectives: ADJ, artSrc: '/monsters/basilisk.jpg' },
  { id: 'sphinx',          name: 'Сфинкс',            icons: ['🦁', '🦅', '👑', '📜', '🔮', '☀️', '👑', '✨', '🌌', '🌑'], color: '#eab308', adjectives: ADJ, artSrc: '/monsters/sphinx.jpg' },
  { id: 'djinn',           name: 'Джинн',             icons: ['🧞', '💨', '🌪️', '🏺', '⚡', '🔮', '👑', '✨', '🌌', '🌑'], color: '#38bdf8', adjectives: ADJ, artSrc: '/monsters/djinn.jpg' },
  { id: 'gorgon',          name: 'Горгона',           icons: ['🐍', '👁️', '🪨', '🏹', '🧪', '💀', '👑', '⚡', '💥', '🌑'], color: '#10b981', adjectives: ADJ, g: 'f' },
  { id: 'chimera',         name: 'Химера',            icons: ['🦁', '🐐', '🐍', '🔥', '⚡', '💥', '👑', '🌟', '🌌', '🌑'], color: '#ef4444', adjectives: ADJ, g: 'f', artSrc: '/monsters/chimera.jpg' },
  { id: 'archdemon',       name: 'Архидемон',         icons: ['😈', '🌋', '🔥', '⚔️', '💀', '🩸', '👑', '🪐', '🌌', '🌑'], color: '#991b1b', adjectives: ADJ, artSrc: '/monsters/archdemon.jpg' },
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
  let artSrc = fam.artSrc;
  const mName = opts?.name ?? '';
  if (mName.includes('Дракон') || mName.includes('Аурум') || (isBoss && familyId === 'dragon')) {
    artSrc = '/monsters/dragon.jpg';
  } else if (mName.includes('Мимик') || (isBoss && familyId === 'mimic')) {
    artSrc = '/monsters/mimic.jpg';
  } else if (mName.includes('Иггдрасиль') || mName.includes('Древень') || (isBoss && familyId === 'treant')) {
    artSrc = '/monsters/treant.jpg';
  } else if (mName.includes('Арахна') || mName.includes('Арахнид') || (isBoss && familyId === 'spider')) {
    artSrc = '/monsters/spider_queen.jpg';
  } else if (mName.includes('Гоблин') || (isBoss && familyId === 'goblin')) {
    artSrc = '/monsters/goblin_king.jpg';
  } else if (mName.includes('Голем') || (isBoss && familyId === 'golem')) {
    artSrc = '/monsters/golem.jpg';
  } else if (mName.includes('Варатракс') || mName.includes('Гидра') || (isBoss && familyId === 'hydra')) {
    artSrc = '/monsters/hydra.jpg';
  } else if (mName.includes('Песков') || mName.includes('Иблис') || (isBoss && familyId === 'elemental_fire')) {
    artSrc = '/monsters/fire_elemental.jpg';
  } else if (mName.includes('Магмус') || mName.includes('Архидемон') || (isBoss && familyId === 'archdemon')) {
    artSrc = '/monsters/archdemon.jpg';
  } else if (mName.includes('Малзахар') || mName.includes('Лич') || (isBoss && familyId === 'lich')) {
    artSrc = '/monsters/lich.jpg';
  } else if (mName.includes('Дракула') || mName.includes('Вампир') || (isBoss && familyId === 'vampire')) {
    artSrc = '/monsters/vampire.jpg';
  } else if (mName.includes('Ньярлатхотеп') || mName.includes('Абаддон') || (isBoss && familyId === 'abyss')) {
    artSrc = '/monsters/abyss.jpg';
  } else if (mName.includes('Виверна') || (isBoss && familyId === 'wyvern')) {
    artSrc = '/monsters/wyvern.jpg';
  } else if (mName.includes('Химера') || (isBoss && familyId === 'chimera')) {
    artSrc = '/monsters/chimera.jpg';
  } else if (mName.includes('Феникс') || (isBoss && familyId === 'phoenix')) {
    artSrc = '/monsters/phoenix.jpg';
  } else if (mName.includes('Василиск') || (isBoss && familyId === 'basilisk')) {
    artSrc = '/monsters/basilisk.jpg';
  }

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
    artSrc,
  };
}

// total distinct monsters (50 families × 10 tiers)
export const TOTAL_MONSTERS = FAMILIES.length * 10 + 20 + 10 + 10;

// ===================== ZONES (16 Zones) =====================
export const ZONES: ZoneDef[] = [
  {
    id: 'hills', name: 'Зелёные холмы', icon: '🌿', minLevel: 1, stages: 10, killsPerStage: 8,
    monsterFamilies: ['slime', 'rat', 'goblin', 'mushroom', 'wisp'],
    theme: { skyTop: '#7dd3fc', skyBottom: '#d9f99d', ground: '#4d7c0f', groundDark: '#3f6212', tiles: ['🌿', '🌱', '🍀', '🌼', '🌾'], particles: 'rgba(190,242,100,0.6)', fog: 'rgba(217,249,157,0.12)' },
    bossName: 'Король Гоблинов Гнус', bossIcon: '👑', miniBossName: 'Гоблин-вожак', miniBossIcon: '🛡️',
    desc: 'Мирные луга, кишащие мелкой нечистью.',
  },
  {
    id: 'forest', name: 'Тёмный лес', icon: '🌲', minLevel: 8, stages: 10, killsPerStage: 9,
    monsterFamilies: ['wolf', 'spider', 'goblin', 'wisp', 'treant', 'bear'],
    theme: { skyTop: '#0f2027', skyBottom: '#2c5364', ground: '#14532d', groundDark: '#052e16', tiles: ['🌲', '🌳', '🍂', '🍄', '🌫️'], particles: 'rgba(74,222,128,0.5)', fog: 'rgba(6,78,59,0.25)' },
    bossName: 'Арахна Матка', bossIcon: '🕷️', miniBossName: 'Альфа-волк', miniBossIcon: '🐺',
    desc: 'Вековой лес, где ветви скрывают небо.',
  },
  {
    id: 'mine', name: 'Заброшенная шахта', icon: '⛏️', minLevel: 18, stages: 10, killsPerStage: 10,
    monsterFamilies: ['skeleton', 'rat', 'golem', 'mimic', 'gargoyle'],
    theme: { skyTop: '#1c1917', skyBottom: '#44403c', ground: '#57534e', groundDark: '#292524', tiles: ['⛏️', '🪨', '💎', '🕯️', '🛢️'], particles: 'rgba(251,191,36,0.5)', fog: 'rgba(68,64,60,0.3)' },
    bossName: 'Каменный Голем Грак', bossIcon: '🗿', miniBossName: 'Смотритель шахты', miniBossIcon: '💀',
    desc: 'Гномы ушли. Кто-то остался.',
  },
  {
    id: 'swamp', name: 'Гнилые болота', icon: '🐸', minLevel: 30, stages: 10, killsPerStage: 11,
    monsterFamilies: ['zombie', 'snake', 'harpy', 'hydra', 'basilisk'],
    theme: { skyTop: '#14532d', skyBottom: '#365314', ground: '#1a2e05', groundDark: '#0a1702', tiles: ['🌿', '🦠', '🫧', '🪷', '🐸'], particles: 'rgba(163,230,53,0.5)', fog: 'rgba(54,83,20,0.35)' },
    bossName: 'Болотный Варатракс', bossIcon: '🐊', miniBossName: 'Болотная Ведьма', miniBossIcon: '🧙‍♀️',
    desc: 'Отравленный воздух и топи, поглощающие путников.',
  },
  {
    id: 'desert', name: 'Палящие пески', icon: '🏜️', minLevel: 45, stages: 10, killsPerStage: 12,
    monsterFamilies: ['scorpion', 'bandit', 'elemental_fire', 'sphinx', 'djinn'],
    theme: { skyTop: '#f59e0b', skyBottom: '#78350f', ground: '#d97706', groundDark: '#92400e', tiles: ['🌵', '🏜️', '🏺', '💀', '🌪️'], particles: 'rgba(253,224,71,0.6)', fog: 'rgba(245,158,11,0.2)' },
    bossName: 'Султан Песков Иблис', bossIcon: '🧞', miniBossName: 'Гигантский Скорпион', miniBossIcon: '🦂',
    desc: 'Бесконечные дюны под выжигающим солнцем.',
  },
  {
    id: 'volcano', name: 'Жерло Бездны', icon: '🌋', minLevel: 60, stages: 10, killsPerStage: 12,
    monsterFamilies: ['demon', 'elemental_fire', 'orc', 'manticore', 'archdemon'],
    theme: { skyTop: '#450a0a', skyBottom: '#7f1d1d', ground: '#991b1b', groundDark: '#450a0a', tiles: ['🌋', '🔥', '☄️', '💀', '💥'], particles: 'rgba(249,115,22,0.7)', fog: 'rgba(127,29,29,0.4)' },
    bossName: 'Лорд Пламени Магмус', bossIcon: '👹', miniBossName: 'Огненный Демон', miniBossIcon: '😈',
    desc: 'Реки лавы и пепел, падающий с неба.',
  },
  {
    id: 'peaks', name: 'Ледяные пики', icon: '🏔️', minLevel: 75, stages: 10, killsPerStage: 13,
    monsterFamilies: ['elemental_ice', 'wolf', 'bear', 'wyvern', 'yeti'],
    theme: { skyTop: '#0c4a6e', skyBottom: '#0284c7', ground: '#e0f2fe', groundDark: '#7dd3fc', tiles: ['❄️', '🧊', '🌨️', '⛄', '💎'], particles: 'rgba(125,211,252,0.8)', fog: 'rgba(56,189,248,0.25)' },
    bossName: 'Владыка Метелей Мороз', bossIcon: '❄️', miniBossName: 'Ледяной Защитник', miniBossIcon: '🛡️',
    desc: 'Вечная мерзлота, запечатывающая души.',
  },
  {
    id: 'catacombs', name: 'Подземные катакомбы', icon: '🪦', minLevel: 90, stages: 10, killsPerStage: 13,
    monsterFamilies: ['cultist', 'ghost', 'vampire', 'necromancer', 'lich'],
    theme: { skyTop: '#3b0764', skyBottom: '#581c87', ground: '#2e1065', groundDark: '#1e1b4b', tiles: ['🪦', '🕯️', '💀', '🔮', '📜'], particles: 'rgba(192,132,252,0.6)', fog: 'rgba(88,28,135,0.4)' },
    bossName: 'Архилич Малзахар', bossIcon: '🧙‍♂️', miniBossName: 'Высший Культист', miniBossIcon: '📿',
    desc: 'Древние усыпальницы падших королей.',
  },
  {
    id: 'castle', name: 'Замок Проклятых', icon: '🏰', minLevel: 110, stages: 10, killsPerStage: 14,
    monsterFamilies: ['knight', 'vampire', 'mage', 'chimera', 'gorgon'],
    theme: { skyTop: '#1e1b4b', skyBottom: '#312e81', ground: '#1e293b', groundDark: '#0f172a', tiles: ['🏰', '⚔️', '🛡️', '🕯️', '👑'], particles: 'rgba(165,180,252,0.5)', fog: 'rgba(49,46,129,0.3)' },
    bossName: 'Граф Дракула', bossIcon: '🧛‍♂️', miniBossName: 'Командор Рыцарей', miniBossIcon: '🏇',
    desc: 'Тронный зал, где царит вечный мрак.',
  },
  {
    id: 'sea', name: 'Бездна Океана', icon: '🌊', minLevel: 130, stages: 10, killsPerStage: 14,
    monsterFamilies: ['crab', 'elemental_storm', 'siren', 'kraken', 'leviathan'],
    theme: { skyTop: '#0c4a6e', skyBottom: '#0369a1', ground: '#075985', groundDark: '#0c4a6e', tiles: ['🌊', '🐚', '⚓', '🫧', '💎'], particles: 'rgba(56,189,248,0.7)', fog: 'rgba(3,105,161,0.3)' },
    bossName: 'Кракен Глубин', bossIcon: '🦑', miniBossName: 'Морская Сирена', miniBossIcon: '🧜‍♀️',
    desc: 'Затонувшие корабли и твари морских пучин.',
  },
  {
    id: 'astral', name: 'Астральный разлом', icon: '🌌', minLevel: 160, stages: 10, killsPerStage: 15,
    monsterFamilies: ['wisp', 'construct', 'elemental_storm', 'beholder', 'shadow'],
    theme: { skyTop: '#4c1d95', skyBottom: '#6d28d9', ground: '#3b0764', groundDark: '#1e1b4b', tiles: ['✨', '💫', '🌟', '🔮', '🌀'], particles: 'rgba(232,121,249,0.8)', fog: 'rgba(109,40,217,0.35)' },
    bossName: 'Архитектор Измерений', bossIcon: '👁️', miniBossName: 'Астральный Конструкт', miniBossIcon: '⚙️',
    desc: 'Место, где искажается сама реальность.',
  },
  {
    id: 'abyss_core', name: 'Ядро Бездны', icon: '⚛️', minLevel: 200, stages: 10, killsPerStage: 15,
    monsterFamilies: ['abyss', 'demon', 'dragon', 'phoenix', 'archdemon'],
    theme: { skyTop: '#020617', skyBottom: '#0f172a', ground: '#1e1035', groundDark: '#090514', tiles: ['⚛️', '🪐', '🌌', '👁️', '☄️'], particles: 'rgba(192,132,252,0.9)', fog: 'rgba(15,23,42,0.5)' },
    bossName: 'Владыка Бездны Абаддон', bossIcon: '🌑', miniBossName: 'Страж Бездны', miniBossIcon: '👹',
    desc: 'Колыбель тьмы и начальная точка конца времён.',
  },

  // 4 HIDDEN ZONES
  {
    id: 'hidden_garden', name: 'Эдемский Сад (Скрытая)', icon: '🌺', minLevel: 50, stages: 5, killsPerStage: 10, hidden: true,
    monsterFamilies: ['mushroom', 'treant', 'wisp', 'phoenix'],
    theme: { skyTop: '#fbcfe8', skyBottom: '#f472b6', ground: '#15803d', groundDark: '#166534', tiles: ['🌺', '🌸', '🌼', '🦋', '✨'], particles: 'rgba(244,114,182,0.7)', fog: 'rgba(251,207,232,0.2)' },
    bossName: 'Древо Жизни Иггдрасиль', bossIcon: '🌳', miniBossName: 'Хранительница Сада', miniBossIcon: '🧝‍♀️',
    desc: 'Забытый оазис, укрытый от глаза Бездны.',
  },
  {
    id: 'hidden_vault', name: 'Сокровищница Гномов (Скрытая)', icon: '🪙', minLevel: 100, stages: 5, killsPerStage: 10, hidden: true,
    monsterFamilies: ['mimic', 'golem', 'construct', 'bandit'],
    theme: { skyTop: '#78350f', skyBottom: '#b45309', ground: '#d97706', groundDark: '#78350f', tiles: ['🪙', '💰', '💎', '📦', '🔑'], particles: 'rgba(251,191,36,0.8)', fog: 'rgba(180,83,9,0.3)' },
    bossName: 'Золотой Дракон Аурум', bossIcon: '🐉', miniBossName: 'Король Мимиков', miniBossIcon: '📦',
    desc: 'Подземные палаты, набитые драгоценностями.',
  },
  {
    id: 'hidden_void', name: 'Цитадель Хаоса (Скрытая)', icon: '🌀', minLevel: 150, stages: 5, killsPerStage: 10, hidden: true,
    monsterFamilies: ['abyss', 'beholder', 'shadow', 'lich'],
    theme: { skyTop: '#312e81', skyBottom: '#4c1d95', ground: '#1e1b4b', groundDark: '#0f172a', tiles: ['🌀', '🖤', '⚡', '👁️', '🪐'], particles: 'rgba(168,85,247,0.8)', fog: 'rgba(76,29,149,0.4)' },
    bossName: 'Бог Хаоса Ньярлатхотеп', bossIcon: '🦑', miniBossName: 'Тень Хаоса', miniBossIcon: '👤',
    desc: 'Межа между бытием и забвением.',
  },
  {
    id: 'hidden_throne', name: 'Небесный Престол (Скрытая)', icon: '👑', minLevel: 250, stages: 5, killsPerStage: 12, hidden: true,
    monsterFamilies: ['dragon', 'phoenix', 'archdemon', 'sphynx', 'abyss'],
    theme: { skyTop: '#fef08a', skyBottom: '#fde047', ground: '#ca8a04', groundDark: '#854d0e', tiles: ['👑', '⭐', '✨', '🗡️', '🛡️'], particles: 'rgba(253,224,71,0.9)', fog: 'rgba(254,240,138,0.25)' },
    bossName: 'Творец Вселенной', bossIcon: '🌟', miniBossName: 'Серафим-Стражник', miniBossIcon: '🪶',
    desc: 'Престол древних богов на самом вершине бытия.',
  },
];

export function zoneById(id: string): ZoneDef {
  return ZONES.find(z => z.id === id) ?? ZONES[0];
}

// ===================== DUNGEONS (8 Dungeons) =====================
export const DUNGEONS: DungeonDef[] = [
  { id: 'd1', name: 'Склизкое Логово', icon: '🧪', minLevel: 5, waves: 5, familyPool: ['slime', 'rat', 'mushroom'], bossName: 'Король Слаймов', bossIcon: '👑', lootBonus: 1, xpMult: 2, goldMult: 2, desc: 'Первое испытание для начинающего искателя.' },
  { id: 'd2', name: 'Паучье Гнездо', icon: '🕷️', minLevel: 15, waves: 5, familyPool: ['spider', 'snake', 'scorpion'], bossName: 'Королева Арахнидов', bossIcon: '🕷️', lootBonus: 2, xpMult: 2.5, goldMult: 2.5, desc: 'Ядовитые тенета и орды маленьких паучат.' },
  { id: 'd3', name: 'Крипта Костей', icon: '💀', minLevel: 25, waves: 6, familyPool: ['skeleton', 'zombie', 'ghost'], bossName: 'Владыка Скелетов', bossIcon: '💀', lootBonus: 2, xpMult: 3, goldMult: 3, desc: 'Шорох костей в беззвучной мгле.' },
  { id: 'd4', name: 'Обитель Огня', icon: '🔥', minLevel: 40, waves: 6, familyPool: ['elemental_fire', 'demon', 'manticore'], bossName: 'Демонический Ифрит', bossIcon: '🔥', lootBonus: 3, xpMult: 3.5, goldMult: 3.5, desc: 'Печь Бездны, выжигающая слабых.' },
  { id: 'd5', name: 'Башня Мага', icon: '🔮', minLevel: 60, waves: 7, familyPool: ['mage', 'construct', 'wisp'], bossName: 'Тёмный Сумрачный Архимаг', bossIcon: '🧙‍♂️', lootBonus: 3, xpMult: 4, goldMult: 4, desc: 'Магические ловушки и стихийные аномалии.' },
  { id: 'd6', name: 'Гробница Вампира', icon: '🦇', minLevel: 80, waves: 7, familyPool: ['vampire', 'cultist', 'knight'], bossName: 'Кровавый Дракула', bossIcon: '🧛‍♂️', lootBonus: 4, xpMult: 5, goldMult: 5, desc: 'Древний склеп высшей аристократии ночи.' },
  { id: 'd7', name: 'Разлом Бездны', icon: '🌌', minLevel: 120, waves: 8, familyPool: ['abyss', 'lich', 'shadow'], bossName: 'Породитель Тьмы', bossIcon: '👁️', lootBonus: 5, xpMult: 6, goldMult: 6, desc: 'Нестабильное измерение чистого хаоса.' },
  { id: 'd8', name: 'Святилище Богов', icon: '⚡', minLevel: 180, waves: 10, familyPool: ['dragon', 'phoenix', 'archdemon'], bossName: 'Верховный Титан', bossIcon: '🌟', lootBonus: 6, xpMult: 8, goldMult: 8, desc: 'Финиширующее испытание величайших героев.' },
];

export function dungeonById(id: string): DungeonDef {
  return DUNGEONS.find(d => d.id === id) ?? DUNGEONS[0];
}
