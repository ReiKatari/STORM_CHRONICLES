import { useEffect, useRef, useState } from 'react';
import type { Item } from '@/game/types';
import { AFFIX_LABELS, getItemLore, rarityById } from '@/game/items';

export function ItemCard({ item, equippedItem, compact }: { item: Item; equippedItem?: Item | null; compact?: boolean }) {
  const r = rarityById(item.rarity);
  const eqRarity = equippedItem ? rarityById(equippedItem.rarity) : null;
  const lore = getItemLore(item);

  // Stat comparisons
  const calcStat = (it: Item, statName: 'dmg' | 'armor' | 'hp') => {
    return (it.base[statName] ?? 0) + it.affixes.filter(a => a.stat === statName).reduce((s, a) => s + a.value, 0);
  };

  const itemDmg = calcStat(item, 'dmg');
  const eqDmg = equippedItem ? calcStat(equippedItem, 'dmg') : 0;
  const dmgDiff = itemDmg - eqDmg;

  const itemArmor = calcStat(item, 'armor');
  const eqArmor = equippedItem ? calcStat(equippedItem, 'armor') : 0;
  const armorDiff = itemArmor - eqArmor;

  const itemHp = calcStat(item, 'hp');
  const eqHp = equippedItem ? calcStat(equippedItem, 'hp') : 0;
  const hpDiff = itemHp - eqHp;

  const scoreDiff = equippedItem ? item.score - equippedItem.score : item.score;

  return (
    <div
      className="rounded-xl border p-2.5 text-xs bg-slate-900/95 min-w-[210px] max-w-[260px] shadow-2xl backdrop-blur-md"
      style={{ borderColor: r.color, boxShadow: `0 0 14px ${r.glow}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1.5 border-b border-slate-800 pb-1.5">
        <div
          className="w-10 h-10 rounded-lg border flex items-center justify-center text-xl shrink-0 bg-slate-800"
          style={{ borderColor: r.color }}
        >
          {item.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold leading-tight truncate text-sm" style={{ color: r.color }}>
            {item.name}
          </div>
          <div className="text-slate-400 text-[10px] flex items-center gap-1.5 mt-0.5">
            <span>{r.name}</span>
            <span>·</span>
            <span>{item.ilvl} ур.</span>
            <span>·</span>
            <span className="text-amber-300 font-bold">⚡{item.score}</span>
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <div className="space-y-1 text-slate-300 text-[11px]">
        {item.base.dmg ? (
          <div className="flex justify-between items-center">
            <span>⚔️ Урон:</span>
            <b className="text-white">+{item.base.dmg}</b>
          </div>
        ) : null}
        {item.base.armor ? (
          <div className="flex justify-between items-center">
            <span>🛡️ Броня:</span>
            <b className="text-white">+{item.base.armor}</b>
          </div>
        ) : null}
        {item.base.hp ? (
          <div className="flex justify-between items-center">
            <span>❤️ Здоровье:</span>
            <b className="text-white">+{item.base.hp}</b>
          </div>
        ) : null}

        {/* Affixes */}
        {!compact && item.affixes.length > 0 && (
          <div className="pt-1 border-t border-slate-800/60 space-y-0.5">
            {item.affixes.map((a, i) => {
              const l = AFFIX_LABELS[a.stat];
              return (
                <div key={i} className="text-emerald-300 flex justify-between items-center text-[10px]">
                  <span>{l.icon} {l.name}:</span>
                  <span className="font-semibold">+{a.value}{l.suffix ?? ''}</span>
                </div>
              );
            })}
          </div>
        )}

        {!compact && <div className="text-amber-300/80 pt-1 text-[10px]">💰 Продажа: {item.sellPrice} gold</div>}
      </div>

      {/* Item Lore Story */}
      {!compact && (
        <div className="mt-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[10px] italic text-slate-300 leading-relaxed shadow-inner">
          <div className="text-[9px] font-bold not-italic mb-0.5" style={{ color: r.color }}>
            📜 Легенда предмета:
          </div>
          «{lore}»
        </div>
      )}

      {/* Gear Comparison Section */}
      {!compact && (
        <div className="mt-2 pt-1.5 border-t border-slate-800 bg-slate-950/60 p-2 rounded-lg text-[10px]">
          <div className="font-bold text-slate-400 mb-1 flex items-center justify-between">
            <span>Сравнение с надетым:</span>
            {scoreDiff > 0 ? (
              <span className="text-emerald-400 font-extrabold flex items-center gap-0.5">
                ▲ +{scoreDiff} ⚡
              </span>
            ) : scoreDiff < 0 ? (
              <span className="text-red-400 font-extrabold flex items-center gap-0.5">
                ▼ {scoreDiff} ⚡
              </span>
            ) : (
              <span className="text-slate-400 font-bold">= Равно</span>
            )}
          </div>

          {equippedItem ? (
            <div className="space-y-0.5 text-slate-300">
              <div className="text-slate-400 truncate mb-1">
                Надето: <span style={{ color: eqRarity?.color }}>{equippedItem.name}</span>
              </div>
              {dmgDiff !== 0 && (
                <div className="flex justify-between">
                  <span>Урон:</span>
                  <span className={dmgDiff > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {dmgDiff > 0 ? `+${dmgDiff}` : dmgDiff}
                  </span>
                </div>
              )}
              {armorDiff !== 0 && (
                <div className="flex justify-between">
                  <span>Броня:</span>
                  <span className={armorDiff > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {armorDiff > 0 ? `+${armorDiff}` : armorDiff}
                  </span>
                </div>
              )}
              {hpDiff !== 0 && (
                <div className="flex justify-between">
                  <span>Здоровье:</span>
                  <span className={hpDiff > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {hpDiff > 0 ? `+${hpDiff}` : hpDiff}
                  </span>
                </div>
              )}
              {dmgDiff === 0 && armorDiff === 0 && hpDiff === 0 && (
                <div className="text-slate-400 text-center py-0.5">Основные характеристики равны</div>
              )}
            </div>
          ) : (
            <div className="text-emerald-400 font-semibold text-center">
              ✨ Слот свободен (предмет улучшит мошь)
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * SmartItemTooltip: Clamps item card positioning strictly inside the visible viewport (left, right, top, bottom).
 */
export function SmartItemTooltip({
  item,
  equippedItem,
  anchorRect,
  onClose,
  children,
}: {
  item: Item;
  equippedItem?: Item | null;
  anchorRect: DOMRect | null;
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });

  useEffect(() => {
    if (!anchorRect) return;

    const computePos = () => {
      const el = containerRef.current;
      const cardW = el ? el.offsetWidth : 260;
      const cardH = el ? el.offsetHeight : 340;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Try placing to the left of anchor
      let x = anchorRect.left - cardW - 12;
      // If going offscreen to the left, flip to the right of anchor
      if (x < 10) {
        x = anchorRect.right + 12;
      }
      // If going offscreen to the right, clamp to viewport edge
      if (x + cardW > vw - 10) {
        x = vw - cardW - 10;
      }
      x = Math.max(10, x);

      // Try top alignment with anchor
      let y = anchorRect.top;
      // If going offscreen at the bottom, clamp up
      if (y + cardH > vh - 10) {
        y = vh - cardH - 10;
      }
      y = Math.max(10, y);

      setPos({ x, y });
    };

    computePos();
    // Recompute after render when element bounds are updated
    const t = setTimeout(computePos, 10);
    return () => clearTimeout(t);
  }, [anchorRect, item]);

  if (!anchorRect) return null;

  return (
    <>
      {onClose && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" onClick={onClose} />
      )}
      <div
        ref={containerRef}
        className="fixed z-50 animate-fadeIn pointer-events-auto"
        style={{ left: pos.x, top: pos.y }}
      >
        <ItemCard item={item} equippedItem={equippedItem} />
        {children}
      </div>
    </>
  );
}
