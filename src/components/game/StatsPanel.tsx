import { useGame } from '@/game/store';
import { STAT_DEFS } from '@/game/engine';

export default function StatsPanel({ onOpenPaperdoll }: { onOpenPaperdoll?: () => void }) {
  const stats = useGame(s => s.stats);
  const points = useGame(s => s.statPoints);
  const allocate = useGame(s => s.allocateStat);
  const allocate10 = useGame(s => s.allocateStat10);
  const derived = useGame(s => s.derived);
  const equipment = useGame(s => s.equipment);

  // Compute Equipment Stat Bonuses & Total Score
  let gearDmg = 0;
  let gearArmor = 0;
  let gearHp = 0;
  let totalGearScore = 0;

  Object.values(equipment).forEach(it => {
    if (!it) return;
    totalGearScore += it.score || 0;
    if (it.base) {
      gearDmg += it.base.dmg || 0;
      gearArmor += it.base.armor || 0;
      gearHp += it.base.hp || 0;
    }
    if (Array.isArray(it.affixes)) {
      it.affixes.forEach(a => {
        if (!a) return;
        if (a.stat === 'dmg') gearDmg += a.value || 0;
        if (a.stat === 'armor') gearArmor += a.value || 0;
        if (a.stat === 'hp') gearHp += a.value || 0;
      });
    }
  });

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3 shadow-2xl backdrop-blur-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
          <span>📊 Характеристики</span>
        </h3>
        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border transition-all ${
          points > 0
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {points} очков
        </span>
      </div>

      {/* Base Stats List */}
      <div className="space-y-1">
        {STAT_DEFS.map(d => (
          <div key={d.id} className="group relative flex items-center gap-1.5 bg-slate-950/60 rounded-lg px-2 py-1 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-sm w-5">{d.icon}</span>
            <span className="text-xs text-slate-300 flex-1 truncate">{d.name}</span>
            <span className="text-xs font-extrabold w-8 text-right font-mono" style={{ color: d.color }}>{stats[d.id]}</span>
            <div className="flex gap-0.5">
              <button
                onClick={() => allocate(d.id)}
                disabled={points <= 0}
                className="w-5 h-5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white text-xs font-bold leading-none transition-all active:scale-95"
              >+</button>
              <button
                onClick={() => allocate10(d.id)}
                disabled={points <= 0}
                className="px-1 h-5 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-30 text-white text-[9px] font-bold leading-none transition-all active:scale-95"
              >+10</button>
            </div>
            <div className="absolute left-0 -bottom-1 translate-y-full z-20 hidden group-hover:block bg-slate-950 border border-slate-600 rounded-lg p-2 text-[10px] text-slate-300 w-48 shadow-xl">
              {d.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Derived Battle Stats Grid */}
      <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300 font-medium">
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

      {/* Summary Bonus Stats From Equipment Card */}
      <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/40 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-xs text-indigo-300 flex items-center gap-1">
            <span>🥋</span>
            <span>Бонусы Экипировки</span>
          </span>
          <span className="text-amber-300 font-extrabold text-xs">
            ⚡ {totalGearScore} Мощь
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold">
          <div className="p-1 rounded bg-slate-950/80 border border-slate-800 text-amber-300">
            <div>⚔️ +{gearDmg}</div>
            <div className="text-[8px] text-slate-400 font-normal">Урон</div>
          </div>
          <div className="p-1 rounded bg-slate-950/80 border border-slate-800 text-sky-300">
            <div>🛡️ +{gearArmor}</div>
            <div className="text-[8px] text-slate-400 font-normal">Броня</div>
          </div>
          <div className="p-1 rounded bg-slate-950/80 border border-slate-800 text-red-300">
            <div>❤️ +{gearHp}</div>
            <div className="text-[8px] text-slate-400 font-normal">HP</div>
          </div>
        </div>

        {onOpenPaperdoll && (
          <button
            onClick={onOpenPaperdoll}
            className="w-full mt-1 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1"
          >
            <span>🥋 Открыть Куклу Снаряжения</span>
          </button>
        )}
      </div>
    </div>
  );
}
