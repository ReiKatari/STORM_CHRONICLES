import { useState, useRef, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import { WINGS_CATALOG, ASCENDANCY_CONSTELLATIONS } from '@/game/cosmetics';
import { useEscapeKey } from '@/hooks/useEscapeKey';

function WingCanvasPreview({ wingId }: { wingId: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.04;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const wingFlap = Math.sin(t * 3.5) * 0.18;
      const isArchangel = wingId === 'wing_archangel';
      const isDemon = wingId === 'wing_demon';
      const isVoid = wingId === 'wing_void';
      const isPhoenix = wingId === 'wing_phoenix';
      const isFrost = wingId === 'wing_frost';
      const isDragonKing = wingId === 'wing_dragon_king';
      const isCosmicGod = wingId === 'wing_cosmic_god';

      const wingColor1 = isArchangel ? '#fef08a' : isDemon ? '#f87171' : isVoid ? '#c084fc' : isPhoenix ? '#fdba74' : isFrost ? '#a5f3fc' : isDragonKing ? '#f87171' : '#e0e7ff';
      const wingColor2 = isArchangel ? '#f59e0b' : isDemon ? '#991b1b' : isVoid ? '#581c87' : isPhoenix ? '#ea580c' : isFrost ? '#0284c7' : isDragonKing ? '#7f1d1d' : '#818cf8';
      const glowColor = isArchangel ? '#facc15' : isDemon ? '#dc2626' : isVoid ? '#a855f7' : isPhoenix ? '#f97316' : isFrost ? '#38bdf8' : isDragonKing ? '#ef4444' : '#c084fc';

      ctx.save();
      ctx.translate(W / 2, H / 2 + 10);
      ctx.scale(0.52, 0.52);

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.scale(dir, 1);
        ctx.rotate(wingFlap * dir);
        ctx.translate(-20, -10);

        const feathers = [
          { sx: 0, sy: -10, cp1x: -45, cp1y: -85, cp2x: -120, cp2y: -100, ex: -165, ey: -65, w: 26 },
          { sx: 0, sy: 0, cp1x: -50, cp1y: -55, cp2x: -135, cp2y: -45, ex: -160, ey: -15, w: 22 },
          { sx: 0, sy: 12, cp1x: -45, cp1y: -25, cp2x: -115, cp2y: 0, ex: -145, ey: 28, w: 18 },
          { sx: 0, sy: 24, cp1x: -35, cp1y: 0, cp2x: -95, cp2y: 28, ex: -115, ey: 60, w: 15 },
        ];

        feathers.forEach((f) => {
          ctx.save();
          const grad = ctx.createLinearGradient(0, 0, f.ex, f.ey);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.35, wingColor1);
          grad.addColorStop(1, wingColor2);

          ctx.strokeStyle = grad;
          ctx.lineWidth = f.w;
          ctx.lineCap = 'round';
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 24;

          ctx.beginPath();
          ctx.moveTo(f.sx, f.sy);
          ctx.bezierCurveTo(f.cp1x, f.cp1y, f.cp2x, f.cp2y, f.ex, f.ey);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(f.sx, f.sy);
          ctx.bezierCurveTo(f.cp1x, f.cp1y, f.cp2x, f.cp2y, f.ex, f.ey);
          ctx.stroke();
          ctx.restore();
        });

        // Wing-tip Embellishment
        if (isArchangel || isCosmicGod) {
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(-165, -65, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (isDemon || isDragonKing) {
          ctx.save();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.moveTo(-165, -65);
          ctx.lineTo(-185, -85);
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      });

      // Ambient Core Aura
      ctx.save();
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, glowColor);
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [wingId]);

  return <canvas ref={canvasRef} width={280} height={140} className="w-full h-full" />;
}

