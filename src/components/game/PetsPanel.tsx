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
  const evoTitle = evoTier === 3 ? '👑 Древняя Астральная Форма' : evoTier === 2 ? '🔥 Элитный Боевой Страж' : '🐣 Младший Боевой Спутник';

  // Pet Talent points pool = (petLvl - 1) - (spent talent points)
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

    useGame.setState({
      petLvl: newLvl,
      petXp: newXp,
    });
  };

  const rarityColors: Record<string, string> = {
    common: '#94a3b8',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
    mythic: '#ef4444',
    divine: '#38bdf8',
  };

  const rarityNames: Record<string, string> = {
    common: 'Обычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный',
    mythic: 'Мифический',
    divine: 'Божественный',
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-4 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md space-y-3.5 font-sans w-full">
      {/* Premium Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-3xl shadow-[0_0_18px_rgba(245,158,11,0.35)] shrink-0">
            🐾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-slate-100 uppercase tracking-wider leading-tight">
                ПИТОМЦЫ И СПУТНИКИ
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                {evoTitle}
              </span>
            </div>
            <span className="text-xs text-slate-400">Боевые помощники, прокачка характеристик и астральные навыки</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={feedPet}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-[0_0_12px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>🥩</span>
            <span>Кормить (+500 XP)</span>
          </button>

          <div className="text-right bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
            <div className="text-xs font-black text-emerald-400 font-mono">Уровень {petLvl}</div>
            <div className="text-[10px] text-slate-400 font-mono">{fmt(petXp)} / {fmt(petNeedXp)} XP ({xpPct}%)</div>
          </div>
        </div>
      </div>

      {/* Companion Deck Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 shrink-0 w-full">
        {PETS.map(pet => {
          const isActive = activePetId === pet.id;
          const isSelected = selectedPet.id === pet.id;
          const pName = petCustomNames[pet.id] || pet.name.split(' ')[0];
          const color = pet.color;

          return (
            <button
              key={pet.id}
              onClick={() => { setSelectedPet(pet); setEditingName(false); }}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all relative ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-400 border-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.03]'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-3xl drop-shadow">{pet.icon}</span>
              <span className="text-xs font-black truncate w-full text-center" style={{ color }}>
                {pName}
              </span>
              <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-slate-900 border text-slate-400 font-bold" style={{ borderColor: `${color}40` }}>
                {rarityNames[pet.rarity]}
              </span>

              {isActive && (
                <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-black shadow-md border border-emerald-300 animate-pulse">
                  ✓ Активен
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Pet Detailed Dashboard */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex-1 min-h-0 overflow-y-auto space-y-4 shadow-inner w-full">
        {/* Header Card with Custom Name Editor & Active Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3.5">
            <div
              className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-4xl shadow-2xl bg-slate-900 shrink-0"
              style={{ borderColor: selectedPet.color, boxShadow: `0 0 25px ${selectedPet.color}40` }}
            >
              {selectedPet.icon}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                {editingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      placeholder={selectedPet.name}
                      className="bg-slate-900 border border-amber-500/80 rounded-xl px-3 py-1 text-xs text-amber-200 outline-none w-48 shadow-inner"
                    />
                    <button onClick={saveName} className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs text-white font-bold shadow">
                      Сохранить
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-black text-lg leading-tight" style={{ color: selectedPet.color }}>{displayName}</h4>
                    <button
                      onClick={() => { setNameInput(currentCustomName); setEditingName(true); }}
                      className="text-xs text-slate-400 hover:text-amber-300 transition-colors"
                      title="Изменить имя"
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border text-slate-300 font-mono" style={{ borderColor: selectedPet.color }}>
                  {selectedPet.type.toUpperCase()} · {rarityNames[selectedPet.rarity]}
                </span>
                <span className="text-xs text-slate-400">{selectedPet.desc}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activePetId === selectedPet.id ? (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                ✅ Спутник в Бою
              </div>
            ) : (
              <button
                onClick={() => setActivePet(selectedPet.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg active:scale-95 transition-all"
              >
                ⚔️ Вызвать в Бой
              </button>
            )}
          </div>
        </div>

        {/* Hero Stat Boosts Provided by Pet */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col items-center">
            <span className="text-xs text-slate-400 font-extrabold">Урон Спутника</span>
            <span className="text-sm font-black text-amber-400 font-mono mt-0.5">+{fmt(selectedPet.baseDmg * petLvl)}</span>
          </div>
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col items-center">
            <span className="text-xs text-slate-400 font-extrabold">Бонус к Атаке Героя</span>
            <span className="text-sm font-black text-emerald-400 font-mono mt-0.5">+{fmt(selectedPet.baseDmg * petLvl * 0.4)} DMG</span>
          </div>
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col items-center">
            <span className="text-xs text-slate-400 font-extrabold">Бонус к Здоровью</span>
            <span className="text-sm font-black text-rose-400 font-mono mt-0.5">+{fmt(selectedPet.baseHp * petLvl)} HP</span>
          </div>
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col items-center">
            <span className="text-xs text-slate-400 font-extrabold">Форма Эволюции</span>
            <span className="text-sm font-black text-purple-300 font-mono mt-0.5">{evoTier}/3 Уровень</span>
          </div>
        </div>

        {/* Pet Active Skills */}
        <div className="space-y-2">
          <h5 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>✨</span> Active Abilities & Spells ({selectedPet.skills.length})
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {selectedPet.skills.map(sk => (
              <div key={sk.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/80 flex items-start gap-3 shadow">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl shrink-0">
                  {sk.icon}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-100">{sk.name}</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      Перезарядка {sk.cooldown}с
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">{sk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pet Talent Tree */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>🌟</span> Древо Талантов Спутника
            </h5>
            <div className={`px-3 py-1 rounded-xl border font-mono text-xs font-black ${
              availablePetPoints > 0
                ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              Доступно очков: {availablePetPoints}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedPet.branches.map(b => (
              <div key={b.id} className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3 shadow">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <h6 className="font-extrabold text-xs" style={{ color: b.color }}>{b.name}</h6>
                    <p className="text-[10.5px] text-slate-400">{b.desc}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {b.talents.map(t => {
                    const rank = petTalents[t.id] ?? 0;
                    const canLearn = availablePetPoints > 0 && rank < t.maxRank;
                    const isMax = rank >= t.maxRank;

                    return (
                      <div
                        key={t.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                          isMax
                            ? 'border-amber-500/60 bg-amber-950/20'
                            : rank > 0
                            ? 'border-purple-500/40 bg-slate-950'
                            : 'border-slate-800 bg-slate-950/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-xl shrink-0">{t.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-slate-200 truncate">{t.name}</span>
                              <span className="text-[10px] font-mono text-purple-300 font-bold shrink-0">
                                {rank}/{t.maxRank}
                              </span>
                            </div>
                            <div className="text-[10.5px] text-emerald-400 font-bold mt-0.5">{t.per(rank || 1)}</div>
                          </div>
                        </div>

                        {canLearn && (
                          <button
                            onClick={() => learnPetTalent(t.id, t.maxRank)}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-black text-white shrink-0 shadow active:scale-95"
                          >
                            +1
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
