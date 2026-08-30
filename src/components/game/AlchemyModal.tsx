import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { ALCHEMY_RECIPES, HERBS_CATALOG } from '@/game/alchemy';
import { sound } from '@/game/sound';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface HerbPlot {
  id: string;
  herbId: string;
  name: string;
  icon: string;
  growthSec: number;
  readyAt: number;
  yieldCount: number;
}

export default function AlchemyModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const herbsInventory = useGame(s => s.herbsInventory || {});
  const activePotions = useGame(s => s.activePotions || []);
  const craftAlchemyPotion = useGame(s => s.craftAlchemyPotion);
  const gatherHerb = useGame(s => s.gatherHerb);

  const [craftingFeedback, setCraftingFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cauldron' | 'garden' | 'active'>('cauldron');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Herb Garden Plots stored in localStorage
  const [plots, setPlots] = useState<HerbPlot[]>(() => {
    try {
      const saved = localStorage.getItem('storm_alchemy_plots');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    const now = Date.now();
    return [
      { id: 'p_1', herbId: 'blood_rose', name: 'Кровавая Роза', icon: '🌹', growthSec: 45, readyAt: now + 45000, yieldCount: 3 },
      { id: 'p_2', herbId: 'shadow_vine', name: 'Теневой Плющ', icon: '🌿', growthSec: 60, readyAt: now + 60000, yieldCount: 3 },
      { id: 'p_3', herbId: 'astral_lotus', name: 'Астральный Лотос', icon: '🪷', growthSec: 90, readyAt: now + 90000, yieldCount: 2 },
      { id: 'p_4', herbId: 'dragon_tear', name: 'Слеза Дракона', icon: '💧', growthSec: 120, readyAt: now + 120000, yieldCount: 2 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('storm_alchemy_plots', JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    const iv = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const handleCraft = (recipeId: string, recipeName: string) => {
    const success = craftAlchemyPotion(recipeId);
    if (success) {
      sound.playSpell();
      setCraftingFeedback(`✨ Сварено и выпито: «${recipeName}»!`);
    } else {
      setCraftingFeedback(`❌ Недостаточно редких трав для варки!`);
    }
    setTimeout(() => setCraftingFeedback(null), 3000);
  };

  const handleHarvestPlot = (plotId: string) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || plot.readyAt > currentTime) return;

    sound.playEquip();
    gatherHerb(plot.herbId, plot.yieldCount);

    setPlots(prev => prev.map(p => {
      if (p.id === plotId) {
        return { ...p, readyAt: Date.now() + p.growthSec * 1000 };
      }
      return p;
    }));

    setCraftingFeedback(`🌿 Собрано +${plot.yieldCount}x ${plot.name}! Семена пересажены.`);
    setTimeout(() => setCraftingFeedback(null), 2500);
  };

  const handleHarvestAll = () => {
    const readyPlots = plots.filter(p => p.readyAt <= currentTime);
    if (readyPlots.length === 0) {
      setCraftingFeedback('⏳ Грядки ещё созревают...');
      setTimeout(() => setCraftingFeedback(null), 2000);
      return;
    }

    sound.playLevelUp();
    let totalHarvested = 0;
    readyPlots.forEach(p => {
      gatherHerb(p.herbId, p.yieldCount);
      totalHarvested += p.yieldCount;
    });

    setPlots(prev => prev.map(p => {
      if (p.readyAt <= currentTime) {
        return { ...p, readyAt: Date.now() + p.growthSec * 1000 };
      }
      return p;
    }));

    setCraftingFeedback(`🎉 Собрано ${totalHarvested} трав со всех созревших грядок!`);
    setTimeout(() => setCraftingFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-4xl bg-slate-900/95 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-slate-900 border border-emerald-500/50 flex items-center justify-center text-2xl shadow-lg">
              🧪
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Алхимическая Лаборатория & Оранжерея</span>
              </h2>
              <p className="text-xs text-slate-400">
                Варка боевых эликсиров, автоматическая культивация трав и активные эффекты
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[ESC]</span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-red-950/80 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 hover:border-red-500/50 transition-all cursor-pointer shadow"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('cauldron')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'cauldron'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>⚗️</span>
            <span>Котёл Варки</span>
          </button>

          <button
            onClick={() => setActiveTab('garden')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'garden'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🌱</span>
            <span>Сад & Грядки</span>
            {plots.some(p => p.readyAt <= currentTime) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🍷</span>
            <span>Активные Эликсиры ({activePotions.length})</span>
          </button>
        </div>

        {/* Herb Inventory Quick Counter Bar */}
        <div className="bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 shrink-0">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {HERBS_CATALOG.map(herb => {
              const count = herbsInventory[herb.id] || 0;
              return (
                <div
                  key={herb.id}
                  className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center shadow"
                >
                  <span className="text-xl">{herb.icon}</span>
                  <div className="text-[10px] font-bold text-slate-300 leading-tight truncate w-full">{herb.name}</div>
                  <div className="text-xs font-black font-mono text-emerald-400 mt-0.5">x{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback alert */}
        {craftingFeedback && (
          <div className="p-2 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs font-black text-center animate-pulse shrink-0">
            {craftingFeedback}
          </div>
        )}

        {/* Tab 1: Cauldron Recipes */}
        {activeTab === 'cauldron' && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ALCHEMY_RECIPES.map(recipe => {
                const canCraft = recipe.recipe.every(
                  ing => (herbsInventory[ing.herbId] || 0) >= ing.count
                );

                return (
                  <div
                    key={recipe.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-lg"
                  >
                    <div>
                      <div className="flex items-center gap-3 border-b border-slate-800 pb-2 mb-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow border"
                          style={{ backgroundColor: `${recipe.color}22`, borderColor: `${recipe.color}66` }}
                        >
                          {recipe.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-white">{recipe.name}</div>
                          <div className="text-[10px] text-amber-300 font-mono">
                            ⏱️ Длительность: {Math.round(recipe.durationSec / 60)} минут
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 mb-2.5 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        {recipe.desc}
                      </div>

                      {/* Ingredients needed */}
                      <div className="space-y-1 mb-3">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Требуемые ингредиенты:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {recipe.recipe.map(ing => {
                            const herbDef = HERBS_CATALOG.find(h => h.id === ing.herbId);
                            const currentCount = herbsInventory[ing.herbId] || 0;
                            const hasEnough = currentCount >= ing.count;
                            return (
                              <div
                                key={ing.herbId}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9.5px] border font-mono ${
                                  hasEnough
                                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                                    : 'bg-red-950/40 border-red-800/60 text-red-400'
                                }`}
                              >
                                <span>{herbDef?.icon}</span>
                                <span>{herbDef?.name}</span>
                                <span className="font-black">
                                  ({currentCount} из {ing.count})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCraft(recipe.id, recipe.name)}
                      disabled={!canCraft}
                      className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow ${
                        canCraft
                          ? 'rpg-button-primary hover:scale-[1.02] active:scale-98 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <span>🧪</span>
                      <span>Сварить & Активировать</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Herb Garden & Soil Plots */}
        {activeTab === 'garden' && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
            <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-black text-xs text-emerald-300">🌱 БОТАНИЧЕСКИЙ САД ОРАНЖЕРЕИ</div>
                <div className="text-[10.5px] text-slate-400">Грядки непрерывно выращивают ценные травы. Собирайте урожай по готовности!</div>
              </div>
              <button
                onClick={handleHarvestAll}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                🌿 Собрать Со Всех Грядок
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plots.map(plot => {
                const isReady = plot.readyAt <= currentTime;
                const secLeft = Math.max(0, Math.ceil((plot.readyAt - currentTime) / 1000));
                const growPct = Math.min(100, Math.max(0, ((plot.growthSec - secLeft) / plot.growthSec) * 100));

                return (
                  <div
                    key={plot.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-2.5 shadow"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">{plot.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-xs text-white">{plot.name}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">Урожай: +{plot.yieldCount} штук</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black font-mono ${
                        isReady ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isReady ? 'СОЗРЕЛО!' : `${secLeft} секунд`}
                      </span>
                    </div>

                    {/* Growth progress bar */}
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500"
                        style={{ width: `${growPct}%` }}
                      />
                    </div>

                    <button
                      onClick={() => handleHarvestPlot(plot.id)}
                      disabled={!isReady}
                      className={`w-full py-2 rounded-xl text-xs font-black transition-all ${
                        isReady
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg animate-bounce cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isReady ? `Собрать (+${plot.yieldCount})` : `Созревает... (${secLeft} секунд)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Active Elixirs */}
        {activeTab === 'active' && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
            {activePotions.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                🍷 В данный момент у вас нет активных эликсиров. Сварите зелья во вкладке «Котёл Варки»!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePotions.map(potion => {
                  const potDef = ALCHEMY_RECIPES.find(r => r.id === potion.id);
                  const secLeft = Math.max(0, potion.expireTimestamp - Math.floor(currentTime / 1000));
                  return (
                    <div
                      key={potion.id}
                      className="p-3.5 bg-slate-950 border border-emerald-500/40 rounded-2xl flex items-center justify-between shadow"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800">{potDef?.icon || '🍷'}</span>
                        <div>
                          <div className="font-black text-xs text-white">{potDef?.name || potion.id}</div>
                          <div className="text-[10px] text-slate-300">{potDef?.desc}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-500/40">
                          ⏱️ {Math.floor(secLeft / 60)}:{(secLeft % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