export default function CosmeticsModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const [activeTab, setActiveTab] = useState<'wings' | 'ascendancy'>('wings');

  const unlockedWings = useGame(s => s.unlockedWings || ['wing_archangel']);
  const activeWings = useGame(s => s.activeWings);
  const celestialShards = useGame(s => s.celestialShards || 0);
  const ascendancyLevels = useGame(s => s.ascendancyLevels || {});
  const gold = useGame(s => s.gold);
  const equipWing = useGame(s => s.equipWing);
  const unlockWing = useGame(s => s.unlockWing);
  const upgradeAscendancy = useGame(s => s.upgradeAscendancy);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-4xl bg-slate-900/95 border border-purple-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-slate-900 border border-purple-500/50 flex items-center justify-center text-2xl shadow-lg">
              🪽
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Гардероб Крыльев & Вознесение</span>
              </h2>
              <p className="text-xs text-slate-400">
                Светящиеся косметические крылья, ауры и небесные созвездия
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

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('wings')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'wings'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🪽</span>
            <span>Крылья & Ауры</span>
          </button>
          <button
            onClick={() => setActiveTab('ascendancy')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ascendancy'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🌌</span>
            <span>Небесные Созвездия</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'wings' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {WINGS_CATALOG.map(wing => {
                const isUnlocked = unlockedWings.includes(wing.id);
                const isEquipped = activeWings === wing.id;

                return (
                  <div
                    key={wing.id}
                    className={`bg-slate-950/80 border rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xl ${
                      isEquipped
                        ? 'border-purple-500 shadow-purple-500/20 shadow-lg ring-1 ring-purple-500'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Live Canvas Animated Wing Preview */}
                      <div className="w-full h-36 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mb-3 relative overflow-hidden shadow-inner">
                        <WingCanvasPreview wingId={wing.id} />
                        {isEquipped && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-purple-600 text-white font-black text-[9px] shadow font-mono z-10">
                            НАДЕТО
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>{wing.icon}</span>
                        <span>{wing.name}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{wing.desc}</p>

                      <div className="my-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono space-y-0.5 font-bold">
                        <div className="text-amber-300">⚔️ +{wing.bonusDmgPct}% к общему урону</div>
                        <div className="text-emerald-300">❤️ +{wing.bonusHpPct}% к здоровью</div>
                        <div className="text-cyan-300">⚡ +{wing.bonusSpeedPct}% к скорости атак</div>
                      </div>
                    </div>

                    <div>
                      {isUnlocked ? (
                        <button
                          onClick={() => equipWing(wing.id)}
                          disabled={isEquipped}
                          className={`w-full py-2.5 rounded-xl font-black text-xs transition-all shadow cursor-pointer ${
                            isEquipped
                              ? 'bg-slate-800 text-slate-500 cursor-default'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                          }`}
                        >
                          {isEquipped ? 'Экипировано' : 'Надеть Крылья'}
                        </button>
                      ) : (
                        <button
                          onClick={() => unlockWing(wing.id)}
                          disabled={wing.costGold ? gold < wing.costGold : false}
                          className={`w-full py-2.5 rounded-xl font-black text-xs transition-all shadow cursor-pointer ${
                            wing.costGold && gold >= wing.costGold
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
                          }`}
                        >
                          Разблокировать ({fmt(wing.costGold || 0)} золота)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'ascendancy' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-1 bg-slate-900 rounded-xl border border-slate-800">🔮</span>
                  <div>
                    <div className="text-sm font-black text-white">Астральные Осколки Вознесения</div>
                    <div className="text-xs text-slate-400">Добываются за прохождение Башни Испытаний и Лабиринта.</div>
                  </div>
                </div>
                <div className="text-base font-black font-mono text-purple-300 bg-purple-950/80 px-4 py-1.5 rounded-xl border border-purple-500/50 shadow">
                  {celestialShards} 🔮
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ASCENDANCY_CONSTELLATIONS.map(constellation => {
                  const curLvl = ascendancyLevels[constellation.id] || 0;
                  const isMax = curLvl >= constellation.maxLevel;
                  const canUpgrade = !isMax && celestialShards >= constellation.costPerLevel;

                  return (
                    <div
                      key={constellation.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-sm font-black text-white flex items-center gap-2">
                            <span className="text-xl p-1 bg-slate-900 rounded-lg border border-slate-800">{constellation.icon}</span>
                            <span>{constellation.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-amber-300">
                            Уровень {curLvl} из {constellation.maxLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{constellation.desc}</p>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-900">
                        <span className="text-xs font-mono text-purple-300 font-bold">
                          {isMax ? 'Максимальный ранг' : `Цена: ${constellation.costPerLevel} Осколков`}
                        </span>
                        <button
                          onClick={() => upgradeAscendancy(constellation.id)}
                          disabled={!canUpgrade}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-30 text-white font-black text-xs shadow transition-all active:scale-95 cursor-pointer"
                        >
                          {isMax ? 'Изучено' : 'Улучшить'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
