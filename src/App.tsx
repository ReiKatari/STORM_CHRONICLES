import { useEffect, useState, useRef } from 'react';
import { useGame, loadSave } from '@/game/store';
import { fmt, xpForLevel } from '@/game/engine';
import { zoneById } from '@/game/monsters';
import { getClassById } from '@/game/classes';
import { getDailyStreakInfo } from '@/game/daily';

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
import ForgeModal from '@/components/game/ForgeModal';
import AlchemyModal from '@/components/game/AlchemyModal';
import ExpeditionsModal from '@/components/game/ExpeditionsModal';
import CasinoModal from '@/components/game/CasinoModal';
import CosmeticsModal from '@/components/game/CosmeticsModal';
import DailyRewardsModal from '@/components/game/DailyRewardsModal';
import BestiaryModal from '@/components/game/BestiaryModal';
import LabyrinthModal from '@/components/game/LabyrinthModal';
import TowerModal from '@/components/game/TowerModal';
import RuneSocketingModal from '@/components/game/RuneSocketingModal';
import TreasureVaultModal from '@/components/game/TreasureVaultModal';
import ActivityHubModal from '@/components/game/ActivityHubModal';
import ResetConfirmModal from '@/components/game/ResetConfirmModal';

type Tab = 'inventory' | 'skills' | 'talents' | 'quests' | 'pets' | 'world';
const TABS: { id: Tab; name: string; icon: string; hotkey: string }[] = [
  { id: 'inventory', name: 'Инвентарь', icon: '🎒', hotkey: '1' },
  { id: 'skills', name: 'Способности', icon: '✨', hotkey: '2' },
  { id: 'talents', name: 'Таланты', icon: '🌟', hotkey: '3' },
  { id: 'pets', name: 'Питомцы', icon: '🐾', hotkey: '4' },
  { id: 'quests', name: 'Задания', icon: '📜', hotkey: '5' },
  { id: 'world', name: 'Мир', icon: '🗺️', hotkey: '6' },
];

