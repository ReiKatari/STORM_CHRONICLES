import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';
import { CRAFTING_RECIPES, salvageItem, craftFromRecipe, type CraftingRecipe } from '@/game/crafting';
import { RUNES, type RuneDef } from '@/game/runes';
import { rarityById } from '@/game/items';
import type { Item } from '@/game/types';

export default function CraftingModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'craft' | 'salvage' | 'sockets'>('craft');
  const level = useGame(s => s.level);
  const inventory = useGame(s => s.inventory);
  const ore = useGame(s => (s as unknown as { astralOre: number }).astralOre ?? 120);
  const essence = useGame(s => (s as unknown as { astralEssence: number }).astralEssence ?? 25);
  const playerRunes = useGame(s => (s as unknown as { runesInventory: string[] }).runesInventory ?? ['ruby_1', 'emerald_1']);

  const [selectedItemForRune, setSelectedItemForRune] = useState<Item | null>(null);

  // 3-Minute Recipe Rotation Timer (180 seconds)
  const [recipeTimer, setRecipeTimer] = useState<number>(180);
  const [activeRecipes, setActiveRecipes] = useState<CraftingRecipe[]>(() => {
    // Pick 5 random recipes initially
    const shuffled = [...CRAFTING_RECIPES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const refreshRecipes = () => {
    const shuffled = [...CRAFTING_RECIPES].sort(() => Math.random() - 0.5);
    setActiveRecipes(shuffled.slice(0, 5));
    setRecipeTimer(180);
  };

  // Live countdown timer for 3-minute recipe rotation
  useEffect(() => {
    const timerId = setInterval(() => {
      setRecipeTimer(prev => {
        if (prev <= 1) {
          refreshRecipes();
          return 180;
        }
        return prev - 1;
      });
    }, 1000);
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

  const handleCraftRune = (rune: RuneDef) => {
    if (ore < rune.oreCost || essence < rune.essenceCost) return;
    useGame.setState(s => ({
      astralOre: ((s as unknown as { astralOre: number }).astralOre ?? 0) - rune.oreCost,
      astralEssence: ((s as unknown as { astralEssence: number }).astralEssence ?? 0) - rune.essenceCost,
      runesInventory: [...((s as unknown as { runesInventory: string[] }).runesInventory ?? []), rune.id],
      log: [...s.log, { id: Date.now(), text: `🔮 Высечена руна: ${rune.name}!`, color: rune.color, time: Date.now() }],
    }));
  };

  const handleSocketRuneToItem = (item: Item, runeId: string) => {
    const rune = RUNES.find(r => r.id === runeId);
    if (!rune) return;

    // Apply stat bonus to item
    const updatedItem: Item = { ...item };
    if (rune.stat === 'dmg') updatedItem.dmg = (updatedItem.dmg ?? 0) + rune.value;
    if (rune.stat === 'armor') updatedItem.armor = (updatedItem.armor ?? 0) + rune.value;
    if (rune.stat === 'hp') updatedItem.hp = (updatedItem.hp ?? 0) + rune.value;
    updatedItem.name = `${updatedItem.name} [${rune.name}]`;

    // Remove 1 copy of runeId from player runes inventory
    const newRunes = [...playerRunes];
    const idx = newRunes.indexOf(runeId);
    if (idx !== -1) newRunes.splice(idx, 1);

    // Replace item in game inventory
    const newInv = inventory.map(i => i.id === item.id ? updatedItem : i);

    useGame.setState(s => ({
      inventory: newInv,
      runesInventory: newRunes,
      log: [...s.log, { id: Date.now(), text: `✨ Вставлена ${rune.name} в предмете ${updatedItem.name}!`, color: '#4ade80', time: Date.now() }],
    }));

    setSelectedItemForRune(null);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-4 shadow-2xl space-y-3 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl">🔨</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                АСТРАЛЬНАЯ КУЗНИЦА, РАЗБОР И РУНЫ
              </h2>
              <div className="text-[10px] text-slate-400 flex items-center gap-3 font-mono mt-0.5">
                <span className="text-amber-300 font-bold">🪵 Руда: {ore}</span>
                <span className="text-purple-300 font-bold">🔮 Эссенции: {essence}</span>
                <span className="text-emerald-300 font-bold">💎 Сумка Рун: {playerRunes.length}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setTab('craft')}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
              tab === 'craft' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔨</span>
            <span>Выплавка Рецептов</span>
          </button>
          <button
            onClick={() => setTab('salvage')}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
              tab === 'salvage' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🪵</span>
            <span>Разбор Лута</span>
          </button>
          <button
            onClick={() => setTab('sockets')}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
              tab === 'sockets' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔮</span>
            <span>Крафт и Вставка Рун</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {/* TAB 1: CRAFTING RECIPES */}
          {tab === 'craft' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[11px] font-bold text-slate-300">
                  🔥 Ассортимент рецептов кузницы (Смена каждые 3 мин)
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-amber-300 font-black">⏱️ {formatTimer(recipeTimer)}</span>
                  <button
                    onClick={refreshRecipes}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 font-bold"
                  >
                    🔄 Сменить
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {activeRecipes.map(rec => (
                  <div key={rec.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800">{rec.icon}</span>
                      <div>
                        <div className="font-extrabold text-xs text-amber-300">{rec.name}</div>
                        <div className="text-[10px] text-slate-300 leading-snug">{rec.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCraft(rec)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-extrabold text-white text-[10px] uppercase shadow-md active:scale-95 shrink-0"
                    >
                      🔨 Ковать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SALVAGE */}
          {tab === 'salvage' && (
            <div className="space-y-4 p-4 text-center bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="text-3xl">🪵</div>
              <h3 className="font-extrabold text-sm text-slate-100">Автоматический Разбор Наград и Хлама</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Автоматически расщепляйте ненужное снаряжение из сумки на ценную Астральную Руду и Эссенции для кузнечного производства.
              </p>
              <button
                onClick={handleSalvageAllTrash}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 font-black text-white text-xs uppercase shadow-xl hover:scale-105 active:scale-95 transition-all border border-orange-400"
              >
                🪵 Переплавить весь мусор (Обычные / Необычные)
              </button>
            </div>
          )}

          {/* TAB 3: RUNES & SOCKETING */}
          {tab === 'sockets' && (
            <div className="space-y-4">
              {/* Rune Inscription Section */}
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-2">
                <div className="font-extrabold text-xs text-purple-300">
                  🔮 Астральная Гравировка и Вставка Рун в Снаряжение
                </div>
                <div className="text-[10px] text-slate-300">
                  Выберите предмет из инвентаря для вставки скрафченной руны:
                </div>

                {/* Inventory Picker for Socketing */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {inventory.map(item => {
                    const r = rarityById(item.rarity);
                    const isSelected = selectedItemForRune?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItemForRune(item)}
                        className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-purple-900/60 border-purple-400 ring-2 ring-purple-400'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-[10px] truncate" style={{ color: r.color }}>{item.name}</div>
                          <div className="text-[9px] text-slate-400 font-mono">ilvl {item.ilvl}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Socketing Confirmation */}
                {selectedItemForRune && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/60 space-y-2 mt-2">
                    <div className="text-[10px] text-purple-200 font-bold">
                      Выбран предмет: <b className="text-slate-100">{selectedItemForRune.name}</b>. Нажмите на руну ниже для вставки:
                    </div>
                    {playerRunes.length === 0 ? (
                      <div className="text-[10px] text-red-400">У вас нет готовых рун в сумке! Высеките их ниже.</div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {playerRunes.map((runeId, i) => {
                          const rDef = RUNES.find(r => r.id === runeId);
                          if (!rDef) return null;
                          return (
                            <button
                              key={i}
                              onClick={() => handleSocketRuneToItem(selectedItemForRune, runeId)}
                              className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/60 text-purple-200 text-[10px] font-bold hover:bg-purple-800 transition-all flex items-center gap-1 shadow"
                            >
                              <span>{rDef.icon}</span>
                              <span>{rDef.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Craftable Runes List */}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider">
                  💎 Алтарь Высечения Древних Рун (Рецепты Рун)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RUNES.map(r => {
                    const canAfford = ore >= r.oreCost && essence >= r.essenceCost;
                    return (
                      <div key={r.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2 shadow-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-2xl p-1 bg-slate-900 rounded-lg">{r.icon}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-xs truncate" style={{ color: r.color }}>{r.name}</div>
                            <div className="text-[10px] text-slate-300 font-mono">{r.desc}</div>
                            <div className="text-[9px] text-slate-400 font-mono">
                              🪵 {r.oreCost} руды · 🔮 {r.essenceCost} эссенций
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCraftRune(r)}
                          disabled={!canAfford}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] shrink-0 disabled:opacity-40 transition-all active:scale-95 shadow"
                        >
                          🔮 Высечь
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
