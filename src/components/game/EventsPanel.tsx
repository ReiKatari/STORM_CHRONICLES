import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import type { WorldEvent, ActiveBuff } from '@/game/types';
import { generateItem } from '@/game/items';

const RANDOM_EVENTS: Omit<WorldEvent, 'id' | 'expiresAt'>[] = [
  {
    title: '🩸 Кровавый Алтарь Бездны',
    icon: '🩸',
    desc: 'Вы находите древнее древко, омытое кровью падших титанов. Голос шепчет о жертве.',
    choices: [
      {
        id: 'c1',
        text: '🩸 Жертва HP (потерять 20% HP)',
        costHpPct: 0.2,
        rewardText: '+40% к урону на 60 секунд',
        effect: 'buff_dmg',
        effectValue: 40,
      },
      {
        id: 'c2',
        text: '💰 Пожертвовать 100 золота',
        costGold: 100,
        rewardText: '+50% к получаемому опыту на 60с',
        effect: 'buff_xp',
        effectValue: 50,
      },
    ],
  },
  {
    title: '🏺 Странствующий Купец Бездны',
    icon: '🧞',
    desc: 'Загадочный торговец предлагает редкие товары из далеких астральных миров.',
    choices: [
      {
        id: 'c3',
        text: '🎁 Купить случайный Эпик (150 gold)',
        costGold: 150,
        rewardText: 'Гарантированный эпический предмет!',
        effect: 'item',
        effectValue: 1,
      },
      {
        id: 'c4',
        text: '☕ Выпить эликсир удачи (50 gold)',
        costGold: 50,
        rewardText: '+80% к золоту на 90с',
        effect: 'buff_gold',
        effectValue: 80,
      },
    ],
  },
  {
    title: '📦 Забытый Сундук Дракона',
    icon: '📦',
    desc: 'Вы натыкаетесь на запечатанный древний сундук. Крышка отсвечивает рунами.',
    choices: [
      {
        id: 'c5',
        text: '🗝️ Взломать замок',
        rewardText: 'Найти 250-500 золота!',
        effect: 'gold',
        effectValue: 300,
      },
      {
        id: 'c6',
        text: '🔮 Призвать астральную сферу',
        rewardText: 'Полное исцеление HP и маны!',
        effect: 'heal',
        effectValue: 100,
      },
    ],
  },
  {
    title: '📜 Древний Гримуар Забытых Саг',
    icon: '📜',
    desc: 'На камне лежит открытый фолиант. Его страницы пылают неземным светом.',
    choices: [
      {
        id: 'c7',
        text: '📖 Прочесть заклятие опыта',
        rewardText: '+100% к опыту на 45 секунд',
        effect: 'buff_xp',
        effectValue: 100,
      },
      {
        id: 'c8',
        text: '⚔️ Напитать оружие астралом',
        rewardText: '+60% к урону на 45 секунд',
        effect: 'buff_dmg',
        effectValue: 60,
      },
    ],
  },
];

