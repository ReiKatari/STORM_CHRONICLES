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
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-xl shadow-md">
            {heroClass.icon}
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-100 leading-tight">Древо Талантов: {heroClass.name}</h3>
            <span className="text-[10px] text-slate-400">Уникальные ветки пассивных способностей</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-black px-2.5 py-1 rounded-lg border bg-purple-950/80 text-purple-300 border-purple-500/50 shadow-md">
          <span>🌟</span>
          <span>{points} {points === 1 ? 'очко' : points > 1 && points < 5 ? 'очка' : 'очков'}</span>
        </div>
      </div>

      {/* Branch Tabs Grid */}
      <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
        <button
          onClick={() => setActiveBranch('all')}
          className={`py-1.5 px-1 rounded-lg font-extrabold text-[10px] transition-all truncate text-center ${
            activeBranch === 'all' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🌐 Все ({branches.length})
        </button>
        {branches.map(b => {
          const bTalents = talentsDef.filter(t => t.branchId === b.id);
          const bPoints = bTalents.reduce((sum, t) => sum + (talents[t.id] ?? 0), 0);
          const isActive = activeBranch === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveBranch(b.id)}
              className={`py-1.5 px-1 rounded-lg font-extrabold text-[10px] flex items-center justify-center gap-1 transition-all truncate ${
                isActive ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{ color: isActive ? b.color : undefined }}
            >
              <span>{b.icon}</span>
              <span className="truncate">{b.name}</span>
              <span className="text-[9px] px-1 rounded bg-slate-900 font-mono font-bold" style={{ color: b.color }}>{bPoints}</span>
            </button>
          );
        })}
      </div>

      {/* Talent Branches View */}
      <div className="space-y-3 overflow-y-auto flex-1 min-h-0 pr-1">
        {visibleBranches.map(b => {
          const branchTalents = talentsDef.filter(t => t.branchId === b.id);
          const branchPoints = branchTalents.reduce((sum, t) => sum + (talents[t.id] ?? 0), 0);

          return (
            <div key={b.id} className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-2.5 space-y-2 relative">
              {/* Branch Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 px-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base">{b.icon}</span>
                  <span className="font-extrabold text-xs truncate" style={{ color: b.color }}>Ветка «{b.name}»</span>
                </div>
                <span className="text-[10px] text-slate-300 font-mono shrink-0">
                  Вложено: <b className="text-xs" style={{ color: b.color }}>{branchPoints}</b> очков
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map(row => {
                  const reqPoints = row * 2;
                  const isRowUnlocked = row === 0 || branchPoints >= reqPoints;
                  const rowTalents = branchTalents.filter(t => t.row === row);
                  if (rowTalents.length === 0) return null;

                  return (
                    <div key={row} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${
                          isRowUnlocked
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-red-950/60 text-red-400 border-red-900/60'
                        }`}>
                          {row === 0 ? 'Ряд 1 (Старт)' : isRowUnlocked ? `Ряд ${row + 1}` : `🔒 Ряд ${row + 1} (нужно ${reqPoints} очка)`}
                        </span>
                        <div className="flex-1 h-[1px] bg-slate-800" />
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
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
                              className={`rounded-xl border p-2.5 transition-all cursor-pointer space-y-1.5 ${
                                !unlocked
                                  ? 'border-slate-800 bg-slate-950/40 opacity-50 grayscale'
                                  : isMax
                                  ? 'border-amber-500/60 bg-amber-950/20 shadow-md'
                                  : rank > 0
                                  ? 'border-emerald-500/50 bg-slate-900/90'
                                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                              } ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-lg shrink-0"
                                  style={{
                                    borderColor: rank > 0 ? b.color : '#334155',
                                    backgroundColor: '#0f172a',
                                  }}
                                >
                                  {t.icon}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-extrabold text-xs text-slate-100 truncate">{t.name}</span>
                                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                                      isMax
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                        : rank > 0
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                      {rank}/{t.maxRank}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-300 leading-tight mt-0.5">{t.desc}</div>
                                </div>
                              </div>

                              {/* Progress bar & action button */}
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                                <span className="text-[10px] text-emerald-400 font-bold truncate">
                                  {rank > 0 ? `Эффект: ${t.per(rank)}` : `1 ранг: ${t.per(1)}`}
                                </span>

                                {can && (
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      learn(t.id);
                                    }}
                                    className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow active:scale-95 shrink-0"
                                  >
                                    +1 Изучить
                                  </button>
                                )}
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

      {/* Footer Info */}
      <div className="text-[9px] text-slate-400 text-center shrink-0 border-t border-slate-800 pt-1">
        🌟 Очки выдаются каждые 5 уровней · Новые ряды открываются при вложении очков в ветку
      </div>
    </div>
  );
}
