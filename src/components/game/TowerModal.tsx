import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import type { TowerModifier } from '@/game/types';

const TOWER_MODIFIERS: TowerModifier[] = [
  { id: 'm_poison', name: 'Ядовитый Туман Бездны', icon: '☣️', desc: 'Персонаж теряет 2.5% HP каждую секунду боя.', color: '#22c55e' },
  { id: 'm_antimagic', name: 'Антимагический Купол', icon: '🛡️', desc: 'Урон от магических скиллов снижен на 50%.', color: '#38bdf8' },
  { id: 'm_nopotions', name: 'Дуэль Без Зелей', icon: '🩸', desc: 'Восстанавливающие зелья заблокированы.', color: '#ef4444' },
  { id: 'm_frenzy', name: 'Ярость Стража Башни', icon: '⚡', desc: 'Страж атакует на 50% быстрее normal.', color: '#facc15' },
  { id: 'm_vampire', name: 'Вампиризм Тьмы', icon: '🍷', desc: 'Страж восстанавливает 20% HP от урон.', color: '#a855f7' },
];

export default function TowerModal({ onClose }: { onClose: () => void }) {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [maxFloor, setMaxFloor] = useState(1);
  const [activeMod, setActiveMod] = useState<TowerModifier | null>(null);
  const [inBattle, setInBattle] = useState(false);

  // Tower Guardian Battle State
  const [guardianHp, setGuardianHp] = useState(100);
  const [guardianMaxHp, setGuardianMaxHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  const [logMsg, setLogMsg] = useState<string>('⚔️ Вы стояли у подножия Бесконечной Башни Испытаний!');

  const level = useGame(s => s.level);
  const derived = useGame(s => s.derived);

  useEffect(() => {
    const mod = TOWER_MODIFIERS[(currentFloor - 1) % TOWER_MODIFIERS.length];
    setActiveMod(mod);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFloor, onClose]);

  // Real-time Visual Battle Simulation Loop for Tower Floor
  useEffect(() => {
    if (!inBattle) return;

    // Calculate exponentially scaling Guardian stats for current Floor
    const mult = Math.pow(1.18, currentFloor - 1);
    const gHpMax = Math.round(derived.maxHp * (1.5 + mult * 0.8));
    const gDmg = Math.round((20 + currentFloor * 15) * mult);

    setGuardianMaxHp(gHpMax);
    setGuardianHp(gHpMax);
    setPlayerMaxHp(derived.maxHp);
    setPlayerHp(derived.maxHp);

    let curGHp = gHpMax;
    let curPHp = derived.maxHp;

    const interval = setInterval(() => {
      // Player Atk
      const pDmg = Math.round(derived.playerAtk * (0.8 + Math.random() * 0.4));
      curGHp = Math.max(0, curGHp - pDmg);
      setGuardianHp(curGHp);

      if (curGHp <= 0) {
        clearInterval(interval);
        setInBattle(false);

        const rewardG = Math.round(currentFloor * 500 * mult);
        const rewardXp = Math.round(currentFloor * 300 * mult);

        useGame.setState(s => ({
          gold: s.gold + rewardG,
          log: [...s.log, { id: Date.now(), text: `⚔️ ТАУЭР: Повержен Страж ${currentFloor} Этажа! +${rewardG}g`, color: '#facc15', time: Date.now() }]
        }));

        setLogMsg(`🎉 ПОБЕДА! Страж ${currentFloor} этажа повержен! Получено +${fmt(rewardG)}g Золота!`);
        setCurrentFloor(prev => prev + 1);
        setMaxFloor(prev => Math.max(prev, currentFloor + 1));
        return;
      }

      // Guardian Atk
      const gActualDmg = Math.max(5, gDmg - Math.floor(derived.armor * 0.3));
      curPHp = Math.max(0, curPHp - gActualDmg);
      setPlayerHp(curPHp);

      if (curPHp <= 0) {
        clearInterval(interval);
        setInBattle(false);
        setLogMsg(`💀 ПОРАЖЕНИЕ! Страж ${currentFloor} этажа нанес смертельный урон. Улучшите экипировку!`);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [inBattle, currentFloor, derived]);

  const handleStartBattle = () => {
    if (inBattle) return;
    setInBattle(true);
    setLogMsg(`⚔️ НАЧАЛСЯ БОЙ! Сражение со Стражем Бездны на ${currentFloor} этаже...`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-4 shadow-2xl space-y-3 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 bg-purple-500/10 border border-purple-500/30 rounded-xl">⚔️</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                БАШНЯ ИСПЫТАНИЙ БЕЗДНЫ (TOWER OF TRIALS)
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Рекорд Башни: <b className="text-purple-300 font-black">{maxFloor} Этаж</b> · Прогрессия Сложности: <b className="text-amber-300 font-black font-mono">x{Math.pow(1.18, currentFloor - 1).toFixed(1)}</b>
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

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {/* Main Battle Canvas Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="font-black text-xs text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <span>🏰</span>
                <span>Визуальная Арена Боя: Этаж {currentFloor}</span>
              </div>
              {activeMod && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold font-mono border" style={{ backgroundColor: `${activeMod.color}22`, color: activeMod.color, borderColor: `${activeMod.color}55` }}>
                  {activeMod.icon} {activeMod.name}
                </span>
              )}
            </div>

            {/* Battle Sprites & Live HP Bars */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900/90 rounded-xl border border-slate-800 relative">
              {/* Player Side */}
              <div className="space-y-2 text-center">
                <div className="text-4xl animate-bounce">🛡️</div>
                <div className="font-black text-xs text-slate-200">Ваш Герой</div>
                <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${Math.max(0, (playerHp / playerMaxHp) * 100)}%` }} />
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-black">{fmt(playerHp)} / {fmt(playerMaxHp)} HP</div>
              </div>

              {/* Tower Guardian Side */}
              <div className="space-y-2 text-center">
                <div className="text-4xl animate-pulse">👹</div>
                <div className="font-black text-xs text-purple-300">Страж Башни ({currentFloor} Ур.)</div>
                <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
                  <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${Math.max(0, (guardianHp / guardianMaxHp) * 100)}%` }} />
                </div>
                <div className="text-[10px] text-purple-300 font-mono font-black">{fmt(guardianHp)} / {fmt(guardianMaxHp)} HP</div>
              </div>
            </div>

            {/* Start Battle Button */}
            <button
              onClick={handleStartBattle}
              disabled={inBattle}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:scale-[1.02] text-white font-black text-xs border border-purple-400/60 shadow-xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>⚔️</span>
              <span>{inBattle ? 'Сражение на Арене Башни...' : `Войти в Живой Бой на ${currentFloor} Этаже`}</span>
            </button>
          </div>

          {/* Status Message */}
          <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl text-xs text-purple-300 font-mono">
            {logMsg}
          </div>

          {/* Active Modifier Description */}
          {activeMod && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <span className="text-xl">{activeMod.icon}</span>
              <div>
                <b style={{ color: activeMod.color }}>{activeMod.name}:</b> {activeMod.desc}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