export default function EventsPanel() {
  const hp = useGame(s => s.hp);
  const derived = useGame(s => s.derived);
  const gold = useGame(s => s.gold);
  const level = useGame(s => s.level);
  const inventory = useGame(s => s.inventory);
  const equip = useGame(s => s.equip);

  const [currentEvent, setCurrentEvent] = useState<WorldEvent | null>(null);
  const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
  const [nextTimer, setNextTimer] = useState(25);

  useEffect(() => {
    const iv = setInterval(() => {
      setNextTimer(t => {
        if (t <= 1 && !currentEvent) {
          // Trigger new random event
          const evTemplate = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
          const newEv: WorldEvent = {
            ...evTemplate,
            id: `ev_${Date.now()}`,
            expiresAt: Date.now() + 45000,
          };
          setCurrentEvent(newEv);
          return 60;
        }
        return Math.max(0, t - 1);
      });

      // Filter expired buffs
      setActiveBuffs(prev => prev.filter(b => b.expiresAt > Date.now()));
    }, 1000);

    return () => clearInterval(iv);
  }, [currentEvent]);

  const handleChoice = (choice: typeof RANDOM_EVENTS[0]['choices'][0]) => {
    if (!currentEvent) return;

    // Check costs
    if (choice.costGold && gold < choice.costGold) return;
    if (choice.costGold) {
      useGame.setState({ gold: gold - choice.costGold });
    }

    if (choice.costHpPct) {
      const damage = Math.round(derived.maxHp * choice.costHpPct);
      useGame.setState({ hp: Math.max(1, hp - damage) });
    }

    // Apply effects
    if (choice.effect === 'buff_dmg') {
      const newBuff: ActiveBuff = {
        id: `b_${Date.now()}`,
        name: 'Астральная ярость',
        icon: '⚔️',
        desc: `+${choice.effectValue}% к урону`,
        stat: 'dmg',
        value: choice.effectValue,
        expiresAt: Date.now() + 60000,
      };
      setActiveBuffs(prev => [...prev, newBuff]);
    } else if (choice.effect === 'buff_gold') {
      const newBuff: ActiveBuff = {
        id: `b_${Date.now()}`,
        name: 'Дары Фортуны',
        icon: '💰',
        desc: `+${choice.effectValue}% к золоту`,
        stat: 'gold',
        value: choice.effectValue,
        expiresAt: Date.now() + 60000,
      };
      setActiveBuffs(prev => [...prev, newBuff]);
    } else if (choice.effect === 'buff_xp') {
      const newBuff: ActiveBuff = {
        id: `b_${Date.now()}`,
        name: 'Озарение Бездны',
        icon: '📈',
        desc: `+${choice.effectValue}% к опыту`,
        stat: 'xp',
        value: choice.effectValue,
        expiresAt: Date.now() + 60000,
      };
      setActiveBuffs(prev => [...prev, newBuff]);
    } else if (choice.effect === 'heal') {
      useGame.setState({ hp: derived.maxHp, mana: derived.maxMana });
    } else if (choice.effect === 'gold') {
      const rewardG = choice.effectValue + Math.floor(Math.random() * 200);
      useGame.setState({ gold: gold + rewardG, totalGoldEarned: useGame.getState().totalGoldEarned + rewardG });
    } else if (choice.effect === 'item') {
      const newItm = generateItem(level, 'epic');
      if (inventory.length < 72) {
        useGame.setState({ inventory: [...inventory, newItm] });
      }
    }

    setCurrentEvent(null);
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3 shadow-2xl backdrop-blur-md space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🎲</span>
          <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wider">
            Экспедиции & События Бездны
          </h3>
        </div>
        <span className="text-[9px] text-slate-400 font-mono">
          {!currentEvent ? `Следующее: ${nextTimer}с` : '⚡ Активно!'}
        </span>
      </div>

      {/* Active Event Body */}
      {currentEvent ? (
        <div className="rounded-xl border border-amber-500/50 bg-amber-950/20 p-2.5 space-y-2 animate-fadeIn shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentEvent.icon}</span>
            <div>
              <div className="font-extrabold text-xs text-amber-200">{currentEvent.title}</div>
              <div className="text-[10px] text-slate-300 leading-tight">{currentEvent.desc}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {currentEvent.choices.map(c => {
              const cantAfford = c.costGold && gold < c.costGold;
              return (
                <button
                  key={c.id}
                  onClick={() => handleChoice(c)}
                  disabled={!!cantAfford}
                  className="rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 p-2 text-left transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95"
                >
                  <div className="font-bold text-[10px] text-slate-100">{c.text}</div>
                  <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">{c.rewardText}</div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-3 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-[10px] text-slate-400">
          🔍 Поиск астральных аномалий и артефактов... ({nextTimer}с)
        </div>
      )}

      {/* Active Buffs Badges */}
      {activeBuffs.length > 0 && (
        <div className="pt-1.5 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] text-slate-400 font-bold">Баффы:</span>
          {activeBuffs.map(b => {
            const leftSec = Math.max(0, Math.ceil((b.expiresAt - Date.now()) / 1000));
            return (
              <div
                key={b.id}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-bold text-emerald-300 shadow"
              >
                <span>{b.icon}</span>
                <span>{b.desc}</span>
                <span className="text-slate-400 font-mono text-[8px]">({leftSec}с)</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
