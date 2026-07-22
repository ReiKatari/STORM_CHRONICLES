import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';
import { CRAFTING_RECIPES, salvageItem, craftFromRecipe, type CraftingRecipe } from '@/game/crafting';
import { RUNES, type RuneDef } from '@/game/runes';
import { rarityById } from '@/game/items';

export default function CraftingModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'craft' | 'salvage' | 'sockets'>('craft');
  const level = useGame(s => s.level);
  const inventory = useGame(s => s.inventory);
  const ore = useGame(s => (s as unknown as { astralOre: number }).astralOre ?? 120);
  const essence = useGame(s => (s as unknown as { astralEssence: number }).astralEssence ?? 25);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCraft = (rec: CraftingRecipe) => {
    if (inventory.length >= 72) return;
    const item = craftFromRecipe(rec, level);
    useGame.setState(s => ({
      inventory: [...s.inventory, item],
      log: [...s.log, { id: Date.now(), text: `🔨 Выплавлено снаряжение: ${item.name}!`, color: '#facc15', time: Date.now() }],
    }));
  };

  const handleSalvageAllTrash = () => {
    const trash = inventory.filter(i => i.rarity === 'common' || i.rarity === 'uncommon');
    if (trash.length === 0) return;

    let gainedOre = 0;
    let gainedEssence = 0;
    trash.forEach(it => {
      const res = salvageItem(it);
      gainedOre += res.ore;
      gainedEssence += res.essence;
    });

    const newInv = inventory.filter(i => i.rarity !== 'common' && i.rarity !== 'uncommon');
    useGame.setState(s => ({
      inventory: newInv,
      astralOre: ((s as unknown as { astralOre: number }).astralOre ?? 0) + gainedOre,
      astralEssence: ((s as unknown as { astralEssence: number }).astralEssence ?? 0) + gainedEssence,
      log: [...s.log, { id: Date.now(), text: `🪵 Разобрано ${trash.length} предметов. Получено +${gainedOre} руды, +${gainedEssence} эссенций!`, color: '#38bdf8', time: Date.now() }],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-4 shadow-2xl space-y-3 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔨</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                АСТРАЛЬНАЯ КУЗНИЦА, РАЗБОР И РУНЫ
              </h2>
              <div className="text-[10px] text-slate-400 flex items-center gap-3 font-mono mt-0.5">
                <span className="text-amber-300">🪵 Руда: {ore}</span>
                <span className="text-purple-300">🔮 Эссенции: {essence}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setTab('craft')}
            className={`flex-1 py-1.5 rounded-lg font-extrabold text-xs transition-all ${tab === 'craft' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
          >
            🔨 Выплавка Рецептов
          </button>
          <button
            onClick={() => setTab('salvage')}
            className={`flex-1 py-1.5 rounded-lg font-extrabold text-xs transition-all ${tab === 'salvage' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
          >
            🪵 Разбор Лута
          </button>
          <button
            onClick={() => setTab('sockets')}
            className={`flex-1 py-1.5 rounded-lg font-extrabold text-xs transition-all ${tab === 'sockets' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
          >
            🔮 Вставка Рун
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
          {tab === 'craft' && (
            <div className="space-y-2">
              {CRAFTING_RECIPES.map(rec => (
                <div key={rec.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 bg-slate-900 rounded-lg border border-slate-800">{rec.icon}</span>
                    <div>
                      <div className="font-extrabold text-xs text-amber-300">{rec.name}</div>
                      <div className="text-[10px] text-slate-300">{rec.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCraft(rec)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-extrabold text-white text-[10px] uppercase shadow-md active:scale-95 shrink-0"
                  >
                    🔨 Кувать
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'salvage' && (
            <div className="space-y-3 p-2 text-center">
              <p className="text-xs text-slate-300">
                Автоматически переплавьте обычные и необычные предметы в Астральную Руду и Эссенции.
              </p>
              <button
                onClick={handleSalvageAllTrash}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 font-extrabold text-white text-xs uppercase shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                🪵 Переплавить весь мусор (Обычные / Необычные)
              </button>
            </div>
          )}

          {tab === 'sockets' && (
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 mb-1">Доступные Астральные Руны & Камни:</div>
              <div className="grid grid-cols-2 gap-2">
                {RUNES.map(r => (
                  <div key={r.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <span className="text-xl">{r.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs" style={{ color: r.color }}>{r.name}</div>
                      <div className="text-[10px] text-slate-300">{r.desc}</div>
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
