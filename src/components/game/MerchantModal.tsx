import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';
import { generateItem, rarityById } from '@/game/items';
import type { Item } from '@/game/types';
import { fmt } from '@/game/engine';

function getTargetMerchantTime(): number {
  try {
    const saved = localStorage.getItem('storm_merchant_target');
    if (saved) {
      const val = parseInt(saved, 10);
      if (!isNaN(val) && val > Date.now()) return val;
    }
  } catch { /* ignore */ }
  const target = Date.now() + 180000;
  try { localStorage.setItem('storm_merchant_target', target.toString()); } catch { /* ignore */ }
  return target;
}

export default function MerchantModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'armorer' | 'alchemist' | 'bounty'>('armorer');

  const gold = useGame(s => s.gold);
  const level = useGame(s => s.level);
  const inventory = useGame(s => s.inventory);
  const sellJunk = useGame(s => s.sellJunk);

  // 3-Minute Persistent Refresh State (180 seconds)
  const [stockTimer, setStockTimer] = useState<number>(() => {
    const t = getTargetMerchantTime();
    return Math.max(0, Math.ceil((t - Date.now()) / 1000));
  });
  const [shopStock, setShopStock] = useState<Item[]>(() => [
    generateItem(level, 'rare'),
    generateItem(level + 1, 'rare'),
    generateItem(level + 2, 'epic'),
    generateItem(level + 3, 'epic'),
    generateItem(level + 5, 'legendary'),
    generateItem(level + 7, 'mythic'),
  ]);

  const refreshStock = () => {
    setShopStock([
      generateItem(level, 'rare'),
      generateItem(level + 1, 'rare'),
      generateItem(level + 2, 'epic'),
      generateItem(level + 3, 'epic'),
      generateItem(level + 5, 'legendary'),
      generateItem(level + 7, 'mythic'),
    ]);
    const nextTarget = Date.now() + 180000;
    try { localStorage.setItem('storm_merchant_target', nextTarget.toString()); } catch { /* ignore */ }
  };

  // Live persistent countdown timer for 3-minute stock rotation
  useEffect(() => {
    const timerId = setInterval(() => {
      const target = getTargetMerchantTime();
      const diff = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      setStockTimer(diff);

      if (diff <= 0) {
        refreshStock();
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [level]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBuyShopItem = (item: Item, index: number) => {
    const cost = item.sellPrice * 3;
    if (gold < cost || inventory.length >= 72) return;

    useGame.setState({
      gold: gold - cost,
      inventory: [...inventory, item],
    });

    // Remove bought item from shop stock
    setShopStock(prev => prev.filter((_, i) => i !== index));
  };

  const handleBuyPotion = (type: 'hp' | 'mana', cost: number) => {
    if (gold < cost) return;
    useGame.setState(s => ({
      gold: s.gold - cost,
      hp: type === 'hp' ? s.derived.maxHp : s.hp,
      mana: type === 'mana' ? s.derived.maxMana : s.mana,
    }));
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-4 shadow-2xl space-y-3 relative max-h-[90vh] flex flex-col font-sans">
        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl">🏪</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                ГОРОДСКАЯ ТОРГОВАЯ ПЛОЩАДЬ И NPC
              </h2>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[11px] text-amber-300 font-extrabold">💰 Золото: {fmt(gold)} g</span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                  ⏱️ Авто-обновление товаров: <b className="text-amber-300 font-black">{formatTimer(stockTimer)}</b>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshStock}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 transition-all active:scale-95"
              title="Обновить товары сейчас"
            >
              🔄 Обновить
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Merchant NPC Tabs */}
        <div className="flex gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('armorer')}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'armorer' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🛡️</span>
            <span>Оружейник Бронир</span>
          </button>
          <button
            onClick={() => setActiveTab('alchemist')}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'alchemist' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🧪</span>
            <span>Алхимик Элиэлла</span>
          </button>
          <button
            onClick={() => setActiveTab('bounty')}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 ${
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
                    ⚡ Быстрая Продажа Хлама Из Инвентаря
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Сумка: {inventory.length}/72</span>
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

              {/* Shop Stock Items Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200">
                  🛒 Ассортимент Оружия и Брони (Обновление каждые 3 мин)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">В наличии: {shopStock.length} предметов</span>
              </div>

              {/* Shop Stock Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {shopStock.length === 0 ? (
                  <div className="col-span-2 p-6 text-center text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
                    🛒 Весь ассортимент раскуплен! Дождитесь обновления через {formatTimer(stockTimer)} или нажмите «Обновить».
                  </div>
                ) : (
                  shopStock.map((it, idx) => {
                    const r = rarityById(it.rarity);
                    const buyCost = it.sellPrice * 3;
                    const canAfford = gold >= buyCost;
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border bg-slate-950/80 flex items-center justify-between gap-2 shadow-sm hover:border-slate-700 transition-all"
                        style={{ borderColor: `${r.color}80` }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl p-1.5 bg-slate-900 rounded-lg border border-slate-800 shrink-0">{it.icon}</span>
                          <div className="min-w-0">
                            <div className="font-extrabold text-xs truncate" style={{ color: r.color }}>{it.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{r.name} · {it.ilvl} ур.</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBuyShopItem(it, idx)}
                          disabled={!canAfford}
                          className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shrink-0 disabled:opacity-40 transition-all active:scale-95 shadow"
                        >
                          💰 {fmt(buyCost)} g
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ALCHEMIST POTIONS */}
          {activeTab === 'alchemist' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
                <div className="font-extrabold text-xs text-emerald-300">🧪 Лавка Зелий и Эликсиров Восстановления</div>
                <div className="text-[10px] text-slate-300">Алхимик мгновенно восполняет показатели Вашего героя за золото.</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🧪</span>
                    <div>
                      <div className="font-extrabold text-xs text-emerald-400">Зелье Полного Исцеления HP</div>
                      <div className="text-[10px] text-slate-400">Восстанавливает 100% максимального здоровья</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyPotion('hp', level * 25)}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow"
                  >
                    Купить за 💰 {fmt(level * 25)} g
                  </button>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">💧</span>
                    <div>
                      <div className="font-extrabold text-xs text-sky-400">Эликсир Астральной Маны</div>
                      <div className="text-[10px] text-slate-400">Восстанавливает 100% максимальной маны</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyPotion('mana', level * 20)}
                    className="py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl transition-all shadow"
                  >
                    Купить за 💰 {fmt(level * 20)} g
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOUNTY CONTRACTS */}
          {activeTab === 'bounty' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-1">
                <div className="font-extrabold text-xs text-purple-300">📜 Доска Объявлений Торвальда</div>
                <div className="text-[10px] text-slate-300">Выполняйте охотничьи контракты на элитных боссов для получения древних наград.</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-center space-y-2">
                <span className="text-3xl">🎯</span>
                <div className="font-extrabold text-xs text-slate-200">Текущий контракт: Уничтожение Босса Зоны</div>
                <div className="text-[11px] text-emerald-400 font-bold">Награда: +50% XP и бонусное сундуковое снаряжение за победу</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
