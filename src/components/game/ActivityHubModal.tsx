import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useGame } from '@/game/store';
import { fmt } from '@/game/engine';
import { getDailyStreakInfo } from '@/game/daily';

interface ActivityCard {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  badge?: string;
  badgeColor?: string;
  category: 'trials' | 'city' | 'hero';
  action: () => void;
}

export default function ActivityHubModal({
  onClose,
  onOpenMerchant,
  onOpenForge,
  onOpenAlchemy,
  onOpenExpeditions,
  onOpenCasino,
  onOpenCosmetics,
  onOpenDaily,
  onOpenBestiary,
  onOpenLabyrinth,
  onOpenTower,
  onOpenTreasure,
  onOpenReset,
}: {
  onClose: () => void;
  onOpenMerchant: () => void;
  onOpenForge: () => void;
  onOpenAlchemy: () => void;
  onOpenExpeditions: () => void;
  onOpenCasino: () => void;
  onOpenCosmetics: () => void;
  onOpenDaily: () => void;
  onOpenBestiary: () => void;
  onOpenLabyrinth: () => void;
  onOpenTower: () => void;
  onOpenTreasure: () => void;
  onOpenReset: () => void;
}) {
  useEscapeKey(onClose);
  const streakInfo = getDailyStreakInfo();
  const gold = useGame(s => s.gold);
  const stones = useGame(s => s.enhancementStones || 0);

  const activities: ActivityCard[] = [
    // Trials & Dungeons
    {
      id: 'labyrinth',
      name: 'Лабиринт Бездны',
      subtitle: 'Процедурный 5х5 лабиринт с ловушками, алтарями и Минотавром',
      icon: '🏰',
      color: '#38bdf8',
      category: 'trials',
      action: () => { onClose(); onOpenLabyrinth(); }
    },
    {
      id: 'tower',
      name: 'Башня Испытаний',
      subtitle: 'Бесконечные этажи, Хранители, реликвии и режим Хардкора',
      icon: '⚔️',
      color: '#a855f7',
      category: 'trials',
      action: () => { onClose(); onOpenTower(); }
    },
    {
      id: 'treasure',
      name: 'Карты Сокровищ',
      subtitle: 'Мини-игра взлома замков отмычками и поиск сундуков древних',
      icon: '🗺️',
      color: '#facc15',
      category: 'trials',
      action: () => { onClose(); onOpenTreasure(); }
    },
    {
      id: 'expeditions',
      name: 'Отряды Наёмников',
      subtitle: 'Тактический менеджмент отрядов, экипировка и тайм-миссии',
      icon: '🛡️',
      color: '#60a5fa',
      category: 'trials',
      action: () => { onClose(); onOpenExpeditions(); }
    },

    // City & Crafting
    {
      id: 'merchant',
      name: 'Торговая Гильдия',
      subtitle: 'Скупка лута, караваны, контракты наёмников и Чёрный Рынок',
      icon: '🏪',
      color: '#f59e0b',
      category: 'city',
      action: () => { onClose(); onOpenMerchant(); }
    },
    {
      id: 'forge',
      name: 'Великая Кузница',
      subtitle: 'Заточка предметов +20, инкрустация камней и Рунические Слова',
      icon: '🔨',
      color: '#f97316',
      badge: `${stones} 💎`,
      badgeColor: '#fb923c',
      category: 'city',
      action: () => { onClose(); onOpenForge(); }
    },
    {
      id: 'alchemy',
      name: 'Оранжерея & Алхимия',
      subtitle: 'Ботанические грядки, сбор редких трав и варка боевых зелий',
      icon: '🧪',
      color: '#10b981',
      category: 'city',
      action: () => { onClose(); onOpenAlchemy(); }
    },
    {
      id: 'casino',
      name: 'Казино Гоблинов',
      subtitle: 'Колесо Фортуны, Кости с гоблином и Арканы Карт Таро',
      icon: '🎰',
      color: '#f43f5e',
      category: 'city',
      action: () => { onClose(); onOpenCasino(); }
    },

    // Hero & Archives
    {
      id: 'cosmetics',
      name: 'Гардероб Крыльев',
      subtitle: '5 видов величественных крыльев и Созвездия Вознесения',
      icon: '🪽',
      color: '#c084fc',
      category: 'hero',
      action: () => { onClose(); onOpenCosmetics(); }
    },
    {
      id: 'bestiary',
      name: 'Полный Бестиарий',
      subtitle: '50+ монстров, 16 боссов зон, 8 боссов подземелий и ранги мастерства',
      icon: '📖',
      color: '#818cf8',
      category: 'hero',
      action: () => { onClose(); onOpenBestiary(); }
    },
    {
      id: 'daily',
      name: 'Ежедневные Награды',
      subtitle: 'Календарь серии входов с золотом, камнями и картами Таро',
      icon: '📅',
      color: '#eab308',
      badge: streakInfo.canClaim ? 'ДОСТУПНО!' : undefined,
      badgeColor: '#ef4444',
      category: 'hero',
      action: () => { onClose(); onOpenDaily(); }
    },
    {
      id: 'characters',
      name: 'Слоты Персонажей',
      subtitle: 'Управление героями, смена классов и новое сохранение',
      icon: '👥',
      color: '#94a3b8',
      category: 'hero',
      action: () => { onClose(); onOpenReset(); }
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans animate-fadeIn">
      <div className="bg-slate-950 border border-slate-700/80 rounded-3xl max-w-5xl w-full p-5 shadow-[0_0_60px_rgba(0,0,0,0.8)] space-y-4 relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-slate-900 border border-slate-700 rounded-2xl shadow">🧭</span>
            <div>
              <h2 className="font-black text-lg text-white tracking-wide">
                НАВИГАТОР АКТИВНОСТЕЙ & ЗАЛЫ МИРА
              </h2>
              <p className="text-xs text-slate-400">
                Быстрый доступ ко всем подземельям, ремесленным мастерским и коллекциям
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Directory */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-5">
          
          {/* Group 1: Trials & Dungeons */}
          <div className="space-y-2">
            <div className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <span>⚔️</span>
              <span>Подземелья и Испытания</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {activities.filter(a => a.category === 'trials').map(card => (
                <button
                  key={card.id}
                  onClick={card.action}
                  className="p-3.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 group shadow cursor-pointer active:scale-98"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-1.5 bg-slate-950 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">
                        {card.icon}
                      </span>
                      {card.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black font-mono shadow" style={{ backgroundColor: `${card.badgeColor}22`, color: card.badgeColor, border: `1px solid ${card.badgeColor}55` }}>
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <div className="font-black text-xs text-white group-hover:text-sky-300 transition-colors" style={{ color: card.color }}>
                      {card.name}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-snug">
                      {card.subtitle}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-sky-400/80 group-hover:text-sky-300 flex items-center gap-1">
                    <span>Войти</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: City & Crafting */}
          <div className="space-y-2">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <span>🏛️</span>
              <span>Городские Залы и Ремесло</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {activities.filter(a => a.category === 'city').map(card => (
                <button
                  key={card.id}
                  onClick={card.action}
                  className="p-3.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 group shadow cursor-pointer active:scale-98"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-1.5 bg-slate-950 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">
                        {card.icon}
                      </span>
                      {card.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black font-mono shadow" style={{ backgroundColor: `${card.badgeColor}22`, color: card.badgeColor, border: `1px solid ${card.badgeColor}55` }}>
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <div className="font-black text-xs text-white group-hover:text-amber-300 transition-colors" style={{ color: card.color }}>
                      {card.name}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-snug">
                      {card.subtitle}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-amber-400/80 group-hover:text-amber-300 flex items-center gap-1">
                    <span>Открыть</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Group 3: Hero & Archives */}
          <div className="space-y-2">
            <div className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <span>🌟</span>
              <span>Герой, Коллекция и Награды</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {activities.filter(a => a.category === 'hero').map(card => (
                <button
                  key={card.id}
                  onClick={card.action}
                  className="p-3.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 group shadow cursor-pointer active:scale-98"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-1.5 bg-slate-950 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">
                        {card.icon}
                      </span>
                      {card.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black font-mono shadow animate-pulse" style={{ backgroundColor: `${card.badgeColor}22`, color: card.badgeColor, border: `1px solid ${card.badgeColor}55` }}>
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <div className="font-black text-xs text-white group-hover:text-purple-300 transition-colors" style={{ color: card.color }}>
                      {card.name}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-snug">
                      {card.subtitle}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-purple-400/80 group-hover:text-purple-300 flex items-center gap-1">
                    <span>Смотреть</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
          <span>Баланс: <b className="text-amber-300">💰 {fmt(gold)}g</b></span>
          <span className="text-slate-500">Нажмите ESC для закрытия</span>
        </div>
      </div>
    </div>
  );
}
