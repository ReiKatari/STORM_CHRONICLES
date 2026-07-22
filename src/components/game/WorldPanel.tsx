import { useGame } from '@/game/store';
import { DUNGEONS, ZONES } from '@/game/monsters';
import { dungeonById } from '@/game/monsters';

export default function WorldPanel() {
  const level = useGame(s => s.level);
  const zoneId = useGame(s => s.zoneId);
  const unlockedZones = useGame(s => s.unlockedZones);
  const unlockedSecrets = useGame(s => s.unlockedSecrets);
  const mastery = useGame(s => s.mastery);
  const dungeon = useGame(s => s.dungeon);
  const travelTo = useGame(s => s.travelTo);
  const startDungeon = useGame(s => s.startDungeon);
  const leaveDungeon = useGame(s => s.leaveDungeon);

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3 flex flex-col h-full min-h-0 overflow-y-auto shadow-2xl backdrop-blur-md space-y-3">
      {/* 1. Main Zones */}
      <div>
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200 mb-2 flex items-center justify-between">
          <span>🗺️ Основные Территории</span>
          <span className="text-[10px] text-slate-400 font-normal">({ZONES.filter(z => !z.hidden).length} зон)</span>
        </h3>
        <div className="space-y-1">
          {ZONES.filter(z => !z.hidden).map((z) => {
            const unlocked = unlockedZones.includes(z.id) && level >= z.minLevel;
            const active = zoneId === z.id && !dungeon;
            const m = mastery[z.id] ?? 0;
            return (
              <button
                key={z.id}
                onClick={() => unlocked && travelTo(z.id)}
                disabled={!unlocked}
                className={`w-full text-left rounded-xl border px-2.5 py-1.5 transition-all ${
                  active
                    ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : unlocked
                    ? 'border-slate-700 bg-slate-950/60 hover:bg-slate-800/60'
                    : 'border-slate-800/80 opacity-40 bg-slate-950/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{z.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{z.name}</span>
                      {active && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded">● ТЕКУЩАЯ</span>}
                      {m > 0 && <span className="text-[9px] text-amber-400 font-bold">★ цикл {m}</span>}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {unlocked ? z.desc : `🔒 Нужен ${z.minLevel} ур.`}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">{z.minLevel}+</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Hidden Zones */}
      <div>
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-fuchsia-300 mb-2 flex items-center justify-between">
          <span>🔮 Скрытые Территории</span>
          <span className="text-[10px] text-fuchsia-400/80 font-normal">(4 Легендарных)</span>
        </h3>
        <div className="space-y-1">
          {ZONES.filter(z => z.hidden).map(z => {
            const unlocked = unlockedSecrets.includes(z.id) && level >= z.minLevel;
            const found = unlockedSecrets.includes(z.id);
            const active = zoneId === z.id && !dungeon;
            return (
              <button
                key={z.id}
                onClick={() => unlocked && travelTo(z.id)}
                disabled={!unlocked}
                className={`w-full text-left rounded-xl border px-2.5 py-1.5 transition-all ${
                  active
                    ? 'border-fuchsia-400 bg-fuchsia-500/20 shadow-[0_0_14px_rgba(217,70,239,0.3)]'
                    : unlocked
                    ? 'border-fuchsia-700/60 bg-fuchsia-950/30 hover:bg-fuchsia-900/40'
                    : 'border-slate-800/80 opacity-40 bg-slate-950/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{found ? z.icon : '❓'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-200">{found ? z.name : '??? (Скрыто)'}</div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {found ? (unlocked ? z.desc : `🔒 нужен ${z.minLevel} ур.`) : '🔒 Найдите секретную карту на этапах'}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">{z.minLevel}+</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dungeons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-purple-300">
            🏰 Подземелья Бездны
          </h3>
          {dungeon && (
            <button
              onClick={leaveDungeon}
              className="text-[10px] px-2.5 py-0.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 font-bold border border-red-500/40 transition-colors"
            >
              🚪 Выйти
            </button>
          )}
        </div>

        {dungeon && (
          <div className="mb-2 p-2 rounded-xl border border-purple-500/60 bg-purple-950/40 flex items-center justify-between text-xs font-bold text-purple-200 animate-pulse">
            <span>{dungeonById(dungeon.dungeonId).icon} {dungeonById(dungeon.dungeonId).name}</span>
            <span>Волна {dungeon.wave}/{dungeonById(dungeon.dungeonId).waves}</span>
          </div>
        )}

        <div className="space-y-1">
          {DUNGEONS.map(d => {
            const canEnter = level >= d.minLevel && !dungeon;
            return (
              <button
                key={d.id}
                onClick={() => canEnter && startDungeon(d.id)}
                disabled={!canEnter}
                className={`w-full text-left rounded-xl border px-2.5 py-1.5 transition-all ${
                  canEnter
                    ? 'border-purple-600/50 bg-slate-950/60 hover:bg-purple-900/30'
                    : 'border-slate-800/80 opacity-40 bg-slate-950/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{d.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-200">{d.name}</div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {level >= d.minLevel
                        ? `${d.desc} · ${d.waves} волн · Награда: x${d.xpMult} XP`
                        : `🔒 нужен ${d.minLevel} ур.`}
                    </div>
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono font-bold">{d.minLevel}+</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
