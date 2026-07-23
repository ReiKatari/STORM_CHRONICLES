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

  const [selectedPet, setSelectedPet] = useState<PetDef>(
    PETS.find(p => p.id === activePetId) || PETS[0]
  );
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const currentCustomName = petCustomNames[selectedPet.id] || '';
  const displayName = currentCustomName || selectedPet.name;

  const petNeedXp = petLvl * 120;
  const xpPct = Math.min(100, Math.floor((petXp / petNeedXp) * 100));

  // Determine Evolution Form based on Pet Level
  const evoTier = petLvl >= 30 ? 3 : petLvl >= 15 ? 2 : 1;
  const evoTitle = evoTier === 3 ? '👑 Древняя Форма' : evoTier === 2 ? '🔥 Боевой Страж' : '🐣 Спутник I';

  const totalPetTalentPoints = Math.max(0, petLvl - 1);
  const spentTalentPoints = Object.values(petTalents).reduce((a, b) => a + b, 0);
  const availablePetPoints = Math.max(0, totalPetTalentPoints - spentTalentPoints);

  const setActivePet = (id: string) => {
    useGame.setState({ activePetId: id });
  };

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
    if (current < maxRank && availablePetPoints > 0) {
      useGame.setState({
        petTalents: { ...petTalents, [talentId]: current + 1 },
      });
    }
  };

  const feedPet = () => {
    let newXp = petXp + 500;
    let newLvl = petLvl;
    let need = newLvl * 120;
    while (newXp >= need) {
      newXp -= need;
      newLvl++;
      need = newLvl * 120;
    }
    useGame.setState({ petLvl: newLvl, petXp: newXp });
  };

  const rarityNames: Record<string, string> = {
    common: 'Обычный', rare: 'Редкий', epic: 'Эпик',
    legendary: 'Легендарный', mythic: 'Мифический', divine: 'Божественный',
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-3.5 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md space-y-2.5 font-sans w-full">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 shrink-0 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl p-1 bg-amber-500/10 rounded-xl border border-amber-500/30">🐾</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xs text-slate-100 uppercase tracking-wider leading-none">
                ПИТОМЦЫ И СПУТНИКИ
              </h3>
              <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                {evoTitle}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Прокачка и бонусные характеристики боевых помощников</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={feedPet}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-[11px] shadow active:scale-95 transition-all flex items-center gap-1"
          >
            <span>🥩</span>
            <span>Кормить (+500 XP)</span>
          </button>
          <div className="text-right bg-slate-950/90 px-2.5 py-1 rounded-xl border border-slate-800">
            <div className="text-[11px] font-black text-emerald-400 font-mono">Ур. {petLvl}</div>
            <div className="text-[9px] text-slate-400 font-mono">{fmt(petXp)} / {fmt(petNeedXp)} ({xpPct}%)</div>
          </div>
        </div>
      </div>

      {/* Compact Pet Selector Cards Deck */}
      <div className="grid grid-cols-5 gap-1.5 shrink-0 w-full">
        {PETS.map(pet => {
          const isActive = activePetId === pet.id;
          const isSelected = selectedPet.id === pet.id;
          const pName = petCustomNames[pet.id] || pet.name.split(' ')[0];
          const color = pet.color;

          return (
            <button
              key={pet.id}
              onClick={() => { setSelectedPet(pet); setEditingName(false); }}
              className={`p-1.5 rounded-xl border flex flex-col items-center gap-0.5 transition-all relative ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 border-2 shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-[1.02]'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {pet.artSrc ? (
                <img src={pet.artSrc} alt={pet.name} className="w-7 h-7 rounded-lg object-cover shadow" />
              ) : (
                <span className="text-2xl drop-shadow">{pet.icon}</span>
              )}
              <span className="text-[10px] font-extrabold truncate w-full text-center leading-tight" style={{ color }}>
                {pName}
              </span>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] flex items-center justify-center font-black shadow border border-emerald-300">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Compact Selected Pet Dashboard */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 flex-1 min-h-0 overflow-y-auto space-y-2.5 shadow-inner w-full">
        {/* Selected Pet Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-12 h-12 rounded-xl border overflow-hidden flex items-center justify-center text-2xl shadow bg-slate-900 shrink-0"
              style={{ borderColor: selectedPet.color }}
            >
              {selectedPet.artSrc ? (
                <img src={selectedPet.artSrc} alt={selectedPet.name} className="w-full h-full object-cover" />
              ) : (
                selectedPet.icon
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                {editingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      placeholder={selectedPet.name}
                      className="bg-slate-900 border border-amber-500/80 rounded-lg px-2 py-0.5 text-xs text-amber-200 outline-none w-36"
                    />
                    <button onClick={saveName} className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs text-white font-bold">
                      ОК
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-black text-sm leading-tight" style={{ color: selectedPet.color }}>{displayName}</h4>
                    <button
                      onClick={() => { setNameInput(currentCustomName); setEditingName(true); }}
                      className="text-xs text-slate-400 hover:text-amber-300"
                      title="Изменить имя"
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{selectedPet.desc}</div>
            </div>
          </div>

          <div>
            {activePetId === selectedPet.id ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-extrabold text-[10.5px]">
                ✅ Активен в бою
              </span>
            ) : (
              <button
                onClick={() => setActivePet(selectedPet.id)}
                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10.5px] shadow transition-all"
              >
                ⚔️ Вызвать
              </button>
            )}
          </div>
        </div>

        {/* Hero Stat Boosts Provided by Pet */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
            <span className="text-[9px] text-slate-400 font-extrabold block">Урон Спутника</span>
            <span className="text-xs font-black text-amber-400 font-mono">+{fmt(selectedPet.baseDmg * petLvl)}</span>
          </div>
          <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
            <span className="text-[9px] text-slate-400 font-extrabold block">Атака Героя</span>
            <span className="text-xs font-black text-emerald-400 font-mono">+{fmt(selectedPet.baseDmg * petLvl * 0.4)}</span>
          </div>
          <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
            <span className="text-[9px] text-slate-400 font-extrabold block">HP Героя</span>
            <span className="text-xs font-black text-rose-400 font-mono">+{fmt(selectedPet.baseHp * petLvl)}</span>
          </div>
          <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
            <span className="text-[9px] text-slate-400 font-extrabold block">Эволюция</span>
            <span className="text-xs font-black text-purple-300 font-mono">{evoTier}/3</span>
          </div>
        </div>

        {/* Compact Side-by-side Abilities & Talents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Active Skills Card */}
          <div className="p-2 rounded-xl border border-slate-800 bg-slate-900/70 space-y-1.5">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <span>✨</span> Навыки Спутника
            </span>
            {selectedPet.skills.map(sk => (
              <div key={sk.id} className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span>{sk.icon}</span>
                  <span className="font-bold text-slate-200 text-[10.5px]">{sk.name}</span>
                </div>
                <span className="text-[9px] font-mono text-purple-300 bg-purple-950 px-1.5 py-0.2 rounded border border-purple-800">
                  {sk.cooldown}s CD
                </span>
              </div>
            ))}
          </div>

          {/* Pet Talents Card */}
          <div className="p-2 rounded-xl border border-slate-800 bg-slate-900/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <span>🌟</span> Таланты ({availablePetPoints} очк.)
              </span>
            </div>
            {selectedPet.branches.map(b => (
              <div key={b.id} className="space-y-1">
                {b.talents.map(t => {
                  const rank = petTalents[t.id] ?? 0;
                  const canLearn = availablePetPoints > 0 && rank < t.maxRank;
                  return (
                    <div key={t.id} className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between gap-1 text-[10px]">
                      <div className="flex items-center gap-1 truncate">
                        <span>{t.icon}</span>
                        <span className="font-bold text-slate-200 truncate">{t.name}</span>
                        <span className="text-emerald-400 font-mono">({t.per(rank || 1)})</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="font-mono text-purple-300 font-bold">{rank}/{t.maxRank}</span>
                        {canLearn && (
                          <button
                            onClick={() => learnPetTalent(t.id, t.maxRank)}
                            className="px-1.5 py-0.2 bg-purple-600 hover:bg-purple-500 rounded text-white font-black text-[9px]"
                          >
                            +1
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
