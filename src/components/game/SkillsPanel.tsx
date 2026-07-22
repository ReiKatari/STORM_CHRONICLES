import { useGame } from '@/game/store';
import { SKILLS } from '@/game/skills';

export default function SkillsPanel() {
  const level = useGame(s => s.level);
  const skillRanks = useGame(s => s.skillRanks);
  const skillCds = useGame(s => s.skillCds);
  const skillPoints = useGame(s => s.skillPoints);
  const autoCast = useGame(s => s.autoCast);
  const mana = useGame(s => s.mana);
  const castSkill = useGame(s => s.castSkill);
  const upgradeSkill = useGame(s => s.upgradeSkill);
  const toggleAutoCast = useGame(s => s.toggleAutoCast);

  const learnedSkills = SKILLS.filter(sk => (skillRanks[sk.id] ?? 0) > 0);
  const allAutoActive = learnedSkills.length > 0 && learnedSkills.every(sk => autoCast[sk.id]);

  const handleToggleAllAuto = () => {
    const targetState = !allAutoActive;
    learnedSkills.forEach(sk => {
      if (autoCast[sk.id] !== targetState) {
        toggleAutoCast(sk.id);
      }
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 shrink-0">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
          <span>✨ Боевые Скиллы</span>
        </h3>
        <div className="flex items-center gap-2">
          {learnedSkills.length > 0 && (
            <button
              onClick={handleToggleAllAuto}
              className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border transition-all ${
                allAutoActive
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⚡ {allAutoActive ? 'Отключить авто' : 'Включить все авто'}
            </button>
          )}
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-all ${
            skillPoints > 0 ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {skillPoints} очков
          </span>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-1.5 overflow-y-auto flex-1 min-h-0 pr-1">
        {SKILLS.map(sk => {
          const rank = skillRanks[sk.id] ?? 0;
          const locked = level < sk.unlockLevel;
          const cd = skillCds[sk.id] ?? 0;
          const learned = rank > 0;
          const cdPct = cd > 0 ? (cd / sk.cooldown) * 100 : 0;

          return (
            <div
              key={sk.id}
              className={`relative rounded-xl border p-2 overflow-hidden transition-all ${
                locked
                  ? 'border-slate-800/80 bg-slate-950/40 opacity-50'
                  : learned
                  ? 'border-sky-500/40 bg-slate-850/80 shadow-md'
                  : 'border-slate-700/60 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              {cd > 0 && <div className="absolute inset-0 bg-slate-950/75 transition-all" style={{ width: `${cdPct}%` }} />}
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => learned && castSkill(sk.id)}
                  disabled={!learned || cd > 0}
                  className="w-10 h-10 rounded-lg text-xl flex items-center justify-center border transition-all hover:scale-110 active:scale-95 disabled:cursor-not-allowed shrink-0"
                  style={{
                    borderColor: sk.color,
                    background: learned ? `${sk.color}22` : '#0f172a',
                    boxShadow: learned ? `0 0 10px ${sk.color}44` : undefined,
                  }}
                  title={sk.desc}
                >
                  {sk.icon}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate" style={{ color: learned ? sk.color : '#94a3b8' }}>
                      {sk.name}
                    </span>
                    {learned && (
                      <span className="text-[9px] font-mono px-1 rounded bg-slate-950 text-slate-400">
                        {rank}/{sk.maxRank}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {locked ? `🔒 Требуется ${sk.unlockLevel} ур.` : `${sk.manaCost} маны · ${sk.cooldown}с · ${sk.desc}`}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end shrink-0">
                  <button
                    onClick={() => upgradeSkill(sk.id)}
                    disabled={locked || skillPoints <= 0 || rank >= sk.maxRank}
                    className="text-[10px] px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold transition-all shadow"
                  >
                    {learned ? '↑ Апгрейд' : 'Изучить'}
                  </button>
                  {learned && (
                    <button
                      onClick={() => toggleAutoCast(sk.id)}
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all ${
                        autoCast[sk.id] ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {autoCast[sk.id] ? '⚡ АВТО' : 'ручной'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 text-[10px] text-slate-400 shrink-0 text-center border-t border-slate-800 pt-1.5">
        🔷 Мана: <b className="text-sky-300">{Math.floor(mana)}</b> · Нажмите ⚡Включить все авто для автокаста заклинаний
      </div>
    </div>
  );
}
