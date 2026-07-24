import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Item } from '@/game/types';
import { AFFIX_LABELS, getItemLore, rarityById, getSetById } from '@/game/items';
import { fmt } from '@/game/engine';

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
      className="rounded-xl border-2 p-3 text-xs bg-slate-950 min-w-[230px] max-w-[280px] shadow-[0_20px_60px_rgba(0,0,0,1)] opacity-100"
      style={{ borderColor: r.color, boxShadow: `0 0 20px ${r.glow}, 0 20px 60px rgba(0,0,0,1)` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2 border-b border-slate-800 pb-2">
        <div
          className="w-10 h-10 rounded-lg border flex items-center justify-center text-xl shrink-0 bg-slate-900"
          style={{ borderColor: r.color }}
        >
          {item.icon || '📦'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-black leading-tight truncate text-sm" style={{ color: r.color }}>
            {item.name || 'Безымянный предмет'}
          </div>
          <div className="text-slate-400 text-[10px] flex items-center gap-1.5 mt-0.5 font-bold">
            <span>{r.name}</span>
            <span>·</span>
            <span>{fmt(item.ilvl || 1)} ур.</span>
            <span>·</span>
            <span className="text-amber-300">⚡{fmt(item.score || 0)}</span>
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <div className="space-y-1 text-slate-200 text-[11px]">
        {item.base && item.base.dmg ? (
          <div className="flex justify-between items-center">
            <span>⚔️ Урон:</span>
            <b className="text-white font-mono">+{fmt(item.base.dmg)}</b>
          </div>
        ) : null}
        {item.base && item.base.armor ? (
          <div className="flex justify-between items-center">
            <span>🛡️ Броня:</span>
            <b className="text-white font-mono">+{fmt(item.base.armor)}</b>
          </div>
        ) : null}
        {item.base && item.base.hp ? (
          <div className="flex justify-between items-center">
            <span>❤️ Здоровье:</span>
            <b className="text-white font-mono">+{fmt(item.base.hp)}</b>
          </div>
        ) : null}

        {/* Affixes */}
        {!compact && Array.isArray(item.affixes) && item.affixes.length > 0 && (
          <div className="pt-1 border-t border-slate-800 space-y-0.5">
            {item.affixes.map((a, i) => {
              if (!a) return null;
              const l = AFFIX_LABELS[a.stat];
              if (!l) return null;
              return (
                <div key={i} className="text-emerald-300 flex justify-between items-center text-[10px]">
                  <span>{l.icon} {l.name}:</span>
                  <span className="font-extrabold font-mono">+{fmt(a.value)}{l.suffix ?? ''}</span>
                </div>
              );
            })}
          </div>
        )}

        {!compact && <div className="text-amber-300 font-bold pt-1 text-[10px]">💰 Продажа: {fmt(item.sellPrice || 10)} gold</div>}
      </div>

      {/* Set Item Info */}
      {!compact && setDef && (
        <div className="mt-2 p-2 rounded-lg bg-emerald-950 border border-emerald-500/60 text-[10px] space-y-1">
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
        <div className="mt-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] italic text-slate-300 leading-relaxed shadow-inner">
          <div className="text-[9px] font-bold not-italic mb-0.5" style={{ color: r.color }}>
            📜 Легенда предмета:
          </div>
          «{lore}»
        </div>
      )}

      {/* Gear Comparison Section */}
      {!compact && (
        <div className="mt-2 pt-1.5 border-t border-slate-800 bg-slate-900 p-2 rounded-lg text-[10px]">
          <div className="font-bold text-slate-400 mb-1 flex items-center justify-between">
            <span>Сравнение с надетым:</span>
            {scoreDiff > 0 ? (
              <span className="text-emerald-400 font-black flex items-center gap-0.5">
                ▲ +{fmt(scoreDiff)} ⚡
              </span>
            ) : scoreDiff < 0 ? (
              <span className="text-red-400 font-black flex items-center gap-0.5">
                ▼ {fmt(scoreDiff)} ⚡
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
                <div className="flex justify-between font-mono">
                  <span>Урон:</span>
                  <span className={dmgDiff > 0 ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-extrabold'}>
                    {dmgDiff > 0 ? `+${fmt(dmgDiff)}` : fmt(dmgDiff)}
                  </span>
                </div>
              )}
              {armorDiff !== 0 && (
                <div className="flex justify-between font-mono">
                  <span>Броня:</span>
                  <span className={armorDiff > 0 ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-extrabold'}>
                    {armorDiff > 0 ? `+${fmt(armorDiff)}` : fmt(armorDiff)}
                  </span>
                </div>
              )}
              {hpDiff !== 0 && (
                <div className="flex justify-between font-mono">
                  <span>Здоровье:</span>
                  <span className={hpDiff > 0 ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-extrabold'}>
                    {hpDiff > 0 ? `+${fmt(hpDiff)}` : fmt(hpDiff)}
                  </span>
                </div>
              )}
              {dmgDiff === 0 && armorDiff === 0 && hpDiff === 0 && (
                <div className="text-slate-400 text-center py-0.5">Основные характеристики равны</div>
              )}
            </div>
          ) : (
            <div className="text-emerald-400 font-extrabold text-center">
              ✨ Слот свободен (предмет улучшит мощь)
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * SmartItemTooltip: Rendered via Portal with 100% solid opacity and strict viewport clamping.
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

  const left = anchorRect?.left ?? 0;
  const top = anchorRect?.top ?? 0;
  const width = anchorRect?.width ?? 0;
  const height = anchorRect?.height ?? 0;
  const itemId = item?.id ?? '';

  useEffect(() => {
    if (!anchorRect || !item) return;

    const el = containerRef.current;
    const cardW = el ? el.offsetWidth : 280;
    const cardH = el ? el.offsetHeight : 380;

    const minX = 12;
    const maxX = Math.max(12, window.innerWidth - cardW - 12);
    const minY = 12;
    const maxY = Math.max(12, window.innerHeight - cardH - 12);

    let x = left - cardW - 14;
    if (x < minX) {
      x = left + width + 14;
    }

    if (x > maxX) x = maxX;
    if (x < minX) x = minX;

    let y = top;
    if (y > maxY) y = maxY;
    if (y < minY) y = minY;

    setPos({ x, y });
  }, [left, top, width, height, itemId]);

  if (!anchorRect || !item) return null;

  const tooltipElement = (
    <>
      {onClose && (
        <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      )}
      <div
        ref={containerRef}
        className="fixed z-[9999] pointer-events-auto shadow-[0_25px_60px_rgba(0,0,0,1)] animate-fadeIn opacity-100"
        style={{ left: pos.x, top: pos.y }}
      >
        <ItemCard item={item} equippedItem={equippedItem} />
        {children}
      </div>
    </>
  );

  return createPortal(tooltipElement, document.body);
}
