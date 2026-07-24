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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-5 shadow-2xl space-y-4 my-auto">
        {/* Title Header */}
        <div className="text-center border-b border-slate-800 pb-3 space-y-1">
          <h2 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent tracking-wider">
            ⚔️ СОЗДАНИЕ ГЕРОЯ БЕЗДНЫ
          </h2>
          <p className="text-xs text-slate-400">
            Выберите уникальный класс с настраиваемыми талантами, историями и анимациями боя.
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
            Выберите Класс Персонажа (10 Героев)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {HERO_CLASSES.map(cls => {
              const isSelected = selectedClass.id === cls.id;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-800 border-2 shadow-2xl scale-105 ring-2 ring-amber-400/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                  style={{ borderColor: isSelected ? cls.color : undefined }}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-900 flex items-center justify-center relative shadow-md">
                    {cls.artSrc ? (
                      <img src={cls.artSrc} alt={cls.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <span className="text-2xl">{cls.icon}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-extrabold truncate w-full text-center" style={{ color: cls.color }}>
                    {cls.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Class Lore & Details Card with Generated Artwork */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 grid md:grid-cols-12 gap-4 items-center">
          {/* Left: High-Res Hero Art Card */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <div
              className="w-36 h-36 rounded-2xl border-2 overflow-hidden bg-slate-900 shadow-2xl relative"
              style={{ borderColor: selectedClass.color, boxShadow: `0 0 35px ${selectedClass.color}44` }}
            >
              {selectedClass.artSrc ? (
                <img src={selectedClass.artSrc} alt={selectedClass.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">{selectedClass.icon}</div>
              )}
            </div>
            <span className="text-xs font-bold mt-2" style={{ color: selectedClass.color }}>
              {selectedClass.icon} {selectedClass.name}
            </span>
          </div>

          {/* Right: Lore Story & Stats */}
          <div className="md:col-span-8 space-y-2.5">
            <div>
              <h3 className="text-base font-black" style={{ color: selectedClass.color }}>
                {selectedClass.title}
              </h3>
              <p className="text-[11px] text-slate-300">{selectedClass.desc}</p>
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
                  <div className="text-amber-400 font-bold">END</div>
                  <div>{selectedClass.baseStats.end}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Game Action */}
        <div className="pt-2">
          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl rpg-button-gold font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl"
          >
            <span>⚔️</span>
            <span>Начать Наследие («{name}» — {selectedClass.name})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
