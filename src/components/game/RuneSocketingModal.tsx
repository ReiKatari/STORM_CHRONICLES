import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import { rarityById } from '@/game/items';
import type { Item, RarityId } from '@/game/types';
import { sound } from '@/game/sound';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export interface RuneDef {
  id: string;
  name: string;
  icon: string;
  tier: 'lesser' | 'greater' | 'ancient';
  rarity: RarityId;
  bonusDesc: string;
  stat: 'dmg' | 'armor' | 'crit' | 'hp' | 'mana' | 'speed' | 'vampire';
  value: number;
}

export interface RuneWordDef {
  id: string;
  name: string;
  icon: string;
  runes: string[];
  effectDesc: string;
  bonusDmgPct?: number;
  bonusArmorPct?: number;
  bonusCritPct?: number;
  bonusHp?: number;
  bonusVampirePct?: number;
}

export const ANCIENT_RUNES: RuneDef[] = [
  // Tier 1: Lesser Runes
  { id: 'r_feoh', name: 'Руна Пламени (Feoh)', icon: '🔥', tier: 'lesser', rarity: 'uncommon', bonusDesc: '+12% к Урону Огнем', stat: 'dmg', value: 12 },
  { id: 'r_thurisaz', name: 'Руна Стали (Thurisaz)', icon: '🛡️', tier: 'lesser', rarity: 'uncommon', bonusDesc: '+15% к Броне', stat: 'armor', value: 15 },
  { id: 'r_ur', name: 'Руна Земли (Ur)', icon: '🗿', tier: 'lesser', rarity: 'uncommon', bonusDesc: '+350 к Максимальному Здоровью', stat: 'hp', value: 350 },
  { id: 'r_ansuz', name: 'Руна Молнии (Ansuz)', icon: '⚡', tier: 'lesser', rarity: 'rare', bonusDesc: '+8% к Шансу Критического Удара', stat: 'crit', value: 8 },

  // Tier 2: Greater Runes
  { id: 'r_raidho', name: 'Руна Шторма (Raidho)', icon: '🌪️', tier: 'greater', rarity: 'rare', bonusDesc: '+18% к Скорости Атаки', stat: 'speed', value: 18 },
  { id: 'r_kenaz', name: 'Руна Факела (Kenaz)', icon: '🏮', tier: 'greater', rarity: 'rare', bonusDesc: '+22% к Физическому Урону', stat: 'dmg', value: 22 },
  { id: 'r_gebo', name: 'Руна Гармонии (Gebo)', icon: '⚖️', tier: 'greater', rarity: 'epic', bonusDesc: '+200 к Мане и +10 к Регенерации в секунду', stat: 'mana', value: 200 },
  { id: 'r_hagalaz', name: 'Руна Крови (Hagalaz)', icon: '🩸', tier: 'greater', rarity: 'epic', bonusDesc: '+10% к Вампиризму от Урона', stat: 'vampire', value: 10 },

  // Tier 3: Ancient Runes
  { id: 'r_sowilo', name: 'Руна Солнца (Sowilo)', icon: '☀️', tier: 'ancient', rarity: 'epic', bonusDesc: '+30% к Критическому Урону', stat: 'crit', value: 30 },
  { id: 'r_tiwaz', name: 'Руна Победы (Tiwaz)', icon: '⚔️', tier: 'ancient', rarity: 'legendary', bonusDesc: '+35% к Общему Урону', stat: 'dmg', value: 35 },
  { id: 'r_algiz', name: 'Руна Стража (Algiz)', icon: '🏰', tier: 'ancient', rarity: 'legendary', bonusDesc: '+35% к Броне и +800 к Здоровью', stat: 'armor', value: 35 },
  { id: 'r_othala', name: 'Руна Вечности (Othala)', icon: '👑', tier: 'ancient', rarity: 'mythic', bonusDesc: '+25% ко всем Характеристикам', stat: 'dmg', value: 25 },
];

