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
  const [searchTerm, setSearchTerm] = useState('');

  const branches = heroClass.branches;
  const talentsDef = heroClass.talents;

  const visibleBranches = branches.filter(b => activeBranch === 'all' || b.id === activeBranch);

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-4 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md space-y-3 font-sans w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-lg border shrink-0"
            style={{
              backgroundColor: `${heroClass.color}20`,
              borderColor: `${heroClass.color}50`,
              boxShadow: `0 0 15px ${heroClass.color}30`
            }}
          >
            {heroClass.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-slate-100 leading-tight">Древо Талантов: {heroClass.name}</h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono font-bold">
                {talentsDef.length} талантов
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Пассивные мастерства и усилители навыков {heroClass.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono text-xs font-black transition-all ${
            points > 0
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
              : 'bg-slate-950/80 text-slate-400 border-slate-800'
          }`}>
            <span className="text-purple-400 text-sm">🌟</span>
            <span>{points} {points === 1 ? 'очко' : points > 1 && points < 5 ? 'очка' : 'очков'}</span>
          </div>
        </div>
      </div>

      {/* Branch Selector Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
          <button
            onClick={() => setActiveBranch('all')}
            className={`py-2 px-3.5 rounded-xl font-extrabold text-xs transition-all shrink-0 border ${
              activeBranch === 'all'
                ? 'bg-slate-800 border-slate-600 text-white shadow'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
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
                className={`py-2 px-3.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 border ${
                  isActive
                    ? 'bg-slate-800 border-slate-600 text-white shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                style={{ borderColor: isActive ? `${b.color}80` : undefined }}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-900 font-mono font-bold" style={{ color: b.color }}>
                  {bPoints}
                </span>
              </button>
            );
          })}
        </div>

        <input
          type="text"
          placeholder="🔍 Поиск таланта..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/60 w-44 shadow-inner"
        />
      </div>

      {/* Talent Branches Full-Width Container */}
      <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-1 w-full">
        {visibleBranches.map(b => {
          let branchTalents = talentsDef.filter(t => t.branchId === b.id);
          if (searchTerm.trim()) {
            branchTalents = branchTalents.filter(t =>
              t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.desc.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          const branchPoints = talentsDef
            .filter(t => t.branchId === b.id)
            .reduce((sum, t) => sum + (talents[t.id] ?? 0), 0);

          return (
            <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3.5 shadow-lg w-full">
              {/* Branch Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 px-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-sm" style={{ color: b.color }}>Ветка «{b.name}»</h4>
                    <p className="text-xs text-slate-400">{b.desc}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300 font-mono bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                  Вложено очков: <b className="text-sm font-black" style={{ color: b.color }}>{branchPoints}</b>
                </div>
              </div>

              {/* Rows 0 to 11 (Full Width Responsive Grid) */}
              <div className="space-y-3 w-full">
                {Array.from({ length: 12 }, (_, i) => i).map(row => {
                  const reqPoints = row * 2;
                  const isRowUnlocked = row === 0 || branchPoints >= reqPoints;
                  const rowTalents = branchTalents.filter(t => t.row === row);
                  if (rowTalents.length === 0) return null;

                  return (
                    <div key={row} className="space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold font-mono px-3 py-0.5 rounded-full border ${
                          isRowUnlocked
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-red-950/60 text-red-400 border-red-900/60'
                        }`}>
                          {row === 0 ? 'Ряд 1 (Старт)' : isRowUnlocked ? `Ряд ${row + 1}` : `🔒 Ряд ${row + 1} (нужно ${reqPoints} очков в ветку)`}
                        </span>
                        <div className="flex-1 h-[1px] bg-slate-800/80" />
                      </div>

                      {/* 3-Column Wide Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                        {rowTalents.map(t => {
                          const rank = talents[t.id] ?? 0;
                          const unlocked = isRowUnlocked;
                          const can = points > 0 && rank < t.maxRank && unlocked;
                          const isMax = rank >= t.maxRank;

                          return (
                            <div
                              key={t.id}
                              className={`rounded-2xl border p-3.5 transition-all flex flex-col justify-between w-full space-y-2.5 ${
                                !unlocked
                                  ? 'border-slate-800/80 bg-slate-950/40 opacity-40 grayscale'
                                  : isMax
                                  ? 'border-amber-500/60 bg-amber-950/20 shadow-md'
                                  : rank > 0
                                  ? 'border-purple-500/40 bg-slate-900/90 shadow-sm'
                                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-10 h-10 rounded-xl border flex items-center justify-center text-2xl shrink-0 bg-slate-900 shadow-md"
                                  style={{
                                    borderColor: rank > 0 ? b.color : '#334155',
                                    boxShadow: rank > 0 ? `0 0 12px ${b.color}40` : undefined,
                                  }}
                                >
                                  {t.icon}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-extrabold text-xs text-slate-100 leading-tight">{t.name}</span>
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                                      isMax
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                        : rank > 0
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                      {rank}/{t.maxRank}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-300 leading-snug mt-1">{t.desc}</div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                                <span className="text-[10.5px] text-emerald-400 font-bold leading-tight">
                                  {rank > 0 ? `Текущий: ${t.per(rank)}` : `Эффект: ${t.per(1)}`}
                                </span>

                                {can && (
                                  <button
                                    onClick={() => learn(t.id)}
                                    className="text-[10.5px] font-extrabold px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow active:scale-95 shrink-0"
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

      <div className="text-[10.5px] text-slate-400 text-center shrink-0 border-t border-slate-800 pt-2">
        🌟 Очки талантов выдаются каждые 5 уровней · Новые ряды открываются при вложении очков в ветку
      </div>
    </div>
  );
}
