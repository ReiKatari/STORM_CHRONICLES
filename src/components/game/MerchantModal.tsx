import { useState } from 'react';
import { useGame } from '@/game/store';
import { generateItem, rarityById } from '@/game/items';
import type { Item } from '@/game/types';

export default function MerchantModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'armorer' | 'alchemist' | 'bounty'>('armorer');

  const gold = useGame(s => s.gold);
  const level = useGame(s => s.level);
  const inventory = useGame(s => s.inventory);
  const sellItem = useGame(s => s.sellItem);
  const sellJunk = useGame(s => s.sellJunk);

  const [shopStock] = useState<Item[]>(() => [
    generateItem(level, 'rare'),
    generateItem(level, 'rare'),
    generateItem(level, 'epic'),
    generateItem(level + 2, 'epic'),
    generateItem(level + 5, 'legendary'),
  ]);

  const handleBuyShopItem = (item: Item) => {
    const cost = item.sellPrice * 3;
    if (gold < cost || inventory.length >= 72) return;
    useGame.setState({
      gold: gold - cost,
      inventory: [...inventory, item],
    });
  };

  const handleBuyPotion = (type: 'hp' | 'mana', cost: number) => {
    if (gold < cost) return;
    useGame.setState(s => ({
      gold: s.gold - cost,
      hp: type === 'hp' ? s.derived.maxHp : s.hp,
      mana: type === 'mana' ? s.derived.maxMana : s.mana,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-4 shadow-2xl space-y-3 relative max-h-[90vh] flex flex-col">
        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                Городская Торговая Площадь & Торговцы NPC
              </h2>
              <span className="text-[10px] text-amber-300 font-bold">💰 Ваше золото: {gold} gold</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Merchant NPC Tabs */}
        <div className="flex gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('armorer')}
            className={`flex-1 text-xs py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'armorer' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🛡️</span>
            <span>Оружейник Бронир</span>
          </button>
          <button
            onClick={() => setActiveTab('alchemist')}
            className={`flex-1 text-xs py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'alchemist' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🧪</span>
            <span>Алхимик Элиэлла</span>
          </button>
          <button
            onClick={() => setActiveTab('bounty')}
            className={`flex-1 text-xs py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bounty' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📜</span>
            <span>Контракты Торвальда</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {/* TAB 1: ARMORER MERCHANT */}
          {activeTab === 'armorer' && (
            <div className="space-y-3">
              {/* Batch Selling Section */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-xs text-amber-300">
                    ⚡ Удобная Быстрая Продажа Хлама (В 1 Климатический Кликом)
                  </div>
                  <span className="text-[10px] text-slate-400">Предметов в сумке: {inventory.length}/72</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => sellJunk('common')}
                    className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all active:scale-95"
                  >
                    💰 Продать Обычные
                  </button>
                  <button
                    onClick={() => sellJunk('uncommon')}
                    className="py-1.5 px-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-all active:scale-95"
                  >
                    💰 Продать Необычные
                  </button>
                  <button
                    onClick={() => sellJunk('rare')}
                    className="py-1.5 px-2 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 text-xs font-bold border border-sky-500/40 transition-all active:scale-95"
                  >
                    💰 Продать Редкие
                  </button>
                </div>
              </div>

              {/* Shop Stock Items */}
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200 mb-2">
                  🛒 Ассортимент Оружия и Брони
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {shopStock.map((it, idx) => {
                    const r = rarityById(it.rarity);
                    const buyCost = it.sellPrice * 3;
                    const canAfford = gold >= buyCost;
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border bg-slate-950/70 flex items-center justify-between gap-2"
                        style={{ borderColor: r.color }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-2xl">{it.icon}</span>
                          <div className="min-w-0">
                            <div className="font-extrabold text-xs truncate" style={{ color: r.color }}>{it.name}</div>
                            <div className="text-[10px] text-slate-400">{r.name} · {it.ilvl} ур.</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBuyShopItem(it)}
                          disabled={!canAfford}
                          className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 disabled:opacity-40 transition-all"
                        >
                          💰 {buyCost} g
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALCHEMIST POTIONS */}
          {activeTab === 'alchemist' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                <div className="font-extrabold text-xs text-emerald-300">
                  🧪 Лавка Зелий и Эликсиров Алхимика Элиэллы
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBuyPotion('hp', 50)}
                    disabled={gold < 50}
                    className="p-3 rounded-xl bg-slate-950 border border-red-500/40 hover:bg-slate-900 text-left transition-all disabled:opacity-40"
                  >
                    <div className="font-extrabold text-xs text-red-400">🧪 Большое Зелье HP (50g)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Мгновенно восстанавливает 100% здоровье</div>
                  </button>

                  <button
                    onClick={() => handleBuyPotion('mana', 50)}
                    disabled={gold < 50}
                    className="p-3 rounded-xl bg-slate-950 border border-sky-500/40 hover:bg-slate-900 text-left transition-all disabled:opacity-40"
                  >
                    <div className="font-extrabold text-xs text-sky-400">💧 Эликсир Маны (50g)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Мгновенно восполняет 100% маны</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOUNTY CONTRACTS */}
          {activeTab === 'bounty' && (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-2">
                <div className="font-extrabold text-xs text-purple-300">
                  📜 Фракционные Контракты Капитана Торвальда
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="p-2 rounded-lg bg-slate-950 border border-purple-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-amber-300">⚔️ Контракт: Охота на 50 Монстров</div>
                      <div className="text-[10px] text-slate-400">Награда: +500 золота & +3 очка статов</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">⚡ Активно</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-purple-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-amber-300">👑 Контракт: Убить 5 Боссов</div>
                      <div className="text-[10px] text-slate-400">Награда: Эпический ларец сокровищ</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">⚡ Активно</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
