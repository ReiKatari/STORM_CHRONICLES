import { useEffect, useState } from 'react';
import { useGame, loadSave } from '@/game/store';
import { fmt, xpForLevel, MAX_LEVEL } from '@/game/engine';
import { zoneById } from '@/game/monsters';
import { getClassById } from '@/game/classes';
import CombatCanvas from '@/components/game/CombatCanvas';
import StatsPanel from '@/components/game/StatsPanel';
import InventoryPanel from '@/components/game/InventoryPanel';
import SkillsPanel from '@/components/game/SkillsPanel';
import TalentsPanel from '@/components/game/TalentsPanel';
import QuestsPanel from '@/components/game/QuestsPanel';
import WorldPanel from '@/components/game/WorldPanel';
import PetsPanel from '@/components/game/PetsPanel';
import EventsPanel from '@/components/game/EventsPanel';
import HotbarPanel from '@/components/game/HotbarPanel';
import CharacterCreationModal from '@/components/game/CharacterCreationModal';
import EquipmentModal from '@/components/game/EquipmentModal';
import MerchantModal from '@/components/game/MerchantModal';
import CraftingModal from '@/components/game/CraftingModal';

import ResetConfirmModal from '@/components/game/ResetConfirmModal';

type Tab = 'inventory' | 'skills' | 'talents' | 'quests' | 'pets' | 'world';
const TABS: { id: Tab; name: string; icon: string }[] = [
  { id: 'inventory', name: 'Инвентарь', icon: '🎒' },
  { id: 'skills', name: 'Скиллы', icon: '✨' },
  { id: 'talents', name: 'Таланты', icon: '🌟' },
  { id: 'quests', name: 'Квесты', icon: '📜' },
  { id: 'pets', name: 'Питомцы', icon: '🐾' },
  { id: 'world', name: 'Мир', icon: '🗺️' },
];

