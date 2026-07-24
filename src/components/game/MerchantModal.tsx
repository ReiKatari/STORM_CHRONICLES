import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';
import { generateItem, rarityById } from '@/game/items';
import type { Item, SlotId, SlotKind } from '@/game/types';
import { fmt, computeDerived } from '@/game/engine';

interface TorvaldContract {
  id: string;
  title: string;
  target: string;
  desc: string;
  icon: string;
  type: 'kills' | 'bosses' | 'dungeons' | 'gold' | 'mastery';
  required: number;
  current: number;
  rewardGold: number;
  rewardXP: number;
  rewardGems?: number;
  rewardPoints?: number;
  completed: boolean;
  claimed: boolean;
}

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

function generateTorvaldContracts(playerLevel: number, totalKills: number, totalBosses: number): TorvaldContract[] {
  return [
    {
      id: 'c_1',
      title: 'Охота на Элитных Тварей',
      target: 'Уничтожьте 25 Монстров Зоны',
      desc: 'Торвальд платит за зачистку окрестностей от орд Бездны.',
      icon: '🎯',
      type: 'kills',
      required: 25,
      current: Math.min(25, totalKills % 25),
      rewardGold: playerLevel * 120 + 250,
      rewardXP: playerLevel * 80 + 150,
      completed: true,
      claimed: false,
    },
    {
      id: 'c_2',
      title: 'Голова Владыки Бездны',
      target: 'Одолейте 3 Боссов Зоны',
      desc: 'Торвальду нужны рога и клыки боссов для магических исследований.',
      icon: '👑',
      type: 'bosses',
      required: 3,
      current: Math.min(3, totalBosses % 3),
      rewardGold: playerLevel * 300 + 800,
      rewardXP: playerLevel * 200 + 500,
      rewardGems: 15,
      completed: true,
      claimed: false,
    },
    {
      id: 'c_3',
      title: 'Исследование Тайных Данжей',
      target: 'Зачистите 2 Подземелья',
      desc: 'Гильдия наемников ищет смельчаков для спуска в заброшенные руины.',
      icon: '🏰',
      type: 'dungeons',
      required: 2,
      current: 1,
      rewardGold: playerLevel * 450 + 1200,
      rewardXP: playerLevel * 300 + 800,
      rewardPoints: 1,
      completed: false,
      claimed: false,
    },
    {
      id: 'c_4',
      title: 'Сбор Древнего Золота',
      target: 'Заработайте 5,000 Золота',
      desc: 'Торвальд ищет старинные монеты для пополнения городского резерва.',
      icon: '💰',
      type: 'gold',
      required: 5000,
      current: 5000,
      rewardGold: playerLevel * 250 + 500,
      rewardXP: playerLevel * 150 + 300,
      completed: true,
      claimed: false,
    },
    {
      id: 'c_5',
      title: 'Мастерство Локаций',
      target: 'Завершите 1 Мастер-Цикл',
      desc: 'Докажите свое непревзойденное владение территорией.',
      icon: '🌟',
      type: 'mastery',
      required: 1,
      current: 1,
      rewardGold: playerLevel * 600 + 1500,
      rewardXP: playerLevel * 400 + 1000,
      rewardGems: 25,
      completed: true,
      claimed: false,
    },
    {
      id: 'c_6',
      title: 'Зачистка Оскверненного Леса',
      target: 'Уничтожьте 50 Монстров',
      desc: 'Торвальд объявляет большую охоту за темными душами.',
      icon: '🏹',
      type: 'kills',
      required: 50,
      current: 50,
      rewardGold: playerLevel * 250 + 600,
      rewardXP: playerLevel * 180 + 400,
      completed: true,
      claimed: false,
    },
    {
      id: 'c_7',
      title: 'Истребитель Драконов',
      target: 'Победите 5 Высших Боссов',
      desc: 'Контракт наивысшего ранга опасности для опытных наемников.',
      icon: '🐉',
      type: 'bosses',
      required: 5,
      current: 4,
      rewardGold: playerLevel * 800 + 2500,
      rewardXP: playerLevel * 500 + 1500,
      rewardPoints: 2,
      completed: false,
      claimed: false,
    },
    {
      id: 'c_8',
      title: 'Астральный Прорыв',
      target: 'Соберите 15,000 Золота',
      desc: 'Финансирование астрального портала гильдии.',
      icon: '🌌',
      type: 'gold',
      required: 15000,
      current: 12400,
      rewardGold: playerLevel * 1000 + 3000,
      rewardXP: playerLevel * 600 + 2000,
      rewardGems: 50,
      completed: false,
      claimed: false,
    },
  ];
}

