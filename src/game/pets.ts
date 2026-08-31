export interface PetSkill {
  id: string;
  name: string;
  icon: string;
  desc: string;
  cooldown: number;
  damageMult?: number;
  healPct?: number;
  buffType?: string;
}

export interface PetTalentBranch {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
  talents: {
    id: string;
    name: string;
    icon: string;
    desc: string;
    maxRank: number;
    per: (rank: number) => string;
  }[];
}

export interface PetDef {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'divine';
  type: 'dragon' | 'beast' | 'demon' | 'elemental' | 'mech' | 'astral';
  desc: string;
  color: string;
  artSrc?: string;
  baseDmg: number;
  baseHp: number;
  branches: PetTalentBranch[];
  skills: PetSkill[];
}

export const PETS: PetDef[] = [
  {
    id: 'pet_dragon',
    name: 'Маленький Огненный Дракончик',
    icon: '🐉',
    rarity: 'legendary',
    type: 'dragon',
    desc: 'Дитя вулканического дракона. Дышит пламенем и усиливает силу атаки хозяина.',
    color: '#ef4444',
    artSrc: '/pets/pet_dragon.jpg',
    baseDmg: 45,
    baseHp: 300,
    branches: [
      {
        id: 'dr_fire',
        name: 'Адское Пламя',
        icon: '🔥',
        color: '#f97316',
        desc: 'Усиление огненного урона и поджог целей.',
        talents: [
          { id: 'dr_f1', name: 'Опаляющее Дыхание', icon: '🔥', desc: 'Увеличивает урон дракона.', maxRank: 5, per: r => `+${r * 15}% урона дракона` },
          { id: 'dr_f2', name: 'Пламенный Резонанс', icon: '💥', desc: 'Увеличивает урон героя.', maxRank: 5, per: r => `+${r * 6}% урона героя` },
        ],
      },
      {
        id: 'dr_scale',
        name: 'Драконья Чешуя',
        icon: '🛡️',
        color: '#facc15',
        desc: 'Защита и непробиваемый панцирь.',
        talents: [
          { id: 'dr_s1', name: 'Броня Вулкана', icon: '🛡️', desc: 'Увеличивает броню героя.', maxRank: 5, per: r => `+${r * 8}% брони` },
          { id: 'dr_s2', name: 'Сердце Огня', icon: '❤️', desc: 'Увеличивает HP героя.', maxRank: 5, per: r => `+${r * 10}% HP` },
        ],
      },
    ],
    skills: [
      { id: 'sk_drag_breath', name: 'Огненное Дыхание', icon: '🔥', desc: 'Дракон дышит пламенем, нанося 300% урона.', cooldown: 6, damageMult: 3.0 },
      { id: 'sk_drag_roar', name: 'Вулканический Рев', icon: '🌋', desc: 'Увеличивает урон героя на +25% на 6 сек.', cooldown: 12, damageMult: 1.5 },
      { id: 'sk_drag_meteor', name: 'Метеорный Дождь', icon: '☄️', desc: 'Обрушивает кометы на 450% критического урона.', cooldown: 15, damageMult: 4.5 },
    ],
  },
  {
    id: 'pet_slime',
    name: 'Маленький Изумрудный Страж',
    icon: '🗿',
    rarity: 'rare',
    type: 'elemental',
    desc: 'Милый древний големообразный спутник. Поглощает удары и исцеляет раны хозяина.',
    color: '#4ade80',
    artSrc: '/pets/pet_golem.jpg',
    baseDmg: 20,
    baseHp: 400,
    branches: [
      {
        id: 'sl_heal',
        name: 'Регенерация',
        icon: '🧪',
        color: '#4ade80',
        desc: 'Исцеляющие древние кристаллы.',
        talents: [
          { id: 'sl_h1', name: 'Изумрудный Сок', icon: '💧', desc: 'Увеличивает регенерацию HP.', maxRank: 5, per: r => `+${r * 20}% реген HP` },
        ],
      },
      {
        id: 'sl_bounce',
        name: 'Упругость',
        icon: '🫧',
        color: '#38bdf8',
        desc: 'Поглощение урона и уклонение.',
        talents: [
          { id: 'sl_b1', name: 'Пружинистый Покров', icon: '💨', desc: 'Увеличивает уклонение.', maxRank: 5, per: r => `+${r * 2}% уклонения` },
        ],
      },
    ],
    skills: [
      { id: 'sk_slime_heal', name: 'Каменный Бинт', icon: '🧪', desc: 'Восстанавливает 15% HP героя.', cooldown: 8, healPct: 0.15 },
      { id: 'sk_golem_shield', name: 'Гранитный Покров', icon: '🛡️', desc: 'Увеличивает броню героя на +30%.', cooldown: 14, healPct: 0.10 },
      { id: 'sk_golem_smash', name: 'Сейсмический Удар', icon: '💥', desc: 'Раскалывает землю на 280% урона.', cooldown: 10, damageMult: 2.8 },
    ],
  },
  {
    id: 'pet_demon',
    name: 'Теневой Демон Бездны',
    icon: '🔮',
    rarity: 'mythic',
    type: 'demon',
    desc: 'Вызванный из глубин Пропасти астральный дух. Разрывает врагов критическими атаками.',
    color: '#a855f7',
    artSrc: '/pets/pet_spirit.jpg',
    baseDmg: 70,
    baseHp: 250,
    branches: [
      {
        id: 'dm_shadow',
        name: 'Теневые Когти',
        icon: '🗡️',
        color: '#a855f7',
        desc: 'Критические разрывы и урон.',
        talents: [
          { id: 'dm_sh1', name: 'Разрыв Души', icon: '💥', desc: 'Увеличивает шанс крита героя.', maxRank: 5, per: r => `+${r * 3}% крита` },
        ],
      },
      {
        id: 'dm_curse',
        name: 'Проклятие Бездны',
        icon: '👁️',
        color: '#ec4899',
        desc: 'Снижение брони врага.',
        talents: [
          { id: 'dm_c1', name: 'Печать Мрака', icon: '📜', desc: 'Повышает золотые монеты.', maxRank: 5, per: r => `+${r * 15}% золота` },
        ],
      },
    ],
    skills: [
      { id: 'sk_demon_strike', name: 'Теневой Разлом', icon: '⚡', desc: 'Критический удар демона на 400% урона.', cooldown: 7, damageMult: 4.0 },
      { id: 'sk_demon_curse', name: 'Проклятие Бездны', icon: '👁️', desc: 'Снижает броню цели на 40%.', cooldown: 12, damageMult: 2.0 },
      { id: 'sk_demon_drain', name: 'Жатва Душ', icon: '🔮', desc: 'Поглощает 350% урона и восстанавливает Ману.', cooldown: 10, damageMult: 3.5 },
    ],
  },
  {
    id: 'pet_falcon',
    name: 'Астральный Волк',
    icon: '🐺',
    rarity: 'epic',
    type: 'astral',
    desc: 'Быстрый космический астральный волк. Разведывает сокровища и ускоряет атаки героя.',
    color: '#38bdf8',
    artSrc: '/pets/pet_wolf.jpg',
    baseDmg: 35,
    baseHp: 220,
    branches: [
      {
        id: 'fl_speed',
        name: 'Полет Ветра',
        icon: '⚡',
        color: '#38bdf8',
        desc: 'Скорость и стремительность.',
        talents: [
          { id: 'fl_sp1', name: 'Крылья Ветра', icon: '⚡', desc: 'Увеличивает скорость атаки героя.', maxRank: 5, per: r => `+${r * 5}% скорости` },
        ],
      },
      {
        id: 'fl_scout',
        name: 'Разведка',
        icon: '👁️',
        color: '#facc15',
        desc: 'Поиск лучшего лута.',
        talents: [
          { id: 'fl_sc1', name: 'Соколиный Глаз', icon: '🍀', desc: 'Увеличивает шанс дропа.', maxRank: 5, per: r => `+${r * 12}% дропа` },
        ],
      },
    ],
    skills: [
      { id: 'sk_falcon_dive', name: 'Пике Волка', icon: '🐺', desc: 'Волк пикирует на врага на 250% урона.', cooldown: 5, damageMult: 2.5 },
      { id: 'sk_wolf_howl', name: 'Астральный Вой', icon: '🌕', desc: 'Ускоряет атаки героя на +35%.', cooldown: 10, damageMult: 1.5 },
      { id: 'sk_wolf_frenzy', name: 'Звездное Неистовство', icon: '⚡', desc: 'Серия ударов на 380% урона.', cooldown: 12, damageMult: 3.8 },
    ],
  },
  {
    id: 'pet_mech_spider',
    name: 'Паровой Механический Конструкт',
    icon: '🤖',
    rarity: 'epic',
    type: 'mech',
    desc: 'Стальной автоматический робот. Стреляет лазерным лучем и защищает экраном.',
    color: '#06b6d4',
    artSrc: '/pets/pet_mech.jpg',
    baseDmg: 40,
    baseHp: 350,
    branches: [
      {
        id: 'mc_laser',
        name: 'Лазерный Заряд',
        icon: '⚙️',
        color: '#06b6d4',
        desc: 'Пробитие брони и точность.',
        talents: [
          { id: 'mc_l1', name: 'Калибровка Пушки', icon: '⚙️', desc: 'Пробитие брони врага.', maxRank: 5, per: r => `+${r * 5}% пробития` },
        ],
      },
      {
        id: 'mc_barrier',
        name: 'Силовой Экран',
        icon: '🛡️',
        color: '#3b82f6',
        desc: 'Защитные барьеры.',
        talents: [
          { id: 'mc_b1', name: 'Стальная Решетка', icon: '🛡️', desc: 'Увеличивает броню.', maxRank: 5, per: r => `+${r * 10}% брони` },
        ],
      },
    ],
    skills: [
      { id: 'sk_spider_laser', name: 'Орбитальный Импульс', icon: '🛰️', desc: 'Робот выпускает плазменный луч на 350% урона.', cooldown: 8, damageMult: 3.5 },
      { id: 'sk_mech_overclock', name: 'Перегрузка Ядра', icon: '⚙️', desc: 'Повышает Критический Урон на +45%.', cooldown: 12, damageMult: 2.0 },
      { id: 'sk_mech_barrier', name: 'Силовой Батарейный Щит', icon: '🔋', desc: 'Создает экран и гасит урон.', cooldown: 15, healPct: 0.20 },
    ],
  },
  {
    id: 'pet_phoenix',
    name: 'Небесный Золотой Феникс',
    icon: '🐦',
    rarity: 'mythic',
    type: 'astral',
    desc: 'Легендарная птица перерождения. Очищает от скверны, исцеляет раны и сжигает врагов священным пламенем.',
    color: '#f59e0b',
    artSrc: '/pets/pet_phoenix.jpg',
    baseDmg: 85,
    baseHp: 480,
    branches: [
      {
        id: 'ph_rebirth',
        name: 'Вечное Пламя',
        icon: '☀️',
        color: '#f59e0b',
        desc: 'Исцеление и регенерация.',
        talents: [
          { id: 'ph_r1', name: 'Пепел Солнца', icon: '🕊️', desc: 'Увеличивает регенерацию HP героя.', maxRank: 5, per: r => `+${r * 25}% реген HP` },
          { id: 'ph_r2', name: 'Аура Перерождения', icon: '💖', desc: 'Увеличивает макс. HP героя.', maxRank: 5, per: r => `+${r * 8}% HP` },
        ],
      },
      {
        id: 'ph_sun',
        name: 'Солнечная Кара',
        icon: '🔥',
        color: '#ef4444',
        desc: 'Священный огненный урон.',
        talents: [
          { id: 'ph_s1', name: 'Солнечный Всплеск', icon: '💥', desc: 'Увеличивает силу заклинаний.', maxRank: 5, per: r => `+${r * 7}% силы магии` },
        ],
      },
    ],
    skills: [
      { id: 'sk_ph_burst', name: 'Солнечное Очищение', icon: '☀️', desc: 'Исцеляет 25% HP и наносит 400% святого урона.', cooldown: 9, damageMult: 4.0, healPct: 0.25 },
      { id: 'sk_ph_supernova', name: 'Сверхновая Звезда', icon: '🎇', desc: 'Взрыв чистого света на 650% урона.', cooldown: 16, damageMult: 6.5 },
      { id: 'sk_ph_grace', name: 'Благодать Феникса', icon: '🪶', desc: 'Дарует щит на 30% Max HP героя.', cooldown: 14, healPct: 0.30 },
    ],
  },
  {
    id: 'pet_hydra',
    name: 'Астральная Семиглавая Гидра',
    icon: '🐉',
    rarity: 'divine',
    type: 'dragon',
    desc: 'Древнейшее хтоническое создание. Каждая ее голова поражает врагов смертоносным ядом и похищает жизненную силу.',
    color: '#10b981',
    artSrc: '/pets/pet_hydra.jpg',
    baseDmg: 120,
    baseHp: 650,
    branches: [
      {
        id: 'hy_venom',
        name: 'Смертельный Яд',
        icon: '🧪',
        color: '#10b981',
        desc: 'Токсичный урон и разъедание брони.',
        talents: [
          { id: 'hy_v1', name: 'Кислотный Плевок', icon: '☠️', desc: 'Снижает броню врага.', maxRank: 5, per: r => `+${r * 6}% пробития` },
          { id: 'hy_v2', name: 'Токсичный Шок', icon: '💥', desc: 'Увеличивает урон гидры.', maxRank: 5, per: r => `+${r * 20}% урона гидры` },
        ],
      },
      {
        id: 'hy_heads',
        name: 'Множество Глав',
        icon: '👑',
        color: '#059669',
        desc: 'Вампиризм и мульти-удары.',
        talents: [
          { id: 'hy_h1', name: 'Жажда Крови', icon: '🩸', desc: 'Дарует вампиризм герою.', maxRank: 5, per: r => `+${r * 2}% вампиризма` },
        ],
      },
    ],
    skills: [
      { id: 'sk_hy_poison', name: 'Ядовитый Гейзер', icon: '🧪', desc: 'Заливает поле кислотой на 500% урона.', cooldown: 7, damageMult: 5.0 },
      { id: 'sk_hy_frenzy', name: 'Ярость Семи Глав', icon: '🐲', desc: 'Шквал 7 укусов на 770% урона.', cooldown: 15, damageMult: 7.7 },
      { id: 'sk_hy_drain', name: 'Поглощение Эссенции', icon: '🩸', desc: 'Крадет 20% HP цели.', cooldown: 12, damageMult: 3.5, healPct: 0.20 },
    ],
  },
  {
    id: 'pet_griffin',
    name: 'Громовой Небесный Грифон',
    icon: '🦅',
    rarity: 'legendary',
    type: 'beast',
    desc: 'Гордый повелитель штормов. Мечет молнии и наполняет атаки героя сокрушительной скоростью.',
    color: '#0ea5e9',
    artSrc: '/pets/pet_griffin.jpg',
    baseDmg: 65,
    baseHp: 380,
    branches: [
      {
        id: 'gr_storm',
        name: 'Зов Грома',
        icon: '⚡',
        color: '#0ea5e9',
        desc: 'Удары молний и скорость.',
        talents: [
          { id: 'gr_s1', name: 'Штормовые Крылья', icon: '💨', desc: 'Повышает скорость атаки.', maxRank: 5, per: r => `+${r * 6}% скорости` },
          { id: 'gr_s2', name: 'Электрошок', icon: '⚡', desc: 'Повышает шанс крита.', maxRank: 5, per: r => `+${r * 3}% крита` },
        ],
      },
    ],
    skills: [
      { id: 'sk_gr_lightning', name: 'Удар Молнии', icon: '⚡', desc: 'Бьет током на 380% урона.', cooldown: 6, damageMult: 3.8 },
      { id: 'sk_gr_tempest', name: 'Буря Клинков', icon: '🌪️', desc: 'Ускоряет героя на +40% на 8 сек.', cooldown: 14, damageMult: 2.5 },
    ],
  },
  {
    id: 'pet_sphinx',
    name: 'Солнечный Сфинкс Мудрости',
    icon: '🦁',
    rarity: 'legendary',
    type: 'astral',
    desc: 'Древний хранитель тайных знаний. Умножает получаемый опыт и золото, наделяя владельца несокрушимой волей.',
    color: '#eab308',
    artSrc: '/pets/pet_sphinx.jpg',
    baseDmg: 55,
    baseHp: 420,
    branches: [
      {
        id: 'sp_wealth',
        name: 'Сокровища Фараона',
        icon: '🪙',
        color: '#eab308',
        desc: 'Богатство и добыча.',
        talents: [
          { id: 'sp_w1', name: 'Золотой Рог', icon: '💰', desc: 'Увеличивает золото.', maxRank: 5, per: r => `+${r * 20}% золота` },
          { id: 'sp_w2', name: 'Свиток Вечности', icon: '📜', desc: 'Увеличивает опыт.', maxRank: 5, per: r => `+${r * 15}% опыта` },
        ],
      },
    ],
    skills: [
      { id: 'sk_sp_beam', name: 'Луч Рассвета', icon: '☀️', desc: 'Выжигает врагов на 420% урона.', cooldown: 7, damageMult: 4.2 },
      { id: 'sk_sp_barrier', name: 'Загадка Сфинкса', icon: '🔮', desc: 'Оглушает врага и создает щит на 25% HP.', cooldown: 13, healPct: 0.25 },
    ],
  },
];
