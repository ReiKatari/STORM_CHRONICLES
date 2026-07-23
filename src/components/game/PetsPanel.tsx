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
  const evoTitle = evoTier === 3 ? '👑 Древняя Астральная Форма' : evoTier === 2 ? '🔥 Элитный Боевой Страж' : '🐣 Младший Боевой Спутник';

  // Pet Talent points pool = (petLvl - 1) - (spent talent points)
  const totalPetTalentPoints = Math.max(0, petLvl - 1);
  const spentTalentPoints = Object.values(petTalents).reduce((a, b) => a + b, 0);
  const availablePetPoints = Math.max(0, totalPetTalentPoints - spentTalentPoints);

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

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-700/60 p-4 flex flex-col h-full min-h-0 shadow-2xl backdrop-blur-md space-y-3 font-sans">
      {/* Premium Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 shrink-0 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            🐾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-slate-100 uppercase tracking-wider leading-tight">
                ПИТОМЦЫ И СПУТНИКИ
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                Эволюция {evoTier}/3
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Прокачка, уникальные таланты и эволюционные ветки</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="text-xs font-black text-emerald-400 font-mono">Ур. {petLvl} Спутника</div>
            <div className="text-[9px] text-slate-400 font-mono">{fmt(petXp)} / {fmt(petNeedXp)} XP</div>
          </div>
        </div>
      </div>

      {/* Pet Selector Cards Bar */}
      <div className="grid grid-cols-5 gap-2 shrink-0">
        {PETS.map(pet => {
          const isActive = activePetId === pet.id;
          const isSelected = selectedPet.id === pet.id;
          const pName = petCustomNames[pet.id] || pet.name.split(' ')[0];
          return (
            <button
              key={pet.id}
              onClick={() => { setSelectedPet(pet); setEditingName(false); }}
              className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition-all relative ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 border-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-105'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl drop-shadow">{pet.icon}</span>
              <span className="text-[10px] font-extrabold truncate w-full text-center" style={{ color: pet.color }}>
                {pName}
              </span>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-black shadow-md border border-emerald-300">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Pet Details Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 flex-1 min-h-0 overflow-y-auto space-y-3.5 shadow-inner">
        {/* Top Info & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl shadow-xl bg-slate-900"
              style={{ borderColor: selectedPet.color, boxShadow: `0 0 20px ${selectedPet.color}30` }}
            >
              {selectedPet.icon}
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
                      className="bg-slate-900 border border-amber-500/80 rounded-lg px-2.5 py-1 text-xs text-amber-200 outline-none w-40"
                    />
                    <button onClick={saveName} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs text-white font-bold">
                      Сохранить
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-black text-base" style={{ color: selectedPet.color }}>{displayName}</h4>
                    <button
                      onClick={() => { setNameInput(currentCustomName); setEditingName(true); }}
                      className="text-[11px] text-slate-400 hover:text-amber-300 transition-all bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md"
                      title="Переименовать питомца"
                    >
                      ✏️ Имя
                    </button>
                  </>
                )}
              </div>
              <span className="text-[11px] text-amber-300 font-bold block mt-0.5">{evoTitle} (Форма {evoTier}/3)</span>
              <span className="text-[10px] text-slate-400 block">{selectedPet.desc}</span>
            </div>
          </div>

          <button
            onClick={() => setActivePet(activePetId === selectedPet.id ? null : selectedPet.id)}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all active:scale-95 border shadow-xl ${
              activePetId === selectedPet.id
                ? 'bg-red-950/90 border-red-500/60 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            {activePetId === selectedPet.id ? '❌ Отозвать Спутника' : '🐾 Призвать Спутника'}
          </button>
        </div>

        {/* Pet Progress & Evolution Tiers Showcase */}
        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-[11px] font-extrabold text-slate-300">
            <span>Прогресс Опыта Спутника (Ур. {petLvl})</span>
            <span className="font-mono text-emerald-400">{xpPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${xpPct}%` }} />
          </div>

          {/* Evolution Tiers Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
            <div className={`p-2 rounded-xl border text-center ${evoTier >= 1 ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
              <div className="text-[10px] font-extrabold">Ур. 1-14</div>
              <div className="text-[11px] font-black">🐣 Младший</div>
            </div>
            <div className={`p-2 rounded-xl border text-center ${evoTier >= 2 ? 'bg-amber-950/30 border-amber-500/50 text-amber-300' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
              <div className="text-[10px] font-extrabold">Ур. 15-29</div>
              <div className="text-[11px] font-black">🔥 Элитный</div>
            </div>
            <div className={`p-2 rounded-xl border text-center ${evoTier >= 3 ? 'bg-purple-950/30 border-purple-500/50 text-purple-300' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
              <div className="text-[10px] font-extrabold">Ур. 30+</div>
              <div className="text-[11px] font-black">👑 Астральный</div>
            </div>
          </div>
        </div>

        {/* Pet Talent Points Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-200 uppercase tracking-wider">Ветки Эволюции и Талантов:</span>
          <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/40">
            Очки Талантов: {availablePetPoints}
          </span>
        </div>

        {/* Evolution Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedPet.branches.map(branch => (
            <div key={branch.id} className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-xl p-1 rounded-lg bg-slate-950">{branch.icon}</span>
                <div>
                  <div className="font-black text-xs" style={{ color: branch.color }}>{branch.name}</div>
                  <div className="text-[10px] text-slate-400">{branch.desc}</div>
                </div>
              </div>

              <div className="space-y-2">
                {branch.talents.map(t => {
                  const rank = petTalents[t.id] ?? 0;
                  const canLearn = availablePetPoints > 0 && rank < t.maxRank;
                  return (
                    <div key={t.id} className="flex items-center justify-between bg-slate-950/90 p-2 rounded-xl border border-slate-800 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{t.icon}</span>
                        <div>
                          <div className="font-bold text-slate-200 leading-tight">{t.name}</div>
                          <div className="text-[10px] text-emerald-400 font-mono">{t.per(rank)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => learnPetTalent(t.id, t.maxRank)}
                        disabled={!canLearn}
                        className={`px-2.5 py-1 rounded-lg font-mono font-black text-[10px] transition-all ${
                          rank >= t.maxRank
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : canLearn
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
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

        {/* Unique Companion Skills */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-black text-slate-200 uppercase tracking-wider block">Уникальные Заклинания Спутника:</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selectedPet.skills.map(sk => (
              <div key={sk.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <span className="text-2xl p-2 bg-slate-950 rounded-xl border border-slate-800">{sk.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-amber-300">{sk.name}</div>
                  <div className="text-[10px] text-slate-300 leading-snug">{sk.desc}</div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg shrink-0 border border-slate-800">
                  ⏱️ {sk.cooldown}с
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
