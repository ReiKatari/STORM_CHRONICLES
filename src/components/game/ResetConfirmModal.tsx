import { useGame } from '@/game/store';

export default function ResetConfirmModal({ onClose }: { onClose: () => void }) {
  const hardReset = useGame(s => s.hardReset);

  const handleConfirm = () => {
    hardReset();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(239,68,68,0.3)] space-y-5 text-center relative">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-3xl flex items-center justify-center mx-auto shadow-inner">
          ⚠️
        </div>

        {/* Modal Title */}
        <div className="space-y-1">
          <h3 className="font-black text-lg text-slate-100 uppercase tracking-wider">
            Сброс Игрового Прогресса
          </h3>
          <p className="text-xs text-red-400 font-extrabold">
            Вы уверены? Данное действие невозможно отменить!
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-3.5 text-left text-xs space-y-2 leading-relaxed text-slate-300">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <span>✨</span>
            <span>Вы сможете выбрать новый класс и создать персонажа с нуля!</span>
          </div>
          <div className="text-[11px] text-slate-400">
            • Весь золотой запас, предметы, уровни и таланты будут безвозвратно удалены.<br />
            • Экспедиции, квесты и астральная руда будут сброшены.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl rpg-button text-slate-300 font-extrabold text-xs"
          >
            ❌ Отмена
          </button>
          <button
            onClick={handleConfirm}
            className="w-full py-2.5 rounded-xl rpg-button-danger font-black text-xs flex items-center justify-center gap-1.5"
          >
            🔥 Сбросить Всё
          </button>
        </div>
      </div>
    </div>
  );
}
