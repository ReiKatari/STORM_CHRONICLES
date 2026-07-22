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
      { id: 'pal_holy', name: 'Святость', icon: '✨', color: '#facc15', desc: 'Усиление исцеления, маны и выживаемости.' },
      { id: 'pal_prot', name: 'Защита', icon: '🛡️', color: '#38bdf8', desc: 'Максимальная броня, блокирование и выносливость.' },
      { id: 'pal_ret',  name: 'Возмездие', icon: '⚡', color: '#ef4444', desc: 'Критический урон светлым молотом и кара.' },
    ],
    talents: [
      { id: 'p_h1', name: 'Благодать Святости', icon: '✨', branchId: 'pal_holy', row: 0, maxRank: 5, desc: 'Увеличивает регенерацию HP.', per: r => `+${r * 15}% к регенерации` },
      { id: 'p_h2', name: 'Аура Света', icon: '🌟', branchId: 'pal_holy', row: 1, maxRank: 5, desc: 'Увеличивает максимальное здоровье.', per: r => `+${r * 8}% HP` },
      { id: 'p_p1', name: 'Бастион Ордена', icon: '🛡️', branchId: 'pal_prot', row: 0, maxRank: 5, desc: 'Повышает броню воина.', per: r => `+${r * 12}% к броне` },
      { id: 'p_p2', name: 'Несокрушимость', icon: '🗿', branchId: 'pal_prot', row: 1, maxRank: 5, desc: 'Увеличивает выносливость.', per: r => `+${r * 4} к Выносливости` },
      { id: 'p_r1', name: 'Священный Молот', icon: '🔨', branchId: 'pal_ret', row: 0, maxRank: 5, desc: 'Увеличивает физический и светлый урон.', per: r => `+${r * 7}% к урону` },
      { id: 'p_r2', name: 'Карающий Свет', icon: '💥', branchId: 'pal_ret', row: 1, maxRank: 5, desc: 'Повышает шанс крита.', per: r => `+${r * 3}% к криту` },
    ],
    skills: [
      { id: 'pal_heal', name: 'Священное Исцеление', icon: '✨', unlockLevel: 1, maxRank: 5, manaCost: 20, cooldown: 12, desc: 'Восстанавливает 35% макс. HP.', color: '#facc15' },
      { id: 'pal_smite', name: 'Карающий Удар', icon: '🔨', unlockLevel: 3, maxRank: 5, manaCost: 15, cooldown: 6, desc: 'Наносит 250% урона святым пламенем.', color: '#fbbf24' },
      { id: 'pal_shield', name: 'Щит Заступника', icon: '🛡️', unlockLevel: 6, maxRank: 5, manaCost: 25, cooldown: 15, desc: 'Повышает броню на +80% на 8с.', color: '#38bdf8' },
      { id: 'pal_wrath', name: 'Гнев Небес', icon: '⚡', unlockLevel: 10, maxRank: 5, manaCost: 40, cooldown: 20, desc: 'Призывает луч света: 500% урона.', color: '#ef4444' },
    ],
  },

  // 2. NECROMANCER
  {
    id: 'necromancer',
    name: 'Некромант',
    title: 'Тёмный Повелитель Смерти',
    icon: '💀',
    color: '#c084fc',
    desc: 'Владыка чумы, костяных чар и иссушения. Призывает армии мертвецов и высасывает жизни.',
    lore: 'Изучив запретные фолианты Забытого Катакомбного Ордена, Некромант подчинил саму смерть. Он считает разложение лишь естественным продолжением бытия, а врагов — ценным материалом для своих ритуалов.',
    baseStats: { str: 3, agi: 5, vit: 6, int: 10, end: 5, luk: 5, wis: 9, per: 7, cha: 3, wil: 9 },
    starterGear: [
      { name: 'Посох Костей', slot: 'weapon', rarity: 'uncommon', icon: '🪄', dmg: 18 },
      { name: 'Амулет Праха', slot: 'amulet', rarity: 'uncommon', icon: '🔮', hp: 30 },
    ],
    branches: [
      { id: 'nec_bone',  name: 'Кости', icon: '🦴', color: '#e2e8f0', desc: 'Костяные копья, щиты и размозжение.' },
      { id: 'nec_plague', name: 'Чума', icon: '☣️', color: '#a3e635', desc: 'Ядовитые DoT-урон и истощение врагов.' },
      { id: 'nec_souls',  name: 'Души', icon: '🔮', color: '#c084fc', desc: 'Поглощение душ, вампиризм маны и сила.' },
    ],
    talents: [
      { id: 'n_b1', name: 'Костяная Броня', icon: '🦴', branchId: 'nec_bone', row: 0, maxRank: 5, desc: 'Повышает броню.', per: r => `+${r * 10}% к броне` },
      { id: 'n_b2', name: 'Острые Осколки', icon: '🗡️', branchId: 'nec_bone', row: 1, maxRank: 5, desc: 'Повышает крит урон.', per: r => `+${r * 15}% к крит урону` },
      { id: 'n_p1', name: 'Гниение Плоти', icon: '☣️', branchId: 'nec_plague', row: 0, maxRank: 5, desc: 'Увеличивает периодический урон.', per: r => `+${r * 12}% к ядам` },
      { id: 'n_p2', name: 'Ядовитый Туман', icon: '🌫️', branchId: 'nec_plague', row: 1, maxRank: 5, desc: 'Шанс отравления атакой.', per: r => `+${r * 5}% отравление` },
      { id: 'n_s1', name: 'Жатва Душ', icon: '🔮', branchId: 'nec_souls', row: 0, maxRank: 5, desc: 'Восстанавливает HP за убийство.', per: r => `+${r * 4}% HP за убийство` },
      { id: 'n_s2', name: 'Власть Над Смертью', icon: '💀', branchId: 'nec_souls', row: 1, maxRank: 5, desc: 'Повышает макc. ману.', per: r => `+${r * 10}% маны` },
    ],
    skills: [
      { id: 'nec_spear', name: 'Костяное Копьё', icon: '🦴', unlockLevel: 1, maxRank: 5, manaCost: 15, cooldown: 5, desc: 'Пробивает врага на 220% урона.', color: '#e2e8f0' },
      { id: 'nec_plague', name: 'Вспышка Чумы', icon: '☣️', unlockLevel: 3, maxRank: 5, manaCost: 20, cooldown: 8, desc: 'Отравляет врага на 300% DoT-урона.', color: '#84cc16' },
      { id: 'nec_drain', name: 'Иссушение Души', icon: '🔮', unlockLevel: 6, maxRank: 5, manaCost: 25, cooldown: 12, desc: 'Высасывает 25% HP врага.', color: '#a855f7' },
      { id: 'nec_army', name: 'Восстание Мертвых', icon: '💀', unlockLevel: 10, maxRank: 5, manaCost: 45, cooldown: 22, desc: 'Призывает орду скелетов: 550% урона.', color: '#9333ea' },
    ],
  },

  // 3. ARCHMAGE
  {
    id: 'archmage',
    name: 'Архимаг',
    title: 'Астральный Повелитель Стихий',
    icon: '🔮',
    color: '#38bdf8',
    desc: 'Мастер арканной магии, огненных метеоров и ледяных заклятий. Наносит колоссальный урон по площади.',
    lore: 'Окончив Высшую Академию Кирин-Тора, Архимаг постиг законы пересечения стихийных планов. В его руках огонь не просто жжет — он аннигилирует материю.',
    baseStats: { str: 2, agi: 5, vit: 4, int: 12, end: 4, luk: 6, wis: 10, per: 8, cha: 5, wil: 8 },
    starterGear: [
      { name: 'Жезл Стихий', slot: 'weapon', rarity: 'uncommon', icon: '🪄', dmg: 20 },
      { name: 'Мантия Звёзд', slot: 'armor', rarity: 'uncommon', icon: '🥋', armor: 6, hp: 25 },
    ],
    branches: [
      { id: 'mag_fire',  name: 'Пламя', icon: '🔥', color: '#f97316', desc: 'Огненные вспышки и метеоритные дожди.' },
      { id: 'mag_frost', name: 'Лёд', icon: '❄️', color: '#38bdf8', desc: 'Заморозка, ледяные шипы и щит.' },
      { id: 'mag_storm', name: 'Буря', icon: '⚡', color: '#facc15', desc: 'Молнии, ускорение каста и астрал.' },
    ],
    talents: [
      { id: 'm_f1', name: 'Огненное Сердце', icon: '🔥', branchId: 'mag_fire', row: 0, maxRank: 5, desc: 'Увеличивает магический урон.', per: r => `+${r * 8}% магического урона` },
      { id: 'm_f2', name: 'Возгорание', icon: '💥', branchId: 'mag_fire', row: 1, maxRank: 5, desc: 'Шанс критического заклинания.', per: r => `+${r * 4}% к криту` },
      { id: 'm_fr1', name: 'Ледяная Броня', icon: '❄️', branchId: 'mag_frost', row: 0, maxRank: 5, desc: 'Повышает защиту.', per: r => `+${r * 10}% к броне` },
      { id: 'm_fr2', name: 'Глубокая Заморозка', icon: '🧊', branchId: 'mag_frost', row: 1, maxRank: 5, desc: 'Замедляет монстров.', per: r => `+${r * 6}% замедления` },
      { id: 'm_st1', name: 'Цепная Молния', icon: '⚡', branchId: 'mag_storm', row: 0, maxRank: 5, desc: 'Снижает перезарядку скиллов.', per: r => `-${r * 4}% перезарядки` },
      { id: 'm_st2', name: 'Астральный Поток', icon: '🔮', branchId: 'mag_storm', row: 1, maxRank: 5, desc: 'Увеличивает макс. ману.', per: r => `+${r * 12}% маны` },
    ],
    skills: [
      { id: 'mag_fireball', name: 'Огненный Шарик', icon: '🔥', unlockLevel: 1, maxRank: 5, manaCost: 15, cooldown: 4, desc: 'Взрывает врага на 200% огненного урона.', color: '#f97316' },
      { id: 'mag_nova', name: 'Ледяное Кольцо', icon: '❄️', unlockLevel: 3, maxRank: 5, manaCost: 20, cooldown: 8, desc: 'Замораживает и наносит 180% урона.', color: '#38bdf8' },
      { id: 'mag_lightning', name: 'Грозовой Разряд', icon: '⚡', unlockLevel: 6, maxRank: 5, manaCost: 30, cooldown: 10, desc: 'Прозаическая молния: 350% урона.', color: '#facc15' },
      { id: 'mag_meteor', name: 'Метеоритный Дождь', icon: '☄️', unlockLevel: 10, maxRank: 5, manaCost: 50, cooldown: 24, desc: 'Падение армагеддона: 600% урона.', color: '#ef4444' },
    ],
  },

  // 4. ASSASSIN
  {
    id: 'assassin',
    name: 'Ассасин',
    title: 'Теневой Убийца Клинка',
    icon: '🗡️',
    color: '#a855f7',
    desc: 'Быстрый мастер ядов, мгновенных телепортов и критических ударов со спины.',
    lore: 'Обученный гильдией Ночных Теньей, Ассасин не знает жалости. Для него танцы клинков — это изящное искусство, где финальным аккордом всегда становится капля яда в артерии.',
    baseStats: { str: 4, agi: 12, vit: 5, int: 4, end: 4, luk: 9, wis: 4, per: 10, cha: 4, wil: 6 },
    starterGear: [
      { name: 'Кинжал Тени', slot: 'weapon', rarity: 'uncommon', icon: '🗡️', dmg: 15 },
      { name: 'Маска Ночи', slot: 'helmet', rarity: 'uncommon', icon: '🧢', armor: 4, hp: 20 },
    ],
    branches: [
      { id: 'ass_poison', name: 'Яды', icon: '🧪', color: '#22c55e', desc: 'Смертоносные яды и смертоносная синтетика.' },
      { id: 'ass_shadow', name: 'Тень', icon: '👤', color: '#a855f7', desc: 'Уворот, невидимость и скорость атаки.' },
      { id: 'ass_crit',   name: 'Криты', icon: '💥', color: '#ef4444', desc: 'Колоссальный шанс и урон критических ударов.' },
    ],
    talents: [
      { id: 'a_p1', name: 'Ядовитые Клинки', icon: '🧪', branchId: 'ass_poison', row: 0, maxRank: 5, desc: 'Повышает урон ядами.', per: r => `+${r * 15}% урона ядом` },
      { id: 'a_p2', name: 'Смертельный Сок', icon: '🐍', branchId: 'ass_poison', row: 1, maxRank: 5, desc: 'Шанс отравления атакой.', per: r => `+${r * 5}% к отравлению` },
      { id: 'a_s1', name: 'Теневой Шаг', icon: '👤', branchId: 'ass_shadow', row: 0, maxRank: 5, desc: 'Повышает уворот.', per: r => `+${r * 2}% уворота` },
      { id: 'a_s2', name: 'Скорость Тени', icon: '⚡', branchId: 'ass_shadow', row: 1, maxRank: 5, desc: 'Повышает скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'a_c1', name: 'Анатомия Смерти', icon: '🎯', branchId: 'ass_crit', row: 0, maxRank: 5, desc: 'Увеличивает шанс крита.', per: r => `+${r * 3}% к криту` },
      { id: 'a_c2', name: 'Внезапный Удар', icon: '💥', branchId: 'ass_crit', row: 1, maxRank: 5, desc: 'Повышает крит урон.', per: r => `+${r * 20}% к крит урону` },
    ],
    skills: [
      { id: 'ass_stab', name: 'Удар Со Спины', icon: '🗡️', unlockLevel: 1, maxRank: 5, manaCost: 10, cooldown: 4, desc: 'Наносит 240% урона клинком.', color: '#a855f7' },
      { id: 'ass_poison', name: 'Отравленный Клинок', icon: '🧪', unlockLevel: 3, maxRank: 5, manaCost: 15, cooldown: 7, desc: 'Отравляет врага на 280% DoT урона.', color: '#22c55e' },
      { id: 'ass_vanish', name: 'Исчезновение в Тень', icon: '👤', unlockLevel: 6, maxRank: 5, manaCost: 20, cooldown: 12, desc: 'Гарантирует 100% уворот на 5с.', color: '#6b21a8' },
      { id: 'ass_dance', name: 'Танец Смерти', icon: '💥', unlockLevel: 10, maxRank: 5, manaCost: 35, cooldown: 18, desc: 'Серия из 6 молниеносных ударов (600%).', color: '#ef4444' },
    ],
  },

  // 5. BERSERKER
  {
    id: 'berserker',
    name: 'Берсерк',
    title: 'Яростный Воин Бездны',
    icon: '🪓',
    color: '#ef4444',
    desc: 'Дикий разрушитель с двуручным топором. Чем меньше его HP, тем больше выбивает урона!',
    lore: 'Выходец из северных Кровавых Крейд, Берсерк не чувствует боли. В порыве боевого транса его глаза наливаются алой яростью, а каждый взмах топором раскалывает скалы.',
    baseStats: { str: 12, agi: 6, vit: 9, int: 2, end: 7, luk: 5, wis: 3, per: 4, cha: 3, wil: 11 },
    starterGear: [
      { name: 'Топор Ярости', slot: 'weapon', rarity: 'uncommon', icon: '🪓', dmg: 22 },
      { name: 'Кожаный Кушак', slot: 'armor', rarity: 'uncommon', icon: '🎽', armor: 6, hp: 35 },
    ],
    branches: [
      { id: 'ber_rage',  name: 'Ярость', icon: '🔥', color: '#f97316', desc: 'Максимальный урон при низком здоровье.' },
      { id: 'ber_blood', name: 'Кровь', icon: '🩸', color: '#dc2626', desc: 'Вампиризм и поглощение урона.' },
      { id: 'ber_smash', name: 'Разрушение', icon: '💥', color: '#b45309', desc: 'Раскалывание брони и оглушающие удары.' },
    ],
    talents: [
      { id: 'b_r1', name: 'Кипящая Кровь', icon: '🔥', branchId: 'ber_rage', row: 0, maxRank: 5, desc: 'Увеличивает физический урон.', per: r => `+${r * 8}% к урону` },
      { id: 'b_r2', name: 'Транс Ярости', icon: '😡', branchId: 'ber_rage', row: 1, maxRank: 5, desc: 'Повышает скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'b_b1', name: 'Жажда Крови', icon: '🩸', branchId: 'ber_blood', row: 0, maxRank: 5, desc: 'Дарует вампиризм.', per: r => `+${r * 2}% вампиризма` },
      { id: 'b_b2', name: 'Нечувствительность', icon: '🛡️', branchId: 'ber_blood', row: 1, maxRank: 5, desc: 'Увеличивает здоровье.', per: r => `+${r * 10}% HP` },
      { id: 'b_s1', name: 'Раскол Брони', icon: '💥', branchId: 'ber_smash', row: 0, maxRank: 5, desc: 'Пробивает броню монстров.', per: r => `+${r * 6}% пробития` },
      { id: 'b_s2', name: 'Безумный Размах', icon: '🪓', branchId: 'ber_smash', row: 1, maxRank: 5, desc: 'Повышает шанс крита.', per: r => `+${r * 3}% к криту` },
    ],
    skills: [
      { id: 'ber_cleave', name: 'Рассекающий Взмах', icon: '🪓', unlockLevel: 1, maxRank: 5, manaCost: 10, cooldown: 4, desc: 'Мощный удар топором на 220% урона.', color: '#ef4444' },
      { id: 'ber_roar', name: 'Боевой Клич', icon: '🗣️', unlockLevel: 3, maxRank: 5, manaCost: 15, cooldown: 10, desc: 'Увеличивает урон на +40% на 8с.', color: '#f97316' },
      { id: 'ber_execute', name: 'Казнь', icon: '🩸', unlockLevel: 6, maxRank: 5, manaCost: 20, cooldown: 12, desc: 'Наносит 400% урона ослабленным врагам.', color: '#dc2626' },
      { id: 'ber_frenzy', name: 'Абсолютная Безумность', icon: '🔥', unlockLevel: 10, maxRank: 5, manaCost: 30, cooldown: 20, desc: '+100% к скорости и +50% к криту на 10с.', color: '#991b1b' },
    ],
  },

  // 6. RANGER
  {
    id: 'ranger',
    name: 'Следопыт',
    title: 'Охотник Диких Лесов',
    icon: '🏹',
    color: '#84cc16',
    desc: 'Мастер дальнего боя с луком, верным зверем-соратником и смертельными ловушками.',
    lore: 'Страж изумрудных чащоб, Следопыт чувствует дыхание лесов за сотни миль. Его стрелы не ведают промаха, а верный прирученный звериный дух всегда прикроет спину.',
    baseStats: { str: 5, agi: 11, vit: 6, int: 4, end: 5, luk: 8, wis: 5, per: 9, cha: 5, wil: 6 },
    starterGear: [
      { name: 'Длинный Лук', slot: 'weapon', rarity: 'uncommon', icon: '🏹', dmg: 17 },
      { name: 'Сапоги Ветра', slot: 'boots', rarity: 'uncommon', icon: '🥾', armor: 4, hp: 15 },
    ],
    branches: [
      { id: 'ran_mark',  name: 'Стрельба', icon: '🏹', color: '#84cc16', desc: 'Меткие выстрелы, пробитие и прицел.' },
      { id: 'ran_beast', name: 'Звери', icon: '🐺', color: '#eab308', desc: 'Соратник-волк и усиления зверя.' },
      { id: 'ran_trap',  name: 'Ловушки', icon: '💣', color: '#f97316', desc: 'Взрывные и ядовитые капканы.' },
    ],
    talents: [
      { id: 'r_m1', name: 'Меткий Глаз', icon: '🎯', branchId: 'ran_mark', row: 0, maxRank: 5, desc: 'Повышает дальний урон.', per: r => `+${r * 7}% к урону` },
      { id: 'r_m2', name: 'Снайперский Прицел', icon: '💥', branchId: 'ran_mark', row: 1, maxRank: 5, desc: 'Повышает шанс крита.', per: r => `+${r * 3.5}% к криту` },
      { id: 'r_b1', name: 'Звериная Чуйка', icon: '🐺', branchId: 'ran_beast', row: 0, maxRank: 5, desc: 'Повышает скорость атаки.', per: r => `+${r * 5}% скорости` },
      { id: 'r_b2', name: 'Единение с Природой', icon: '🌿', branchId: 'ran_beast', row: 1, maxRank: 5, desc: 'Увеличивает здоровье.', per: r => `+${r * 8}% HP` },
      { id: 'r_t1', name: 'Закаленный Капкан', icon: '💣', branchId: 'ran_trap', row: 0, maxRank: 5, desc: 'Увеличивает урон ловушек.', per: r => `+${r * 12}% урона ловушек` },
      { id: 'r_t2', name: 'Отрада Следопыта', icon: '💰', branchId: 'ran_trap', row: 1, maxRank: 5, desc: 'Повышает выпадение лута.', per: r => `+${r * 6}% лута` },
    ],
    skills: [
      { id: 'ran_shot', name: 'Меткий Выстрел', icon: '🏹', unlockLevel: 1, maxRank: 5, manaCost: 10, cooldown: 4, desc: 'Стрела наносит 210% урона.', color: '#84cc16' },
      { id: 'ran_trap', name: 'Взрывная Ловушка', icon: '💣', unlockLevel: 3, maxRank: 5, manaCost: 15, cooldown: 8, desc: 'Взрывает врага на 260% урона.', color: '#f97316' },
      { id: 'ran_wolf', name: 'Призыв Волка', icon: '🐺', unlockLevel: 6, maxRank: 5, manaCost: 25, cooldown: 15, desc: 'Призывает соратника: +30% урона на 12с.', color: '#eab308' },
      { id: 'ran_arrow_storm', name: 'Град Стрел', icon: '🌧️', unlockLevel: 10, maxRank: 5, manaCost: 40, cooldown: 20, desc: 'Шторм из 100 стрел: 520% урона.', color: '#15803d' },
    ],
  },

  // 7. DRUID
  {
    id: 'druid',
    name: 'Друид',
    title: 'Хранитель Первозданной Природы',
    icon: '🌿',
    color: '#10b981',
    desc: 'Оборотень, способный превращаться в Древнего Медведя или призывать гнев стихий.',
    lore: 'Оберегая святилища Иггдрасиля от порчи Бездны, Друид слился воедино с флорой и фауной. В его жилах течет сок древних деревьев, а в глазах горит пламя дикого зверинца.',
    baseStats: { str: 7, agi: 7, vit: 8, int: 7, end: 7, luk: 5, wis: 8, per: 6, cha: 4, wil: 8 },
    starterGear: [
      { name: 'Посох Природы', slot: 'weapon', rarity: 'uncommon', icon: '🪄', dmg: 16 },
      { name: 'Наплечники Лозы', slot: 'shoulders', rarity: 'uncommon', icon: '🎽', armor: 5, hp: 25 },
    ],
    branches: [
      { id: 'dru_bear',  name: 'Форма Медведя', icon: '🐻', color: '#92400e', desc: 'Танкование, гигантский HP и броня.' },
      { id: 'dru_cat',   name: 'Форма Пантеры', icon: '🐾', color: '#eab308', desc: 'Скорость атаки и растерзание.' },
      { id: 'dru_storm', name: 'Стихия Природы', icon: '🌿', color: '#10b981', desc: 'Исцеление лозой и ураганы.' },
    ],
    talents: [
      { id: 'd_b1', name: 'Медвежья Шкура', icon: '🐻', branchId: 'dru_bear', row: 0, maxRank: 5, desc: 'Повышает здоровье и броню.', per: r => `+${r * 10}% HP и Брони` },
      { id: 'd_b2', name: 'Дубрава', icon: '🪵', branchId: 'dru_bear', row: 1, maxRank: 5, desc: 'Повышает выносливость.', per: r => `+${r * 4} к Выносливости` },
      { id: 'd_c1', name: 'Когти Кошки', icon: '🐾', branchId: 'dru_cat', row: 0, maxRank: 5, desc: 'Повышает скорость атаки.', per: r => `+${r * 6}% скорости` },
      { id: 'd_c2', name: 'Рваные Раны', icon: '🩸', branchId: 'dru_cat', row: 1, maxRank: 5, desc: 'Повышает шанс крита.', per: r => `+${r * 3}% к криту` },
      { id: 'd_s1', name: 'Древесный Сок', icon: '🧪', branchId: 'dru_storm', row: 0, maxRank: 5, desc: 'Повышает регенерацию HP.', per: r => `+${r * 12}% регенерации` },
      { id: 'd_s2', name: 'Гнев Леса', icon: '⚡', branchId: 'dru_storm', row: 1, maxRank: 5, desc: 'Повышает урон скиллов.', per: r => `+${r * 8}% урона` },
    ],
    skills: [
      { id: 'dru_wrath', name: 'Гнев Природы', icon: '🌿', unlockLevel: 1, maxRank: 5, manaCost: 12, cooldown: 5, desc: 'Наносит 200% природного урона.', color: '#10b981' },
      { id: 'dru_rejuvenation', name: 'Омоложение', icon: '🧪', unlockLevel: 3, maxRank: 5, manaCost: 20, cooldown: 10, desc: 'Исцеляет 30% HP за 6 секунд.', color: '#4ade80' },
      { id: 'dru_bear_form', name: 'Облик Медведя', icon: '🐻', unlockLevel: 6, maxRank: 5, manaCost: 25, cooldown: 15, desc: '+50% к HP и +40% к броне на 12с.', color: '#92400e' },
      { id: 'dru_hurricane', name: 'Ураган Смерча', icon: '🌪️', unlockLevel: 10, maxRank: 5, manaCost: 45, cooldown: 22, desc: 'Ураган разрывает врагов на 500% урона.', color: '#06b6d4' },
    ],
  },

  // 8. BLOOD MAGE
  {
    id: 'blood_mage',
    name: 'Маг Крови',
    title: 'Адепт Алого Искусства',
    icon: '🩸',
    color: '#dc2626',
    desc: 'Заклинатель, использующий собственное Здоровье в качестве топлива для чудовищных заклинаний.',
    lore: 'Изгнанный из всех маговских академий за запретные ритуалы, Маг Крови понял: мана лимитирована, но кровь живых не иссякает никогда. Он превращает поле боя в алый океан.',
    baseStats: { str: 4, agi: 5, vit: 10, int: 9, end: 6, luk: 5, wis: 6, per: 6, cha: 4, wil: 10 },
    starterGear: [
      { name: 'Кровавый Скипетр', slot: 'weapon', rarity: 'uncommon', icon: '🪄', dmg: 19 },
      { name: 'Алая Мантия', slot: 'armor', rarity: 'uncommon', icon: '🥋', armor: 5, hp: 40 },
    ],
    branches: [
      { id: 'bm_hemomancy', name: 'Гемомантия', icon: '🩸', color: '#dc2626', desc: 'Урон алой магией и кровь врагов.' },
      { id: 'bm_sacrifice', name: 'Жертва', icon: '🥩', color: '#991b1b', desc: 'Преобразование HP в колоссальный урон.' },
      { id: 'bm_pact',      name: 'Тёмный Пакет', icon: '🍷', color: '#9333ea', desc: 'Регенерация, вампиризм и стойкость.' },
    ],
    talents: [
      { id: 'bm_h1', name: 'Алая Аура', icon: '🩸', branchId: 'bm_hemomancy', row: 0, maxRank: 5, desc: 'Увеличивает урон заклинаний.', per: r => `+${r * 9}% урона` },
      { id: 'bm_h2', name: 'Кровавые Руны', icon: '📜', branchId: 'bm_hemomancy', row: 1, maxRank: 5, desc: 'Повышает крит урон.', per: r => `+${r * 15}% к крит урону` },
      { id: 'bm_s1', name: 'Жертвенный Ритуал', icon: '🔪', branchId: 'bm_sacrifice', row: 0, maxRank: 5, desc: 'Повышает силу при низком HP.', per: r => `+${r * 10}% урона при низком HP` },
      { id: 'bm_s2', name: 'Плотская Мощь', icon: '❤️', branchId: 'bm_sacrifice', row: 1, maxRank: 5, desc: 'Увеличивает макс. HP.', per: r => `+${r * 10}% HP` },
      { id: 'bm_p1', name: 'Гемоглобин', icon: '🍷', branchId: 'bm_pact', row: 0, maxRank: 5, desc: 'Увеличивает вампиризм.', per: r => `+${r * 2.5}% вампиризма` },
      { id: 'bm_p2', name: 'Алый Заслон', icon: '🛡️', branchId: 'bm_pact', row: 1, maxRank: 5, desc: 'Повышает броню.', per: r => `+${r * 8}% к броне` },
    ],
    skills: [
      { id: 'bm_bolt', name: 'Сгусток Крови', icon: '🩸', unlockLevel: 1, maxRank: 5, manaCost: 10, cooldown: 4, desc: 'Наносит 220% урона (раходует 5% HP).', color: '#dc2626' },
      { id: 'bm_drain', name: 'Кровавое Высасывание', icon: '🍷', unlockLevel: 3, maxRank: 5, manaCost: 15, cooldown: 7, desc: 'Наносит 250% урона и лечит 20% HP.', color: '#b91c1c' },
      { id: 'bm_shield', name: 'Алый Бастион', icon: '🛡️', unlockLevel: 6, maxRank: 5, manaCost: 20, cooldown: 12, desc: 'Преобразует 20% HP в щит урона.', color: '#991b1b' },
      { id: 'bm_cataclysm', name: 'Кровавый Катаклизм', icon: '🌋', unlockLevel: 10, maxRank: 5, manaCost: 35, cooldown: 20, desc: 'Алый взрыв: 580% урона всему полю.', color: '#7f1d1d' },
    ],
  },

  // 9. ENGINEER
  {
    id: 'engineer',
    name: 'Инженер',
    title: 'Техномаг и Мастер Механизмов',
    icon: '⚙️',
    color: '#f59e0b',
    desc: 'Создатель автоматических турелей, взрывчатки и экзоскелета. Использует технологии во благо битвы.',
    lore: 'Выпускник Технократического Гильдейского Союза Подземного Города, Инженер полагается не на магию, а на точный расчет, шестеренки и пороховой заряд.',
    baseStats: { str: 6, agi: 8, vit: 6, int: 8, end: 7, luk: 7, wis: 5, per: 8, cha: 4, wil: 6 },
    starterGear: [
      { name: 'Пороховой Арбалет', slot: 'weapon', rarity: 'uncommon', icon: '🏹', dmg: 18 },
      { name: 'Шлем Инженера', slot: 'helmet', rarity: 'uncommon', icon: '🪖', armor: 6, hp: 20 },
    ],
    branches: [
      { id: 'eng_turret',  name: 'Турели', icon: '⚙️', color: '#f59e0b', desc: 'Автоматические боевые орудия.' },
      { id: 'eng_bombs',   name: 'Взрывчатка', icon: '💣', color: '#ef4444', desc: 'Гранаты, динамит и детонация.' },
      { id: 'eng_exo',     name: 'Экзоскелет', icon: '🤖', color: '#64748b', desc: 'Титановый панцирь и усилители.' },
    ],
    talents: [
      { id: 'e_t1', name: 'Калибровка Стволов', icon: '⚙️', branchId: 'eng_turret', row: 0, maxRank: 5, desc: 'Повышает скорость стрельбы.', per: r => `+${r * 5}% скорости` },
      { id: 'e_t2', name: 'Авто-Прицел', icon: '🎯', branchId: 'eng_turret', row: 1, maxRank: 5, desc: 'Повышает шанс крита.', per: r => `+${r * 3}% к криту` },
      { id: 'e_b1', name: 'Обогащенный Порох', icon: '💣', branchId: 'eng_bombs', row: 0, maxRank: 5, desc: 'Повышает урон взрывов.', per: r => `+${r * 10}% урона` },
      { id: 'e_b2', name: 'Шрапнель', icon: '💥', branchId: 'eng_bombs', row: 1, maxRank: 5, desc: 'Повышает крит урон.', per: r => `+${r * 15}% к крит урону` },
      { id: 'e_e1', name: 'Титановые Брусья', icon: '🤖', branchId: 'eng_exo', row: 0, maxRank: 5, desc: 'Повышает броню.', per: r => `+${r * 10}% к броне` },
      { id: 'e_e2', name: 'Гидравлика', icon: '🦾', branchId: 'eng_exo', row: 1, maxRank: 5, desc: 'Повышает макс. HP.', per: r => `+${r * 8}% HP` },
    ],
    skills: [
      { id: 'eng_shot', name: 'Орудийный Выстрел', icon: '⚙️', unlockLevel: 1, maxRank: 5, manaCost: 10, cooldown: 4, desc: 'Выстрел патроном на 210% урона.', color: '#f59e0b' },
      { id: 'eng_grenade', name: 'Шрапнельная Граната', icon: '💣', unlockLevel: 3, maxRank: 5, manaCost: 15, cooldown: 7, desc: 'Взрыв бомбы на 270% урона.', color: '#ef4444' },
      { id: 'eng_turret_call', name: 'Установка Турели', icon: '🤖', unlockLevel: 6, maxRank: 5, manaCost: 25, cooldown: 14, desc: 'Призывает авто-турель: +35% урона на 10с.', color: '#d97706' },
      { id: 'eng_nuke', name: 'Тактический Взрыв', icon: '☢️', unlockLevel: 10, maxRank: 5, manaCost: 40, cooldown: 22, desc: 'Ядерный залп: 550% урона.', color: '#b45309' },
    ],
  },

  // 10. ZEN MONK
  {
    id: 'zen_monk',
    name: 'Монах',
    title: 'Мастер Дзен и Энергии Ци',
    icon: '🧘',
    color: '#06b6d4',
    desc: 'Боец рукопашного боя, совмещающий молниеносные удары кулаками и гармонию Ци.',
    lore: 'На вершинах Небесного Престола монахи монастыря Сумеречной Гармонии медитируют столетиями. Монах Дзен направляет внутреннюю энергию тела для раскалывания скал и мгновенного исцеления.',
    baseStats: { str: 8, agi: 9, vit: 7, int: 5, end: 7, luk: 6, wis: 8, per: 7, cha: 4, wil: 9 },
    starterGear: [
      { name: 'Кастеты Гармонии', slot: 'weapon', rarity: 'uncommon', icon: '🗡️', dmg: 17 },
      { name: 'Чётки Дзен', slot: 'earring', rarity: 'uncommon', icon: '📿', hp: 25 },
    ],
    branches: [
      { id: 'mnk_fust',    name: 'Кулак Ци', icon: '🥊', color: '#06b6d4', desc: 'Скоростные рукопашные серии.' },
      { id: 'mnk_harmony', name: 'Гармония', icon: '☯️', color: '#a855f7', desc: 'Уворот, умиротворение и медитация.' },
      { id: 'mnk_chra',    name: 'Чакра', icon: '🧘', color: '#facc15', desc: 'Регенерация HP/маны и духовный щит.' },
    ],
    talents: [
      { id: 'z_f1', name: 'Удар Потока', icon: '🥊', branchId: 'mnk_fust', row: 0, maxRank: 5, desc: 'Повышает скорость атаки.', per: r => `+${r * 6}% скорости` },
      { id: 'z_f2', name: 'Концентрация Удара', icon: '💥', branchId: 'mnk_fust', row: 1, maxRank: 5, desc: 'Повышает урон.', per: r => `+${r * 7}% к урону` },
      { id: 'z_h1', name: 'Уворот Дзен', icon: '☯️', branchId: 'mnk_harmony', row: 0, maxRank: 5, desc: 'Повышает уворот.', per: r => `+${r * 2}% уворота` },
      { id: 'z_h2', name: 'Медитативная Стойка', icon: '🧘', branchId: 'mnk_harmony', row: 1, maxRank: 5, desc: 'Повышает макс. HP.', per: r => `+${r * 8}% HP` },
      { id: 'z_c1', name: 'Пробуждение Чакр', icon: '✨', branchId: 'mnk_chra', row: 0, maxRank: 5, desc: 'Повышает регенерацию маны.', per: r => `+${r * 15}% регенерации маны` },
      { id: 'z_c2', name: 'Аура Мира', icon: '🛡️', branchId: 'mnk_chra', row: 1, maxRank: 5, desc: 'Повышает броню.', per: r => `+${r * 8}% к броне` },
    ],
    skills: [
      { id: 'mnk_punch', name: 'Удар Ци', icon: '🥊', unlockLevel: 1, maxRank: 5, manaCost: 10, cooldown: 4, desc: 'Серия ударов на 220% урона.', color: '#06b6d4' },
      { id: 'mnk_palm', name: 'Ладонь Гармонии', icon: '✋', unlockLevel: 3, maxRank: 5, manaCost: 15, cooldown: 7, desc: 'Оглушающая ладонь на 250% урона.', color: '#a855f7' },
      { id: 'mnk_meditate', name: 'Глубокая Медитация', icon: '🧘', unlockLevel: 6, maxRank: 5, manaCost: 20, cooldown: 12, desc: 'Мгновенно восстанавливает 40% HP и маны.', color: '#facc15' },
      { id: 'mnk_dragon_strike', name: 'Удар Летящего Дракона', icon: '🐉', unlockLevel: 10, maxRank: 5, manaCost: 40, cooldown: 20, desc: 'Сокрушительный прыжок дракона: 560% урона.', color: '#0891b2' },
    ],
  },
];

export function getClassById(id: string): HeroClassDef {
  return HERO_CLASSES.find(c => c.id === id) ?? HERO_CLASSES[0];
}