export const RUNE_WORDS: RuneWordDef[] = [
  {
    id: 'rw_sunburst',
    name: '«Солнечный Шквал» (Sunburst)',
    icon: '☀️',
    runes: ['r_feoh', 'r_ansuz'],
    effectDesc: '+35% к Урону и поджигает врагов священным пламенем.',
    bonusDmgPct: 35,
    bonusCritPct: 12,
  },
  {
    id: 'rw_titan_bastion',
    name: '«Бастион Титана» (Titan Bastion)',
    icon: '🏰',
    runes: ['r_thurisaz', 'r_ur'],
    effectDesc: '+40% к Броне и +600 к Здоровью.',
    bonusArmorPct: 40,
    bonusHp: 600,
  },
  {
    id: 'rw_blood_harvest',
    name: '«Жатва Крови» (Blood Harvest)',
    icon: '🩸',
    runes: ['r_hagalaz', 'r_tiwaz'],
    effectDesc: '+18% к Вампиризму и казнь монстров с низким уровнем здоровья.',
    bonusVampirePct: 18,
    bonusDmgPct: 20,
  },
  {
    id: 'rw_storm_blade',
    name: '«Штормовой Клинок» (Storm Blade)',
    icon: '⚡',
    runes: ['r_raidho', 'r_ansuz'],
    effectDesc: '+25% к Скорости Атаки и цепные разряды молний.',
    bonusCritPct: 15,
  },
  {
    id: 'rw_solar_wrath',
    name: '«Гнев Солнечного Владыки» (Solar Wrath)',
    icon: '🔥',
    runes: ['r_feoh', 'r_kenaz', 'r_sowilo'],
    effectDesc: '+60% к Огненному урону и 100% критический удар по горящим целям.',
    bonusDmgPct: 60,
    bonusCritPct: 25,
  },
  {
    id: 'rw_immortal_aegis',
    name: '«Бессмертный Эгис» (Immortal Aegis)',
    icon: '🛡️',
    runes: ['r_thurisaz', 'r_ur', 'r_algiz'],
    effectDesc: '+50% к Броне, +1500 к Здоровью и поглощающий барьер 25% от Здоровья.',
    bonusArmorPct: 50,
    bonusHp: 1500,
  },
  {
    id: 'rw_eternity_creator',
    name: '«Аудиенция Творца» (Creator Apex)',
    icon: '👑',
    runes: ['r_tiwaz', 'r_algiz', 'r_othala'],
    effectDesc: 'Все характеристики увеличены на +50%, двойной урон заклинаний и умений!',
    bonusDmgPct: 50,
    bonusArmorPct: 50,
    bonusHp: 2000,
  },
];

