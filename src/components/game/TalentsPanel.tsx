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
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-4 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl shadow-lg border"
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
              <h3 className="font-black text-sm text-slate-100 leading-tight">Древо Талантов: {heroClass.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-purple-300 font-mono font-bold">
                {talentsDef.length} талантов
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Пассивные мастерства {heroClass.title} (36 талантов)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-black transition-all ${
            points > 0
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
              : 'bg-slate-950/80 text-slate-400 border-slate-800'
          }`}>
            <span className="text-purple-400">🌟</span>
            <span>{points} {points === 1 ? 'очко' : points > 1 && points < 5 ? 'очка' : 'очков'}</span>
          </div>
        </div>
      </div>

      {/* Branch Selector Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none flex-1">
          <button
            onClick={() => setActiveBranch('all')}
            className={`py-1.5 px-3 rounded-xl font-extrabold text-[11px] transition-all truncate border ${
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
                className={`py-1.5 px-3 rounded-xl font-extrabold text-[11px] flex items-center gap-1.5 transition-all truncate border ${
                  isActive
                    ? 'bg-slate-800 border-slate-600 text-white shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                style={{ borderColor: isActive ? `${b.color}80` : undefined }}
              >
                <span>{b.icon}</span>
                <span className="truncate">{b.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 font-mono font-bold" style={{ color: b.color }}>
                  {bPoints}
                </span>
              </button>
            );
          })}
        </div>

        <input
          type="text"
          placeholder="Поиск таланта..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60 w-36"
        />
      </div>

      {/* Talent Branches List */}
      <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-1">
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
            <div key={b.id} className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-3.5 space-y-3 relative shadow-inner">
              {/* Branch Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-xs" style={{ color: b.color }}>Ветка «{b.name}»</h4>
                    <p className="text-[10px] text-slate-400">{b.desc}</p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 font-mono bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                  Вложено: <b className="text-xs" style={{ color: b.color }}>{branchPoints}</b> очков
                </div>
              </div>

              {/* Rows 0 to 11 */}
              <div className="space-y-2.5">
                {Array.from({ length: 12 }, (_, i) => i).map(row => {
                  const reqPoints = row * 2;
                  const isRowUnlocked = row === 0 || branchPoints >= reqPoints;
                  const rowTalents = branchTalents.filter(t => t.row === row);
                  if (rowTalents.length === 0) return null;

                  return (
                    <div key={row} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                          isRowUnlocked
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-red-950/60 text-red-400 border-red-900/60'
                        }`}>
                          {row === 0 ? 'Ряд 1 (Старт)' : isRowUnlocked ? `Ряд ${row + 1}` : `🔒 Ряд ${row + 1} (нужно ${reqPoints} очков в ветку)`}
                        </span>
                        <div className="flex-1 h-[1px] bg-slate-800/80" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {rowTalents.map(t => {
                          const rank = talents[t.id] ?? 0;
                          const unlocked = isRowUnlocked;
                          const can = points > 0 && rank < t.maxRank && unlocked;
                          const isMax = rank >= t.maxRank;

                          return (
                            <div
                              key={t.id}
                              className={`rounded-xl border p-2.5 transition-all flex flex-col justify-between ${
                                !unlocked
                                  ? 'border-slate-800 bg-slate-950/40 opacity-40 grayscale'
                                  : isMax
                                  ? 'border-amber-500/60 bg-amber-950/20 shadow-md'
                                  : rank > 0
                                  ? 'border-purple-500/40 bg-slate-900/90 shadow-sm'
                                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                  className="w-9 h-9 rounded-xl border flex items-center justify-center text-xl shrink-0 bg-slate-900 shadow"
                                  style={{
                                    borderColor: rank > 0 ? b.color : '#334155',
                                    boxShadow: rank > 0 ? `0 0 10px ${b.color}40` : undefined,
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
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                      {rank}/{t.maxRank}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-300 leading-snug mt-0.5">{t.desc}</div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-2 pt-1.5 mt-1.5 border-t border-slate-800/80">
                                <span className="text-[10px] text-emerald-400 font-bold truncate">
                                  {rank > 0 ? `Текущий: ${t.per(rank)}` : `Эффект: ${t.per(1)}`}
                                </span>

                                {can && (
                                  <button
                                    onClick={() => learn(t.id)}
                                    className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow active:scale-95 shrink-0"
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

      <div className="text-[10px] text-slate-400 text-center shrink-0 border-t border-slate-800 pt-1.5">
        🌟 Очки талантов выдаются каждые 5 уровней · Новые ряды открываются при вложении очков в ветку
      </div>
    </div>
  );
}
