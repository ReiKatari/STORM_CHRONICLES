import type { SkillDef, TalentDef } from './types';

// ===================== ACTIVE SKILLS (12) =====================
export const SKILLS: SkillDef[] = [
  { id: 'power_strike', name: 'Мощный удар', icon: '⚔️', desc: 'Сокрушительный удар оружием по цели.', unlockLevel: 1, maxRank: 10, manaCost: 12, cooldown: 5, kind: 'damage', basePower: 180, scaling: 'str', color: '#fbbf24', fx: 'slash' },
  { id: 'fireball', name: 'Огненный шар', icon: '🔥', desc: 'Шар пламени, опаляющий врага.', unlockLevel: 3, maxRank: 10, manaCost: 18, cooldown: 6, kind: 'damage', basePower: 220, scaling: 'int', color: '#f97316', fx: 'fire' },
  { id: 'frost_nova', name: 'Ледяная нова', icon: '❄️', desc: 'Волна холда бьёт врага и замедляет его атаку.', unlockLevel: 6, maxRank: 10, manaCost: 22, cooldown: 9, kind: 'damage', basePower: 160, scaling: 'int', color: '#38bdf8', fx: 'ice' },
  { id: 'heal', name: 'Исцеление', icon: '💚', desc: 'Свет восстанавливает ваше здоровье.', unlockLevel: 8, maxRank: 10, manaCost: 30, cooldown: 14, kind: 'heal', basePower: 25, scaling: 'wis', color: '#4ade80', fx: 'heal' },
  { id: 'whirlwind', name: 'Вихрь клинков', icon: '🌪️', desc: 'Яростное вращение наносит огромный урон.', unlockLevel: 12, maxRank: 10, manaCost: 28, cooldown: 10, kind: 'damage', basePower: 300, scaling: 'str', color: '#e2e8f0', fx: 'slash' },
  { id: 'poison_blade', name: 'Отравленный клинок', icon: '☠️', desc: 'Яд разъедает врага со временем.', unlockLevel: 16, maxRank: 10, manaCost: 20, cooldown: 8, kind: 'dot', basePower: 90, scaling: 'wil', color: '#84cc16', fx: 'poison' },
  { id: 'lightning', name: 'Цепная молния', icon: '⚡', desc: 'Разряд небесной энергии.', unlockLevel: 22, maxRank: 10, manaCost: 26, cooldown: 7, kind: 'damage', basePower: 260, scaling: 'int', color: '#facc15', fx: 'lightning' },
  { id: 'blood_ritual', name: 'Кровавый ритуал', icon: '🩸', desc: 'Жертвуете 5% HP ради чудовищного урона.', unlockLevel: 30, maxRank: 10, manaCost: 10, cooldown: 12, kind: 'damage', basePower: 420, scaling: 'str', color: '#dc2626', fx: 'blood' },
  { id: 'faith_shield', name: 'Щит веры', icon: '🛡️', desc: 'Барьер поглощает урон следующих атак врага.', unlockLevel: 38, maxRank: 10, manaCost: 35, cooldown: 20, kind: 'buff', basePower: 40, scaling: 'wil', color: '#fde68a', fx: 'shield' },
  { id: 'meteor', name: 'Метеор', icon: '☄️', desc: 'С небес падает камень судьбы.', unlockLevel: 50, maxRank: 10, manaCost: 55, cooldown: 18, kind: 'damage', basePower: 600, scaling: 'int', color: '#fb923c', fx: 'meteor' },
  { id: 'pack_call', name: 'Зов стаи', icon: '🐺', desc: 'Духи волков терзают врага.', unlockLevel: 65, maxRank: 10, manaCost: 45, cooldown: 15, kind: 'damage', basePower: 380, scaling: 'wil', color: '#94a3b8', fx: 'summon' },
  { id: 'annihilation', name: 'Аннигиляция', icon: '🌌', desc: 'Чистая энергия Бездны стирает врага.', unlockLevel: 90, maxRank: 10, manaCost: 80, cooldown: 25, kind: 'damage', basePower: 900, scaling: 'int', color: '#a855f7', fx: 'meteor' },
];

export const skillById = (id: string) => SKILLS.find(s => s.id === id)!;

