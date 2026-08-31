import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';
import { generateItem, rarityById } from '@/game/items';
import type { Item, RarityId } from '@/game/types';
import { fmt } from '@/game/engine';
import { sound } from '@/game/sound';
import { useEscapeKey } from '@/hooks/useEscapeKey';

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
  completed: boolean;
  claimed: boolean;
}

interface BlackMarketItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  rarity: RarityId;
  costGold: number;
  type: 'artifact' | 'potion' | 'keys' | 'scroll' | 'chest';
}

interface CaravanRoute {
  id: string;
  name: string;
  icon: string;
  desc: string;
  durationSec: number;
  costGold: number;
  returnGold: number;
  returnStones: number;
  returnShards: number;
  repReq: number;
}

const CARAVAN_ROUTES: CaravanRoute[] = [
  {
    id: 'caravan_desert',
    name: 'Караван Пустыни Оазиса',
    icon: '🐪',
    desc: 'Торговая экспедиция по шелковым дюнам за пряностями и редкими минералами.',
    durationSec: 90,
    costGold: 15000,
    returnGold: 22000,
    returnStones: 6,
    returnShards: 2,
    repReq: 1,
  },
  {
    id: 'caravan_sea',
    name: 'Морской Фрегат Торвальда',
    icon: '⛵',
    desc: 'Купеческий корабль через Бездну Океана за рубинами и драгоценными реликвиями.',
    durationSec: 240,
    costGold: 60000,
    returnGold: 95000,
    returnStones: 18,
    returnShards: 6,
    repReq: 3,
  },
  {
    id: 'caravan_astral',
    name: 'Астральный Дирижабль Бездны',
    icon: '🌌',
    desc: 'Флагманский дирижабль Гильдии за эфирными кристаллами и небесными осколками.',
    durationSec: 480,
    costGold: 250000,
    returnGold: 420000,
    returnStones: 50,
    returnShards: 25,
    repReq: 6,
  },
  {
    id: 'caravan_divine',
    name: 'Небесный Ковчег Архистратигов',
    icon: '✨',
    desc: 'Флагманский звездный ковчег за первозданной божественной рудой и артефактами.',
    durationSec: 600,
    costGold: 1000000,
    returnGold: 2200000,
    returnStones: 120,
    returnShards: 60,
    repReq: 10,
  },
];

