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

  const renderSlotBtn = (slot: SlotConfig) => {
    const item = equipment[slot.id];
    const r = item ? rarityById(item.rarity) : null;
    const isSelected = selectedSlotFilter === slot.kind;

    return (
      <div
        key={slot.id}
        className="relative group flex-1 min-w-0"
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
          className={`w-full flex items-center gap-2.5 rounded-2xl border p-2.5 sm:p-3 text-left transition-all hover:scale-[1.02] bg-slate-950/95 shadow-md ${
            isSelected ? 'ring-2 ring-amber-400 border-amber-400 shadow-xl' : ''
          }`}
          style={{
            borderColor: r ? r.color : isSelected ? '#facc15' : '#334155',
            boxShadow: r ? `0 0 12px ${r.glow}` : undefined,
          }}
          title={item ? `${item.name}\n(ЛКМ — фильтр инвентаря, ПКМ — снять)` : `${slot.name} (Пусто - ЛКМ — фильтр инвентаря)`}
        >
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center text-xl shrink-0 bg-slate-900 shadow-md"
            style={{ borderColor: r ? r.color : '#475569' }}
          >
            {item ? item.icon : slot.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-extrabold uppercase leading-tight truncate">{slot.name}</div>
            <div className="text-xs sm:text-[13px] font-black truncate leading-tight mt-0.5" style={{ color: r ? r.color : '#64748b' }}>
              {item ? item.name : 'Пусто'}
            </div>
          </div>
          {item && (
            <span className="text-[10px] font-black text-amber-300 font-mono shrink-0 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 shadow-inner">
              ⚡{fmt(item.score)}
            </span>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-4 sm:p-5 shadow-2xl backdrop-blur-md font-sans space-y-3.5 w-full min-w-[340px] md:min-w-[420px]">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl p-1 bg-amber-500/10 rounded-lg border border-amber-500/30">🛡️</span>
          <div>
            <h3 className="font-black text-sm text-slate-100 uppercase tracking-wider">Кукла Снаряжения</h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Общая мощь: <b className="text-amber-300 font-black text-xs">⚡{fmt(totalScore)}</b>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={equipBestAll}
            className="text-[10px] px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:scale-105 text-white font-black border border-emerald-400/60 shadow-lg transition-all active:scale-95 flex items-center gap-1"
            title="Автоматически надевает предметы с наибольшей мощью из инвентаря во все слоты"
          >
            <span>⚡ Надеть всё лучшее</span>
          </button>
          <button
            onClick={handleUnequipAll}
            className="text-[10px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-200 border border-slate-700 font-bold transition-all active:scale-95"
            title="Снять все надетые предметы в инвентарь"
          >
            Снять всё
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 text-xs text-center font-black font-mono">
        <div className="text-red-400">⚔️ +{fmt(totalDmg)} <span className="text-[9px] text-slate-400 font-sans block font-semibold">Урон</span></div>
        <div className="text-sky-400">🛡️ +{fmt(totalArmor)} <span className="text-[9px] text-slate-400 font-sans block font-semibold">Броня</span></div>
        <div className="text-emerald-400">❤️ +{fmt(totalHp)} <span className="text-[9px] text-slate-400 font-sans block font-semibold">HP</span></div>
      </div>

      {/* Main Body Armor Paperdoll Slot Grid */}
      <div className="space-y-2">
        <div className="flex justify-center">{renderSlotBtn(PAPERDOLL_LAYOUT.top[0])}</div>
        <div className="flex gap-2">{PAPERDOLL_LAYOUT.bodyUpper.map(renderSlotBtn)}</div>
        <div className="flex gap-2">{PAPERDOLL_LAYOUT.bodyMid.map(renderSlotBtn)}</div>
        <div className="flex gap-2">{PAPERDOLL_LAYOUT.bodyLower.map(renderSlotBtn)}</div>

        {/* Unified Jewelry Section */}
        <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5">
          <div className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <span>💎</span>
            <span>БИЖУТЕРИЯ И АКСЕССУАРЫ</span>
          </div>

          <div className="space-y-2">
            <div>{renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[0])}</div>
            <div className="grid grid-cols-2 gap-2">
              {renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[1])}
              {renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[2])}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[3])}
              {renderSlotBtn(PAPERDOLL_LAYOUT.jewelry[4])}
            </div>
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