// ===================== TALENT TREE (3 branches × 8 = 24 talents) =====================
export const TALENTS: TalentDef[] = [
  // --- Warrior ---
  { id: 'w_dmg', branch: 'warrior', name: 'Грубая сила', icon: '💪', desc: '+6% к урону за ранг', maxRank: 5, row: 0, per: r => `+${r * 6}% урон` },
  { id: 'w_hp', branch: 'warrior', name: 'Толстая шкура', icon: '🛡️', desc: '+8% к здоровью за ранг', maxRank: 5, row: 0, per: r => `+${r * 8}% HP` },
  { id: 'w_crit', branch: 'warrior', name: 'Смертоносность', icon: '💥', desc: '+2% к шансу крита за ранг', maxRank: 5, row: 1, per: r => `+${r * 2}% крит` },
  { id: 'w_armor', branch: 'warrior', name: 'Живая крепость', icon: '🏰', desc: '+10% к броне за ранг', maxRank: 5, row: 1, per: r => `+${r * 10}% броня` },
  { id: 'w_rage', branch: 'warrior', name: 'Неукротимая ярость', icon: '😡', desc: '+4% скорость атаки за ранг', maxRank: 5, row: 2, per: r => `+${r * 4}% скорость` },
  { id: 'w_execute', branch: 'warrior', name: 'Казнь', icon: '🪓', desc: '+15% урона по боссам за ранг', maxRank: 5, row: 3, per: r => `+${r * 15}% урона боссам` },
  { id: 'w_lifesteal', branch: 'warrior', name: 'Жажда крови', icon: '🩸', desc: '+1% вампиризм за ранг', maxRank: 5, row: 4, per: r => `+${r}% вампиризм` },
  { id: 'w_juggernaut', branch: 'warrior', name: 'Джаггернаут', icon: '🦾', desc: '+5 ко ВСЕМ боевым статам за ранг', maxRank: 3, row: 4, per: r => `+${r * 5} всем статам` },
  // --- Mage ---
  { id: 'm_int', branch: 'mage', name: 'Острый разум', icon: '🧠', desc: '+6% к силе скиллов за ранг', maxRank: 5, row: 0, per: r => `+${r * 6}% сила скиллов` },
  { id: 'm_mana', branch: 'mage', name: 'Глубокий резерв', icon: '🔮', desc: '+10% к мане за ранг', maxRank: 5, row: 0, per: r => `+${r * 10}% мана` },
  { id: 'm_cd', branch: 'mage', name: 'Быстрое колдовство', icon: '⏱️', desc: '-4% перезарядка за ранг', maxRank: 5, row: 1, per: r => `-${r * 4}% кулдауны` },
  { id: 'm_regen', branch: 'mage', name: 'Медитация', icon: '🧘', desc: '+15% реген маны за ранг', maxRank: 5, row: 1, per: r => `+${r * 15}% реген маны` },
  { id: 'm_dot', branch: 'mage', name: 'Разъедающие чары', icon: '☠️', desc: '+10% к DoT-эффектам за ранг', maxRank: 5, row: 2, per: r => `+${r * 10}% DoT` },
  { id: 'm_heal', branch: 'mage', name: 'Дар жизни', icon: '💚', desc: '+12% к исцелению за ранг', maxRank: 5, row: 3, per: r => `+${r * 12}% исцеление` },
  { id: 'm_glass', branch: 'mage', name: 'Хрустальная пушка', icon: '💎', desc: '+10% урон, -3% HP за ранг', maxRank: 5, row: 4, per: r => `+${r * 10}% урон, -${r * 3}% HP` },
  { id: 'm_archon', branch: 'mage', name: 'Архонт', icon: '🌟', desc: '+5 к Интеллекту и Мудрости за ранг', maxRank: 3, row: 4, per: r => `+${r * 5} INT/WIS` },
  // --- Wanderer ---
  { id: 't_gold', branch: 'wanderer', name: 'Золотая жилка', icon: '💰', desc: '+10% к золоту за ранг', maxRank: 5, row: 0, per: r => `+${r * 10}% золото` },
  { id: 't_xp', branch: 'wanderer', name: 'Быстрая учёба', icon: '📈', desc: '+8% к опыту за ранг', maxRank: 5, row: 0, per: r => `+${r * 8}% опыт` },
  { id: 't_luck', branch: 'wanderer', name: 'Фортуна', icon: '🍀', desc: '+3 к Удаче за ранг', maxRank: 5, row: 1, per: r => `+${r * 3} удача` },
  { id: 't_dodge', branch: 'wanderer', name: 'Уворот', icon: '💨', desc: '+1.5% к уклонению за ранг', maxRank: 5, row: 1, per: r => `+${r * 1.5}% уклонение` },
  { id: 't_stats', branch: 'wanderer', name: 'Эрудит', icon: '📚', desc: '+1 очко статов за ранг при левел-апе (мгновенно)', maxRank: 3, row: 2, per: r => `+${r} очков статов` },
  { id: 't_quest', branch: 'wanderer', name: 'Искатель приключений', icon: '🗺️', desc: '+10% к наградам квестов за ранг', maxRank: 5, row: 3, per: r => `+${r * 10}% награды` },
  { id: 't_drop', branch: 'wanderer', name: 'Нюх на лут', icon: '💎', desc: '+8% к шансу дропа за ранг', maxRank: 5, row: 4, per: r => `+${r * 8}% дроп` },
  { id: 't_second', branch: 'wanderer', name: 'Второе дыхание', icon: '❤️‍🔥', desc: 'Реген +1% HP/с за ранг вне атаки', maxRank: 3, row: 4, per: r => `+${r}% HP/с реген` },
];

export const talentById = (id: string) => TALENTS.find(t => t.id === id)!;
export const BRANCHES = [
  { id: 'warrior', name: 'Воин', icon: '⚔️', color: '#f87171' },
  { id: 'mage', name: 'Маг', icon: '🔮', color: '#60a5fa' },
  { id: 'wanderer', name: 'Странник', icon: '🍀', color: '#4ade80' },
] as const;
