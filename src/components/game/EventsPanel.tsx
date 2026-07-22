import { useState } from 'react';
import { useGame } from '@/game/store';

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
  const [timer, setTimer] = useState(15);

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
        choiceB: '💰 Пожертвовать 100 золота',
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
        id: 'goblin_merchant',
        name: 'Таинственный Гоблин-Торговец',
        desc: 'Из тени вылезает хитрый гоблин с тяжелым мешком астральных реликвий.',
        icon: '👺',
        choiceA: '💰 Купить таинственный сундук (150g)',
        choiceB: '👋 Пройти мимо',
        actionA: () => {
          if (gold < 150) return;
          useGame.setState(s => ({
            gold: s.gold - 150,
            log: [...s.log, { id: Date.now(), text: '🎁 Гоблин дал вам сокровище! Получено +1000 XP', color: '#38bdf8', time: Date.now() }],
          }));
        },
        actionB: () => {},
      },
      {
        id: 'runestone',
        name: 'Древний Рунный Камень',
        desc: 'На камне лежит открытый фолиант. Его страницы пылают неземным светом.',
        icon: '📜',
        choiceA: '📖 Прочесть заклятие опыта',
        choiceB: '⚔️ Напитать оружие астралом',
        actionA: () => {
          useGame.setState(s => ({
            log: [...s.log, { id: Date.now(), text: '📖 Знания древних даровали вам +1000 опыта!', color: '#38bdf8', time: Date.now() }],
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
        choiceB: '🔮 Набрать воду в эликсир',
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
        choiceA: '⛏️ Раскопать руду (+500 золота)',
        choiceB: '✨ Поглотить космическую пыль (+1 очко скиллов)',
        actionA: () => {
          useGame.setState(s => ({
            gold: s.gold + 500,
            totalGoldEarned: s.totalGoldEarned + 500,
            log: [...s.log, { id: Date.now(), text: '⛏️ Извлечено +500 золота из метеора!', color: '#fbbf24', time: Date.now() }],
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
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3 shadow-2xl backdrop-blur-md space-y-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1 px-1">
        <div className="flex items-center gap-2">
          <span className="text-base">🔮</span>
          <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wider">
            ЭКСПЕДИЦИИ И СОБЫТИЯ БЕЗДНЫ
          </h3>
        </div>
        <button
          onClick={generateRandomEvent}
          className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 transition-all active:scale-95"
        >
          ⚡ Исследовать
        </button>
      </div>

      {currentEvent ? (
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-fadeIn">
          <div className="flex items-start gap-2">
            <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">{currentEvent.icon}</span>
            <div>
              <h4 className="font-extrabold text-xs text-amber-300">{currentEvent.name}</h4>
              <p className="text-[10px] text-slate-300 leading-tight mt-0.5">{currentEvent.desc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                currentEvent.actionA();
                setCurrentEvent(null);
              }}
              className="py-1.5 px-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] text-left transition-all active:scale-95"
            >
              {currentEvent.choiceA}
            </button>
            <button
              onClick={() => {
                currentEvent.actionB();
                setCurrentEvent(null);
              }}
              className="py-1.5 px-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold text-[10px] text-left transition-all active:scale-95"
            >
              {currentEvent.choiceB}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2 text-center text-[10px] text-slate-400 italic bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
          🔍 Поиск астральных аномалий и артефактов... Нажмите «Исследовать»
        </div>
      )}
    </div>
  );
}
