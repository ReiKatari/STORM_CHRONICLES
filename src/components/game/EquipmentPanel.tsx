import { useState } from 'react';
import { useGame } from '@/game/store';
import { rarityById } from '@/game/items';
import { SmartItemTooltip } from './ItemCard';
import type { SlotId, SlotKind } from '@/game/types';
import { fmt } from '@/game/engine';

interface SlotConfig {
  id: SlotId;
  kind: SlotKind;
  name: string;
  icon: string;
}

const PAPERDOLL_LAYOUT: {
  top: SlotConfig[];
  bodyUpper: SlotConfig[];
  bodyMid: SlotConfig[];
  bodyLower: SlotConfig[];
  jewelry: SlotConfig[];
} = {
  top: [
    { id: 'helmet', kind: 'helmet', name: 'Шлем', icon: '🪖' },
  ],
  bodyUpper: [
    { id: 'shoulders', kind: 'shoulders', name: 'Наплечники', icon: '🎽' },
    { id: 'armor', kind: 'armor', name: 'Броня', icon: '🛡️' },
    { id: 'cloak', kind: 'cloak', name: 'Плащ', icon: '🧣' },
  ],
  bodyMid: [
    { id: 'weapon', kind: 'weapon', name: 'Оружие', icon: '⚔️' },
    { id: 'pants', kind: 'pants', name: 'Штаны', icon: '👖' },
    { id: 'banner', kind: 'banner', name: 'Знамя', icon: '🚩' },
  ],
  bodyLower: [
    { id: 'gloves', kind: 'gloves', name: 'Перчатки', icon: '🧤' },
    { id: 'kneepads', kind: 'kneepads', name: 'Наколенники', icon: '🦵' },
    { id: 'boots', kind: 'boots', name: 'Сапоги', icon: '🥾' },
  ],
  jewelry: [
    { id: 'amulet', kind: 'amulet', name: 'Амулет', icon: '🔮' },
    { id: 'ring1', kind: 'ring', name: 'Кольцо I', icon: '💍' },
    { id: 'ring2', kind: 'ring', name: 'Кольцо II', icon: '💍' },
    { id: 'earring1', kind: 'earring', name: 'Серьга I', icon: '📿' },
    { id: 'earring2', kind: 'earring', name: 'Серьга II', icon: '📿' },
  ],
};

