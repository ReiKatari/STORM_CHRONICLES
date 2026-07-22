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

  const classSkills = heroClass.skills;

  const handleMasterToggleAuto = () => {
    const anyOff = classSkills.some(sk => (skillRanks[sk.id] ?? 0) > 0 && !autoCast[sk.id]);
    classSkills.forEach(sk => {
      if ((skillRanks[sk.id] ?? 0) > 0) {
        if (anyOff && !autoCast[sk.id]) toggleAuto(sk.id);
        if (!anyOff && autoCast[sk.id]) toggleAuto(sk.id);
      }
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3.5 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md">
      {/* Premium Header */}
      <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-800 pb-2.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            ✨
          </div>
          <div>
            <h3 className="font-black text-sm text-slate-100 leading-tight">Скиллы: {heroClass.name}</h3>
            <span className="text-[10px] text-slate-400">Уникальные заклинания класса {heroClass.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Enhanced Skill Points Badge */}
          <div className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-black transition-all ${
            points > 0
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
              : 'bg-slate-950/80 text-slate-400 border-slate-800'
          }`}>
            <span className="text-amber-400">⚡</span>
            <span>{points} {points === 1 ? 'очко' : points > 1 && points < 5 ? 'очка' : 'очков'}</span>
          </div>

          <button
            onClick={handleMasterToggleAuto}
            className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-300 hover:bg-sky-900/80 transition-all shadow-md active:scale-95"
          >
            ⚡ Авто-каст
          </button>
        </div>
      </div>

      {/* Skills List Grid */}
      <div className="space-y-2.5 overflow-y-auto flex-1 min-h-0 pr-1">
        {classSkills.map(sk => {
          const rank = skillRanks[sk.id] ?? 0;
          const unlocked = level >= sk.unlockLevel;
          const canUpgrade = points > 0 && rank < sk.maxRank && unlocked;
          const isAuto = !!autoCast[sk.id];
          const cd = skillCds[sk.id] ?? 0;

          return (
            <div
              key={sk.id}
              className={`rounded-xl border p-3 transition-all relative overflow-hidden flex flex-col justify-between ${
                !unlocked
                  ? 'border-slate-800/80 bg-slate-950/40 opacity-50'
                  : rank > 0
                  ? 'border-slate-700 bg-slate-950/70 shadow-lg'
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start gap-3">
                {/* Skill Icon */}
                <div
                  className="w-11 h-11 rounded-xl border flex items-center justify-center text-2xl shrink-0 bg-slate-800 shadow-md relative"
                  style={{ borderColor: sk.color, boxShadow: rank > 0 ? `0 0 14px ${sk.color}44` : undefined }}
                >
                  {sk.icon}
                  {cd > 0 && (
                    <div className="absolute inset-0 bg-slate-950/85 rounded-xl flex items-center justify-center text-xs font-bold font-mono text-white">
                      {cd.toFixed(0)}с
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-extrabold text-xs text-slate-100 truncate">{sk.name}</span>

                      {/* Rank Pill Display */}
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

                    <span className="text-[10px] text-sky-400 font-bold shrink-0">
                      💧 {sk.manaCost} маны
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-300 leading-normal">
                    {sk.desc}
                  </p>

                  <div className="flex items-center gap-3 text-[9px] text-slate-500 font-mono pt-0.5">
                    <span>⏱️ Перезарядка: {sk.cooldown}с</span>
                    {!unlocked && <span className="text-red-400 font-bold">🔒 Требуется {sk.unlockLevel} уровень</span>}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row */}
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
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-all disabled:opacity-50 active:scale-95"
                    >
                      🪄 Каст
                    </button>
                  )}
                </div>

                {canUpgrade && (
                  <button
                    onClick={() => upgrade(sk.id)}
                    className="text-[10px] font-black px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 shadow-lg transition-all animate-bounce active:scale-95"
                  >
                    +1 Улучшить (Очки: {points})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-2 text-[10px] text-slate-400 text-center shrink-0 border-t border-slate-800 pt-1.5">
        ✨ Очки скиллов выдаются каждые 3 уровня · Назначайте скиллы на быстрые клавиши [1-8], [Q-R]
      </div>
    </div>
  );
}
