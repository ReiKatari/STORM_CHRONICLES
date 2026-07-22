import { useState } from 'react';
import { useGame } from '@/game/store';
import { BRANCHES, TALENTS } from '@/game/skills';
import type { TalentDef } from '@/game/types';

export default function TalentsPanel() {
  const talents = useGame(s => s.talents);
  const points = useGame(s => s.talentPoints);
  const learn = useGame(s => s.learnTalent);

  const [activeBranch, setActiveBranch] = useState<'all' | 'warrior' | 'mage' | 'wanderer'>('all');
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);

  const visibleBranches = BRANCHES.filter(b => activeBranch === 'all' || b.id === activeBranch);

  const selectedTalent = selectedTalentId ? TALENTS.find(t => t.id === selectedTalentId) : null;

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3.5 flex flex-col h-full shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌟</span>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 leading-tight">Древо Талантов</h3>
            <span className="text-[10px] text-slate-400">Усиливайте персонажа уникальными перками</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black px-3 py-1 rounded-full border transition-all ${
            points > 0
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {points} {points === 1 ? 'очко' : points > 1 && points < 5 ? 'очка' : 'очков'}
          </span>
        </div>
      </div>

      {/* Branch Tabs */}
      <div className="flex gap-1.5 mb-3 bg-slate-950/60 p-1 rounded-lg border border-slate-800 shrink-0">
        <button
          onClick={() => setActiveBranch('all')}
          className={`flex-1 text-[11px] py-1 px-2 rounded-md font-bold transition-all ${
            activeBranch === 'all' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🌐 Все ветки
        </button>
        {BRANCHES.map(b => {
          const bTalents = TALENTS.filter(t => t.branch === b.id);
          const bPoints = bTalents.reduce((sum, t) => sum + (talents[t.id] ?? 0), 0);
          const isActive = activeBranch === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveBranch(b.id)}
              className={`flex-1 text-[11px] py-1 px-2 rounded-md font-bold flex items-center justify-center gap-1 transition-all ${
                isActive ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{ color: isActive ? b.color : undefined }}
            >
              <span>{b.icon}</span>
              <span>{b.name}</span>
              <span className="text-[9px] px-1 rounded bg-slate-900/60 font-mono" style={{ color: b.color }}>{bPoints}</span>
            </button>
          );
        })}
      </div>

      {/* Branches Container */}
      <div className="space-y-4 overflow-y-auto flex-1 pr-1" style={{ maxHeight: 420 }}>
        {visibleBranches.map(b => {
          const branchTalents = TALENTS.filter(t => t.branch === b.id);
          const branchPoints = branchTalents.reduce((sum, t) => sum + (talents[t.id] ?? 0), 0);

          return (
            <div key={b.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5 space-y-2">
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

              {/* Rows */}
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map(row => {
                  const reqPoints = row * 3;
                  const isRowUnlocked = row === 0 || branchPoints >= reqPoints;
                  const rowTalents = branchTalents.filter(t => t.row === row);

                  return (
                    <div key={row} className="relative">
                      {/* Row Requirement Badge */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${
                          isRowUnlocked
                            ? 'bg-slate-800/70 text-slate-300 border-slate-700/60'
                            : 'bg-red-950/40 text-red-400 border-red-900/50'
                        }`}>
                          {row === 0 ? 'Старт' : isRowUnlocked ? `Ряд ${row + 1}` : `🔒 Ряд ${row + 1} (нужно ${reqPoints} очк. в ветке)`}
                        </span>
                        <div className="flex-1 h-[1px] bg-slate-800/60" />
                      </div>

                      {/* Talent Cards Grid */}
                      <div className={`grid gap-2 ${activeBranch === 'all' ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-2'}`}>
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
                              className={`group relative rounded-lg border p-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                                !unlocked
                                  ? 'border-slate-800/80 bg-slate-900/20 opacity-50 grayscale'
                                  : isMax
                                  ? 'border-amber-500/50 bg-slate-850/80 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                                  : rank > 0
                                  ? 'border-emerald-500/40 bg-slate-800/80'
                                  : 'border-slate-700/60 bg-slate-900/60 hover:border-slate-600'
                              } ${isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''}`}
                            >
                              <div className="flex items-start gap-2 mb-1.5">
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
                                    <span className={`text-[9px] font-mono font-bold px-1 rounded ${
                                      isMax
                                        ? 'bg-amber-500/20 text-amber-300'
                                        : rank > 0
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}>
                                      {rank}/{t.maxRank}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 leading-tight line-clamp-1">{t.desc}</div>
                                </div>
                              </div>

                              {/* Progress bar & Effect */}
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
                                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all animate-bounce active:scale-95 shrink-0"
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

      {/* Selected Talent Detailed Card / Quick Inspector */}
      {selectedTalent && (
        <div className="mt-2 p-2.5 rounded-lg border border-purple-500/40 bg-purple-950/30 text-xs shrink-0 flex items-center justify-between gap-3 animate-fadeIn">
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
      <div className="mt-2 text-[10px] text-slate-500 text-center shrink-0">
        🌟 Очки талантов выдаются каждые 5 уровней · Новые ряды открываются за каждые 3 очка в ветке
      </div>
    </div>
  );
}
