import EquipmentPanel from './EquipmentPanel';

export default function EquipmentModal({
  onClose,
  onSelectSlot,
}: {
  onClose: () => void;
  onSelectSlot: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-4 shadow-2xl space-y-3 relative max-h-[90vh] overflow-y-auto">
        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥋</span>
            <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
              КУКЛА СНАРЯЖЕНИЯ И ХАРАКТЕРИСТИКИ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Paperdoll Inner Content */}
        <EquipmentPanel
          onSelectSlot={() => {
            onSelectSlot();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