export default function MerchantModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'armorer' | 'alchemist' | 'bounty'>('armorer');

  const gold = useGame(s => s.gold);
  const level = useGame(s => s.level);
  const inventory = useGame(s => s.inventory);
  const equipment = useGame(s => s.equipment);
  const kills = useGame(s => s.kills);
  const bossKills = useGame(s => s.bossKills);
  const sellJunk = useGame(s => s.sellJunk);

  // 3-Minute Persistent Refresh State (180 seconds)
  const [stockTimer, setStockTimer] = useState<number>(180);
  const [shopStock, setShopStock] = useState<Item[]>(() => [
    generateItem(level, 'rare'),
    generateItem(level + 1, 'rare'),
    generateItem(level + 2, 'epic'),
    generateItem(level + 3, 'epic'),
    generateItem(level + 5, 'legendary'),
    generateItem(level + 7, 'mythic'),
  ]);

  const [contracts, setContracts] = useState<TorvaldContract[]>(() =>
    generateTorvaldContracts(level, kills, bossKills)
  );

  const refreshStock = () => {
    setShopStock([
      generateItem(level, 'rare'),
      generateItem(level + 1, 'rare'),
      generateItem(level + 2, 'epic'),
      generateItem(level + 3, 'epic'),
      generateItem(level + 5, 'legendary'),
      generateItem(level + 7, 'mythic'),
    ]);
    setContracts(generateTorvaldContracts(level, kills, bossKills));
    const nextTarget = Date.now() + 180000;
    try { localStorage.setItem('storm_merchant_target', nextTarget.toString()); } catch { /* ignore */ }
    setStockTimer(180);
  };

  // Live persistent countdown timer for 3-minute stock rotation
  useEffect(() => {
    const tickTimer = () => {
      const target = getTargetMerchantTime();
      const diff = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      setStockTimer(diff);
      if (diff === 0) {
        refreshStock();
      }
    };
    tickTimer();
    const timerId = setInterval(tickTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

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

    const newInventory = [...inventory, item];
    const newEquipment = { ...equipment };

    useGame.setState(s => ({
      gold: s.gold - cost,
      inventory: newInventory,
      derived: computeDerived(s.level, s.stats, newEquipment, s.talents),
    }));

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

  const handleClaimContract = (contractId: string) => {
    const targetC = contracts.find(c => c.id === contractId);
    if (!targetC || !targetC.completed || targetC.claimed) return;

    useGame.setState(s => ({
      gold: s.gold + targetC.rewardGold,
      xp: s.xp + targetC.rewardXP,
      skillPoints: s.skillPoints + (targetC.rewardPoints ?? 0),
    }));

    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, claimed: true } : c));
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute Item Comparison against player's equipped item in target slot
  const getItemComparison = (item: Item) => {
    const targetSlot: SlotId = item.slot === 'ring' ? 'ring1' : item.slot === 'earring' ? 'earring1' : (item.slot as SlotId);
    const equipped = equipment[targetSlot];

    const itemDmg = item.base.dmg ?? 0;
    const itemArmor = item.base.armor ?? 0;
    const itemHp = item.base.hp ?? 0;

    const eqDmg = equipped?.base.dmg ?? 0;
    const eqArmor = equipped?.base.armor ?? 0;
    const eqHp = equipped?.base.hp ?? 0;

    const diffDmg = itemDmg - eqDmg;
    const diffArmor = itemArmor - eqArmor;
    const diffHp = itemHp - eqHp;
    const diffScore = item.score - (equipped?.score ?? 0);

    return { equipped, diffDmg, diffArmor, diffHp, diffScore };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-4 shadow-2xl space-y-3 relative max-h-[90vh] flex flex-col font-sans">
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
                <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                  ⏱️ Авто-обновление: <b className="text-amber-300 font-black">{formatTimer(stockTimer)}</b>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshStock}
              className="rpg-button text-amber-300 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1"
              title="Обновить ассортимент товаров и контрактов прямо сейчас"
            >
              🔄 Обновить Всё
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors"
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
            <span>Контракты Торвальда ({contracts.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {/* TAB 1: ARMORER MERCHANT WITH FULL EQUIPMENT COMPARISON */}
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
                    className="py-1.5 px-2 rounded-lg rpg-button text-slate-300 text-xs font-bold"
                  >
                    💰 Продать Обычные
                  </button>
                  <button
                    onClick={() => sellJunk('uncommon')}
                    className="py-1.5 px-2 rounded-lg rpg-button text-emerald-300 text-xs font-bold"
                  >
                    💰 Продать Необычные
                  </button>
                  <button
                    onClick={() => sellJunk('rare')}
                    className="py-1.5 px-2 rounded-lg rpg-button text-sky-300 text-xs font-bold"
                  >
                    💰 Продать Редкие
                  </button>
                </div>
              </div>

              {/* Shop Stock Items Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200">
                  🛒 Ассортимент Оружия и Брони Бронира (Сравнение С Надетым)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">В наличии: {shopStock.length} предметов</span>
              </div>

              {/* Shop Stock Items Grid With Real-time Gear Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {shopStock.length === 0 ? (
                  <div className="col-span-2 p-6 text-center text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
                    🛒 Весь ассортимент раскуплен! Дождитесь авто-обновления через {formatTimer(stockTimer)} или нажмите «Обновить Всё».
                  </div>
                ) : (
                  shopStock.map((it, idx) => {
                    const r = rarityById(it.rarity);
                    const buyCost = it.sellPrice * 3;
                    const canAfford = gold >= buyCost;
                    const comp = getItemComparison(it);

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl border bg-slate-950/90 flex flex-col justify-between gap-2.5 shadow-md hover:border-slate-700 transition-all w-full"
                        style={{ borderColor: `${r.color}80` }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span
                              className="text-2xl p-2 bg-slate-900 rounded-xl border shrink-0 shadow-inner"
                              style={{ borderColor: r.color }}
                            >
                              {it.icon}
                            </span>
                            <div className="min-w-0">
                              <div className="font-black text-xs truncate" style={{ color: r.color }}>{it.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {r.name} · {it.ilvl} ур. · Мощь: <b className="text-amber-300 font-black">⚡{fmt(it.score)}</b>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleBuyShopItem(it, idx)}
                            disabled={!canAfford}
                            className="py-2 px-3 rounded-xl rpg-button-gold text-xs font-black shrink-0 disabled:opacity-40"
                          >
                            💰 {fmt(buyCost)} g
                          </button>
                        </div>

                        {/* EQUIPMENT COMPARISON BADGE CARD */}
                        <div className="bg-slate-900/90 rounded-xl p-2 border border-slate-800/80 text-[10.5px] font-mono space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans font-bold border-b border-slate-800 pb-1">
                            <span>Сравнение с надетым:</span>
                            <span className="text-slate-300 truncate max-w-[140px]">
                              {comp.equipped ? `[${comp.equipped.name}]` : 'Слот пуст'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-0.5">
                            {comp.diffScore !== 0 && (
                              <div className={comp.diffScore > 0 ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-bold'}>
                                Мощь: {comp.diffScore > 0 ? `▲ +${comp.diffScore}` : `▼ ${comp.diffScore}`}
                              </div>
                            )}
                            {comp.diffDmg !== 0 && (
                              <div className={comp.diffDmg > 0 ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-bold'}>
                                Урон: {comp.diffDmg > 0 ? `▲ +${comp.diffDmg}` : `▼ ${comp.diffDmg}`}
                              </div>
                            )}
                            {comp.diffArmor !== 0 && (
                              <div className={comp.diffArmor > 0 ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-bold'}>
                                Броня: {comp.diffArmor > 0 ? `▲ +${comp.diffArmor}` : `▼ ${comp.diffArmor}`}
                              </div>
                            )}
                            {comp.diffHp !== 0 && (
                              <div className={comp.diffHp > 0 ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-bold'}>
                                HP: {comp.diffHp > 0 ? `▲ +${comp.diffHp}` : `▼ ${comp.diffHp}`}
                              </div>
                            )}
                          </div>
                        </div>
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
                    className="py-2 px-3 rpg-button text-emerald-300 font-black text-xs rounded-xl"
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
                    className="py-2 px-3 rpg-button text-sky-300 font-black text-xs rounded-xl"
                  >
                    Купить за 💰 {fmt(level * 20)} g
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MASSIVE TORVALD BOUNTY CONTRACTS LIST */}
          {activeTab === 'bounty' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-black text-xs text-purple-300 flex items-center gap-1.5">
                    <span>📜</span>
                    <span>Доска Объявлений и Контрактов Торвальда</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    ⏱️ Обновление контрактов: <b className="text-purple-300 font-black">{formatTimer(stockTimer)}</b>
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Выполняйте наемные контракты на уничтожение монстров, охоту за головами боссов и спуск в подземелья для получения золота, драгоценных камней и очков навыков!
                </div>
              </div>

              <div className="space-y-2.5">
                {contracts.map(c => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      c.claimed
                        ? 'border-slate-800 bg-slate-950/40 opacity-50'
                        : c.completed
                        ? 'border-amber-500/60 bg-amber-950/20 shadow-md'
                        : 'border-slate-800 bg-slate-950/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
                        {c.icon}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xs text-slate-100">{c.title}</h4>
                          <span className={`text-[9.5px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${
                            c.claimed
                              ? 'bg-slate-800 text-slate-500 border-slate-700'
                              : c.completed
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          }`}>
                            {c.claimed ? 'ВЫПОЛНЕН' : c.completed ? 'ГОТОВ К НАГРАДЕ' : `ПРОГРЕСС: ${c.current}/${c.required}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">{c.desc}</p>
                        <div className="text-[10.5px] text-amber-300 font-mono font-bold flex flex-wrap items-center gap-3 pt-0.5">
                          <span>Награда: 💰 {fmt(c.rewardGold)} g</span>
                          <span>📈 +{fmt(c.rewardXP)} XP</span>
                          {c.rewardGems && <span className="text-sky-300">💎 +{c.rewardGems} Кристаллов</span>}
                          {c.rewardPoints && <span className="text-purple-300">⚡ +{c.rewardPoints} Очко Скиллов</span>}
                        </div>
                      </div>
                    </div>

                    {!c.claimed && c.completed && (
                      <button
                        onClick={() => handleClaimContract(c.id)}
                        className="rpg-button-gold px-4 py-2 rounded-xl text-xs font-black shrink-0 self-end sm:self-center"
                      >
                        🎁 Забрать Награду
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
