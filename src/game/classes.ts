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
      // Holy Branch
      { id: 'p_h1', name: 'Благодать Святости', icon: '✨', branchId: 'pal_holy', row: 0, maxRank: 5, desc: 'Увеличивает регенерацию HP.', per: r => `+${r * 15}% к регенерации` },
      { id: 'p_h2', name: 'Священный Резерв', icon: '🔮', branchId: 'pal_holy', row: 1, maxRank: 5, desc: 'Увеличивает макс. ману.', per: r => `+${r * 10}% к мане` },
      { id: 'p_h3', name: 'Аура Чистоты', icon: '🌟', branchId: 'pal_holy', row: 2, maxRank: 5, desc: 'Увеличивает получаемое золото.', per: r => `+${r * 12}% к золоту` },
      { id: 'p_h4', name: 'Благословение Небес', icon: '🕊️', branchId: 'pal_holy', row: 3, maxRank: 5, desc: 'Увеличивает бонусный опыт.', per: r => `+${r * 10}% к XP` },
      { id: 'p_h5', name: 'Астральный Священник', icon: '👑', branchId: 'pal_holy', row: 4, maxRank: 3, desc: 'Дарует силу всем характеристикам.', per: r => `+${r * 4} всем статам` },

      // Protection Branch
      { id: 'p_p1', name: 'Бастион Веры', icon: '🛡️', branchId: 'pal_prot', row: 0, maxRank: 5, desc: 'Увеличивает броню.', per: r => `+${r * 10}% к броне` },
      { id: 'p_p2', name: 'Живая Сталь', icon: '🏰', branchId: 'pal_prot', row: 1, maxRank: 5, desc: 'Увеличивает максимальное HP.', per: r => `+${r * 8}% к HP` },
      { id: 'p_p3', name: 'Освященные Шипы', icon: '🌵', branchId: 'pal_prot', row: 2, maxRank: 5, desc: 'Возвращает урон врагу.', per: r => `+${r * 5}% отражения` },
      { id: 'p_p4', name: 'Несокрушимость', icon: '🪨', branchId: 'pal_prot', row: 3, maxRank: 5, desc: 'Снижает получаемый урон.', per: r => `-${r * 2}% урона` },
      { id: 'p_p5', name: 'Торжество Защитника', icon: '🦾', branchId: 'pal_prot', row: 4, maxRank: 3, desc: 'Увеличивает выносливость.', per: r => `+${r * 6} Выносливости` },

      // Retribution Branch
      { id: 'p_r1', name: 'Карающий Удар', icon: '⚡', branchId: 'pal_ret', row: 0, maxRank: 5, desc: 'Увеличивает базовый урон.', per: r => `+${r * 8}% к урону` },
      { id: 'p_r2', name: 'Святой Крит', icon: '💥', branchId: 'pal_ret', row: 1, maxRank: 5, desc: 'Увеличивает шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'p_r3', name: 'Ярость Инквизиции', icon: '🔥', branchId: 'pal_ret', row: 2, maxRank: 5, desc: 'Увеличивает скорость атаки.', per: r => `+${r * 4}% скорости` },
      { id: 'p_r4', name: 'Печать Искупления', icon: '📜', branchId: 'pal_ret', row: 3, maxRank: 5, desc: 'Увеличивает урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'p_r5', name: 'Воплощение Возмездия', icon: '☀️', branchId: 'pal_ret', row: 4, maxRank: 3, desc: 'Сила и Крит Сила.', per: r => `+${r * 5} Силы & +${r * 10}% крит урон` },
    ],
    skills: [
      { id: 'pal_holy_light', name: 'Святой Свет', icon: '✨', unlockLevel: 1, maxRank: 10, manaCost: 15, cooldown: 6, desc: 'Восстанавливает здоровье и наносит урон мгновенным светом.', color: '#facc15' },
      { id: 'pal_shield_bash', name: 'Удар Щитом', icon: '🛡️', unlockLevel: 3, maxRank: 10, manaCost: 18, cooldown: 7, desc: 'Оглушает врага тяжелым щитом.', color: '#38bdf8' },
      { id: 'pal_judgement', name: 'Праведный Суд', icon: '⚖️', unlockLevel: 8, maxRank: 10, manaCost: 25, cooldown: 10, desc: 'С небес опускается меч карающего света.', color: '#ef4444' },
      { id: 'pal_consecration', name: 'Освящение Земли', icon: '☀️', unlockLevel: 15, maxRank: 10, manaCost: 35, cooldown: 14, desc: 'Земля под врагом закипает от священного огня.', color: '#fb923c' },
    ],
  },

  // 2. NECROMANCER
  {
    id: 'necromancer',
    name: 'Некромант',
    title: 'Тёмный Повелитель Смерти',
    icon: '💀',
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
      // Bones Branch
      { id: 'n_b1', name: 'Костяная Броня', icon: '🦴', branchId: 'nec_bones', row: 0, maxRank: 5, desc: 'Увеличивает броню.', per: r => `+${r * 12}% к броне` },
      { id: 'n_b2', name: 'Шипы Смерти', icon: '🗡️', branchId: 'nec_bones', row: 1, maxRank: 5, desc: 'Отражает урон врагу.', per: r => `+${r * 6}% отражения` },
      { id: 'n_b3', name: 'Острые Осколки', icon: '💥', branchId: 'nec_bones', row: 2, maxRank: 5, desc: 'Увеличивает шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'n_b4', name: 'Панцирь Праха', icon: '🛡️', branchId: 'nec_bones', row: 3, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 10}% HP` },
      { id: 'n_b5', name: 'Костяной Лорд', icon: '💀', branchId: 'nec_bones', row: 4, maxRank: 3, desc: 'Интеллект и Выносливость.', per: r => `+${r * 5} INT/END` },

      // Plague Branch
      { id: 'n_p1', name: 'Ядовитый Туман', icon: '☣️', branchId: 'nec_plague', row: 0, maxRank: 5, desc: 'Увеличивает урон ядами.', per: r => `+${r * 10}% DoT урона` },
      { id: 'n_p2', name: 'Разложение Клеток', icon: '🧪', branchId: 'nec_plague', row: 1, maxRank: 5, desc: 'Увеличивает базовый урон.', per: r => `+${r * 8}% к урону` },
      { id: 'n_p3', name: 'Гниющий Сглаз', icon: '👁️', branchId: 'nec_plague', row: 2, maxRank: 5, desc: 'Снижает урон врагов.', per: r => `-${r * 3}% урона врагов` },
      { id: 'n_p4', name: 'Эпидемия', icon: '🧫', branchId: 'nec_plague', row: 3, maxRank: 5, desc: 'Увеличивает бонус золота.', per: r => `+${r * 15}% золота` },
      { id: 'n_p5', name: 'Мастер Чумы', icon: '👑', branchId: 'nec_plague', row: 4, maxRank: 3, desc: 'Сила заклинаний.', per: r => `+${r * 8}% силы скиллов` },

      // Souls Branch
      { id: 'n_s1', name: 'Жатва Душ', icon: '🔮', branchId: 'nec_souls', row: 0, maxRank: 5, desc: 'Увеличивает вампиризм.', per: r => `+${r * 2}% вампиризм` },
      { id: 'n_s2', name: 'Астральный Сосуд', icon: '🍷', branchId: 'nec_souls', row: 1, maxRank: 5, desc: 'Регенерация маны.', per: r => `+${r * 15}% реген маны` },
      { id: 'n_s3', name: 'Зов Бездны', icon: '🌌', branchId: 'nec_souls', row: 2, maxRank: 5, desc: 'Увеличивает бонус XP.', per: r => `+${r * 10}% XP` },
      { id: 'n_s4', name: 'Призрачный Щит', icon: '👻', branchId: 'nec_souls', row: 3, maxRank: 5, desc: 'Увеличивает уклонение.', per: r => `+${r * 2}% уклонения` },
      { id: 'n_s5', name: 'Повелитель Теней', icon: '🌑', branchId: 'nec_souls', row: 4, maxRank: 3, desc: 'Все макро-характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'nec_bone_spear', name: 'Костяное Копьё', icon: '🦴', unlockLevel: 1, maxRank: 10, manaCost: 14, cooldown: 5, desc: 'Пробивающее копьё из спрессованных костей.', color: '#e2e8f0' },
      { id: 'nec_poison_nova', name: 'Кольцо Яда', icon: '☣️', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 8, desc: 'Вспышка ядовитого газа отравляет цель.', color: '#84cc16' },
      { id: 'nec_drain_life', name: 'Похищение Жизни', icon: '🩸', unlockLevel: 8, maxRank: 10, manaCost: 25, cooldown: 9, desc: 'Высасывает здоровье врага и лечит героя.', color: '#dc2626' },
      { id: 'nec_summon_army', name: 'Призыв Скелетов', icon: '💀', unlockLevel: 15, maxRank: 10, manaCost: 40, cooldown: 16, desc: 'Орда скелетов терзает противника.', color: '#a855f7' },
    ],
  },

  // 3. ARCHMAGE
  {
    id: 'archmage',
    name: 'Архимаг',
    title: 'Астральный Архимаг',
    icon: '🔮',
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
      { id: 'arch_chain_lightning', name: 'Цепная Молния', icon: '⚡', unlockLevel: 8, maxRank: 10, manaCost: 28, cooldown: 9, desc: 'Молния бьёт чудовище электричеством.', color: '#facc15' },
      { id: 'arch_meteor', name: 'Метеоритный Дождь', icon: '☄️', unlockLevel: 15, maxRank: 10, manaCost: 45, cooldown: 18, desc: 'Гигантский пылающий метеор падает с небес.', color: '#fb923c' },
    ],
  },

  // 4. ASSASSIN
  {
    id: 'assassin',
    name: 'Ассасин',
    title: 'Теневой Убийца',
    icon: '🗡️',
    color: '#84cc16',
    desc: 'Мастер молниеносных отравленных клинков и мгновенных критических ударов из тени.',
    lore: 'Выходец из Гильдии Ночных Клинков, Ассасин не знает пощады. Он атакует быстрее, чем успевает упасть тень, оставляя после себя лишь смертоносный яд.',
    baseStats: { str: 4, agi: 12, vit: 5, int: 4, end: 5, luk: 9, wis: 4, per: 9, cha: 5, wil: 6 },
    starterGear: [
      { name: 'Парные Кинжалы', slot: 'weapon', rarity: 'uncommon', icon: '🗡️', dmg: 22 },
      { name: 'Теневой Капюшон', slot: 'helmet', rarity: 'uncommon', icon: '🪖', hp: 20 },
    ],
    branches: [
      { id: 'ass_poison', name: 'Яды', icon: '☠️', color: '#84cc16', desc: 'Смертоносные токсины и растворение брони.' },
      { id: 'ass_shadow', name: 'Тень', icon: '👤', color: '#a855f7', desc: 'Уклонение, скрытность и скорость движения.' },
      { id: 'ass_crit',   name: 'Криты', icon: '💥', branchId: 'ass_crit', color: '#ef4444', desc: 'Колоссальный критический урон.' },
    ],
    talents: [
      { id: 'as_p1', name: 'Смертельный Токсин', icon: '☠️', branchId: 'ass_poison', row: 0, maxRank: 5, desc: 'Увеличивает урон ядами.', per: r => `+${r * 12}% DoT` },
      { id: 'as_p2', name: 'Отравленные Острия', icon: '🗡️', branchId: 'ass_poison', row: 1, maxRank: 5, desc: 'Базовый урон.', per: r => `+${r * 8}% к урону` },
      { id: 'as_p3', name: 'Разъедание Брони', icon: '🧪', branchId: 'ass_poison', row: 2, maxRank: 5, desc: 'Игнорирование брони.', per: r => `+${r * 4}% пробития` },
      { id: 'as_p4', name: 'Кровавый Яд', icon: '🩸', branchId: 'ass_poison', row: 3, maxRank: 5, desc: 'Вампиризм.', per: r => `+${r * 2}% вампиризма` },
      { id: 'as_p5', name: 'Мастер Ядов', icon: '👑', branchId: 'ass_poison', row: 4, maxRank: 3, desc: 'Ловкость и Сила скиллов.', per: r => `+${r * 6} AGI & +${r * 8}% урона` },

      { id: 'as_s1', name: 'Призрак Ночи', icon: '💨', branchId: 'ass_shadow', row: 0, maxRank: 5, desc: 'Учеличение уклонения.', per: r => `+${r * 2}% уклонения` },
      { id: 'as_s2', name: 'Молниеносный Шаг', icon: '⚡', branchId: 'ass_shadow', row: 1, maxRank: 5, desc: 'Скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'as_s3', name: 'Удачливый Вор', icon: '🍀', branchId: 'ass_shadow', row: 2, maxRank: 5, desc: 'Шанс дропа.', per: r => `+${r * 10}% дропа` },
      { id: 'as_s4', name: 'Теневой Покров', icon: '🛡️', branchId: 'ass_shadow', row: 3, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 8}% HP` },
      { id: 'as_s5', name: 'Тень Смерти', icon: '👤', branchId: 'ass_shadow', row: 4, maxRank: 3, desc: 'Ловкость и Удача.', per: r => `+${r * 6} AGI & +${r * 4} LUK` },

      { id: 'as_c1', name: 'Анатомия Жертвы', icon: '💥', branchId: 'ass_crit', row: 0, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 3}% крита` },
      { id: 'as_c2', name: 'Точный Разрез', icon: '🎯', branchId: 'ass_crit', row: 1, maxRank: 5, desc: 'Сила крита.', per: r => `+${r * 15}% крит урона` },
      { id: 'as_c3', name: 'Казнь Из Тени', icon: '🪓', branchId: 'ass_crit', row: 2, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'as_c4', name: 'Золотой Кинжал', icon: '💰', branchId: 'ass_crit', row: 3, maxRank: 5, desc: 'Золото.', per: r => `+${r * 15}% золота` },
      { id: 'as_c5', name: 'Абсолютный Палач', icon: '👑', branchId: 'ass_crit', row: 4, maxRank: 3, desc: 'Все характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'ass_shadow_strike', name: 'Теневой Удар', icon: '🗡️', unlockLevel: 1, maxRank: 10, manaCost: 12, cooldown: 4, desc: 'Быстрый выпал из тени с повышенным критом.', color: '#84cc16' },
      { id: 'ass_poison_blade', name: 'Отравленный Клинок', icon: '☠️', unlockLevel: 3, maxRank: 10, manaCost: 18, cooldown: 7, desc: 'Покрывает оружие разъедающим ядом.', color: '#a855f7' },
      { id: 'ass_fan_of_knives', name: 'Веер Кинжалов', icon: '🪓', unlockLevel: 8, maxRank: 10, manaCost: 24, cooldown: 9, desc: 'Шквал стальных лезвий поражает противника.', color: '#38bdf8' },
      { id: 'ass_assassinate', name: 'Ликвидация', icon: '☠️', unlockLevel: 15, maxRank: 10, manaCost: 35, cooldown: 14, desc: 'Смертоносный сокрушительный удар по уязвимым местам.', color: '#ef4444' },
    ],
  },

  // 5. BERSERKER
  {
    id: 'berserker',
    name: 'Берсерк',
    title: 'Берсерк Бездны',
    icon: '🪓',
    color: '#ef4444',
    desc: 'Дикий неистовый воин. Получает колоссальный урон и скорость по мере потери собственного здоровья.',
    lore: 'Рожденный в суровых заснеженных ущельях Кровавого Кряжа, Берсерк черпает силу из боли. Чем тяжелее его раны, тем сокрушительнее становятся удары его двуручного топора.',
    baseStats: { str: 12, agi: 5, vit: 9, int: 2, end: 8, luk: 5, wis: 3, per: 4, cha: 4, wil: 9 },
    starterGear: [
      { name: 'Двуручная Секира', slot: 'weapon', rarity: 'uncommon', icon: '🪓', dmg: 24 },
      { name: 'Наплечники Ярости', slot: 'shoulders', rarity: 'uncommon', icon: '🎽', hp: 30 },
    ],
    branches: [
      { id: 'ber_rage',  name: 'Ярость', icon: '😡', color: '#ef4444', desc: 'Урон при низком HP, скорость и сила.' },
      { id: 'ber_blood', name: 'Кровь', icon: '🩸', color: '#dc2626', desc: 'Вампиризм, восполнение HP и здоровье.' },
      { id: 'ber_destr', name: 'Разрушение', icon: '💥', color: '#f97316', desc: 'Разрушение брони и оголушающие удары.' },
    ],
    talents: [
      { id: 'b_r1', name: 'Неистовая Сила', icon: '💪', branchId: 'ber_rage', row: 0, maxRank: 5, desc: 'Базовый урон.', per: r => `+${r * 10}% урона` },
      { id: 'b_r2', name: 'Жажда Битвы', icon: '⚡', branchId: 'ber_rage', row: 1, maxRank: 5, desc: 'Скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'b_r3', name: 'Разъяренный Крит', icon: '💥', branchId: 'ber_rage', row: 2, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'b_r4', name: 'Убийца Боссов', icon: '👑', branchId: 'ber_rage', row: 3, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'b_r5', name: 'Аватар Ярости', icon: '🔥', branchId: 'ber_rage', row: 4, maxRank: 3, desc: 'Сила и Крит Урон.', per: r => `+${r * 6} STR & +${r * 15}% крит` },

      { id: 'b_b1', name: 'Кровавый Вкус', icon: '🩸', branchId: 'ber_blood', row: 0, maxRank: 5, desc: 'Вампиризм.', per: r => `+${r * 2}% вампиризма` },
      { id: 'b_b2', name: 'Бычье Здоровье', icon: '❤️', branchId: 'ber_blood', row: 1, maxRank: 5, desc: 'Максимальное HP.', per: r => `+${r * 10}% HP` },
      { id: 'b_b3', name: 'Регенерация Бездны', icon: '❤️‍🔥', branchId: 'ber_blood', row: 2, maxRank: 5, desc: 'Регенерация HP.', per: r => `+${r * 15}% реген HP` },
      { id: 'b_b4', name: 'Кровавая Сталь', icon: '🛡️', branchId: 'ber_blood', row: 3, maxRank: 5, desc: 'Броня.', per: r => `+${r * 8}% брони` },
      { id: 'b_b5', name: 'Несокрушимая Жила', icon: '🩸', branchId: 'ber_blood', row: 4, maxRank: 3, desc: 'Живучесть и HP.', per: r => `+${r * 6} VIT & +${r * 8}% HP` },

      { id: 'b_d1', name: 'Разлом Брони', icon: '🔨', branchId: 'ber_destr', row: 0, maxRank: 5, desc: 'Пробитие брони.', per: r => `+${r * 4}% пробития` },
      { id: 'b_d2', name: 'Шипованный Двуручник', icon: '🌵', branchId: 'ber_destr', row: 1, maxRank: 5, desc: 'Отражение урона.', per: r => `+${r * 5}% отражения` },
      { id: 'b_d3', name: 'Золотая Ярость', icon: '💰', branchId: 'ber_destr', row: 2, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 12}% золота` },
      { id: 'b_d4', name: 'Жнец Трофеев', icon: '📈', branchId: 'ber_destr', row: 3, maxRank: 5, desc: 'Бонус опыта.', per: r => `+${r * 10}% XP` },
      { id: 'b_d5', name: 'Владыка Разрушения', icon: '🌋', branchId: 'ber_destr', row: 4, maxRank: 3, desc: 'Все характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'ber_whirlwind', name: 'Вихрь Смерти', icon: '🌪️', unlockLevel: 1, maxRank: 10, manaCost: 15, cooldown: 5, desc: 'Яростное вращение наносит сокрушительный урон.', color: '#ef4444' },
      { id: 'ber_blood_strike', name: 'Кровавый Замах', icon: '🩸', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 7, desc: 'Ранит героя ради колоссального урона.', color: '#dc2626' },
      { id: 'ber_execute', name: 'Казнь Врага', icon: '🪓', unlockLevel: 8, maxRank: 10, manaCost: 25, cooldown: 10, desc: 'Мгновенно добивает ослабленного монстра.', color: '#f97316' },
      { id: 'ber_recklessness', name: 'Безрассудство', icon: '🔥', unlockLevel: 15, maxRank: 10, manaCost: 35, cooldown: 16, desc: 'Входит в состояние берсерка с 100% критом.', color: '#facc15' },
    ],
  },

  // 6. RANGER
  {
    id: 'ranger',
    name: 'Следопыт',
    title: 'Охотник Первозданья',
    icon: '🏹',
    color: '#10b981',
    desc: 'Мастер дальнобойной стрельбы из лука, установки ловушек и призыва верных зверей.',
    lore: 'Следопыт провел десятилетия в диких чащах Изумрудного Леса. Его стрелы не знают промаха, а духи диких волков охраняют его в дальних походах.',
    baseStats: { str: 5, agi: 11, vit: 6, int: 4, end: 6, luk: 8, wis: 6, per: 10, cha: 5, wil: 6 },
    starterGear: [
      { name: 'Охотничий Лук', slot: 'weapon', rarity: 'uncommon', icon: '🏹', dmg: 19 },
      { name: 'Кожаные Сапоги', slot: 'boots', rarity: 'uncommon', icon: '🥾', hp: 25 },
    ],
    branches: [
      { id: 'ran_arch', name: 'Стрельба', icon: '🏹', color: '#10b981', desc: 'Урон из лука, дальнобойность и криты.' },
      { id: 'ran_beast', name: 'Звери', icon: '🐺', color: '#f59e0b', desc: 'Призыв волков, питомцы и выживаемость.' },
      { id: 'ran_trap',  name: 'Ловушки', icon: '🪤', color: '#8b5cf6', desc: 'Замедление, капканы и уклонение.' },
    ],
    talents: [
      { id: 'r_a1', name: 'Меткий Выстрел', icon: '🎯', branchId: 'ran_arch', row: 0, maxRank: 5, desc: 'Базовый урон.', per: r => `+${r * 10}% урона` },
      { id: 'r_a2', name: 'Быстрая Тетива', icon: '⚡', branchId: 'ran_arch', row: 1, maxRank: 5, desc: 'Скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'r_a3', name: 'Прицельный Крит', icon: '💥', branchId: 'ran_arch', row: 2, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'r_a4', name: 'Бронебойные Стрелы', icon: '🏹', branchId: 'ran_arch', row: 3, maxRank: 5, desc: 'Пробитие брони.', per: r => `+${r * 4}% пробития` },
      { id: 'r_a5', name: 'Мастер Лука', icon: '👑', branchId: 'ran_arch', row: 4, maxRank: 3, desc: 'Ловкость и Крит Урон.', per: r => `+${r * 6} AGI & +${r * 15}% крит` },

      { id: 'r_b1', name: 'Инстинкт Волка', icon: '🐺', branchId: 'ran_beast', row: 0, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 10}% HP` },
      { id: 'r_b2', name: 'Звериная Броня', icon: '🛡️', branchId: 'ran_beast', row: 1, maxRank: 5, desc: 'Броня.', per: r => `+${r * 8}% брони` },
      { id: 'r_b3', name: 'Клыки Стаи', icon: '🐾', branchId: 'ran_beast', row: 2, maxRank: 5, desc: 'Вампиризм.', per: r => `+${r * 2}% вампиризма` },
      { id: 'r_b4', name: 'Дух Сокола', icon: '🦅', branchId: 'ran_beast', row: 3, maxRank: 5, desc: 'Шанс дропа.', per: r => `+${r * 10}% дропа` },
      { id: 'r_b5', name: 'Повелитель Зверей', icon: '👑', branchId: 'ran_beast', row: 4, maxRank: 3, desc: 'Восприятие и Выносливость.', per: r => `+${r * 6} PER & +${r * 5} END` },

      { id: 'r_t1', name: 'Лесная Ловушка', icon: '🪤', branchId: 'ran_trap', row: 0, maxRank: 5, desc: 'Снижает урон врага.', per: r => `-${r * 3}% урона врага` },
      { id: 'r_t2', name: 'Тень Лис', icon: '💨', branchId: 'ran_trap', row: 1, maxRank: 5, desc: 'Уклонение.', per: r => `+${r * 2}% уклонения` },
      { id: 'r_t3', name: 'Золотой Следопыт', icon: '💰', branchId: 'ran_trap', row: 2, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 12}% золота` },
      { id: 'r_t4', name: 'Опытный Охотник', icon: '📈', branchId: 'ran_trap', row: 3, maxRank: 5, desc: 'Бонус XP.', per: r => `+${r * 10}% XP` },
      { id: 'r_t5', name: 'Хранитель Лесов', icon: '🌿', branchId: 'ran_trap', row: 4, maxRank: 3, desc: 'Все характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'ran_aimed_shot', name: 'Прицельный Выстрел', icon: '🏹', unlockLevel: 1, maxRank: 10, manaCost: 14, cooldown: 5, desc: 'Точная стрела наносит повышенный урон.', color: '#10b981' },
      { id: 'ran_poison_arrow', name: 'Отравленная Стрела', icon: '🧪', unlockLevel: 3, maxRank: 10, manaCost: 18, cooldown: 7, desc: 'Наносит урон ядом со временем.', color: '#84cc16' },
      { id: 'ran_call_beast', name: 'Зов Лесного Волка', icon: '🐺', unlockLevel: 8, maxRank: 10, manaCost: 26, cooldown: 11, desc: 'Призывает духа волка, атакующего цель.', color: '#f59e0b' },
      { id: 'ran_arrow_rain', name: 'Град Стрел', icon: '🌧️', unlockLevel: 15, maxRank: 10, manaCost: 38, cooldown: 15, desc: 'Сотня стрел накрывает противника.', color: '#38bdf8' },
    ],
  },

  // 7. DRUID
  {
    id: 'druid',
    name: 'Друид',
    title: 'Повелитель Природы',
    icon: '🌿',
    color: '#4ade80',
    desc: 'Страж первозданной природы, способный принимать облик Медведя или Оборотня.',
    lore: 'Друид хранит баланс между жизнью и увяданием. Силы древних деревьев даруют ему исцеление, а дух медведя — непробиваемый панцирь.',
    baseStats: { str: 7, agi: 6, vit: 9, int: 7, end: 8, luk: 5, wis: 9, per: 6, cha: 5, wil: 8 },
    starterGear: [
      { name: 'Посох Древа', slot: 'weapon', rarity: 'uncommon', icon: '🦯', dmg: 17 },
      { name: 'Плащ Дриады', slot: 'cloak', rarity: 'uncommon', icon: '🧣', hp: 30 },
    ],
    branches: [
      { id: 'dru_nature', name: 'Природа', icon: '🌿', color: '#4ade80', desc: 'Исцеление, омоложение и регенерация.' },
      { id: 'dru_bear',   name: 'Медведь', icon: '🐻', color: '#f59e0b', desc: 'Высокая броня, HP и сопротивление.' },
      { id: 'dru_cat',    name: 'Оборотень', icon: '🐆', color: '#ef4444', desc: 'Быстрые критические растерзания.' },
    ],
    talents: [
      { id: 'd_n1', name: 'Дар Дриады', icon: '🌿', branchId: 'dru_nature', row: 0, maxRank: 5, desc: 'Регенерация HP.', per: r => `+${r * 15}% реген HP` },
      { id: 'd_n2', name: 'Сок Жизни', icon: '💧', branchId: 'dru_nature', row: 1, maxRank: 5, desc: 'Максимальное HP.', per: r => `+${r * 10}% HP` },
      { id: 'd_n3', name: 'Астральный Источник', icon: '🧘', branchId: 'dru_nature', row: 2, maxRank: 5, desc: 'Регенерация маны.', per: r => `+${r * 15}% реген маны` },
      { id: 'd_n4', name: 'Свежесть Чащи', icon: '📈', branchId: 'dru_nature', row: 3, maxRank: 5, desc: 'Бонус XP.', per: r => `+${r * 10}% XP` },
      { id: 'd_n5', name: 'Архидруид', icon: '👑', branchId: 'dru_nature', row: 4, maxRank: 3, desc: 'Мудрость и Сила скиллов.', per: r => `+${r * 6} WIS & +${r * 8}% силы` },

      { id: 'd_b1', name: 'Дубовая Кора', icon: '🪵', branchId: 'dru_bear', row: 0, maxRank: 5, desc: 'Броня.', per: r => `+${r * 12}% брони` },
      { id: 'd_b2', name: 'Шкура Медведя', icon: '🐻', branchId: 'dru_bear', row: 1, maxRank: 5, desc: 'Уменьшение урона.', per: r => `-${r * 2}% урона` },
      { id: 'd_b3', name: 'Отражающие Шипы', icon: '🌵', branchId: 'dru_bear', row: 2, maxRank: 5, desc: 'Отражение урона.', per: r => `+${r * 5}% отражения` },
      { id: 'd_b4', name: 'Защита Зарослей', icon: '🛡️', branchId: 'dru_bear', row: 3, maxRank: 5, desc: 'Выносливость.', per: r => `+${r * 5} END` },
      { id: 'd_b5', name: 'Страж Леса', icon: '🪨', branchId: 'dru_bear', row: 4, maxRank: 3, desc: 'Живучесть и Броня.', per: r => `+${r * 6} VIT & +${r * 8}% брони` },

      { id: 'd_c1', name: 'Клыки Хищника', icon: '🐆', branchId: 'dru_cat', row: 0, maxRank: 5, desc: 'Урон.', per: r => `+${r * 10}% урона` },
      { id: 'd_c2', name: 'Разрыв Жил', icon: '🩸', branchId: 'dru_cat', row: 1, maxRank: 5, desc: 'Вампиризм.', per: r => `+${r * 2}% вампиризма` },
      { id: 'd_c3', name: 'Дикий Крит', icon: '💥', branchId: 'dru_cat', row: 2, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'd_c4', name: 'Охотничьи Трофеи', icon: '💰', branchId: 'dru_cat', row: 3, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 12}% золота` },
      { id: 'd_c5', name: 'Первобытный Воин', icon: '🐾', branchId: 'dru_cat', row: 4, maxRank: 3, desc: 'Все характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'dru_rejuvenation', name: 'Омоложение', icon: '🌿', unlockLevel: 1, maxRank: 10, manaCost: 16, cooldown: 6, desc: 'Непрерывный поток энергии восстанавливает HP.', color: '#4ade80' },
      { id: 'dru_bear_form', name: 'Облик Медведя', icon: '🐻', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 8, desc: 'Увеличивает броню и наносит тяжелый лапой.', color: '#f59e0b' },
      { id: 'dru_starfire', name: 'Звездный Огонь', icon: '✨', unlockLevel: 8, maxRank: 10, manaCost: 28, cooldown: 10, desc: 'Столп астрального света наносит урон магии.', color: '#38bdf8' },
      { id: 'dru_wrath_of_nature', name: 'Гнев Природы', icon: '🌪️', unlockLevel: 15, maxRank: 10, manaCost: 40, cooldown: 15, desc: 'Корни и молнии уничтожают чудовище.', color: '#ef4444' },
    ],
  },

  // 8. BLOOD MAGE
  {
    id: 'blood_mage',
    name: 'Маг Крови',
    title: 'Повелитель Гемомантии',
    icon: '🩸',
    color: '#dc2626',
    desc: 'Запретный чародей, жертвующий собственным здоровьем ради разрушительных атак.',
    lore: 'Изгнанный из Высшего Совета за запретные гемомантические ритуалы, Маг Крови превратил свою кровь в смертоносное оружие.',
    baseStats: { str: 4, agi: 5, vit: 10, int: 11, end: 6, luk: 5, wis: 6, per: 6, cha: 5, wil: 9 },
    starterGear: [
      { name: 'Кровавый Клинок', slot: 'weapon', rarity: 'uncommon', icon: '🗡️', dmg: 21 },
      { name: 'Амулет Алой Капли', slot: 'amulet', rarity: 'uncommon', icon: '📿', hp: 35 },
    ],
    branches: [
      { id: 'bl_hemomancy', name: 'Гемомантия', icon: '🩸', color: '#dc2626', desc: 'Урон за счет потери собственного HP.' },
      { id: 'bl_sacrifice', name: 'Жертва', icon: '💀', color: '#a855f7', desc: 'Увеличение вампиризма и проклятия.' },
      { id: 'bl_pact',      name: 'Пакет', icon: '🍷', color: '#f97316', desc: 'Бонусы к золоту и опыту за ритуалы.' },
    ],
    talents: [
      { id: 'bm_h1', name: 'Алая Жила', icon: '🩸', branchId: 'bl_hemomancy', row: 0, maxRank: 5, desc: 'Увеличивает HP.', per: r => `+${r * 12}% HP` },
      { id: 'bm_h2', name: 'Кровавый Урон', icon: '💥', branchId: 'bl_hemomancy', row: 1, maxRank: 5, desc: 'Базовый урон.', per: r => `+${r * 10}% урона` },
      { id: 'bm_h3', name: 'Взрыв Вены', icon: '💣', branchId: 'bl_hemomancy', row: 2, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'bm_h4', name: 'Истребитель', icon: '👑', branchId: 'bl_hemomancy', row: 3, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'bm_h5', name: 'Лорд Гемомантии', icon: '🍷', branchId: 'bl_hemomancy', row: 4, maxRank: 3, desc: 'Интеллект и HP.', per: r => `+${r * 6} INT & +${r * 10}% HP` },

      { id: 'bm_s1', name: 'Жажда Вечности', icon: '🍷', branchId: 'bl_sacrifice', row: 0, maxRank: 5, desc: 'Вампиризм.', per: r => `+${r * 2.5}% вампиризма` },
      { id: 'bm_s2', name: 'Регенерация Алого Покровы', icon: '❤️', branchId: 'bl_sacrifice', row: 1, maxRank: 5, desc: 'Регенерация HP.', per: r => `+${r * 15}% реген HP` },
      { id: 'bm_s3', name: 'Броня Крови', icon: '🛡️', branchId: 'bl_sacrifice', row: 2, maxRank: 5, desc: 'Броня.', per: r => `+${r * 8}% брони` },
      { id: 'bm_s4', name: 'Проклятие Истощения', icon: '🧪', branchId: 'bl_sacrifice', row: 3, maxRank: 5, desc: 'Снижает урон врага.', per: r => `-${r * 3}% урона врага` },
      { id: 'bm_s5', name: 'Жнец Жизней', icon: '💀', branchId: 'bl_sacrifice', row: 4, maxRank: 3, desc: 'Живучесть и Вампиризм.', per: r => `+${r * 6} VIT & +${r * 3}% вампиризма` },

      { id: 'bm_p1', name: 'Ритуальное Золото', icon: '💰', branchId: 'bl_pact', row: 0, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 15}% золота` },
      { id: 'bm_p2', name: 'Жертвенный Опыт', icon: '📈', branchId: 'bl_pact', row: 1, maxRank: 5, desc: 'Бонус XP.', per: r => `+${r * 12}% XP` },
      { id: 'bm_p3', name: 'Кровавый Нюх', icon: '🍀', branchId: 'bl_pact', row: 2, maxRank: 5, desc: 'Шанс дропа.', per: r => `+${r * 10}% дропа` },
      { id: 'bm_p4', name: 'Астральная Жидкость', icon: '🔮', branchId: 'bl_pact', row: 3, maxRank: 5, desc: 'Реген маны.', per: r => `+${r * 15}% реген маны` },
      { id: 'bm_p5', name: 'Владыка Пакта', icon: '🌌', branchId: 'bl_pact', row: 4, maxRank: 3, desc: 'Все характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'bl_blood_bolt', name: 'Сгусток Крови', icon: '🩸', unlockLevel: 1, maxRank: 10, manaCost: 15, cooldown: 5, desc: 'Снаряд алой энергии ранит противника.', color: '#dc2626' },
      { id: 'bl_siphon_life', name: 'Высасывание Вены', icon: '🍷', unlockLevel: 3, maxRank: 10, manaCost: 22, cooldown: 8, desc: 'Качает жизнь врага напрямую в гемоглобин.', color: '#a855f7' },
      { id: 'bl_blood_pact', name: 'Кровавый Пакет', icon: '💀', unlockLevel: 8, maxRank: 10, manaCost: 10, cooldown: 12, desc: 'Отдает 10% HP ради взрывного урона.', color: '#f97316' },
      { id: 'bl_blood_storm', name: 'Алый Шторм', icon: '🌪️', unlockLevel: 15, maxRank: 10, manaCost: 40, cooldown: 16, desc: 'Кровавый ураган уничтожает врага.', color: '#ef4444' },
    ],
  },

  // 9. ENGINEER
  {
    id: 'engineer',
    name: 'Инженер',
    title: 'Мастер Механики',
    icon: '⚙️',
    color: '#06b6d4',
    desc: 'Гений изобретений, использующий турели, взрывчатку и барьеры.',
    lore: 'Выпускник Гильдии Паровых Механиков, Инженер полагается на точный расчет, шестеренки и порох.',
    baseStats: { str: 6, agi: 8, vit: 6, int: 9, end: 7, luk: 7, wis: 5, per: 8, cha: 5, wil: 6 },
    starterGear: [
      { name: 'Паровой Меч', slot: 'weapon', rarity: 'uncommon', icon: '⚙️', dmg: 18 },
      { name: 'Защитные Очки', slot: 'helmet', rarity: 'uncommon', icon: '🪖', hp: 25 },
    ],
    branches: [
      { id: 'eng_turret', name: 'Турели', icon: '⚙️', color: '#06b6d4', desc: 'Автоматические стрелковые установки.' },
      { id: 'eng_bomb',   name: 'Взрывчатка', icon: '💣', color: '#f97316', desc: 'Бомбы, мины и огненные взрывы.' },
      { id: 'eng_exo',    name: 'Экзоскелет', icon: '🦾', color: '#3b82f6', desc: 'Высокая броня и поглощение урона.' },
    ],
    talents: [
      { id: 'eg_t1', name: 'Точный Калибр', icon: '⚙️', branchId: 'eng_turret', row: 0, maxRank: 5, desc: 'Урон турелей.', per: r => `+${r * 10}% урона` },
      { id: 'eg_t2', name: 'Скоростной Привод', icon: '⚡', branchId: 'eng_turret', row: 1, maxRank: 5, desc: 'Скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'eg_t3', name: 'Критический Шестеренка', icon: '💥', branchId: 'eng_turret', row: 2, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'eg_t4', name: 'Золотые Запчасти', icon: '💰', branchId: 'eng_turret', row: 3, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 15}% золота` },
      { id: 'eg_t5', name: 'Главный Изобретатель', icon: '👑', branchId: 'eng_turret', row: 4, maxRank: 3, desc: 'Интеллект и Восприятие.', per: r => `+${r * 6} INT & +${r * 5} PER` },

      { id: 'eg_b1', name: 'Пороховая Смесь', icon: '💣', branchId: 'eng_bomb', row: 0, maxRank: 5, desc: 'Урон взрывами.', per: r => `+${r * 12}% урона` },
      { id: 'eg_b2', name: 'Осколочный Заряд', icon: '💥', branchId: 'eng_bomb', row: 1, maxRank: 5, desc: 'Пробитие брони.', per: r => `+${r * 4}% пробития` },
      { id: 'eg_b3', name: 'Разрушитель Конструкций', icon: '👑', branchId: 'eng_bomb', row: 2, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'eg_b4', name: 'Чертежи Опыта', icon: '📈', branchId: 'eng_bomb', row: 3, maxRank: 5, desc: 'Бонус XP.', per: r => `+${r * 10}% XP` },
      { id: 'eg_b5', name: 'Мастер Детонации', icon: '🌋', branchId: 'eng_bomb', row: 4, maxRank: 3, desc: 'Сила заклинаний.', per: r => `+${r * 8}% силы скиллов` },

      { id: 'eg_e1', name: 'Титановый Сплав', icon: '🦾', branchId: 'eng_exo', row: 0, maxRank: 5, desc: 'Броня.', per: r => `+${r * 12}% брони` },
      { id: 'eg_e2', name: 'Энергетическое Поле', icon: '🛡️', branchId: 'eng_exo', row: 1, maxRank: 5, desc: 'Максимальное HP.', per: r => `+${r * 10}% HP` },
      { id: 'eg_e3', name: 'Рефлектор Лазера', icon: '🪞', branchId: 'eng_exo', row: 2, maxRank: 5, desc: 'Отражение урона.', per: r => `+${r * 5}% отражения` },
      { id: 'eg_e4', name: 'Двигатель Охлаждения', icon: '⏱️', branchId: 'eng_exo', row: 3, maxRank: 5, desc: 'Снижает кулдауны.', per: r => `-${r * 4}% кулдауны` },
      { id: 'eg_e5', name: 'Кибернетический Бог', icon: '🤖', branchId: 'eng_exo', row: 4, maxRank: 3, desc: 'Все характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'eng_turret', name: 'Авто-Турель', icon: '⚙️', unlockLevel: 1, maxRank: 10, manaCost: 15, cooldown: 5, desc: 'Устанавливает пулеметную турель.', color: '#06b6d4' },
      { id: 'eng_grenade', name: 'Осколочная Граната', icon: '💣', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 7, desc: 'Взрывает цель фугасным зарядом.', color: '#f97316' },
      { id: 'eng_shield', name: 'Силовой Барьер', icon: '🛡️', unlockLevel: 8, maxRank: 10, manaCost: 25, cooldown: 12, desc: 'Поглощает входящий урон силовым полем.', color: '#3b82f6' },
      { id: 'eng_orbital_laser', name: 'Орбитальный Лучи', icon: '🛰️', unlockLevel: 15, maxRank: 10, manaCost: 40, cooldown: 16, desc: 'Лазер со спутника выжигает врага.', color: '#facc15' },
    ],
  },

  // 10. ZEN MONK
  {
    id: 'monk',
    name: 'Монах',
    title: 'Монах Дзен',
    icon: '☯️',
    color: '#ec4899',
    desc: 'Мастер кулачного боя, Чакры и мгновенного уклонения.',
    lore: 'Монах провел жизнь в горном монастыре Небесного Пика. Сочетая энергию Ци с отточенными ударами, он сокрушает любого врага.',
    baseStats: { str: 7, agi: 10, vit: 7, int: 5, end: 7, luk: 6, wis: 8, per: 8, cha: 5, wil: 9 },
    starterGear: [
      { name: 'Боевые Кастеты', slot: 'weapon', rarity: 'uncommon', icon: '🥊', dmg: 20 },
      { name: 'Пояс Гармонии', slot: 'pants', rarity: 'uncommon', icon: '👖', hp: 30 },
    ],
    branches: [
      { id: 'mnk_qi',      name: 'Кулак Ци', icon: '🥊', color: '#ec4899', desc: 'Удары кулаками, скорость и пробитие.' },
      { id: 'mnk_harmony', name: 'Гармония', icon: '☯️', color: '#10b981', desc: 'Регенерация HP, уклонение и защита.' },
      { id: 'mnk_chakra',  name: 'Чакра', icon: '✨', color: '#a855f7', desc: 'Энергетические вспышки и криты.' },
    ],
    talents: [
      { id: 'm_q1', name: 'Удар Стальной Помехи', icon: '🥊', branchId: 'mnk_qi', row: 0, maxRank: 5, desc: 'Базовый урон.', per: r => `+${r * 10}% урона` },
      { id: 'm_q2', name: 'Шквал 100 Кулаков', icon: '⚡', branchId: 'mnk_qi', row: 1, maxRank: 5, desc: 'Скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'm_q3', name: 'Разрушитель Дыхания', icon: '💥', branchId: 'mnk_qi', row: 2, maxRank: 5, desc: 'Пробитие брони.', per: r => `+${r * 4}% пробития` },
      { id: 'm_q4', name: 'Убийца Демонов', icon: '👑', branchId: 'mnk_qi', row: 3, maxRank: 5, desc: 'Урон по боссам.', per: r => `+${r * 15}% по боссам` },
      { id: 'm_q5', name: 'Гранд-Мастер Ци', icon: '👑', branchId: 'mnk_qi', row: 4, maxRank: 3, desc: 'Ловкость и Сила.', per: r => `+${r * 6} AGI & +${r * 5} STR` },

      { id: 'm_h1', name: 'Дзен Регенерация', icon: '☯️', branchId: 'mnk_harmony', row: 0, maxRank: 5, desc: 'Регенерация HP.', per: r => `+${r * 15}% реген HP` },
      { id: 'm_h2', name: 'Танец Веера', icon: '💨', branchId: 'mnk_harmony', row: 1, maxRank: 5, desc: 'Уклонение.', per: r => `+${r * 2}% уклонения` },
      { id: 'm_h3', name: 'Железное Тело', icon: '🛡️', branchId: 'mnk_harmony', row: 2, maxRank: 5, desc: 'Броня.', per: r => `+${r * 10}% брони` },
      { id: 'm_h4', name: 'Умиротворение', icon: '🧘', branchId: 'mnk_harmony', row: 3, maxRank: 5, desc: 'Уменьшение урона.', per: r => `-${r * 2}% урона` },
      { id: 'm_h5', name: 'Будда Бездны', icon: '☸️', branchId: 'mnk_harmony', row: 4, maxRank: 3, desc: 'Воля и Выносливость.', per: r => `+${r * 6} WIL & +${r * 5} END` },

      { id: 'm_c1', name: 'Точка Чакры', icon: '✨', branchId: 'mnk_chakra', row: 0, maxRank: 5, desc: 'Шанс крита.', per: r => `+${r * 2.5}% крита` },
      { id: 'm_c2', name: 'Высвобождение Маны', icon: '🔮', branchId: 'mnk_chakra', row: 1, maxRank: 5, desc: 'Реген маны.', per: r => `+${r * 15}% реген маны` },
      { id: 'm_c3', name: 'Золотая Мала', icon: '💰', branchId: 'mnk_chakra', row: 2, maxRank: 5, desc: 'Бонус золота.', per: r => `+${r * 15}% золота` },
      { id: 'm_c4', name: 'Паломник', icon: '📈', branchId: 'mnk_chakra', row: 3, maxRank: 5, desc: 'Бонус XP.', per: r => `+${r * 12}% XP` },
      { id: 'm_c5', name: 'Просветленный', icon: '🌟', branchId: 'mnk_chakra', row: 4, maxRank: 3, desc: 'Все характеристики.', per: r => `+${r * 4} всем статам` },
    ],
    skills: [
      { id: 'mnk_flurry', name: 'Серия Ударов', icon: '🥊', unlockLevel: 1, maxRank: 10, manaCost: 14, cooldown: 4, desc: 'Молниеносная серия ударов кулаками.', color: '#ec4899' },
      { id: 'mnk_chi_wave', name: 'Волна Ци', icon: '☯️', unlockLevel: 3, maxRank: 10, manaCost: 20, cooldown: 7, desc: 'Энергетическая волна исцеляет и ранит.', color: '#10b981' },
      { id: 'mnk_dragon_kick', name: 'Удар Дракона', icon: '🐉', unlockLevel: 8, maxRank: 10, manaCost: 26, cooldown: 9, desc: 'Сокрушительный пинок с водяным драконом.', color: '#a855f7' },
      { id: 'mnk_transcendence', name: 'Трансцендентность', icon: '🌟', unlockLevel: 15, maxRank: 10, manaCost: 38, cooldown: 15, desc: 'Входит в режим чакры с уклонением и огромным уроном.', color: '#facc15' },
    ],
  },
];

export const getClassById = (id: string): HeroClassDef => {
  return HERO_CLASSES.find(c => c.id === id) || HERO_CLASSES[0];
};