export default function RuneSocketingModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const [tab, setTab] = useState<'sockets' | 'synthesis' | 'catalog'>('sockets');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // Persistent Runes in inventory
  const [playerRunes, setPlayerRunes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('storm_player_runes');
    return saved ? JSON.parse(saved) : {
      r_feoh: 3,
      r_thurisaz: 2,
      r_ur: 4,
      r_ansuz: 2,
      r_raidho: 1,
      r_kenaz: 1,
    };
  });

  // Inserted Runes by Item ID
  const [itemSocketMap, setItemSocketMap] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('storm_item_sockets');
    return saved ? JSON.parse(saved) : {};
  });

  const [logMsg, setLogMsg] = useState<string>('🔮 Выберите предмет из экипировки или инвентаря для инкрустации Астральных Рун!');

  const equipment = useGame(s => s.equipment);
  const inventory = useGame(s => s.inventory);
  const allGear = [
    ...Object.values(equipment).filter(Boolean) as Item[],
    ...inventory.filter(i => i.slot !== ('consumable' as any))
  ];

  // Persistence
  useEffect(() => {
    localStorage.setItem('storm_player_runes', JSON.stringify(playerRunes));
  }, [playerRunes]);

  useEffect(() => {
    localStorage.setItem('storm_item_sockets', JSON.stringify(itemSocketMap));
  }, [itemSocketMap]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelectGear = (item: Item) => {
    setSelectedItem(item);
    const existingRunes = itemSocketMap[item.id] || [];
    const activeWord = findActiveRuneWord(existingRunes);
    if (activeWord) {
      setLogMsg(`Выбран ${item.name}. АКТИВНО РУНИЧЕСКОЕ СЛОВО: ${activeWord.name}!`);
    } else {
      setLogMsg(`Выбран предмет: ${item.name}. Инкрустировано рун: ${existingRunes.length}/3`);
    }
  };

  const findActiveRuneWord = (runes: string[]): RuneWordDef | null => {
    if (!runes || runes.length < 2) return null;
    return RUNE_WORDS.find(rw => {
      if (rw.runes.length !== runes.length) return false;
      const sortedA = [...rw.runes].sort();
      const sortedB = [...runes].sort();
      return sortedA.every((r, idx) => r === sortedB[idx]);
    }) || null;
  };

  const handleInsertRune = (rune: RuneDef) => {
    if (!selectedItem) {
      setLogMsg('⚠️ Сначала выберите предмет для инкрустации!');
      return;
    }

    const currentInserted = itemSocketMap[selectedItem.id] || [];
    if (currentInserted.length >= 3) {
      setLogMsg('⚠️ Все 3 рунических гнезда на данном предмете уже заполнены!');
      return;
    }

    const availableCount = playerRunes[rune.id] || 0;
    if (availableCount <= 0) {
      setLogMsg(`⚠️ У вас нет руны ${rune.name} в запасе!`);
      return;
    }

    sound.playEquip();

    // Deduct rune from player inventory
    setPlayerRunes(prev => ({
      ...prev,
      [rune.id]: Math.max(0, (prev[rune.id] || 1) - 1),
    }));

    // Add rune to item
    const nextRunes = [...currentInserted, rune.id];
    setItemSocketMap(prev => ({
      ...prev,
      [selectedItem.id]: nextRunes,
    }));

    const word = findActiveRuneWord(nextRunes);
    if (word) {
      sound.playLevelUp();
      setLogMsg(`🎉 АКТИВИРОВАНО РУНИЧЕСКОЕ СЛОВО: ${word.name}! ${word.effectDesc}`);
    } else {
      setLogMsg(`🔮 Вставлена ${rune.name}: ${rune.bonusDesc}`);
    }
  };

  const handleExtractRunes = () => {
    if (!selectedItem) return;
    const currentInserted = itemSocketMap[selectedItem.id] || [];
    if (currentInserted.length === 0) {
      setLogMsg('ℹ️ В этом предмете нет инкрустированных рун.');
      return;
    }

    sound.playHoly();

    // Return all runes back to player inventory
    setPlayerRunes(prev => {
      const next = { ...prev };
      currentInserted.forEach(rId => {
        next[rId] = (next[rId] || 0) + 1;
      });
      return next;
    });

    // Clear sockets
    setItemSocketMap(prev => {
      const next = { ...prev };
      delete next[selectedItem.id];
      return next;
    });

    setLogMsg(`✨ Все ${currentInserted.length} рун безопасно извлечены обратно в ваш рунический мешочек!`);
  };

  // 3-in-1 Rune Synthesis Handler
  const handleSynthesizeRune = (targetRune: RuneDef) => {
    // Find previous tier runes needed
    const index = ANCIENT_RUNES.findIndex(r => r.id === targetRune.id);
    if (index === 0) {
      setLogMsg('ℹ️ Это базовая малая руна — её можно выбивать в боях и сундуках!');
      return;
    }

    const sourceRune = ANCIENT_RUNES[index - 1];
    const sourceCount = playerRunes[sourceRune.id] || 0;

    if (sourceCount < 3) {
      setLogMsg(`⚠️ Для создания 1x ${targetRune.name} требуется 3x ${sourceRune.name} (у вас: ${sourceCount}/3)!`);
      return;
    }

    sound.playSpell();

    setPlayerRunes(prev => ({
      ...prev,
      [sourceRune.id]: prev[sourceRune.id] - 3,
      [targetRune.id]: (prev[targetRune.id] || 0) + 1,
    }));

    setLogMsg(`⚗️ СИНТЕЗ УСПЕШЕН! Создана 1x ${targetRune.name} из 3x ${sourceRune.name}!`);
  };

  const currentItemRunes = selectedItem ? itemSocketMap[selectedItem.id] || [] : [];
  const currentItemRuneWord = selectedItem ? findActiveRuneWord(currentItemRunes) : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans animate-fadeIn">
      <div className="bg-slate-900/95 border border-indigo-500/40 rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl space-y-4 relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-slate-900 border border-indigo-500/50 flex items-center justify-center text-2xl shadow-lg">
              🔮
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Астральные Руны & Рунические Слова</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Инкрустация гнёзд, алхимический синтез 3-в-1 и синергии Рунических Слов
              </span>
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
            onClick={() => setTab('sockets')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'sockets'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>💎</span>
            <span>Инкрустация Сокетов</span>
          </button>

          <button
            onClick={() => setTab('synthesis')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'synthesis'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>⚗️</span>
            <span>Алхимический Синтез (3 в 1)</span>
          </button>

          <button
            onClick={() => setTab('catalog')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'catalog'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>📜</span>
            <span>Каталог Рунических Слов ({RUNE_WORDS.length})</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          
          {/* TAB 1: SOCKETS & INSERTION */}
          {tab === 'sockets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Left Column: Gear Selection & Socket Anvil */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="font-black text-xs text-indigo-300 uppercase tracking-wider flex items-center justify-between">
                  <span>1. Выберите Предмет для Рун</span>
                  <span className="text-[10px] text-slate-400 font-mono">Всего предметов: {allGear.length}</span>
                </div>

                {/* Gear Items List */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {allGear.map(item => {
                    const r = rarityById(item.rarity);
                    const isSelected = selectedItem?.id === item.id;
                    const inserted = itemSocketMap[item.id] || [];
                    const activeRw = findActiveRuneWord(inserted);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectGear(item)}
                        className={`w-full p-2 rounded-xl border flex items-center justify-between gap-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/80 border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.4)] ring-1 ring-indigo-400'
                            : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0">
                            {item.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-black truncate" style={{ color: r.color }}>{item.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Сокетов: <b className="text-indigo-300">{inserted.length}/3</b> {activeRw && `· ☀️ ${activeRw.name}`}
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

                {/* Target Item Sockets Preview Box */}
                {selectedItem && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/40 space-y-2.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                        <span>{selectedItem.icon}</span>
                        <span>{selectedItem.name}</span>
                      </div>
                      {currentItemRunes.length > 0 && (
                        <button
                          onClick={handleExtractRunes}
                          className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 border border-slate-700 transition-all active:scale-95 cursor-pointer"
                        >
                          Извлечь руны
                        </button>
                      )}
                    </div>

                    {/* 3 Socket Slots */}
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map(idx => {
                        const runeId = currentItemRunes[idx];
                        const runeDef = runeId ? ANCIENT_RUNES.find(r => r.id === runeId) : null;

                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                              runeDef
                                ? 'bg-indigo-950/60 border-indigo-400/80 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                                : 'bg-slate-900 border-dashed border-slate-800 text-slate-600'
                            }`}
                          >
                            <span className="text-2xl">{runeDef ? runeDef.icon : '⭕'}</span>
                            <span className="text-[10px] font-black leading-tight truncate w-full" style={{ color: runeDef ? '#c7d2fe' : '#64748b' }}>
                              {runeDef ? runeDef.name.split(' ')[0] : `Гнездо ${idx + 1}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Active Rune Word Badge */}
                    {currentItemRuneWord && (
                      <div className="p-2.5 bg-gradient-to-r from-amber-950/80 to-indigo-950/80 border border-amber-500/60 rounded-xl space-y-1 animate-fadeIn shadow-lg">
                        <div className="font-black text-xs text-amber-300 flex items-center gap-1.5">
                          <span>{currentItemRuneWord.icon}</span>
                          <span>{currentItemRuneWord.name}</span>
                        </div>
                        <div className="text-[10px] text-amber-100 leading-snug">{currentItemRuneWord.effectDesc}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Runes Storage & Insertion */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="font-black text-xs text-indigo-300 uppercase tracking-wider flex items-center justify-between">
                  <span>2. Ваши Древние Руны (Клик для вставки)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                  {ANCIENT_RUNES.map(r => {
                    const count = playerRunes[r.id] || 0;
                    const rar = rarityById(r.rarity);

                    return (
                      <button
                        key={r.id}
                        onClick={() => handleInsertRune(r)}
                        disabled={count <= 0 || !selectedItem}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-left transition-all cursor-pointer ${
                          count > 0 && selectedItem
                            ? 'bg-slate-950/80 hover:bg-indigo-950/60 hover:border-indigo-400 hover:scale-[1.02] shadow'
                            : 'bg-slate-950/40 opacity-40 border-slate-800 cursor-not-allowed'
                        }`}
                        style={{ borderColor: count > 0 ? rar.color : undefined }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0">{r.icon}</span>
                          <div className="min-w-0">
                            <div className="text-xs font-black truncate" style={{ color: rar.color }}>{r.name}</div>
                            <div className="text-[9px] text-slate-300 leading-none mt-0.5 truncate">{r.bonusDesc}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-black text-indigo-300 bg-slate-900 px-2 py-1 rounded-lg shrink-0">
                          x{count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALCHEMICAL SYNTHESIS (3 IN 1) */}
          {tab === 'synthesis' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/40 text-xs text-indigo-200">
                <div className="font-extrabold text-xs text-indigo-300">⚗️ Алхимический Синтезатор Древних Рун</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Объединяйте 3 одинаковые руны предыдущего ранга, чтобы сковать 1 редкую руну следующего тира!
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ANCIENT_RUNES.slice(1).map(targetRune => {
                  const index = ANCIENT_RUNES.findIndex(r => r.id === targetRune.id);
                  const sourceRune = ANCIENT_RUNES[index - 1];
                  const sourceCount = playerRunes[sourceRune.id] || 0;
                  const canCraft = sourceCount >= 3;
                  const rar = rarityById(targetRune.rarity);

                  return (
                    <div
                      key={targetRune.id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between space-y-2.5 shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1.5 bg-slate-950 rounded-xl border border-slate-800">{targetRune.icon}</span>
                          <div>
                            <div className="font-black text-xs" style={{ color: rar.color }}>{targetRune.name}</div>
                            <div className="text-[10px] text-slate-300">{targetRune.bonusDesc}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          У вас: <b className="text-indigo-300">{playerRunes[targetRune.id] || 0}</b>
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono">
                        <span>Требуется: 3x {sourceRune.name}</span>
                        <span className={canCraft ? 'text-emerald-400 font-black' : 'text-rose-400'}>
                          ({sourceCount}/3)
                        </span>
                      </div>

                      <button
                        onClick={() => handleSynthesizeRune(targetRune)}
                        disabled={!canCraft}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-extrabold text-xs border border-indigo-400/50 shadow transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>⚗️ Сковать 1x {targetRune.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RUNE WORDS CATALOG */}
          {tab === 'catalog' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/40 text-xs text-indigo-200">
                <div className="font-extrabold text-xs text-indigo-300">📜 Каталог Легендарных Рунических Слов</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Вставляйте точные комбинации рун в предмет для пробуждения скрытой древней магии!
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RUNE_WORDS.map(rw => {
                  return (
                    <div
                      key={rw.id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-900 space-y-2 shadow"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl p-1.5 bg-slate-950 rounded-xl border border-slate-800">{rw.icon}</span>
                        <div>
                          <div className="font-black text-xs text-amber-300">{rw.name}</div>
                          <div className="text-[10px] text-indigo-200 font-mono mt-0.5">
                            Комбинация: {rw.runes.map(rId => ANCIENT_RUNES.find(r => r.id === rId)?.name.split(' ')[0]).join(' + ')}
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                        {rw.effectDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status Message Log Box */}
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xl text-xs text-indigo-200 font-mono shadow">
            {logMsg}
          </div>
        </div>
      </div>
    </div>
  );
}
