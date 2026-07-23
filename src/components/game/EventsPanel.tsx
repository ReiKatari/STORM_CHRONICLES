import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';

interface RandomEvent {
  id: string;
  name: string;
  desc: string;
  icon: string;
  choiceA: string;
  choiceB: string;
  actionA: () => void;
  actionB: () => void;
}

export default function EventsPanel() {
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [eventTimer, setEventTimer] = useState<number>(300); // 5 minutes = 300s

  const level = useGame(s => s.level);
  const gold = useGame(s => s.gold);

  const generateRandomEvent = () => {
    const events: RandomEvent[] = [
      {
        id: 'blood_altar',
        name: 'Кровавый Алтарь Бездны',
        desc: 'Вы находите древнее древо, омытое кровью падших титанов. Голос шепчет о жертве.',
        icon: '🩸',
        choiceA: '🩸 Жертва HP (Потерять 20% HP)',
        choiceB: `💰 Пожертвовать ${fmt(100)} золота`,
        actionA: () => {
          useGame.setState(s => ({
            hp: Math.max(10, Math.round(s.hp * 0.8)),
            log: [...s.log, { id: Date.now(), text: '🩸 Алтарь принял кровь! +50% к урону на 60 сек.', color: '#ef4444', time: Date.now() }],
          }));
        },
        actionB: () => {
          if (gold < 100) return;
          useGame.setState(s => ({
            gold: s.gold - 100,
            log: [...s.log, { id: Date.now(), text: '✨ Алтарь принял золото! +80% к опыту на 60 сек.', color: '#facc15', time: Date.now() }],
          }));
        },
      },
      {
        id: 'void_rift',
        name: 'Разлом Астральной Бездны',
        desc: 'В воздухе со скрежетом открылся фиолетовый разлом. Оттуда веет космической энергией.',
        icon: '🌀',
        choiceA: '⚡ Прыгнуть в разлом (+2 500 XP)',
        choiceB: '🔮 Собрать астральные эссенции (+5 эссенций)',
        actionA: () => {
          const gainedXp = level * 250;
          useGame.setState(s => ({
            xp: s.xp + gainedXp,
            log: [...s.log, { id: Date.now(), text: `🌀 Разлом даровал вам +${fmt(gainedXp)} опыта!`, color: '#c084fc', time: Date.now() }],
          }));
        },
        actionB: () => {
          useGame.setState(s => ({
            astralEssence: ((s as unknown as { astralEssence: number }).astralEssence ?? 0) + 5,
            log: [...s.log, { id: Date.now(), text: '🔮 Извлечено +5 Астральных Эссенций!', color: '#a855f7', time: Date.now() }],
          }));
        },
      },
      {
        id: 'dragon_sanctuary',
        name: 'Святилище Астрального Дракона',
        desc: 'Перед вами гнездо золотого дракона. Вокруг блестят бесчисленные драгоценности.',
        icon: '🐉',
        choiceA: `💰 Забрать сокровище (+${fmt(1200)} gold)`,
        choiceB: '🐲 Благословение дракона (+1 очко талантов)',
        actionA: () => {
          const rewardGold = level * 150;
          useGame.setState(s => ({
            gold: s.gold + rewardGold,
            totalGoldEarned: s.totalGoldEarned + rewardGold,
            log: [...s.log, { id: Date.now(), text: `💰 Сокровище дракона принесло +${fmt(rewardGold)} золота!`, color: '#facc15', time: Date.now() }],
          }));
        },
        actionB: () => {
          useGame.setState(s => ({
            talentPoints: s.talentPoints + 1,
            log: [...s.log, { id: Date.now(), text: '🐲 Дракон благословил вас! Получено +1 очко талантов!', color: '#f97316', time: Date.now() }],
          }));
        },
      },
      {
        id: 'goblin_merchant',
        name: 'Таинственный Гоблин-Торговец',
        desc: 'Из тени вылезает хитрый гоблин с тяжелым мешком астральных реликвий.',
        icon: '👺',
        choiceA: `💰 Купить сундук (${fmt(200)}g)`,
        choiceB: '👋 Пройти мимо',
        actionA: () => {
          if (gold < 200) return;
          const dropXp = level * 350;
          useGame.setState(s => ({
            gold: s.gold - 200,
            xp: s.xp + dropXp,
            log: [...s.log, { id: Date.now(), text: `🎁 Гоблин вручил сундук! Получено +${fmt(dropXp)} XP!`, color: '#38bdf8', time: Date.now() }],
          }));
        },
        actionB: () => {},
      },
      {
        id: 'treasure_portal',
        name: 'Портал Сокровищницы Золотого Повелителя',
        desc: 'Сияющие ворота ведут в затерянные подземелья, набитые драгоценными камнями.',
        icon: '🔑',
        choiceA: '🔑 Открыть портал (+50 руды)',
        choiceB: `💰 Забрать куш (+${fmt(800)} gold)`,
        actionA: () => {
          useGame.setState(s => ({
            astralOre: ((s as unknown as { astralOre: number }).astralOre ?? 0) + 50,
            log: [...s.log, { id: Date.now(), text: '🪵 Добыто +50 Астральной Руды!', color: '#f59e0b', time: Date.now() }],
          }));
        },
        actionB: () => {
          useGame.setState(s => ({
            gold: s.gold + 800,
            log: [...s.log, { id: Date.now(), text: `💰 Сокровищница пополнена на +${fmt(800)} золота!`, color: '#eab308', time: Date.now() }],
          }));
        },
      },
      {
        id: 'runestone',
        name: 'Древний Рунный Камень',
        desc: 'На камне лежит открытый фолиант. Его страницы пылают неземным светом.',
        icon: '📜',
        choiceA: '📖 Прочесть заклятие опыта',
        choiceB: '⚡ Напитать оружие астралом',
        actionA: () => {
          const gainedXp = level * 200;
          useGame.setState(s => ({
            xp: s.xp + gainedXp,
            log: [...s.log, { id: Date.now(), text: `📖 Знания древних даровали вам +${fmt(gainedXp)} опыта!`, color: '#38bdf8', time: Date.now() }],
          }));
        },
        actionB: () => {
          useGame.setState(s => ({
            log: [...s.log, { id: Date.now(), text: '⚡ Оружие напитано! +50% к крит шансу!', color: '#facc15', time: Date.now() }],
          }));
        },
      },
      {
        id: 'fountain_youth',
        name: 'Источник Юности Бездны',
        desc: 'Чистейшая астральная вода бьет из-под кристаллической скалы.',
        icon: '🪞',
        choiceA: '💧 Испить воды (100% HP & Мана)',
        choiceB: '🔮 Набрать эликсир (+2 стата)',
        actionA: () => {
          useGame.setState(s => ({
            hp: s.derived.maxHp,
            mana: s.derived.maxMana,
            log: [...s.log, { id: Date.now(), text: '💧 Здоровье и мана полностью восстановлены!', color: '#4ade80', time: Date.now() }],
          }));
        },
        actionB: () => {
          useGame.setState(s => ({
            statPoints: s.statPoints + 2,
            log: [...s.log, { id: Date.now(), text: '🔮 Получено +2 очка характеристик!', color: '#a855f7', time: Date.now() }],
          }));
        },
      },
      {
        id: 'meteor_crash',
        name: 'Падение Звездного Метеора',
        desc: 'С небес рухнул раскаленный космический осколок, полный астрального золота.',
        icon: '☄️',
        choiceA: `⛏️ Раскопать руду (+${fmt(1500)} gold)`,
        choiceB: '✨ Поглотить пыль (+1 очко скиллов)',
        actionA: () => {
          const goldBonus = level * 100 + 500;
          useGame.setState(s => ({
            gold: s.gold + goldBonus,
            totalGoldEarned: s.totalGoldEarned + goldBonus,
            log: [...s.log, { id: Date.now(), text: `⛏️ Извлечено +${fmt(goldBonus)} золота из метеора!`, color: '#fbbf24', time: Date.now() }],
          }));
        },
        actionB: () => {
          useGame.setState(s => ({
            skillPoints: s.skillPoints + 1,
            log: [...s.log, { id: Date.now(), text: '✨ Вы поглотили пыль! Получено +1 очко скиллов!', color: '#c084fc', time: Date.now() }],
          }));
        },
      },
    ];

    const pick = events[Math.floor(Math.random() * events.length)];
    setCurrentEvent(pick);
    setEventTimer(300); // Reset 5-min timer
  };

  // Automated 5-minute event generator (300 seconds)
  useEffect(() => {
    const timerId = setInterval(() => {
      setEventTimer(prev => {
        if (prev <= 1) {
          generateRandomEvent();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-3.5 shadow-2xl backdrop-blur-md space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xl p-1 bg-purple-500/10 rounded-lg border border-purple-500/30">🔮</span>
          <div>
            <h3 className="font-black text-xs text-slate-100 uppercase tracking-wider">
              ЭКСПЕДИЦИИ И СОБЫТИЯ БЕЗДНЫ
            </h3>
            <span className="text-[10px] text-purple-300 font-mono font-bold">
              ⏱️ Следующее событие Бездны через: <b className="text-amber-300 font-extrabold">{formatTimer(eventTimer)}</b>
            </span>
          </div>
        </div>
      </div>

      {currentEvent ? (
        <div className="p-3 rounded-2xl bg-slate-950 border border-purple-500/60 space-y-2.5 animate-fadeIn shadow-xl">
          <div className="flex items-start gap-3">
            <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">{currentEvent.icon}</span>
            <div>
              <h4 className="font-black text-xs text-amber-300">{currentEvent.name}</h4>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">{currentEvent.desc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                currentEvent.actionA();
                setCurrentEvent(null);
              }}
              className="py-2 px-3 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-black text-xs text-left transition-all active:scale-95 shadow"
            >
              {currentEvent.choiceA}
            </button>
            <button
              onClick={() => {
                currentEvent.actionB();
                setCurrentEvent(null);
              }}
              className="py-2 px-3 rounded-xl bg-amber-950/90 hover:bg-amber-900 border border-amber-500/50 text-amber-300 font-black text-xs text-left transition-all active:scale-95 shadow"
            >
              {currentEvent.choiceB}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 text-center text-[11px] text-slate-400 italic bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
          🔮 Автоматический сканер аномалий включен. Следующее событие появится через <b className="text-amber-300 font-mono not-italic">{formatTimer(eventTimer)}</b>.
        </div>
      )}
    </div>
  );
}
