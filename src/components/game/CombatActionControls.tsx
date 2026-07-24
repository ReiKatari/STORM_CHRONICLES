import { useGame } from '@/game/store';

export default function CombatActionControls() {
  const manualAttack = useGame(s => s.manualAttack);
  const manualBlock = useGame(s => s.manualBlock);
  const manualFlee = useGame(s => s.manualFlee);
  const monster = useGame(s => s.monster);

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-3 shadow-2xl backdrop-blur-md font-sans space-y-2 w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg p-1 bg-amber-500/10 rounded-lg border border-amber-500/30">⚔️</span>
          <h3 className="font-black text-xs text-slate-100 uppercase tracking-wider">
            Панель Ручного Управления Боем
          </h3>
        </div>
        <span className="text-[10px] text-amber-300 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          🎮 Ручной Режим
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={manualAttack}
          disabled={!monster || monster.hp <= 0}
          className="rpg-button-gold py-3 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 transition-all active:scale-95"
          title="Нанести прямой физический/критический удар по монстру"
        >
          <span className="text-xl">⚔️</span>
          <span>УДАР</span>
        </button>

        <button
          onClick={manualBlock}
          className="rpg-button-primary py-3 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          title="Встать в защитную стойку и мгновенно получить +35% поглощающего HP щита"
        >
          <span className="text-xl">🛡️</span>
          <span>БЛОК</span>
        </button>

        <button
          onClick={manualFlee}
          className="rpg-button-danger py-3 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          title="Безопасно отступить и убежать из боя на 1 этап локации"
        >
          <span className="text-xl">🏃</span>
          <span>УБЕЖАТЬ</span>
        </button>
      </div>
    </div>
  );
}
