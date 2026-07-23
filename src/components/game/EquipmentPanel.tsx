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
          className={`w-full flex items-center gap-1.5 rounded-lg border px-1.5 py-1 text-left transition-all hover:scale-[1.03] bg-slate-900/90 ${
            isSelected ? 'ring-2 ring-amber-400 border-amber-400 shadow-lg' : ''
          }`}
          style={{
            borderColor: r ? r.color : isSelected ? '#facc15' : '#334155',
            boxShadow: r ? `0 0 8px ${r.glow}` : undefined,
          }}
          title={item ? `${item.name}\n(ЛКМ — фильтр инвентаря, ПКМ — снять)` : `${slot.name} (ЛКМ — фильтр инвентаря)`}
        >
          <div
            className="w-7 h-7 rounded border flex items-center justify-center text-sm shrink-0 bg-slate-950"
            style={{ borderColor: r ? r.color : '#475569' }}
          >
            {item ? item.icon : slot.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[8px] text-slate-400 leading-none truncate">{slot.name}</div>
            <div className="text-[10px] font-bold text-white truncate leading-tight mt-0.5">
              {item ? item.name : '—'}
            </div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-3.5 shadow-2xl backdrop-blur-md font-sans">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-2.5 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <h3 className="font-black text-sm text-slate-100 uppercase tracking-wider">Кукла Снаряжения</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUnequipAll}
            className="text-[9px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-200 border border-slate-700 font-bold transition-all active:scale-95"
            title="Снять все надетые предметы в инвентарь"
          >
            Снять всё
          </button>
          <span className="text-[10px] text-slate-400 font-mono">
            Мощь: <b className="text-amber-300 font-black text-xs font-mono">⚡{fmt(totalScore)}</b>
          </span>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-1.5 mb-2.5 bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-[10px] text-center font-bold font-mono">
        <div className="text-red-400">⚔️ +{fmt(totalDmg)} <span className="text-[8px] text-slate-400 font-sans block">Урон</span></div>
        <div className="text-sky-400">🛡️ +{fmt(totalArmor)} <span className="text-[8px] text-slate-400 font-sans block">Броня</span></div>
        <div className="text-emerald-400">❤️ +{fmt(totalHp)} <span className="text-[8px] text-slate-400 font-sans block">HP</span></div>
      </div>

      {/* Paperdoll Slot Grid */}
      <div className="space-y-1.5">
        <div className="flex justify-center">{renderSlotBtn(PAPERDOLL_LAYOUT.top[0])}</div>
        <div className="flex gap-1.5">{PAPERDOLL_LAYOUT.bodyUpper.map(renderSlotBtn)}</div>
        <div className="flex gap-1.5">{PAPERDOLL_LAYOUT.bodyMid.map(renderSlotBtn)}</div>
        <div className="flex gap-1.5">{PAPERDOLL_LAYOUT.bodyLower.map(renderSlotBtn)}</div>

        {/* Jewelry section */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[9px] text-slate-400 font-bold mb-1">Бижутерия & Аксессуары:</div>
          <div className="grid grid-cols-5 gap-1">
            {PAPERDOLL_LAYOUT.jewelry.map(slot => {
              const item = equipment[slot.id];
              const r = item ? rarityById(item.rarity) : null;
              const isSelected = selectedSlotFilter === slot.kind;

              return (
                <div
                  key={slot.id}
                  className="relative group"
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
                    className={`w-full aspect-square rounded-xl border flex items-center justify-center text-lg transition-all hover:scale-105 bg-slate-950 ${
                      isSelected ? 'ring-2 ring-amber-400 border-amber-400 shadow-md' : ''
                    }`}
                    style={{
                      borderColor: r ? r.color : isSelected ? '#facc15' : '#334155',
                      boxShadow: r ? `0 0 8px ${r.glow}` : undefined,
                    }}
                    title={item ? `${item.name}\n(ЛКМ — фильтр, ПКМ — снять)` : slot.name}
                  >
                    {item ? item.icon : slot.icon}
                  </button>
                </div>
              );
            })}
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
