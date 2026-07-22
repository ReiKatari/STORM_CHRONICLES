import { useState } from 'react';
import { useGame } from '@/game/store';
import { getClassById } from '@/game/classes';

export default function TalentsPanel() {
  const classId = useGame(s => s.classId);
  const heroClass = getClassById(classId);

  const talents = useGame(s => s.talents);
  const points = useGame(s => s.talentPoints);
  const learn = useGame(s => s.learnTalent);

  const [activeBranch, setActiveBranch] = useState<string>('all');
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);

  const branches = heroClass.branches;
  const talentsDef = heroClass.talents;

  const visibleBranches = branches.filter(b => activeBranch === 'all' || b.id === activeBranch);
  const selectedTalent = selectedTalentId ? talentsDef.find(t => t.id === selectedTalentId) : null;

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-4 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md space-y-3">
      {/* Premium Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            {heroClass.icon}
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 leading-tight">Древо Талантов: {heroClass.name}</h3>
            <span className="text-[11px] text-slate-400">Уникальные ветки пассивных способностей</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3.5 py-1 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-black transition-all ${
            points > 0
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/60 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'bg-slate-950/80 text-slate-400 border-slate-800'
          }`}>
            <span className="text-purple-400">🌟</span>
            <span>{points} {points === 1 ? 'очко' : points > 1 && points < 5 ? 'очка' : 'очков'}</span>
          </div>
        </div>
      </div>

      {/* Branch Tabs */}
      <div className="flex gap-2 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800 shrink-0">
        <button
          onClick={() => setActiveBranch('all')}
          className={`flex-1 text-xs py-1.5 px-2 rounded-lg font-bold transition-all ${
            activeBranch === 'all' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🌐 Все ветки ({branches.length})
        </button>
        {branches.map(b => {
          const bTalents = talentsDef.filter(t => t.branchId === b.id);
          const bPoints = bTalents.reduce((sum, t) => sum + (talents[t.id] ?? 0), 0);
          const isActive = activeBranch === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveBranch(b.id)}
              className={`flex-1 text-xs py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                isActive ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{ color: isActive ? b.color : undefined }}
            >
              <span className="text-sm">{b.icon}</span>
              <span className="truncate">{b.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/80 font-mono font-bold" style={{ color: b.color }}>{bPoints}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Tree Branches Container with Wider Information Cards */}
      <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-1">
        {visibleBranches.map(b => {
          const branchTalents = talentsDef.filter(t => t.branchId === b.id);
          const branchPoints = branchTalents.reduce((sum, t) => sum + (talents[t.id] ?? 0), 0);

          return (
            <div key={b.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-3 relative overflow-hidden">
              {/* Branch Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{b.icon}</span>
                  <span className="font-bold text-sm" style={{ color: b.color }}>Ветка {b.name}</span>
                  <span className="text-xs text-slate-400">({b.desc})</span>
                </div>
                <span className="text-xs text-slate-300 font-mono">
                  Вложено: <b className="text-sm" style={{ color: b.color }}>{branchPoints}</b> очков
                </span>
              </div>

              {/* Rows (5 Tiers) */}
              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map(row => {
                  const reqPoints = row * 2;
                  const isRowUnlocked = row === 0 || branchPoints >= reqPoints;
                  const rowTalents = branchTalents.filter(t => t.row === row);
                  if (rowTalents.length === 0) return null;

                  return (
                    <div key={row} className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isRowUnlocked
                            ? 'bg-slate-800/80 text-slate-200 border-slate-700/60'
                            : 'bg-red-950/50 text-red-400 border-red-900/60'
                        }`}>
                          {row === 0 ? 'Ряд 1 (Старт)' : isRowUnlocked ? `Ряд ${row + 1}` : `🔒 Ряд ${row + 1} (нужно ${reqPoints} очка)`}
                        </span>
                        <div className="flex-1 h-[1px] bg-slate-800/80" />
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {rowTalents.map(t => {
                          const rank = talents[t.id] ?? 0;
                          const unlocked = isRowUnlocked;
                          const can = points > 0 && rank < t.maxRank && unlocked;
                          const isMax = rank >= t.maxRank;
                          const isSelected = selectedTalentId === t.id;

                          return (
                            <div
                              key={t.id}
                              onClick={() => setSelectedTalentId(t.id)}
                              className={`group relative rounded-xl border p-3 text-left transition-all cursor-pointer flex flex-col justify-between ${
                                !unlocked
                                  ? 'border-slate-800/80 bg-slate-900/20 opacity-50 grayscale'
                                  : isMax
                                  ? 'border-amber-500/60 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                  : rank > 0
                                  ? 'border-emerald-500/50 bg-slate-850/90'
                                  : 'border-slate-700/70 bg-slate-900/70 hover:border-slate-600'
                              } ${isSelected ? 'ring-2 ring-purple-500 shadow-2xl' : ''}`}
                            >
                              <div className="flex items-start gap-3 mb-1.5">
                                <div
                                  className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105 ${
                                    rank > 0 ? 'bg-slate-800' : 'bg-slate-900'
                                  }`}
                                  style={{
                                    borderColor: rank > 0 ? b.color : '#334155',
                                    boxShadow: rank > 0 ? `0 0 12px ${b.color}44` : undefined,
                                  }}
                                >
                                  {t.icon}
                                </div>

                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-extrabold text-xs text-slate-100 truncate">{t.name}</span>
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                      isMax
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                        : rank > 0
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                      Ранг {rank}/{t.maxRank}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-300 leading-normal">{t.desc}</div>
                                </div>
                              </div>

                              <div className="mt-2 space-y-1.5 pt-1 border-t border-slate-800/60">
                                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                  <div
                                    className="h-full transition-all duration-300"
                                    style={{
                                      width: `${(rank / t.maxRank) * 100}%`,
                                      backgroundColor: b.color,
                                    }}
                                  />
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-0.5">
                                  <span className="text-[10px] text-emerald-400 font-semibold truncate">
                                    {rank > 0 ? `Эффект: ${t.per(rank)}` : `1 ранг: ${t.per(1)}`}
                                  </span>

                                  {can && (
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        learn(t.id);
                                      }}
                                      className="text-[10px] font-bold px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all animate-bounce shrink-0 active:scale-95"
                                    >
                                      +1 Изучить
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Talent Detailed Information Banner */}
      {selectedTalent && (
        <div className="mt-2 p-3 rounded-xl border border-purple-500/50 bg-purple-950/60 text-xs shrink-0 flex items-center justify-between gap-3 animate-fadeIn shadow-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-purple-500/40">{selectedTalent.icon}</span>
            <div className="min-w-0 space-y-0.5">
              <div className="font-extrabold text-purple-200 text-xs truncate">
                {selectedTalent.name} <span className="text-[10px] text-slate-400 font-mono">({talents[selectedTalent.id] ?? 0}/{selectedTalent.maxRank})</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-tight">{selectedTalent.desc}</div>
              <div className="text-[11px] text-emerald-400 font-bold">
                {talents[selectedTalent.id] ? `Эффект: ${selectedTalent.per(talents[selectedTalent.id])}` : `Первый ранг: ${selectedTalent.per(1)}`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedTalentId(null)}
            className="text-[10px] text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-2 text-[10px] text-slate-400 text-center shrink-0 border-t border-slate-800 pt-1.5">
        🌟 Очки выдаются каждые 5 уровней · Новые ряды открываются при вложении очков в ветку
      </div>
    </div>
  );
}
