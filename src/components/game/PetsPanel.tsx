import { useState } from 'react';
import { useGame } from '@/game/store';
import { PETS, type PetDef } from '@/game/pets';

export default function PetsPanel() {
  const activePetId = useGame(s => s.activePetId);
  const setActivePet = (id: string | null) => useGame.setState({ activePetId: id });
  const [selectedPet, setSelectedPet] = useState<PetDef>(PETS[0]);

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3.5 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
              ПИТОМЦЫ И СПУТНИКИ БЕЗДНЫ
            </h3>
            <span className="text-[10px] text-slate-400">Боевые спутники с собственными ветками развития</span>
          </div>
        </div>
      </div>

      {/* Pet Selector Cards */}
      <div className="grid grid-cols-5 gap-1.5 shrink-0">
        {PETS.map(pet => {
          const isActive = activePetId === pet.id;
          const isSelected = selectedPet.id === pet.id;
          return (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet)}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all relative ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 border-2 shadow-lg scale-105'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl">{pet.icon}</span>
              <span className="text-[9px] font-extrabold truncate w-full text-center" style={{ color: pet.color }}>
                {pet.name.split(' ')[0]}
              </span>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[8px] flex items-center justify-center font-bold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Pet Info & Action */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex-1 min-h-0 overflow-y-auto space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800">{selectedPet.icon}</span>
            <div>
              <h4 className="font-black text-xs text-slate-100" style={{ color: selectedPet.color }}>{selectedPet.name}</h4>
              <span className="text-[10px] text-slate-400">{selectedPet.desc}</span>
            </div>
          </div>
          <button
            onClick={() => setActivePet(activePetId === selectedPet.id ? null : selectedPet.id)}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-[10px] uppercase tracking-wider transition-all active:scale-95 border ${
              activePetId === selectedPet.id
                ? 'bg-red-950/80 border-red-500/50 text-red-300'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-lg'
            }`}
          >
            {activePetId === selectedPet.id ? 'Отозвать' : '🐾 Призвать Спутника'}
          </button>
        </div>

        {/* Pet Skills & Stats */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Уникальные Навыки Спутника:</div>
          {selectedPet.skills.map(sk => (
            <div key={sk.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <span className="text-xl">{sk.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-amber-300">{sk.name}</div>
                <div className="text-[10px] text-slate-300">{sk.desc}</div>
              </div>
              <span className="text-[9px] font-mono text-slate-400">⏱️ {sk.cooldown}с</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
