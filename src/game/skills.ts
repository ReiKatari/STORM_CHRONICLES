import type { SkillDef, TalentDef } from './types';

// ===================== ACTIVE SKILLS (35+) =====================
export const SKILLS: SkillDef[] = [
  // --- Basic & Warrior ---
  { id: 'power_strike', name: 'Мощный удар', icon: '⚔️', desc: 'Сокрушительный удар оружием по цели.', unlockLevel: 1, maxRank: 10, manaCost: 12, cooldown: 5, kind: 'damage', basePower: 180, scaling: 'str', color: '#fbbf24', fx: 'slash' },
  { id: 'whirlwind', name: 'Вихрь клинков', icon: '🌪️', desc: 'Яростное вращение наносит огромный урон.', unlockLevel: 12, maxRank: 10, manaCost: 28, cooldown: 10, kind: 'damage', basePower: 300, scaling: 'str', color: '#e2e8f0', fx: 'slash' },
  { id: 'berserk_rage', name: 'Ярость Берсерка', icon: '😡', desc: 'Прилив неистовства увеличивает урон и скорость.', unlockLevel: 18, maxRank: 10, manaCost: 25, cooldown: 12, kind: 'damage', basePower: 350, scaling: 'str', color: '#ef4444', fx: 'blood' },
  { id: 'blade_storm', name: 'Шторм Клинков', icon: '🪓', desc: 'Кровавый ураган атак, шинкующий врага.', unlockLevel: 35, maxRank: 10, manaCost: 45, cooldown: 16, kind: 'damage', basePower: 520, scaling: 'str', color: '#b91c1c', fx: 'slash' },

  // --- Mage & Archmage ---
  { id: 'fireball', name: 'Огненный шар', icon: '🔥', desc: 'Шар пламени, опаляющий врага.', unlockLevel: 3, maxRank: 10, manaCost: 18, cooldown: 6, kind: 'damage', basePower: 220, scaling: 'int', color: '#f97316', fx: 'fire' },
  { id: 'frost_nova', name: 'Ледяная нова', icon: '❄️', desc: 'Волна холода бьёт врага и замедляет его атаку.', unlockLevel: 6, maxRank: 10, manaCost: 22, cooldown: 9, kind: 'damage', basePower: 160, scaling: 'int', color: '#38bdf8', fx: 'ice' },
  { id: 'lightning', name: 'Цепная молния', icon: '⚡', desc: 'Разряд небесной энергии.', unlockLevel: 22, maxRank: 10, manaCost: 26, cooldown: 7, kind: 'damage', basePower: 260, scaling: 'int', color: '#facc15', fx: 'lightning' },
  { id: 'arcane_barrage', name: 'Чародейский Шквал', icon: '🔮', desc: 'Поток астральных стрел пробивает ману и защитные сферы.', unlockLevel: 28, maxRank: 10, manaCost: 38, cooldown: 11, kind: 'damage', basePower: 410, scaling: 'int', color: '#c084fc', fx: 'lightning' },
  { id: 'meteor', name: 'Метеор', icon: '☄️', desc: 'С небес падает камень судьбы.', unlockLevel: 50, maxRank: 10, manaCost: 55, cooldown: 18, kind: 'damage', basePower: 600, scaling: 'int', color: '#fb923c', fx: 'meteor' },
  { id: 'time_warp', name: 'Искажение Времени', icon: '⏳', desc: 'Ускоряет перезарядку и наносит временной удар.', unlockLevel: 70, maxRank: 10, manaCost: 65, cooldown: 22, kind: 'damage', basePower: 750, scaling: 'int', color: '#a855f7', fx: 'meteor' },

  // --- Paladin & Priest ---
  { id: 'holy_smite', name: 'Святая Кара', icon: '✨', desc: 'Луч божественного света сокрушает тьму.', unlockLevel: 4, maxRank: 10, manaCost: 15, cooldown: 6, kind: 'damage', basePower: 210, scaling: 'wis', color: '#fde047', fx: 'heal' },
  { id: 'heal', name: 'Исцеление', icon: '💚', desc: 'Свет восстанавливает ваше здоровье.', unlockLevel: 8, maxRank: 10, manaCost: 30, cooldown: 14, kind: 'heal', basePower: 25, scaling: 'wis', color: '#4ade80', fx: 'heal' },
  { id: 'faith_shield', name: 'Щит веры', icon: '🛡️', desc: 'Барьер поглощает урон следующих атак врага.', unlockLevel: 38, maxRank: 10, manaCost: 35, cooldown: 20, kind: 'buff', basePower: 40, scaling: 'wil', color: '#fde68a', fx: 'shield' },
  { id: 'divine_aegis', name: 'Эгида Небес', icon: '👑', desc: 'Священная аура дарует непробиваемую броню и вернёт здоровье.', unlockLevel: 60, maxRank: 10, manaCost: 50, cooldown: 24, kind: 'heal', basePower: 45, scaling: 'wis', color: '#facc15', fx: 'heal' },

  // --- Necromancer & Blood Mage ---
  { id: 'bone_spear', name: 'Костяное Копьё', icon: '🦴', desc: 'Острое копье из проклятых костей пронзает плоть.', unlockLevel: 5, maxRank: 10, manaCost: 16, cooldown: 6, kind: 'damage', basePower: 240, scaling: 'int', color: '#e2e8f0', fx: 'slash' },
  { id: 'soul_harvest', name: 'Жатва Душ', icon: '💀', desc: 'Поглощает жизненную силу врага в пользу маны и HP.', unlockLevel: 25, maxRank: 10, manaCost: 20, cooldown: 10, kind: 'damage', basePower: 330, scaling: 'int', color: '#a855f7', fx: 'poison' },
  { id: 'blood_ritual', name: 'Кровавый ритуал', icon: '🩸', desc: 'Жертвуете 5% HP ради чудовищного урона.', unlockLevel: 30, maxRank: 10, manaCost: 10, cooldown: 12, kind: 'damage', basePower: 420, scaling: 'str', color: '#dc2626', fx: 'blood' },
  { id: 'blood_burst', name: 'Кровавый Взрыв', icon: '💥', desc: 'Взрыв алой плазмы разрывает монстра на части.', unlockLevel: 45, maxRank: 10, manaCost: 40, cooldown: 14, kind: 'damage', basePower: 580, scaling: 'int', color: '#991b1b', fx: 'blood' },

  // --- Rogue & Assassin ---
  { id: 'poison_blade', name: 'Отравленный клинок', icon: '☠️', desc: 'Яд разъедает врага со временем.', unlockLevel: 16, maxRank: 10, manaCost: 20, cooldown: 8, kind: 'dot', basePower: 90, scaling: 'wil', color: '#84cc16', fx: 'poison' },
  { id: 'shadow_step', name: 'Теневой Удар', icon: '🗡️', desc: 'Мгновенный выпад из тени с гарантированным критом.', unlockLevel: 24, maxRank: 10, manaCost: 25, cooldown: 9, kind: 'damage', basePower: 360, scaling: 'agi', color: '#475569', fx: 'slash' },
  { id: 'poison_cloud', name: 'Ядовитый Смог', icon: '🧪', desc: 'Облако смертельного яда душит врага.', unlockLevel: 40, maxRank: 10, manaCost: 35, cooldown: 13, kind: 'dot', basePower: 150, scaling: 'wil', color: '#65a30d', fx: 'poison' },

  // --- Ranger & Druid ---
  { id: 'arrow_rain', name: 'Град Стрел', icon: '🏹', desc: 'Ливень смертоносных стрел обрушивается на цель.', unlockLevel: 10, maxRank: 10, manaCost: 22, cooldown: 8, kind: 'damage', basePower: 270, scaling: 'agi', color: '#10b981', fx: 'slash' },
  { id: 'falcon_strike', name: 'Удар Сокола', icon: '🦅', desc: 'Призрачный сокол когтями вырывает глаза врагу.', unlockLevel: 32, maxRank: 10, manaCost: 30, cooldown: 11, kind: 'damage', basePower: 440, scaling: 'agi', color: '#34d399', fx: 'slash' },
  { id: 'pack_call', name: 'Зов стаи', icon: '🐺', desc: 'Духи волков терзают врага.', unlockLevel: 65, maxRank: 10, manaCost: 45, cooldown: 15, kind: 'damage', basePower: 380, scaling: 'wil', color: '#94a3b8', fx: 'summon' },
  { id: 'wrath_of_nature', name: 'Гнев Природы', icon: '🌿', desc: 'Корни и молнии леса сминают монстра.', unlockLevel: 75, maxRank: 10, manaCost: 55, cooldown: 17, kind: 'damage', basePower: 680, scaling: 'int', color: '#15803d', fx: 'lightning' },

  // --- Engineer & Monk & Death Knight ---
  { id: 'turret_deploy', name: 'Боевая Турель', icon: '⚙️', desc: 'Автоматическая турель непрерывно расстреливает врага.', unlockLevel: 14, maxRank: 10, manaCost: 24, cooldown: 10, kind: 'damage', basePower: 310, scaling: 'per', color: '#06b6d4', fx: 'fire' },
  { id: 'clockwork_bomb', name: 'Часовая Бомба', icon: '💣', desc: 'Мощное взрывное устройство с часовым механизмом.', unlockLevel: 42, maxRank: 10, manaCost: 42, cooldown: 15, kind: 'damage', basePower: 560, scaling: 'per', color: '#f59e0b', fx: 'meteor' },
  { id: 'palm_strike', name: 'Удар Ладони Дракона', icon: '🥊', desc: 'Удар внутренней энергией Цзы разрушает органы монстра.', unlockLevel: 15, maxRank: 10, manaCost: 20, cooldown: 7, kind: 'damage', basePower: 320, scaling: 'wil', color: '#ec4899', fx: 'slash' },
  { id: 'frost_strike', name: 'Ледяной Жнец', icon: '🧊', desc: 'Клинок Ледяного Замораживателя вымораживает кровь.', unlockLevel: 55, maxRank: 10, manaCost: 48, cooldown: 14, kind: 'damage', basePower: 620, scaling: 'end', color: '#0284c7', fx: 'ice' },
  { id: 'annihilation', name: 'Аннигиляция Бездны', icon: '🌌', desc: 'Чистая первозданная энергия стирает врага в пыль.', unlockLevel: 90, maxRank: 10, manaCost: 80, cooldown: 25, kind: 'damage', basePower: 950, scaling: 'int', color: '#a855f7', fx: 'meteor' },
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