function Header({
  onOpenMerchant,
  onOpenForge,
  onOpenAlchemy,
  onOpenExpeditions,
  onOpenCasino,
  onOpenCosmetics,
  onOpenDaily,
  onOpenBestiary,
  onOpenLabyrinth,
  onOpenTower,
  onOpenRunes,
  onOpenTreasure,
  onOpenReset,
  onOpenHub,
}: {
  onOpenMerchant: () => void;
  onOpenForge: () => void;
  onOpenAlchemy: () => void;
  onOpenExpeditions: () => void;
  onOpenCasino: () => void;
  onOpenCosmetics: () => void;
  onOpenDaily: () => void;
  onOpenBestiary: () => void;
  onOpenLabyrinth: () => void;
  onOpenTower: () => void;
  onOpenRunes: () => void;
  onOpenTreasure: () => void;
  onOpenReset: () => void;
  onOpenHub: () => void;
}) {
  const name = useGame(s => s.characterName);
  const classId = useGame(s => s.classId);
  const heroClass = classId ? getClassById(classId) : null;
  const streakInfo = getDailyStreakInfo();

  const level = useGame(s => s.level);
  const xp = useGame(s => s.xp);
  const gold = useGame(s => s.gold);
  const kills = useGame(s => s.kills);
  const sfxMuted = useGame(s => s.sfxMuted);
  const musicMuted = useGame(s => s.musicMuted);
  const xpPct = Math.min(100, (xp / xpForLevel(level)) * 100);

  const [activeMenu, setActiveMenu] = useState<'dungeons' | 'craft' | 'activities' | 'settings' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900/95 border-b border-slate-700/60 px-4 py-2.5 flex items-center gap-2.5 flex-wrap backdrop-blur-md sticky top-0 z-40 shadow-xl shrink-0 font-sans">
      {/* Hero Name & Class Badge */}
      <div className="flex items-center gap-2.5">
        <span className="text-3xl p-1 bg-slate-950 rounded-xl border border-slate-800 shadow">{heroClass?.icon || '⚔️'}</span>
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
      <div className="flex items-center gap-2 flex-1 min-w-[180px] max-w-sm">
        <span className="text-xs font-black font-mono text-amber-300 bg-amber-500/15 border border-amber-500/40 rounded-xl px-2.5 py-1 shadow-sm shrink-0">
          Уровень {fmt(level)}
        </span>
        <div className="flex-1 h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative p-0.5 shadow-inner">
          <div className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.5)]" style={{ width: `${xpPct}%` }} />
          <span className="absolute inset-0 text-[9px] flex items-center justify-center text-white font-mono font-black drop-shadow">
            {fmt(xp)} из {fmt(xpForLevel(level))} Опыта ({xpPct.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Action Buttons Bar with Grouped Menus */}
      <div ref={menuRef} className="flex items-center gap-1.5 ml-auto text-xs font-bold flex-wrap">
        {/* Navigation Hub Button */}
        <button
          onClick={onOpenHub}
          className="text-[11px] font-black px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-900 via-sky-900 to-blue-900 hover:from-indigo-800 hover:to-sky-800 border border-sky-400/60 text-sky-200 transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)] active:scale-95 flex items-center gap-1.5 cursor-pointer"
          title="Открыть Навигатор всех залов и активностей"
        >
          <span>🧭</span>
          <span>Все Залы</span>
        </button>

        {/* 1. Dungeons Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === 'dungeons' ? null : 'dungeons')}
            className={`text-[11px] font-black px-2.5 py-1.5 rounded-xl border transition-all shadow active:scale-95 flex items-center gap-1 cursor-pointer ${
              activeMenu === 'dungeons'
                ? 'bg-amber-900 border-amber-400 text-amber-200'
                : 'bg-amber-950/80 hover:bg-amber-900/80 border-amber-500/50 text-amber-300'
            }`}
          >
            <span>⚔️</span>
            <span>Подземелья</span>
            <span className="text-[9px] opacity-70">▾</span>
          </button>

          {activeMenu === 'dungeons' && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-950/95 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-md z-50 space-y-1 animate-fadeIn">
              <div className="text-[9px] font-black text-amber-400 uppercase tracking-wider px-2 py-1 border-b border-slate-800">
                🏰 Испытания & Подземелья
              </div>
              <button
                onClick={() => { setActiveMenu(null); onOpenLabyrinth(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">🏰</span>
                <div>
                  <div className="text-white font-black">Лабиринт Бездны</div>
                  <div className="text-[9.5px] text-slate-400">Процедурный лабиринт 5х5</div>
                </div>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onOpenTower(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">⚔️</span>
                <div>
                  <div className="text-white font-black">Башня Испытаний</div>
                  <div className="text-[9.5px] text-slate-400">Бесконечные этажи и боссы</div>
                </div>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onOpenTreasure(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">🗺️</span>
                <div>
                  <div className="text-white font-black">Карты Сокровищ</div>
                  <div className="text-[9.5px] text-slate-400">Мини-игра на взлом замков</div>
                </div>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onOpenExpeditions(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">🚩</span>
                <div>
                  <div className="text-white font-black">Экспедиции Наёмников</div>
                  <div className="text-[9.5px] text-slate-400">Отряды искателей приключений</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 2. Crafting & Blacksmith Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === 'craft' ? null : 'craft')}
            className={`text-[11px] font-black px-2.5 py-1.5 rounded-xl border transition-all shadow active:scale-95 flex items-center gap-1 cursor-pointer ${
              activeMenu === 'craft'
                ? 'bg-orange-900 border-orange-400 text-orange-200'
                : 'bg-orange-950/80 hover:bg-orange-900/80 border-orange-500/50 text-orange-300'
            }`}
          >
            <span>🔨</span>
            <span>Ремесло</span>
            <span className="text-[9px] opacity-70">▾</span>
          </button>

          {activeMenu === 'craft' && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-950/95 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-md z-50 space-y-1 animate-fadeIn">
              <div className="text-[9px] font-black text-orange-400 uppercase tracking-wider px-2 py-1 border-b border-slate-800">
                🔨 Мастерские & Торговля
              </div>
              <button
                onClick={() => { setActiveMenu(null); onOpenForge(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">🔨</span>
                <div>
                  <div className="text-white font-black">Великая Кузница</div>
                  <div className="text-[9.5px] text-slate-400">Заточка +20 и синтез камней</div>
                </div>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onOpenRunes(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">🔮</span>
                <div>
                  <div className="text-white font-black">Астральные Руны</div>
                  <div className="text-[9.5px] text-slate-400">Инкрустация рунических слов</div>
                </div>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onOpenAlchemy(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">⚗️</span>
                <div>
                  <div className="text-white font-black">Лаборатория Алхимии</div>
                  <div className="text-[9.5px] text-slate-400">Оранжерея и варка эликсиров</div>
                </div>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onOpenMerchant(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">🏪</span>
                <div>
                  <div className="text-white font-black">Торговая Гильдия</div>
                  <div className="text-[9.5px] text-slate-400">Покупка и продажа трофеев</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 3. Activities & Leisure Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === 'activities' ? null : 'activities')}
            className={`text-[11px] font-black px-2.5 py-1.5 rounded-xl border transition-all shadow active:scale-95 flex items-center gap-1 cursor-pointer ${
              activeMenu === 'activities'
                ? 'bg-purple-900 border-purple-400 text-purple-200'
                : 'bg-purple-950/80 hover:bg-purple-900/80 border-purple-500/50 text-purple-300'
            }`}
          >
            <span>✨</span>
            <span>Активности</span>
            <span className="text-[9px] opacity-70">▾</span>
          </button>

          {activeMenu === 'activities' && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-950/95 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-md z-50 space-y-1 animate-fadeIn">
              <div className="text-[9px] font-black text-purple-400 uppercase tracking-wider px-2 py-1 border-b border-slate-800">
                ✨ Развлечения & Реликвии
              </div>
              <button
                onClick={() => { setActiveMenu(null); onOpenCasino(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">🎲</span>
                <div>
                  <div className="text-white font-black">Казино Подземелья</div>
                  <div className="text-[9.5px] text-slate-400">Кости, рулетка и карты Таро</div>
                </div>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onOpenCosmetics(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">🪽</span>
                <div>
                  <div className="text-white font-black">Гардероб Крыльев</div>
                  <div className="text-[9.5px] text-slate-400">5 видов крыльев и Вознесение</div>
                </div>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onOpenBestiary(); }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">📖</span>
                <div>
                  <div className="text-white font-black">Полный Бестиарий</div>
                  <div className="text-[9.5px] text-slate-400">50+ монстров и боссов</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Daily Rewards Button */}
        <button
          onClick={onOpenDaily}
          className="text-[11px] font-black px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 border border-amber-400/80 text-amber-200 transition-all shadow active:scale-95 flex items-center gap-1 cursor-pointer relative"
          title="Ежедневный календарь наград за вход"
        >
          <span>📅</span>
          <span>Награды</span>
          {streakInfo.canClaim && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center animate-ping" />
          )}
          {streakInfo.canClaim && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-mono font-bold">
              !
            </span>
          )}
        </button>

        {/* Gold & Kills Indicators */}
        <span className="text-amber-300 font-mono font-extrabold bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-[11px]">
          💰 {fmt(gold)}
        </span>
        <span className="text-slate-300 font-mono font-extrabold bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
          ☠️ {fmt(kills)}
        </span>

        {/* Characters Button */}
        <button
          onClick={onOpenReset}
          className="text-[11px] font-black px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 hover:from-indigo-800 hover:to-slate-800 border border-indigo-500/50 text-indigo-200 transition-all shadow-lg active:scale-95 flex items-center gap-1.5 cursor-pointer"
          title="Сменить персонажа или создать нового героя"
        >
          <span>👥</span>
          <span>Персонажи</span>
        </button>

        {/* Settings Toggle Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')}
            className="text-[11px] font-black px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all shadow-lg active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Настройки звука и музыки"
          >
            <span>⚙️</span>
          </button>

          {activeMenu === 'settings' && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-950/95 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md z-50 space-y-2 animate-fadeIn">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-800 flex items-center gap-1">
                <span>⚙️ Настройки Звука</span>
              </div>

              <button
                onClick={() => useGame.getState().toggleSfx()}
                className={`w-full py-2 px-3 rounded-xl border font-extrabold text-xs transition-all flex items-center justify-between shadow cursor-pointer ${
                  sfxMuted
                    ? 'bg-red-950/80 border-red-500/50 text-red-300'
                    : 'bg-slate-900 border-emerald-500/50 text-emerald-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{sfxMuted ? '🔇' : '🔊'}</span>
                  <span>ЗВУКИ</span>
                </span>
                <span className="text-[10px] font-mono font-bold">
                  {sfxMuted ? 'ВЫКЛ' : 'ВКЛ'}
                </span>
              </button>

              <button
                onClick={() => useGame.getState().toggleMusic()}
                className={`w-full py-2 px-3 rounded-xl border font-extrabold text-xs transition-all flex items-center justify-between shadow cursor-pointer ${
                  musicMuted
                    ? 'bg-red-950/80 border-red-500/50 text-red-300'
                    : 'bg-slate-900 border-amber-500/50 text-amber-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{musicMuted ? '🔇' : '🎵'}</span>
                  <span>МУЗЫКА</span>
                </span>
                <span className="text-[10px] font-mono font-bold">
                  {musicMuted ? 'ВЫКЛ' : 'ВКЛ'}
                </span>
              </button>
            </div>
          )}
        </div>
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
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-3.5 flex items-center gap-3 shadow-xl font-sans">
      <span className="text-3xl p-1 bg-slate-950 rounded-xl border border-slate-800">{dungeon ? '🏰' : zone.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-black text-slate-100 truncate">{dungeon ? 'Подземелье' : zone.name}</span>
          {m > 0 && <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">★ Цикл {fmt(m)}</span>}
          {!dungeon && <span className="text-xs text-slate-400 ml-auto shrink-0 font-bold font-mono">Этап {fmt(stage)} из {fmt(zone.stages)}</span>}
        </div>
        {!dungeon && (
          <div className="mt-1.5 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
      {!dungeon && <span className="text-[10px] text-slate-300 font-mono font-bold shrink-0 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">{fmt(stageKills)} из {fmt(zone.killsPerStage)}</span>}
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
  const [showForgeModal, setShowForgeModal] = useState(false);
  const [showAlchemyModal, setShowAlchemyModal] = useState(false);
  const [showExpeditionsModal, setShowExpeditionsModal] = useState(false);
  const [showCasinoModal, setShowCasinoModal] = useState(false);
  const [showCosmeticsModal, setShowCosmeticsModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showBestiaryModal, setShowBestiaryModal] = useState(false);
  const [showLabyrinthModal, setShowLabyrinthModal] = useState(false);
  const [showTowerModal, setShowTowerModal] = useState(false);
  const [showRuneModal, setShowRuneModal] = useState(false);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showHubModal, setShowHubModal] = useState(false);

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

  // Keyboard shortcut listener for tabs (1-6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const tabMap: Record<string, Tab> = {
        '1': 'inventory',
        '2': 'skills',
        '3': 'talents',
        '4': 'pets',
        '5': 'quests',
        '6': 'world',
      };
      if (tabMap[e.key]) {
        setTab(tabMap[e.key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

      {showForgeModal && (
        <ForgeModal onClose={() => setShowForgeModal(false)} />
      )}

      {showAlchemyModal && (
        <AlchemyModal onClose={() => setShowAlchemyModal(false)} />
      )}

      {showExpeditionsModal && (
        <ExpeditionsModal onClose={() => setShowExpeditionsModal(false)} />
      )}

      {showCasinoModal && (
        <CasinoModal onClose={() => setShowCasinoModal(false)} />
      )}

      {showCosmeticsModal && (
        <CosmeticsModal onClose={() => setShowCosmeticsModal(false)} />
      )}

      {showDailyModal && (
        <DailyRewardsModal onClose={() => setShowDailyModal(false)} />
      )}

      {showBestiaryModal && (
        <BestiaryModal onClose={() => setShowBestiaryModal(false)} />
      )}

      {showLabyrinthModal && (
        <LabyrinthModal onClose={() => setShowLabyrinthModal(false)} />
      )}

      {showTowerModal && (
        <TowerModal onClose={() => setShowTowerModal(false)} />
      )}

      {showRuneModal && (
        <RuneSocketingModal onClose={() => setShowRuneModal(false)} />
      )}

      {showTreasureModal && (
        <TreasureVaultModal onClose={() => setShowTreasureModal(false)} />
      )}

      {showHubModal && (
        <ActivityHubModal
          onClose={() => setShowHubModal(false)}
          onOpenMerchant={() => setShowMerchantModal(true)}
          onOpenForge={() => setShowForgeModal(true)}
          onOpenAlchemy={() => setShowAlchemyModal(true)}
          onOpenExpeditions={() => setShowExpeditionsModal(true)}
          onOpenCasino={() => setShowCasinoModal(true)}
          onOpenCosmetics={() => setShowCosmeticsModal(true)}
          onOpenDaily={() => setShowDailyModal(true)}
          onOpenBestiary={() => setShowBestiaryModal(true)}
          onOpenLabyrinth={() => setShowLabyrinthModal(true)}
          onOpenTower={() => setShowTowerModal(true)}
          onOpenTreasure={() => setShowTreasureModal(true)}
          onOpenReset={() => setShowResetModal(true)}
        />
      )}

      {showResetModal && (
        <ResetConfirmModal
          onClose={() => setShowResetModal(false)}
          onOpenCreation={() => {
            setShowResetModal(false);
            setShowCreationModal(true);
          }}
        />
      )}

      <div id="app-root" className="w-full max-w-[1920px] mx-auto min-h-screen relative flex flex-col px-2 sm:px-4">
        <Header
          onOpenMerchant={() => setShowMerchantModal(true)}
          onOpenForge={() => setShowForgeModal(true)}
          onOpenAlchemy={() => setShowAlchemyModal(true)}
          onOpenExpeditions={() => setShowExpeditionsModal(true)}
          onOpenCasino={() => setShowCasinoModal(true)}
          onOpenCosmetics={() => setShowCosmeticsModal(true)}
          onOpenDaily={() => setShowDailyModal(true)}
          onOpenBestiary={() => setShowBestiaryModal(true)}
          onOpenLabyrinth={() => setShowLabyrinthModal(true)}
          onOpenTower={() => setShowTowerModal(true)}
          onOpenRunes={() => setShowRuneModal(true)}
          onOpenTreasure={() => setShowTreasureModal(true)}
          onOpenReset={() => setShowResetModal(true)}
          onOpenHub={() => setShowHubModal(true)}
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
 * Uniform Tab Buttons with Stacked Layout (Icon Over Text) & Hotkey Indicators
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
          className={`relative flex-1 py-2 px-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-0.5 text-center min-w-[54px] cursor-pointer ${
            tab === t.id
              ? 'bg-slate-700 text-white shadow-lg border border-slate-600 scale-[1.03]'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/50 hover:bg-slate-800/50'
          }`}
          title={`Вкладка «${t.name}» (Клавиша [${t.hotkey}])`}
        >
          <span className="text-xl leading-none">{t.icon}</span>
          <span className="text-[9px] font-black leading-tight truncate w-full">{t.name}</span>
          <span className="text-[8px] font-mono text-slate-500 font-bold leading-none">[{t.hotkey}]</span>
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
