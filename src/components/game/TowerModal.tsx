import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/game/store';
import { fmt, computeDerived, mitigate } from '@/game/engine';
import { FAMILIES } from '@/game/monsters';
import { getClassById } from '@/game/classes';
import { sound } from '@/game/sound';
import { useEscapeKey } from '@/hooks/useEscapeKey';

const imageCache: Record<string, HTMLImageElement> = {};
function getImageAsset(src: string): HTMLImageElement | null {
  if (!src) return null;
  if (!imageCache[src]) {
    const img = new Image();
    img.src = src;
    imageCache[src] = img;
  }
  return imageCache[src].complete && imageCache[src].naturalWidth > 0 ? imageCache[src] : null;
}

export interface TowerModifier {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
}

const TOWER_MODIFIERS: TowerModifier[] = [
  { id: 'm_poison', name: 'Ядовитый Туман Бездны', icon: '☣️', desc: 'Герой теряет 2% Здоровья каждую секунду боя.', color: '#22c55e' },
  { id: 'm_antimagic', name: 'Антимагический Купол', icon: '🛡️', desc: 'Урон от магических способностей снижен на 30%.', color: '#38bdf8' },
  { id: 'm_nopotions', name: 'Дуэль Без Зелей', icon: '🩸', desc: 'Целительные эффекты снижены на 40%.', color: '#ef4444' },
  { id: 'm_frenzy', name: 'Ярость Стража Башни', icon: '⚡', desc: 'Страж атакует на 40% быстрее.', color: '#facc15' },
  { id: 'm_vampire', name: 'Вампиризм Тьмы', icon: '🍷', desc: 'Страж восстанавливает 20% Здоровья от нанесенного урона.', color: '#a855f7' },
  { id: 'm_frost', name: 'Ледяной Ступор', icon: '❄️', desc: 'Скорость атаки Героя снижена на 25%.', color: '#0ea5e9' },
  { id: 'm_lava', name: 'Лавовый Всплеск', icon: '🌋', desc: 'Периодические огненные взрывы наносят урон обоим бойцам.', color: '#f97316' },
  { id: 'm_curse', name: 'Проклятие Владыки', icon: '👑', desc: 'Страж обладает +80% дополнительной Брони.', color: '#eab308' },
];

const GUARDIAN_FAMILIES = [
  'goblin', 'skeleton', 'zombie', 'spider', 'wolf', 'orc', 'golem', 'cultist',
  'demon', 'elemental_fire', 'elemental_ice', 'mage', 'knight', 'dragon',
  'lich', 'gargoyle', 'minotaur', 'hydra', 'treant', 'wyvern', 'beholder',
  'kraken', 'manticore', 'basilisk', 'archdemon', 'abyss'
];

interface TowerAltarUpgrade {
  id: string;
  name: string;
  icon: string;
  desc: string;
  baseCost: number;
  costMult: number;
}

const ALTAR_UPGRADES: TowerAltarUpgrade[] = [
  { id: 'u_dmg', name: 'Ярость Титана', icon: '⚔️', desc: '+6% к Урону Героя в Башне за уровень', baseCost: 50, costMult: 1.45 },
  { id: 'u_armor', name: 'Астральный Панцирь', icon: '🛡️', desc: '+8% к Броне Героя в Башне за уровень', baseCost: 50, costMult: 1.45 },
  { id: 'u_gold', name: 'Благословение Богатства', icon: '🪙', desc: '+20% Золота за победы в Башне за уровень', baseCost: 40, costMult: 1.35 },
  { id: 'u_regen', name: 'Сердце Феникса', icon: '❤️', desc: '+3% Восстановления Здоровья каждую секунду боя', baseCost: 75, costMult: 1.55 },
  { id: 'u_boss_dmg', name: 'Убийца Владыки', icon: '💥', desc: '+10% Дополнительного Урона по Боссам в Башне', baseCost: 100, costMult: 1.6 },
  { id: 'u_shield', name: 'Первозданный Щит', icon: '🛡️', desc: '+10% Стартового Щита в начале каждого боя', baseCost: 80, costMult: 1.5 },
  { id: 'u_shards', name: 'Астральный Магнат', icon: '🔮', desc: '+25% К Дополнительным Осколкам за победы', baseCost: 120, costMult: 1.65 },
  { id: 'u_crit_dmg', name: 'Точность Судьбы', icon: '⚡', desc: '+15% К Силе Критического Урона в Башне', baseCost: 90, costMult: 1.5 },
];

interface TowerRelic {
  id: string;
  name: string;
  icon: string;
  reqFloor: number;
  desc: string;
  color: string;
}

const TOWER_RELICS: TowerRelic[] = [
  { id: 'r_crown', name: 'Корона Завоевателя', icon: '👑', reqFloor: 10, desc: '+10% Шанс Критического Удара и +25% Критического Урона в Башне', color: '#facc15' },
  { id: 'r_shield', name: 'Щит Астрального Титана', icon: '🛡️', reqFloor: 20, desc: 'Старт каждого боя с +35% Щита от Максимального Здоровья', color: '#38bdf8' },
  { id: 'r_speed', name: 'Сфера Скорости Мысли', icon: '⚡', reqFloor: 30, desc: '+25% к Скорости Атаки Героя во время штурма', color: '#a855f7' },
  { id: 'r_eye', name: 'Глаз Бездонного Владыки', icon: '🔮', reqFloor: 40, desc: '+35% к Урону активных Способностей в Башне', color: '#ec4899' },
  { id: 'r_gold', name: 'Печать Вечного Богатства', icon: '💎', reqFloor: 50, desc: '+50% к Наградам Золота и Осколков в Башне', color: '#10b981' },
  { id: 'r_dragon', name: 'Сердце Древнего Дракона', icon: '🐉', reqFloor: 75, desc: 'Авто-воскрешение 1 раз за бой с 50% Здоровья при смертельном уроне!', color: '#ef4444' },
  { id: 'r_god', name: 'Аудиенция Творца Миров', icon: '🌟', reqFloor: 100, desc: 'Все характеристики Героя в Башне увеличены на +100%!', color: '#eab308' },
];

