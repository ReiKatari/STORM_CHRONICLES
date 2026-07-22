import { useEffect, useState } from 'react';
import { useGame, loadSave } from '@/game/store';
import { fmt, xpForLevel, MAX_LEVEL } from '@/game/engine';
import { zoneById } from '@/game/monsters';
import { SKILLS } from '@/game/skills';
import CombatCanvas from '@/components/game/CombatCanvas';
import StatsPanel from '@/components/game/StatsPanel';
import EquipmentPanel from '@/components/game/EquipmentPanel';
import InventoryPanel from '@/components/game/InventoryPanel';
import SkillsPanel from '@/components/game/SkillsPanel';
import TalentsPanel from '@/components/game/TalentsPanel';
import QuestsPanel from '@/components/game/QuestsPanel';
import WorldPanel from '@/components/game/WorldPanel';
import EventsPanel from '@/components/game/EventsPanel';

type Tab = 'inventory' | 'skills' | 'talents' | 'quests' | 'world';
const TABS: { id: Tab; name: string; icon: string }[] = [
  { id: 'inventory', name: 'Инвентарь', icon: '🎒' },
  { id: 'skills', name: 'Скиллы', icon: '✨' },
  { id: 'talents', name: 'Таланты', icon: '🌟' },
  { id: 'quests', name: 'Квесты', icon: '📜' },
  { id: 'world', name: 'Мир', icon: '🗺️' },
];

function Header() {
  const level = useGame(s => s.level);
  const xp = useGame(s => s.xp);
  const gold = useGame(s => s.gold);
  const kills = useGame(s => s.kills);
  const bossKills = useGame(s => s.bossKills);
  const hardReset = useGame(s => s.hardReset);
  const xpPct = Math.min(100, (xp / xpForLevel(level)) * 100);

  return (
    <header className="bg-slate-900/95 border-b border-slate-700/60 px-4 py-2 flex items-center gap-3 flex-wrap backdrop-blur-md sticky top-0 z-40 shadow-lg shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚔️</span>
        <h1 className="font-black text-sm leading-none bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent tracking-wide">
          ХРОНИКИ БЕЗДНЫ
        </h1>
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-[180px] max-w-sm">
        <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/40 rounded-lg px-2 py-0.5">
          Ур. {level}
        </span>
        <div className="flex-1 h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
          <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300" style={{ width: `${xpPct}%` }} />
          <span className="absolute inset-0 text-[8px] flex items-center justify-center text-white font-mono font-bold">
            {fmt(xp)} / {fmt(xpForLevel(level))}
          </span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono">{MAX_LEVEL}</span>
      </div>
      <div className="flex items-center gap-3 ml-auto text-xs font-semibold">
        <span className="text-amber-300">💰 {fmt(gold)}</span>
        <span className="text-slate-400">☠️ {fmt(kills)}</span>
        <span className="text-orange-400">👑 {bossKills}</span>
        <button
          onClick={() => { if (confirm('Полный сброс прогресса? Это необратимо!')) hardReset(); }}
          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 border border-slate-700 transition-colors"
        >
          Сброс
        </button>
      </div>
    </header>
  );
}

