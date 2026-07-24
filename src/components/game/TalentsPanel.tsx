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
  const [filter, setFilter] = useState<'all' | 'learned' | 'upgradeable' | 'locked'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const branches = heroClass.branches;
  const talentsDef = heroClass.talents;

  const branchPointsMap: Record<string, number> = {};
  branches.forEach(b => {
    branchPointsMap[b.id] = talentsDef
      .filter(t => t.branchId === b.id)
      .reduce((sum, t) => sum + (talents[t.id] ?? 0), 0);
  });

  const filteredTalents = talentsDef.filter(t => {
    const bPoints = branchPointsMap[t.branchId] ?? 0;
    const reqPoints = t.row * 2;
    const isUnlocked = t.row === 0 || bPoints >= reqPoints;
    const rank = talents[t.id] ?? 0;
    const canUpgrade = points > 0 && rank < t.maxRank && isUnlocked;

    if (activeBranch !== 'all' && t.branchId !== activeBranch) return false;

    if (searchTerm.trim() && !t.name.toLowerCase().includes(searchTerm.toLowerCase()) && !t.desc.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (filter === 'learned') return rank > 0;
    if (filter === 'upgradeable') return canUpgrade;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-4 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md font-sans w-full">
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
              <h3 className="font-black text-sm text-slate-100 leading-tight">Древо Талантов: {heroClass.name}</h3>
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

      {/* Branch Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none shrink-0">
        <button
          onClick={() => setActiveBranch('all')}
          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all shrink-0 border ${
            activeBranch === 'all'
              ? 'bg-slate-800 border-slate-600 text-white shadow font-black'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          🌐 Все Ветки ({branches.length})
        </button>
        {branches.map(b => {
          const bPoints = branchPointsMap[b.id] ?? 0;
          const isActive = activeBranch === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveBranch(b.id)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all shrink-0 border ${
                isActive
                  ? 'bg-slate-800 border-slate-600 text-white shadow font-black'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              style={{ borderColor: isActive ? `${b.color}80` : undefined }}
            >
              <span>{b.icon}</span>
              <span>{b.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-900 font-mono font-bold" style={{ color: b.color }}>
                {bPoints}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Status Filter Tabs & Search Bar (Identical Compact Style as SkillsPanel) */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              filter === 'all' ? 'bg-purple-600 text-white shadow-md font-black' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Все ({talentsDef.length})
          </button>
          <button
            onClick={() => setFilter('learned')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              filter === 'learned' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Изученные ({talentsDef.filter(t => (talents[t.id] ?? 0) > 0).length})
          </button>
          <button
            onClick={() => setFilter('upgradeable')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              filter === 'upgradeable' ? 'bg-amber-400 text-slate-950 shadow-md font-black' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Доступные ({talentsDef.filter(t => {
              const bPoints = branchPointsMap[t.branchId] ?? 0;
              const reqPoints = t.row * 2;
              const isUnlocked = t.row === 0 || bPoints >= reqPoints;
              return points > 0 && (talents[t.id] ?? 0) < t.maxRank && isUnlocked;
            }).length})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              filter === 'locked' ? 'bg-slate-700 text-slate-200 shadow-md font-black' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Заблокированные ({talentsDef.filter(t => {
              const bPoints = branchPointsMap[t.branchId] ?? 0;
              const reqPoints = t.row * 2;
              return t.row > 0 && bPoints < reqPoints;
            }).length})
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Поиск таланта..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60 w-36 shadow-inner"
        />
      </div>

      {/* Single Column Vertical Stack (1 Talent Per Row - Exactly Like SkillsPanel) */}
      <div className="space-y-2.5 overflow-y-auto flex-1 min-h-0 pr-1 w-full">
        {filteredTalents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center text-slate-500 text-xs">
            <span className="text-2xl mb-1">🔍</span>
            Таланты по выбранным фильтрам не найдены
          </div>
        ) : (
          filteredTalents.map(t => {
            const branch = branches.find(b => b.id === t.branchId);
            const bPoints = branchPointsMap[t.branchId] ?? 0;
            const reqPoints = t.row * 2;
            const isUnlocked = t.row === 0 || bPoints >= reqPoints;
            const rank = talents[t.id] ?? 0;
            const can = points > 0 && rank < t.maxRank && isUnlocked;
            const isMax = rank >= t.maxRank;

            return (
              <div
                key={t.id}
                className={`rounded-2xl border p-3.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 w-full ${
                  !isUnlocked
                    ? 'border-slate-800/80 bg-slate-950/40 opacity-50 grayscale'
                    : isMax
                    ? 'border-amber-500/60 bg-amber-950/20 shadow-md'
                    : rank > 0
                    ? 'border-purple-500/40 bg-slate-950/80 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                {/* Left Section: Icon & Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Large Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shrink-0 bg-slate-900 shadow-md relative"
                    style={{
                      borderColor: rank > 0 ? branch?.color || '#a855f7' : '#334155',
                      boxShadow: rank > 0 ? `0 0 14px ${branch?.color || '#a855f7'}44` : undefined,
                    }}
                  >
                    {t.icon}
                  </div>

                  {/* Main Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-sm text-slate-100 leading-tight">{t.name}</h4>

                      {/* Branch Badge */}
                      <span
                        className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full border font-mono"
                        style={{
                          backgroundColor: `${branch?.color || '#a855f7'}20`,
                          color: branch?.color || '#a855f7',
                          borderColor: `${branch?.color || '#a855f7'}40`
                        }}
                      >
                        {branch?.icon} {branch?.name}
                      </span>

                      {/* Row Pill */}
                      <span className="text-[9.5px] font-bold font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {t.row === 0 ? 'Ряд 1 (Старт)' : `Ряд ${t.row + 1}`}
                      </span>

                      {/* Rank Badge */}
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                        isMax
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : rank > 0
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        Ранг {rank}/{t.maxRank}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-slate-300 leading-relaxed">{t.desc}</p>

                    {/* Effect Line */}
                    <div className="flex flex-wrap items-center gap-3 pt-0.5">
                      <span className="text-[11px] text-emerald-400 font-bold">
                        {rank > 0 ? `Текущий эффект: ${t.per(rank)}` : `Эффект за ранг: ${t.per(1)}`}
                      </span>
                      {rank > 0 && !isMax && (
                        <span className="text-[10.5px] text-purple-300 font-medium">
                          ➜ Следующий: {t.per(rank + 1)}
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="text-[10px] text-red-400 font-semibold">
                          🔒 Требуется {reqPoints} очков в ветку «{branch?.name}»
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section: Upgrade Button */}
                {can && (
                  <button
                    onClick={() => learn(t.id)}
                    className="rpg-button-primary px-4 py-2 rounded-xl text-xs font-black shrink-0 self-end md:self-center"
                  >
                    +1 Изучить
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="text-[10.5px] text-slate-400 text-center shrink-0 border-t border-slate-800 pt-2">
        🌟 Очки талантов выдаются каждые 5 уровней · Новые ряды открываются при вложении очков в ветку
      </div>
    </div>
  );
}