interface MilestoneChest {
  floor: number;
  gold: number;
  shards: number;
  title: string;
}

const MILESTONE_CHESTS: MilestoneChest[] = [
  { floor: 5, gold: 5000, shards: 50, title: 'Сундук Малого Первопроходца' },
  { floor: 10, gold: 15000, shards: 120, title: 'Сокровище Завоевателя Башни I' },
  { floor: 15, gold: 30000, shards: 200, title: 'Астральный Ларец Бездны' },
  { floor: 20, gold: 60000, shards: 350, title: 'Сокровище Завоевателя Башни II' },
  { floor: 25, gold: 120000, shards: 500, title: 'Древний Сундук Огненных Владыки' },
  { floor: 30, gold: 250000, shards: 750, title: 'Сокровище Завоевателя Башни III' },
  { floor: 40, gold: 500000, shards: 1200, title: 'Небесный Ковчег Звезд' },
  { floor: 50, gold: 1000000, shards: 2000, title: 'Легендарный Ларец Вечности' },
  { floor: 75, gold: 3000000, shards: 5000, title: 'Драконий Тайник Бездны' },
  { floor: 100, gold: 10000000, shards: 15000, title: 'Корона Древнего Творца' },
];

interface FloatingFx {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  life: number;
}

interface ParticleFx {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

export default function TowerModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const [activeTab, setActiveTab] = useState<'battle' | 'altar' | 'relics' | 'chests' | 'floors'>('battle');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [maxFloor, setMaxFloor] = useState<number>(() => {
    const saved = localStorage.getItem('storm_tower_max_floor');
    return saved ? Math.max(1, parseInt(saved, 10)) : 1;
  });
  const [autoClimb, setAutoClimb] = useState(false);
  const autoClimbRef = useRef(false);

  useEffect(() => {
    autoClimbRef.current = autoClimb;
  }, [autoClimb]);

  // Hardcore Challenge Mutator Toggle
  const [challengeMode, setChallengeMode] = useState(false);

  // Tower Stats & Persistence
  const [towerShards, setTowerShards] = useState<number>(() => {
    const saved = localStorage.getItem('storm_tower_shards');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [altarLevels, setAltarLevels] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('storm_tower_altar_levels');
    return saved ? JSON.parse(saved) : { u_dmg: 0, u_armor: 0, u_gold: 0, u_regen: 0 };
  });

  const [claimedChests, setClaimedChests] = useState<number[]>(() => {
    const saved = localStorage.getItem('storm_tower_claimed_chests');
    return saved ? JSON.parse(saved) : [];
  });