function StageBar() {
  const zoneId = useGame(s => s.zoneId);
  const stage = useGame(s => s.stage);
  const stageKills = useGame(s => s.stageKills);
  const dungeon = useGame(s => s.dungeon);
  const mastery = useGame(s => s.mastery);
  const zone = zoneById(zoneId);
  const pct = (stageKills / zone.killsPerStage) * 100;
  const m = mastery[zoneId] ?? 0;

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 px-3 py-1.5 flex items-center gap-2.5 shadow-md">
      <span className="text-lg">{dungeon ? '🏰' : zone.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-extrabold text-slate-100 truncate">{dungeon ? 'Подземелье' : zone.name}</span>
          {m > 0 && <span className="text-[9px] text-amber-400 font-bold">★ цикл {m}</span>}
          {!dungeon && <span className="text-[10px] text-slate-400 ml-auto shrink-0 font-medium">Этап {stage}/{zone.stages}</span>}
        </div>
        {!dungeon && (
          <div className="mt-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
      {!dungeon && <span className="text-[10px] text-slate-400 font-mono shrink-0">{stageKills}/{zone.killsPerStage}</span>}
    </div>
  );
}

function SkillBar() {
  const skillRanks = useGame(s => s.skillRanks);
  const skillCds = useGame(s => s.skillCds);
  const castSkill = useGame(s => s.castSkill);
  const learned = SKILLS.filter(sk => (skillRanks[sk.id] ?? 0) > 0);

  if (learned.length === 0) return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-700/60 px-3 py-1.5 text-center text-[10px] text-slate-400">
      ✨ Изучите первый скилл во вкладке «Скиллы» (очки даются каждые 3 уровня)
    </div>
  );

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 px-3 py-1.5 flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold text-slate-400">Каст:</span>
      {learned.map(sk => {
        const cd = skillCds[sk.id] ?? 0;
        return (
          <button
            key={sk.id}
            onClick={() => castSkill(sk.id)}
            disabled={cd > 0}
            title={`${sk.name} · ${sk.manaCost} маны`}
            className="relative w-9 h-9 rounded-lg border text-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-60"
            style={{ borderColor: sk.color, background: `${sk.color}18`, boxShadow: cd > 0 ? undefined : `0 0 10px ${sk.color}55` }}
          >
            {sk.icon}
            {cd > 0 && (
              <span className="absolute inset-0 bg-slate-950/80 rounded-lg flex items-center justify-center text-[10px] font-bold text-white">
                {cd.toFixed(0)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function BattleLog() {
  const log = useGame(s => s.log);
  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-2 h-28 overflow-y-auto flex flex-col-reverse shadow-inner">
      <div className="space-y-0.5">
        {log.slice(-30).map(l => (
          <div key={l.id} className="text-[10px] leading-tight" style={{ color: l.color }}>{l.text}</div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('inventory');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      loadSave();
      setLoaded(true);
    }
    const iv = setInterval(() => useGame.getState().tick(0.1), 100);
    const onVis = () => useGame.getState().save();
    window.addEventListener('beforeunload', onVis);
    return () => { clearInterval(iv); window.removeEventListener('beforeunload', onVis); };
  }, [loaded]);

  const handleSelectEquipmentSlot = () => {
    setTab('inventory');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 0%, rgba(76,29,149,0.2), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(154,52,18,0.12), transparent 50%)' }}>
      <div id="app-root" className="w-full max-w-[1600px] mx-auto min-h-screen relative flex flex-col">
        <Header />
        <main className="p-2.5 grid gap-2.5 xl:grid-cols-[300px_1fr_370px] lg:grid-cols-[280px_1fr] flex-1 min-h-0 items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-2.5 order-2 lg:order-1">
            <StatsPanel />
            <EquipmentPanel onSelectSlot={handleSelectEquipmentSlot} />
          </div>

          {/* CENTER */}
          <div className="space-y-2.5 order-1 lg:order-2">
            <StageBar />
            <div className="rounded-xl border border-slate-700/60 overflow-hidden shadow-2xl bg-slate-900" style={{ height: 350 }}>
              <CombatCanvas />
            </div>
            <SkillBar />
            <BattleLog />
            {/* Interactive World Events Panel in empty space under battle log */}
            <EventsPanel />

            {/* mobile right panel */}
            <div className="xl:hidden h-[450px] flex flex-col">
              <TabButtons tab={tab} setTab={setTab} />
              <div className="flex-1 min-h-0 mt-2">
                <TabContent tab={tab} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Full height of window flex container) */}
          <div className="hidden xl:flex flex-col h-[calc(100vh-75px)] space-y-2 order-3 min-h-0 sticky top-[65px]">
            <TabButtons tab={tab} setTab={setTab} />
            <div className="flex-1 min-h-0">
              <TabContent tab={tab} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function TabButtons({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const statPoints = useGame(s => s.statPoints);
  const skillPoints = useGame(s => s.skillPoints);
  const talentPoints = useGame(s => s.talentPoints);
  const quests = useGame(s => s.quests);
  const readyQuests = Object.values(quests).filter(q => q.done && !q.claimed).length;
  const badges: Partial<Record<Tab, number>> = { skills: skillPoints, talents: talentPoints, quests: readyQuests };

  return (
    <div className="flex gap-1 bg-slate-900/90 rounded-xl border border-slate-700/60 p-1 shadow-md shrink-0">
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`relative flex-1 text-[11px] py-1.5 rounded-lg font-bold transition-all ${
            tab === t.id ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.icon} {t.name}
          {(badges[t.id] ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center animate-pulse shadow-md">
              {badges[t.id]}
            </span>
          )}
        </button>
      ))}
      {statPoints > 0 && <span className="sr-only">{statPoints}</span>}
    </div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case 'inventory': return <InventoryPanel />;
    case 'skills': return <SkillsPanel />;
    case 'talents': return <TalentsPanel />;
    case 'quests': return <QuestsPanel />;
    case 'world': return <WorldPanel />;
  }
}
