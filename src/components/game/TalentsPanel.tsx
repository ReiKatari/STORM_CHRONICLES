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
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3.5 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md">
      {/* Premium Header */}
      <div className="flex items-center justify-between gap-2 mb-2 border-b border-slate-800 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{heroClass.icon}</span>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 leading-tight">Древо Талантов: {heroClass.name}</h3>
            <span className="text-[10px] text-slate-400">Уникальные ветки навыков класса «{heroClass.name}»</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-black transition-all ${
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
      <div className="flex gap-1.5 mb-2.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 shrink-0">
        <button
          onClick={() => setActiveBranch('all')}
          className={`flex-1 text-[11px] py-1 px-2 rounded-lg font-bold transition-all ${
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
              className={`flex-1 text-[11px] py-1 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                isActive ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{ color: isActive ? b.color : undefined }}
            >
              <span>{b.icon}</span>
              <span className="truncate">{b.name}</span>
              <span className="text-[9px] px-1 rounded bg-slate-900/60 font-mono" style={{ color: b.color }}>{bPoints}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Tree Branches Container */}
      <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-1">
        {visibleBranches.map(b => {
          const branchTalents = talentsDef.filter(t => t.branchId === b.id);
          const branchPoints = branchTalents.reduce((sum, t) => sum + (talents[t.id] ?? 0), 0);

          return (
            <div key={b.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5 space-y-2 relative overflow-hidden">
              {/* Branch Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{b.icon}</span>
                  <span className="font-bold text-xs" style={{ color: b.color }}>Ветка {b.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Вложено: <b style={{ color: b.color }}>{branchPoints}</b> очков
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
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                          isRowUnlocked
                            ? 'bg-slate-800/70 text-slate-300 border-slate-700/60'
                            : 'bg-red-950/40 text-red-400 border-red-900/50'
                        }`}>
                          {row === 0 ? 'Ряд 1' : isRowUnlocked ? `Ряд ${row + 1}` : `🔒 Ряд ${row + 1} (нужно ${reqPoints} очк.)`}
                        </span>
                        <div className="flex-1 h-[1px] bg-slate-800/60" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                              className={`group relative rounded-xl border p-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                                !unlocked
                                  ? 'border-slate-800/80 bg-slate-900/20 opacity-50 grayscale'
                                  : isMax
                                  ? 'border-amber-500/60 bg-amber-950/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                                  : rank > 0
                                  ? 'border-emerald-500/50 bg-slate-850/80'
                                  : 'border-slate-700/60 bg-slate-900/60 hover:border-slate-600'
                              } ${isSelected ? 'ring-2 ring-purple-500 shadow-xl' : ''}`}
                            >
                              <div className="flex items-start gap-2 mb-1">
                                <div
                                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-105 ${
                                    rank > 0 ? 'bg-slate-800' : 'bg-slate-900'
                                  }`}
                                  style={{
                                    borderColor: rank > 0 ? b.color : '#334155',
                                    boxShadow: rank > 0 ? `0 0 10px ${b.color}44` : undefined,
                                  }}
                                >
                                  {t.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-[11px] truncate text-slate-100">{t.name}</span>
                                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                      isMax
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                        : rank > 0
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}>
                                      {rank}/{t.maxRank}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 leading-tight line-clamp-1">{t.desc}</div>
                                </div>
                              </div>

                              <div className="mt-1 space-y-1">
                                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                  <div
                                    className="h-full transition-all duration-300"
                                    style={{
                                      width: `${(rank / t.maxRank) * 100}%`,
                                      backgroundColor: b.color,
                                    }}
                                  />
                                </div>

                                <div className="flex items-center justify-between gap-1 pt-0.5">
                                  <span className="text-[9px] text-slate-400 truncate">
                                    {rank > 0 ? `Сейчас: ${t.per(rank)}` : `1 ранг: ${t.per(1)}`}
                                  </span>

                                  {can && (
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        learn(t.id);
                                      }}
                                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all animate-bounce shrink-0 active:scale-95"
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

      {/* Selected Talent Card */}
      {selectedTalent && (
        <div className="mt-2 p-2.5 rounded-xl border border-purple-500/40 bg-purple-950/40 text-xs shrink-0 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl p-1.5 bg-slate-900 rounded-lg border border-purple-500/30">{selectedTalent.icon}</span>
            <div className="min-w-0">
              <div className="font-bold text-purple-200 truncate">{selectedTalent.name} <span className="text-[10px] text-slate-400">({talents[selectedTalent.id] ?? 0}/{selectedTalent.maxRank})</span></div>
              <div className="text-[10px] text-slate-300">{selectedTalent.desc}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                {talents[selectedTalent.id] ? `Эффект: ${selectedTalent.per(talents[selectedTalent.id])}` : `Первый ранг: ${selectedTalent.per(1)}`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedTalentId(null)}
            className="text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800"
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
