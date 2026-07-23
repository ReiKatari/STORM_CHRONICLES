import type { BaseStats, SlotKind, RarityId } from './types';

export interface ClassSkillDef {
  id: string;
  name: string;
  icon: string;
  unlockLevel: number;
  maxRank: number;
  manaCost: number;
  cooldown: number;
  desc: string;
  color: string;
}

export interface ClassTalentDef {
  id: string;
  name: string;
  icon: string;
  branchId: string;
  row: number;
  maxRank: number;
  desc: string;
  per: (rank: number) => string;
}

export interface ClassBranchDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
}

export interface StarterItemDef {
  name: string;
  slot: SlotKind;
  rarity: RarityId;
  icon: string;
  dmg?: number;
  armor?: number;
  hp?: number;
}

export interface HeroClassDef {
  id: string;
  name: string;
  title: string;
  icon: string;
  artSrc?: string;
  color: string;
  desc: string;
  lore: string;
  baseStats: BaseStats;
  starterGear: StarterItemDef[];
  branches: ClassBranchDef[];
  talents: ClassTalentDef[];
  skills: ClassSkillDef[];
}

export const HERO_CLASSES: HeroClassDef[] = [
  // 1. PALADIN
  {
    id: 'paladin',
    name: 'Паладин',
    title: 'Паладин Светлого Ордена',
    icon: '🛡️',
    artSrc: '/heroes/hero_paladin.jpg',
    color: '#facc15',
    desc: 'Маг-священник и несокрушимый страж в тяжелых доспехах. Обладает высокой броней и исцеляющим светом.',
    lore: 'Воспитанный в святилищах Ордена Солнечного Завета, Паладин поклялся защищать слабых от экспансии Бездны. Его молот напитаем благословенным пламенем, а молитвы даруют несокрушимый щит в самых безнадежных битвах.',
    baseStats: { str: 9, agi: 4, vit: 8, int: 5, end: 9, luk: 5, wis: 7, per: 5, cha: 7, wil: 8 },
    starterGear: [
      { name: 'Молот Святости', slot: 'weapon', rarity: 'uncommon', icon: '🔨', dmg: 16 },
      { name: 'Щит Завета', slot: 'banner', rarity: 'uncommon', icon: '🛡️', hp: 35 },
    ],
    branches: [
      { id: 'pal_holy', name: 'Святость', icon: '✨', color: '#facc15', desc: 'Усиление исцеления, маны и ауры света.' },
      { id: 'pal_prot', name: 'Защита', icon: '🛡️', color: '#38bdf8', desc: 'Максимальная броня, блокирование и шипы.' },
      { id: 'pal_ret',  name: 'Возмездие', icon: '⚡', color: '#ef4444', desc: 'Критический урон светлым молотом и святая кара.' },
    ],
    talents: [
      { id: 'p_h1', name: 'Благодать Святости', icon: '✨', branchId: 'pal_holy', row: 0, maxRank: 5, desc: 'Увеличивает регенерацию HP.', per: r => `+${r * 15}% к регенерации` },
      { id: 'p_h2', name: 'Священный Резерв', icon: '🔮', branchId: 'pal_holy', row: 1, maxRank: 5, desc: 'Увеличивает макс. ману.', per: r => `+${r * 10}% к мане` },
      { id: 'p_h3', name: 'Аура Чистоты', icon: '🌟', branchId: 'pal_holy', row: 2, maxRank: 5, desc: 'Увеличивает получаемое золото.', per: r => `+${r * 12}% к золоту` },
      { id: 'p_h4', name: 'Благословение Небес', icon: '🕊️', branchId: 'pal_holy', row: 3, maxRank: 5, desc: 'Увеличивает бонусный опыт.', per: r => `+${r * 10}% к XP` },
      { id: 'p_h5', name: 'Астральный Священник', icon: '👑', branchId: 'pal_holy', row: 4, maxRank: 3, desc: 'Дарует силу всем характеристикам.', per: r => `+${r * 4} всем статам` },
      { id: 'p_p1', name: 'Бастион Веры', icon: '🛡️', branchId: 'pal_prot', row: 0, maxRank: 5, desc: 'Увеличивает броню.', per: r => `+${r * 10}% к броне` },
      { id: 'p_p2', name: 'Живая Сталь', icon: '🏰', branchId: 'pal_prot', row: 1, maxRank: 5, desc: 'Увеличивает максимальное HP.', per: r => `+${r * 8}% к HP` },
      { id: 'p_p3', name: 'Освященные Шипы', icon: '🌵', branchId: 'pal_prot', row: 2, maxRank: 5, desc: 'Возвращает урон врагу.', per: r => `+${r * 5}% отражения` },
      { id: 'p_p4', name: 'Несокрушимость', icon: '🪨', branchId: 'pal_prot', row: 3, maxRank: 5, desc: 'Снижает получаемый урон.', per: r => `-${r * 2}% урона` },
      { id: 'p_p5', name: 'Торжество Защитника', icon: '🦾', branchId: 'pal_prot', row: 4, maxRank: 3, desc: 'Увеличивает выносливость.', per: r => `+${r * 6} Выносливости` },
      { id: 'p_r1', name: 'Карающий Удар', icon: '⚡', branchId: 'pal_ret', row: 0, maxRank: 5, desc: 'Увеличивает базовый урон.', per: r => `+${r * 8}% к урону` },
      { id: 'p_r2', name: 'Святой Крит', icon: '💥', branchId: 'pal_ret', row: 1, maxRank: 5, desc: 'Увеличивает шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'p_r3', name: 'Ярость Инквизиции', icon: '🔥', branchId: 'pal_ret', row: 2, maxRank: 5, desc: 'Увеличивает скорость атаки.', per: r => `+${r * 4}% скорости` },
      { id: 'p_r4', name: 'Печать Искупления', icon: '📜', branchId: 'pal_ret', row: 3, maxRank: 5, desc: 'Увеличивает урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'p_r5', name: 'Воплощение Возмездия', icon: '☀️', branchId: 'pal_ret', row: 4, maxRank: 3, desc: 'Сила и Крит Сила.', per: r => `+${r * 5} Силы & +${r * 10}% крит урон` },
    ],
    skills: [
      { id: 'pal_holy_light', name: 'Святой Свет', icon: '✨', unlockLevel: 1, maxRank: 10, manaCost: 15, cooldown: 6, desc: 'Восстанавливает здоровье и наносит урон мгновенным светом.', color: '#facc15' },
      { id: 'pal_shield_bash', name: 'Удар Щитом', icon: '🛡️', unlockLevel: 3, maxRank: 10, manaCost: 18, cooldown: 7, desc: 'Оглушает врага тяжелым щитом.', color: '#38bdf8' },
      { id: 'pal_judgement', name: 'Праведный Суд', icon: '⚖️', unlockLevel: 6, maxRank: 10, manaCost: 24, cooldown: 9, desc: 'С небес опускается меч карающего света.', color: '#ef4444' },
      { id: 'pal_consecration', name: 'Освящение Земли', icon: '☀️', unlockLevel: 12, maxRank: 10, manaCost: 32, cooldown: 12, desc: 'Земля под врагом закипает от священного огня.', color: '#fb923c' },
      { id: 'pal_divine_shield', name: 'Божественный Щит', icon: '🕊️', unlockLevel: 20, maxRank: 10, manaCost: 40, cooldown: 18, desc: 'Аура абсолютного поглощения урона и исцеление.', color: '#fde68a' },
      { id: 'pal_hammer_wrath', name: 'Молот Гнева', icon: '🔨', unlockLevel: 30, maxRank: 10, manaCost: 35, cooldown: 8, desc: 'Бросок пылающего молота с гарантированным критом.', color: '#eab308' },
      { id: 'pal_avenging_wrath', name: 'Крылья Возмездия', icon: '👑', unlockLevel: 42, maxRank: 10, manaCost: 50, cooldown: 20, desc: 'Прилив святой энергии увеличивает урон вдвое.', color: '#f59e0b' },
      { id: 'pal_lay_on_hands', name: 'Возложение Рук', icon: '💚', unlockLevel: 55, maxRank: 10, manaCost: 60, cooldown: 25, desc: 'Полное восстановление здоровья и очищение от скверны.', color: '#22c55e' },
      { id: 'pal_holy_shock', name: 'Священный Шок', icon: '⚡', unlockLevel: 70, maxRank: 10, manaCost: 45, cooldown: 10, desc: 'Вспышка молнии небесного света разит монстра.', color: '#facc15' },
      { id: 'pal_sun_god_aegis', name: 'Эгида Солярного Завета', icon: '🌟', unlockLevel: 85, maxRank: 10, manaCost: 75, cooldown: 22, desc: 'Первозданный солярный луч испепеляет нечестивых.', color: '#fbbf24' },
    ],
  },

  // 2. NECROMANCER
  {
    id: 'necromancer',
    name: 'Некромант',
    title: 'Тёмный Повелитель Смерти',
    icon: '💀',
    artSrc: '/heroes/hero_necromancer.jpg',
    color: '#a855f7',
    desc: 'Владыка чумы, праха и призыва скелетов. Истощает жизненную силу врагов и обращает её в щиты.',
    lore: 'Обученный в подземных цитаделях Цитадели Костей, Некромант видит в смерти лишь инструмент. Своими заклинаниями он иссушает кровь противников и поднимает павших воинов для вечной службы.',
    baseStats: { str: 3, agi: 4, vit: 6, int: 10, end: 5, luk: 6, wis: 9, per: 7, cha: 4, wil: 9 },
    starterGear: [
      { name: 'Посох Костей', slot: 'weapon', rarity: 'uncommon', icon: '🪄', dmg: 18 },
      { name: 'Амулет Праха', slot: 'amulet', rarity: 'uncommon', icon: '📿', hp: 30 },
    ],
    branches: [
      { id: 'nec_bones', name: 'Кости', icon: '🦴', color: '#e2e8f0', desc: 'Костяная броня, щиты и бронебойный урон.' },
      { id: 'nec_plague', name: 'Чума', icon: '☣️', color: '#84cc16', desc: 'Яды, DoT-эффекты и проклятия разложения.' },
      { id: 'nec_souls', name: 'Души', icon: '🔮', color: '#a855f7', desc: 'Вампиризм, призыв душ и регенерация маны.' },
    ],
    talents: [
      { id: 'n_b1', name: 'Костяная Броня', icon: '🦴', branchId: 'nec_bones', row: 0, maxRank: 5, desc: 'Увеличивает броню.', per: r => `+${r * 12}% к броне` },
      { id: 'n_b2', name: 'Шипы Смерти', icon: '🗡️', branchId: 'nec_bones', row: 1, maxRank: 5, desc: 'Отражает урон врагу.', per: r => `+${r * 6}% отражения` },
      { id: 'n_b3', name: 'Острые Осколки', icon: '💥', branchId: 'nec_bones', row: 2, maxRank: 5, desc: 'Увеличивает шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'n_b4', name: 'Панцирь Праха', icon: '🛡️', branchId: 'nec_bones', row: 3, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 10}% HP` },
      { id: 'n_b5', name: 'Костяной Лорд', icon: '💀', branchId: 'nec_bones', row: 4, maxRank: 3, desc: 'Интеллект и Выносливость.', per: r => `+${r * 5} INT/END` },
      { id: 'n_p1', name: 'Ядовитый Туман', icon: '☣️', branchId: 'nec_plague', row: 0, maxRank: 5, desc: 'Увеличивает урон ядами.', per: r => `+${r * 10}% DoT урона` },
      { id: 'n_p2', name: 'Разложение Клеток', icon: '🧪', branchId: 'nec_plague', row: 1, maxRank: 5, desc: 'Увеличивает базовый урон.', per: r => `+${r * 8}% к урону` },
      { id: 'n_p3', name: 'Гниющий Сглаз', icon: '👁️', branchId: 'nec_plague', row: 2, maxRank: 5, desc: 'Снижает урон врагов.', per: r => `-${r * 3}% урона врагов` },
      { id: 'n_p4', name: 'Эпидемия', icon: '🧫', branchId: 'nec_plague', row: 3, maxRank: 5, desc: 'Увеличивает бонус золота.', per: r => `+${r * 15}% золота` },
      { id: 'n_p5', name: 'Мастер Чумы', icon: '👑', branchId: 'nec_plague', row: 4, maxRank: 3, desc: 'Сила заклинаний.', per: r => `+${r * 8}% силы скиллов` },
      { id: 'n_s1', name: 'Жатва Душ', icon: '🔮', branchId: 'nec_souls', row: 0, maxRank: 5, desc: 'Увеличивает вампиризм.', per: r => `+${r * 2}% вампиризм` },
      { id: 'n_s2', name: 'Астральный Сосуд', icon: '🍷', branchId: 'nec_souls', row: 1, maxRank: 5, desc: 'Регенерация маны.', per: r => `+${r * 15}% реген маны` },
      { id: 'n_s3', name: 'Зов Бездны', icon: '🌌', branchId: 'nec_souls', row: 2, maxRank: 5, desc: 'Увеличивает бонус XP.', per: r => `+${r * 10}% XP` },
      { id: 'n_s4', name: 'Призрачный Щит', icon: '👻', branchId: 'nec_souls', row: 3, maxRank: 5, desc: 'Увеличивает уклонение.', per: r => `+${r * 2}% уклонения` },
      { id: 'n_s5', name: 'Повелитель Теней', icon: '🌑', branchId: 'nec_souls', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'nec_bone_spear', name: 'Костяное Копьё', icon: '🦴', unlockLevel: 1, maxRank: 10, manaCost: 14, cooldown: 5, desc: 'Пробивающее копьё из спрессованных костей.', color: '#e2e8f0' },
      { id: 'nec_poison_nova', name: 'Кольцо Яда', icon: '☣️', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 8, desc: 'Вспышка ядовитого газа отравляет цель.', color: '#84cc16' },
      { id: 'nec_drain_life', name: 'Похищение Жизни', icon: '🩸', unlockLevel: 6, maxRank: 10, manaCost: 25, cooldown: 9, desc: 'Высасывает здоровье врага и лечит героя.', color: '#dc2626' },
      { id: 'nec_summon_army', name: 'Призыв Скелетов', icon: '💀', unlockLevel: 12, maxRank: 10, manaCost: 40, cooldown: 16, desc: 'Орда скелетов терзает противника.', color: '#a855f7' },
      { id: 'nec_corpse_explosion', name: 'Взрыв Праха', icon: '💥', unlockLevel: 20, maxRank: 10, manaCost: 30, cooldown: 10, desc: 'Детонация темной энергии разрывает монстра.', color: '#991b1b' },
      { id: 'nec_curse_agony', name: 'Проклятие Мук', icon: '👁️', unlockLevel: 30, maxRank: 10, manaCost: 28, cooldown: 12, desc: 'Темная скверна медленно разъедает врага.', color: '#7e22ce' },
      { id: 'nec_bone_armor', name: 'Костяной Панцирь', icon: '🛡️', unlockLevel: 42, maxRank: 10, manaCost: 35, cooldown: 18, desc: 'Щит из вращающихся черепов поглощает удары.', color: '#94a3b8' },
      { id: 'nec_blood_nova', name: 'Кровавая Нова', icon: '🍷', unlockLevel: 55, maxRank: 10, manaCost: 45, cooldown: 11, desc: 'Волна алой плазмы выжигает поляну.', color: '#b91c1c' },
      { id: 'nec_soul_reaper', name: 'Жнец Душ', icon: '🔮', unlockLevel: 70, maxRank: 10, manaCost: 55, cooldown: 14, desc: 'Серп смерти срезает часть HP монстра.', color: '#c084fc' },
      { id: 'nec_lich_form', name: 'Облик Архилича', icon: '🌌', unlockLevel: 85, maxRank: 10, manaCost: 80, cooldown: 25, desc: 'Трансформация в бессмертного повелителя смерти.', color: '#6d28d9' },
    ],
  },

  // 3. ARCHMAGE
  {
    id: 'archmage',
    name: 'Архимаг',
    title: 'Астральный Архимаг',
    icon: '🔮',
    artSrc: '/heroes/hero_archmage.jpg',
    color: '#38bdf8',
    desc: 'Мастер стихийного пламени, льда и цепных молний. Обладает высочайшим магическим уроном.',
    lore: 'Окончивший Высшую Академию Даларанских Чародеев, Архимаг повелевает чистыми стихиями. Его заклинания способны заморозить целое войско или обрушить метеоритный дождь на головы чудовищ.',
    baseStats: { str: 2, agi: 5, vit: 4, int: 12, end: 4, luk: 7, wis: 10, per: 8, cha: 6, wil: 8 },
    starterGear: [
      { name: 'Стихийный Жезл', slot: 'weapon', rarity: 'uncommon', icon: '🪄', dmg: 20 },
      { name: 'Мантия Тайн', slot: 'armor', rarity: 'uncommon', icon: '🧥', hp: 25 },
    ],
    branches: [
      { id: 'arch_fire', name: 'Пламя', icon: '🔥', color: '#f97316', desc: 'Взрывной урон, критические ожоги и метеоры.' },
      { id: 'arch_frost', name: 'Лёд', icon: '❄️', color: '#38bdf8', desc: 'Заморозка, ледяные щиты и контроль.' },
      { id: 'arch_storm', name: 'Буря', icon: '⚡', color: '#facc15', desc: 'Скорость заклинаний, молнии и реген маны.' },
    ],
    talents: [
      { id: 'a_fi1', name: 'Вспышка Пламени', icon: '🔥', branchId: 'arch_fire', row: 0, maxRank: 5, desc: 'Увеличивает урона огнем.', per: r => `+${r * 10}% урона` },
      { id: 'a_fi2', name: 'Опаляющие Крить', icon: '💥', branchId: 'arch_fire', row: 1, maxRank: 5, desc: 'Шанс магического крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'a_fi3', name: 'Адский Ожог', icon: '☄️', branchId: 'arch_fire', row: 2, maxRank: 5, desc: 'Увеличивает урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'a_fi4', name: 'Пиромант', icon: '🌋', branchId: 'arch_fire', row: 3, maxRank: 5, desc: 'Сила скиллов.', per: r => `+${r * 8}% силы скиллов` },
      { id: 'a_fi5', name: 'Владыка Огня', icon: '👑', branchId: 'arch_fire', row: 4, maxRank: 3, desc: 'Интеллект и Крит Урон.', per: r => `+${r * 6} INT & +${r * 15}% крит` },
      { id: 'a_fr1', name: 'Ледяной Шип', icon: '❄️', branchId: 'arch_frost', row: 0, maxRank: 5, desc: 'Увеличивает броню.', per: r => `+${r * 10}% брони` },
      { id: 'a_fr2', name: 'Хрустальный Щит', icon: '🛡️', branchId: 'arch_frost', row: 1, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 8}% HP` },
      { id: 'a_fr3', name: 'Абсолютная Стынь', icon: '🧊', branchId: 'arch_frost', row: 2, maxRank: 5, desc: 'Снижает урон врагов.', per: r => `-${r * 3}% урона врагов` },
      { id: 'a_fr4', name: 'Отражение Стужи', icon: '🪞', branchId: 'arch_frost', row: 3, maxRank: 5, desc: 'Отражение урона.', per: r => `+${r * 5}% отражения` },
      { id: 'a_fr5', name: 'Сердце Льда', icon: '💙', branchId: 'arch_frost', row: 4, maxRank: 3, desc: 'Мудрость и Защита.', per: r => `+${r * 6} WIS & +${r * 5}% HP` },
      { id: 'a_st1', name: 'Поток Молний', icon: '⚡', branchId: 'arch_storm', row: 0, maxRank: 5, desc: 'Скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'a_st2', name: 'Медитация Грозы', icon: '🧘', branchId: 'arch_storm', row: 1, maxRank: 5, desc: 'Регенерация маны.', per: r => `+${r * 18}% реген маны` },
      { id: 'a_st3', name: 'Быстрый Каст', icon: '⏱️', branchId: 'arch_storm', row: 2, maxRank: 5, desc: 'Снижает кулдауны.', per: r => `-${r * 4}% кулдауны` },
      { id: 'a_st4', name: 'Энергетический Нюх', icon: '💰', branchId: 'arch_storm', row: 3, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 12}% золота` },
      { id: 'a_st5', name: 'Повелитель Бури', icon: '🌩️', branchId: 'arch_storm', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'arch_fireball', name: 'Огненный Шар', icon: '🔥', unlockLevel: 1, maxRank: 10, manaCost: 16, cooldown: 5, desc: 'Шар пламени взрывается при попадании.', color: '#f97316' },
      { id: 'arch_frost_nova', name: 'Ледяная Нова', icon: '❄️', unlockLevel: 3, maxRank: 10, manaCost: 22, cooldown: 8, desc: 'Волна холода сковывает противника.', color: '#38bdf8' },
      { id: 'arch_chain_lightning', name: 'Цепная Молния', icon: '⚡', unlockLevel: 6, maxRank: 10, manaCost: 28, cooldown: 8, desc: 'Молния бьёт чудовище электричеством.', color: '#facc15' },
      { id: 'arch_arcane_blast', name: 'Чародейский Взрыв', icon: '🔮', unlockLevel: 12, maxRank: 10, manaCost: 32, cooldown: 10, desc: 'Взрыв чистой магии разбрасывает осколки.', color: '#c084fc' },
      { id: 'arch_blizzard', name: 'Снежная Буря', icon: '🧊', unlockLevel: 20, maxRank: 10, manaCost: 42, cooldown: 14, desc: 'Шквал ледяных градин замораживает поляну.', color: '#0284c7' },
      { id: 'arch_scorch', name: 'Испепеление', icon: '💥', unlockLevel: 30, maxRank: 10, manaCost: 28, cooldown: 7, desc: 'Поток огня поджигает плоть цели.', color: '#ef4444' },
      { id: 'arch_time_warp', name: 'Искажение Времени', icon: '⏳', unlockLevel: 42, maxRank: 10, manaCost: 55, cooldown: 20, desc: 'Останавливает время и сбрасывает кулдауны.', color: '#a855f7' },
      { id: 'arch_meteor', name: 'Падение Метеора', icon: '☄️', unlockLevel: 55, maxRank: 10, manaCost: 65, cooldown: 16, desc: 'Гигантский пылающий метеор падает с небес.', color: '#fb923c' },
      { id: 'arch_supernova', name: 'Астральная Сверхновая', icon: '✨', unlockLevel: 70, maxRank: 10, manaCost: 75, cooldown: 18, desc: 'Ослепительный взрыв первозданной магии.', color: '#e879f9' },
      { id: 'arch_singularity', name: 'Черная Дыра Магии', icon: '🕳️', unlockLevel: 85, maxRank: 10, manaCost: 90, cooldown: 24, desc: 'Гравитационная аномалия затягивает и разрывает врага.', color: '#4c1d95' },
    ],
  },

  // 4. ASSASSIN
  {
    id: 'assassin',
    name: 'Ассасин',
    title: 'Теневой Убийца',
    icon: '🗡️',
    artSrc: '/heroes/hero_assassin.jpg',
    color: '#84cc16',
    desc: 'Мастер молниеносных отравленных клинков и мгновенных критических ударов из тени.',
    lore: 'Выходец из Гильдии Ночных Клинков, Ассасин не знает пощады. Он атакует быстрее, чем успевает упасть тень, оставляя после себя лишь смертоносный яд.',
    baseStats: { str: 4, agi: 12, vit: 5, int: 4, end: 5, luk: 9, wis: 4, per: 9, cha: 5, wil: 6 },
    starterGear: [
      { name: 'Парные Кинжалы', slot: 'weapon', rarity: 'uncommon', icon: '🗡️', dmg: 22 },
      { name: 'Плащ Ночи', slot: 'shoulders', rarity: 'uncommon', icon: '🧥', hp: 20 },
    ],
    branches: [
      { id: 'sin_shadows', name: 'Тени', icon: '👤', color: '#475569', desc: 'Уклонение, скрытность и критический урон из тени.' },
      { id: 'sin_poisons', name: 'Яды', icon: '🧪', color: '#84cc16', desc: 'Смертоносные токсины, DoT-эффекты и разложение.' },
      { id: 'sin_blades',  name: 'Клинки', icon: '⚔️', color: '#ef4444', desc: 'Молниеносная скорость атак и сечение артерий.' },
    ],
    talents: [
      { id: 's_s1', name: 'Теневой Шаг', icon: '👤', branchId: 'sin_shadows', row: 0, maxRank: 5, desc: 'Увеличивает уклонение.', per: r => `+${r * 2}% уклонения` },
      { id: 's_s2', name: 'Точка Разрыва', icon: '💥', branchId: 'sin_shadows', row: 1, maxRank: 5, desc: 'Увеличивает шанс крита.', per: r => `+${r * 3}% крита` },
      { id: 's_s3', name: 'Ночной Охотник', icon: '🌑', branchId: 'sin_shadows', row: 2, maxRank: 5, desc: 'Увеличивает урон из тени.', per: r => `+${r * 12}% урона` },
      { id: 's_s4', name: 'Обостренные Чувства', icon: '👁️', branchId: 'sin_shadows', row: 3, maxRank: 5, desc: 'Увеличивает Восприятие.', per: r => `+${r * 4} PER` },
      { id: 's_s5', name: 'Владыка Теней', icon: '👑', branchId: 'sin_shadows', row: 4, maxRank: 3, desc: 'Ловкость и Крит Урон.', per: r => `+${r * 6} AGI & +${r * 15}% крит` },
      { id: 's_p1', name: 'Змеиный Яд', icon: '🐍', branchId: 'sin_poisons', row: 0, maxRank: 5, desc: 'Увеличивает урон ядами.', per: r => `+${r * 10}% DoT урона` },
      { id: 's_p2', name: 'Токсичный Укол', icon: '🧪', branchId: 'sin_poisons', row: 1, maxRank: 5, desc: 'Снижает урон врагов.', per: r => `-${r * 3}% урона врагов` },
      { id: 's_p3', name: 'Парализующая Слизь', icon: '🦠', branchId: 'sin_poisons', row: 2, maxRank: 5, desc: 'Снижает скорость врагов.', per: r => `-${r * 4}% скорости врагов` },
      { id: 's_p4', name: 'Ядовитый Аптекарь', icon: '💰', branchId: 'sin_poisons', row: 3, maxRank: 5, desc: 'Увеличивает бонус золота.', per: r => `+${r * 15}% золота` },
      { id: 's_p5', name: 'Мастер Токсинов', icon: '☠️', branchId: 'sin_poisons', row: 4, maxRank: 3, desc: 'Сила скиллов.', per: r => `+${r * 8}% силы скиллов` },
      { id: 's_b1', name: 'Шквал Ударов', icon: '⚔️', branchId: 'sin_blades', row: 0, maxRank: 5, desc: 'Увеличивает скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 's_b2', name: 'Рассеченная Вена', icon: '🩸', branchId: 'sin_blades', row: 1, maxRank: 5, desc: 'Увеличивает вампиризм.', per: r => `+${r * 2}% вампиризм` },
      { id: 's_b3', name: 'Кровавый Залп', icon: '🎯', branchId: 'sin_blades', row: 2, maxRank: 5, desc: 'Увеличивает урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 's_b4', name: 'Легкие Кинжалы', icon: '💨', branchId: 'sin_blades', row: 3, maxRank: 5, desc: 'Снижает кулдауны.', per: r => `-${r * 3}% кулдауны` },
      { id: 's_b5', name: 'Мастер Смерти', icon: '💀', branchId: 'sin_blades', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'sin_poison_dagger', name: 'Ядовитый Кинжал', icon: '☠️', unlockLevel: 1, maxRank: 10, manaCost: 14, cooldown: 5, desc: 'Быстрый укол смазанным ядом клинком.', color: '#84cc16' },
      { id: 'sin_backstab', name: 'Удар в Спину', icon: '🗡️', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 7, desc: 'Критический выпад из слепой зоны.', color: '#334155' },
      { id: 'sin_shadow_step', name: 'Шаг сквозь Тень', icon: '👤', unlockLevel: 6, maxRank: 10, manaCost: 24, cooldown: 9, desc: 'Мгновенное телепортирование с заточкой.', color: '#475569' },
      { id: 'sin_fan_of_knives', name: 'Веер Клинков', icon: '⚔️', unlockLevel: 12, maxRank: 10, manaCost: 30, cooldown: 10, desc: 'Шквал метательных ножей разит цель.', color: '#94a3b8' },
      { id: 'sin_smoke_bomb', name: 'Дымовая Завеса', icon: '💨', unlockLevel: 20, maxRank: 10, manaCost: 28, cooldown: 15, desc: 'Уклонение от всех ударов и скрытность.', color: '#64748b' },
      { id: 'sin_venom_burst', name: 'Взрыв Яда', icon: '🧪', unlockLevel: 30, maxRank: 10, manaCost: 38, cooldown: 11, desc: 'Мгновенно активирует весь накопленный яд.', color: '#65a30d' },
      { id: 'sin_shadow_dance', name: 'Танец Теней', icon: '💃', unlockLevel: 42, maxRank: 10, manaCost: 45, cooldown: 14, desc: 'Серия из непрерывных крит-выпадов.', color: '#1e293b' },
      { id: 'sin_assassinate', name: 'Убийство из Тьмы', icon: '🎯', unlockLevel: 55, maxRank: 10, manaCost: 55, cooldown: 18, desc: 'Смертоносная точка разрыва аорты.', color: '#0f172a' },
      { id: 'sin_lotus_strike', name: 'Кровавый Лотос', icon: '🌺', unlockLevel: 70, maxRank: 10, manaCost: 65, cooldown: 16, desc: 'Клинки вырисовывают смертельный узор.', color: '#be123c' },
      { id: 'sin_void_blade', name: 'Лезвие Бездны', icon: '🌌', unlockLevel: 85, maxRank: 10, manaCost: 80, cooldown: 22, desc: 'Теневое лезвие стирает душу цели.', color: '#581c87' },
    ],
  },

  // 5. BERSERKER
  {
    id: 'berserker',
    name: 'Берсерк',
    title: 'Яростный Кровавый Воин',
    icon: '🪓',
    artSrc: '/heroes/hero_berserker.jpg',
    color: '#ef4444',
    desc: 'Дикий северный воин, черпающий силу в ярости и полученном уроне. Владеет тяжелыми топорами.',
    lore: 'Выросший среди заснеженных тундр и диких племен Кровавого Клыка, Берсерк превращает боль в сокрушительный урон. Чем ближе он к смерти, тем быстрее и страшнее становятся его удары.',
    baseStats: { str: 12, agi: 6, vit: 9, int: 2, end: 9, luk: 5, wis: 3, per: 5, cha: 4, wil: 8 },
    starterGear: [
      { name: 'Секира Ярости', slot: 'weapon', rarity: 'uncommon', icon: '🪓', dmg: 25 },
      { name: 'Пояс Клыка', slot: 'belt', rarity: 'uncommon', icon: '🥋', hp: 30 },
    ],
    branches: [
      { id: 'zerk_rage', name: 'Ярость', icon: '😡', color: '#ef4444', desc: 'Прилив неистовства, крит-урон и скорость атак.' },
      { id: 'zerk_blood', name: 'Кровь', icon: '🩸', color: '#dc2626', desc: 'Вампиризм, исцеление от урона и выносливость.' },
      { id: 'zerk_might', name: 'Мощь', icon: '🔨', color: '#b45309', desc: 'Сокрушение брони врагов и максимальная Сила.' },
    ],
    talents: [
      { id: 'z_r1', name: 'Неистовый Гнев', icon: '😡', branchId: 'zerk_rage', row: 0, maxRank: 5, desc: 'Увеличивает урон.', per: r => `+${r * 10}% урона` },
      { id: 'z_r2', name: 'Кровавый Крит', icon: '💥', branchId: 'zerk_rage', row: 1, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 3}% крита` },
      { id: 'z_r3', name: 'Ураган Секиры', icon: '🌪️', branchId: 'zerk_rage', row: 2, maxRank: 5, desc: 'Скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'z_r4', name: 'Казнь Слабых', icon: '🪓', branchId: 'zerk_rage', row: 3, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'z_r5', name: 'Бог Войны', icon: '👑', branchId: 'zerk_rage', row: 4, maxRank: 3, desc: 'Сила и Крит Сила.', per: r => `+${r * 6} STR & +${r * 15}% крит` },
      { id: 'z_b1', name: 'Жажда Вены', icon: '🩸', branchId: 'zerk_blood', row: 0, maxRank: 5, desc: 'Вампиризм.', per: r => `+${r * 2.5}% вампиризм` },
      { id: 'z_b2', name: 'Кровавый Панцирь', icon: '🛡️', branchId: 'zerk_blood', row: 1, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 10}% HP` },
      { id: 'z_b3', name: 'Регенерация Битвы', icon: '💚', branchId: 'zerk_blood', row: 2, maxRank: 5, desc: 'Регенерация HP.', per: r => `+${r * 15}% реген HP` },
      { id: 'z_b4', name: 'Неприкаянный Дух', icon: '🪨', branchId: 'zerk_blood', row: 3, maxRank: 5, desc: 'Снижает урон.', per: r => `-${r * 2}% урона` },
      { id: 'z_b5', name: 'Бессмертный Визг', icon: '💀', branchId: 'zerk_blood', row: 4, maxRank: 3, desc: 'Выносливость и Здоровье.', per: r => `+${r * 6} END & +${r * 5}% HP` },
      { id: 'z_m1', name: 'Разрушение Доспеха', icon: '🔨', branchId: 'zerk_might', row: 0, maxRank: 5, desc: 'Пробивание брони.', per: r => `+${r * 8}% пробития` },
      { id: 'z_m2', name: 'Тяжелый Топор', icon: '⚖️', branchId: 'zerk_might', row: 1, maxRank: 5, desc: 'Базовый урон.', per: r => `+${r * 8}% к урону` },
      { id: 'z_m3', name: 'Сейсмический Удар', icon: '🌋', branchId: 'zerk_might', row: 2, maxRank: 5, desc: 'Отражение урона.', per: r => `+${r * 5}% отражения` },
      { id: 'z_m4', name: 'Добыча Похода', icon: '💰', branchId: 'zerk_might', row: 3, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 12}% золота` },
      { id: 'z_m5', name: 'Гигант Севера', icon: '🗿', branchId: 'zerk_might', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'zerk_power_cleave', name: 'Рассекающий Удар', icon: '⚔️', unlockLevel: 1, maxRank: 10, manaCost: 12, cooldown: 5, desc: 'Мощный маховый удар двуручным топором.', color: '#f59e0b' },
      { id: 'zerk_whirlwind', name: 'Вихрь Смерти', icon: '🌪️', unlockLevel: 3, maxRank: 10, manaCost: 22, cooldown: 8, desc: 'Неистовое вращение разрубает броню.', color: '#e2e8f0' },
      { id: 'zerk_battle_shout', name: 'Боевой Клич', icon: '📢', unlockLevel: 6, maxRank: 10, manaCost: 20, cooldown: 12, desc: 'Яростный рык увеличивает силу атаки.', color: '#ef4444' },
      { id: 'zerk_execute', name: 'Казнь', icon: '🪓', unlockLevel: 12, maxRank: 10, manaCost: 30, cooldown: 10, desc: 'Сокрушительный добивающий удар.', color: '#b91c1c' },
      { id: 'zerk_bloodthirst', name: 'Жажда Крови', icon: '🩸', unlockLevel: 20, maxRank: 10, manaCost: 25, cooldown: 9, desc: 'Атака исцеляет Берсерка от нанесенного урона.', color: '#dc2626' },
      { id: 'zerk_leap_attack', name: 'Прыжок Скалы', icon: '💥', unlockLevel: 30, maxRank: 10, manaCost: 35, cooldown: 11, desc: 'Прыжок сверху расплющивает монстра.', color: '#d97706' },
      { id: 'zerk_frenzy', name: 'Иступление Ярости', icon: '😡', unlockLevel: 42, maxRank: 10, manaCost: 40, cooldown: 16, desc: 'Бешеный темп атак с утроенной скоростью.', color: '#ea580c' },
      { id: 'zerk_earthquake', name: 'Землетрясение', icon: '🌋', unlockLevel: 55, maxRank: 10, manaCost: 50, cooldown: 15, desc: 'Раскол земли ударом гигантского молота.', color: '#78350f' },
      { id: 'zerk_avatar_of_war', name: 'Воплощение Войны', icon: '🦾', unlockLevel: 70, maxRank: 10, manaCost: 65, cooldown: 22, desc: 'Превращение в титана войны с огромной силой.', color: '#991b1b' },
      { id: 'zerk_ragnarok', name: 'Рагнарок', icon: '☄️', unlockLevel: 85, maxRank: 10, manaCost: 80, cooldown: 25, desc: 'Конечный апокалиптический взрыв ярости.', color: '#450a0a' },
    ],
  },

  // 6. RANGER
  {
    id: 'ranger',
    name: 'Рейнджер',
    title: 'Меткий Охотник Заповедника',
    icon: '🏹',
    artSrc: '/heroes/hero_ranger.jpg',
    color: '#10b981',
    desc: 'Мастер дальнего боя, ловушек и призыва зверей. Стреляет из тяжелого лука с огромного расстояния.',
    lore: 'Следопыт из древних изумрудных чащоб, Рейнджер знает каждую тропу. Его лук изготовлен из железодрева, а стрелы напитаны ядом реликтовых гадюк.',
    baseStats: { str: 4, agi: 11, vit: 6, int: 4, end: 6, luk: 8, wis: 6, per: 10, cha: 5, wil: 5 },
    starterGear: [
      { name: 'Лук Железного Древа', slot: 'weapon', rarity: 'uncommon', icon: '🏹', dmg: 21 },
      { name: 'Колчан Ветра', slot: 'banner', rarity: 'uncommon', icon: '🎯', dmg: 10 },
    ],
    branches: [
      { id: 'rng_archery', name: 'Стрельба', icon: '🏹', color: '#10b981', desc: 'Урон лука, прицельные выстрелы и криты.' },
      { id: 'rng_beasts',  name: 'Звери', icon: '🐺', color: '#f59e0b', desc: 'Призыв боевых животных и аура охоты.' },
      { id: 'rng_traps',   name: 'Ловушки', icon: '⚙️', color: '#06b6d4', desc: 'Капканы, замедление и разрывные снаряды.' },
    ],
    talents: [
      { id: 'r_a1', name: 'Соколиный Глаз', icon: '👁️', branchId: 'rng_archery', row: 0, maxRank: 5, desc: 'Увеличивает урон.', per: r => `+${r * 10}% урона` },
      { id: 'r_a2', name: 'Смертоносный Спуск', icon: '🎯', branchId: 'rng_archery', row: 1, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 3}% крита` },
      { id: 'r_a3', name: 'Шквал Стрел', icon: '🏹', branchId: 'rng_archery', row: 2, maxRank: 5, desc: 'Скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'r_a4', name: 'Снайперское Чутье', icon: '💫', branchId: 'rng_archery', row: 3, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'r_a5', name: 'Легенда Леса', icon: '👑', branchId: 'rng_archery', row: 4, maxRank: 3, desc: 'Ловкость и Восприятие.', per: r => `+${r * 5} AGI/PER` },
      { id: 'r_b1', name: 'Зов Лесного Волка', icon: '🐺', branchId: 'rng_beasts', row: 0, maxRank: 5, desc: 'Увеличивает урон питомцев.', per: r => `+${r * 12}% урона зверей` },
      { id: 'r_b2', name: 'Аура Верности', icon: '💚', branchId: 'rng_beasts', row: 1, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 8}% HP` },
      { id: 'r_b3', name: 'Инстинкт Храбрости', icon: '🐾', branchId: 'rng_beasts', row: 2, maxRank: 5, desc: 'Увеличивает уклонение.', per: r => `+${r * 2}% уклонения` },
      { id: 'r_b4', name: 'Трофеи Охоты', icon: '💰', branchId: 'rng_beasts', row: 3, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 15}% золота` },
      { id: 'r_b5', name: 'Повелитель Зверей', icon: '🦅', branchId: 'rng_beasts', row: 4, maxRank: 3, desc: 'Бонус опыта.', per: r => `+${r * 12}% XP` },
      { id: 'r_t1', name: 'Капкан Охотника', icon: '⚙️', branchId: 'rng_traps', row: 0, maxRank: 5, desc: 'Снижает скорость врагов.', per: r => `-${r * 4}% скорости врагов` },
      { id: 'r_t2', name: 'Разрывной Порох', icon: '💣', branchId: 'rng_traps', row: 1, maxRank: 5, desc: 'Пробивание брони.', per: r => `+${r * 8}% пробития` },
      { id: 'r_t3', name: 'Защитные Мины', icon: '🛡️', branchId: 'rng_traps', row: 2, maxRank: 5, desc: 'Увеличивает броню.', per: r => `+${r * 10}% брони` },
      { id: 'r_t4', name: 'Быстрые Заряды', icon: '⏱️', branchId: 'rng_traps', row: 3, maxRank: 5, desc: 'Снижает кулдауны.', per: r => `-${r * 3}% кулдауны` },
      { id: 'r_t5', name: 'Мастер Засад', icon: '🌲', branchId: 'rng_traps', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'rng_precise_shot', name: 'Точный Выстрел', icon: '🏹', unlockLevel: 1, maxRank: 10, manaCost: 12, cooldown: 5, desc: 'Меткая стрела пробивает слабые места.', color: '#10b981' },
      { id: 'rng_multi_shot', name: 'Залп Стрел', icon: '🎯', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 7, desc: 'Выстрел веером из трех стрел.', color: '#34d399' },
      { id: 'rng_poison_arrow', name: 'Отравленная Стрела', icon: '🧪', unlockLevel: 6, maxRank: 10, manaCost: 22, cooldown: 9, desc: 'Наконечник с ядом дракона поджигает рану.', color: '#84cc16' },
      { id: 'rng_rain_arrows', name: 'Град Стрел', icon: '🌧️', unlockLevel: 12, maxRank: 10, manaCost: 32, cooldown: 11, desc: 'Смертоносный ливень стрел с небес.', color: '#059669' },
      { id: 'rng_falcon_call', name: 'Призыв Сокола', icon: '🦅', unlockLevel: 20, maxRank: 10, manaCost: 30, cooldown: 12, desc: 'Сокол выклевывает глаза врагу.', color: '#f59e0b' },
      { id: 'rng_explosive_shot', name: 'Разрывной Заряд', icon: '💣', unlockLevel: 30, maxRank: 10, manaCost: 38, cooldown: 10, desc: 'Стрела с пороховым зарядом детонирует.', color: '#ef4444' },
      { id: 'rng_snipers_mark', name: 'Метка Снайпера', icon: '👁️', unlockLevel: 42, maxRank: 10, manaCost: 42, cooldown: 15, desc: 'Увеличивает урон по цели.', color: '#eab308' },
      { id: 'rng_trueshot_aura', name: 'Аура Меткости', icon: '✨', unlockLevel: 55, maxRank: 10, manaCost: 50, cooldown: 18, desc: 'Шквал критов и максимальная точность.', color: '#a3e635' },
      { id: 'rng_starfire_shot', name: 'Звёздная Стрела', icon: '🌟', unlockLevel: 70, maxRank: 10, manaCost: 65, cooldown: 16, desc: 'Стрела из чистого звёздного света.', color: '#38bdf8' },
      { id: 'rng_wild_hunt', name: 'Дикая Охота', icon: '🐺', unlockLevel: 85, maxRank: 10, manaCost: 80, cooldown: 22, desc: 'Духи древнего леса растерзывают монстра.', color: '#15803d' },
    ],
  },

  // 7. DRUID
  {
    id: 'druid',
    name: 'Друид',
    title: 'Хранитель Живой Природы',
    icon: '🌿',
    artSrc: '/heroes/hero_druid.jpg',
    color: '#22c55e',
    desc: 'Оборотень и повелитель стихийной природы. Способен принимать облик медведя или кошки.',
    lore: 'Жрец Иггдрасиля, Друид слышит шепот древних деревьев. В бою он превращается в свирепых зверей или призывает лунный свет для исцеления союзников.',
    baseStats: { str: 6, agi: 6, vit: 8, int: 8, end: 7, luk: 5, wis: 9, per: 6, cha: 5, wil: 9 },
    starterGear: [
      { name: 'Посох Жизни', slot: 'weapon', rarity: 'uncommon', icon: '🪵', dmg: 17 },
      { name: 'Амулет Листвы', slot: 'amulet', rarity: 'uncommon', icon: '🍃', hp: 32 },
    ],
    branches: [
      { id: 'dru_balance', name: 'Баланс', icon: '🌙', color: '#38bdf8', desc: 'Магия луны и солнца, звездопады и гнев.' },
      { id: 'dru_feral',   name: 'Зверь', icon: '🐻', color: '#f59e0b', desc: 'Трансформации в медведя и кошку, ближний бой.' },
      { id: 'dru_resto',   name: 'Исцеление', icon: '🌱', color: '#22c55e', desc: 'Мощная регенерация HP и щиты природы.' },
    ],
    talents: [
      { id: 'd_b1', name: 'Сила Луны', icon: '🌙', branchId: 'dru_balance', row: 0, maxRank: 5, desc: 'Увеличивает магический урон.', per: r => `+${r * 10}% магии` },
      { id: 'd_b2', name: 'Солярный Резонанс', icon: '☀️', branchId: 'dru_balance', row: 1, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'd_b3', name: 'Звёздная Аура', icon: '⭐', branchId: 'dru_balance', row: 2, maxRank: 5, desc: 'Регенерация маны.', per: r => `+${r * 15}% реген маны` },
      { id: 'd_b4', name: 'Грозовой Шквал', icon: '🌩️', branchId: 'dru_balance', row: 3, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'd_b5', name: 'Мудрец Стихий', icon: '👑', branchId: 'dru_balance', row: 4, maxRank: 3, desc: 'Мудрость и Интеллект.', per: r => `+${r * 5} WIS/INT` },
      { id: 'd_f1', name: 'Свирепость Зверя', icon: '🐻', branchId: 'dru_feral', row: 0, maxRank: 5, desc: 'Увеличивает физический урон.', per: r => `+${r * 10}% физ урона` },
      { id: 'd_f2', name: 'Панцирь Медведя', icon: '🛡️', branchId: 'dru_feral', row: 1, maxRank: 5, desc: 'Увеличивает броню.', per: r => `+${r * 12}% брони` },
      { id: 'd_f3', name: 'Кровожадность Пантеры', icon: '🐆', branchId: 'dru_feral', row: 2, maxRank: 5, desc: 'Увеличивает вампиризм.', per: r => `+${r * 2}% вампиризм` },
      { id: 'd_f4', name: 'Дикая Грация', icon: '💨', branchId: 'dru_feral', row: 3, maxRank: 5, desc: 'Увеличивает уклонение.', per: r => `+${r * 2}% уклонения` },
      { id: 'd_f5', name: 'Повелитель Форм', icon: '🐾', branchId: 'dru_feral', row: 4, maxRank: 3, desc: 'Сила и Выносливость.', per: r => `+${r * 6} STR/END` },
      { id: 'd_r1', name: 'Древесный Сок', icon: '🌱', branchId: 'dru_resto', row: 0, maxRank: 5, desc: 'Регенерация HP.', per: r => `+${r * 18}% реген HP` },
      { id: 'd_r2', name: 'Живая Древесина', icon: '🪵', branchId: 'dru_resto', row: 1, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 10}% HP` },
      { id: 'd_r3', name: 'Благословение Леса', icon: '🍃', branchId: 'dru_resto', row: 2, maxRank: 5, desc: 'Снижает урон.', per: r => `-${r * 2}% урона` },
      { id: 'd_r4', name: 'Дары Иггдрасиля', icon: '💰', branchId: 'dru_resto', row: 3, maxRank: 5, desc: 'Бонус золота и XP.', per: r => `+${r * 10}% золота/XP` },
      { id: 'd_r5', name: 'Аватар Природы', icon: '🌺', branchId: 'dru_resto', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'druid_wrath', name: 'Гнев Леса', icon: '🌿', unlockLevel: 1, maxRank: 10, manaCost: 14, cooldown: 5, desc: 'Стихийный сгусток энергии природы.', color: '#22c55e' },
      { id: 'druid_moonfire', name: 'Лунная Вспышка', icon: '🌙', unlockLevel: 3, maxRank: 10, manaCost: 18, cooldown: 6, desc: 'Луч лунного света сокрушает тьму.', color: '#38bdf8' },
      { id: 'druid_rejuvenation', name: 'Омоложение', icon: '🌱', unlockLevel: 6, maxRank: 10, manaCost: 24, cooldown: 10, desc: 'Постепенное восстановление здоровья.', color: '#4ade80' },
      { id: 'druid_roots', name: 'Опутывающие Корни', icon: '🪵', unlockLevel: 12, maxRank: 10, manaCost: 28, cooldown: 9, desc: 'Корни деревьев сковывают монстра.', color: '#15803d' },
      { id: 'druid_bear_form', name: 'Облик Медведя', icon: '🐻', unlockLevel: 20, maxRank: 10, manaCost: 35, cooldown: 15, desc: 'Дарует огромную броню и HP.', color: '#92400e' },
      { id: 'druid_starfall', name: 'Звездопад', icon: '⭐', unlockLevel: 30, maxRank: 10, manaCost: 42, cooldown: 14, desc: 'Метеоритный дождь звёздной магии.', color: '#c084fc' },
      { id: 'druid_panther_form', name: 'Облик Пантеры', icon: '🐆', unlockLevel: 42, maxRank: 10, manaCost: 40, cooldown: 12, desc: 'Бешеная скорость атак и кровотечение.', color: '#f59e0b' },
      { id: 'druid_hurricane', name: 'Ураган Природы', icon: '🌪️', unlockLevel: 55, maxRank: 10, manaCost: 55, cooldown: 16, desc: 'Смерч вырывает деревья и разит врага.', color: '#0284c7' },
      { id: 'druid_tree_life', name: 'Древо Жизни', icon: '🌳', unlockLevel: 70, maxRank: 10, manaCost: 70, cooldown: 20, desc: 'Полная регенерация и защита природы.', color: '#166534' },
      { id: 'druid_yggdrasil', name: 'Гнев Иггдрасиля', icon: '🌺', unlockLevel: 85, maxRank: 10, manaCost: 85, cooldown: 24, desc: 'Первозданная сила Великого Древа.', color: '#e879f9' },
    ],
  },

  // 8. ENGINEER
  {
    id: 'engineer',
    name: 'Инженер',
    title: 'Техномаг Высшей Механики',
    icon: '⚙️',
    artSrc: '/heroes/hero_engineer.jpg',
    color: '#06b6d4',
    desc: 'Изобретатель механизмов, пулеметных турелей, огнеметов и робототехники.',
    lore: 'Гений из Подземного Города Машин, Инженер полагается на шестеренки и плазму. Его турели ведут непрерывный огонь, а микро-ядерные заряды стирают орды нечисти.',
    baseStats: { str: 5, agi: 7, vit: 6, int: 9, end: 7, luk: 7, wis: 5, per: 10, cha: 4, wil: 6 },
    starterGear: [
      { name: 'Титановый Ключ', slot: 'weapon', rarity: 'uncommon', icon: '🔧', dmg: 19 },
      { name: 'Очки Изобретателя', slot: 'helm', rarity: 'uncommon', icon: '🥽', hp: 28 },
    ],
    branches: [
      { id: 'eng_gadgets', name: 'Гаджеты', icon: '⚙️', color: '#06b6d4', desc: 'Турели, роботы и автоматические заводы.' },
      { id: 'eng_explosives', name: 'Взрывчатка', icon: '💣', color: '#f59e0b', desc: 'Бомбы, плазма и ядерные заряды.' },
      { id: 'eng_armor', name: 'Экзоскелет', icon: '🛡️', color: '#64748b', desc: 'Броня, генераторы щита и стойкость.' },
    ],
    talents: [
      { id: 'e_g1', name: 'Калибровка Пушек', icon: '⚙️', branchId: 'eng_gadgets', row: 0, maxRank: 5, desc: 'Увеличивает урон турелей.', per: r => `+${r * 12}% урона турелей` },
      { id: 'e_g2', name: 'Быстрая Перезарядка', icon: '⏱️', branchId: 'eng_gadgets', row: 1, maxRank: 5, desc: 'Снижает кулдауны.', per: r => `-${r * 4}% кулдауны` },
      { id: 'e_g3', name: 'Оптический Прицел', icon: '🎯', branchId: 'eng_gadgets', row: 2, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'e_g4', name: 'Чертежи Мастера', icon: '📜', branchId: 'eng_gadgets', row: 3, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 15}% золота` },
      { id: 'e_g5', name: 'Главный Архитектор', icon: '👑', branchId: 'eng_gadgets', row: 4, maxRank: 3, desc: 'Восприятие и Интеллект.', per: r => `+${r * 5} PER/INT` },
      { id: 'e_e1', name: 'Усиленный Порох', icon: '💣', branchId: 'eng_explosives', row: 0, maxRank: 5, desc: 'Увеличивает урон взрывов.', per: r => `+${r * 10}% урона` },
      { id: 'e_e2', name: 'Бронебойные Осколки', icon: '💥', branchId: 'eng_explosives', row: 1, maxRank: 5, desc: 'Пробивание брони.', per: r => `+${r * 8}% пробития` },
      { id: 'e_e3', name: 'Плазменный Ожог', icon: '🔥', branchId: 'eng_explosives', row: 2, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'e_e4', name: 'Радиационный Сглаз', icon: '☢️', branchId: 'eng_explosives', row: 3, maxRank: 5, desc: 'Снижает урон врагов.', per: r => `-${r * 3}% урона врагов` },
      { id: 'e_e5', name: 'Подрывник Бездны', icon: '⚛️', branchId: 'eng_explosives', row: 4, maxRank: 3, desc: 'Сила скиллов.', per: r => `+${r * 8}% силы скиллов` },
      { id: 'e_a1', name: 'Титановые Бронелисты', icon: '🛡️', branchId: 'eng_armor', row: 0, maxRank: 5, desc: 'Увеличивает броню.', per: r => `+${r * 12}% брони` },
      { id: 'e_a2', name: 'Электро-Магнитный Щит', icon: '⚡', branchId: 'eng_armor', row: 1, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 8}% HP` },
      { id: 'e_a3', name: 'Шипованные Гусеницы', icon: '🦾', branchId: 'eng_armor', row: 2, maxRank: 5, desc: 'Отражение урона.', per: r => `+${r * 5}% отражения` },
      { id: 'e_a4', name: 'Энерго-Сбережение', icon: '🔋', branchId: 'eng_armor', row: 3, maxRank: 5, desc: 'Регенерация маны.', per: r => `+${r * 15}% реген маны` },
      { id: 'e_a5', name: 'Стальной Титан', icon: '🤖', branchId: 'eng_armor', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'eng_wrench_strike', name: 'Удар Ключом', icon: '🔧', unlockLevel: 1, maxRank: 10, manaCost: 12, cooldown: 5, desc: 'Тяжелый удар титановым гаечным ключом.', color: '#94a3b8' },
      { id: 'eng_flamethrower', name: 'Огнемет', icon: '🔥', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 7, desc: 'Поток струйного пламени выжигает бронелисты.', color: '#f97316' },
      { id: 'eng_turret_deploy', name: 'Установка Турели', icon: '⚙️', unlockLevel: 6, maxRank: 10, manaCost: 28, cooldown: 10, desc: 'Автоматическая пулеметная турель.', color: '#06b6d4' },
      { id: 'eng_grenade_toss', name: 'Осколочная Граната', icon: '💣', unlockLevel: 12, maxRank: 10, manaCost: 30, cooldown: 9, desc: 'Взрыв со стальными осколками.', color: '#f59e0b' },
      { id: 'eng_plasma_cannon', name: 'Плазменная Пушка', icon: '⚡', unlockLevel: 20, maxRank: 10, manaCost: 38, cooldown: 12, desc: 'Заряженный сгусток плазмы.', color: '#38bdf8' },
      { id: 'eng_shield_gen', name: 'Генератор Щита', icon: '🛡️', unlockLevel: 30, maxRank: 10, manaCost: 35, cooldown: 16, desc: 'Электромагнитное поле поглощает урон.', color: '#a855f7' },
      { id: 'eng_mech_suit', name: 'Вызов Механика', icon: '🤖', unlockLevel: 42, maxRank: 10, manaCost: 55, cooldown: 20, desc: 'Пилотирование бронированного механоида.', color: '#64748b' },
      { id: 'eng_orbital_laser', name: 'Орбитальный Лазер', icon: '🛰️', unlockLevel: 55, maxRank: 10, manaCost: 65, cooldown: 18, desc: 'Луч из космоса выжигает позицию.', color: '#ef4444' },
      { id: 'eng_overclock', name: 'Перегрузка Ядра', icon: '⚛️', unlockLevel: 70, maxRank: 10, manaCost: 70, cooldown: 15, desc: 'Удваивает урон всех систем и турелей.', color: '#facc15' },
      { id: 'eng_nuke_strike', name: 'Ядерный Заряд', icon: '☢️', unlockLevel: 85, maxRank: 10, manaCost: 90, cooldown: 25, desc: 'Взрыв микро-ядерного заряда.', color: '#dc2626' },
    ],
  },

  // 9. MONK
  {
    id: 'monk',
    name: 'Монах',
    title: 'Монах Нефритового Святилища',
    icon: '🥋',
    artSrc: '/heroes/hero_monk.jpg',
    color: '#ec4899',
    desc: 'Мастер рукопашного боя, медитации и энергии Цзы. Наносит молниеносные серии ударов.',
    lore: 'Воспитанник монастыря Небесных Вершин, Монах закалил тело и дух. Его кулаки тверже титана, а чакра позволяет исцелять раны прямо посреди жестокого боя.',
    baseStats: { str: 7, agi: 9, vit: 7, int: 5, end: 7, luk: 6, wis: 8, per: 7, cha: 6, wil: 8 },
    starterGear: [
      { name: 'Нефритовые Кастеты', slot: 'weapon', rarity: 'uncommon', icon: '🥊', dmg: 18 },
      { name: 'Четки Дзен', slot: 'amulet', rarity: 'uncommon', icon: '📿', hp: 30 },
    ],
    branches: [
      { id: 'mnk_fist',    name: 'Кулак', icon: '🥊', color: '#ec4899', desc: 'Скорость рукопашных атак и комбо-удары.' },
      { id: 'mnk_chi',     name: 'Энергия Цзы', icon: '🔮', color: '#38bdf8', desc: 'Восстановление HP, маны и щиты духа.' },
      { id: 'mnk_spirit',  name: 'Дух', icon: '✨', color: '#facc15', desc: 'Уклонение, критические серии и Нирвана.' },
    ],
    talents: [
      { id: 'm_f1', name: 'Драконий Кулак', icon: '🥊', branchId: 'mnk_fist', row: 0, maxRank: 5, desc: 'Увеличивает урон.', per: r => `+${r * 10}% урона` },
      { id: 'm_f2', name: 'Скорость Журавля', icon: '🦩', branchId: 'mnk_fist', row: 1, maxRank: 5, desc: 'Скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'm_f3', name: 'Точка Раскола', icon: '💥', branchId: 'mnk_fist', row: 2, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'm_f4', name: 'Сокрушение Костей', icon: '🦴', branchId: 'mnk_fist', row: 3, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'm_f5', name: 'Гранд-Мастер', icon: '👑', branchId: 'mnk_fist', row: 4, maxRank: 3, desc: 'Ловкость и Сила.', per: r => `+${r * 5} AGI/STR` },
      { id: 'm_c1', name: 'Гармония Цзы', icon: '🧘', branchId: 'mnk_chi', row: 0, maxRank: 5, desc: 'Регенерация HP.', per: r => `+${r * 15}% реген HP` },
      { id: 'm_c2', name: 'Астральная Мана', icon: '🔮', branchId: 'mnk_chi', row: 1, maxRank: 5, desc: 'Регенерация маны.', per: r => `+${r * 15}% реген маны` },
      { id: 'm_c3', name: 'Аура Дзен', icon: '🕊️', branchId: 'mnk_chi', row: 2, maxRank: 5, desc: 'Снижает урон.', per: r => `-${r * 2}% урона` },
      { id: 'm_c4', name: 'Защитная Чакра', icon: '🛡️', branchId: 'mnk_chi', row: 3, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 8}% HP` },
      { id: 'm_c5', name: 'Священный Дух', icon: '💫', branchId: 'mnk_chi', row: 4, maxRank: 3, desc: 'Воля и Мудрость.', per: r => `+${r * 6} WIL/WIS` },
      { id: 'm_s1', name: 'Танец Облаков', icon: '💨', branchId: 'mnk_spirit', row: 0, maxRank: 5, desc: 'Увеличивает уклонение.', per: r => `+${r * 2.5}% уклонения` },
      { id: 'm_s2', name: 'Энергетический Щит', icon: '✨', branchId: 'mnk_spirit', row: 1, maxRank: 5, desc: 'Отражение урона.', per: r => `+${r * 5}% отражения` },
      { id: 'm_s3', name: 'Быстрые Шаги', icon: '⏱️', branchId: 'mnk_spirit', row: 2, maxRank: 5, desc: 'Снижает кулдауны.', per: r => `-${r * 3}% кулдауны` },
      { id: 'm_s4', name: 'Пожертвования Храму', icon: '💰', branchId: 'mnk_spirit', row: 3, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 12}% золота` },
      { id: 'm_s5', name: 'Нирвана', icon: '🌟', branchId: 'mnk_spirit', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'monk_fist_fury', name: 'Кулак Ярости', icon: '🥊', unlockLevel: 1, maxRank: 10, manaCost: 12, cooldown: 5, desc: 'Серия быстрых ударов кулаками.', color: '#ec4899' },
      { id: 'monk_palm_strike', name: 'Ладонь Дракона', icon: '🖐️', unlockLevel: 3, maxRank: 10, manaCost: 18, cooldown: 7, desc: 'Удар внутренней энергией Цзы.', color: '#f43f5e' },
      { id: 'monk_flying_kick', name: 'Летящий Удар', icon: '🦵', unlockLevel: 6, maxRank: 10, manaCost: 22, cooldown: 8, desc: 'Мгновенный подлет с ударом.', color: '#fb7185' },
      { id: 'monk_spinning_crane', name: 'Вихрь Журавля', icon: '🦩', unlockLevel: 12, maxRank: 10, manaCost: 28, cooldown: 10, desc: 'Круговой удар ногами в воздухе.', color: '#e11d48' },
      { id: 'monk_meditation', name: 'Медитация Цзы', icon: '🧘', unlockLevel: 20, maxRank: 10, manaCost: 20, cooldown: 14, desc: 'Восстановление HP и маны.', color: '#38bdf8' },
      { id: 'monk_chi_wave', name: 'Волна Цзы', icon: '🌊', unlockLevel: 30, maxRank: 10, manaCost: 32, cooldown: 9, desc: 'Светящийся шар духовной силы.', color: '#818cf8' },
      { id: 'monk_touch_death', name: 'Касание Смерти', icon: '☠️', unlockLevel: 42, maxRank: 10, manaCost: 50, cooldown: 18, desc: 'Смертельный удар по болевой точке.', color: '#be123c' },
      { id: 'monk_inner_fire', name: 'Внутренний Огонь', icon: '🔥', unlockLevel: 55, maxRank: 10, manaCost: 45, cooldown: 15, desc: 'Увеличивает защиту и скорость.', color: '#f97316' },
      { id: 'monk_tiger_strike', name: 'Бросок Тигра', icon: '🐅', unlockLevel: 70, maxRank: 10, manaCost: 60, cooldown: 14, desc: 'Сокрушительный солярный комбо-удар.', color: '#f59e0b' },
      { id: 'monk_transcendence', name: 'Трансцендентность', icon: '✨', unlockLevel: 85, maxRank: 10, manaCost: 80, cooldown: 22, desc: 'Вхождение в облик духа нирваны.', color: '#a855f7' },
    ],
  },

  // 10. DEATH KNIGHT
  {
    id: 'deathknight',
    name: 'Рыцарь Смерти',
    title: 'Падший Рыцарь Ледяного Трона',
    icon: '⚔️',
    artSrc: '/heroes/hero_deathknight.jpg',
    color: '#0284c7',
    desc: 'Тёмный рыцарь льда, скверны и крови. Использует ледяные руны и похищает здоровье.',
    lore: 'Бывший паладин, воскрешенный темной магией Лича. Рыцарь Смерти не чувствует боли — его рунический клинок вымораживает сердца врагов и пьет их кровь.',
    baseStats: { str: 10, agi: 4, vit: 9, int: 6, end: 9, luk: 4, wis: 6, per: 5, cha: 3, wil: 9 },
    starterGear: [
      { name: 'Рунический Клинок', slot: 'weapon', rarity: 'uncommon', icon: '🗡️', dmg: 24 },
      { name: 'Латный Панцирь Льда', slot: 'armor', rarity: 'uncommon', icon: '🛡️', hp: 40 },
    ],
    branches: [
      { id: 'dk_frost', name: 'Лёд', icon: '🧊', color: '#38bdf8', desc: 'Заморозка, ледяные руны и криты.' },
      { id: 'dk_blood', name: 'Кровь', icon: '🩸', color: '#dc2626', desc: 'Максимальное HP, вампиризм и стойкость.' },
      { id: 'dk_unholy', name: 'Скверна', icon: '☣️', color: '#84cc16', desc: 'Болезни, призыв упырей и проклятия.' },
    ],
    talents: [
      { id: 'dk_f1', name: 'Ледяной Рубитель', icon: '🧊', branchId: 'dk_frost', row: 0, maxRank: 5, desc: 'Увеличивает урон.', per: r => `+${r * 10}% урона` },
      { id: 'dk_f2', name: 'Острый Иней', icon: '❄️', branchId: 'dk_frost', row: 1, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'dk_f3', name: 'Студеный Доспех', icon: '🛡️', branchId: 'dk_frost', row: 2, maxRank: 5, desc: 'Увеличивает броню.', per: r => `+${r * 10}% брони` },
      { id: 'dk_f4', name: 'Северная Смерть', icon: '💀', branchId: 'dk_frost', row: 3, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'dk_f5', name: 'Владыка Скорби', icon: '👑', branchId: 'dk_frost', row: 4, maxRank: 3, desc: 'Сила и Интеллект.', per: r => `+${r * 5} STR/INT` },
      { id: 'dk_b1', name: 'Вампиризм Крови', icon: '🩸', branchId: 'dk_blood', row: 0, maxRank: 5, desc: 'Вампиризм.', per: r => `+${r * 2.5}% вампиризм` },
      { id: 'dk_b2', name: 'Бастион Забвения', icon: '🏰', branchId: 'dk_blood', row: 1, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 10}% HP` },
      { id: 'dk_b3', name: 'Кровавый Заслон', icon: '🪨', branchId: 'dk_blood', row: 2, maxRank: 5, desc: 'Снижает урон.', per: r => `-${r * 2}% урона` },
      { id: 'dk_b4', name: 'Регенерация Рун', icon: '🔋', branchId: 'dk_blood', row: 3, maxRank: 5, desc: 'Регенерация HP.', per: r => `+${r * 15}% реген HP` },
      { id: 'dk_b5', name: 'Неживой Воин', icon: '🦾', branchId: 'dk_blood', row: 4, maxRank: 3, desc: 'Выносливость и Здоровье.', per: r => `+${r * 6} END & +${r * 5}% HP` },
      { id: 'dk_u1', name: 'Гниющая Чумка', icon: '☣️', branchId: 'dk_unholy', row: 0, maxRank: 5, desc: 'Увеличивает DoT урон.', per: r => `+${r * 10}% DoT урона` },
      { id: 'dk_u2', name: 'Призыв Упыря', icon: '🧟', branchId: 'dk_unholy', row: 1, maxRank: 5, desc: 'Отражение урона.', per: r => `+${r * 5}% отражения` },
      { id: 'dk_u3', name: 'Руническая Скорость', icon: '⏱️', branchId: 'dk_unholy', row: 2, maxRank: 5, desc: 'Снижает кулдауны.', per: r => `-${r * 3}% кулдауны` },
      { id: 'dk_u4', name: 'Трофеи Могил', icon: '💰', branchId: 'dk_unholy', row: 3, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 12}% золота` },
      { id: 'dk_u5', name: 'Повелитель Мертвых', icon: '🔮', branchId: 'dk_unholy', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'dk_rune_strike', name: 'Рунический Удар', icon: '⚔️', unlockLevel: 1, maxRank: 10, manaCost: 14, cooldown: 5, desc: 'Удар ледяным руническим мечом.', color: '#0284c7' },
      { id: 'dk_death_coil', name: 'Лик Смерти', icon: '💀', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 7, desc: 'Сгусток тёмной энергии поражает монстра.', color: '#06b6d4' },
      { id: 'dk_icy_touch', name: 'Прикосновение Льда', icon: '🧊', unlockLevel: 6, maxRank: 10, manaCost: 22, cooldown: 8, desc: 'Замораживает кровь врага.', color: '#38bdf8' },
      { id: 'dk_death_grip', name: 'Хватка Смерти', icon: '🪝', unlockLevel: 12, maxRank: 10, manaCost: 28, cooldown: 10, desc: 'Притягивает и оглушает монстра.', color: '#475569' },
      { id: 'dk_vampiric_aura', name: 'Вампиризм', icon: '🩸', unlockLevel: 20, maxRank: 10, manaCost: 32, cooldown: 14, desc: 'Похищает здоровье при каждой атаке.', color: '#991b1b' },
      { id: 'dk_frost_fever', name: 'Ледяная Лихорадка', icon: '❄️', unlockLevel: 30, maxRank: 10, manaCost: 38, cooldown: 11, desc: 'Болезнь вымораживает органика.', color: '#7dd3fc' },
      { id: 'dk_scourge_strike', name: 'Удар Плети', icon: '⛓️', unlockLevel: 42, maxRank: 10, manaCost: 45, cooldown: 12, desc: 'Тёмное проклятие разрывает рану.', color: '#334155' },
      { id: 'dk_army_damned', name: 'Армия Проклятых', icon: '🧟', unlockLevel: 55, maxRank: 10, manaCost: 60, cooldown: 20, desc: 'Восставшие упыри атаковывают врага.', color: '#581c87' },
      { id: 'dk_remorseless_winter', name: 'Беспощадная Зима', icon: '🌨️', unlockLevel: 70, maxRank: 10, manaCost: 70, cooldown: 16, desc: 'Снежная буря сковывает и выжигает.', color: '#0284c7' },
      { id: 'dk_frostmourne_fury', name: 'Ярость Ледяной Скорби', icon: '🗡️', unlockLevel: 85, maxRank: 10, manaCost: 85, cooldown: 25, desc: 'Легендарный клинок поглощает душу цели.', color: '#0f172a' },
    ],
  },
];

export function getClassById(id: string): HeroClassDef {
  return HERO_CLASSES.find(c => c.id === id) ?? HERO_CLASSES[0];
}
