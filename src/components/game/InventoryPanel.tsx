import { useState } from 'react';
import { useGame } from '@/game/store';
import { rarityById, RARITIES, SLOT_DEFS } from '@/game/items';
import { SmartItemTooltip } from './ItemCard';
import type { Item, RarityId, SlotId } from '@/game/types';
import { fmt } from '@/game/engine';

function getEquippedItem(item: Item, equipment: Partial<Record<SlotId, Item>>): Item | null {
  if (item.slot === 'ring') {
    const r1 = equipment['ring1'];
    const r2 = equipment['ring2'];
    if (!r1 && !r2) return null;
    if (!r1) return r2;
    if (!r2) return r1;
    return r1.score <= r2.score ? r1 : r2;
  }
  if (item.slot === 'earring') {
    const e1 = equipment['earring1'];
    const e2 = equipment['earring2'];
    if (!e1 && !e2) return null;
    if (!e1) return e2;
    if (!e2) return e1;
    return e1.score <= e2.score ? e1 : e2;
  }
  return equipment[item.slot as SlotId] ?? null;
}

export default function InventoryPanel() {
  const inventory = useGame(s => s.inventory);
  const equipment = useGame(s => s.equipment);
  const selectedSlotFilter = useGame(s => s.selectedSlotFilter);
  const setSlotFilter = useGame(s => s.setSlotFilter);
  const equip = useGame(s => s.equip);
  const sellItem = useGame(s => s.sellItem);
  const sellJunk = useGame(s => s.sellJunk);
  const [hover, setHover] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [pinned, setPinned] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [filter, setFilter] = useState<RarityId | 'all'>('all');

  const filtered = [...inventory]
    .filter(i => (filter === 'all' || i.rarity === filter) && (selectedSlotFilter === 'all' || i.slot === selectedSlotFilter))
    .sort((a, b) => b.score - a.score);

  const activeSlotDef = selectedSlotFilter !== 'all' ? SLOT_DEFS.find(s => s.kind === selectedSlotFilter) : null;

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-3.5 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5 border-b border-slate-800 pb-2 shrink-0">
        <h3 className="font-black text-sm text-slate-100 flex items-center gap-2">
          <span className="p-1 bg-amber-500/10 rounded-lg border border-amber-500/30 text-base">🎒</span>
          <span>Инвентарь</span>
          <span className="text-slate-400 text-xs font-mono font-bold">({fmt(inventory.length)}/72)</span>
        </h3>
        <div className="flex gap-1.5">
          <button
            onClick={() => sellJunk('rare')}
            className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95 shadow"
            title="Продать обычные и необычные предметы"
          >
            Продать хлам
          </button>
          <button
            onClick={() => sellJunk('epic')}
            className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95 shadow"
            title="Продать всё ниже эпического"
          >
            Ниже эпика
          </button>
        </div>
      </div>

      {/* Equipment Slot Filter Badge Banner */}
      {activeSlotDef && (
        <div className="mb-2 p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-2 text-xs shrink-0 animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold">
            <span className="text-base">{activeSlotDef.icon}</span>
            <span>Фильтр слота: {activeSlotDef.name}</span>
            <span className="text-slate-400 font-mono text-[10px]">({fmt(filtered.length)} шт)</span>
          </div>
          <button
            onClick={() => setSlotFilter('all')}
            className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/30"
          >
            ✕ Сбросить
          </button>
        </div>
      )}

      {/* Rarity Filter Bar */}
      <div className="flex gap-1 mb-2.5 flex-wrap items-center shrink-0">
        <button
          onClick={() => setFilter('all')}
          className={`text-[10px] px-2.5 py-1 rounded-lg font-extrabold transition-all ${
            filter === 'all' ? 'bg-slate-700 text-white shadow' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          Все ({fmt(inventory.length)})
        </button>
        {RARITIES.map(r => {
          const count = inventory.filter(i => i.rarity === r.id).length;
          if (count === 0 && filter !== r.id) return null;
          return (
            <button
              key={r.id}
              onClick={() => setFilter(r.id)}
              className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                filter === r.id ? 'bg-slate-700 shadow' : 'bg-slate-850 hover:bg-slate-800'
              }`}
              style={{ color: r.color }}
            >
              <span>●</span>
              <span className="text-slate-300 font-mono">{fmt(count)}</span>
            </button>
          );
        })}
      </div>

      {/* Compact Dynamic Inventory Grid */}
      <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-1 min-h-0 pr-1 content-start auto-rows-max">
        {filtered.length === 0 && (
          <div className="col-span-2 text-center text-slate-500 text-xs py-12 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
            {selectedSlotFilter !== 'all'
              ? `Нет подходящих предметов для слота «${activeSlotDef?.name}»`
              : 'Пусто. Убивайте монстров — лут сам придёт!'}
          </div>
        )}
        {filtered.map(item => {
          const r = rarityById(item.rarity);
          const eqItem = getEquippedItem(item, equipment);
          const scoreDiff = eqItem ? item.score - eqItem.score : item.score;

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={e => {
                setHover({ id: item.id, rect: e.currentTarget.getBoundingClientRect() });
              }}
              onMouseLeave={() => setHover(null)}
            >
              <div
                onClick={e => {
                  if (pinned?.id === item.id) {
                    setPinned(null);
                    return;
                  }
                  setPinned({
                    id: item.id,
                    rect: e.currentTarget.getBoundingClientRect(),
                  });
                }}
                className={`flex items-center gap-2.5 rounded-xl border p-2 cursor-pointer transition-all hover:scale-[1.02] bg-slate-950/80 hover:bg-slate-900 ${
                  pinned?.id === item.id ? 'ring-2 ring-purple-500' : ''
                }`}
                style={{ borderColor: r.color, boxShadow: `0 0 6px ${r.glow}` }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg border flex items-center justify-center text-xl shrink-0 bg-slate-900 shadow"
                  style={{ borderColor: r.color }}
                >
                  {item.icon || '📦'}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black truncate leading-tight" style={{ color: r.color }}>
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-none mt-0.5 truncate font-mono">
                    {r.name} · <span className="text-slate-300">{fmt(item.ilvl)} ур</span>
                  </div>
                </div>

                {/* Comparison Arrow Badge */}
                {scoreDiff > 0 ? (
                  <span
                    className="text-emerald-400 font-black text-xs px-1.5 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.3)] animate-pulse"
                    title={`Улучшение! (+${fmt(scoreDiff)} мощи)`}
                  >
                    ▲
                  </span>
                ) : scoreDiff < 0 ? (
                  <span
                    className="text-red-400 font-black text-xs px-1.5 py-0.5 rounded-lg bg-red-950/80 border border-red-500/40 shrink-0"
                    title={`Хуже надетого (${fmt(scoreDiff)} мощи)`}
                  >
                    ▼
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Hover Preview */}
      {hover && !pinned && (() => {
        const item = inventory.find(i => i.id === hover.id);
        if (!item) return null;
        const eqItem = getEquippedItem(item, equipment);
        return (
          <SmartItemTooltip
            item={item}
            equippedItem={eqItem}
            targetRect={hover.rect}
          />
        );
      })()}

      {/* Pinned Click Popup with Gear Comparison & Action Buttons */}
      {pinned && (() => {
        const item = inventory.find(i => i.id === pinned.id);
        if (!item) return null;
        const eqItem = getEquippedItem(item, equipment);
        return (
          <SmartItemTooltip
            item={item}
            equippedItem={eqItem}
            targetRect={pinned.rect}
            onClose={() => setPinned(null)}
          >
            <div className="flex gap-2 mt-2.5">
              <button
                onClick={() => {
                  equip(item.id);
                  setPinned(null);
                }}
                className="flex-1 text-xs py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg transition-all active:scale-95"
              >
                ⚔️ Надеть
              </button>
              <button
                onClick={() => {
                  sellItem(item.id);
                  setPinned(null);
                }}
                className="flex-1 text-xs py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold shadow-lg transition-all active:scale-95 font-mono"
              >
                💰 {fmt(item.sellPrice)} g
              </button>
            </div>
          </SmartItemTooltip>
        );
      })()}
    </div>
  );
}