export default function EquipmentPanel({ onSelectSlot }: { onSelectSlot?: (kind: SlotKind) => void }) {
  const equipment = useGame(s => s.equipment);
  const unequip = useGame(s => s.unequip);
  const equipBestAll = useGame(s => (s as unknown as { equipBestAll: () => void }).equipBestAll);
  const setSlotFilter = useGame(s => s.setSlotFilter);
  const selectedSlotFilter = useGame(s => s.selectedSlotFilter);
  const [hoverSlot, setHoverSlot] = useState<{ id: SlotId; rect: DOMRect } | null>(null);

  const totalScore = Object.values(equipment).reduce((sum, i) => sum + (i?.score ?? 0), 0);
  const totalDmg = Object.values(equipment).reduce((sum, i) => sum + (i?.base.dmg ?? 0), 0);
  const totalArmor = Object.values(equipment).reduce((sum, i) => sum + (i?.base.armor ?? 0), 0);
  const totalHp = Object.values(equipment).reduce((sum, i) => sum + (i?.base.hp ?? 0), 0);

  const handleSlotClick = (slot: SlotConfig) => {
    setSlotFilter(slot.kind);
    if (onSelectSlot) onSelectSlot(slot.kind);
  };

  const handleUnequipAll = () => {
    Object.keys(equipment).forEach(slotId => unequip(slotId as SlotId));
  };

  const renderSlotBtn = (slot: SlotConfig, extraWrapperClass = '') => {
    const item = equipment[slot.id];
    const r = item ? rarityById(item.rarity) : null;
    const isSelected = selectedSlotFilter === slot.kind;

    return (
      <div
        key={slot.id}
        className={`relative group w-full min-w-0 ${extraWrapperClass}`}
        onMouseEnter={e => {
          setHoverSlot({ id: slot.id, rect: e.currentTarget.getBoundingClientRect() });
        }}
        onMouseLeave={() => setHoverSlot(null)}
      >
        <button
          onClick={() => handleSlotClick(slot)}
          onContextMenu={e => {
            e.preventDefault();
            if (item) unequip(slot.id);
          }}
          className={`w-full flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all hover:scale-[1.01] bg-slate-950/95 shadow-md ${
            isSelected ? 'ring-2 ring-amber-400 border-amber-400 shadow-xl' : ''
          }`}
          style={{
            borderColor: r ? r.color : isSelected ? '#facc15' : '#334155',
            boxShadow: r ? `0 0 14px ${r.glow}` : undefined,
          }}
          title={item ? `${item.name}\n(ЛКМ — фильтр инвентаря, ПКМ — снять)` : `${slot.name} (Пусто - ЛКМ — фильтр инвентаря)`}
        >
          <div
            className="w-11 h-11 rounded-xl border flex items-center justify-center text-2xl shrink-0 bg-slate-900 shadow-md"
            style={{ borderColor: r ? r.color : '#475569' }}
          >
            {item ? item.icon : slot.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-slate-400 font-extrabold uppercase leading-tight truncate">{slot.name}</div>
            <div className="text-[13.5px] font-black truncate leading-tight mt-0.5" style={{ color: r ? r.color : '#64748b' }}>
              {item ? item.name : 'Пусто'}
            </div>
          </div>
          {item && (
            <span className="text-[11px] font-black text-amber-300 font-mono shrink-0 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 shadow-inner">
              ⚡{fmt(item.score)}
            </span>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-4 sm:p-6 shadow-2xl backdrop-blur-md font-sans space-y-4 w-full max-w-[860px] mx-auto">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl p-1.5 bg-amber-500/10 rounded-xl border border-amber-500/30">🛡️</span>
          <div>
            <h3 className="font-black text-base text-slate-100 uppercase tracking-wider">Кукла Снаряжения Персонажа</h3>
            <span className="text-xs text-slate-400 font-mono">
              Общая боевая мощь: <b className="text-amber-300 font-black text-sm">⚡{fmt(totalScore)}</b>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={equipBestAll}
            className="text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:scale-105 text-white font-black border border-emerald-400/60 shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            title="Автоматически надевает предметы с наибольшей мощью из инвентаря во все слоты"
          >
            <span>⚡ Надеть всё лучшее</span>
          </button>
          <button
            onClick={handleUnequipAll}
            className="text-xs px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-200 border border-slate-700 font-bold transition-all active:scale-95"
            title="Снять все надетые предметы в инвентарь"
          >
            Снять всё
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-3 bg-slate-950/90 p-3 rounded-2xl border border-slate-800 text-sm text-center font-black font-mono">
        <div className="text-red-400">⚔️ +{fmt(totalDmg)} <span className="text-xs text-slate-400 font-sans block font-semibold">Урон</span></div>
        <div className="text-sky-400">🛡️ +{fmt(totalArmor)} <span className="text-xs text-slate-400 font-sans block font-semibold">Броня</span></div>
        <div className="text-emerald-400">❤️ +{fmt(totalHp)} <span className="text-xs text-slate-400 font-sans block font-semibold">Здоровье HP</span></div>
      </div>

      {/* 2-Column Grid Layout with Centered Helmet & Amulet */}
      <div className="space-y-3.5 w-full">
        {/* Helmet (1 Single Slot Centered) */}
        <div className="flex justify-center w-full">
          {renderSlotBtn(PAPERDOLL_LAYOUT.top[0], 'max-w-[420px]')}
        </div>

        {/* 2 Slots Per Row Main Equipment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
          {renderSlotBtn(PAPERDOLL_LAYOUT.bodyUpper[0])} {/* Наплечники */}
          {renderSlotBtn(PAPERDOLL_LAYOUT.bodyUpper[1])} {/* Броня */}
          {renderSlotBtn(PAPERDOLL_LAYOUT.bodyUpper[2])} {/* Плащ */}
          {renderSlotBtn(PAPERDOLL_LAYOUT.bodyMid[0])}   {/* Оружие */}
          {renderSlotBtn(PAPERDOLL_LAYOUT.bodyMid[1])}   {/* Штаны */}
          {renderSlotBtn(PAPERDOLL_LAYOUT.bodyMid[2])}   {/* Знамя */}
          {renderSlotBtn(PAPERDOLL_LAYOUT.bodyLower[0])} {/* Перчатки */}
          {renderSlotBtn(PAPERDOLL_LAYOUT.bodyLower[1])} {/* Наколенники */}
          {renderSlotBtn(PAPERDOLL_LAYOUT.bodyLower[2], 'sm:col-span-2 max-w-[420px] mx-auto')} {/* Сапоги */}
        </div>

        {/* Jewelry Section */}
        <div className="pt-3.5 border-t border-slate-800/80 space-y-3.5 w-full">
          <div className="text-xs text-slate-300 font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
            <span>💎</span>
            <span>БИЖУТЕРИЯ И АКСЕССУАРЫ</span>
          </div>

          {/* Amulet (1 Single Slot Centered) */}
          <div className="flex justify-center w-full">
            {renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[0], 'max-w-[420px]')}
          </div>

          {/* Rings (2 Slots Per Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            {renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[1])}
            {renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[2])}
          </div>

          {/* Earrings (2 Slots Per Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            {renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[3])}
            {renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[4])}
          </div>
        </div>
      </div>

      {/* Tooltip Portal */}
      {hoverSlot && equipment[hoverSlot.id] && (
        <SmartItemTooltip
          item={equipment[hoverSlot.id]!}
          targetRect={hoverSlot.rect}
        />
      )}
    </div>
  );
}
