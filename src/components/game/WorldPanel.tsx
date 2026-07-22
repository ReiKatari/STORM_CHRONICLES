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
    <div className="bg-slate-900/80 rounded-xl border border-slate-700/60 p-3 flex flex-col h-full overflow-y-auto" style={{ maxHeight: 420 }}>
      <h3 className="font-bold text-sm text-slate-200 mb-2">🗺️ Территории</h3>
      <div className="space-y-1 mb-3">
        {ZONES.filter(z => !z.hidden).map((z) => {
          const unlocked = unlockedZones.includes(z.id) && level >= z.minLevel;
          const active = zoneId === z.id && !dungeon;
          const m = mastery[z.id] ?? 0;
          return (
            <button
              key={z.id}
              onClick={() => unlocked && travelTo(z.id)}
              disabled={!unlocked}
              className={`w-full text-left rounded-lg border px-2 py-1.5 transition-all ${active ? 'border-emerald-400 bg-emerald-500/10' : unlocked ? 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50' : 'border-slate-800 opacity-45'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{z.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                    {z.name}
                    {active && <span className="text-[8px] text-emerald-400 font-normal">● здесь</span>}
                    {m > 0 && <span className="text-[8px] text-amber-400">★{m}</span>}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">{unlocked ? z.desc : `🔒 ${level < z.minLevel ? `нужен ${z.minLevel} ур.` : 'победите босса предыдущей зоны'}`}</div>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{z.minLevel}+</span>
              </div>
            </button>
          );
        })}
      </div>

      <h3 className="font-bold text-sm text-slate-200 mb-2">🔮 Скрытые территории</h3>
      <div className="space-y-1 mb-3">
        {ZONES.filter(z => z.hidden).map(z => {
          const unlocked = unlockedSecrets.includes(z.id) && level >= z.minLevel;
          const found = unlockedSecrets.includes(z.id);
          const active = zoneId === z.id && !dungeon;
          return (
            <button
              key={z.id}
              onClick={() => unlocked && travelTo(z.id)}
              disabled={!unlocked}
              className={`w-full text-left rounded-lg border px-2 py-1.5 transition-all ${active ? 'border-fuchsia-400 bg-fuchsia-500/10' : unlocked ? 'border-fuchsia-700/60 bg-fuchsia-950/30 hover:bg-fuchsia-900/30' : 'border-slate-800 opacity-45'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{found ? z.icon : '❓'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-200">{found ? z.name : '???'}</div>
                  <div className="text-[9px] text-slate-500 truncate">{found ? (unlocked ? z.desc : `🔒 нужен ${z.minLevel} ур.`) : `🔒 ${z.unlockHint}`}</div>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{z.minLevel}+</span>
              </div>
            </button>
          );
        })}
      </div>

      <h3 className="font-bold text-sm text-slate-200 mb-2">🏰 Подземелья</h3>
      {dungeon && (
        <div className="mb-2 rounded-lg border border-purple-500/60 bg-purple-500/10 px-2 py-1.5 flex items-center justify-between">
          <span className="text-xs text-purple-300">{dungeonById(dungeon.dungeonId).icon} {dungeonById(dungeon.dungeonId).name} — волна {dungeon.wave}/{dungeonById(dungeon.dungeonId).waves}</span>
          <button onClick={leaveDungeon} className="text-[10px] px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300">Выйти</button>
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
              className={`w-full text-left rounded-lg border px-2 py-1.5 transition-all ${canEnter ? 'border-purple-700/60 bg-slate-800/50 hover:bg-purple-900/20' : 'border-slate-800 opacity-45'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-200">{d.name}</div>
                  <div className="text-[9px] text-slate-500 truncate">{level >= d.minLevel ? `${d.desc} · ${d.waves} волн · лут x${d.lootBonus}` : `🔒 нужен ${d.minLevel} ур.`}</div>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{d.minLevel}+</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
