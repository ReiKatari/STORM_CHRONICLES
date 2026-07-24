import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import type { TowerModifier } from '@/game/types';

const TOWER_MODIFIERS: TowerModifier[] = [
  { id: 'm_poison', name: 'Ядовитый Туман', icon: '☣️', desc: 'Персонаж теряет 2% HP каждую секунду боя.', color: '#22c55e' },
  { id: 'm_antimagic', name: 'Антимагический Купол', icon: '🛡️', desc: 'Урон от магических скиллов снижен на 50%.', color: '#38bdf8' },
  { id: 'm_nopotions', name: 'Дуэль Без Зелей', icon: '🩸', desc: 'Использование восстанавливающих зелей заблокировано.', color: '#ef4444' },
  { id: 'm_frenzy', name: 'Неукротимая Скорость', icon: '⚡', desc: 'Враг атакует на 40% быстрее нормальной скорости.', color: '#facc15' },
  { id: 'm_vampire', name: 'Вампиризм Бездны', icon: '🍷', desc: 'Враг восстанавливает 15% HP от нанесенного урона.', color: '#a855f7' },
];

export default function TowerModal({ onClose }: { onClose: () => void }) {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [maxFloor, setMaxFloor] = useState(1);
  const [activeMod, setActiveMod] = useState<TowerModifier | null>(null);
  const [logMsg, setLogMsg] = useState<string>('⚔️ Вы стояли у подножия Бесконечной Башни Испытаний Бездны!');

  const level = useGame(s => s.level);

  useEffect(() => {
    // Select initial floor modifier
    const mod = TOWER_MODIFIERS[(currentFloor - 1) % TOWER_MODIFIERS.length];
    setActiveMod(mod);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFloor, onClose]);

  const handleChallengeFloor = () => {
    const rewardG = currentFloor * 400 + 500;
    const rewardXp = currentFloor * 250 + 300;

    useGame.setState(s => ({
      gold: s.gold + rewardG,
      log: [...s.log, { id: Date.now(), text: `⚔️ ТАУЭР: Пройден ${currentFloor} Этаж! +${rewardG}g, +${rewardXp}xp`, color: '#facc15', time: Date.now() }]
    }));

    setLogMsg(`🎉 ЭТАЖ ${currentFloor} ПРОЙДЕН! Получено +${fmt(rewardG)}g Золота и +${fmt(rewardXp)} XP!`);
    setCurrentFloor(prev => prev + 1);
    setMaxFloor(prev => Math.max(prev, currentFloor + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-4 shadow-2xl space-y-3 relative max-h-[92vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 bg-purple-500/10 border border-purple-500/30 rounded-xl">⚔️</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                БАШНЯ ИСПЫТАНИЙ БЕЗДНЫ (TOWER OF TRIALS)
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Рекорд Башни: <b className="text-purple-300 font-black">{maxFloor} Этаж</b>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tower Floor Challenge Card */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {/* Main Floor Info Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-950 to-indigo-950/60 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2.5 bg-slate-900 rounded-2xl border border-purple-500/50 shadow-inner">🗼</span>
              <div>
                <div className="text-xs text-purple-300 font-extrabold uppercase tracking-wider">Текущий Этаж Вызова</div>
                <div className="text-2xl font-black text-white font-mono">ЭТАЖ {currentFloor}</div>
                <div className="text-[11px] text-slate-400">Сложность этапа: {currentFloor * 10}% урона монстров</div>
              </div>
            </div>

            <button
              onClick={handleChallengeFloor}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:scale-105 text-white font-black text-xs border border-purple-400/60 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
            >
              <span>⚔️</span>
              <span>Сразиться на {currentFloor} Этаже</span>
            </button>
          </div>

          {/* Active Floor Modifier Card */}
          {activeMod && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border flex items-start gap-3 shadow-md" style={{ borderColor: `${activeMod.color}60` }}>
              <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">{activeMod.icon}</span>
              <div className="space-y-0.5">
                <div className="font-extrabold text-xs" style={{ color: activeMod.color }}>
                  Модификатор Этажа: {activeMod.name}
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">{activeMod.desc}</div>
              </div>
            </div>
          )}

          {/* Status Message */}
          <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl text-xs text-purple-300 font-mono">
            {logMsg}
          </div>

          {/* Floor Progress Ladder Preview */}
          <div className="space-y-1.5 pt-2">
            <div className="text-xs font-black text-slate-300 uppercase tracking-wider">Лестница Испытаний:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[currentFloor, currentFloor + 1, currentFloor + 2, currentFloor + 3].map(fl => (
                <div
                  key={fl}
                  className={`p-2.5 rounded-xl border text-center font-mono ${
                    fl === currentFloor
                      ? 'bg-purple-900/40 border-purple-400 text-purple-200 font-black ring-1 ring-purple-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 opacity-70'
                  }`}
                >
                  <div className="text-xs font-bold">Этаж {fl}</div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5">💰 +{fmt(fl * 400)}g</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
