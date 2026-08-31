import { useState, useEffect } from 'react';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import { generateItem, rarityById } from '@/game/items';
import { sound } from '@/game/sound';
import type { RarityId } from '@/game/types';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export interface LockTier {
  id: string;
  name: string;
  icon: string;
  difficulty: string;
  tolerance: number; // angle window in degrees
  baseGold: number;
  rewardRarity: RarityId;
  color: string;
}

const LOCK_TIERS: LockTier[] = [
  { id: 'wood', name: 'Деревянный Сундук Контрабандиста', icon: '📦', difficulty: 'Легкий', tolerance: 16, baseGold: 3500, rewardRarity: 'uncommon', color: '#a3e635' },
  { id: 'iron', name: 'Кованый Железный Сейф', icon: '🗄️', difficulty: 'Средний', tolerance: 10, baseGold: 10000, rewardRarity: 'rare', color: '#38bdf8' },
  { id: 'mithril', name: 'Мифриловый Тайник Древних', icon: '🏛️', difficulty: 'Сложный', tolerance: 6, baseGold: 35000, rewardRarity: 'epic', color: '#c084fc' },
  { id: 'astral', name: 'Астральный Ковчег Вечности', icon: '👑', difficulty: 'Мастер', tolerance: 3.5, baseGold: 100000, rewardRarity: 'legendary', color: '#facc15' },
  { id: 'dragon', name: 'Тайник Драконьего Владыки', icon: '🐉', difficulty: 'Мифический', tolerance: 2.2, baseGold: 350000, rewardRarity: 'mythic', color: '#f97316' },
  { id: 'creator', name: 'Святилище Создателя Миров', icon: '🌟', difficulty: 'Божественный', tolerance: 1.5, baseGold: 1000000, rewardRarity: 'divine', color: '#e0e7ff' },
];

