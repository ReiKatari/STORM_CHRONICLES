import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';

export type LabyrinthLayoutType = 'diamond' | 'hourglass' | 'fortress' | 'spiral';

interface LabyrinthRoomExtended {
  x: number;
  y: number;
  type: 'start' | 'combat' | 'trap' | 'chest' | 'shrine' | 'key' | 'portal' | 'boss' | 'wall';
  visited: boolean;
  cleared: boolean;
  locked?: boolean;
  title: string;
  desc: string;
  icon: string;
}

interface LayoutOptionDef {
  id: LabyrinthLayoutType;
  name: string;
  icon: string;
  desc: string;
  size: number;
}

const LAYOUTS: LayoutOptionDef[] = [
  { id: 'diamond', name: 'Астральный Ромб', icon: '💎', desc: 'Сетка комнаты в форме ромба с ловушками на фасетах.', size: 7 },
  { id: 'hourglass', name: 'Песочные Часы', icon: '⏳', desc: 'Два больших зала, соединенных узким коридором смерти.', size: 7 },
  { id: 'fortress', name: 'Крепость Завета', icon: '🏰', desc: 'Внешний кольцевой бастион со запертым центральным святилищем.', size: 7 },
  { id: 'spiral', name: 'Спираль Бездны', icon: '🌀', desc: 'Закрученный коридор с порталами и запертыми вратами.', size: 7 },
];

function generateCustomLabyrinth(layoutType: LabyrinthLayoutType, size = 7) {
  const rooms: Record<string, LabyrinthRoomExtended> = {};
  const center = Math.floor(size / 2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const key = `${x},${y}`;
      let isValidRoom = true;

      if (layoutType === 'diamond') {
        const dist = Math.abs(x - center) + Math.abs(y - center);
        if (dist > center) isValidRoom = false;
      } else if (layoutType === 'hourglass') {
        if (y === center && Math.abs(x - center) > 1) isValidRoom = false;
      } else if (layoutType === 'fortress') {
        if ((x === 1 || x === size - 2) && (y === 1 || y === size - 2)) isValidRoom = false;
      } else if (layoutType === 'spiral') {
        if (x === 1 && y > 1 && y < size - 1) isValidRoom = false;
      }

      if (!isValidRoom) {
        rooms[key] = {
          x, y, type: 'wall', visited: false, cleared: false,
          title: 'Стена Скверны', desc: 'Непреодолимая монолитная стена Бездны.', icon: '⬛'
        };
      } else {
        rooms[key] = {
          x, y, type: 'combat', visited: false, cleared: false,
          title: 'Комната Засады', desc: 'Орда монстров локации.', icon: '⚔️'
        };
      }
    }
  }

  // Set Start Room
  rooms[`${center},0`] = {
    x: center, y: 0, type: 'start', visited: true, cleared: true,
    title: 'Безопасный Вход', desc: 'Лагерь на входе в лабиринт.', icon: '🟢'
  };

  // Set Key Room
  rooms[`0,${center}`] = {
    x: 0, y: center, type: 'key', visited: false, cleared: false,
    title: 'Алтарная Зала Ключа', desc: 'Древний Магический Ключ от Чертога Босса.', icon: '🗝️'
  };

  // Set Portal Room
  rooms[`${size - 1},${center}`] = {
    x: size - 1, y: center, type: 'portal', visited: false, cleared: false,
    title: 'Астральный Телепорт', desc: 'Мгновенно перемещает в центральный зал.', icon: '🌀'
  };

  // Set Shrine & Chest Rooms
  rooms[`1,${center}`] = {
    x: 1, y: center, type: 'shrine', visited: false, cleared: false,
    title: 'Священный Оазис', desc: 'Восстановление 100% HP и Маны.', icon: '✨'
  };

  rooms[`${center},${center - 1}`] = {
    x: center, y: center - 1, type: 'chest', visited: false, cleared: false,
    title: 'Сундук Древних', desc: 'Сокровища и астральные руны.', icon: '🎁'
  };

  // Set Locked Boss Room
  rooms[`${center},${size - 1}`] = {
    x: center, y: size - 1, type: 'boss', visited: false, cleared: false, locked: true,
    title: 'Запертый Чертог Владыки', desc: 'Главный босс. Требуется Магический Ключ (🗝️)!', icon: '👑'
  };

  return rooms;
}

