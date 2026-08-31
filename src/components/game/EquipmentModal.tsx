import EquipmentPanel from './EquipmentPanel';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export default function EquipmentModal({
  onClose,
  onSelectSlot,
}: {
  onClose: () => void;
  onSelectSlot: () => void;
}) {
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans animate-fadeIn">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl space-y-4 relative max-h-[92vh] flex flex-col">
        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-slate-900 border border-amber-500/50 flex items-center justify-center text-2xl shadow-lg">
              🛡️
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Кукла Снаряжения Персонажа</span>
              </h2>
              <p className="text-xs text-slate-400">
                13 слотов экипировки, инкрустация и бонусы сетов
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[ESC]</span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-red-950/80 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 hover:border-red-500/50 transition-all cursor-pointer shadow"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Paperdoll Inner Content */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
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
