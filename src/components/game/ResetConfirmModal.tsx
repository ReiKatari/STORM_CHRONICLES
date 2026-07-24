import { useState } from 'react';
import { useGame, getCharacterSlotsMeta, getActiveSlotId, setActiveSlotId, getSlotSaveKey } from '@/game/store';
import { HERO_CLASSES } from '@/game/classes';
import { ZONES } from '@/game/monsters';

export default function ResetConfirmModal({
  onClose,
  onOpenCreation,
}: {
  onClose: () => void;
  onOpenCreation?: () => void;
}) {
  const activeSlotId = getActiveSlotId();
  const [slots, setSlots] = useState(getCharacterSlotsMeta());
  const [confirmResetSlot, setConfirmResetSlot] = useState<string | null>(null);

  const ALL_SLOTS = ['slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5'];

  const handleSelectSlot = (slotId: string) => {
    // Save current active state first
    useGame.getState().save();

    setActiveSlotId(slotId);
    const raw = localStorage.getItem(getSlotSaveKey(slotId));
    if (raw) {
      location.reload();
    } else if (onOpenCreation) {
      onClose();
      onOpenCreation();
    } else {
      location.reload();
    }
  };

  const handleHardResetSlot = (slotId: string) => {
    useGame.getState().save();
    try {
      localStorage.removeItem(getSlotSaveKey(slotId));
      localStorage.removeItem('storm_chronicles_save');
    } catch { /* ignore */ }

    if (slotId === activeSlotId) {
      if (onOpenCreation) {
        onClose();
        onOpenCreation();
      } else {
        location.reload();
      }
    } else {
      setSlots(getCharacterSlotsMeta());
      setConfirmResetSlot(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1 bg-amber-500/10 rounded-xl border border-amber-500/30">👥</span>
            <div>
              <h3 className="font-black text-base text-slate-100 uppercase tracking-wider">
                Слоты Персонажей и Сброс
              </h3>
              <p className="text-xs text-slate-400">
                Переключайтесь между героями или создайте нового в свободном слоте.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-xs flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 5 Character Slots List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {ALL_SLOTS.map((slotId, idx) => {
            const meta = slots.find(s => s.slotId === slotId);
            const isActive = slotId === activeSlotId;
            const heroCls = meta ? HERO_CLASSES.find(c => c.id === meta.classId) : null;
            const zoneDef = meta ? ZONES.find(z => z.id === meta.zoneId) : null;

            return (
              <div
                key={slotId}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all backdrop-blur-md ${
                  isActive
                    ? 'bg-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {meta ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl border flex items-center justify-center text-2xl shrink-0 bg-slate-900 shadow-md"
                      style={{ borderColor: heroCls?.color ?? '#facc15' }}
                    >
                      {heroCls?.icon ?? '🛡️'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-100 truncate">
                          {meta.characterName}
                        </span>
                        <span className="text-[10px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md font-mono">
                          Ур. {meta.level}
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            АКТИВЕН
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">
                        {heroCls?.name ?? 'Герой'} • {zoneDef?.name ?? 'Зеленые холмы'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-12 h-12 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-xl bg-slate-900/50">
                      ➕
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-400">Слот #{idx + 1} (Пусто)</div>
                      <div className="text-[11px] text-slate-600">Свободен для нового героя</div>
                    </div>
                  </div>
                )}

                {/* Slot Actions */}
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {meta ? (
                    <>
                      {!isActive && (
                        <button
                          onClick={() => handleSelectSlot(slotId)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md active:scale-95"
                        >
                          🎮 Выбрать
                        </button>
                      )}
                      {confirmResetSlot === slotId ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleHardResetSlot(slotId)}
                            className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[10.5px]"
                          >
                            Да, Сбросить
                          </button>
                          <button
                            onClick={() => setConfirmResetSlot(null)}
                            className="px-2 py-1 rounded-xl bg-slate-800 text-slate-400 text-[10.5px]"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmResetSlot(slotId)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 border border-slate-700 font-bold text-xs transition-all"
                          title="Сбросить прогресс этого слота и выбрать новый класс"
                        >
                          🗑️ Сброс
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleSelectSlot(slotId)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg active:scale-95"
                    >
                      ✨ Создать
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & close */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
          <span className="text-[10.5px] text-slate-500 font-mono">
            Сброс удаляет прогресс выбранного слота и открывает выбор класса.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl rpg-button text-slate-300 font-extrabold text-xs"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
