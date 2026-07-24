import { useState } from 'react';
import { useGame } from '@/game/store';
import { getClassById } from '@/game/classes';

export default function SkillsPanel() {
  const classId = useGame(s => s.classId);
  const heroClass = getClassById(classId);

  const level = useGame(s => s.level);
  const skillRanks = useGame(s => s.skillRanks);
  const points = useGame(s => s.skillPoints);
  const autoCast = useGame(s => s.autoCast);
  const skillCds = useGame(s => s.skillCds);

  const upgrade = useGame(s => s.upgradeSkill);
  const toggleAuto = useGame(s => s.toggleAutoCast);
  const cast = useGame(s => s.castSkill);

  const [filter, setFilter] = useState<'all' | 'learned' | 'upgradeable' | 'locked'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const classSkills = heroClass.skills;
  const learnedSkills = classSkills.filter(sk => (skillRanks[sk.id] ?? 0) > 0);
  const isMasterAutoOn = learnedSkills.length > 0 && learnedSkills.every(sk => autoCast[sk.id]);

  const handleMasterToggleAuto = () => {
    if (learnedSkills.length === 0) return;
    const targetState = !isMasterAutoOn;
    const newAutoCast = { ...autoCast };
    learnedSkills.forEach(sk => {
      newAutoCast[sk.id] = targetState;
    });
    useGame.setState({ autoCast: newAutoCast });
  };

  const filteredSkills = classSkills.filter(sk => {
    const rank = skillRanks[sk.id] ?? 0;
    const unlocked = level >= sk.unlockLevel;
    const canUpgrade = points > 0 && rank < sk.maxRank && unlocked;

    if (searchTerm.trim() && !sk.name.toLowerCase().includes(searchTerm.toLowerCase()) && !sk.desc.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (filter === 'learned') return rank > 0;
    if (filter === 'upgradeable') return canUpgrade;
    if (filter === 'locked') return !unlocked;
    return true;
  });

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-4 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-3 shrink-0">
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
              <h3 className="font-black text-sm text-slate-100 leading-tight">Скиллы: {heroClass.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold">
                {classSkills.length} скиллов
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Уникальное древо заклинаний {heroClass.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Skill Points Badge */}
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-black transition-all ${
            points > 0
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
              : 'bg-slate-950/80 text-slate-400 border-slate-800'
          }`}>
            <span className="text-amber-400">⚡</span>
            <span>{points} {points === 1 ? 'очко' : points > 1 && points < 5 ? 'очка' : 'очков'}</span>
          </div>

          <button
            onClick={handleMasterToggleAuto}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
              isMasterAutoOn
                ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚡ Авто-каст: {isMasterAutoOn ? 'ВКЛ' : 'ВЫКЛ'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              filter === 'all' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Все ({classSkills.length})
          </button>
          <button
            onClick={() => setFilter('learned')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              filter === 'learned' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Изученные ({learnedSkills.length})
          </button>
          <button
            onClick={() => setFilter('upgradeable')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              filter === 'upgradeable' ? 'bg-amber-400 text-slate-950 shadow-md font-black' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Доступные ({classSkills.filter(sk => points > 0 && (skillRanks[sk.id] ?? 0) < sk.maxRank && level >= sk.unlockLevel).length})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              filter === 'locked' ? 'bg-slate-700 text-slate-200 shadow-md font-black' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Заблокированные ({classSkills.filter(sk => level < sk.unlockLevel).length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Поиск заклинания..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500/60 w-36"
        />
      </div>

      {/* Skills List Grid */}
      <div className="space-y-2.5 overflow-y-auto flex-1 min-h-0 pr-1">
        {filteredSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center text-slate-500 text-xs">
            <span className="text-2xl mb-1">🔍</span>
            Заклинания по выбранным фильтрам не найдены
          </div>
        ) : (
          filteredSkills.map((sk, idx) => {
            const rank = skillRanks[sk.id] ?? 0;
            const unlocked = level >= sk.unlockLevel;
            const canUpgrade = points > 0 && rank < sk.maxRank && unlocked;
            const isAuto = !!autoCast[sk.id];
            const cd = skillCds[sk.id] ?? 0;

            return (
              <div
                key={sk.id}
                draggable={rank > 0}
                onDragStart={e => {
                  e.dataTransfer.setData('application/json', JSON.stringify({ type: 'skill', skillId: sk.id, icon: sk.icon, name: sk.name }));
                }}
                className={`rounded-xl border p-3 transition-all relative overflow-hidden flex flex-col justify-between ${
                  rank > 0 ? 'cursor-grab active:cursor-grabbing' : ''
                } ${
                  !unlocked
                    ? 'border-slate-800/80 bg-slate-950/40 opacity-50'
                    : rank > 0
                    ? 'border-slate-700/80 bg-slate-950/80 shadow-lg hover:border-amber-400'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  {/* Skill Icon */}
                  <div
                    className="w-12 h-12 rounded-xl border flex items-center justify-center text-2xl shrink-0 bg-slate-900 shadow-md relative"
                    style={{ borderColor: sk.color, boxShadow: rank > 0 ? `0 0 14px ${sk.color}44` : undefined }}
                  >
                    {sk.icon}
                    {cd > 0 && (
                      <div className="absolute inset-0 bg-slate-950/90 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold font-mono text-amber-300">
                        <span>⏱️</span>
                        <span>{cd.toFixed(0)}с</span>
                      </div>
                    )}

                    {/* Quickkey badge */}
                    {idx < 9 && rank > 0 && (
                      <span className="absolute -top-1 -right-1 bg-slate-900 border border-slate-700 text-[9px] font-mono font-bold text-amber-400 w-4 h-4 rounded-full flex items-center justify-center shadow">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-extrabold text-xs text-slate-100 truncate">{sk.name}</span>

                        {/* Rank Pill */}
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm ${
                          rank >= sk.maxRank
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                            : rank > 0
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}>
                          Ранг {rank}/{sk.maxRank}
                        </span>
                      </div>

                      <span className="text-[10px] text-sky-400 font-bold shrink-0 flex items-center gap-1">
                        <span>💧</span> {sk.manaCost} маны
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug">
                      {sk.desc}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                      <span>⏱️ Перезарядка: {sk.cooldown} сек.</span>
                      {!unlocked ? (
                        <span className="text-red-400 font-bold">🔒 Ур. {sk.unlockLevel}</span>
                      ) : (
                        <span className="text-slate-500">Доступно с ур. {sk.unlockLevel}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {rank > 0 && (
                      <button
                        onClick={() => toggleAuto(sk.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                          isAuto
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span>{isAuto ? '⚡ Авто: ВКЛ' : '⚪ Авто: ВЫКЛ'}</span>
                      </button>
                    )}

                    {rank > 0 && (
                      <button
                        onClick={() => cast(sk.id)}
                        disabled={cd > 0}
                        className="text-[10px] font-bold px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-all disabled:opacity-50 active:scale-95"
                      >
                        🪄 Использовать
                      </button>
                    )}
                  </div>

                  {canUpgrade && (
                    <button
                      onClick={() => upgrade(sk.id)}
                      className="text-[10px] font-black px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 shadow-lg transition-all animate-pulse active:scale-95"
                    >
                      +1 Прокачать (⚡{points})
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-2 text-[10px] text-slate-400 text-center shrink-0 border-t border-slate-800 pt-1.5">
        ✨ Очки скиллов выдаются каждые 3 уровня · Назначайте скиллы на клавиши [1-9]
      </div>
    </div>
  );
}
