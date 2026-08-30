import { useState, useMemo } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import { BESTIARY_CATALOG, getBestiaryMasteryTier } from '@/game/bestiary';
import { useEscapeKey } from '@/hooks/useEscapeKey';

type BestiaryCategory = 'all' | 'common' | 'zone_boss' | 'dungeon_boss' | 'hidden_boss';

export default function BestiaryModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);

  const [selectedCategory, setSelectedCategory] = useState<BestiaryCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>(BESTIARY_CATALOG[0].id);

  const kills = useGame(s => s.kills);
  const bossKills = useGame(s => s.bossKills);

  const filteredMonsters = useMemo(() => {
    return BESTIARY_CATALOG.filter(m => {
      const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.zone.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const selectedMonster =
    BESTIARY_CATALOG.find(m => m.id === selectedMonsterId) ||
    filteredMonsters[0] ||
    BESTIARY_CATALOG[0];

  // Approximate kill distribution based on kills
  const monsterKills = Math.max(0, Math.floor(kills / BESTIARY_CATALOG.length) + (bossKills * 2));
  const mastery = getBestiaryMasteryTier(monsterKills);

  const getElementBadge = (el: string) => {
    switch (el) {
      case 'fire': return <span className="text-orange-400 font-bold">🔥 Огонь</span>;
      case 'ice': return <span className="text-cyan-400 font-bold">❄️ Лёд</span>;
      case 'lightning': return <span className="text-amber-400 font-bold">⚡ Молния</span>;
      case 'poison': return <span className="text-lime-400 font-bold">☣️ Яд</span>;
      case 'holy': return <span className="text-yellow-300 font-bold">🌟 Свет</span>;
      case 'dark': return <span className="text-purple-400 font-bold">🌑 Тьма</span>;
      default: return <span className="text-slate-400">⚔️ Физический</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-indigo-500/50 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-2xl shadow-lg">
              📖
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Полный Бестиарий & Летопись Монстров ({BESTIARY_CATALOG.length} Созданий)
              </h2>
              <p className="text-xs text-slate-400">
                Изучайте уязвимости тварей, стихии и прокачивайте мастерство охоты!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[ESC]</span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-red-950/80 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 hover:border-red-500/50 transition-all cursor-pointer shadow"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3 shrink-0">
          <div className="flex gap-1.5 bg-slate-950/90 p-1 rounded-2xl border border-slate-800 flex-wrap flex-1">
            {[
              { id: 'all', label: `Все (${BESTIARY_CATALOG.length})` },
              { id: 'common', label: 'Обычные враги' },
              { id: 'zone_boss', label: 'Боссы зон (16)' },
              { id: 'dungeon_boss', label: 'Боссы подземелий (8)' },
              { id: 'hidden_boss', label: 'Скрытые боссы' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as BestiaryCategory)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="🔍 Поиск создания..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Monster List Scrollable */}
          <div className="md:col-span-5 flex flex-col space-y-2 overflow-y-auto pr-1">
            {filteredMonsters.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Созданий по запросу не найдено.
              </div>
            ) : (
              filteredMonsters.map((m) => {
                const isSelected = m.id === selectedMonster.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMonsterId(m.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-400 shadow-lg scale-[1.01]'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <img
                      src={m.artSrc}
                      alt={m.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-white truncate flex items-center gap-1.5">
                        <span>{m.icon}</span>
                        <span>{m.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{m.title}</div>
                      <div className="text-[9px] mt-0.5">{getElementBadge(m.element)}</div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Monster Details Card */}
          <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between overflow-y-auto space-y-4 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                <img
                  src={selectedMonster.artSrc}
                  alt={selectedMonster.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/60 shadow-2xl shrink-0"
                />
                <div>
                  <div className="text-lg font-black text-white flex items-center gap-2">
                    <span>{selectedMonster.icon}</span>
                    <span>{selectedMonster.name}</span>
                  </div>
                  <div className="text-xs text-indigo-400 font-bold">{selectedMonster.title}</div>
                  <div className="text-xs text-slate-400 mt-1">Зона обитания: <b className="text-slate-200">{selectedMonster.zone}</b></div>
                </div>
              </div>

              {/* Elemental Properties */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Стихия Монстра:</div>
                  <div className="mt-0.5">{getElementBadge(selectedMonster.element)}</div>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-rose-900/40">
                  <div className="text-rose-400 text-[10px]">Уязвимость к Стихии:</div>
                  <div className="mt-0.5">{getElementBadge(selectedMonster.weakness)} <span className="text-amber-400 font-black text-[10px]">(+150% Урона)</span></div>
                </div>
              </div>

              {/* Base Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 text-[10px]">Базовое Здоровье:</span>
                  <span className="font-bold text-emerald-400">{fmt(selectedMonster.baseHp)}</span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 text-[10px]">Базовая Атака:</span>
                  <span className="font-bold text-rose-400">{fmt(selectedMonster.baseDmg)}</span>
                </div>
              </div>

              {/* Lore Text */}
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                «{selectedMonster.lore}»
              </div>
            </div>

            {/* Hunting Mastery Progression */}
            <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Мастерство Охоты:</span>
                <span className="font-mono text-amber-300 font-black">Убито: {fmt(monsterKills)}</span>
              </div>
              <div className="text-xs font-black text-emerald-400">
                {mastery.label}
              </div>
              <div className="text-[10px] text-slate-400">
                Убивайте монстров в основном мире, Башне и Лабиринте для разблокировки постоянных пассивных бонусов!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