export default function LabyrinthModal({ onClose }: { onClose: () => void }) {
  const [layout, setLayout] = useState<LabyrinthLayoutType>('diamond');
  const [gridSize] = useState(7);
  const [posX, setPosX] = useState(3);
  const [posY, setPosY] = useState(0);
  const [hasKey, setHasKey] = useState(false);
  const [rooms, setRooms] = useState<Record<string, LabyrinthRoomExtended>>(() => generateCustomLabyrinth('diamond', 7));
  const [logMsg, setLogMsg] = useState<string>('🏰 Исследуйте нестандартный Лабиринт Бездны!');

  const level = useGame(s => s.level);
  const derived = useGame(s => s.derived);

  const currentKey = `${posX},${posY}`;
  const currentRoom = rooms[currentKey];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSwitchLayout = (l: LabyrinthLayoutType) => {
    setLayout(l);
    setPosX(3);
    setPosY(0);
    setHasKey(false);
    setRooms(generateCustomLabyrinth(l, 7));
    setLogMsg(`Сгенерирован новый Лабиринт: ${LAYOUTS.find(x => x.id === l)?.name}!`);
  };

  const move = (dx: number, dy: number) => {
    const nx = posX + dx;
    const ny = posY + dy;
    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return;

    const nKey = `${nx},${ny}`;
    const targetRoom = rooms[nKey];
    if (!targetRoom || targetRoom.type === 'wall') {
      setLogMsg('⛔ Впереди Монолитная Стена Бездны! Проход закрыт.');
      return;
    }

    if (targetRoom.locked && !hasKey) {
      setLogMsg('🗝️ Врата заперты! Сначала найдите Магический Ключ (🗝️) в лабиринте.');
      return;
    }

    setPosX(nx);
    setPosY(ny);

    setRooms(prev => ({
      ...prev,
      [nKey]: { ...prev[nKey], visited: true }
    }));

    setLogMsg(`Переход в комнату [${nx + 1}, ${ny + 1}]`);
  };

  const handleClearRoom = () => {
    if (!currentRoom || currentRoom.cleared) return;

    if (currentRoom.type === 'key') {
      setHasKey(true);
      setLogMsg('🗝️ НАЙДЕН МАГИЧЕСКИЙ КЛЮЧ! Запертые врата Чертога Босса теперь открыты!');
    } else if (currentRoom.type === 'portal') {
      setPosX(3);
      setPosY(3);
      setRooms(prev => ({ ...prev, ['3,3']: { ...prev['3,3'], visited: true } }));
      setLogMsg('🌀 ТЕЛЕПОРТАЦИЯ! Астральный портал перенес вас в центр лабиринта!');
    } else if (currentRoom.type === 'combat') {
      const rewardG = level * 200 + 300;
      useGame.setState(s => ({
        gold: s.gold + rewardG,
        log: [...s.log, { id: Date.now(), text: `⚔️ Комната зачищена! +${rewardG}g`, color: '#4ade80', time: Date.now() }]
      }));
      setLogMsg(`⚔️ Враги уничтожены! Заработано +${fmt(rewardG)}g Золота.`);
    } else if (currentRoom.type === 'chest') {
      const rewardG = level * 400 + 800;
      useGame.setState(s => ({
        gold: s.gold + rewardG,
        log: [...s.log, { id: Date.now(), text: `🎁 Открыт Ларь Древних! +${rewardG}g`, color: '#facc15', time: Date.now() }]
      }));
      setLogMsg(`🎁 Из сундука добыто +${fmt(rewardG)}g Золота и Астральные Руны!`);
    } else if (currentRoom.type === 'shrine') {
      useGame.setState(s => ({
        hp: s.derived.maxHp,
        mana: s.derived.maxMana,
        log: [...s.log, { id: Date.now(), text: `✨ Алтарь полностью исцелил HP и Ману!`, color: '#38bdf8', time: Date.now() }]
      }));
      setLogMsg(`✨ Вы восстановили 100% HP и 100% Маны!`);
    } else if (currentRoom.type === 'boss') {
      const rewardG = level * 1000 + 3000;
      useGame.setState(s => ({
        gold: s.gold + rewardG,
        log: [...s.log, { id: Date.now(), text: `👑 ВЛАДЫКА ЛАБИРИНТА ПОВЕРЖЕН! +${rewardG}g`, color: '#eab308', time: Date.now() }]
      }));
      setLogMsg(`🎉 ВЕЛИКАЯ ПОБЕДА! Владыка Лабиринта повержен! Награда: +${fmt(rewardG)}g Золота!`);
    }

    setRooms(prev => ({
      ...prev,
      [currentKey]: { ...prev[currentKey], cleared: true }
    }));
  };

  const clearedCount = Object.values(rooms).filter(r => r.cleared && r.type !== 'wall').length;
  const totalRoomsCount = Object.values(rooms).filter(r => r.type !== 'wall').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-4 shadow-2xl space-y-3 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">🏰</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                НЕСТАНДАРТНЫЕ ЛАБИРИНТЫ БЕЗДНЫ (7x7)
              </h2>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                <span>Зачистка: <b className="text-amber-300 font-black">{clearedCount}/{totalRoomsCount}</b></span>
                <span>Ключ от Босса: <b className={hasKey ? 'text-emerald-400 font-black' : 'text-slate-500'}>{hasKey ? '🗝️ ЕСТЬ' : '❌ НЕТ'}</b></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Layout Selector Tabs */}
        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          {LAYOUTS.map(l => (
            <button
              key={l.id}
              onClick={() => handleSwitchLayout(l.id)}
              className={`flex-1 text-[11px] py-1.5 px-2 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1 ${
                layout === l.id ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{l.icon}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>

        {/* Content Body: Map Grid Left & Event Card Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-y-auto">
          {/* 7x7 Grid Map (7 cols) */}
          <div className="md:col-span-7 bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2">
            <div className="text-[11px] font-black text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>🗺️</span>
              <span>Интерактивная Сетка ({LAYOUTS.find(x => x.id === layout)?.name})</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 w-full max-w-[360px]">
              {Array.from({ length: 49 }).map((_, idx) => {
                const x = idx % 7;
                const y = Math.floor(idx / 7);
                const key = `${x},${y}`;
                const r = rooms[key];
                const isCurrent = posX === x && posY === y;

                if (!r || r.type === 'wall') {
                  return (
                    <div key={key} className="aspect-square rounded-lg bg-slate-950/60 border border-slate-900/40 opacity-20" />
                  );
                }

                return (
                  <div
                    key={key}
                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-base font-black relative transition-all shadow ${
                      isCurrent
                        ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400 scale-105 z-10'
                        : r.cleared
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 opacity-90'
                        : r.visited
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-slate-950 border-slate-900 text-slate-700 opacity-40'
                    }`}
                  >
                    <span>{r.visited ? r.icon : '❓'}</span>
                    {isCurrent && <span className="absolute -top-1 -right-1 text-[10px]">📍</span>}
                  </div>
                );
              })}
            </div>

            {/* D-Pad Movement Controls */}
            <div className="flex flex-col items-center gap-1 mt-1">
              <button
                onClick={() => move(0, -1)}
                className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-sm"
              >
                ⬆️
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => move(-1, 0)}
                  className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-sm"
                >
                  ⬅️
                </button>
                <div className="w-10 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-amber-300 font-mono font-bold">
                  {posX + 1},{posY + 1}
                </div>
                <button
                  onClick={() => move(1, 0)}
                  className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-sm"
                >
                  ➡️
                </button>
              </div>
              <button
                onClick={() => move(0, 1)}
                className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-sm"
              >
                ⬇️
              </button>
            </div>
          </div>

          {/* Current Room Event Card (5 cols) */}
          <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">{currentRoom?.icon ?? '❓'}</span>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wider">{currentRoom?.title ?? 'Комната'}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Координаты: [{posX + 1}, {posY + 1}] · {currentRoom?.cleared ? '✅ Зачищено' : '⚠️ Активно'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {currentRoom?.desc}
              </div>

              <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 font-mono">
                {logMsg}
              </div>
            </div>

            {/* Room Action Button */}
            {!currentRoom?.cleared ? (
              <button
                onClick={handleClearRoom}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-500 hover:scale-[1.02] text-white font-black text-xs border border-amber-400/60 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span>Зачистить / Активировать Комнату</span>
              </button>
            ) : (
              <div className="p-2.5 text-center text-xs font-extrabold text-emerald-400 bg-emerald-950/40 rounded-xl border border-emerald-500/40">
                ✅ Комната зачищена! Переходите к следующим секторам.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