export default function TreasureVaultModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const [activeTab, setActiveTab] = useState<'lockpick' | 'maps' | 'jackpot'>('lockpick');
  const [selectedTier, setSelectedTier] = useState<LockTier>(LOCK_TIERS[0]);

  // Lockpick Mechanics State
  const [mapFragments, setMapFragments] = useState<number>(() => {
    const saved = localStorage.getItem('storm_map_fragments');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [completeMaps, setCompleteMaps] = useState<number>(() => {
    const saved = localStorage.getItem('storm_complete_maps');
    return saved ? parseInt(saved, 10) : 2;
  });

  const [lockPicks, setLockPicks] = useState<number>(() => {
    const saved = localStorage.getItem('storm_lock_picks');
    return saved ? parseInt(saved, 10) : 10;
  });

  const [pickAngle, setPickAngle] = useState(90); // 0° to 180°
  const [cylinderRotation, setCylinderRotation] = useState(0); // 0° to 90°
  const [sweetSpot, setSweetSpot] = useState(() => 30 + Math.floor(Math.random() * 120));
  const [pickDurability, setPickDurability] = useState(100);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [totalUnlocked, setTotalUnlocked] = useState(0);
  const [logMsg, setLogMsg] = useState<string>('🗺️ Выберите угол отмычки ползунком и удерживайте кнопку «Повернуть Замок»!');

  const level = useGame(s => s.level);

  // Persistence
  useEffect(() => {
    localStorage.setItem('storm_map_fragments', mapFragments.toString());
  }, [mapFragments]);

  useEffect(() => {
    localStorage.setItem('storm_complete_maps', completeMaps.toString());
  }, [completeMaps]);

  useEffect(() => {
    localStorage.setItem('storm_lock_picks', lockPicks.toString());
  }, [lockPicks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lockpick Tension Mechanics Loop
  const handleTurnTension = () => {
    if (vaultUnlocked) return;
    if (lockPicks <= 0) {
      setLogMsg('⚠️ У вас закончились отмычки! Соберите обрывки карт или купите отмычки у Торвальда.');
      return;
    }

    const angleDiff = Math.abs(pickAngle - sweetSpot);
    const tolerance = selectedTier.tolerance;

    if (angleDiff <= tolerance) {
      // Successful turn to 90 degrees!
      setCylinderRotation(90);
      setVaultUnlocked(true);
      sound.playLevelUp();

      const goldGain = Math.round((selectedTier.baseGold + level * 500) * (0.9 + Math.random() * 0.3));
      const lootItem = generateItem(level, selectedTier.rewardRarity);

      useGame.setState(s => ({
        gold: s.gold + goldGain,
        inventory: [...s.inventory, lootItem],
        log: [...s.log, { id: Date.now(), text: `🔓 ВЗЛОМАН ${selectedTier.name.toUpperCase()}! +${fmt(goldGain)} золота, получен ${lootItem.name}!`, color: '#facc15', time: Date.now() }]
      }));

      setTotalUnlocked(prev => prev + 1);
      setLogMsg(`🎉 ЗАМОК ВЗЛОМАН! Из сундука добыто +${fmt(goldGain)} золота и ${lootItem.name} (${rarityById(lootItem.rarity).name})!`);
    } else {
      // Jammed turn! Pick suffers durability damage
      const maxPossibleRotation = Math.max(5, Math.round((1 - angleDiff / 90) * 60));
      setCylinderRotation(maxPossibleRotation);
      sound.playBlock();

      const dmg = Math.max(20, Math.round(angleDiff * 1.5));
      const nextDur = pickDurability - dmg;

      if (nextDur <= 0) {
        sound.playHit();
        setLockPicks(prev => Math.max(0, prev - 1));
        setPickDurability(100);
        setCylinderRotation(0);
        setLogMsg(`💥 ОТМЫЧКА СЛОМАЛАСЬ! Угол был неверен (${angleDiff}° от цели). Осталось отмычек: ${lockPicks - 1}`);
      } else {
        setPickDurability(nextDur);
        setLogMsg(`⚠️ Замок заедает на ${maxPossibleRotation}°! Угол отклонен. Скорректируйте угол отмычки!`);
      }
    }
  };

  const handleResetLock = (tier = selectedTier) => {
    setSelectedTier(tier);
    setPickAngle(90);
    setCylinderRotation(0);
    setPickDurability(100);
    setVaultUnlocked(false);
    setSweetSpot(25 + Math.floor(Math.random() * 130));
    setLogMsg(`Установлен новый ${tier.name}. Найдите верный угол (окно допуска: ±${tier.tolerance}°)!`);
  };

  const handleCombineFragments = () => {
    if (mapFragments < 3) {
      setLogMsg(`⚠️ Нужно собрать минимум 3 обрывка карт сокровищ (у вас: ${mapFragments} из 3)!`);
      return;
    }
    sound.playSpell();
    setMapFragments(prev => prev - 3);
    setCompleteMaps(prev => prev + 1);
    setLogMsg('🗺️ Собрано 3 обрывка! Создана новая Карта Захоронения Древних.');
  };

  const handleBuyPicks = () => {
    const s = useGame.getState();
    const cost = 2500;
    if (s.gold < cost) {
      setLogMsg(`⚠️ Недостаточно золота для покупки набора отмычек (нужно: ${fmt(cost)} золота)!`);
      return;
    }
    sound.playLoot();
    useGame.setState(st => ({ gold: st.gold - cost }));
    setLockPicks(prev => prev + 5);
    setLogMsg('📦 Куплен набор из 5 прочных мифриловых отмычек за 2 500 золота!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-slate-950 border border-amber-500/50 rounded-2xl max-w-4xl w-full p-4 shadow-[0_0_60px_rgba(245,158,11,0.3)] space-y-3 relative max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">🗺️</span>
            <div>
              <h2 className="font-black text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span>КАРТЫ СОКРОВИЩ И ТАЙНЫЕ ХРАНИЛИЩА</span>
              </h2>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                <span>Отмычек: <b className="text-amber-300 font-black">🔑 {lockPicks} штук</b></span>
                <span>·</span>
                <span>Карт: <b className="text-emerald-300 font-black">🗺️ {completeMaps} штук</b></span>
                <span>·</span>
                <span>Обрывков: <b className="text-purple-300 font-black">📜 {mapFragments} из 3</b></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('lockpick')}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'lockpick' ? 'bg-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🗝️</span>
            <span>Интерактивный Взлом Замка</span>
          </button>

          <button
            onClick={() => setActiveTab('maps')}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'maps' ? 'bg-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🗺️</span>
            <span>Сборка Карт ({completeMaps})</span>
          </button>

          <button
            onClick={() => setActiveTab('jackpot')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'jackpot'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>👑</span>
            <span>Джекпот Бездны</span>
          </button>
        </div>

        {/* Tab 1: Lockpick Arena */}
        {activeTab === 'lockpick' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 min-h-0 overflow-y-auto pr-1">
            
            {/* Lock Tiers Sidebar */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="font-black text-xs text-amber-300 uppercase tracking-wider">
                1. Выберите Сейф
              </div>
              <div className="space-y-1.5">
                {LOCK_TIERS.map(tier => {
                  const isSelected = selectedTier.id === tier.id;
                  return (
                    <button
                      key={tier.id}
                      onClick={() => handleResetLock(tier)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0">{tier.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-black truncate" style={{ color: tier.color }}>{tier.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {tier.difficulty} · Окно: ±{tier.tolerance}°
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={handleBuyPicks}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-slate-300 font-bold text-xs border border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🪙 Купить 5 Отмычек (2 500 золота)</span>
                </button>
              </div>
            </div>

            {/* Lockpicking Mechanism 3D Simulator (2 Columns) */}
            <div className="md:col-span-2 p-4 bg-slate-900 border border-amber-500/40 rounded-2xl flex flex-col justify-between space-y-4 shadow-2xl relative overflow-hidden">
              
              <div className="flex items-center justify-between">
                <div className="font-black text-xs text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <span>{selectedTier.icon}</span>
                  <span>{selectedTier.name}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                  Прочность отмычки: <b className={pickDurability > 40 ? 'text-emerald-400' : 'text-red-400'}>{pickDurability}%</b>
                </div>
              </div>

              {/* Graphical Lock Dial Mechanism */}
              <div className="flex flex-col items-center justify-center py-6 relative">
                {/* Outer Ring */}
                <div className="w-48 h-48 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center relative shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
                  
                  {/* Cylinder Keyway (Rotating) */}
                  <div
                    className="w-24 h-24 rounded-full border-2 border-amber-500/60 bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center shadow-lg transition-transform duration-100"
                    style={{ transform: `rotate(${cylinderRotation}deg)` }}
                  >
                    {/* Keyhole Slot */}
                    <div className="w-2.5 h-12 bg-slate-950 border border-slate-700 rounded-sm" />
                  </div>

                  {/* Pick Needle Indicator (Player Controlled Angle) */}
                  <div
                    className="absolute w-1 h-24 bg-gradient-to-t from-sky-400 to-amber-300 origin-bottom rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)] pointer-events-none transition-transform duration-75"
                    style={{
                      bottom: '50%',
                      transform: `rotate(${pickAngle - 90}deg)`,
                    }}
                  />
                </div>

                {/* Lock Status Overlay */}
                {vaultUnlocked && (
                  <div className="absolute inset-0 bg-emerald-950/90 rounded-2xl flex flex-col items-center justify-center gap-2 animate-fadeIn border border-emerald-400">
                    <span className="text-5xl animate-bounce">🎁</span>
                    <span className="text-sm font-black text-amber-300 uppercase tracking-widest">
                      СУНДУК УСПЕШНО ВЗЛОМАН!
                    </span>
                    <button
                      onClick={() => handleResetLock()}
                      className="py-2 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      Взломать следующий замок
                    </button>
                  </div>
                )}
              </div>

              {/* Controls Toolbar */}
              <div className="space-y-3">
                {/* Angle Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-black text-slate-300">
                    <span>Положение отмычки:</span>
                    <span className="font-mono text-amber-400">{pickAngle}° (из 180°)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={pickAngle}
                    disabled={vaultUnlocked}
                    onChange={e => {
                      setPickAngle(parseInt(e.target.value, 10));
                      setCylinderRotation(0);
                    }}
                    className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-800"
                  />
                </div>

                {/* Action Tension Turn Button */}
                <button
                  onClick={handleTurnTension}
                  disabled={vaultUnlocked || lockPicks <= 0}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:scale-[1.01] text-slate-950 font-black text-xs border border-amber-300 shadow-xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🔐</span>
                  <span>Повернуть Замок Отмычкой (Натяжение)</span>
                </button>
              </div>

              {/* Status Message Box */}
              <div className="p-2.5 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 font-mono shadow">
                {logMsg}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Map Fragments & Expedition */}
        {activeTab === 'maps' && (
          <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-black text-xs text-amber-300 uppercase">
                📜 Картографический Стол Исследователя
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Собирайте древние обрывки карт с монстров подземелий и объединяйте их в полноценные Карты Сокровищ!
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleCombineFragments}
                  disabled={mapFragments < 3}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 disabled:opacity-40 text-white font-black text-xs border border-emerald-400 shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>🗺️</span>
                  <span>Собрать Карту из 3-х Обрывков ({mapFragments} из 3)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="text-2xl">📜</span>
                <div className="font-black text-xs text-slate-200">Обрывки Карт</div>
                <div className="text-[11px] text-slate-400 font-mono">В наличии: {mapFragments} штук</div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="text-2xl">🗺️</span>
                <div className="font-black text-xs text-slate-200">Готовые Карты</div>
                <div className="text-[11px] text-slate-400 font-mono">В наличии: {completeMaps} штук</div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="text-2xl">🔓</span>
                <div className="font-black text-xs text-slate-200">Взломано Тайников</div>
                <div className="text-[11px] text-slate-400 font-mono">Всего: {totalUnlocked} тайников</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Jackpot Fortune */}
        {activeTab === 'jackpot' && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 flex-1 min-h-0 overflow-y-auto">
            <span className="text-5xl animate-bounce inline-block">🎰</span>
            <h3 className="font-black text-base text-amber-300 uppercase">Колесо Фортуны Бездны</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Испытайте удачу за 1 Карту Сокровищ, чтобы получить Джекпот: до 500 000 золота, легендарное снаряжение и древние руны!
            </p>
            <button
              onClick={() => {
                if (completeMaps <= 0) {
                  setLogMsg('⚠️ Для вращения Колеса Фортуны требуется 1 Карта Сокровищ!');
                  return;
                }
                setCompleteMaps(prev => prev - 1);
                sound.playLevelUp();
                const jackpotGold = level * 10000 + 25000;
                useGame.setState(s => ({
                  gold: s.gold + jackpotGold,
                  log: [...s.log, { id: Date.now(), text: `🎰 ДЖЕКПОТ БЕЗДНЫ! Выиграно +${fmt(jackpotGold)} золота!`, color: '#facc15', time: Date.now() }]
                }));
                setLogMsg(`🎰 ДЖЕКПОТ! Вы получили +${fmt(jackpotGold)} золота и Астральные сокровища!`);
              }}
              disabled={completeMaps <= 0}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-105 disabled:opacity-40 text-slate-950 font-black text-xs border border-amber-300 shadow-2xl transition-all active:scale-95 cursor-pointer"
            >
              Вращать за 1 Карту Сокровищ ({completeMaps} в наличии)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
