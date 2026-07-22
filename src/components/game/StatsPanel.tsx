import { useGame } from '@/game/store';
import { STAT_DEFS } from '@/game/engine';

export default function StatsPanel() {
  const stats = useGame(s => s.stats);
  const points = useGame(s => s.statPoints);
  const allocate = useGame(s => s.allocateStat);
  const allocate10 = useGame(s => s.allocateStat10);
  const derived = useGame(s => s.derived);

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-700/60 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm text-slate-200">📊 Характеристики</h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${points > 0 ? 'bg-amber-500/20 text-amber-300 animate-pulse' : 'bg-slate-700/50 text-slate-400'}`}>
          {points} очков
        </span>
      </div>
      <div className="space-y-1">
        {STAT_DEFS.map(d => (
          <div key={d.id} className="group relative flex items-center gap-1.5 bg-slate-800/50 rounded-lg px-2 py-1 hover:bg-slate-800 transition-colors">
            <span className="text-sm w-5">{d.icon}</span>
            <span className="text-xs text-slate-300 flex-1 truncate">{d.name}</span>
            <span className="text-xs font-bold w-8 text-right" style={{ color: d.color }}>{stats[d.id]}</span>
            <div className="flex gap-0.5">
              <button
                onClick={() => allocate(d.id)}
                disabled={points <= 0}
                className="w-5 h-5 rounded bg-emerald-600/80 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-bold leading-none transition-colors"
              >+</button>
              <button
                onClick={() => allocate10(d.id)}
                disabled={points <= 0}
                className="px-1 h-5 rounded bg-emerald-700/70 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white text-[9px] font-bold leading-none transition-colors"
              >+10</button>
            </div>
            <div className="absolute left-0 -bottom-1 translate-y-full z-20 hidden group-hover:block bg-slate-950 border border-slate-600 rounded-lg p-2 text-[10px] text-slate-300 w-48 shadow-xl">
              {d.desc}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-slate-700/60 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300">
        <div>⚔️ Урон: <b className="text-white">{derived.dmgMin}–{derived.dmgMax}</b></div>
        <div>✨ Сила скиллов: <b className="text-white">{derived.skillPower}</b></div>
        <div>🛡️ Броня: <b className="text-white">{derived.armor}</b></div>
        <div>💥 Крит: <b className="text-white">{derived.critChance.toFixed(1)}%</b></div>
        <div>⚡ Скорость: <b className="text-white">{derived.attackSpeed.toFixed(2)}/с</b></div>
        <div>💨 Уворот: <b className="text-white">{derived.dodge.toFixed(1)}%</b></div>
        <div>💰 Золото: <b className="text-amber-300">+{derived.goldBonus.toFixed(0)}%</b></div>
        <div>📈 Опыт: <b className="text-sky-300">+{derived.xpBonus.toFixed(0)}%</b></div>
        <div>🍀 Дроп: <b className="text-lime-300">+{derived.dropBonus.toFixed(0)}%</b></div>
        <div>🩸 Вампиризм: <b className="text-red-300">{derived.lifesteal}%</b></div>
      </div>
    </div>
  );
}
