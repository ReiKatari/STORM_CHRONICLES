import { useState } from 'react';
import { useGame } from '@/game/store';
import { QUESTS } from '@/game/quests';
import { fmt } from '@/game/engine';

export default function QuestsPanel() {
  const quests = useGame(s => s.quests);
  const claim = useGame(s => s.claimQuest);
  const kills = useGame(s => s.kills);
  const bossKills = useGame(s => s.bossKills);
  const dungeonsCleared = useGame(s => s.dungeonsCleared);
  const level = useGame(s => s.level);

  const [panelMode, setPanelMode] = useState<'quests' | 'contracts'>('quests');
  const [filterTab, setFilterTab] = useState<'all' | 'ready' | 'done'>('all');
  const [claimedContracts, setClaimedContracts] = useState<Record<string, boolean>>({});

  const CONTRACTS = [
    {
      id: 'bounty_1',
      title: 'Контракт: Охота на Монстров',
      target: `Убить 20 монстров (Прогресс: ${Math.min(20, kills % 20)}/20)`,
      desc: 'Гильдия охотников выплачивает щедрое вознаграждение за зачистку тварей.',
      icon: '🎯',
      isReady: (kills % 20) >= 0 && kills >= 20,
      rewardGold: level * 150 + 300,
      rewardXP: level * 100 + 200,
    },
    {
      id: 'bounty_2',
      title: 'Контракт: Ликвидация Владык',
      target: `Одолеть 3 Боссов Зоны (Прогресс: ${Math.min(3, bossKills % 3)}/3)`,
      desc: 'Заказ на устранение особо опасных элитных монстров и боссов миров.',
      icon: '👑',
      isReady: bossKills >= 3,
      rewardGold: level * 300 + 600,
      rewardXP: level * 200 + 400,
    },
    {
      id: 'bounty_3',
      title: 'Контракт: Исследователь Подземелий',
      target: `Зачистить 2 Подземелья (Прогресс: ${Math.min(2, dungeonsCleared % 2)}/2)`,
      desc: 'Награда за исследование опасных астральных подземелий.',
      icon: '🏰',
      isReady: dungeonsCleared >= 2,
      rewardGold: level * 400 + 800,
      rewardXP: level * 250 + 500,
    }
  ];

  const readyQuests = QUESTS.filter(q => {
    const st = quests[q.id];
    return st?.done && !st?.claimed;
  });

  const active = QUESTS.filter(q => {
    const st = quests[q.id];
    if (filterTab === 'ready') return st?.done && !st?.claimed;
    if (filterTab === 'done') return st?.claimed;
    return !st?.claimed;
  });

  const doneCount = QUESTS.filter(q => quests[q.id]?.claimed).length;

  const handleClaimAll = () => {
    readyQuests.forEach(q => claim(q.id));
  };

  const handleClaimContract = (cId: string, gold: number, xp: number) => {
    if (claimedContracts[cId]) return;
    setClaimedContracts(prev => ({ ...prev, [cId]: true }));
    useGame.setState(s => ({
      gold: s.gold + gold,
      totalGoldEarned: s.totalGoldEarned + gold,
      xp: s.xp + xp,
      log: [...s.log, { id: Date.now(), text: `🏆 Выполнен Контракт Охотников! (+${gold}g, +${xp}xp)`, color: '#facc15', time: Date.now() }]
    }));
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setPanelMode('quests')}
            className={`text-xs font-black px-2.5 py-1 rounded-lg transition-all ${
              panelMode === 'quests' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📜 Квесты
          </button>
          <button
            onClick={() => setPanelMode('contracts')}
            className={`text-xs font-black px-2.5 py-1 rounded-lg transition-all ${
              panelMode === 'contracts' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎯 Контракты
          </button>
        </div>

        <div className="flex items-center gap-2">
          {panelMode === 'quests' && readyQuests.length > 0 && (
            <button
              onClick={handleClaimAll}
              className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md animate-pulse shrink-0"
            >
              ⚡ Забрать все ({readyQuests.length})
            </button>
          )}
        </div>
      </div>

      {panelMode === 'contracts' ? (
        /* Contracts List */
        <div className="space-y-2.5 overflow-y-auto flex-1 min-h-0 pr-1">
          {CONTRACTS.map(c => {
            const isClaimed = !!claimedContracts[c.id];
            return (
              <div
                key={c.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isClaimed
                    ? 'bg-slate-950/40 border-slate-800 opacity-60'
                    : c.isReady
                    ? 'bg-slate-950 border-amber-400 ring-1 ring-amber-400/40 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-md">
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-xs text-slate-100 truncate">{c.title}</div>
                    <div className="text-[11px] text-amber-300 font-mono font-bold mt-0.5">{c.target}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{c.desc}</div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-[10.5px] font-black text-amber-300 font-mono">
                    +{fmt(c.rewardGold)}g / +{fmt(c.rewardXP)}xp
                  </span>
                  {isClaimed ? (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md">
                      Завершено
                    </span>
                  ) : c.isReady ? (
                    <button
                      onClick={() => handleClaimContract(c.id, c.rewardGold, c.rewardXP)}
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-105 text-white font-black text-[10.5px] shadow-lg transition-all active:scale-95 animate-bounce"
                    >
                      🎁 Забрать
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      В процессе
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Filter Tabs */
        <div className="flex gap-1 mb-2 bg-slate-950/70 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 text-[10px] py-1 rounded-lg font-bold transition-all ${
              filterTab === 'all' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Активные ({QUESTS.length - doneCount})
          </button>
          <button
            onClick={() => setFilterTab('ready')}
            className={`flex-1 text-[10px] py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
              filterTab === 'ready' ? 'bg-amber-600 text-white shadow' : 'text-amber-400 hover:text-amber-200'
            }`}
          >
            <span>Готовы</span>
            {readyQuests.length > 0 && <span className="px-1 rounded bg-amber-950 font-bold">{readyQuests.length}</span>}
          </button>
          <button
            onClick={() => setFilterTab('done')}
            className={`flex-1 text-[10px] py-1 rounded-lg font-bold transition-all ${
              filterTab === 'done' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Завершено ({doneCount})
          </button>
        </div>
      )}

      {/* Quests List */}
      <div className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1">
        {active.length === 0 && (
          <div className="text-center text-slate-400 text-xs py-16 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            {filterTab === 'ready'
              ? 'Нет готовых квестов для награды.'
              : filterTab === 'done'
              ? 'Ещё нет завершённых заданий.'
              : '🎉 Все задания выполнены!'}
          </div>
        )}
        {active.map(q => {
          const st = quests[q.id];
          const pct = st ? Math.min(100, (st.progress / q.count) * 100) : 0;
          const ready = st?.done && !st?.claimed;
          const claimed = st?.claimed;
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
                claimed
                  ? 'border-slate-800/80 bg-slate-950/30 opacity-60'
                  : ready
                  ? 'border-amber-400/80 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'border-slate-700/60 bg-slate-850/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-slate-100 truncate">{q.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{q.desc}</div>
                </div>
                {claimed ? (
                  <span className="text-[10px] font-bold text-slate-500 shrink-0">✓ Выполнено</span>
                ) : ready ? (
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

              {!claimed && (
                <div className="mt-2 h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${ready ? 'bg-amber-400' : 'bg-gradient-to-r from-sky-500 to-cyan-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}

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
