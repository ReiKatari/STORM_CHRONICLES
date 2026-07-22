import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Item } from '@/game/types';
import { AFFIX_LABELS, getItemLore, rarityById, getSetById } from '@/game/items';

export function ItemCard({ item, equippedItem, compact }: { item: Item; equippedItem?: Item | null; compact?: boolean }) {
  if (!item) return null;

  const r = rarityById(item.rarity || 'common');
  const eqRarity = equippedItem ? rarityById(equippedItem.rarity || 'common') : null;
  const lore = getItemLore(item);
  const setDef = item.setId ? getSetById(item.setId) : null;

  // Safe Stat comparisons
  const calcStat = (it: Item, statName: 'dmg' | 'armor' | 'hp') => {
    if (!it) return 0;
    const baseVal = it.base ? (it.base[statName] ?? 0) : 0;
    const affixesVal = Array.isArray(it.affixes)
      ? it.affixes.filter(a => a && a.stat === statName).reduce((s, a) => s + (a.value ?? 0), 0)
      : 0;
    return baseVal + affixesVal;
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

  const scoreDiff = equippedItem ? (item.score || 0) - (equippedItem.score || 0) : (item.score || 0);

  return (
    <div
      className="rounded-xl border p-3 text-xs bg-slate-900/98 min-w-[220px] max-w-[270px] shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md"
      style={{ borderColor: r.color, boxShadow: `0 0 16px ${r.glow}, 0 10px 30px rgba(0,0,0,0.9)` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1.5 border-b border-slate-800 pb-1.5">
        <div
          className="w-10 h-10 rounded-lg border flex items-center justify-center text-xl shrink-0 bg-slate-800"
          style={{ borderColor: r.color }}
        >
          {item.icon || '📦'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold leading-tight truncate text-sm" style={{ color: r.color }}>
            {item.name || 'Безымянный предмет'}
          </div>
          <div className="text-slate-400 text-[10px] flex items-center gap-1.5 mt-0.5">
            <span>{r.name}</span>
            <span>·</span>
            <span>{item.ilvl || 1} ур.</span>
            <span>·</span>
            <span className="text-amber-300 font-bold">⚡{item.score || 0}</span>
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <div className="space-y-1 text-slate-300 text-[11px]">
        {item.base && item.base.dmg ? (
          <div className="flex justify-between items-center">
            <span>⚔️ Урон:</span>
            <b className="text-white">+{item.base.dmg}</b>
          </div>
        ) : null}
        {item.base && item.base.armor ? (
          <div className="flex justify-between items-center">
            <span>🛡️ Броня:</span>
            <b className="text-white">+{item.base.armor}</b>
          </div>
        ) : null}
        {item.base && item.base.hp ? (
          <div className="flex justify-between items-center">
            <span>❤️ Здоровье:</span>
            <b className="text-white">+{item.base.hp}</b>
          </div>
        ) : null}

        {/* Affixes */}
        {!compact && Array.isArray(item.affixes) && item.affixes.length > 0 && (
          <div className="pt-1 border-t border-slate-800/60 space-y-0.5">
            {item.affixes.map((a, i) => {
              if (!a) return null;
              const l = AFFIX_LABELS[a.stat];
              if (!l) return null;
              return (
                <div key={i} className="text-emerald-300 flex justify-between items-center text-[10px]">
                  <span>{l.icon} {l.name}:</span>
                  <span className="font-semibold">+{a.value}{l.suffix ?? ''}</span>
                </div>
              );
            })}
          </div>
        )}

        {!compact && <div className="text-amber-300/80 pt-1 text-[10px]">💰 Продажа: {item.sellPrice || 10} gold</div>}
      </div>

      {/* Set Item Info */}
      {!compact && setDef && (
        <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[10px] space-y-1">
          <div className="font-extrabold flex items-center gap-1" style={{ color: setDef.color }}>
            <span>{setDef.icon}</span>
            <span>{setDef.name}</span>
          </div>
          <div className="text-[9px] text-slate-300 space-y-0.5">
            {setDef.bonuses.map((b, i) => (
              <div key={i} className="text-emerald-300">
                • ({b.reqPieces} предм.): {b.desc}
              </div>
            ))}
          </div>
        </div>
      )}

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
              ✨ Слот свободен (предмет улучшит мощь)
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * SmartItemTooltip: Uses React Portal to render strictly onto document.body at z-[9999].
 * Clamps coordinates strictly within viewport bounds so tooltips NEVER hide or clip!
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
    if (!anchorRect || !item) return;

    const computePos = () => {
      const el = containerRef.current;
      const cardW = el ? el.offsetWidth : 270;
      const cardH = el ? el.offsetHeight : 360;

      const minX = 12;
      const maxX = Math.max(12, window.innerWidth - cardW - 12);
      const minY = 12;
      const maxY = Math.max(12, window.innerHeight - cardH - 12);

      // Prefer placing to the left of anchor item
      let x = anchorRect.left - cardW - 14;
      if (x < minX) {
        // If placing to left breaches minX, place to the right
        x = anchorRect.right + 14;
      }

      // Clamp x strictly within viewport
      if (x > maxX) x = maxX;
      if (x < minX) x = minX;

      let y = anchorRect.top;
      if (y > maxY) y = maxY;
      if (y < minY) y = minY;

      setPos({ x, y });
    };

    computePos();
    const t = setTimeout(computePos, 10);
    return () => clearTimeout(t);
  }, [anchorRect, item]);

  if (!anchorRect || !item) return null;

  const tooltipElement = (
    <>
      {onClose && (
        <div className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[1px]" onClick={onClose} />
      )}
      <div
        ref={containerRef}
        className="fixed z-[9999] pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-fadeIn"
        style={{ left: pos.x, top: pos.y }}
      >
        <ItemCard item={item} equippedItem={equippedItem} />
        {children}
      </div>
    </>
  );

  return createPortal(tooltipElement, document.body);
}
