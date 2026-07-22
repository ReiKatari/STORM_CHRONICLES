import { useGame } from '@/game/store';
import { QUESTS } from '@/game/quests';
import { fmt } from '@/game/engine';

export default function QuestsPanel() {
  const quests = useGame(s => s.quests);
  const claim = useGame(s => s.claimQuest);

  const active = QUESTS.filter(q => !quests[q.id]?.claimed);
  const doneCount = QUESTS.filter(q => quests[q.id]?.claimed).length;

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 shrink-0">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
          <span>📜 Квесты и Поручения</span>
        </h3>
        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
          {doneCount} / {QUESTS.length}
        </span>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1">
        {active.length === 0 && (
          <div className="text-center text-slate-400 text-xs py-16 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            🎉 Все квесты выполнены! Ждите новых заданий!
          </div>
        )}
        {active.map(q => {
          const st = quests[q.id];
          const pct = st ? Math.min(100, (st.progress / q.count) * 100) : 0;
          const ready = st?.done && !st?.claimed;
          const r = q.reward;
          const rewardStr = [
            r.gold ? `💰${fmt(r.gold)}` : '',
            r.xp ? `📈${fmt(r.xp)}` : '',
            r.statPoints ? `📊+${r.statPoints}` : '',
            r.talentPoints ? `🌟+${r.talentPoints}` : '',
            r.skillPoints ? `✨+${r.skillPoints}` : '',
            r.itemRarity ? `🎁${r.itemRarity}` : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={q.id}
              className={`rounded-xl border p-2.5 transition-all ${
                ready
                  ? 'border-amber-400/80 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'border-slate-700/60 bg-slate-850/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-slate-100 truncate">{q.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{q.desc}</div>
                </div>
                {ready ? (
                  <button
                    onClick={() => claim(q.id)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black animate-bounce shadow-md shrink-0"
                  >
                    Забрать!
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 shrink-0 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {st?.progress ?? 0}/{q.count}
                  </span>
                )}
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${ready ? 'bg-amber-400' : 'bg-gradient-to-r from-sky-500 to-cyan-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-1 text-[9px] text-slate-400 flex items-center justify-between">
                <span>Награда: <b className="text-amber-300 font-semibold">{rewardStr}</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
