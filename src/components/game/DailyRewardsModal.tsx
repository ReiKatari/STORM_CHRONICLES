import { useState } from 'react';
import { useGame } from '@/game/store';
import { DAILY_REWARDS, getDailyStreakInfo, claimDailyReward } from '@/game/daily';
import { createGem } from '@/game/gems';
import { TAROT_DECK } from '@/game/tarot';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export default function DailyRewardsModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);

  const [streakInfo, setStreakInfo] = useState(getDailyStreakInfo());
  const [claimFeedback, setClaimFeedback] = useState<string | null>(null);

  const handleClaim = (day: number) => {
    const res = claimDailyReward(day);
    if (res.success && res.reward) {
      const rew = res.reward;
      setClaimFeedback(`🎉 Получена награда Дня ${day}: ${rew.title}!`);
      
      // Grant to Store
      if (rew.gold) useGame.setState(s => ({ gold: s.gold + rew.gold! }));
      if (rew.xp) useGame.setState(s => ({ xp: s.xp + rew.xp! }));
      if (rew.stones) useGame.setState(s => ({ enhancementStones: (s.enhancementStones || 0) + rew.stones! }));
      if (rew.shards) useGame.setState(s => ({ celestialShards: (s.celestialShards || 0) + rew.shards! }));
      if (rew.gemType && rew.gemTier) {
        useGame.setState(s => ({ gemsInventory: [...s.gemsInventory, createGem(rew.gemType!, rew.gemTier as any)] }));
      }
      if (rew.tarotCard) {
        const randomCard = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
        useGame.setState(s => ({ tarotCards: [...s.tarotCards, randomCard] }));
      }

      setStreakInfo(getDailyStreakInfo());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl shadow-lg">
              📅
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Календарь Ежедневных Наград
              </h2>
              <p className="text-xs text-slate-400">
                Заходите каждый день и получайте редкие самоцветы, золото и карты судьбы!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[ESC]</span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-lg transition-colors border border-slate-700 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {claimFeedback && (
          <div className="p-3 bg-amber-950/80 border border-amber-500/60 rounded-2xl text-center text-xs font-black text-amber-300 mb-4 animate-bounce">
            {claimFeedback}
          </div>
        )}

        {/* 7-Day Rewards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1 overflow-y-auto pr-1">
          {DAILY_REWARDS.map((rew) => {
            const isClaimed = streakInfo.claimedDays.includes(rew.day);
            const isAvailable = streakInfo.canClaim && streakInfo.currentDay === rew.day;
            const isFuture = rew.day > streakInfo.currentDay;

            return (
              <div
                key={rew.day}
                className={`relative rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                  isAvailable
                    ? 'bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/40'
                    : isClaimed
                    ? 'bg-slate-950/60 border-slate-800 opacity-60'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      День {rew.day}
                    </span>
                    {isClaimed && <span className="text-emerald-400 text-xs font-bold">✓ Получено</span>}
                  </div>

                  <div className="flex flex-col items-center text-center my-3">
                    <span className="text-4xl mb-2 filter drop-shadow">{rew.icon}</span>
                    <div className="text-xs font-black text-white">{rew.title}</div>
                    <div className="text-[11px] text-slate-300 mt-1 leading-tight">{rew.desc}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  {isAvailable ? (
                    <button
                      onClick={() => handleClaim(rew.day)}
                      className="w-full py-2.5 rounded-xl font-black text-xs rpg-button-gold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Забрать награду!
                    </button>
                  ) : isClaimed ? (
                    <div className="py-2 text-center text-[10px] font-bold text-slate-500 font-mono">
                      Уже получено
                    </div>
                  ) : (
                    <div className="py-2 text-center text-[10px] font-bold text-slate-500 font-mono">
                      {isFuture ? 'Откроется позже' : 'Пропущено'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
