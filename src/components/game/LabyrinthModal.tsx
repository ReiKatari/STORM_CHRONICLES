import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import type { LabyrinthRoom, LabyrinthRoomType } from '@/game/types';

interface RoomDef {
  type: LabyrinthRoomType;
  title: string;
  desc: string;
  icon: string;
}

const ROOM_TYPES: RoomDef[] = [
  { type: 'combat', title: 'Орда Тварей Бездны', desc: 'Засада элитных монстров локации.', icon: '⚔️' },
  { type: 'trap', title: 'Ядовитые Каменные Шпили', desc: 'Древние ловушки с ядовитым газом.', icon: '⚠️' },
  { type: 'chest', title: 'Затонувший Ларь Сокровищ', desc: 'Сундук с золотом и астральными рунами.', icon: '🎁' },
  { type: 'shrine', title: 'Святилище Светлого Оазиса', desc: 'Древний алтарь полного исцеления.', icon: '✨' },
];

function generateLabyrinth(size = 5) {
  const rooms: Record<string, LabyrinthRoom> = {};
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const key = `${x},${y}`;
      if (x === 0 && y === 0) {
        rooms[key] = {
          x, y, type: 'start', visited: true, cleared: true,
          title: 'Вход в Лабиринт', desc: 'Безопасный лагерь на входе.', icon: '🟢'
        };
      } else if (x === size - 1 && y === size - 1) {
        rooms[key] = {
          x, y, type: 'boss', visited: false, cleared: false,
          title: 'Чертог Владыки Лабиринта', desc: 'Главный босс процедурного лабиринта.', icon: '👑'
        };
      } else {
        const rand = ROOM_TYPES[Math.floor(Math.random() * ROOM_TYPES.length)];
        rooms[key] = {
          x, y, type: rand.type, visited: false, cleared: false,
          title: rand.title, desc: rand.desc, icon: rand.icon
        };
      }
    }
  }
  return rooms;
}

