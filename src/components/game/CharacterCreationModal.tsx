import { useState } from 'react';
import { HERO_CLASSES, type HeroClassDef } from '@/game/classes';
import { useGame } from '@/game/store';

export default function CharacterCreationModal({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState('Алерия');
  const [selectedClass, setSelectedClass] = useState<HeroClassDef>(HERO_CLASSES[0]);

  const handleStart = () => {
    if (!name.trim()) return;
    useGame.getState().initCharacter(name.trim(), selectedClass.id);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-5 shadow-2xl space-y-4 my-auto">
        {/* Title Header */}
        <div className="text-center border-b border-slate-800 pb-3 space-y-1">
          <h2 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent tracking-wider">
            ⚔️ СОЗДАНИЕ ГЕРОЯ БЕЗДНЫ
          </h2>
          <p className="text-xs text-slate-400">
            Выберите легендарный класс и введите имя вашего воина для исследования 16 регионов.
          </p>
        </div>

        {/* Character Name Input */}
        <div className="max-w-md mx-auto space-y-1">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider text-center">
            Имя Персонажа
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Введите имя героя..."
            maxLength={18}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-center text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-500 shadow-inner"
          />
        </div>

        {/* Class Selection Grid */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Выберите Класс Персонажа (10 Классов)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {HERO_CLASSES.map(cls => {
              const isSelected = selectedClass.id === cls.id;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-2 shadow-lg scale-105'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                  style={{ borderColor: isSelected ? cls.color : undefined }}
                >
                  <span className="text-2xl">{cls.icon}</span>
                  <span className="text-xs font-extrabold truncate w-full text-center" style={{ color: cls.color }}>
                    {cls.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Class Lore & Details Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 grid md:grid-cols-2 gap-4">
          {/* Left: Lore Story & Stats */}
          <div className="space-y-2.5 border-r border-slate-800/80 md:pr-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{selectedClass.icon}</span>
              <div>
                <h3 className="text-base font-black" style={{ color: selectedClass.color }}>
                  {selectedClass.title}
                </h3>
                <p className="text-[11px] text-slate-300">{selectedClass.desc}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] italic text-slate-300 leading-relaxed shadow-inner">
              📜 «{selectedClass.lore}»
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400">Стартовые Показники:</div>
              <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono">
                <div className="bg-slate-900 p-1 rounded border border-slate-800">
                  <div className="text-red-400 font-bold">STR</div>
                  <div>{selectedClass.baseStats.str}</div>
                </div>
                <div className="bg-slate-900 p-1 rounded border border-slate-800">
                  <div className="text-sky-400 font-bold">AGI</div>
                  <div>{selectedClass.baseStats.agi}</div>
                </div>
                <div className="bg-slate-900 p-1 rounded border border-slate-800">
                  <div className="text-emerald-400 font-bold">VIT</div>
                  <div>{selectedClass.baseStats.vit}</div>
                </div>
                <div className="bg-slate-900 p-1 rounded border border-slate-800">
                  <div className="text-purple-400 font-bold">INT</div>
                  <div>{selectedClass.baseStats.int}</div>
                </div>
                <div className="bg-slate-900 p-1 rounded border border-slate-800">
                  <div className="text-amber-400 font-bold">WIS</div>
                  <div>{selectedClass.baseStats.wis}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3 Talent Branches & 4 Unique Skills Preview */}
          <div className="space-y-3">
            <div>
              <div className="text-[10px] font-bold text-slate-400 mb-1">
                🌟 3 Ветки Талантов Класса:
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {selectedClass.branches.map(b => (
                  <div key={b.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-center">
                    <span className="text-base">{b.icon}</span>
                    <div className="font-extrabold truncate" style={{ color: b.color }}>{b.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 mb-1">
                ✨ 4 Уникальных Скилла Класса:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {selectedClass.skills.map(sk => (
                  <div key={sk.id} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-[10px]">
                    <span className="text-lg">{sk.icon}</span>
                    <div className="min-w-0">
                      <div className="font-bold truncate" style={{ color: sk.color }}>{sk.name}</div>
                      <div className="text-[9px] text-slate-400">{sk.manaCost} маны</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 font-extrabold text-sm text-slate-950 uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50 active:scale-98"
        >
          ⚔️ НАЧАТЬ ПРИКЛЮЧЕНИЕ В БЕЗДНЕ
        </button>
      </div>
    </div>
  );
}
