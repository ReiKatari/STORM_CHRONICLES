import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';
import { getClassById } from '@/game/classes';
import { fmt } from '@/game/engine';

const HOTKEYS = ['1', '2', '3', '4', 'Q', 'W'];

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

function getTargetEventTime(): number {
  try {
    const saved = localStorage.getItem('storm_abyss_event_target');
    if (saved) {
      const val = parseInt(saved, 10);
      if (!isNaN(val) && val > Date.now()) return val;
    }
  } catch { /* ignore */ }
  const target = Date.now() + 300000;
  try { localStorage.setItem('storm_abyss_event_target', target.toString()); } catch { /* ignore */ }
  return target;
}

export default function CombatConsole() {
  const [activeTab, setActiveTab] = useState<'skills' | 'log' | 'events'>('skills');

  // --- Hotbar & Skills Data ---
  const classId = useGame(s => s.classId);
  const heroClass = classId ? getClassById(classId) : null;
  const skillRanks = useGame(s => s.skillRanks);
  const skillCds = useGame(s => s.skillCds);
  const mana = useGame(s => s.mana);
  const castSkill = useGame(s => s.castSkill);

  const [bindings, setBindings] = useState<Record<string, string>>({
    '1': heroClass?.skills[0]?.id || '',
    '2': heroClass?.skills[1]?.id || '',
    '3': heroClass?.skills[2]?.id || '',
    '4': heroClass?.skills[3]?.id || '',
    'Q': 'pot_hp',
    'W': 'pot_mana',
  });

  useEffect(() => {
    if (heroClass) {
      setBindings({
        '1': heroClass.skills[0]?.id || '',
        '2': heroClass.skills[1]?.id || '',
        '3': heroClass.skills[2]?.id || '',
        '4': heroClass.skills[3]?.id || '',
        'Q': 'pot_hp',
        'W': 'pot_mana',
      });
    }
  }, [classId]);

  // Global keydown handler for skills & quick potions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const keyUpper = e.key.toUpperCase();
      if (HOTKEYS.includes(keyUpper)) {
        const boundId = bindings[keyUpper];
        if (boundId) {
          e.preventDefault();
          if (boundId === 'pot_hp') {
            useGame.setState(s => ({ hp: Math.min(s.derived.maxHp, s.hp + Math.round(s.derived.maxHp * 0.4)) }));
          } else if (boundId === 'pot_mana') {
            useGame.setState(s => ({ mana: Math.min(s.derived.maxMana, s.mana + Math.round(s.derived.maxMana * 0.5)) }));
          } else {
            castSkill(boundId);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bindings, castSkill]);

  // --- Battle Log Data ---
  const log = useGame(s => s.log);

  // --- Events Data ---
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [eventTimer, setEventTimer] = useState<number>(() => {
    const t = getTargetEventTime();
    return Math.max(0, Math.ceil((t - Date.now()) / 1000));
  });

  const level = useGame(s => s.level);
  const gold = useGame(s => s.gold);

  const generateRandomEvent = () => {
    const events: RandomEvent[] = [
      {
        id: 'blood_altar',
        name: 'Кровавый Алтарь Бездны',
        desc: 'Древний алтарь жаждет подношения: отдайте здоровье или золото за великую силу.',
        icon: '🩸',
        choiceA: '🩸 Жертва Здоровья (-20% Здоровья, +50% к Урону на 60 секунд)',
        choiceB: `💰 Пожертвовать ${fmt(100)} золота (+80% к Опыту на 60 секунд)`,
        actionA: () => {
          useGame.setState(s => ({
            hp: Math.max(10, Math.round(s.hp * 0.8)),
            log: [...s.log, { id: Date.now(), text: '🩸 Алтарь принял кровь! +50% к урону на 60 секунд.', color: '#ef4444', time: Date.now() }],
          }));
        },
        actionB: () => {
          if (gold < 100) return;
          useGame.setState(s => ({
            gold: s.gold - 100,
            log: [...s.log, { id: Date.now(), text: '✨ Алтарь принял золото! +80% к опыту на 60 секунд.', color: '#facc15', time: Date.now() }],
          }));
        },
      },
      {
        id: 'void_rift',
        name: 'Разлом Астральной Бездны',
        desc: 'Открылся пространственный разлом с концентрированной астральной энергией.',
        icon: '🌀',
        choiceA: `⚡ Поглотить энергию (+${fmt(level * 250)} опыта)`,
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
        desc: 'В логове древнего дракона сияют горы золота и драгоценных кристаллов.',
        icon: '🐉',
        choiceA: `💰 Забрать сокровище (+${fmt(level * 150)} золота)`,
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
            log: [...s.log, { id: Date.now(), text: '🐲 Дракон благословил вас: +1 очко талантов!', color: '#4ade80', time: Date.now() }],
          }));
        },
      },
    ];

    const pick = events[Math.floor(Math.random() * events.length)];
    setCurrentEvent(pick);
    const nextTarget = Date.now() + 300000;
    try { localStorage.setItem('storm_abyss_event_target', nextTarget.toString()); } catch { /* ignore */ }
  };

  useEffect(() => {
    generateRandomEvent();
    const timerId = setInterval(() => {
      const target = getTargetEventTime();
      const diff = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      setEventTimer(diff);
      if (diff <= 0) {
        generateRandomEvent();
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-2.5 shadow-2xl backdrop-blur-md space-y-2 font-sans">
      {/* Console Tab Switcher Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 px-0.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('skills')}
            className={`text-xs py-1 px-2.5 rounded-xl font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-slate-800 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚡</span>
            <span>Боевые Навыки</span>
          </button>

          <button
            onClick={() => setActiveTab('log')}
            className={`text-xs py-1 px-2.5 rounded-xl font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'log'
                ? 'bg-slate-800 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📜</span>
            <span>Журнал Битвы</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`text-xs py-1 px-2.5 rounded-xl font-extrabold transition-all flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === 'events'
                ? 'bg-slate-800 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌟</span>
            <span>События Мира</span>
            {currentEvent && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        </div>

        <div className="text-[10px] text-slate-400 font-mono hidden sm:flex items-center gap-2">
          <span>Клавиши: <b>[1-4]</b> Умения · <b>[Q/W]</b> Зелья</span>
        </div>
      </div>

      {/* TAB 1: SKILLS & POTIONS HOTBAR */}
      {activeTab === 'skills' && heroClass && (
        <div className="grid grid-cols-6 gap-2">
          {HOTKEYS.map(key => {
            const boundId = bindings[key];
            const sk = heroClass.skills.find(x => x.id === boundId);
            const isHpPot = boundId === 'pot_hp';
            const isManaPot = boundId === 'pot_mana';

            const rank = sk ? (skillRanks[sk.id] ?? 0) : 0;
            const cd = sk ? (skillCds[sk.id] ?? 0) : 0;
            const isNoMana = sk && mana < sk.manaCost;

            return (
              <button
                key={key}
                onClick={() => {
                  if (boundId === 'pot_hp') {
                    useGame.setState(s => ({ hp: Math.min(s.derived.maxHp, s.hp + Math.round(s.derived.maxHp * 0.4)) }));
                  } else if (boundId === 'pot_mana') {
                    useGame.setState(s => ({ mana: Math.min(s.derived.maxMana, s.mana + Math.round(s.derived.maxMana * 0.5)) }));
                  } else if (sk) {
                    castSkill(sk.id);
                  }
                }}
                className={`relative h-14 rounded-xl border flex flex-col items-center justify-between p-1 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 text-left ${
                  cd > 0
                    ? 'border-slate-800 bg-slate-950/80 opacity-60'
                    : sk && rank > 0
                    ? 'border-slate-600 bg-slate-800/90 shadow-md'
                    : isHpPot || isManaPot
                    ? 'border-emerald-500/50 bg-emerald-950/30'
                    : 'border-slate-800 bg-slate-950/40'
                }`}
                style={{
                  borderColor: sk && rank > 0 ? sk.color : undefined,
                  boxShadow: sk && rank > 0 && cd === 0 ? `0 0 10px ${sk.color}33` : undefined,
                }}
              >
                {/* Hotkey Tag */}
                <span className="absolute top-1 left-1 text-[8px] font-black font-mono text-slate-300 bg-slate-950/90 px-1 rounded border border-slate-800 z-10">
                  {key}
                </span>

                {/* Content Icon & Label */}
                {isHpPot ? (
                  <div className="flex flex-col items-center justify-center w-full h-full pt-1">
                    <span className="text-base">🧪</span>
                    <div className="text-[8px] font-black text-emerald-300 text-center leading-tight">
                      Зелье Здоровья
                    </div>
                  </div>
                ) : isManaPot ? (
                  <div className="flex flex-col items-center justify-center w-full h-full pt-1">
                    <span className="text-base">💧</span>
                    <div className="text-[8px] font-black text-sky-300 text-center leading-tight">
                      Эликсир Маны
                    </div>
                  </div>
                ) : sk ? (
                  <div className="flex flex-col items-center justify-center w-full h-full pt-1">
                    <span className="text-base">{sk.icon}</span>
                    <div className="text-[8px] font-black text-slate-200 text-center leading-tight truncate w-full px-0.5" style={{ color: sk.color }}>
                      {sk.name}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full pt-2">
                    <span className="text-slate-600 text-[9px] font-bold">пусто</span>
                  </div>
                )}

                {/* Cooldown Overlay */}
                {cd > 0 && (
                  <div className="absolute inset-0 bg-slate-950/90 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-white">
                    {cd.toFixed(0)}с
                  </div>
                )}

                {/* Mana shortage */}
                {isNoMana && cd === 0 && (
                  <span className="absolute bottom-0.5 text-[7px] text-sky-400 font-bold bg-sky-950/90 px-1 rounded">
                    мало маны
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* TAB 2: BATTLE LOG */}
      {activeTab === 'log' && (
        <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-2 h-14 overflow-y-auto flex flex-col-reverse font-mono text-[10px]">
          <div className="space-y-0.5">
            {log.slice(-30).map(l => (
              <div key={l.id} className="leading-tight truncate" style={{ color: l.color }}>
                {l.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS & ANOMALIES */}
      {activeTab === 'events' && (
        <div className="h-14 flex items-center">
          {currentEvent ? (
            <div className="w-full p-1.5 rounded-xl bg-slate-950 border border-purple-500/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0">{currentEvent.icon}</span>
                <div className="min-w-0">
                  <div className="font-black text-[11px] text-amber-300 truncate">{currentEvent.name}</div>
                  <div className="text-[9px] text-slate-300 truncate">{currentEvent.desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => { currentEvent.actionA(); setCurrentEvent(null); }}
                  className="py-1 px-2.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold text-[9.5px] transition-all active:scale-95 cursor-pointer"
                >
                  Выбрать 1
                </button>
                <button
                  onClick={() => { currentEvent.actionB(); setCurrentEvent(null); }}
                  className="py-1 px-2.5 rounded-lg bg-amber-950/90 hover:bg-amber-900 border border-amber-500/50 text-amber-300 font-bold text-[9.5px] transition-all active:scale-95 cursor-pointer"
                >
                  Выбрать 2
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full p-2 text-center bg-slate-950/60 rounded-xl border border-dashed border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-300">
                🔮 Сканер аномалий активен (следующее событие через: <b className="text-amber-300 font-mono">{formatTimer(eventTimer)}</b>)
              </span>
              <button
                onClick={() => generateRandomEvent()}
                className="py-1 px-2.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-[9.5px] font-extrabold transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                ⚡ Вызвать аномалию
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