  const [totalBossKills, setTotalBossKills] = useState<number>(() => {
    const saved = localStorage.getItem('storm_tower_boss_kills');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Active Combat State
  const [inBattle, setInBattle] = useState(false);
  const [battleResult, setBattleResult] = useState<'won' | 'lost' | null>(null);
  const [ascensionAnim, setAscensionAnim] = useState(false);
  const [revivedInBattle, setRevivedInBattle] = useState(false);

  const [guardianHp, setGuardianHp] = useState(100);
  const [guardianMaxHp, setGuardianMaxHp] = useState(100);
  const [guardianShield, setGuardianShield] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  const [playerShield, setPlayerShield] = useState(0);
  const [battleLog, setBattleLog] = useState<string>('⚔️ Вы стоите у Врат Бесконечной Башни Испытаний!');

  // Synchronous Refs for Combat Loop
  const battleIntervalRef = useRef<number | null>(null);
  const autoClimbTimerRef = useRef<number | null>(null);
  const curGHpRef = useRef(100);
  const curGShieldRef = useRef(0);
  const curPHpRef = useRef(100);
  const curPShieldRef = useRef(0);

  // Skill Cooldowns
  const [cdThunder, setCdThunder] = useState(0);
  const [cdShield, setCdShield] = useState(0);
  const [cdHeal, setCdHeal] = useState(0);

  const [activeMod, setActiveMod] = useState<TowerModifier>(TOWER_MODIFIERS[0]);

  // Canvas Refs & FX
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const floatingTexts = useRef<FloatingFx[]>([]);
  const particles = useRef<ParticleFx[]>([]);
  const heroLunge = useRef<number>(0);
  const guardianHit = useRef<number>(0);
  const spellEffect = useRef<{ type: string; progress: number } | null>(null);

  const level = useGame(s => s.level);
  const classId = useGame(s => s.classId);
  const heroClass = classId ? getClassById(classId) : null;

  // Guardian & Biome Definitions (Defined before effects!)
  const famId = GUARDIAN_FAMILIES[(currentFloor - 1) % GUARDIAN_FAMILIES.length];
  const famDef = FAMILIES.find(f => f.id === famId) ?? FAMILIES[0];
  const isBossFloor = currentFloor % 5 === 0;
  const guardianName = isBossFloor
    ? `🔥 ВЛАДЫКА ЭТАЖА ${currentFloor}: ${famDef.name.toUpperCase()}`
    : `Страж Бездны (${famDef.name})`;

  // Biome Themes based on Floor Range
  const getBiomeTheme = (fl: number) => {
    if (fl <= 10) return { name: 'Обсидиановый Спираль', main: '#a855f7', bg1: '#1a0b2e', bg2: '#0b0416', particle: '#c084fc', icon: '🔮' };
    if (fl <= 20) return { name: 'Адское Жерло', main: '#ef4444', bg1: '#2b0909', bg2: '#0f0202', particle: '#f97316', icon: '🌋' };
    if (fl <= 30) return { name: 'Ледяной Цитадель', main: '#38bdf8', bg1: '#092536', bg2: '#030c14', particle: '#7dd3fc', icon: '❄️' };
    if (fl <= 40) return { name: 'Астральный Бездна', main: '#ec4899', bg1: '#280824', bg2: '#0e020d', particle: '#f472b6', icon: '🌟' };
    if (fl <= 50) return { name: 'Святилище Солнца', main: '#eab308', bg1: '#262006', bg2: '#0d0b02', particle: '#fde047', icon: '👑' };
    return { name: 'Апекс Богов', main: '#34d399', bg1: '#07261d', bg2: '#020d0a', particle: '#6ee7b7', icon: '⚡' };
  };

  const currentBiome = getBiomeTheme(currentFloor);

  // Safe Hero Combat Stats Helper
  const getHeroCombatStats = () => {
    const s = useGame.getState();
    const d = s.derived || computeDerived(s.level || 1, s.stats || {}, s.equipment || {}, s.talents || {});
    const baseAtk = (d.dmgMin && d.dmgMax) ? Math.round((d.dmgMin + d.dmgMax) / 2) : (s.playerAtk || 25);
    return {
      playerAtk: Math.max(15, baseAtk),
      maxHp: d.maxHp || 1000,
      armor: d.armor || 5,
      critRate: d.critChance || 5,
      critDmg: d.critMult || 1.8,
    };
  };

  // Preload art assets on mount
  useEffect(() => {
    if (heroClass?.artSrc) getImageAsset(heroClass.artSrc);
    if (famDef?.artSrc) getImageAsset(famDef.artSrc);
  }, [heroClass, famDef]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('storm_tower_max_floor', maxFloor.toString());
  }, [maxFloor]);

  useEffect(() => {
    localStorage.setItem('storm_tower_shards', towerShards.toString());
  }, [towerShards]);

  useEffect(() => {
    localStorage.setItem('storm_tower_altar_levels', JSON.stringify(altarLevels));
  }, [altarLevels]);

  useEffect(() => {
    localStorage.setItem('storm_tower_claimed_chests', JSON.stringify(claimedChests));
  }, [claimedChests]);

  useEffect(() => {
    localStorage.setItem('storm_tower_boss_kills', totalBossKills.toString());
  }, [totalBossKills]);

  // Set modifier based on floor
  useEffect(() => {
    const mod = TOWER_MODIFIERS[(currentFloor - 1) % TOWER_MODIFIERS.length];
    setActiveMod(mod);
  }, [currentFloor]);

  // Skill Cooldown Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCdThunder(prev => Math.max(0, prev - 1));
      setCdShield(prev => Math.max(0, prev - 1));
      setCdHeal(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cleanup battle intervals on unmount
  useEffect(() => {
    return () => {
      if (battleIntervalRef.current) clearInterval(battleIntervalRef.current);
      if (autoClimbTimerRef.current) clearTimeout(autoClimbTimerRef.current);
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Scaling multipliers
  const mult = Math.pow(1.15, currentFloor - 1) * (isBossFloor ? 2.3 : 1.0);

  // Active Relic Checks
  const hasRelic = (relicId: string) => {
    const r = TOWER_RELICS.find(rel => rel.id === relicId);
    return r ? maxFloor >= r.reqFloor : false;
  };

  // Altar Multipliers
  let altarDmgMult = 1 + (altarLevels.u_dmg || 0) * 0.06;
  let altarArmorMult = 1 + (altarLevels.u_armor || 0) * 0.08;
  let altarGoldMult = 1 + (altarLevels.u_gold || 0) * 0.20;
  let altarShardMult = 1 + (altarLevels.u_shards || 0) * 0.25;

  if (hasRelic('r_god')) {
    altarDmgMult *= 2.0;
    altarArmorMult *= 2.0;
  }
  if (hasRelic('r_gold')) {
    altarGoldMult *= 1.5;
    altarShardMult *= 1.5;
  }

  // Unified Battle Victory Trigger
  const triggerVictory = (targetFloor: number, flMult: number) => {
    if (battleIntervalRef.current) {
      clearInterval(battleIntervalRef.current);
      battleIntervalRef.current = null;
    }

    setInBattle(false);
    setBattleResult('won');
    sound.playLevelUp();

    if (targetFloor % 5 === 0) {
      setTotalBossKills(prev => prev + 1);
    }

    const goldEarned = Math.round((targetFloor * 450 + 400) * flMult * altarGoldMult * (challengeMode ? 1.5 : 1.0));
    const shardsEarned = Math.round((12 + targetFloor * 5) * (targetFloor % 5 === 0 ? 3.5 : 1.0) * altarShardMult * (challengeMode ? 1.8 : 1.0));

    useGame.setState(s => ({
      gold: s.gold + goldEarned,
      log: [...s.log, { id: Date.now(), text: `🏰 БАШНЯ: Повержен Страж ${targetFloor} Этажа! +${fmt(goldEarned)}g, +${shardsEarned} Осколков`, color: '#facc15', time: Date.now() }]
    }));

    setTowerShards(prev => prev + shardsEarned);
    const nextF = targetFloor + 1;
    setMaxFloor(prev => Math.max(prev, nextF));
    setBattleLog(`🎉 ПОБЕДА! Повержен ${targetFloor % 5 === 0 ? 'Владыка' : 'Страж'} ${targetFloor} этажа! +${fmt(goldEarned)}g Золота и +${shardsEarned} Осколков!`);

    setAscensionAnim(true);

    if (autoClimbRef.current) {
      if (autoClimbTimerRef.current) clearTimeout(autoClimbTimerRef.current);
      autoClimbTimerRef.current = window.setTimeout(() => {
        setCurrentFloor(nextF);
        startBattleFloor(nextF);
      }, 900);
    }
  };

  // Active Combat Skills Handlers
  const castThunderStrike = () => {
    if (cdThunder > 0 || curGHpRef.current <= 0) return;
    setCdThunder(6);
    sound.playHit();
    spellEffect.current = { type: 'thunder', progress: 1.0 };

    const heroStats = getHeroCombatStats();
    let thunderDmg = Math.round(heroStats.playerAtk * altarDmgMult * 2.2);
    if (hasRelic('r_eye')) thunderDmg = Math.round(thunderDmg * 1.35);

    if (curGShieldRef.current > 0) {
      if (curGShieldRef.current >= thunderDmg) {
        curGShieldRef.current -= thunderDmg;
      } else {
        const overflow = thunderDmg - curGShieldRef.current;
        curGShieldRef.current = 0;
        curGHpRef.current = Math.max(0, curGHpRef.current - overflow);
      }
    } else {
      curGHpRef.current = Math.max(0, curGHpRef.current - thunderDmg);
    }

    setGuardianHp(curGHpRef.current);
    setGuardianShield(curGShieldRef.current);

    if (canvasRef.current) {
      floatingTexts.current.push({
        id: Date.now() + Math.random(),
        x: canvasRef.current.width * 0.72,
        y: 90,
        text: `⚡ ГРОМ! -${fmt(thunderDmg)}`,
        color: '#facc15',
        size: 26,
        life: 1.2,
      });
    }

    if (curGHpRef.current <= 0) {
      const flMult = Math.pow(1.15, currentFloor - 1) * (currentFloor % 5 === 0 ? 2.3 : 1.0) * (challengeMode ? 1.4 : 1.0);
      triggerVictory(currentFloor, flMult);
    }
  };

  const castAstralShield = () => {
    if (cdShield > 0 || curPHpRef.current <= 0) return;
    setCdShield(10);
    sound.playBlock();
    spellEffect.current = { type: 'shield', progress: 1.0 };

    // Fixed shield based on Max HP that correctly depletes
    const shieldAmount = Math.round(playerMaxHp * 0.35);
    curPShieldRef.current = Math.min(playerMaxHp * 0.7, curPShieldRef.current + shieldAmount);
    setPlayerShield(curPShieldRef.current);

    if (canvasRef.current) {
      floatingTexts.current.push({
        id: Date.now() + Math.random(),
        x: 140,
        y: 90,
        text: `🛡️ ЩИТ +${fmt(shieldAmount)}`,
        color: '#38bdf8',
        size: 22,
        life: 1.0,
      });
    }
  };

  const castPhoenixHeal = () => {
    if (cdHeal > 0 || curPHpRef.current <= 0) return;
    setCdHeal(12);
    sound.playHoly();
    spellEffect.current = { type: 'heal', progress: 1.0 };

    const healAmount = Math.round(playerMaxHp * 0.40);
    curPHpRef.current = Math.min(playerMaxHp, curPHpRef.current + healAmount);
    setPlayerHp(curPHpRef.current);

    if (canvasRef.current) {
      floatingTexts.current.push({
        id: Date.now() + Math.random(),
        x: 140,
        y: 110,
        text: `💖 ИСЦЕЛЕНИЕ +${fmt(healAmount)}`,
        color: '#4ade80',
        size: 22,
        life: 1.0,
      });
    }
  };

  // Real-time Visual Battle Engine Loop
  const startBattleFloor = (targetFloor: number) => {
    if (battleIntervalRef.current) clearInterval(battleIntervalRef.current);
    if (autoClimbTimerRef.current) clearTimeout(autoClimbTimerRef.current);

    setInBattle(true);
    setBattleResult(null);
    setAscensionAnim(false);
    setRevivedInBattle(false);

    const heroStats = getHeroCombatStats();
    const flMult = Math.pow(1.15, targetFloor - 1) * (targetFloor % 5 === 0 ? 2.3 : 1.0) * (challengeMode ? 1.4 : 1.0);
    const gMaxHp = Math.round((500 + Math.pow(targetFloor, 1.6) * 45) * flMult);
    const gDmgBase = Math.round((55 + Math.pow(targetFloor, 1.45) * 18) * flMult);

    const initialGShield = targetFloor % 5 === 0 ? Math.round(gMaxHp * 0.25) : 0;
    setGuardianMaxHp(gMaxHp);
    setGuardianHp(gMaxHp);
    setGuardianShield(initialGShield);

    curGHpRef.current = gMaxHp;
    curGShieldRef.current = initialGShield;

    const pHpMax = Math.round(heroStats.maxHp * altarArmorMult);
    setPlayerMaxHp(pHpMax);
    setPlayerHp(pHpMax);

    // Initial Shield
    let initialShield = Math.round(pHpMax * 0.10);
    if (altarLevels.u_shield > 0) initialShield += Math.round(pHpMax * (altarLevels.u_shield * 0.08));
    if (hasRelic('r_shield')) initialShield += Math.round(pHpMax * 0.35);

    setPlayerShield(initialShield);
    curPHpRef.current = pHpMax;
    curPShieldRef.current = initialShield;

    setBattleLog(`⚔️ БОЙ НАЧАЛСЯ! Сражение с ${targetFloor % 5 === 0 ? 'Владыкой' : 'Стражем'} на ${targetFloor} этаже...`);

    const attackIntervalMs = activeMod.id === 'm_frenzy' ? 180 : hasRelic('r_speed') ? 170 : 230;
    const dtSeconds = attackIntervalMs / 1000;

    battleIntervalRef.current = window.setInterval(() => {
      // 1. Hero Attacks Guardian
      heroLunge.current = 0.25;
      let critChance = heroStats.critRate / 100;
      if (hasRelic('r_crown')) critChance += 0.10;

      const isCrit = Math.random() < critChance;
      let rawDmg = Math.round(heroStats.playerAtk * altarDmgMult * (0.85 + Math.random() * 0.3));

      // Boss Slayer Altar
      if (targetFloor % 5 === 0 && altarLevels.u_boss_dmg > 0) {
        rawDmg = Math.round(rawDmg * (1 + altarLevels.u_boss_dmg * 0.10));
      }

      let critMultiplier = heroStats.critDmg + (altarLevels.u_crit_dmg || 0) * 0.15;
      if (hasRelic('r_crown')) critMultiplier += 0.25;

      let finalHeroDmg = isCrit ? Math.round(rawDmg * critMultiplier) : rawDmg;
      if (activeMod.id === 'm_antimagic') finalHeroDmg = Math.round(finalHeroDmg * 0.7);

      if (isCrit) sound.playCrit();
      else sound.playSlash();

      if (curGShieldRef.current > 0) {
        if (curGShieldRef.current >= finalHeroDmg) {
          curGShieldRef.current -= finalHeroDmg;
        } else {
          const overflow = finalHeroDmg - curGShieldRef.current;
          curGShieldRef.current = 0;
          curGHpRef.current = Math.max(0, curGHpRef.current - overflow);
        }
      } else {
        curGHpRef.current = Math.max(0, curGHpRef.current - finalHeroDmg);
      }

      setGuardianHp(curGHpRef.current);
      setGuardianShield(curGShieldRef.current);
      guardianHit.current = 0.25;

      if (canvasRef.current) {
        const W = canvasRef.current.width;
        floatingTexts.current.push({
          id: Date.now() + Math.random(),
          x: W * 0.72 + (Math.random() - 0.5) * 40,
          y: 110 + (Math.random() - 0.5) * 30,
          text: isCrit ? `⚡ ${fmt(finalHeroDmg)} КРИТ!` : `⚔️ ${fmt(finalHeroDmg)}`,
          color: isCrit ? '#facc15' : '#ef4444',
          size: isCrit ? 24 : 16,
          life: 0.8,
        });

        for (let i = 0; i < (isCrit ? 12 : 5); i++) {
          particles.current.push({
            x: W * 0.72,
            y: 110,
            vx: (Math.random() - 0.5) * 160,
            vy: (Math.random() - 0.5) * 160,
            size: Math.random() * 4 + 2,
            color: isCrit ? '#facc15' : '#f87171',
            alpha: 1.0,
            life: 0.4 + Math.random() * 0.3,
          });
        }
      }

      if (curGHpRef.current <= 0) {
        triggerVictory(targetFloor, flMult);
        return;
      }

      // 2. Guardian Attacks Hero (Correctly Scales & Penetrates Shield via mitigate)
      let gDmg = mitigate(gDmgBase, heroStats.armor);
      if (activeMod.id === 'm_frenzy') gDmg = Math.round(gDmg * 1.35);

      if (curPShieldRef.current > 0) {
        if (curPShieldRef.current >= gDmg) {
          curPShieldRef.current -= gDmg;
        } else {
          const overflow = gDmg - curPShieldRef.current;
          curPShieldRef.current = 0;
          curPHpRef.current = Math.max(0, curPHpRef.current - overflow);
        }
      } else {
        curPHpRef.current = Math.max(0, curPHpRef.current - gDmg);
      }

      // Vampire Guardian Modifier
      if (activeMod.id === 'm_vampire') {
        curGHpRef.current = Math.min(gMaxHp, curGHpRef.current + Math.round(gDmg * 0.20));
        setGuardianHp(curGHpRef.current);
      }

      // Regenerative Altar: Balanced per-second time slice
      if (altarLevels.u_regen > 0) {
        const regenVal = Math.round(pHpMax * (altarLevels.u_regen * 0.015) * dtSeconds);
        curPHpRef.current = Math.min(pHpMax, curPHpRef.current + regenVal);
      }

      setPlayerHp(curPHpRef.current);
      setPlayerShield(curPShieldRef.current);

      // Hero Defeat Check & Dragon Relic Revive
      if (curPHpRef.current <= 0) {
        if (hasRelic('r_dragon') && !revivedInBattle) {
          setRevivedInBattle(true);
          curPHpRef.current = Math.round(pHpMax * 0.5);
          setPlayerHp(curPHpRef.current);
          sound.playHoly();

          if (canvasRef.current) {
            floatingTexts.current.push({
              id: Date.now() + Math.random(),
              x: 140,
              y: 80,
              text: `🐉 ВОСКРЕШЕНИЕ ДРАКОНА!`,
              color: '#f43f5e',
              size: 24,
              life: 1.5,
            });
          }
        } else {
          if (battleIntervalRef.current) clearInterval(battleIntervalRef.current);
          battleIntervalRef.current = null;

          setInBattle(false);
          setBattleResult('lost');
          setAutoClimb(false);
          setBattleLog(`💀 ПОРАЖЕНИЕ! Страж ${targetFloor} этажа сломил ваше сопротивление. Улучшите Алтарь или Реликвии!`);
        }
      }
    }, attackIntervalMs);
  };

  // Canvas 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    if (particles.current.length < 35) {
      for (let i = 0; i < 35; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 30,
          vy: -Math.random() * 40 - 10,
          size: Math.random() * 3 + 1,
          color: currentBiome.particle,
          alpha: Math.random() * 0.7 + 0.3,
          life: Math.random() * 2 + 1,
        });
      }
    }

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const W = canvas.width;
      const H = canvas.height;

      // Dynamic Biome Background
      ctx.fillStyle = currentBiome.bg2;
      ctx.fillRect(0, 0, W, H);

      const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * 0.65);
      bgGrad.addColorStop(0, currentBiome.bg1);
      bgGrad.addColorStop(0.7, currentBiome.bg2);
      bgGrad.addColorStop(1, '#020108');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      particles.current.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0 || p.y < 0 || p.x < 0 || p.x > W) {
          p.x = Math.random() * W;
          p.y = H + 10;
          p.life = Math.random() * 2 + 1;
        }
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha * (p.life / 2));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Magic Rune Ring
      ctx.save();
      ctx.translate(W / 2, H * 0.80);
      ctx.scale(1, 0.38);
      ctx.strokeStyle = isBossFloor ? '#ef4444' : currentBiome.main;
      ctx.lineWidth = 3;
      ctx.shadowColor = isBossFloor ? '#ef4444' : currentBiome.main;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, 190, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff33';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (heroLunge.current > 0) heroLunge.current = Math.max(0, heroLunge.current - dt * 4);
      if (guardianHit.current > 0) guardianHit.current = Math.max(0, guardianHit.current - dt * 4);

      // Hero Artwork Sprite (With fallback)
      const px = 140 + heroLunge.current * 80;
      const py = H * 0.65;
      const heroArt = heroClass?.artSrc ? getImageAsset(heroClass.artSrc) : null;
      const heroRadius = 38;

      ctx.save();
      if (heroArt) {
        // Draw round portrait
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py - 20, heroRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(heroArt, px - heroRadius, py - 20 - heroRadius, heroRadius * 2, heroRadius * 2);
        ctx.restore();

        // Glowing border / Shield ring
        ctx.strokeStyle = playerShield > 0 ? '#38bdf8' : (heroClass?.color || '#38bdf8');
        ctx.lineWidth = playerShield > 0 ? 4 : 3;
        ctx.shadowColor = playerShield > 0 ? '#38bdf8' : (heroClass?.color || '#38bdf8');
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(px, py - 20, heroRadius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        if (playerShield > 0) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(px, py - 20, 38, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.font = "52px 'Century Gothic', CenturyGothic, sans-serif";
        ctx.textAlign = 'center';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.fillText(heroClass?.icon || '⚔️', px, py);
      }
      ctx.restore();

      // Guardian / Boss Artwork Sprite (With fallback)
      const gx = W - 140 - (guardianHit.current > 0 ? (Math.random() - 0.5) * 14 : 0);
      const gy = H * 0.65;
      const guardArt = famDef?.artSrc ? getImageAsset(famDef.artSrc) : null;
      const guardRadius = isBossFloor ? 52 : 42;

      ctx.save();
      if (guardArt) {
        // Draw round monster portrait
        ctx.save();
        ctx.beginPath();
        ctx.arc(gx, gy - 20, guardRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(guardArt, gx - guardRadius, gy - 20 - guardRadius, guardRadius * 2, guardRadius * 2);
        ctx.restore();

        // Glowing Boss / Guardian border
        const isEnraged = (guardianHp / guardianMaxHp) < 0.3;
        ctx.strokeStyle = isBossFloor || isEnraged ? '#ef4444' : famDef.color;
        ctx.lineWidth = isBossFloor ? 4 : 3;
        ctx.shadowColor = isBossFloor || isEnraged ? '#ef4444' : famDef.color;
        ctx.shadowBlur = isBossFloor ? 25 : 18;
        ctx.beginPath();
        ctx.arc(gx, gy - 20, guardRadius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        if (isBossFloor || (guardianHp / guardianMaxHp) < 0.3) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 30;
        } else {
          ctx.shadowColor = famDef.color;
          ctx.shadowBlur = 20;
        }
        ctx.font = `${isBossFloor ? 68 : 56}px 'Century Gothic', CenturyGothic, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(famDef.icons[0] || '👹', gx, gy);
      }
      ctx.restore();

      // Spell Effects
      if (spellEffect.current) {
        spellEffect.current.progress -= dt * 2;
        if (spellEffect.current.progress <= 0) {
          spellEffect.current = null;
        } else {
          ctx.save();
          if (spellEffect.current.type === 'thunder') {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 5;
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.moveTo(gx, 0);
            ctx.lineTo(gx - 10, gy - 60);
            ctx.lineTo(gx + 15, gy - 40);
            ctx.lineTo(gx, gy);
            ctx.stroke();
          } else if (spellEffect.current.type === 'shield') {
            ctx.fillStyle = 'rgba(56,189,248,0.2)';
            ctx.beginPath();
            ctx.arc(px, py - 20, 50 * (1.2 - spellEffect.current.progress), 0, Math.PI * 2);
            ctx.fill();
          } else if (spellEffect.current.type === 'heal') {
            ctx.fillStyle = 'rgba(74,222,128,0.25)';
            ctx.beginPath();
            ctx.arc(px, py - 20, 55 * (1.2 - spellEffect.current.progress), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // Floating Combat Texts
      floatingTexts.current.forEach(fx => {
        fx.y -= dt * 45;
        fx.life -= dt;
        ctx.save();
        ctx.fillStyle = fx.color;
        ctx.font = `black ${fx.size}px 'Century Gothic', CenturyGothic, sans-serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = Math.max(0, fx.life / 0.8);
        ctx.shadowColor = 'rgba(0,0,0,0.95)';
        ctx.shadowBlur = 8;
        ctx.fillText(fx.text, fx.x, fx.y);
        ctx.restore();
      });
      floatingTexts.current = floatingTexts.current.filter(f => f.life > 0);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [famDef, isBossFloor, heroClass, currentBiome, guardianHp, guardianMaxHp, playerShield]);

  const handleBuyAltarUpgrade = (upg: TowerAltarUpgrade) => {
    const lvl = altarLevels[upg.id] || 0;
    const cost = Math.round(upg.baseCost * Math.pow(upg.costMult, lvl));
    if (towerShards < cost) return;

    sound.playLoot();
    setTowerShards(prev => prev - cost);
    setAltarLevels(prev => ({ ...prev, [upg.id]: lvl + 1 }));
  };

  const handleClaimChest = (chest: MilestoneChest) => {
    if (maxFloor < chest.floor || claimedChests.includes(chest.floor)) return;

    sound.playLevelUp();
    setClaimedChests(prev => [...prev, chest.floor]);
    setTowerShards(prev => prev + chest.shards);
    useGame.setState(s => ({
      gold: s.gold + chest.gold,
      log: [...s.log, { id: Date.now(), text: `🎁 СУНДУК БАШНИ (${chest.floor} Этаж): Получено +${fmt(chest.gold)}g и +${chest.shards} Осколков!`, color: '#38bdf8', time: Date.now() }]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-slate-950 border border-purple-500/50 rounded-2xl max-w-4xl w-full p-4 shadow-[0_0_60px_rgba(168,85,247,0.3)] space-y-3 relative max-h-[94vh] flex flex-col">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-purple-500/10 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]">⚔️</span>
            <div>
              <h2 className="font-black text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span>БЕСКОНЕЧНАЯ БАШНЯ ИСПЫТАНИЙ (TOWER OF TRIALS)</span>
                <span className="text-[10px] text-purple-300 font-mono bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded-full shadow">
                  🔮 {fmt(towerShards)} Осколков
                </span>
              </h2>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Рекорд: <b className="text-purple-300 font-black">{maxFloor} Этаж</b></span>
                <span>·</span>
                <span>Биом: <b style={{ color: currentBiome.main }}>{currentBiome.name}</b></span>
                <span>·</span>
                <span>Сложность: <b className="text-amber-300 font-black">x{mult.toFixed(1)}</b></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playHoly();
                useGame.getState().equipBestAll();
              }}
              className="text-[10px] px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 text-white font-black border border-emerald-400/60 shadow-lg transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
              title="Автоматически надевает предметы с наибольшей мощью во все слоты"
            >
              <span>⚡ Надеть всё лучшее</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('battle')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'battle' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚔️</span>
            <span>Арена ({currentFloor} Этаж)</span>
          </button>

          <button
            onClick={() => setActiveTab('altar')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'altar' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔮</span>
            <span>Алтарь ({Object.values(altarLevels).reduce((a, b) => a + b, 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('relics')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'relics' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🏆</span>
            <span>Реликвии ({TOWER_RELICS.filter(r => maxFloor >= r.reqFloor).length}/{TOWER_RELICS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chests')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 relative cursor-pointer ${
              activeTab === 'chests' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎁</span>
            <span>Сундуки</span>
            {MILESTONE_CHESTS.some(c => maxFloor >= c.floor && !claimedChests.includes(c.floor)) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1 right-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('floors')}
            className={`flex-1 min-w-[120px] text-xs py-2 px-3 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'floors' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📜</span>
            <span>Выбор Этажа</span>
          </button>
        </div>

        {/* Modal Main Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {/* TAB 1: LIVE BATTLE ARENA */}
          {activeTab === 'battle' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-3 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="font-black text-xs text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <span>{currentBiome.icon}</span>
                    <span>{guardianName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChallengeMode(!challengeMode)}
                      className={`text-[10px] px-2.5 py-1 rounded-xl font-black transition-all border flex items-center gap-1 cursor-pointer ${
                        challengeMode
                          ? 'bg-red-950 text-red-300 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                      title="Включает режим 'Хардкор': +40% HP/Урон Стража, но на +80% больше Осколков!"
                    >
                      <span>🔥</span>
                      <span>Хардкор: {challengeMode ? 'ВКЛ (+80% Осколков)' : 'ВЫКЛ'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const nextAuto = !autoClimb;
                        setAutoClimb(nextAuto);
                        if (nextAuto && battleResult === 'won') {
                          const nextF = currentFloor + 1;
                          setCurrentFloor(nextF);
                          startBattleFloor(nextF);
                        }
                      }}
                      className={`text-[10px] px-3 py-1 rounded-xl font-black transition-all border flex items-center gap-1.5 cursor-pointer ${
                        autoClimb
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)] animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span>⚡</span>
                      <span>Авто-Штурм: {autoClimb ? 'ВКЛ' : 'ВЫКЛ'}</span>
                    </button>

                    <span className="text-[10px] px-2.5 py-1 rounded-xl font-extrabold font-mono border" style={{ backgroundColor: `${activeMod.color}22`, color: activeMod.color, borderColor: `${activeMod.color}55` }}>
                      {activeMod.icon} {activeMod.name}
                    </span>
                  </div>
                </div>

                {/* HTML5 Live Battle Canvas */}
                <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                  <canvas ref={canvasRef} width={760} height={200} className="w-full h-48 sm:h-56 bg-slate-950 block" />

                  {ascensionAnim && (
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-indigo-900/80 to-transparent flex flex-col items-center justify-center gap-1 animate-fadeIn pointer-events-none">
                      <span className="text-4xl animate-bounce">✨</span>
                      <span className="text-sm font-black text-amber-300 uppercase tracking-widest drop-shadow-md">
                        ЭТАЖ {currentFloor} ЗАЧИЩЕН!
                      </span>
                    </div>
                  )}

                  {/* HP & Shield Bars */}
                  <div className="absolute top-2 left-2 right-2 grid grid-cols-2 gap-3 pointer-events-none">
                    <div className="p-2 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-black">
                        <span className="text-emerald-400">🛡️ Вы (Ур.{level})</span>
                        <span className="text-slate-300 font-mono">{fmt(playerHp)} / {fmt(playerMaxHp)} HP {playerShield > 0 && `(🛡️${fmt(playerShield)})`}</span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200" style={{ width: `${Math.max(0, (playerHp / playerMaxHp) * 100)}%` }} />
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-black">
                        <span className="text-purple-300">{famDef.icons?.[0] || '👾'} {famDef.name} ({currentFloor} Ур)</span>
                        <span className="text-slate-300 font-mono">{fmt(guardianHp)} / {fmt(guardianMaxHp)} HP {guardianShield > 0 && `(🛡️${fmt(guardianShield)})`}</span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400 transition-all duration-200" style={{ width: `${Math.max(0, (guardianHp / guardianMaxHp) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Abilities Toolbar */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={castThunderStrike}
                    disabled={!inBattle || cdThunder > 0}
                    className="py-2 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 font-bold text-xs shadow transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⚡ Гром</span>
                    <span className="text-[10px] font-mono text-amber-400">{cdThunder > 0 ? `${cdThunder}s` : 'ГОТОВО'}</span>
                  </button>

                  <button
                    onClick={castAstralShield}
                    disabled={!inBattle || cdShield > 0}
                    className="py-2 px-3 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/50 text-sky-200 font-bold text-xs shadow transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🛡️ Барьер</span>
                    <span className="text-[10px] font-mono text-sky-400">{cdShield > 0 ? `${cdShield}s` : 'ГОТОВО'}</span>
                  </button>

                  <button
                    onClick={castPhoenixHeal}
                    disabled={!inBattle || cdHeal > 0}
                    className="py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 font-bold text-xs shadow transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>💖 Исцеление</span>
                    <span className="text-[10px] font-mono text-emerald-400">{cdHeal > 0 ? `${cdHeal}s` : 'ГОТОВО'}</span>
                  </button>
                </div>

                {/* Victory Banner / Start Battle Button */}
                {battleResult === 'won' ? (
                  <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-center space-y-2.5 animate-fadeIn shadow-lg">
                    <div className="font-black text-sm text-emerald-300 flex items-center justify-center gap-2">
                      <span>🎉</span>
                      <span>ПОБЕДА! СТРАЖ {currentFloor} ЭТАЖА ПОВЕРЖЕН!</span>
                    </div>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          const nextF = currentFloor + 1;
                          setCurrentFloor(nextF);
                          startBattleFloor(nextF);
                        }}
                        className="py-2.5 px-7 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 text-white font-black text-xs border border-emerald-400 shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                      >
                        <span>➡️</span>
                        <span>Перейти на {currentFloor + 1} Этаж</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startBattleFloor(currentFloor)}
                    disabled={inBattle}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:scale-[1.01] text-white font-black text-xs border border-purple-400/60 shadow-xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>⚔️</span>
                    <span>{inBattle ? 'Сражение на Арене Башни...' : `Начать Бой на ${currentFloor} Этаже`}</span>
                  </button>
                )}
              </div>

              {/* Status Log Box */}
              <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl text-xs text-purple-200 font-mono shadow">
                {battleLog}
              </div>

              {/* Active Floor Modifier Info */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                <span className="text-2xl p-1.5 bg-slate-950 rounded-lg border border-slate-800 shrink-0">{activeMod.icon}</span>
                <div>
                  <div className="font-extrabold text-xs" style={{ color: activeMod.color }}>Модификатор: {activeMod.name}</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{activeMod.desc}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALTAR UPGRADES */}
          {activeTab === 'altar' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200 space-y-1">
                <div className="font-extrabold text-xs text-purple-300 flex items-center justify-between">
                  <span>🔮 Алтарь Небесных Усилений Башни</span>
                  <span className="font-mono text-amber-300">Баланс: {fmt(towerShards)} Осколков</span>
                </div>
                <div>
                  Повышайте характеристики персонажа внутри Башни Испытаний за Астральные Осколки со Стражей!
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALTAR_UPGRADES.map(upg => {
                  const lvl = altarLevels[upg.id] || 0;
                  const cost = Math.round(upg.baseCost * Math.pow(upg.costMult, lvl));
                  const canAfford = towerShards >= cost;

                  return (
                    <div key={upg.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between space-y-2.5 shadow">
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl p-1.5 bg-slate-950 rounded-lg border border-slate-800 shrink-0">{upg.icon}</span>
                        <div>
                          <div className="font-black text-xs text-slate-100 flex items-center gap-2">
                            <span>{upg.name}</span>
                            <span className="text-[10px] text-purple-300 font-mono">Ур. {lvl}</span>
                          </div>
                          <div className="text-[10px] text-slate-300 mt-1">{upg.desc}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyAltarUpgrade(upg)}
                        disabled={!canAfford}
                        className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-extrabold text-xs border border-purple-400/50 shadow transition-all active:scale-95 flex items-center justify-center gap-1.5 font-mono cursor-pointer"
                      >
                        <span>🔮 Улучшить за {fmt(cost)} Осколков</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TOWER RELICS */}
          {activeTab === 'relics' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200">
                <div className="font-extrabold text-xs text-purple-300">🏆 Астральные Реликвии Башни</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Реликвии автоматически разблокируются при достижении ключевых этажей Башни и дают постоянные пассивные бонусы.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TOWER_RELICS.map(r => {
                  const unlocked = maxFloor >= r.reqFloor;

                  return (
                    <div
                      key={r.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                        unlocked
                          ? 'bg-slate-900 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                          : 'bg-slate-950/60 border-slate-800 opacity-50'
                      }`}
                    >
                      <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800 shrink-0">{r.icon}</span>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs" style={{ color: unlocked ? r.color : '#94a3b8' }}>
                            {r.name}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-black ${unlocked ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}>
                            {unlocked ? 'АКТИВНО' : `Требуется ${r.reqFloor} Этаж`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{r.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MILESTONE CHESTS */}
          {activeTab === 'chests' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200">
                <div className="font-extrabold text-xs text-purple-300">🎁 Награды за Зачистку Этажей</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Забирайте ценные сокровища (Золото и Осколки) за прохождение ключевых этажей!
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MILESTONE_CHESTS.map(c => {
                  const unlocked = maxFloor >= c.floor;
                  const claimed = claimedChests.includes(c.floor);

                  return (
                    <div
                      key={c.floor}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        claimed
                          ? 'bg-slate-950 border-slate-800 opacity-60'
                          : unlocked
                          ? 'bg-slate-900 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                          : 'bg-slate-950 border-slate-800 opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 bg-slate-950 rounded-xl border border-slate-800">🎁</span>
                        <div>
                          <div className="font-black text-xs text-amber-300">{c.title} ({c.floor} Этаж)</div>
                          <div className="text-[10px] font-mono text-slate-300">
                            💰 +{fmt(c.gold)} Золота · 🔮 +{c.shards} Осколков
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleClaimChest(c)}
                        disabled={!unlocked || claimed}
                        className={`text-xs px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                          claimed
                            ? 'bg-slate-800 text-slate-500'
                            : unlocked
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg animate-pulse'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {claimed ? 'Забрано' : unlocked ? 'Забрать' : `Закрыто`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: FLOOR SELECTOR */}
          {activeTab === 'floors' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <b className="text-purple-300">Ваш рекорд в Башне:</b> {maxFloor} Этаж
                  <span className="ml-3 text-amber-300">Убито Владыка: {totalBossKills}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Выберите открытый этаж для повторного прохождения или штурма!
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Array.from({ length: Math.max(30, maxFloor + 5) }, (_, i) => i + 1).map(fl => {
                  const unlocked = fl <= maxFloor;
                  const isCurrent = fl === currentFloor;
                  const isBoss = fl % 5 === 0;

                  return (
                    <button
                      key={fl}
                      onClick={() => {
                        if (unlocked) {
                          setCurrentFloor(fl);
                          setActiveTab('battle');
                        }
                      }}
                      disabled={!unlocked}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-purple-400 bg-purple-600 text-white font-black shadow-[0_0_12px_rgba(168,85,247,0.5)] ring-2 ring-purple-400'
                          : unlocked
                          ? isBoss
                            ? 'border-red-500/60 bg-red-950/40 text-red-300 hover:bg-red-900/50 font-black'
                            : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-200 font-bold'
                          : 'border-slate-800/40 opacity-30 bg-slate-950 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-xs">{isBoss ? '🔥' : '🏰'}</span>
                      <span className="text-[10px] font-mono font-black">{fl}</span>
                    </button>
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
