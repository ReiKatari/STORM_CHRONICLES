import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';

export default function TreasureVaultModal({ onClose }: { onClose: () => void }) {
  const [mapFragments, setMapFragments] = useState(3);
  const [completeMaps, setCompleteMaps] = useState(1);
  const [lockPicks, setLockPicks] = useState(5);

  // Advanced Lockpicking Mechanics State
  const [pickAngle, setPickAngle] = useState(90); // 0° to 180°
  const [tension, setTension] = useState(0); // 0% to 100%
  const [sweetSpot] = useState(() => 30 + Math.floor(Math.random() * 120)); // Target angle 30°-150°
  const [pickDurability, setPickDurability] = useState(100);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [logMsg, setLogMsg] = useState<string>('🗺️ Карта Сокровищ открыта! Найдите правильный угол отмычки.');

  const level = useGame(s => s.level);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCombineFragments = () => {
    if (mapFragments < 3) {
      setLogMsg('⚠️ Нужно собрать минимум 3 обрывка карт сокровищ!');
      return;
    }
    setMapFragments(prev => prev - 3);
    setCompleteMaps(prev => prev + 1);
    setLogMsg('🗺️ Собрано 3 обрывка! Получена новая Карта Захоронения.');
  };

  const handleTurnTension = () => {
    if (vaultUnlocked || lockPicks <= 0) return;

    const angleDiff = Math.abs(pickAngle - sweetSpot);

    if (angleDiff <= 12) {
      // Sweet spot hit!
      setTension(100);
      setVaultUnlocked(true);
      const rewardG = level * 800 + 2500;
      useGame.setState(s => ({
        gold: s.gold + rewardG,
        log: [...s.log, { id: Date.now(), text: `🔓 ВЗЛОМАН ДРЕВНИЙ СУНДУК СОКРОВИЩ! +${rewardG}g`, color: '#facc15', time: Date.now() }]
      }));
      setLogMsg(`🎉 СУНДУК ВЗЛОМАН! Из тайника добыто +${fmt(rewardG)}g Золота и Астральные Руны!`);
    } else {
      // Wrong angle! Pick takes damage under tension
      const newDurability = pickDurability - Math.max(25, angleDiff * 2);
      if (newDurability <= 0) {
        setLockPicks(prev => Math.max(0, prev - 1));
        setPickDurability(100);
        setTension(0);
        setLogMsg(`💥 ОТМЫЧКА СЛОМАЛАСЬ! Угол был неверным. Осталось отмычек: ${lockPicks - 1}`);
      } else {
        setPickDurability(newDurability);
        setTension(Math.max(10, 100 - angleDiff * 3));
        setLogMsg(`⚠️ Замок заедает! Угол отклонен на ${angleDiff}°. Скорректируйте положение.`);
      }
    }
  };

  const handleResetLock = () => {
    setPickAngle(90);
    setTension(0);
    setPickDurability(100);
    setVaultUnlocked(false);
    setLogMsg('Замок тайника обновлен.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-4 shadow-2xl space-y-3 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">🗺️</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                КАРТЫ СОКРОВИЩ И ТАЙНЫЕ СОКРОВИЩНИЦЫ
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Реалистичный 3D-взлом замков и поиск кладов
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

        {/* Content Body */}
        <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
          {/* Map Fragments & Combine Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800">🧩</span>
              <div>
                <div className="font-extrabold text-xs text-amber-300">Обрывки Карт Сокровищ</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Обрывки: <b className="text-amber-300 font-black">{mapFragments}/3</b> · Запас Отмычек: <b className="text-emerald-400 font-black">{lockPicks} шт.</b>
                </div>
              </div>
            </div>

            <button
              onClick={handleCombineFragments}
              disabled={mapFragments < 3}
              className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs border border-amber-400/60 shadow transition-all active:scale-95 disabled:opacity-30"
            >
              🧩 Собрать Карту (3/3)
            </button>
          </div>

          {/* Realistic Lockpicking Vault Cylinder */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4 text-center shadow-xl">
            <div className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center justify-center gap-2">
              <span>🔐</span>
              <span>Латунный Механический Замок Сундука</span>
            </div>

            {/* Lock Cylinder & Rotating Pick Indicator */}
            <div className="w-48 h-48 rounded-full border-4 border-amber-500/60 bg-gradient-to-b from-slate-900 to-slate-950 mx-auto relative flex items-center justify-center shadow-2xl">
              {/* Rotating Lockpick Needle */}
              <div
                className="w-1.5 h-20 bg-amber-400 rounded-full origin-bottom absolute bottom-1/2 left-1/2 -ml-0.75 transition-transform shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                style={{ transform: `rotate(${pickAngle - 90}deg)` }}
              />

              {/* Central Keyhole */}
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-slate-950 flex items-center justify-center text-xl z-10 shadow-inner">
                {vaultUnlocked ? '🔓' : '🔒'}
              </div>
            </div>

            {/* Angle Adjustment Slider */}
            <div className="space-y-1 max-w-md mx-auto">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Угол отмычки: <b className="text-amber-300">{pickAngle}°</b></span>
                <span>Прочность отмычки: <b className="text-emerald-400">{pickDurability}%</b></span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={pickAngle}
                onChange={e => setPickAngle(parseInt(e.target.value, 10))}
                disabled={vaultUnlocked || lockPicks <= 0}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Tension Gauge Bar */}
            <div className="max-w-md mx-auto space-y-1">
              <div className="text-[10px] text-slate-400 font-mono text-left">Натяжение натяжителя:</div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-200" style={{ width: `${tension}%` }} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center pt-1">
              {!vaultUnlocked ? (
                <button
                  onClick={handleTurnTension}
                  disabled={lockPicks <= 0}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-500 hover:scale-105 text-white font-black text-xs border border-amber-400/60 shadow-lg transition-all active:scale-95 disabled:opacity-40"
                >
                  🗝️ Повернуть Натяжитель Замка
                </button>
              ) : (
                <button
                  onClick={handleResetLock}
                  className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                >
                  🔄 Взломать Следующий Сундук
                </button>
              )}
            </div>

            {/* Status Message */}
            <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-mono max-w-md mx-auto">
              {logMsg}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
