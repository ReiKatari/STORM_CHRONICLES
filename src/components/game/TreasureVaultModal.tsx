import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';

export default function TreasureVaultModal({ onClose }: { onClose: () => void }) {
  const [mapFragments, setMapFragments] = useState(3); // Demo starter 3 fragments
  const [completeMaps, setCompleteMaps] = useState(1);
  const [pins, setPins] = useState<boolean[]>([false, false, false, false]);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [logMsg, setLogMsg] = useState<string>('🗺️ Карта Сокровищ расшифрована! Настройте тумблеры замка.');

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
    setLogMsg('🗺️ Собрано 3 обрывка! Получена «Карта Древнего Захоронения».');
  };

  const handleTogglePin = (idx: number) => {
    if (vaultUnlocked) return;

    const nextPins = [...pins];
    nextPins[idx] = !nextPins[idx];
    setPins(nextPins);

    if (nextPins.every(p => p === true)) {
      setVaultUnlocked(true);
      const rewardG = level * 600 + 1200;
      useGame.setState(s => ({
        gold: s.gold + rewardG,
        log: [...s.log, { id: Date.now(), text: `🔓 ВЗЛОМАН ТАЙНИК СОКРОВИЩ! +${rewardG}g`, color: '#facc15', time: Date.now() }]
      }));
      setLogMsg(`🎉 ЗАМОК ВЗЛОМАН! Из Тайника добыто +${fmt(rewardG)}g Золота и Астральная Руна!`);
    } else {
      setLogMsg(`Пин ${idx + 1} выставлен в правильное положение.`);
    }
  };

  const handleResetVault = () => {
    setPins([false, false, false, false]);
    setVaultUnlocked(false);
    setLogMsg('Замок тайника обновлен.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-4 shadow-2xl space-y-3 relative max-h-[92vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">🗺️</span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                КАРТЫ СОКРОВИЩ И ТАЙНЫЕ СОКРОВИЩНИЦЫ
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Поиск кладов и интерактивный взлом замков
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
                  В наличии: <b className="text-amber-300 font-black">{mapFragments}/3</b> · Готовых карт: <b className="text-emerald-400 font-black">{completeMaps}</b>
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

          {/* Interactive Lockpicking Vault Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center">
            <div className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span>🔓</span>
              <span>Мини-игра: Взлом Замка Тайника Сокровищ</span>
            </div>

            <div className="text-[11px] text-slate-400">
              Нажимайте на штифты замка для совмещения правильной комбинации!
            </div>

            {/* 4 Lock Tumbler Pins */}
            <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
              {pins.map((active, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTogglePin(idx)}
                  className={`aspect-square rounded-2xl border flex flex-col items-center justify-center text-xl transition-all shadow ${
                    active
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400 scale-105'
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                  }`}
                >
                  <span>{active ? '🟢' : '🔒'}</span>
                  <span className="text-[10px] font-mono mt-1 font-bold">Штифт {idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Status Log */}
            <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-mono">
              {logMsg}
            </div>

            {vaultUnlocked && (
              <button
                onClick={handleResetVault}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                🔄 Сбросить Замок для Следующего Тайника
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
