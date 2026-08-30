import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';
import { EXPEDITIONS_CATALOG } from '@/game/expeditions';
import { fmt } from '@/game/engine';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export default function ExpeditionsModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const mercenaries = useGame(s => s.mercenaries || []);
  const activeExpeditions = useGame(s => s.activeExpeditions || []);
  const hireMercenary = useGame(s => s.hireMercenary);
  const startExpedition = useGame(s => s.startExpedition);
  const claimExpedition = useGame(s => s.claimExpedition);
  const gold = useGame(s => s.gold);

  const [, setTick] = useState(0);
  useEffect(() => {
    const int = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(int);
  }, []);

  const [selectedSquadId, setSelectedSquadId] = useState<string>(mercenaries[0]?.id || 'merc_wolves');
  const selectedSquad = mercenaries.find(m => m.id === selectedSquadId) || mercenaries[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-4xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-slate-900 border border-blue-500/40 flex items-center justify-center text-2xl shadow-lg">
              🛡️
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Экспедиции Наёмников & Гарнизон</span>
              </h2>
              <p className="text-xs text-slate-400">
                Автономный сбор золота, камней заточки, редких трав и самоцветов
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[ESC]</span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-red-950/80 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 hover:border-red-500/50 transition-all cursor-pointer shadow"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Squad Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 shrink-0">
          {mercenaries.map(squad => {
            const isHired = squad.hired;
            const exp = activeExpeditions.find(e => e.squadId === squad.id);
            const isBusy = !!exp;

            return (
              <button
                key={squad.id}
                onClick={() => setSelectedSquadId(squad.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  selectedSquadId === squad.id
                    ? 'border-blue-500/80 bg-blue-500/15 shadow-[0_0_15px_rgba(59,130,246,0.25)] scale-[1.02]'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{squad.icon}</span>
                  <span className="text-[9.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                    Ур. {squad.level}
                  </span>
                </div>
                <div className="text-[11px] font-black text-white truncate">{squad.name}</div>
                <div className="text-[9.5px] text-slate-400 mt-0.5">
                  Мощь: <span className="text-amber-300 font-bold font-mono">⚡{squad.power}</span>
                </div>

                <div className="mt-1.5 text-[8.5px] font-bold">
                  {!isHired ? (
                    <span className="text-amber-400">Нанять ({fmt(squad.cost)})</span>
                  ) : isBusy ? (
                    <span className="text-cyan-400 animate-pulse">В походе...</span>
                  ) : (
                    <span className="text-emerald-400">В лагере</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Squad Details & Missions */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {selectedSquad && !selectedSquad.hired && (
            <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
              <div>
                <div className="text-sm font-black text-white">
                  Нанять отряд: {selectedSquad.name}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Боевая мощь отряда: <b className="text-amber-300">⚡{selectedSquad.power}</b>
                </div>
              </div>
              <button
                onClick={() => hireMercenary(selectedSquad.id)}
                disabled={gold < selectedSquad.cost}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                Нанять за {fmt(selectedSquad.cost)} золота
              </button>
            </div>
          )}

          {selectedSquad && selectedSquad.hired && (
            <div className="space-y-3">
              <div className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <span>🚩 ДОСТУПНЫЕ ЭКСПЕДИЦИИ ДЛЯ ОТРЯДА «{selectedSquad.name}»</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {EXPEDITIONS_CATALOG.map(mission => {
                  const exp = activeExpeditions.find(e => e.squadId === selectedSquad.id);
                  const isBusyThis = exp?.missionId === mission.id;
                  const isSquadBusy = !!exp;
                  const now = Date.now();
                  const isDone = isBusyThis && exp && exp.endTimestamp <= now;
                  const timeLeft = exp ? Math.max(0, Math.ceil((exp.endTimestamp - now) / 1000)) : 0;
                  const canAffordPower = selectedSquad.power >= mission.minPower;

                  return (
                    <div
                      key={mission.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl p-1 bg-slate-900 rounded-xl border border-slate-800">{mission.icon}</span>
                            <div>
                              <div className="text-xs font-black text-white">{mission.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Время похода: {Math.floor(mission.durationSec / 60)} минут
                              </div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                            canAffordPower ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-red-950/80 text-red-300 border-red-500/40'
                          }`}>
                            ⚡Требуется: {mission.minPower} мощи
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{mission.desc}</p>
                      </div>

                      {/* Reward Pill */}
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono font-bold bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                        <div className="text-amber-300 flex items-center gap-1">
                          <span>💰</span>
                          <span>+{fmt(mission.rewardGold)}</span>
                        </div>
                        <div className="text-sky-300 flex items-center gap-1">
                          <span>📈</span>
                          <span>+{fmt(mission.rewardXp)} Опыта</span>
                        </div>
                        <div className="text-emerald-300 flex items-center gap-1">
                          <span>💎</span>
                          <span>+{mission.rewardStones} Камней</span>
                        </div>
                      </div>

                      {/* Action / Status */}
                      <div>
                        {isBusyThis ? (
                          isDone ? (
                            <button
                              onClick={() => claimExpedition(selectedSquad.id)}
                              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 animate-bounce cursor-pointer"
                            >
                              🎁 Забрать добычу экспедиции!
                            </button>
                          ) : (
                            <div className="p-2 bg-slate-900 border border-sky-500/30 rounded-xl text-center">
                              <span className="text-xs text-sky-300 font-black font-mono animate-pulse">
                                ⏳ В походе: осталось {Math.floor(timeLeft / 60)} мин {timeLeft % 60} сек
                              </span>
                            </div>
                          )
                        ) : (
                          <button
                            onClick={() => startExpedition(selectedSquad.id, mission.id)}
                            disabled={isSquadBusy || !canAffordPower}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 text-white font-black text-xs shadow transition-all active:scale-95 cursor-pointer"
                          >
                            {isSquadBusy
                              ? 'Отряд уже на задании'
                              : !canAffordPower
                              ? 'Недостаточно мощи отряда'
                              : 'Отправить отряд в поход'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
