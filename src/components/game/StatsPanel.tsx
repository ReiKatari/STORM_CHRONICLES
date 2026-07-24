import { useGame } from '@/game/store';
import { STAT_DEFS, fmt } from '@/game/engine';

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
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-3.5 shadow-2xl backdrop-blur-md space-y-3 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="font-black text-sm text-slate-100 flex items-center gap-2">
          <span className="p-1 bg-amber-500/10 rounded-lg border border-amber-500/30 text-base">📊</span>
          <span>Характеристики Игрока</span>
        </h3>
        <span className={`text-xs font-black px-3 py-1 rounded-xl border font-mono transition-all ${
          points > 0
            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
            : 'bg-slate-950/80 text-slate-400 border-slate-800'
        }`}>
          {fmt(points)} {points === 1 ? 'очко' : points > 1 && points < 5 ? 'очка' : 'очков'}
        </span>
      </div>

      {/* Base Stats List */}
      <div className="space-y-1.5">
        {STAT_DEFS.map(d => (
          <div key={d.id} className="group relative flex items-center gap-2 bg-slate-950/80 rounded-xl px-2.5 py-1 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-sm w-5">{d.icon}</span>
            <span className="text-xs text-slate-300 flex-1 font-extrabold truncate">{d.name}</span>
            <span className="text-xs font-black font-mono w-12 text-right" style={{ color: d.color }}>{fmt(stats[d.id])}</span>
            <div className="flex gap-1">
              <button
                onClick={() => allocate(d.id)}
                disabled={points <= 0}
                className="w-5 h-5 rounded-md rpg-button-primary disabled:opacity-30 text-white text-xs font-black leading-none flex items-center justify-center"
              >+</button>
              <button
                onClick={() => allocate10(d.id)}
                disabled={points <= 0}
                className="px-1.5 h-5 rounded-md rpg-button-primary disabled:opacity-30 text-white text-[9px] font-black leading-none flex items-center justify-center"
              >+10</button>
            </div>
            <div className="absolute left-0 -bottom-1 translate-y-full z-20 hidden group-hover:block bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-[10px] text-slate-300 w-52 shadow-2xl">
              {d.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Derived Battle Stats Grid */}
      <div className="pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-300 font-medium bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
        <div>⚔️ Урон: <b className="text-white font-mono font-extrabold">{fmt(derived.dmgMin)}–{fmt(derived.dmgMax)}</b></div>
        <div>✨ Сила скиллов: <b className="text-white font-mono font-extrabold">{fmt(derived.skillPower)}</b></div>
        <div>🛡️ Броня: <b className="text-white font-mono font-extrabold">{fmt(derived.armor)}</b></div>
        <div>💥 Крит: <b className="text-white font-mono font-extrabold">{derived.critChance.toFixed(1)}%</b></div>
        <div>⚡ Скорость: <b className="text-white font-mono font-extrabold">{derived.attackSpeed.toFixed(2)}/с</b></div>
        <div>💨 Уворот: <b className="text-white font-mono font-extrabold">{derived.dodge.toFixed(1)}%</b></div>
        <div>💰 Золото: <b className="text-amber-300 font-mono font-extrabold">+{derived.goldBonus.toFixed(0)}%</b></div>
        <div>📈 Опыт: <b className="text-sky-300 font-mono font-extrabold">+{derived.xpBonus.toFixed(0)}%</b></div>
        <div>🍀 Дроп: <b className="text-lime-300 font-mono font-extrabold">+{derived.dropBonus.toFixed(0)}%</b></div>
        <div>🩸 Вампиризм: <b className="text-red-300 font-mono font-extrabold">{derived.lifesteal}%</b></div>
      </div>

      {/* Summary Bonus Stats From Equipment Card */}
      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-xs text-indigo-300 flex items-center gap-1.5">
            <span>🥋</span>
            <span>Бонусы Снаряжения</span>
          </span>
          <span className="text-amber-300 font-black text-xs font-mono">
            ⚡ {fmt(totalGearScore)} Мощь
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-bold">
          <div className="p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-amber-300 font-mono">
            <div>⚔️ +{fmt(gearDmg)}</div>
            <div className="text-[8px] text-slate-400 font-sans font-normal">Урон</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-sky-300 font-mono">
            <div>🛡️ +{fmt(gearArmor)}</div>
            <div className="text-[8px] text-slate-400 font-sans font-normal">Броня</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-red-300 font-mono">
            <div>❤️ +{fmt(gearHp)}</div>
            <div className="text-[8px] text-slate-400 font-sans font-normal">HP</div>
          </div>
        </div>

        {onOpenPaperdoll && (
          <button
            onClick={onOpenPaperdoll}
            className="w-full mt-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>🥋 Открыть Куклу Снаряжения</span>
          </button>
        )}
      </div>
    </div>
  );
}
