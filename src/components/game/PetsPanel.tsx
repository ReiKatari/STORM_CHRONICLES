import { useState } from 'react';
import { useGame } from '@/game/store';
import { PETS, type PetDef } from '@/game/pets';
import { fmt } from '@/game/engine';

export default function PetsPanel() {
  const activePetId = useGame(s => s.activePetId);
  const petLvl = useGame(s => s.petLvl ?? 1);
  const petXp = useGame(s => s.petXp ?? 0);
  const petCustomNames = useGame(s => s.petCustomNames ?? {});
  const petTalents = useGame(s => s.petTalents ?? {});

  const setActivePet = (id: string | null) => useGame.setState({ activePetId: id });
  const [selectedPet, setSelectedPet] = useState<PetDef>(PETS[0]);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const currentCustomName = petCustomNames[selectedPet.id] || '';
  const displayName = currentCustomName || selectedPet.name;

  const petNeedXp = petLvl * 120;
  const xpPct = Math.min(100, Math.floor((petXp / petNeedXp) * 100));

  // Determine Evolution Form based on Pet Level
  const evoTier = petLvl >= 30 ? 3 : petLvl >= 15 ? 2 : 1;
  const evoTitle = evoTier === 3 ? '👑 Древняя Астральная Форма' : evoTier === 2 ? '🔥 Элитный Дракон-Разрушитель' : '🐣 Младший Боевой Спутник';

  const saveName = () => {
    if (nameInput.trim()) {
      useGame.setState({
        petCustomNames: { ...petCustomNames, [selectedPet.id]: nameInput.trim() },
      });
    }
    setEditingName(false);
  };

  const learnPetTalent = (talentId: string, maxRank: number) => {
    const current = petTalents[talentId] ?? 0;
    if (current < maxRank) {
      useGame.setState({
        petTalents: { ...petTalents, [talentId]: current + 1 },
      });
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-3.5 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md space-y-3 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
              ПИТОМЦЫ И ЭВОЛЮЦИЯ СПУТНИКОВ
            </h3>
            <span className="text-[10px] text-slate-400">Прокачка, переименование и ветки эволюции форм</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-emerald-400">Ур. {petLvl} Спутника</div>
          <div className="text-[9px] text-slate-400 font-mono">{fmt(petXp)} / {fmt(petNeedXp)} XP</div>
        </div>
      </div>

      {/* Pet Selector Cards */}
      <div className="grid grid-cols-5 gap-1.5 shrink-0">
        {PETS.map(pet => {
          const isActive = activePetId === pet.id;
          const isSelected = selectedPet.id === pet.id;
          const pName = petCustomNames[pet.id] || pet.name.split(' ')[0];
          return (
            <button
              key={pet.id}
              onClick={() => { setSelectedPet(pet); setEditingName(false); }}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all relative ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 border-2 shadow-lg scale-105'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl">{pet.icon}</span>
              <span className="text-[9px] font-extrabold truncate w-full text-center" style={{ color: pet.color }}>
                {pName}
              </span>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-black shadow-md">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Pet Details & Actions */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex-1 min-h-0 overflow-y-auto space-y-3">
        {/* Top Info & Rename */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2.5 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">{selectedPet.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                {editingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      placeholder={selectedPet.name}
                      className="bg-slate-900 border border-amber-500/60 rounded px-2 py-0.5 text-xs text-amber-200 outline-none w-36"
                    />
                    <button onClick={saveName} className="px-2 py-0.5 bg-emerald-600 rounded text-[10px] text-white font-bold">ОК</button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-black text-sm" style={{ color: selectedPet.color }}>{displayName}</h4>
                    <button
                      onClick={() => { setNameInput(currentCustomName); setEditingName(true); }}
                      className="text-[10px] text-slate-400 hover:text-amber-300"
                      title="Переименовать питомца"
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
              <span className="text-[10px] text-amber-300 font-bold block">{evoTitle} (Форма {evoTier}/3)</span>
              <span className="text-[10px] text-slate-400 block">{selectedPet.desc}</span>
            </div>
          </div>

          <button
            onClick={() => setActivePet(activePetId === selectedPet.id ? null : selectedPet.id)}
            className={`px-3.5 py-2 rounded-xl font-extrabold text-[10px] uppercase tracking-wider transition-all active:scale-95 border shadow-lg ${
              activePetId === selectedPet.id
                ? 'bg-red-950/90 border-red-500/60 text-red-300'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white'
            }`}
          >
            {activePetId === selectedPet.id ? 'Отозвать' : '🐾 Призвать Спутника'}
          </button>
        </div>

        {/* Pet XP Bar */}
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex justify-between text-[10px] font-extrabold text-slate-300">
            <span>Прогресс Уровня Спутника (Ур. {petLvl})</span>
            <span className="font-mono text-emerald-400">{xpPct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        {/* Pet Evolution Branches & Talent Tree */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ветки Развития и Таланты:</div>
          <div className="grid grid-cols-2 gap-2">
            {selectedPet.branches.map(branch => (
              <div key={branch.id} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <span className="text-lg">{branch.icon}</span>
                  <div>
                    <div className="font-extrabold text-xs" style={{ color: branch.color }}>{branch.name}</div>
                    <div className="text-[9px] text-slate-400">{branch.desc}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {branch.talents.map(t => {
                    const rank = petTalents[t.id] ?? 0;
                    return (
                      <div key={t.id} className="flex items-center justify-between bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span>{t.icon}</span>
                          <div>
                            <div className="font-bold text-slate-200">{t.name}</div>
                            <div className="text-[9px] text-emerald-400">{t.per(rank)}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => learnPetTalent(t.id, t.maxRank)}
                          disabled={rank >= t.maxRank}
                          className="px-2 py-0.5 rounded bg-amber-600/80 hover:bg-amber-500 disabled:bg-slate-800 text-white font-bold text-[9px]"
                        >
                          {rank}/{t.maxRank}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Companion Skills */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Навыки Спутника:</div>
          {selectedPet.skills.map(sk => (
            <div key={sk.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-slate-950 rounded-lg">{sk.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-amber-300">{sk.name}</div>
                <div className="text-[10px] text-slate-300">{sk.desc}</div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded">⏱️ {sk.cooldown}с</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
