import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';
import { getClassById } from '@/game/classes';

const HOTKEYS = ['1', '2', '3', '4', '5', '6', '7', '8', 'Q', 'W', 'E', 'R'];

export default function HotbarPanel() {
  const classId = useGame(s => s.classId);
  const heroClass = classId ? getClassById(classId) : null;

  const skillRanks = useGame(s => s.skillRanks);
  const skillCds = useGame(s => s.skillCds);
  const mana = useGame(s => s.mana);
  const castSkill = useGame(s => s.castSkill);

  const [bindings, setBindings] = useState<Record<string, string>>({
    '1': heroClass?.skills[0]?.id || '',
    '2': heroClass?.skills[1]?.id || '',
    '3': heroClass?.skills[2]?.id || '',
    '4': heroClass?.skills[3]?.id || '',
  });

  const [activeBindingKey, setActiveBindingKey] = useState<string | null>(null);

  // Update default bindings when class changes
  useEffect(() => {
    if (heroClass) {
      setBindings({
        '1': heroClass.skills[0]?.id || '',
        '2': heroClass.skills[1]?.id || '',
        '3': heroClass.skills[2]?.id || '',
        '4': heroClass.skills[3]?.id || '',
        'Q': 'pot_hp',
        'W': 'pot_mana',
      });
    }
  }, [classId]);

  // Global keydown handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when typing inside inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const keyUpper = e.key.toUpperCase();
      if (HOTKEYS.includes(keyUpper)) {
        const boundItemOrSkill = bindings[keyUpper];
        if (boundItemOrSkill) {
          e.preventDefault();
          if (boundItemOrSkill === 'pot_hp') {
            useGame.setState(s => ({ hp: Math.min(s.derived.maxHp, s.hp + Math.round(s.derived.maxHp * 0.4)) }));
          } else if (boundItemOrSkill === 'pot_mana') {
            useGame.setState(s => ({ mana: Math.min(s.derived.maxMana, s.mana + Math.round(s.derived.maxMana * 0.5)) }));
          } else {
            castSkill(boundItemOrSkill);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bindings, castSkill]);

  if (!heroClass) return null;

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-2 shadow-2xl backdrop-blur-md space-y-1.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base">⌨️</span>
          <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wider">
            Быстрые Клавиши (Hotbar)
          </h3>
        </div>
        <span className="text-[9px] text-slate-400 font-mono">
          Нажмите [1-8], [Q-R] на клавиатуре
        </span>
      </div>

      {/* Hotbar Slots Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
        {HOTKEYS.map(key => {
          const boundId = bindings[key];
          const sk = heroClass.skills.find(x => x.id === boundId);
          const isHpPot = boundId === 'pot_hp';
          const isManaPot = boundId === 'pot_mana';

          const rank = sk ? (skillRanks[sk.id] ?? 0) : 0;
          const cd = sk ? (skillCds[sk.id] ?? 0) : 0;
          const isNoMana = sk && mana < sk.manaCost;

          return (
            <div
              key={key}
              onClick={() => {
                if (boundId === 'pot_hp') {
                  useGame.setState(s => ({ hp: Math.min(s.derived.maxHp, s.hp + Math.round(s.derived.maxHp * 0.4)) }));
                } else if (boundId === 'pot_mana') {
                  useGame.setState(s => ({ mana: Math.min(s.derived.maxMana, s.mana + Math.round(s.derived.maxMana * 0.5)) }));
                } else if (sk) {
                  castSkill(sk.id);
                }
              }}
              className={`relative h-15 sm:h-16 rounded-xl border flex flex-col items-center justify-between p-1 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                cd > 0
                  ? 'border-slate-800 bg-slate-950/80 opacity-60'
                  : sk && rank > 0
                  ? 'border-slate-600 bg-slate-800/90 shadow-md'
                  : 'border-slate-800 bg-slate-950/40'
              }`}
              style={{
                borderColor: sk && rank > 0 ? sk.color : undefined,
                boxShadow: sk && rank > 0 && cd === 0 ? `0 0 10px ${sk.color}44` : undefined,
              }}
            >
              {/* Key Badge */}
              <span className="absolute top-0.5 left-1 text-[8px] font-black font-mono text-slate-300 bg-slate-950/80 px-1 rounded border border-slate-800 z-10">
                {key}
              </span>

              {/* Slot Icon & 2-Line Skill/Item Name */}
              {isHpPot ? (
                <div className="flex flex-col items-center justify-center w-full h-full pt-1.5">
                  <span className="text-base">🧪</span>
                  <div className="text-[8px] font-black text-emerald-300 text-center leading-[1.1] h-4 flex items-center justify-center mt-0.5">
                    Зелье<br/>HP
                  </div>
                </div>
              ) : isManaPot ? (
                <div className="flex flex-col items-center justify-center w-full h-full pt-1.5">
                  <span className="text-base">💧</span>
                  <div className="text-[8px] font-black text-sky-300 text-center leading-[1.1] h-4 flex items-center justify-center mt-0.5">
                    Эликсир<br/>Маны
                  </div>
                </div>
              ) : sk ? (
                <div className="flex flex-col items-center justify-center w-full h-full pt-1.5">
                  <span className="text-base">{sk.icon}</span>
                  <div className="text-[8px] font-black text-slate-200 text-center leading-[1.1] h-4 flex items-center justify-center mt-0.5" style={{ color: sk.color }}>
                    {sk.name.includes(' ') ? (
                      <>{sk.name.split(' ')[0]}<br/>{sk.name.split(' ').slice(1).join(' ')}</>
                    ) : (
                      sk.name
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full pt-2">
                  <span className="text-slate-600 text-[9px] font-bold">пусто</span>
                </div>
              )}

              {/* Cooldown Overlay */}
              {cd > 0 && (
                <div className="absolute inset-0 bg-slate-950/85 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-white">
                  {cd.toFixed(0)}с
                </div>
              )}

              {/* No Mana Badge */}
              {isNoMana && cd === 0 && (
                <span className="absolute bottom-0.5 text-[7px] text-sky-400 font-bold bg-sky-950/90 px-1 rounded">
                  💧мана
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
