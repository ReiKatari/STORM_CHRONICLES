export interface WeatherDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
  particleKind: 'ember' | 'snow' | 'spark' | 'rain' | 'ash' | 'bloom';
  dmgBonusPct?: number;
  critBonusPct?: number;
  xpBonusPct?: number;
  goldBonusPct?: number;
}

export const WEATHERS: WeatherDef[] = [
  {
    id: 'clear',
    name: 'Ясная Погода',
    icon: '☀️',
    color: '#facc15',
    desc: 'Чистое небо и легкий астральный бриз. Спокойная обстановка.',
    particleKind: 'spark',
  },
  {
    id: 'ash_rain',
    name: 'Пепельный Дождь',
    icon: '🌋',
    color: '#ef4444',
    desc: 'Вулканический пепел падающих звездопадов. +25% к Урону Огнем и Силе Атаки.',
    particleKind: 'ash',
    dmgBonusPct: 25,
  },
  {
    id: 'frost_blizzard',
    name: 'Ледяной Шторм',
    icon: '❄️',
    color: '#38bdf8',
    desc: 'Свирепая ледяная пурга. +30% к Броне и Защите.',
    particleKind: 'snow',
    critBonusPct: 15,
  },
  {
    id: 'astral_storm',
    name: 'Астральная Буря Бездны',
    icon: '🔮',
    color: '#a855f7',
    desc: 'Пространство разрывается фиолетовым молниями. +50% к Опыту!',
    particleKind: 'spark',
    xpBonusPct: 50,
  },
  {
    id: 'blood_fog',
    name: 'Кровавый Туман',
    icon: '🩸',
    color: '#dc2626',
    desc: 'Густая алая дымка омывает холмы. +20% к Критическому Урону и Вампиризму.',
    particleKind: 'ember',
    critBonusPct: 20,
  },
  {
    id: 'golden_sun',
    name: 'Священный Солнцепек',
    icon: '👑',
    color: '#fbbf24',
    desc: 'Небесный луч обогащает земные недра. +40% к Выпадающему Золоту!',
    particleKind: 'spark',
    goldBonusPct: 40,
  },
];

export function getRandomWeather(): WeatherDef {
  return WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
}
