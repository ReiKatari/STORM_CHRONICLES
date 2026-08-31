import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { CRAFTING_RECIPES, salvageItem, craftFromRecipe } from '@/game/crafting';
import { rarityById } from '@/game/items';
import type { Item, RarityId } from '@/game/types';
import { fmt, computeDerived } from '@/game/engine';
import { sound } from '@/game/sound';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export default function CraftingModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const [tab, setTab] = useState<'temper' | 'reforge' | 'craft' | 'salvage'>('temper');
  const level = useGame(s => s.level);
  const inventory = useGame(s => s.inventory);
  const equipment = useGame(s => s.equipment);
  const gold = useGame(s => s.gold);

  // Persistent Blacksmith Materials
  const [astralOre, setAstralOre] = useState<number>(() => {
    const saved = localStorage.getItem('storm_astral_ore');
    return saved ? parseInt(saved, 10) : 250;
  });

  const [astralEssence, setAstralEssence] = useState<number>(() => {
    const saved = localStorage.getItem('storm_astral_essence');
    return saved ? parseInt(saved, 10) : 80;
  });

  // Selected item for tempering / reforging
  const [selectedGear, setSelectedGear] = useState<Item | null>(null);
  const [itemEnhanceLevel, setItemEnhanceLevel] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('storm_item_enhances');
    return saved ? JSON.parse(saved) : {};
  });

  // Transmute selection (3 items)
  const [transmuteItems, setTransmuteItems] = useState<string[]>([]);
  const [logMsg, setLogMsg] = useState<string>('🔨 Добро пожаловать в Кузницу Бездны! Выберите предмет для заточки или перековки.');

  const allGear = [
    ...Object.values(equipment).filter(Boolean) as Item[],
    ...inventory.filter(i => i.slot !== ('consumable' as any))
  ];

  // Persistence
  useEffect(() => {
    localStorage.setItem('storm_astral_ore', astralOre.toString());
  }, [astralOre]);

  useEffect(() => {
    localStorage.setItem('storm_astral_essence', astralEssence.toString());
  }, [astralEssence]);

  useEffect(() => {
    localStorage.setItem('storm_item_enhances', JSON.stringify(itemEnhanceLevel));
  }, [itemEnhanceLevel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Tempering Upgrade Handler (+1 to +20)
  const handleTemperItem = () => {
    if (!selectedGear) {
      setLogMsg('⚠️ Выберите предмет для заточки!');
      return;
    }

    const curLvl = itemEnhanceLevel[selectedGear.id] || 0;
    if (curLvl >= 20) {
      setLogMsg('⭐ Этот предмет уже достиг максимального уровня заточки (+20)!');
      return;
    }

    const goldCost = Math.round((curLvl + 1) * 1200 * (1 + curLvl * 0.15));
    const oreCost = (curLvl + 1) * 10;

    if (gold < goldCost) {
      setLogMsg(`⚠️ Недостаточно золота для заточки (нужно: ${fmt(goldCost)} золота)!`);
      return;
    }
    if (astralOre < oreCost) {
      setLogMsg(`⚠️ Недостаточно Астральной Руды (нужно: ${oreCost} штук)! Распилите ненужные вещи.`);
      return;
    }

    // Success rate formula: 100% at +1, down to 35% at +20
    const successRate = Math.max(30, 100 - curLvl * 4);
    const roll = Math.random() * 100;

    // Deduct resources
    useGame.setState(s => ({ gold: s.gold - goldCost }));
    setAstralOre(prev => prev - oreCost);

    if (roll < successRate) {
      // SUCCESS!
      sound.playLevelUp();
      const nextLvl = curLvl + 1;
      setItemEnhanceLevel(prev => ({ ...prev, [selectedGear.id]: nextLvl }));

      // Boost stats
      selectedGear.score = Math.round(selectedGear.score * 1.08);
      if (selectedGear.base.dmg) selectedGear.base.dmg = Math.round(selectedGear.base.dmg * 1.08);
      if (selectedGear.base.armor) selectedGear.base.armor = Math.round(selectedGear.base.armor * 1.08);
      if (selectedGear.base.hp) selectedGear.base.hp = Math.round(selectedGear.base.hp * 1.08);

      // Recalculate hero derived stats
      const s = useGame.getState();
      const derived = computeDerived(s.level, s.stats, s.equipment, s.talents);
      useGame.setState({ derived, playerAtk: Math.round((derived.dmgMin + derived.dmgMax) / 2) });

      setLogMsg(`🎉 УСПЕХ ЗАТОЧКИ! ${selectedGear.name} усилен до +${nextLvl}! Боевая мощь: ⚡${fmt(selectedGear.score)}`);
    } else {
      // FAILED
      sound.playBlock();
      setLogMsg(`💥 ЗАТОЧКА НЕ УДАЛАСЬ! Шанс был ${successRate}%. Предмет сохранен благодаря защите.`);
    }
  };

  // Reforge Affixes Handler
  const handleReforgeAffixes = () => {
    if (!selectedGear) return;
    const costEssence = 15;
    const costGold = 3000;

    if (astralEssence < costEssence || gold < costGold) {
      setLogMsg(`⚠️ Для перековки требуется ${costEssence} Эссенций и ${fmt(costGold)} золота!`);
      return;
    }

    sound.playSpell();
    setAstralEssence(prev => prev - costEssence);
    useGame.setState(s => ({ gold: s.gold - costGold }));

    // Re-roll affixes
    const possibleStats = ['dmg', 'armor', 'hp', 'crit', 'mana'];
    selectedGear.affixes = [
      { stat: possibleStats[Math.floor(Math.random() * possibleStats.length)] as any, value: 5 + Math.floor(Math.random() * 25), name: 'Астральный Всплеск' },
      { stat: possibleStats[Math.floor(Math.random() * possibleStats.length)] as any, value: 5 + Math.floor(Math.random() * 25), name: 'Благословение Бездны' },
    ];
    selectedGear.score += 15;

    const s = useGame.getState();
    const derived = computeDerived(s.level, s.stats, s.equipment, s.talents);
    useGame.setState({ derived, playerAtk: Math.round((derived.dmgMin + derived.dmgMax) / 2) });

    setLogMsg(`🌀 ПЕРЕКОВКА ЗАВЕРШЕНА! Новые аффиксы получены для ${selectedGear.name}!`);
  };

  // Transmutation: Combine 3 items of same rarity into 1 item of higher rarity
  const handleTransmute = () => {
    if (transmuteItems.length < 3) {
      setLogMsg('⚠️ Выберите ровно 3 предмета одной редкости для трансмутации!');
      return;
    }

    const items = inventory.filter(i => transmuteItems.includes(i.id));
    if (items.length < 3) return;

    const baseRarity = items[0].rarity;
    const rarityRanks: RarityId[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
    const currentIdx = rarityRanks.indexOf(baseRarity);
    const nextRarity = rarityRanks[Math.min(rarityRanks.length - 1, currentIdx + 1)];

    sound.playHoly();

    // Remove 3 source items
    const remainingInv = inventory.filter(i => !transmuteItems.includes(i.id));
    
    // Create new higher tier item
    const newItem = craftFromRecipe(CRAFTING_RECIPES[Math.floor(Math.random() * CRAFTING_RECIPES.length)], level);
    newItem.rarity = nextRarity;
    newItem.score = Math.round(newItem.score * 1.4);

    useGame.setState(s => ({
      inventory: [...remainingInv, newItem],
      log: [...s.log, { id: Date.now(), text: `🌀 ТРАНСМУТАЦИЯ: Создан ${newItem.name} (${rarityById(nextRarity).name})!`, color: rarityById(nextRarity).color, time: Date.now() }]
    }));

    setTransmuteItems([]);
    setLogMsg(`✨ ТРАНСМУТАЦИЯ УСПЕШНА! Получен ${newItem.name} повышенной редкости (${rarityById(nextRarity).name})!`);
  };

  // Bulk Salvage Trash
  const handleSalvageAllTrash = () => {
    const trash = inventory.filter(i => i.rarity === 'common' || i.rarity === 'uncommon');
    if (trash.length === 0) {
      setLogMsg('ℹ️ В инвентаре нет обычных или необычных предметов для распила.');
      return;
    }

    sound.playLoot();
    let gainedOre = 0;
    let gainedEssence = 0;

    trash.forEach(it => {
      const res = salvageItem(it);
      gainedOre += res.ore || 12;
      gainedEssence += res.essence || 3;
    });

    const newInv = inventory.filter(i => i.rarity !== 'common' && i.rarity !== 'uncommon');
    setAstralOre(prev => prev + gainedOre);
    setAstralEssence(prev => prev + gainedEssence);

    useGame.setState(s => ({
      inventory: newInv,
      log: [...s.log, { id: Date.now(), text: `🪵 Разобрано ${trash.length} предметов. Получено +${gainedOre} руды, +${gainedEssence} эссенций!`, color: '#38bdf8', time: Date.now() }]
    }));

    setLogMsg(`🪵 Разобрано ${trash.length} предметов. Получено +${gainedOre} Астральной Руды и +${gainedEssence} Эссенций!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-slate-950 border border-orange-500/50 rounded-2xl max-w-4xl w-full p-4 shadow-[0_0_60px_rgba(249,115,22,0.3)] space-y-3 relative max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-orange-500/10 border border-orange-500/30 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">🔨</span>
            <div>
              <h2 className="font-black text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span>КУЗНИЦА БЕЗДНЫ И ЗАКАЛКА (FORGE OF TITANS)</span>
              </h2>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                <span>Руда: <b className="text-amber-300 font-black">🪵 {fmt(astralOre)} штук</b></span>
                <span>·</span>
                <span>Эссенция: <b className="text-cyan-300 font-black">🧪 {fmt(astralEssence)} штук</b></span>
                <span>·</span>
                <span>Золото: <b className="text-yellow-300 font-black">🪙 {fmt(gold)} золота</b></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setTab('temper')}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'temper' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔨</span>
            <span>Заточка (+1...+20)</span>
          </button>

          <button
            onClick={() => setTab('reforge')}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'reforge' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌀</span>
            <span>Перековка & Трансмутация</span>
          </button>

          <button
            onClick={() => setTab('craft')}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'craft' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚒️</span>
            <span>Крафт Сетов</span>
          </button>

          <button
            onClick={() => setTab('salvage')}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'salvage' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🪵</span>
            <span>Распил (Salvage)</span>
          </button>
        </div>

        {/* Tab 1: Tempering (+1 ... +20) */}
        {tab === 'temper' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0 overflow-y-auto pr-1">
            
            {/* Gear Selector */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="font-black text-xs text-orange-300 uppercase tracking-wider">
                1. Выберите Предмет для Заточки
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {allGear.map(item => {
                  const r = rarityById(item.rarity);
                  const isSelected = selectedGear?.id === item.id;
                  const enhLvl = itemEnhanceLevel[item.id] || 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedGear(item)}
                      className={`w-full p-2 rounded-xl border flex items-center justify-between gap-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-950/80 border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.4)] ring-1 ring-orange-400'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0">
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-black truncate" style={{ color: r.color }}>
                            {item.name} {enhLvl > 0 && <span className="text-amber-300 font-mono font-black">+{enhLvl}</span>}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {r.name} · Урон: {item.base.dmg || 0} · Броня: {item.base.armor || 0}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded-md shrink-0">
                        ⚡{fmt(item.score)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tempering Anvil Box */}
            <div className="p-4 bg-slate-900 border border-orange-500/40 rounded-2xl flex flex-col justify-between space-y-3 shadow-inner">
              {selectedGear ? (() => {
                const curLvl = itemEnhanceLevel[selectedGear.id] || 0;
                const nextLvl = curLvl + 1;
                const goldCost = Math.round((curLvl + 1) * 1200 * (1 + curLvl * 0.15));
                const oreCost = (curLvl + 1) * 10;
                const successRate = Math.max(30, 100 - curLvl * 4);
                const r = rarityById(selectedGear.rarity);

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">{selectedGear.icon}</span>
                        <div>
                          <div className="text-sm font-black" style={{ color: r.color }}>
                            {selectedGear.name} <span className="text-amber-300 font-mono">+{curLvl}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Текущая мощь: <b className="text-amber-300">⚡{fmt(selectedGear.score)}</b>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-emerald-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                        Шанс: {successRate}%
                      </span>
                    </div>

                    {/* Progress Bar +1 to +20 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-black text-slate-400">
                        <span>Уровень заточки: +{curLvl}</span>
                        <span>Цель: +{nextLvl} (Макс: +20)</span>
                      </div>
                      <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 transition-all duration-300"
                          style={{ width: `${(curLvl / 20) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Upgrade Cost Details */}
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>💰 Золото: <b className={gold >= goldCost ? 'text-amber-300' : 'text-red-400'}>{fmt(goldCost)} золота</b></div>
                      <div>🪵 Руда: <b className={astralOre >= oreCost ? 'text-amber-300' : 'text-red-400'}>{oreCost} штук</b></div>
                    </div>

                    <button
                      onClick={handleTemperItem}
                      disabled={curLvl >= 20}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:scale-[1.01] text-white font-black text-xs border border-orange-400 shadow-xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>🔥</span>
                      <span>{curLvl >= 20 ? 'Максимальный уровень (+20)' : `Закалить до +${nextLvl}`}</span>
                    </button>
                  </div>
                );
              })() : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center py-12">
                  <span className="text-4xl mb-2">🔨</span>
                  <span>Выберите предмет из списка слева для заточки на наковальне</span>
                </div>
              )}

              {/* Status Log Box */}
              <div className="p-2.5 bg-orange-950/40 border border-orange-500/40 rounded-xl text-xs text-orange-200 font-mono shadow">
                {logMsg}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reforge & Transmute */}
        {tab === 'reforge' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0 overflow-y-auto pr-1">
            {/* Reforge Affixes Box */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="font-black text-xs text-orange-300 uppercase">
                🌀 Перековка Аффиксов
              </div>
              <p className="text-xs text-slate-300">
                Перебросьте случайные бонусные свойства выбранного предмета за Астральные Эссенции!
              </p>
              {selectedGear ? (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-black text-slate-100">{selectedGear.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Требуется: 15x Эссенций · {fmt(3000)} золота
                  </div>
                  <button
                    onClick={handleReforgeAffixes}
                    className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    Перековать Аффиксы
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center">
                  Выберите предмет во вкладке «Заточка»
                </div>
              )}
            </div>

            {/* Transmutation Box */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="font-black text-xs text-orange-300 uppercase">
                ✨ Трансмутация (3 предмета в 1)
              </div>
              <p className="text-xs text-slate-300">
                Выберите 3 предмета одинаковой редкости из инвентаря для создания 1 предмета повышенной редкости!
              </p>
              <div className="space-y-2">
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {inventory.map(item => {
                    const isPicked = transmuteItems.includes(item.id);
                    const r = rarityById(item.rarity);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (isPicked) setTransmuteItems(prev => prev.filter(id => id !== item.id));
                          else if (transmuteItems.length < 3) setTransmuteItems(prev => [...prev, item.id]);
                        }}
                        className={`w-full p-1.5 rounded-lg border text-xs flex items-center justify-between ${
                          isPicked ? 'bg-orange-950 border-orange-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span style={{ color: r.color }}>{item.name}</span>
                        <span>{isPicked ? '✅' : '➕'}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleTransmute}
                  disabled={transmuteItems.length < 3}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 disabled:opacity-40 text-white font-black text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Трансмутировать ({transmuteItems.length}/3)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Crafting Sets */}
        {tab === 'craft' && (
          <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CRAFTING_RECIPES.map(rec => {
                const r = rarityById(rec.targetRarity);
                const canCraft = astralOre >= rec.oreCost && astralEssence >= rec.essenceCost;

                return (
                  <div key={rec.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-2 shadow">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl p-1.5 bg-slate-950 rounded-xl border border-slate-800">{rec.icon}</span>
                      <div>
                        <div className="font-black text-xs" style={{ color: r.color }}>{rec.name}</div>
                        <div className="text-[10px] text-slate-400">{rec.slot} · {r.name}</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span>Руда: {rec.oreCost} штук</span>
                      <span>Эссенция: {rec.essenceCost} штук</span>
                    </div>
                    <button
                      onClick={() => {
                        if (!canCraft || inventory.length >= 72) return;
                        sound.playEquip();
                        setAstralOre(prev => prev - rec.oreCost);
                        setAstralEssence(prev => prev - rec.essenceCost);
                        const item = craftFromRecipe(rec, level);
                        useGame.setState(s => ({
                          inventory: [...s.inventory, item],
                          log: [...s.log, { id: Date.now(), text: `🔨 Скован предмет: ${item.name}!`, color: '#facc15', time: Date.now() }]
                        }));
                        setLogMsg(`🔨 Вы сковали ${item.name}!`);
                      }}
                      disabled={!canCraft}
                      className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-black text-xs transition-all active:scale-95 cursor-pointer"
                    >
                      Выплавить
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Bulk Salvage */}
        {tab === 'salvage' && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 flex-1 min-h-0 overflow-y-auto">
            <span className="text-5xl animate-bounce inline-block">🪵</span>
            <h3 className="font-black text-base text-orange-300 uppercase">Распил Ненужного Снаряжения</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Мгновенно распилите все обычные и необычные предметы в инвентаре на Астральную Руду и Эссенции для заточки!
            </p>
            <button
              onClick={handleSalvageAllTrash}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:scale-105 text-white font-black text-xs border border-orange-400 shadow-2xl transition-all active:scale-95 cursor-pointer"
            >
              Разобрать весь хлам на материалы
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