function Header({
  onOpenMerchant,
  onOpenCrafting,
  onOpenReset,
}: {
  onOpenMerchant: () => void;
  onOpenCrafting: () => void;
  onOpenReset: () => void;
}) {
  const name = useGame(s => s.characterName);
  const classId = useGame(s => s.classId);
  const heroClass = classId ? getClassById(classId) : null;

  const level = useGame(s => s.level);
  const xp = useGame(s => s.xp);
  const gold = useGame(s => s.gold);
  const kills = useGame(s => s.kills);
  const bossKills = useGame(s => s.bossKills);
  const xpPct = Math.min(100, (xp / xpForLevel(level)) * 100);

  return (
    <header className="bg-slate-900/95 border-b border-slate-700/60 px-4 py-2.5 flex items-center gap-3 flex-wrap backdrop-blur-md sticky top-0 z-40 shadow-xl shrink-0 font-sans">
      {/* Hero Name & Class Badge */}
      <div className="flex items-center gap-2.5">
        <span className="text-3xl p-1 bg-slate-950 rounded-xl border border-slate-800">{heroClass?.icon || '⚔️'}</span>
        <div>
          <div className="font-black text-xs text-white leading-tight flex items-center gap-2">
            <span>{name || 'Герой Бездны'}</span>
            {heroClass && (
              <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider font-mono shadow-sm" style={{ backgroundColor: `${heroClass.color}22`, color: heroClass.color, border: `1px solid ${heroClass.color}55` }}>
                {heroClass.name}
              </span>
            )}
          </div>
          <span className="text-[10px] text-amber-300 font-bold leading-none">{heroClass?.title || 'Искатель приключений'}</span>
        </div>
      </div>

      {/* Level & XP Bar */}
      <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md">
        <span className="text-xs font-black font-mono text-amber-300 bg-amber-500/15 border border-amber-500/40 rounded-xl px-2.5 py-1 shadow-sm">
          Ур. {fmt(level)}
        </span>
        <div className="flex-1 h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative p-0.5 shadow-inner">
          <div className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.5)]" style={{ width: `${xpPct}%` }} />
          <span className="absolute inset-0 text-[9px] flex items-center justify-center text-white font-mono font-black drop-shadow">
            {fmt(xp)} / {fmt(xpForLevel(level))} XP ({xpPct.toFixed(1)}%)
          </span>
        </div>
        <span className="text-[9px] text-slate-400 font-mono font-bold">МАКС {fmt(MAX_LEVEL)}</span>
      </div>

      {/* Meta Stats, Merchant & Crafting Buttons */}
      <div className="flex items-center gap-2 ml-auto text-xs font-bold">
        <button
          onClick={onOpenCrafting}
          className="text-[11px] font-black px-3 py-1.5 rounded-xl bg-orange-950/80 hover:bg-orange-900 border border-orange-500/50 text-orange-200 transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
        >
          <span>🔨</span>
          <span>Кузница и Крафт</span>
        </button>

        <button
          onClick={onOpenMerchant}
          className="text-[11px] font-black px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
        >
          <span>🏪</span>
          <span>Торговля и NPC</span>
        </button>

        <span className="text-amber-300 font-mono font-extrabold bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
          💰 {fmt(gold)}
        </span>
        <span className="text-slate-300 font-mono font-extrabold bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
          ☠️ {fmt(kills)}
        </span>
        <span className="text-orange-400 font-mono font-extrabold bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
          👑 {fmt(bossKills)}
        </span>
        <button
          onClick={onOpenReset}
          className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 border border-slate-700 transition-all font-bold"
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
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 px-3.5 py-2 flex items-center gap-3 shadow-xl backdrop-blur-md font-sans">
      <span className="text-xl p-1.5 bg-slate-950 rounded-xl border border-slate-800">{dungeon ? '🏰' : zone.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-black text-slate-100 truncate">{dungeon ? 'Подземелье' : zone.name}</span>
          {m > 0 && <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">★ Цикл {fmt(m)}</span>}
          {!dungeon && <span className="text-[10px] text-slate-400 ml-auto shrink-0 font-extrabold font-mono">Этап {fmt(stage)}/{fmt(zone.stages)}</span>}
        </div>
        {!dungeon && (
          <div className="mt-1.5 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
      {!dungeon && <span className="text-[10px] text-slate-300 font-mono font-bold shrink-0 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">{fmt(stageKills)}/{fmt(zone.killsPerStage)}</span>}
    </div>
  );
}

function BattleLog() {
  const log = useGame(s => s.log);
  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-3 h-32 overflow-y-auto flex flex-col-reverse shadow-inner font-mono text-[10px]">
      <div className="space-y-1">
        {log.slice(-30).map(l => (
          <div key={l.id} className="leading-snug" style={{ color: l.color }}>{l.text}</div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('inventory');
  const [loaded, setLoaded] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showPaperdollModal, setShowPaperdollModal] = useState(false);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [showCraftingModal, setShowCraftingModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const characterName = useGame(s => s.characterName);
  const classId = useGame(s => s.classId);

  useEffect(() => {
    if (!loaded) {
      loadSave();
      setLoaded(true);
    }
  }, [loaded]);

  useEffect(() => {
    const iv = setInterval(() => {
      try {
        useGame.getState().tick(0.1);
      } catch (err) {
        console.error('Tick error:', err);
      }
    }, 100);
    const onVis = () => useGame.getState().save();
    window.addEventListener('beforeunload', onVis);
    return () => {
      clearInterval(iv);
      window.removeEventListener('beforeunload', onVis);
    };
  }, []);

  useEffect(() => {
    if (loaded && (!characterName || !classId)) {
      setShowCreationModal(true);
    } else if (characterName && classId) {
      setShowCreationModal(false);
    }
  }, [loaded, characterName, classId]);

  const handleOpenPaperdoll = () => {
    setShowPaperdollModal(true);
    setTab('inventory');
  };

  const handleSelectEquipmentSlot = () => {
    setTab('inventory');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 0%, rgba(76,29,149,0.2), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(154,52,18,0.12), transparent 50%)' }}>
      {showCreationModal && (
        <CharacterCreationModal onComplete={() => setShowCreationModal(false)} />
      )}

      {showPaperdollModal && (
        <EquipmentModal
          onClose={() => setShowPaperdollModal(false)}
          onSelectSlot={handleSelectEquipmentSlot}
        />
      )}

      {showMerchantModal && (
        <MerchantModal onClose={() => setShowMerchantModal(false)} />
      )}

      {showCraftingModal && (
        <CraftingModal onClose={() => setShowCraftingModal(false)} />
      )}

      {showResetModal && (
        <ResetConfirmModal onClose={() => setShowResetModal(false)} />
      )}

      <div id="app-root" className="w-full max-w-[1920px] mx-auto min-h-screen relative flex flex-col px-2 sm:px-4">
        <Header
          onOpenMerchant={() => setShowMerchantModal(true)}
          onOpenCrafting={() => setShowCraftingModal(true)}
          onOpenReset={() => setShowResetModal(true)}
        />
        <main className="p-3 grid gap-3.5 xl:grid-cols-[360px_1fr_460px] lg:grid-cols-[320px_1fr] flex-1 min-h-0 items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-3 order-2 lg:order-1">
            <StatsPanel onOpenPaperdoll={handleOpenPaperdoll} />
          </div>

          {/* CENTER */}
          <div className="space-y-3 order-1 lg:order-2">
            <StageBar />
            <div className="rounded-2xl border border-slate-700/60 overflow-hidden shadow-2xl bg-slate-900" style={{ height: 380 }}>
              <CombatCanvas />
            </div>
            <HotbarPanel />
            <BattleLog />
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
          <div className="hidden xl:flex flex-col h-[calc(100vh-80px)] space-y-2.5 order-3 min-h-0 sticky top-[70px]">
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

/**
 * Uniform Tab Buttons with Stacked Layout (Icon Over Text)
 */
function TabButtons({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const skillPoints = useGame(s => s.skillPoints);
  const talentPoints = useGame(s => s.talentPoints);
  const quests = useGame(s => s.quests);
  const readyQuests = Object.values(quests).filter(q => q.done && !q.claimed).length;
  const badges: Partial<Record<Tab, number>> = { skills: skillPoints, talents: talentPoints, quests: readyQuests };

  return (
    <div className="flex gap-1.5 bg-slate-900/95 rounded-2xl border border-slate-700/60 p-1.5 shadow-xl shrink-0 overflow-x-auto backdrop-blur-md">
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`relative flex-1 py-2 px-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-0.5 text-center min-w-[54px] ${
            tab === t.id
              ? 'bg-slate-700 text-white shadow-lg border border-slate-600 scale-[1.03]'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/50 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-xl leading-none">{t.icon}</span>
          <span className="text-[9px] font-black leading-tight truncate w-full">{t.name}</span>
          {(badges[t.id] ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center animate-pulse shadow-md font-mono font-black">
              {fmt(badges[t.id]!)}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case 'inventory': return <InventoryPanel />;
    case 'skills': return <SkillsPanel />;
    case 'talents': return <TalentsPanel />;
    case 'quests': return <QuestsPanel />;
    case 'pets': return <PetsPanel />;
    case 'world': return <WorldPanel />;
  }
}
