import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import { rarityById } from '@/game/items';
import type { Item, RuneDef, RuneWordDef } from '@/game/types';

export const RUNES_CATALOG: RuneDef[] = [
  { id: 'rune_feoh', name: 'Руна Пламени (Feoh)', icon: '🔥', rarity: 'rare', bonusDesc: '+15% Физического Урона', stat: 'dmg', value: 15 },
  { id: 'rune_thurisaz', name: 'Руна Стали (Thurisaz)', icon: '🛡️', rarity: 'rare', bonusDesc: '+20% Брони', stat: 'armor', value: 20 },
  { id: 'rune_ansuz', name: 'Руна Астрала (Ansuz)', icon: '⚡', rarity: 'epic', bonusDesc: '+10% К Шансу Крита', stat: 'crit', value: 10 },
  { id: 'rune_ur', name: 'Руна Стойкости (Ur)', icon: '🗿', rarity: 'uncommon', bonusDesc: '+300 Макс. HP', stat: 'hp', value: 300 },
  { id: 'rune_raidho', name: 'Руна Скорости (Raidho)', icon: '🏃', rarity: 'epic', bonusDesc: '+15% К Скорости Атаки', stat: 'speed' as any, value: 15 },
];

export const RUNE_WORDS: RuneWordDef[] = [
  {
    id: 'rw_sunburst',
    name: 'Руническое Слово: «Солнечный Шквал»',
    icon: '☀️',
    runes: ['rune_feoh', 'rune_ansuz'],
    effectDesc: '+35% Урона и поджигает врагов солнечным пламенем.',
    bonusDmgPct: 35,
    bonusCritPct: 15,
  },
  {
    id: 'rw_titan_bastion',
    name: 'Руническое Слово: «Бастион Титана»',
    icon: '🏰',
    runes: ['rune_thurisaz', 'rune_ur'],
    effectDesc: '+40% Брони и +500 Здоровья HP.',
    bonusArmorPct: 40,
  },
];

export default function RuneSocketingModal({ onClose }: { onClose: () => void }) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [insertedRunes, setInsertedRunes] = useState<string[]>([]);
  const [logMsg, setLogMsg] = useState<string>('🔮 Выберите предмет для инкрустации Астральных Рун!');

  const equipment = useGame(s => s.equipment);
  const inventory = useGame(s => s.inventory);
  const allGear = [...Object.values(equipment).filter(Boolean) as Item[], ...inventory.filter(i => i.slot !== ('consumable' as any))];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelectGear = (item: Item) => {
    setSelectedItem(item);
    setInsertedRunes([]);
    setLogMsg(`Выбран предмет: ${item.name}. Доступно сокетов: 2`);
  };

  const handleInsertRune = (rune: RuneDef) => {
    if (!selectedItem) return;
    if (insertedRunes.length >= 2) {
      setLogMsg('⚠️ Все слоты рун на данном предмете заполнены!');
      return;
    }

    const nextRunes = [...insertedRunes, rune.id];
    setInsertedRunes(nextRunes);

    // Check for active Rune Word
    const activeWord = RUNE_WORDS.find(rw =>
      rw.runes.length === nextRunes.length && rw.runes.every(r => nextRunes.includes(r))
    );

    if (activeWord) {
      setLogMsg(`🎉 АКТИВИРОВАНО РУНИЧЕСКОЕ СЛОВО: ${activeWord.name}! ${activeWord.effectDesc}`);
    } else {
      setLogMsg(`🔮 Вставлена ${rune.name}: ${rune.bonusDesc}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-4 shadow-2xl space-y-3 relative max-h-[92vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">🔮</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                АСТРАЛЬНЫЕ РУНЫ И РУНИЧЕСКИЕ СЛОВА
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Инкрустация гнезд предметов рунической магией
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-y-auto">
          {/* Left Column: Equipment Selector (5 cols) */}
          <div className="md:col-span-5 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Выберите Экипировку ({allGear.length})</span>
            </div>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
              {allGear.map(it => {
                const r = rarityById(it.rarity);
                const isSel = selectedItem?.id === it.id;

                return (
                  <button
                    key={it.id}
                    onClick={() => handleSelectGear(it)}
                    className={`w-full p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                      isSel ? 'bg-indigo-950/60 border-indigo-400 ring-1 ring-indigo-400' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">{it.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black truncate" style={{ color: r.color }}>{it.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Мощь: ⚡{fmt(it.score)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Rune Socketing Bench & Runes Catalog (7 cols) */}
          <div className="md:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              {/* Target Item Socket Card */}
              {selectedItem ? (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1.5 bg-slate-950 rounded-lg border border-slate-800">{selectedItem.icon}</span>
                    <div>
                      <div className="font-extrabold text-xs text-slate-100">{selectedItem.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Гнезда предмета: [2 Сокета]</div>
                    </div>
                  </div>

                  {/* 2 Socket Slots */}
                  <div className="flex gap-2">
                    {[0, 1].map(idx => {
                      const runeId = insertedRunes[idx];
                      const runeDef = RUNES_CATALOG.find(r => r.id === runeId);

                      return (
                        <div
                          key={idx}
                          className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-1.5 text-xs font-mono font-extrabold text-slate-300"
                        >
                          <span>{runeDef ? runeDef.icon : '⭕'}</span>
                          <span className="text-[11px] truncate">{runeDef ? runeDef.name.split(' ')[0] : `Слот ${idx + 1} Пуст`}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs bg-slate-900 rounded-xl border border-slate-800">
                  👈 Выберите предмет из списка слева для инкрустации рун.
                </div>
              )}

              {/* Status Message */}
              <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 font-mono">
                {logMsg}
              </div>

              {/* Runes Catalog List */}
              <div className="space-y-1.5">
                <div className="text-xs font-black text-slate-300 uppercase tracking-wider">Доступные Руны ({RUNES_CATALOG.length}):</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RUNES_CATALOG.map(rn => (
                    <button
                      key={rn.id}
                      onClick={() => handleInsertRune(rn)}
                      disabled={!selectedItem}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-left transition-all disabled:opacity-40 flex items-center gap-2"
                    >
                      <span className="text-2xl p-1 bg-slate-950 rounded-lg shrink-0">{rn.icon}</span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-extrabold text-indigo-300 truncate">{rn.name}</div>
                        <div className="text-[9.5px] text-slate-400 leading-snug">{rn.bonusDesc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
