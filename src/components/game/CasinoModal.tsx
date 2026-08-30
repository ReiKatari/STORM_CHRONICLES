import { useState, useRef, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import { sound } from '@/game/sound';
import { createGem } from '@/game/gems';
import { TAROT_DECK } from '@/game/tarot';
import { useEscapeKey } from '@/hooks/useEscapeKey';

const WHEEL_SECTORS = [
  { id: 'g50k', label: '50 000 ЗОЛОТА', short: '50 000 золота', icon: '💰', color: '#1e293b', textColor: '#facc15', type: 'gold', val: 50000 },
  { id: 's10', label: '10 КАМНЕЙ', short: '10 Камней', icon: '🔨', color: '#0f172a', textColor: '#38bdf8', type: 'stones', val: 10 },
  { id: 'gem3', label: 'АЛМАЗ ★3', short: 'Алмаз ★3', icon: '💎', color: '#1e293b', textColor: '#c084fc', type: 'gem', val: 3 },
  { id: 'tarot', label: 'КАРТА ТАРО', short: 'Карта Таро', icon: '🎴', color: '#0f172a', textColor: '#ec4899', type: 'tarot', val: 1 },
  { id: 'g150k', label: '150 000 ЗОЛОТА', short: '150 000 золота', icon: '💰', color: '#1e293b', textColor: '#facc15', type: 'gold', val: 150000 },
  { id: 'jackpot', label: '🌟 ДЖЕКПОТ 500k', short: '500 000 золота', icon: '👑', color: '#7f1d1d', textColor: '#fde047', type: 'gold', val: 500000 },
  { id: 's25', label: '25 КАМНЕЙ', short: '25 Камней', icon: '🔨', color: '#1e293b', textColor: '#38bdf8', type: 'stones', val: 25 },
  { id: 'gem4', label: 'РУБИН ★4', short: 'Рубин ★4', icon: '🔴', color: '#0f172a', textColor: '#f87171', type: 'gem', val: 4 },
];

export default function CasinoModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);

  const [activeGame, setActiveGame] = useState<'wheel' | 'dice' | 'tarot'>('wheel');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  // Wheel canvas & animation refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRotation = useRef(0);
  const animFrameId = useRef<number>(0);

  // Dice game state
  const [playerBet, setPlayerBet] = useState<number>(10000);
  const [diceRolls, setDiceRolls] = useState<{ hero: [number, number]; goblin: [number, number] } | null>(null);
  const [diceOutcome, setDiceOutcome] = useState<string | null>(null);
  const [isRollingDice, setIsRollingDice] = useState(false);

  const gold = useGame(s => s.gold);
  const tarotCards = useGame(s => s.tarotCards || []);

  // Draw the Canvas Wheel
  const drawWheel = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;
    const numSlices = WHEEL_SECTORS.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);

    // Outer Golden Ring
    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#78350f';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    // Outer Neon Studs
    for (let i = 0; i < 24; i++) {
      const studAngle = (Math.PI * 2 * i) / 24;
      const sx = (radius + 4) * Math.cos(studAngle);
      const sy = (radius + 4) * Math.sin(studAngle);
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#ffffff';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Slices
    for (let i = 0; i < numSlices; i++) {
      const sector = WHEEL_SECTORS[i];
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = sector.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.stroke();

      // Sector Content (Text & Icon)
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = sector.textColor;
      ctx.font = 'bold 11px sans-serif';
      ctx.shadowColor = sector.textColor;
      ctx.shadowBlur = 4;
      ctx.fillText(`${sector.icon} ${sector.label}`, radius - 16, 4);
      ctx.restore();
    }

    // Center Hub Pin
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎰', 0, 0);

    ctx.restore();

    // Top Static Pointer Arrow
    ctx.save();
    ctx.translate(center, 12);
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(-12, -4);
    ctx.lineTo(12, -4);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    if (activeGame === 'wheel') {
      drawWheel(currentRotation.current);
    }
  }, [activeGame]);

  const handleSpinWheel = () => {
    if (isSpinning || gold < 10000) return;

    useGame.setState(s => ({ gold: s.gold - 10000 }));
    setIsSpinning(true);
    setWheelResult(null);
    sound.playEquip();

    const targetIdx = Math.floor(Math.random() * WHEEL_SECTORS.length);
    const numSlices = WHEEL_SECTORS.length;
    const sliceAngle = (Math.PI * 2) / numSlices;
    
    // Top pointer is at -Math.PI / 2
    const targetAngle = -Math.PI / 2 - (targetIdx * sliceAngle + sliceAngle / 2);
    const extraRounds = Math.PI * 2 * (6 + Math.floor(Math.random() * 3));
    const totalTarget = currentRotation.current + extraRounds + (targetAngle - (currentRotation.current % (Math.PI * 2)));

    const startTime = performance.now();
    const duration = 4500;
    const startRot = currentRotation.current;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentRotation.current = startRot + (totalTarget - startRot) * easeOut;

      drawWheel(currentRotation.current);

      if (progress < 1) {
        animFrameId.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const prize = WHEEL_SECTORS[targetIdx];
        setWheelResult(`🎉 Вы выиграли: ${prize.label}!`);
        sound.playLevelUp();

        if (prize.type === 'gold') {
          useGame.setState(s => ({ gold: s.gold + prize.val }));
        } else if (prize.type === 'stones') {
          useGame.setState(s => ({ enhancementStones: (s.enhancementStones || 0) + prize.val }));
        } else if (prize.type === 'gem') {
          useGame.setState(s => ({ gemsInventory: [...s.gemsInventory, createGem(prize.id === 'gem4' ? 'ruby' : 'diamond', prize.val as any)] }));
        } else if (prize.type === 'tarot') {
          const randomCard = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
          useGame.setState(s => ({ tarotCards: [...s.tarotCards, randomCard] }));
        }
      }
    };

    animFrameId.current = requestAnimationFrame(animate);
  };

  const handleRollDice = () => {
    if (isRollingDice || gold < playerBet) return;

    setIsRollingDice(true);
    useGame.setState(s => ({ gold: s.gold - playerBet }));
    sound.playHit();

    setTimeout(() => {
      const h1 = Math.floor(Math.random() * 6) + 1;
      const h2 = Math.floor(Math.random() * 6) + 1;
      const g1 = Math.floor(Math.random() * 6) + 1;
      const g2 = Math.floor(Math.random() * 6) + 1;

      const heroSum = h1 + h2;
      const goblinSum = g1 + g2;

      setDiceRolls({ hero: [h1, h2], goblin: [g1, g2] });
      setIsRollingDice(false);

      if (heroSum > goblinSum) {
        const winGold = Math.round(playerBet * 2);
        useGame.setState(s => ({ gold: s.gold + winGold }));
        setDiceOutcome(`🏆 ПОБЕДА! Сумма ${heroSum} против ${goblinSum}! (+${fmt(winGold)} золота)`);
        sound.playLevelUp();
      } else if (heroSum < goblinSum) {
        setDiceOutcome(`💀 Гоблин набрал ${goblinSum} против ваших ${heroSum}! Ставка сгорела.`);
        sound.playRefineFail();
      } else {
        useGame.setState(s => ({ gold: s.gold + playerBet }));
        setDiceOutcome(`🤝 Ничья (${heroSum} = ${goblinSum})! Ставка полностью возвращена.`);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-3xl bg-slate-900/95 border border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-slate-900 border border-amber-500/50 flex items-center justify-center text-2xl shadow-lg">
              🎰
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Таверна & Казино Хитрых Гоблинов</span>
              </h2>
              <p className="text-xs text-slate-400">
                Колесо Фортуны, Кости Хаоса и Тайная Колода Карт Таро
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
            onClick={() => setActiveGame('wheel')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeGame === 'wheel'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🎡</span>
            <span>Колесо Фортуны</span>
          </button>
          <button
            onClick={() => setActiveGame('dice')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeGame === 'dice'
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🎲</span>
            <span>Кости с Гоблином</span>
          </button>
          <button
            onClick={() => setActiveGame('tarot')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
              activeGame === 'tarot'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🎴</span>
            <span>Колода Таро Судьбы</span>
            {tarotCards.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            )}
          </button>
        </div>

        {/* Balance Status Pill */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-mono shrink-0">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <span>💰</span>
            <span>Ваш кошелёк: <b>{fmt(gold)} золота</b></span>
          </div>
          <div className="text-purple-300 font-bold">
            🎴 В колоде: <b>{tarotCards.length} карт</b>
          </div>
        </div>

        {/* Main Game Screen */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: WHEEL OF FORTUNE */}
          {activeGame === 'wheel' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-2">
              <div className="relative p-2 rounded-full bg-slate-950 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={340}
                  className="rounded-full cursor-pointer"
                />
              </div>

              {wheelResult && (
                <div className="p-3 rounded-2xl bg-amber-950/90 border border-amber-500 text-amber-200 text-xs font-black text-center animate-bounce shadow-xl">
                  {wheelResult}
                </div>
              )}

              <button
                onClick={handleSpinWheel}
                disabled={isSpinning || gold < 10000}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
              >
                {isSpinning ? 'Колесо вращается...' : 'Крутить Колесо (10 000 золота)'}
              </button>
            </div>
          )}

          {/* TAB 2: GOBLIN DICE */}
          {activeGame === 'dice' && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                {/* Hero Side */}
                <div className="bg-slate-950/80 border border-blue-500/40 rounded-2xl p-4 text-center space-y-3 shadow-lg">
                  <div className="text-xs font-black text-blue-300 uppercase tracking-wider">
                    🛡️ ВАШ БРОСОК
                  </div>
                  <div className="flex items-center justify-center gap-3 text-4xl">
                    <span className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                      {diceRolls ? diceRolls.hero[0] : '🎲'}
                    </span>
                    <span className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                      {diceRolls ? diceRolls.hero[1] : '🎲'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Сумма очков: <b className="text-white">{diceRolls ? diceRolls.hero[0] + diceRolls.hero[1] : 0}</b>
                  </div>
                </div>

                {/* Goblin Side */}
                <div className="bg-slate-950/80 border border-red-500/40 rounded-2xl p-4 text-center space-y-3 shadow-lg">
                  <div className="text-xs font-black text-red-300 uppercase tracking-wider">
                    👺 БРОСОК ГОБЛИНА
                  </div>
                  <div className="flex items-center justify-center gap-3 text-4xl">
                    <span className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                      {diceRolls ? diceRolls.goblin[0] : '🎲'}
                    </span>
                    <span className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                      {diceRolls ? diceRolls.goblin[1] : '🎲'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Сумма очков: <b className="text-white">{diceRolls ? diceRolls.goblin[0] + diceRolls.goblin[1] : 0}</b>
                  </div>
                </div>
              </div>

              {diceOutcome && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/50 text-amber-200 text-xs font-black text-center shadow-lg animate-fadeIn">
                  {diceOutcome}
                </div>
              )}

              {/* Bet Controls */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Размер ставки:</span>
                  <span className="text-amber-300 font-mono font-black">{fmt(playerBet)} золота</span>
                </div>
                <div className="flex gap-2">
                  {[5000, 10000, 25000, 50000, 100000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setPlayerBet(amt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        playerBet === amt
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      {fmt(amt)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRollDice}
                  disabled={isRollingDice || gold < playerBet}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-40 text-white font-black text-sm shadow-xl transition-all active:scale-95 cursor-pointer"
                >
                  {isRollingDice ? 'Бросаем кости...' : `Сделать ставку (${fmt(playerBet)} золота)`}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TAROT DECK */}
          {activeGame === 'tarot' && (
            <div className="space-y-3 py-2">
              <div className="text-xs text-slate-400">
                Карты Таро выпадают в Колесе Фортуны и дают мощные постоянные или долгосрочные эффекты.
              </div>

              {tarotCards.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-4xl">🎴</span>
                  <div className="text-sm font-black text-slate-300">Ваша колода пока пуста</div>
                  <div className="text-xs text-slate-500">Вращайте Колесо Фортуны, чтобы собрать древние Арканы!</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tarotCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-950/80 border border-purple-500/40 space-y-1.5 shadow-md hover:border-purple-400 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black flex items-center gap-1.5" style={{ color: card.color }}>
                          <span>{card.icon}</span>
                          <span>{card.name}</span>
                        </span>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
                          {card.arcana}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">{card.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
