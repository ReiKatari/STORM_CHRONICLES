import { useState } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import { GEM_DEFS, GEM_TIER_COLORS, GEM_TIER_NAMES, getRefinementInfo, RUNEWORDS_CATALOG } from '@/game/gems';
import type { GemTier, GemType, SlotId } from '@/game/types';
import { rarityById } from '@/game/items';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export default function ForgeModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const [activeTab, setActiveTab] = useState<'refine' | 'socket' | 'combine' | 'runewords'>('refine');
  const [selectedSlot, setSelectedSlot] = useState<SlotId>('weapon');

  const equipment = useGame(s => s.equipment);
  const gold = useGame(s => s.gold);
  const enhancementStones = useGame(s => s.enhancementStones || 0);
  const gemsInventory = useGame(s => s.gemsInventory || []);
  const refineEquipment = useGame(s => s.refineEquipment);
  const socketGem = useGame(s => s.socketGem);
  const unsocketGem = useGame(s => s.unsocketGem);
  const combineGems = useGame(s => s.combineGems);

  const currentItem = equipment[selectedSlot];
  const curUpgradeLvl = currentItem?.upgradeLevel || 0;
  const refInfo = getRefinementInfo(curUpgradeLvl);

  const [refineFeedback, setRefineFeedback] = useState<string | null>(null);

  const handleRefine = () => {
    if (!currentItem || !refInfo) return;
    const res = refineEquipment(selectedSlot);
    if (res.success) {
      setRefineFeedback(`✨ Успех! Предмет усилен до +${res.newLevel}!`);
    } else {
      setRefineFeedback(`💥 Неудача при заточке!`);
    }
    setTimeout(() => setRefineFeedback(null), 3000);
  };

  const gearSlots: { id: SlotId; name: string; icon: string }[] = [
    { id: 'weapon', name: 'Оружие', icon: '⚔️' },
    { id: 'helmet', name: 'Шлем', icon: '🪖' },
    { id: 'armor', name: 'Доспех', icon: '🛡️' },
    { id: 'gloves', name: 'Перчатки', icon: '🧤' },
    { id: 'boots', name: 'Сапоги', icon: '👢' },
    { id: 'cloak', name: 'Плащ', icon: '🧥' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl shadow-lg">
              🔨
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Великая Кузница & Оружейная
              </h2>
              <p className="text-xs text-slate-400">
                Астральная заточка до +20, инкрустация самоцветов и синтез
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-lg transition-colors border border-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-4 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('refine')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'refine' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>✨</span>
            <span>Заточка (+1..+20)</span>
          </button>
          <button
            onClick={() => setActiveTab('socket')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'socket' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💎</span>
            <span>Инкрустация</span>
          </button>
          <button
            onClick={() => setActiveTab('combine')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'combine' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🔮</span>
            <span>Огранка Самоцветов</span>
          </button>
          <button
            onClick={() => setActiveTab('runewords')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'runewords' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📜</span>
            <span>Рунические Слова</span>
          </button>
        </div>

        {/* Resources bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 rounded-xl border border-slate-800 mb-4 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span>💰</span>
              <span>{fmt(gold)} Золота</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span>🔨</span>
              <span>{enhancementStones} Камней Усиления</span>
            </div>
          </div>
          <div className="text-slate-400 text-[11px]">
            Самоцветов в сумке: <span className="text-white font-bold">{gemsInventory.length}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'refine' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Slot selector */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Выберите экипировку:</div>
                <div className="grid grid-cols-2 gap-2">
                  {gearSlots.map(s => {
                    const it = equipment[s.id];
                    const r = it ? rarityById(it.rarity) : null;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSlot(s.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                          selectedSlot === s.id
                            ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0 relative">
                          {it?.icon || s.icon}
                          {it?.upgradeLevel && it.upgradeLevel > 0 ? (
                            <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1 rounded-full font-mono">
                              +{it.upgradeLevel}
                            </span>
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black truncate text-white">
                            {it?.name || s.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {it ? (
                              <span style={{ color: r?.color }}>+{it.upgradeLevel || 0} Заточка</span>
                            ) : (
                              'Пусто'
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Refinement Forge Anvil */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                {currentItem ? (
                  <>
                    <div>
                      <div className="text-center pb-3 border-b border-slate-800">
                        <div className="text-4xl mb-2">{currentItem.icon}</div>
                        <div className="text-sm font-black text-white flex items-center justify-center gap-1">
                          <span>{currentItem.name}</span>
                          <span className="text-amber-400 font-mono">+{curUpgradeLvl}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Текущая мощь: <span className="text-amber-300 font-bold font-mono">⚡{fmt(currentItem.score)}</span>
                        </div>
                      </div>

                      {refInfo ? (
                        <div className="my-4 space-y-2 text-xs">
                          <div className="flex justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400">Следующий уровень:</span>
                            <span className="text-amber-400 font-bold font-mono">+{refInfo.nextLevel}</span>
                          </div>
                          <div className="flex justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400">Шанс успеха:</span>
                            <span className="text-emerald-400 font-bold font-mono">{refInfo.successChance}%</span>
                          </div>
                          <div className="flex justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400">Требуется Золота:</span>
                            <span className={gold >= refInfo.goldCost ? 'text-white font-mono' : 'text-red-400 font-mono'}>
                              {fmt(refInfo.goldCost)}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400">Требуется Камней:</span>
                            <span className={enhancementStones >= refInfo.stonesCost ? 'text-white font-mono' : 'text-red-400 font-mono'}>
                              {refInfo.stonesCost} штук
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="my-6 text-center text-amber-400 font-black text-sm">
                          👑 Достигнут МАКСИМАЛЬНЫЙ УРОВЕНЬ ЗАТОЧКИ (+20)!
                        </div>
                      )}

                      {refineFeedback && (
                        <div className="text-center font-bold text-xs p-2 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 mb-2 animate-bounce">
                          {refineFeedback}
                        </div>
                      )}
                    </div>

                    {refInfo && (
                      <button
                        onClick={handleRefine}
                        disabled={gold < refInfo.goldCost || enhancementStones < refInfo.stonesCost}
                        className={`w-full py-3 rounded-xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${
                          gold >= refInfo.goldCost && enhancementStones >= refInfo.stonesCost
                            ? 'rpg-button-gold hover:scale-[1.02] active:scale-98 cursor-pointer'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        <span>🔨</span>
                        <span>Усилить до +{refInfo.nextLevel}</span>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
                    <span className="text-3xl mb-2">🛡️</span>
                    <span>Выберите предмет для усиления</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'socket' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Equipped item sockets view */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                  Инкрустация в: <span className="text-white">{currentItem?.name || 'Предмет не выбран'}</span>
                </div>

                {currentItem ? (
                  <div className="space-y-3">
                    {[0, 1].map(socketIdx => {
                      const gem = currentItem.sockets?.[socketIdx];
                      return (
                        <div
                          key={socketIdx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-lg">
                              {gem ? gem.icon : '⚪'}
                            </div>
                            <div>
                              <div className="text-xs font-black text-white">
                                {gem ? gem.name : `Гнездо #${socketIdx + 1} (Пусто)`}
                              </div>
                              <div className="text-[10px] text-amber-400 font-mono">
                                {gem ? gem.bonusDesc : 'Нажмите на самоцвет справа для вставки'}
                              </div>
                            </div>
                          </div>

                          {gem && (
                            <button
                              onClick={() => unsocketGem(selectedSlot, socketIdx)}
                              className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-[10px] font-bold hover:bg-red-900 transition-colors"
                            >
                              Извлечь
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 text-xs py-8">
                    Сначала наденьте предмет в соответствующий слот
                  </div>
                )}
              </div>

              {/* Gems available in inventory */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col">
                <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                  Самоцветы в сумке ({gemsInventory.length}):
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[300px] pr-1">
                  {gemsInventory.map(gem => (
                    <div
                      key={gem.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{gem.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{gem.name}</div>
                          <div className="text-[10px] text-cyan-400 font-mono">{gem.bonusDesc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const targetIdx = currentItem?.sockets?.[0] ? 1 : 0;
                          socketGem(selectedSlot, targetIdx, gem.id);
                        }}
                        disabled={!currentItem}
                        className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs transition-colors shadow"
                      >
                        Вставить
                      </button>
                    </div>
                  ))}
                  {gemsInventory.length === 0 && (
                    <div className="text-center text-slate-500 text-xs py-8">
                      Нет самоцветов. Выбивайте их из монстров и боссов!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'combine' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                ✨ Объединяйте 3 одинаковых самоцвета одного ранга, чтобы получить 1 самоцвет высшего ранга с удвоенными характеристиками!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(['ruby', 'sapphire', 'emerald', 'topaz', 'diamond', 'amethyst'] as GemType[]).map(gType => {
                  const def = GEM_DEFS[gType];
                  return (
                    <div key={gType} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <span className="text-2xl">{def.icon}</span>
                        <div>
                          <div className="text-xs font-black text-white">{def.name}</div>
                          <div className="text-[10px] text-slate-400">{def.desc}</div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {([1, 2, 3, 4] as GemTier[]).map(tier => {
                          const count = gemsInventory.filter(g => g.type === gType && g.tier === tier).length;
                          return (
                            <div
                              key={tier}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                            >
                              <div className="flex items-center gap-1.5 font-mono">
                                <span style={{ color: GEM_TIER_COLORS[tier] }}>★{tier}</span>
                                <span className="text-slate-200">{GEM_TIER_NAMES[tier]}</span>
                                <span className="text-slate-400">({count} штук)</span>
                              </div>

                              <button
                                onClick={() => combineGems(gType, tier)}
                                disabled={count < 3}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                                  count >= 3
                                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                }`}
                              >
                                Огранить 3 ➔ 1
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'runewords' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                📜 Древние Рунические Слова активируют скрытые мифические пассивные способности при правильной комбинации рун.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {RUNEWORDS_CATALOG.map(rw => (
                  <div key={rw.id} className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-3.5 space-y-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{rw.icon}</span>
                      <div>
                        <div className="text-xs font-black text-emerald-400">{rw.name}</div>
                        <div className="text-[10px] text-slate-400">Требуемые руны: {rw.runes.join(' + ')}</div>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/90 text-[11px] text-slate-200 border border-slate-800">
                      {rw.effectDesc}
                    </div>
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