const BLACK_MARKET_STOCK: BlackMarketItem[] = [
  { id: 'bm_key_master', name: 'Мастер-Ключи Бездны (5 штук)', icon: '🗝️', desc: 'Набор высокоточных отмычек. Добавляет 5 отмычек для сундуков сокровищ.', rarity: 'rare', costGold: 30000, type: 'keys' },
  { id: 'bm_elixir_titan', name: 'Эликсир Титанической Силы', icon: '🍷', desc: '+50% к Урону персонажа на 10 минут.', rarity: 'epic', costGold: 60000, type: 'potion' },
  { id: 'bm_scroll_respec', name: 'Свиток Перерождения Разума', icon: '📜', desc: 'Возвращает все потраченные очки талантов для свободного перераспределения.', rarity: 'epic', costGold: 80000, type: 'scroll' },
  { id: 'bm_stones_bundle', name: 'Мешок Камней Усиления (25 штук)', icon: '💎', desc: 'Большой мешок отборных камней для заточки снаряжения в Великой Кузнице.', rarity: 'rare', costGold: 45000, type: 'artifact' },
  { id: 'bm_astral_ore_chest', name: 'Сундук Астральной Руды (250 штук)', icon: '⛏️', desc: 'Запас чистейшей астральной руды для ковки сетового снаряжения.', rarity: 'epic', costGold: 120000, type: 'artifact' },
  { id: 'bm_orb_gods', name: 'Сфера Сотворения Миров', icon: '🌟', desc: '+1 Очко Талантов и +5 Очков Характеристик навсегда!', rarity: 'mythic', costGold: 300000, type: 'artifact' },
  { id: 'bm_relic_coffer', name: 'Таинственный Ларец Реликвий', icon: '📦', desc: 'Гарантированно содержит случайный Мифический или Божественный предмет!', rarity: 'divine', costGold: 600000, type: 'chest' },
  { id: 'bm_divine_seal', name: 'Божественная Печать Бессмертия', icon: '👑', desc: 'Высшая реликвия: гарантирует получение Божественного предмета наивысшего качества!', rarity: 'divine', costGold: 1500000, type: 'chest' },
];

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
  useEscapeKey(onClose);
  const [activeTab, setActiveTab] = useState<'shop' | 'bulk_sell' | 'caravans' | 'black_market' | 'contracts'>('shop');
  const level = useGame(s => s.level);
  const gold = useGame(s => s.gold);
  const kills = useGame(s => s.kills);
  const bossKills = useGame(s => s.bossKills);
  const inventory = useGame(s => s.inventory);

  // Merchant Reputation Level (1 to 10)
  const [repLevel, setRepLevel] = useState<number>(() => {
    const saved = localStorage.getItem('storm_merchant_rep');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [repXp, setRepXp] = useState<number>(() => {
    const saved = localStorage.getItem('storm_merchant_rep_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Active Caravans State: { [routeId]: finishTimestamp }
  const [activeCaravans, setActiveCaravans] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('storm_merchant_caravans');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Daily Contracts
  const [contracts, setContracts] = useState<TorvaldContract[]>(() => [
    {
      id: 'c_1',
      title: 'Охота на Элитных Тварей',
      target: 'Уничтожьте 25 Монстров Зоны',
      desc: 'Торвальд платит за зачистку окрестностей от орд Бездны.',
      icon: '🎯',
      type: 'kills',
      required: 25,
      current: Math.min(25, kills % 25),
      rewardGold: level * 160 + 500,
      rewardXP: level * 100 + 300,
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
      current: Math.min(3, bossKills % 3),
      rewardGold: level * 400 + 1200,
      rewardXP: level * 250 + 800,
      completed: true,
      claimed: false,
    },
  ]);

  // Shop Stock
  const [shopGear, setShopGear] = useState<Item[]>(() => [
    generateItem(level, 'rare'),
    generateItem(level, 'epic'),
    generateItem(level, 'legendary'),
    generateItem(level, 'mythic'),
  ]);

  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Reputation Discount & Sell Bonus
  const discountMultiplier = Math.max(0.75, 1 - (repLevel - 1) * 0.028);
  const sellMultiplier = 1 + (repLevel - 1) * 0.05;

  useEffect(() => {
    localStorage.setItem('storm_merchant_rep', repLevel.toString());
  }, [repLevel]);

  useEffect(() => {
    localStorage.setItem('storm_merchant_rep_xp', repXp.toString());
  }, [repXp]);

  useEffect(() => {
    localStorage.setItem('storm_merchant_caravans', JSON.stringify(activeCaravans));
  }, [activeCaravans]);

  useEffect(() => {
    const tick = () => {
      setCurrentTime(Date.now());
      const target = getTargetMerchantTime();
      const diff = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        setShopGear([
          generateItem(level, 'rare'),
          generateItem(level, 'epic'),
          generateItem(level, 'legendary'),
          generateItem(level, 'mythic'),
        ]);
        const nextTarget = Date.now() + 180000;
        try { localStorage.setItem('storm_merchant_target', nextTarget.toString()); } catch { /* ignore */ }
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [level]);

  const addRepXp = (amount: number) => {
    const nextXp = repXp + amount;
    const req = repLevel * 120;
    if (nextXp >= req && repLevel < 10) {
      setRepLevel(prev => prev + 1);
      setRepXp(nextXp - req);
      sound.playLevelUp();
      setActionFeedback(`🌟 ПОВЫШЕНИЕ РЕПУТАЦИИ ДО УРОВНЯ ${repLevel + 1}!`);
    } else {
      setRepXp(nextXp);
    }
  };

  const handleBuyGear = (item: Item) => {
    const finalPrice = Math.round(item.sellPrice * 3 * discountMultiplier);
    if (gold < finalPrice || inventory.length >= 72) return;

    sound.playEquip();
    useGame.setState(s => ({
      gold: s.gold - finalPrice,
      inventory: [...s.inventory, item],
      log: [...s.log, { id: Date.now(), text: `🛒 Куплен предмет ${item.name} за -${fmt(finalPrice)}g`, color: '#facc15', time: Date.now() }]
    }));

    setShopGear(prev => prev.filter(i => i.id !== item.id));
    addRepXp(35);
  };

  const handleBuyBlackMarket = (bm: BlackMarketItem) => {
    if (gold < bm.costGold) return;

    sound.playHoly();
    useGame.setState(s => ({ gold: s.gold - bm.costGold }));

    if (bm.id === 'bm_orb_gods') {
      useGame.setState(s => ({
        statPoints: s.statPoints + 5,
        talentPoints: s.talentPoints + 1,
        log: [...s.log, { id: Date.now(), text: `🌟 СФЕРА СОТВОРЕНИЯ: +5 Очков Характеристик и +1 Очко Талантов!`, color: '#facc15', time: Date.now() }]
      }));
      setActionFeedback('🌟 Получено +5 Очков Характеристик и +1 Очко Талантов!');
    } else if (bm.id === 'bm_key_master') {
      const currentPicks = parseInt(localStorage.getItem('storm_lock_picks') || '5', 10);
      localStorage.setItem('storm_lock_picks', (currentPicks + 5).toString());
      setActionFeedback('🗝️ +5 Мастер-Ключей добавлено в Сокровищницу!');
    } else if (bm.id === 'bm_stones_bundle') {
      useGame.setState(s => ({
        enhancementStones: (s.enhancementStones || 0) + 25,
        log: [...s.log, { id: Date.now(), text: `💎 Получено +25 Камней Усиления!`, color: '#38bdf8', time: Date.now() }]
      }));
      setActionFeedback('💎 +25 Камней Усиления добавлено в Кузницу!');
    } else if (bm.id === 'bm_scroll_respec') {
      useGame.setState(s => {
        let totalRefund = 0;
        Object.values(s.talents || {}).forEach(r => { totalRefund += r; });
        return {
          talents: {},
          talentPoints: s.talentPoints + totalRefund,
          log: [...s.log, { id: Date.now(), text: `📜 СВИТОК ПЕРЕРОЖДЕНИЯ: Все ${totalRefund} очков талантов сброшены!`, color: '#a855f7', time: Date.now() }]
        };
      });
      setActionFeedback('📜 Все очки талантов сброшены для перераспределения!');
    } else if (bm.id === 'bm_relic_coffer') {
      const luckyRarity: RarityId = Math.random() < 0.25 ? 'divine' : 'mythic';
      const wonItem = generateItem(level, luckyRarity);
      useGame.setState(s => ({
        inventory: [...s.inventory, wonItem],
        log: [...s.log, { id: Date.now(), text: `📦 ТАИНСТВЕННЫЙ ЛАРЕЦ: Извлечен ${wonItem.name}!`, color: '#e0e7ff', time: Date.now() }]
      }));
    } else if (bm.id === 'bm_astral_ore_chest') {
      const curOre = parseInt(localStorage.getItem('storm_astral_ore') || '250', 10);
      localStorage.setItem('storm_astral_ore', (curOre + 250).toString());
      setActionFeedback('⛏️ +250 Астральной Руды добавлено в Кузницу!');
    } else if (bm.id === 'bm_divine_seal') {
      const wonItem = generateItem(level, 'divine');
      useGame.setState(s => ({
        inventory: [...s.inventory, wonItem],
        log: [...s.log, { id: Date.now(), text: `👑 БОЖЕСТВЕННАЯ ПЕЧАТЬ: Извлечен ${wonItem.name}!`, color: '#e0e7ff', time: Date.now() }]
      }));
      setActionFeedback(`👑 Извлечен Божественный Артефакт: ${wonItem.name}!`);
    }

    addRepXp(120);
  };

  const handleClaimContract = (contract: TorvaldContract) => {
    if (!contract.completed || contract.claimed) return;

    sound.playLevelUp();
    contract.claimed = true;

    useGame.setState(s => ({
      gold: s.gold + contract.rewardGold,
      xp: s.xp + contract.rewardXP,
      log: [...s.log, { id: Date.now(), text: `📜 КОНТРАКТ ТОРВАЛЬДА: Завершен «${contract.title}»! +${fmt(contract.rewardGold)}g, +${contract.rewardXP} XP`, color: '#38bdf8', time: Date.now() }]
    }));

    setContracts([...contracts]);
    addRepXp(60);
  };

  // Mass Bulk Sell function
  const handleBulkSell = (targetRarities: RarityId[]) => {
    const toSell = inventory.filter(item => targetRarities.includes(item.rarity));
    if (toSell.length === 0) {
      setActionFeedback('❌ Нет предметов указанных редкостей в инвентаре.');
      setTimeout(() => setActionFeedback(null), 2500);
      return;
    }

    let earnedGold = 0;
    toSell.forEach(item => {
      earnedGold += Math.round(item.sellPrice * sellMultiplier);
    });

    sound.playEquip();
    useGame.setState(s => ({
      gold: s.gold + earnedGold,
      inventory: s.inventory.filter(item => !targetRarities.includes(item.rarity)),
      log: [...s.log, { id: Date.now(), text: `💰 МАССОВАЯ ПРОДАЖА: Продано ${toSell.length} предметов на сумму +${fmt(earnedGold)} золота!`, color: '#facc15', time: Date.now() }]
    }));

    addRepXp(toSell.length * 10);
    setActionFeedback(`💰 Продано ${toSell.length} предметов за +${fmt(earnedGold)} золота (+${toSell.length * 10} Репутации)!`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Dispatch Caravan
  const handleDispatchCaravan = (route: CaravanRoute) => {
    if (gold < route.costGold || repLevel < route.repReq) return;

    sound.playSpell();
    useGame.setState(s => ({ gold: s.gold - route.costGold }));

    const finishTime = Date.now() + route.durationSec * 1000;
    setActiveCaravans(prev => ({ ...prev, [route.id]: finishTime }));
    setActionFeedback(`🐪 ${route.name} отправлен в путь!`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Collect Caravan Reward
  const handleCollectCaravan = (route: CaravanRoute) => {
    const finish = activeCaravans[route.id];
    if (!finish || finish > Date.now()) return;

    sound.playLevelUp();
    useGame.setState(s => ({
      gold: s.gold + route.returnGold,
      enhancementStones: (s.enhancementStones || 0) + route.returnStones,
      celestialShards: (s.celestialShards || 0) + route.returnShards,
      log: [...s.log, {
        id: Date.now(),
        text: `🐪 КАРАВАН ВЕРНУЛСЯ: «${route.name}» принес +${fmt(route.returnGold)} золота, +${route.returnStones} Камней, +${route.returnShards} Осколков!`,
        color: '#facc15',
        time: Date.now()
      }]
    }));

    setActiveCaravans(prev => {
      const next = { ...prev };
      delete next[route.id];
      return next;
    });

    addRepXp(80);
    setActionFeedback(`🐪 Прибыль с каравана: +${fmt(route.returnGold)} золота, +${route.returnStones} Камней, +${route.returnShards} Осколков!`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const reqXp = repLevel * 120;
  const repPct = Math.min(100, (repXp / reqXp) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-slate-950 border border-amber-500/50 rounded-2xl max-w-4xl w-full p-4 shadow-[0_0_60px_rgba(245,158,11,0.3)] space-y-3 relative max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">🪙</span>
            <div>
              <h2 className="font-black text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span>ТОРГОВАЯ ГИЛЬДИЯ ТОРВАЛЬДА</span>
                <span className="text-[10px] text-amber-300 font-mono bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Уровень {repLevel} (-{Math.round((1 - discountMultiplier) * 100)}% скидка · +{Math.round((sellMultiplier - 1) * 100)}% к выкупу)
                </span>
              </h2>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                <span>Баланс: <b className="text-yellow-300 font-black">💰 {fmt(gold)} золота</b></span>
                <span>·</span>
                <span>Ротация товаров через: <b className="text-sky-300">{Math.floor(timeLeft / 60)} минут {timeLeft % 60} секунд</b></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Reputation Progress Bar */}
        <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 shrink-0 space-y-1">
          <div className="flex justify-between items-center text-[10px] font-black">
            <span className="text-amber-300">👑 РЕПУТАЦИЯ ТОРГОВЦА (РАНГ {repLevel} из 10)</span>
            <span className="text-slate-400 font-mono">{repXp} / {reqXp} Опыта ({repPct.toFixed(0)}%)</span>
          </div>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-300 transition-all duration-300"
              style={{ width: `${repPct}%` }}
            />
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="p-2 rounded-xl bg-amber-950/90 border border-amber-500 text-amber-200 text-xs font-black text-center animate-pulse shrink-0">
            {actionFeedback}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-2.5 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'shop' ? 'bg-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🏪</span>
            <span>Товары</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk_sell')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-2.5 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'bulk_sell' ? 'bg-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>💰</span>
            <span>Скупка Лута</span>
          </button>

          <button
            onClick={() => setActiveTab('caravans')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-2.5 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'caravans' ? 'bg-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🐪</span>
            <span>Караваны</span>
          </button>

          <button
            onClick={() => setActiveTab('black_market')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-2.5 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'black_market' ? 'bg-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🏴</span>
            <span>Черный Рынок</span>
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-2.5 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'contracts' ? 'bg-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📜</span>
            <span>Контракты</span>
          </button>
        </div>

        {/* Tab 1: Shop Stock */}
        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-h-0 overflow-y-auto pr-1">
            {shopGear.map(item => {
              const r = rarityById(item.rarity);
              const price = Math.round(item.sellPrice * 3 * discountMultiplier);
              const canAfford = gold >= price;

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between space-y-2.5 shadow"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-xs truncate" style={{ color: r.color }}>{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {r.name} · Мощь: <b className="text-amber-300">⚡{fmt(item.score)}</b>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-mono font-black text-amber-300">
                      💰 {fmt(price)} золота
                    </span>
                    <button
                      onClick={() => handleBuyGear(item)}
                      disabled={!canAfford}
                      className="py-1.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs shadow transition-all active:scale-95 cursor-pointer"
                    >
                      Купить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Bulk Sell */}
        {activeTab === 'bulk_sell' && (
          <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="font-black text-xs text-amber-300 uppercase">⚡ БЫСТРАЯ МАССОВАЯ СКУПКА ТОРВАЛЬДА</div>
              <div className="text-[11px] text-slate-300">
                Продавайте ненужный лут из инвентаря в 1 клик с бонусом репутации (+{Math.round((sellMultiplier - 1) * 100)}% к золоту). Экипированные предметы в безопасности.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-black text-xs text-slate-300">⚪ Обычные предметы</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    В инвентаре: <b className="text-white">{inventory.filter(i => i.rarity === 'common').length} предметов</b>
                  </div>
                </div>
                <button
                  onClick={() => handleBulkSell(['common'])}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs shadow transition-all cursor-pointer"
                >
                  Продать Все Обычные
                </button>
              </div>

              <div className="p-3.5 bg-slate-900 border border-emerald-900/60 rounded-2xl flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-black text-xs text-emerald-400">🟢 Необычные предметы</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    В инвентаре: <b className="text-white">{inventory.filter(i => i.rarity === 'uncommon').length} предметов</b>
                  </div>
                </div>
                <button
                  onClick={() => handleBulkSell(['uncommon'])}
                  className="w-full py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-black text-xs shadow transition-all cursor-pointer"
                >
                  Продать Необычные
                </button>
              </div>

              <div className="p-3.5 bg-slate-900 border border-sky-900/60 rounded-2xl flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-black text-xs text-sky-400">🔵 Редкие предметы</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    В инвентаре: <b className="text-white">{inventory.filter(i => i.rarity === 'rare').length} предметов</b>
                  </div>
                </div>
                <button
                  onClick={() => handleBulkSell(['rare'])}
                  className="w-full py-2 rounded-xl bg-sky-950 hover:bg-sky-900 border border-sky-500/40 text-sky-300 font-black text-xs shadow transition-all cursor-pointer"
                >
                  Продать Редкие
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-black text-xs text-amber-300">💥 ОЧИСТИТЬ ВЕСЬ НИЗКОРАНГОВЫЙ МУСОР</div>
                <div className="text-[11px] text-slate-400">Продать сразу все Обычные, Необычные и Редкие предметы разом.</div>
              </div>
              <button
                onClick={() => handleBulkSell(['common', 'uncommon', 'rare'])}
                className="py-2 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Продать Весь Мусор
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Caravans & Investments */}
        {activeTab === 'caravans' && (
          <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="font-black text-xs text-amber-300 uppercase">🐪 КУПЕЧЕСКИЕ КАРАВАНЫ И ИНВЕСТИЦИИ</div>
              <div className="text-[11px] text-slate-300">
                Инвестируйте золото в торговые маршруты Гильдии. По истечении таймера забирайте гарантированную сверхприбыль, камни усиления и осколки небес!
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CARAVAN_ROUTES.map(route => {
                const finish = activeCaravans[route.id];
                const isActive = !!finish;
                const isReady = isActive && finish <= currentTime;
                const secLeft = isActive && !isReady ? Math.ceil((finish - currentTime) / 1000) : 0;
                const canAfford = gold >= route.costGold && repLevel >= route.repReq;

                return (
                  <div
                    key={route.id}
                    className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3 shadow"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl p-1.5 bg-slate-950 rounded-xl border border-slate-800">{route.icon}</span>
                        <div>
                          <div className="font-black text-xs text-white">{route.name}</div>
                          <div className="text-[10px] text-amber-300 font-mono">Требует: Ранг {route.repReq}</div>
                        </div>
                      </div>
                      <div className="text-[10.5px] text-slate-400">{route.desc}</div>
                      
                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-mono space-y-0.5">
                        <div className="text-slate-400">Стоимость: <b className="text-amber-300">💰 {fmt(route.costGold)} золота</b></div>
                        <div className="text-emerald-400">Доход: <b className="text-emerald-300">💰 +{fmt(route.returnGold)} золота</b></div>
                        <div className="text-sky-300">Ресурсы: +{route.returnStones} Камней · +{route.returnShards} Осколков</div>
                        <div className="text-slate-500">Время в пути: {Math.floor(route.durationSec / 60)} минут {route.durationSec % 60} секунд</div>
                      </div>
                    </div>

                    <div>
                      {isReady ? (
                        <button
                          onClick={() => handleCollectCaravan(route)}
                          className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg animate-pulse transition-all active:scale-95 cursor-pointer"
                        >
                          🎉 Забрать Прибыль (+{fmt(route.returnGold)} золота)
                        </button>
                      ) : isActive ? (
                        <div className="w-full py-2 rounded-xl bg-slate-800 text-slate-400 font-black text-xs text-center font-mono">
                          ⏳ В пути ({Math.floor(secLeft / 60)} мин {secLeft % 60} сек)
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDispatchCaravan(route)}
                          disabled={!canAfford}
                          className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs shadow transition-all active:scale-95 cursor-pointer"
                        >
                          {repLevel < route.repReq ? `Требуется Ранг ${route.repReq}` : 'Отправить Караван'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Black Market */}
        {activeTab === 'black_market' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-h-0 overflow-y-auto pr-1">
            {BLACK_MARKET_STOCK.map(bm => {
              const r = rarityById(bm.rarity);
              const canAfford = gold >= bm.costGold;

              return (
                <div
                  key={bm.id}
                  className="p-3 rounded-xl border border-purple-500/40 bg-slate-900 flex flex-col justify-between space-y-2.5 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl p-1.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0">{bm.icon}</span>
                    <div>
                      <div className="font-black text-xs" style={{ color: r.color }}>{bm.name}</div>
                      <div className="text-[10px] text-slate-300 mt-0.5">{bm.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-mono font-black text-amber-300">
                      💰 {fmt(bm.costGold)} золота
                    </span>
                    <button
                      onClick={() => handleBuyBlackMarket(bm)}
                      disabled={!canAfford}
                      className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 disabled:opacity-40 text-white font-black text-xs shadow transition-all active:scale-95 cursor-pointer"
                    >
                      Приобрести
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 5: Contracts */}
        {activeTab === 'contracts' && (
          <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
            {contracts.map(c => (
              <div
                key={c.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between gap-3 shadow"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 bg-slate-950 rounded-xl border border-slate-800">{c.icon}</span>
                  <div>
                    <div className="font-black text-xs text-slate-100">{c.title}</div>
                    <div className="text-[10px] text-slate-400">{c.target} · {c.desc}</div>
                    <div className="text-[10px] font-mono text-amber-300 mt-0.5">
                      Награда: +{fmt(c.rewardGold)} золота · +{c.rewardXP} опыта
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleClaimContract(c)}
                  disabled={!c.completed || c.claimed}
                  className={`py-2 px-4 rounded-xl font-black text-xs transition-all ${
                    c.claimed
                      ? 'bg-slate-800 text-slate-500'
                      : c.completed
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg animate-pulse cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {c.claimed ? 'Забрано' : c.completed ? 'Забрать Награду' : 'В Процессе'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