export default function LabyrinthModal({ onClose }: { onClose: () => void }) {
  const [gridSize] = useState(5);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [rooms, setRooms] = useState<Record<string, LabyrinthRoom>>(() => generateLabyrinth(5));
  const [logMsg, setLogMsg] = useState<string>('🏰 Вы спустились в Процедурный Лабиринт Бездны!');

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

  const move = (dx: number, dy: number) => {
    const nx = posX + dx;
    const ny = posY + dy;
    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return;

    const nKey = `${nx},${ny}`;
    setPosX(nx);
    setPosY(ny);

    setRooms(prev => {
      const room = prev[nKey];
      if (!room.visited) {
        return {
          ...prev,
          [nKey]: { ...room, visited: true }
        };
      }
      return prev;
    });

    setLogMsg(`Переход в комнату [${nx + 1}, ${ny + 1}]`);
  };

  const handleClearRoom = () => {
    if (!currentRoom || currentRoom.cleared) return;

    if (currentRoom.type === 'combat') {
      const rewardG = level * 150 + 200;
      const rewardXp = level * 100 + 150;
      useGame.setState(s => ({
        gold: s.gold + rewardG,
        log: [...s.log, { id: Date.now(), text: `⚔️ Комната очищена! +${rewardG}g, +${rewardXp}xp`, color: '#4ade80', time: Date.now() }]
      }));
      setLogMsg(`⚔️ Твари Бездны разбиты! Получено +${fmt(rewardG)}g Золота.`);
    } else if (currentRoom.type === 'trap') {
      const dmg = Math.floor(derived.maxHp * 0.15);
      useGame.setState(s => ({
        hp: Math.max(1, s.hp - dmg),
        log: [...s.log, { id: Date.now(), text: `⚠️ Ловушка нанесла -${dmg} HP!`, color: '#f87171', time: Date.now() }]
      }));
      setLogMsg(`⚠️ Ловушка обезврежена с уроном -${fmt(dmg)} HP.`);
    } else if (currentRoom.type === 'chest') {
      const rewardG = level * 300 + 500;
      useGame.setState(s => ({
        gold: s.gold + rewardG,
        log: [...s.log, { id: Date.now(), text: `🎁 Открыт сундук сокровищ! +${rewardG}g`, color: '#facc15', time: Date.now() }]
      }));
      setLogMsg(`🎁 Найдено +${fmt(rewardG)}g Золота и Астральная Руна!`);
    } else if (currentRoom.type === 'shrine') {
      useGame.setState(s => ({
        hp: s.derived.maxHp,
        mana: s.derived.maxMana,
        log: [...s.log, { id: Date.now(), text: `✨ Алтарь полностью исцелил HP и Ману!`, color: '#38bdf8', time: Date.now() }]
      }));
      setLogMsg(`✨ Вы восстановили 100% HP и 100% Маны!`);
    } else if (currentRoom.type === 'boss') {
      const rewardG = level * 800 + 2000;
      useGame.setState(s => ({
        gold: s.gold + rewardG,
        log: [...s.log, { id: Date.now(), text: `👑 ВЛАДЫКА ЛАБИРИНТА ПОВЕРЖЕН! +${rewardG}g`, color: '#eab308', time: Date.now() }]
      }));
      setLogMsg(`🎉 ПОБЕДА! Владыка Лабиринта повержен! Награда: +${fmt(rewardG)}g Золота!`);
    }

    setRooms(prev => ({
      ...prev,
      [currentKey]: { ...prev[currentKey], cleared: true }
    }));
  };

  const clearedCount = Object.values(rooms).filter(r => r.cleared).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-4 shadow-2xl space-y-3 relative max-h-[92vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">🏰</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                ПРОЦЕДУРНЫЕ ЛАБИРИНТЫ БЕЗДНЫ (5x5)
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Зачищено комнат: <b className="text-amber-300 font-black">{clearedCount}/25</b>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body: Map Grid Left & Event Card Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-y-auto">
          {/* 5x5 Grid Map (7 cols) */}
          <div className="md:col-span-7 bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2">
            <div className="text-xs font-black text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>🗺️</span>
              <span>Карта Исследования Лабиринта</span>
            </div>

            <div className="grid grid-cols-5 gap-2 w-full max-w-[340px]">
              {Array.from({ length: 25 }).map((_, idx) => {
                const x = idx % 5;
                const y = Math.floor(idx / 5);
                const key = `${x},${y}`;
                const r = rooms[key];
                const isCurrent = posX === x && posY === y;

                return (
                  <div
                    key={key}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center text-lg font-black relative transition-all shadow ${
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
                    {isCurrent && <span className="absolute -top-1 -right-1 text-xs">📍</span>}
                  </div>
                );
              })}
            </div>

            {/* D-Pad Movement Controls */}
            <div className="flex flex-col items-center gap-1 mt-2">
              <button
                onClick={() => move(0, -1)}
                disabled={posY === 0}
                className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-sm disabled:opacity-30"
              >
                ⬆️
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => move(-1, 0)}
                  disabled={posX === 0}
                  className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-sm disabled:opacity-30"
                >
                  ⬅️
                </button>
                <div className="w-10 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-amber-300 font-mono font-bold">
                  {posX + 1},{posY + 1}
                </div>
                <button
                  onClick={() => move(1, 0)}
                  disabled={posX === gridSize - 1}
                  className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-sm disabled:opacity-30"
                >
                  ➡️
                </button>
              </div>
              <button
                onClick={() => move(0, 1)}
                disabled={posY === gridSize - 1}
                className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-black text-sm disabled:opacity-30"
              >
                ⬇️
              </button>
            </div>
          </div>

          {/* Current Room Event Card (5 cols) */}
          <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">{currentRoom.icon}</span>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wider">{currentRoom.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Координаты: [{posX + 1}, {posY + 1}] · {currentRoom.cleared ? '✅ Зачищено' : '⚠️ Активно'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {currentRoom.desc}
              </div>

              <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 font-mono">
                {logMsg}
              </div>
            </div>

            {/* Room Action Button */}
            {!currentRoom.cleared ? (
              <button
                onClick={handleClearRoom}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-500 hover:scale-[1.02] text-white font-black text-xs border border-amber-400/60 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span>Зачистить / Исследовать Комнату</span>
              </button>
            ) : (
              <div className="p-2.5 text-center text-xs font-extrabold text-emerald-400 bg-emerald-950/40 rounded-xl border border-emerald-500/40">
                ✅ Комната полностью зачищена! Используйте стрелки для перехода.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
