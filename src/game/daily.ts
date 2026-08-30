import { sound } from './sound';

export interface DailyReward {
  day: number;
  title: string;
  desc: string;
  icon: string;
  gold?: number;
  xp?: number;
  stones?: number;
  shards?: number;
  gemType?: 'ruby' | 'diamond' | 'amethyst' | 'sapphire';
  gemTier?: number;
  tarotCard?: boolean;
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, title: 'Золотой Дар Новичка', desc: '25 000 Золота и 5 Камней Усиления', icon: '💰', gold: 25000, stones: 5 },
  { day: 2, title: 'Астральный Опыт', desc: '15 000 XP и 10 Камней Усиления', icon: '✨', xp: 15000, stones: 10 },
  { day: 3, title: 'Сияющий Алмаз', desc: 'Алмаз ★2 и 50 000 Золота', icon: '💎', gemType: 'diamond', gemTier: 2, gold: 50000 },
  { day: 4, title: 'Карта Судьбы', desc: 'Случайная Карта Таро и 15 Камней', icon: '🎴', tarotCard: true, stones: 15 },
  { day: 5, title: 'Королевский Банк', desc: '150 000 Золота и 25 Осколков Небес', icon: '👑', gold: 150000, shards: 25 },
  { day: 6, title: 'Пламенный Рубин', desc: 'Рубин ★3 и 20 Камней Усиления', icon: '🔴', gemType: 'ruby', gemTier: 3, stones: 20 },
  { day: 7, title: 'Астральное Благословение', desc: 'Божественный Алмаз ★4 + 250 000 Золота + 50 Камней!', icon: '🌟', gemType: 'diamond', gemTier: 4, gold: 250000, stones: 50, shards: 50 },
];

export function getDailyStreakInfo(): {
  currentDay: number;
  canClaim: boolean;
  lastClaimDate: string | null;
  claimedDays: number[];
} {
  try {
    const lastDate = localStorage.getItem('storm_daily_last_date');
    const streak = parseInt(localStorage.getItem('storm_daily_streak') || '0', 10);
    const claimedStr = localStorage.getItem('storm_daily_claimed') || '[]';
    const claimed: number[] = JSON.parse(claimedStr);

    const today = new Date().toISOString().slice(0, 10);
    const canClaim = lastDate !== today;
    const currentDay = Math.min(7, (streak % 7) + 1);

    return {
      currentDay,
      canClaim,
      lastClaimDate: lastDate,
      claimedDays: claimed,
    };
  } catch {
    return { currentDay: 1, canClaim: true, lastClaimDate: null, claimedDays: [] };
  }
}

export function claimDailyReward(day: number): { success: boolean; reward?: DailyReward } {
  const info = getDailyStreakInfo();
  if (!info.canClaim && info.claimedDays.includes(day)) {
    return { success: false };
  }

  const reward = DAILY_REWARDS.find(r => r.day === day);
  if (!reward) return { success: false };

  const today = new Date().toISOString().slice(0, 10);
  const newStreak = (parseInt(localStorage.getItem('storm_daily_streak') || '0', 10) + 1);
  const newClaimed = [...info.claimedDays, day];

  localStorage.setItem('storm_daily_last_date', today);
  localStorage.setItem('storm_daily_streak', newStreak.toString());
  localStorage.setItem('storm_daily_claimed', JSON.stringify(newClaimed));

  sound.playLevelUp();
  return { success: true, reward };
}
