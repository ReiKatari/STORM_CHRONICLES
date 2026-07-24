import { useEffect } from 'react';
import EquipmentPanel from './EquipmentPanel';

export default function EquipmentModal({
  onClose,
  onSelectSlot,
}: {
  onClose: () => void;
  onSelectSlot: () => void;
}) {
  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-2 sm:p-4">
      {/* Floating Equipment Box 2x Wider (860px) max-h-[92vh] */}
      <div className="bg-slate-900/98 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-3.5 shadow-2xl space-y-2 relative pointer-events-auto backdrop-blur-md animate-fadeIn max-h-[92vh] flex flex-col overflow-y-auto scrollbar-thin">
        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 px-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🥋</span>
            <h2 className="font-extrabold text-xs text-slate-100 uppercase tracking-wider">
              Кукла Снаряжения Персонажа
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400 font-mono">Закрыть: [ESC]</span>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-xs flex items-center justify-center transition-colors"
              title="Закрыть (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Paperdoll Inner Content */}
        <div className="flex-1 min-h-0">
          <EquipmentPanel
            onSelectSlot={() => {
              onSelectSlot();
            }}
          />
        </div>
      </div>
    </div>
  );
}
