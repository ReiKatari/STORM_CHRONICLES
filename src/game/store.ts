import { create } from 'zustand';
import type {
  ActiveMonster, BaseStats, DungeonRun, FxEvent, Item, LogEntry, QuestState, SlotId, StatId, SlotKind,
  GemItem, GemType, GemTier, ComboState, MercenarySquad, TarotCard
} from './types';
import { generateItem, rarityById, POTIONS_CATALOG } from './items';
import { makeMonster, ZONES, zoneById, dungeonById } from './monsters';
import { QUESTS } from './quests';
import { PETS } from './pets';
import { calculateElementalReaction, computeDerived, fmt, MAX_LEVEL, mitigate, monsterReward, monsterStats, rarityAtLeast, xpForLevel } from './engine';
import type { DerivedStats } from './types';
import { getClassById, HERO_CLASSES } from './classes';
import { sound } from './sound';
import { HERBS_CATALOG, ALCHEMY_RECIPES } from './alchemy';
import { createGem, getRefinementInfo, applyUpgradeToItem } from './gems';
import { MERCENARIES_CATALOG, EXPEDITIONS_CATALOG } from './expeditions';
import { TAROT_DECK } from './tarot';
import { WINGS_CATALOG, ASCENDANCY_CONSTELLATIONS } from './cosmetics';

let logId = 1;

const SAVE_KEY = 'storm_chronicles_save';
const ACTIVE_SLOT_KEY = 'storm_chronicles_active_slot_id';
const DEFAULT_SLOT_ID = 'slot_1';

let isResettingGame = false;

export function getActiveSlotId(): string {
  try {
    return localStorage.getItem(ACTIVE_SLOT_KEY) || DEFAULT_SLOT_ID;
  } catch {
    return DEFAULT_SLOT_ID;
  }
}

export function setActiveSlotId(slotId: string) {
  try {
    localStorage.setItem(ACTIVE_SLOT_KEY, slotId);
  } catch { /* ignore */ }
}

export function getSlotSaveKey(slotId: string): string {
  return `storm_chronicles_save_${slotId || DEFAULT_SLOT_ID}`;
}

export interface CharacterSlotMeta {
  slotId: string;
  characterName: string;
  classId: string;
  level: number;
  zoneId: string;
  savedAt: number;
}

export function getCharacterSlotsMeta(): CharacterSlotMeta[] {
  const slots: CharacterSlotMeta[] = [];
  const slotIds = ['slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5'];
  slotIds.forEach(id => {
    try {
      let raw = localStorage.getItem(getSlotSaveKey(id));
      if (!raw && id === 'slot_1') {
        raw = localStorage.getItem(SAVE_KEY);
      }
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.characterName && d.classId) {
          slots.push({
            slotId: id,
            characterName: d.characterName,
            classId: d.classId,
            level: d.level || 1,
            zoneId: d.zoneId || 'hills',
            savedAt: d.savedAt || Date.now(),
          });
        }
      }
    } catch { /* ignore */ }
  });
  return slots;
}

export interface GameState {
  // character
  characterName: string;
  classId: string;
  level: number;
  xp: number;
  gold: number;
  totalGoldEarned: number;
  stats: BaseStats;
  statPoints: number;
  skillPoints: number;
  talentPoints: number;
  hp: number;
  mana: number;
  shield: number;

  // gear
  equipment: Partial<Record<SlotId, Item>>;
  inventory: Item[];
  selectedSlotFilter: SlotKind | 'all';

  // RPG 2.0 Systems
  gemsInventory: GemItem[];
  herbsInventory: Record<string, number>;
  enhancementStones: number;
  celestialShards: number;
  ascendancyLevels: Record<string, number>;
  activePotions: { id: string; name: string; icon: string; expireTimestamp: number; color: string; statBonus: any }[];
  mercenaries: MercenarySquad[];
  activeExpeditions: { squadId: string; missionId: string; endTimestamp: number }[];
  tarotCards: TarotCard[];
  activeWings: string;
  unlockedWings: string[];
  combo: ComboState;
  screenShake: boolean;

  // skills & talents
  skillRanks: Record<string, number>;
  skillCds: Record<string, number>;
  autoCast: Record<string, boolean>;
  talents: Record<string, number>;
  lastSkillCast?: string;

  // world
  zoneId: string;
  stage: number;
  stageKills: number;
  mastery: Record<string, number>;   // zoneId → completed loops
  unlockedZones: string[];
  unlockedSecrets: string[];
  dungeon: DungeonRun | null;

  // combat
  monster: ActiveMonster;
  playerAtk: number;
  frostSlow: number;

  // pets
  activePetId: string | null;
  petLvl: number;
  petXp: number;
  petCustomNames: Record<string, string>;
  petTalents: Record<string, number>;

  // quests
  quests: Record<string, QuestState>;

  // meta
  kills: number;
  bossKills: number;
  dungeonsCleared: number;
  fxQueue: FxEvent[];
  log: LogEntry[];
  lastSave: number;
  derived: DerivedStats;

  // audio settings
  sfxMuted: boolean;
  musicMuted: boolean;

  // actions
  initCharacter: (name: string, classId: string) => void;
  tick: (dt: number) => void;
  allocateStat: (s: StatId) => void;
  allocateStat10: (s: StatId) => void;
  equip: (itemId: string) => void;
  equipBestAll: () => void;
  unequip: (slot: SlotId) => void;
  unequipAll: () => void;
  usePotion: (itemId: string) => void;
  sellItem: (itemId: string) => void;
  sellJunk: (maxRarity: string) => void;
  castSkill: (id: string) => void;
  upgradeSkill: (id: string) => void;
  toggleAutoCast: (id: string) => void;
  learnTalent: (id: string) => void;
  claimQuest: (id: string) => void;
  travelTo: (zoneId: string) => void;
  startDungeon: (id: string) => void;
  leaveDungeon: () => void;
  manualAttack: () => void;
  manualBlock: () => void;
  manualFlee: () => void;
  toggleSfx: () => void;
  toggleMusic: () => void;
  save: () => void;
  hardReset: () => void;
  setSlotFilter: (slot: SlotKind | 'all') => void;

  // RPG 2.0 Actions
  addGem: (gem: GemItem) => void;
  combineGems: (type: GemType, tier: GemTier) => boolean;
  socketGem: (slot: SlotId, socketIdx: number, gemId: string) => boolean;
  unsocketGem: (slot: SlotId, socketIdx: number) => boolean;
  refineEquipment: (slot: SlotId) => { success: boolean; newLevel: number };
  gatherHerb: (herbId: string, count?: number) => void;
  craftAlchemyPotion: (recipeId: string) => boolean;
  useAlchemyPotion: (potionId: string) => boolean;
  hireMercenary: (squadId: string) => boolean;
  startExpedition: (squadId: string, missionId: string) => boolean;
  claimExpedition: (squadId: string) => void;
  drawTarotCard: () => boolean;
  useTarotCard: (cardId: string) => boolean;
  equipWing: (wingId: string) => void;
  unlockWing: (wingId: string) => boolean;
  upgradeAscendancy: (constellationId: string) => boolean;
  triggerScreenShake: () => void;
}

const defaultStats = (): BaseStats => HERO_CLASSES[0].baseStats;

function zoneBaseLevel(zoneIndex: number): number {
  return 1 + zoneIndex * 15;
}

function makeQuestState(): Record<string, QuestState> {
  const q: Record<string, QuestState> = {};
  QUESTS.forEach(def => {
    q[def.id] = { progress: 0, done: false, claimed: false };
  });
  return q;
}

function spawnFor(zoneId: string, stage: number, mastery: number, dungeon: DungeonRun | null): ActiveMonster {
  if (dungeon) {
    const d = dungeonById(dungeon.dungeonId);
    const isBossWave = dungeon.wave >= d.waves;
    const lvl = d.minLevel + dungeon.wave * 2;
    const fam = d.familyPool[Math.floor(Math.random() * d.familyPool.length)];
    const tier = Math.min(7, Math.floor(dungeon.wave / 2) + 2);
    const def = makeMonster(fam, tier, isBossWave ? { boss: true, name: d.bossName, icon: d.bossIcon } : {});
    const { hp, dmg } = monsterStats(lvl, def.hpMult, def.dmgMult);
    const rew = monsterReward(lvl, def.xpMult * d.xpMult, def.goldMult * d.goldMult);
    return { def, hp, maxHp: hp, level: lvl, dmg, xp: rew.xp, gold: rew.gold, attackTimer: 0, dotTimer: 0, dots: [] };
  }
  const zone = zoneById(zoneId);
  const zi = ZONES.findIndex(z => z.id === zoneId);
  const base = zoneBaseLevel(zone.hidden ? Math.max(1, Math.floor(zone.minLevel / 15)) : zi) + mastery * 12;
  const lvl = base + stage + Math.floor(Math.random() * 2);
  const isBoss = stage === zone.stages;
  const isMini = stage === Math.ceil(zone.stages / 2);
  const fam = zone.monsterFamilies[Math.floor(Math.random() * zone.monsterFamilies.length)];
  const tier = Math.min(7, Math.floor(stage / 1.5));
  const def = makeMonster(fam, tier,
    isBoss ? { boss: true, name: zone.bossName, icon: zone.bossIcon }
      : isMini ? { mini: true, name: zone.miniBossName, icon: zone.miniBossIcon } : {});
  const { hp, dmg } = monsterStats(lvl, def.hpMult, def.dmgMult);
  const rew = monsterReward(lvl, def.xpMult, def.goldMult);
  return { def, hp, maxHp: hp, level: lvl, dmg, xp: rew.xp, gold: rew.gold, attackTimer: 0, dotTimer: 0, dots: [] };
}

let fxCounter = 0;
function pushFx(fx: FxEvent[], e: Omit<FxEvent, 'id'>) {
  if (!fx || !Array.isArray(fx)) return;
  const uniqueId = Date.now() * 1000 + (fxCounter++ % 1000);
  fx.push({ ...e, id: uniqueId });
  if (fx.length > 60) fx.splice(0, fx.length - 60);
}
function pushLog(log: LogEntry[], text: string, color = '#e2e8f0') {
  log.push({ id: logId++, text, color, time: Date.now() });
  if (log.length > 80) log.splice(0, log.length - 80);
}

const initialDerived = computeDerived(1, defaultStats(), {}, {});

export const useGame = create<GameState>((set, get) => {
  const initialMonster = spawnFor('hills', 1, 0, null);

  function addQuestProgress(kind: string, target: string, amount: number) {
    const s = get();
    const quests = { ...s.quests };
    let changed = false;
    QUESTS.forEach(def => {
      const st = quests[def.id];
      if (!st || st.claimed || st.done) return;
      let match = false;
      if (def.kind === 'kill' && kind === 'kill' && def.target === target) match = true;
      if (def.kind === 'killAny' && kind === 'kill') match = true;
      if (def.kind === 'boss' && kind === 'boss') match = true;
      if (def.kind === 'dungeon' && kind === 'dungeon') match = true;
      if (def.kind === 'loot' && kind === 'loot' && rarityAtLeast(target as never, def.target as never)) match = true;
      if (def.kind === 'gold' && kind === 'gold') match = true;
      if (def.kind === 'secret' && kind === 'secret') match = true;
      if (def.kind === 'level' && kind === 'level') match = true;
      if (match) {
        const nv = def.kind === 'level' || def.kind === 'gold' || def.kind === 'secret'
          ? Math.max(st.progress, amount)
          : st.progress + amount;
        const done = nv >= def.count;
        quests[def.id] = { ...st, progress: Math.min(nv, def.count), done };
        changed = true;
        if (done) {
          pushLog(s.log, `📜 Квест выполнен: «${def.name}»`, '#fbbf24');
          pushFx(s.fxQueue, { type: 'quest', text: '📜 Квест!', color: '#fbbf24' });
        }
      }
    });
    if (changed) set({ quests });
  }

  function grantXp(amount: number) {
    const s = get();
    if (isNaN(amount) || amount <= 0) return;
    let xp = (s.xp ?? 0) + Math.round(amount);
    let level = s.level ?? 1;
    let statPoints = s.statPoints ?? 0;
    let skillPoints = s.skillPoints ?? 0;
    let talentPoints = s.talentPoints ?? 0;
    let leveled = 0;
    const tBonus = (s.talents?.['t_stat'] ?? 0) * 2;

    while (level < MAX_LEVEL && xp >= xpForLevel(level)) {
      xp -= xpForLevel(level);
      level++;
      leveled++;
      statPoints += 5 + tBonus;
      if (level % 3 === 0) skillPoints += 1;
      if (level % 5 === 0) talentPoints += 1;
    }
    if (leveled > 0) {
      const d = computeDerived(level, s.stats, s.equipment, s.talents);
      sound.playLevelUp();
      pushFx(s.fxQueue, { type: 'levelup', text: `Уровень ${level}!`, color: '#facc15' });
      pushLog(s.log, `⬆️ Уровень ${level}! +${(5 + tBonus) * leveled} очков статов`, '#facc15');
      set({ xp, level, statPoints, skillPoints, talentPoints, stats: { ...s.stats }, hp: d.maxHp, mana: d.maxMana, derived: d });
      addQuestProgress('level', '', level);
    } else {
      set({ xp });
    }
  }

  function triggerMonsterTurn(s: GameState, m: ActiveMonster, isBlocked = false) {
    if (!m || m.hp <= 0) return;
    const d = s.derived || computeDerived(s.level || 1, s.stats, s.equipment || {}, s.talents || {});

    // Check Dodge
    if (Math.random() * 100 < d.dodge) {
      pushFx(s.fxQueue, { type: 'dodge', text: '💨 Уворот!', color: '#38bdf8' });
      return;
    }

    // Multi-phase Boss Checks
    if (m.def.isBoss && m.hp > 0 && m.maxHp > 0) {
      const hpPct = m.hp / m.maxHp;
      if (hpPct <= 0.50 && hpPct > 0.20 && !(m as any).phase2Triggered) {
        (m as any).phase2Triggered = true;
        sound.playBoss();
        pushLog(s.log, `👑 ФАЗА 2 БОССА: ${m.def.name} ПРИЗЫВАЕТ ТЕНЕВЫХ СЛУГ И ЩИТ!`, '#eab308');
        pushFx(s.fxQueue, { type: 'bossSpawn', text: '👑 ФАЗА 2: ЩИТ!', color: '#eab308' });
      } else if (hpPct <= 0.20 && !(m as any).phase3Triggered) {
        (m as any).phase3Triggered = true;
        sound.playBoss();
        pushLog(s.log, `🔥 ФАЗА 3 БОССА: ${m.def.name} ВПАДАЕТ В ЯРОСТЬ! (+100% Скорости)`, '#ef4444');
        pushFx(s.fxQueue, { type: 'bossSpawn', text: '🔥 ФАЗА 3: ЯРОСТЬ!', color: '#ef4444' });
      }
    }

    const rawDmg = isBlocked ? m.dmg * 0.25 : m.dmg;
    const mDmg = mitigate(rawDmg, d.armor);

    let remDmg = mDmg;
    let currShield = s.shield ?? 0;
    if (currShield > 0) {
      const absorbed = Math.min(currShield, remDmg);
      currShield -= absorbed;
      remDmg -= absorbed;
    }

    let hp = Math.max(0, s.hp - remDmg);
    if (isBlocked) {
      pushFx(s.fxQueue, { type: 'playerHit', value: mDmg, text: `🛡️ -${fmt(mDmg)}`, color: '#facc15' });
    } else {
      pushFx(s.fxQueue, { type: 'playerHit', value: mDmg, text: `-${fmt(mDmg)}`, color: '#ef4444' });
    }

    // Combo reduction when taking unblocked hits
    let combo: ComboState = s.combo ? { ...s.combo } : { count: 0, rank: 'D', multiplier: 1.0, timeLeftSec: 0 };
    if (!isBlocked && remDmg > 0 && combo.count > 0) {
      combo.count = Math.max(0, combo.count - 3);
      combo.timeLeftSec = Math.max(0, combo.timeLeftSec - 1.2);
      if (combo.count >= 40) { combo.rank = 'SSS'; combo.multiplier = 1.35; }
      else if (combo.count >= 28) { combo.rank = 'SS'; combo.multiplier = 1.25; }
      else if (combo.count >= 18) { combo.rank = 'S'; combo.multiplier = 1.18; }
      else if (combo.count >= 10) { combo.rank = 'A'; combo.multiplier = 1.12; }
      else if (combo.count >= 5) { combo.rank = 'B'; combo.multiplier = 1.08; }
      else if (combo.count >= 2) { combo.rank = 'C'; combo.multiplier = 1.04; }
      else { combo.rank = 'D'; combo.multiplier = 1.0; }
    }

    if (hp <= 0) {
      hp = d.maxHp;
      pushLog(s.log, `☠️ Вы погибли от рук ${m.def.name}. Отступление на этап 1!`, '#ef4444');
      set({
        stage: 1,
        stageKills: 0,
        dungeon: null,
        monster: spawnFor(s.zoneId || 'hills', 1, (s.mastery && s.mastery[s.zoneId]) ?? 0, null),
        hp,
        mana: d.maxMana,
        shield: 0,
        combo: { count: 0, rank: 'D', multiplier: 1.0, timeLeftSec: 0 },
        playerAtk: 0,
        fxQueue: [...s.fxQueue]
      });
    } else {
      set({ hp, shield: currShield, combo, fxQueue: [...s.fxQueue] });
    }
  }

  function onKill(m: ActiveMonster) {
    const s = get();
    const d = s.derived;

    const baseGold = (m && !isNaN(m.gold) && m.gold > 0) ? m.gold : 10;
    const baseXp = (m && !isNaN(m.xp) && m.xp > 0) ? m.xp : 20;

    const rawGoldGain = Math.round(baseGold * (1 + (d.goldBonus || 0) / 100));
    const rawXpGain = Math.round(baseXp * (1 + (d.xpBonus || 0) / 100));

    const goldGain = isNaN(rawGoldGain) || rawGoldGain < 1 ? 10 : rawGoldGain;
    const xpGain = isNaN(rawXpGain) || rawXpGain < 1 ? 20 : rawXpGain;

    pushLog(s.log, `☠️ Убит ${m.def.name} (Ур.${m.level}): +${goldGain}g, +${xpGain}xp`, m.def.color);
    grantXp(xpGain);
    addQuestProgress('kill', m.def.family, 1);
    if (m.def.isBoss || m.def.isMiniBoss) addQuestProgress('boss', '', 1);

    // Pet XP gain & leveling
    if (s.activePetId) {
      let petXp = (s.petXp ?? 0) + Math.max(10, Math.floor(xpGain * 0.5));
      let petLvl = s.petLvl ?? 1;
      const petNeed = petLvl * 120;
      if (petXp >= petNeed) {
        petXp -= petNeed;
        petLvl += 1;
        sound.playLevelUp();
        pushLog(s.log, `🐾 Ваш питомец поднялся до Ур. ${petLvl}!`, '#4ade80');
        pushFx(s.fxQueue, { type: 'levelup', text: `🐾 Питомец Ур.${petLvl}!`, color: '#4ade80' });
      }
      set({ petXp, petLvl });
    }

    let kills = (s.kills ?? 0) + 1;
    let bossKills = (s.bossKills ?? 0) + (m.def.isBoss ? 1 : 0);

    // Reduced gear drop chance (22%)
    const gearDropChance = 0.22 * (1 + (d.dropBonus || 0) / 100) * (m.def.isBoss ? 2.5 : m.def.isMiniBoss ? 1.5 : 1);
    const newInventory = [...s.inventory];
    if (Math.random() < gearDropChance && newInventory.length < 72) {
      const drop = generateItem(m.level, m.def.isBoss ? 'rare' : undefined);
      newInventory.push(drop);
      const r = rarityById(drop.rarity);
      sound.playLoot();
      pushLog(s.log, `✨ Выпал предмет: ${drop.name}`, r.color);
      pushFx(s.fxQueue, { type: 'loot', text: drop.name, color: r.color });
      addQuestProgress('loot', drop.rarity, 1);
    }

    // Increased Potion drop chance (38%)
    const potionDropChance = 0.38 * (1 + (d.dropBonus || 0) / 100);
    if (Math.random() < potionDropChance && newInventory.length < 72) {
      const potDef = POTIONS_CATALOG[Math.floor(Math.random() * POTIONS_CATALOG.length)];
      const potItem: Item = {
        id: `pot_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: potDef.name,
        slot: 'consumable' as any,
        rarity: potDef.rarity,
        ilvl: m.level,
        icon: potDef.icon,
        base: {},
        affixes: [],
        sellPrice: potDef.sellPrice,
        score: 15,
      };
      newInventory.push(potItem);
      sound.playLoot();
      pushLog(s.log, `🧪 Выпало зелье: ${potItem.name}`, '#4ade80');
      pushFx(s.fxQueue, { type: 'loot', text: potItem.name, color: '#4ade80' });
    }

    // 1. Herbs Drop (35% chance)
    const herbsInventory = { ...(s.herbsInventory || {}) };
    if (Math.random() < 0.35) {
      const h = HERBS_CATALOG[Math.floor(Math.random() * HERBS_CATALOG.length)];
      herbsInventory[h.id] = (herbsInventory[h.id] || 0) + 1;
      pushLog(s.log, `🌿 Собрана трава: ${h.name}`, h.color);
      pushFx(s.fxQueue, { type: 'loot', text: `🌿 +1 ${h.name}`, color: h.color });
    }

    // 2. Gems Drop (20% chance)
    let gemsInventory = [...(s.gemsInventory || [])];
    if (Math.random() < 0.20 && gemsInventory.length < 50) {
      const gTypes: GemType[] = ['ruby', 'sapphire', 'emerald', 'topaz', 'diamond', 'amethyst'];
      const pickT = gTypes[Math.floor(Math.random() * gTypes.length)];
      const newGem = createGem(pickT, 1);
      gemsInventory.push(newGem);
      sound.playLoot();
      pushLog(s.log, `💎 Найден самоцвет: ${newGem.name}`, '#38bdf8');
      pushFx(s.fxQueue, { type: 'loot', text: `💎 ${newGem.name}`, color: '#38bdf8' });
    }

    // 3. Enhancement Stones Drop (30% chance)
    let enhancementStones = s.enhancementStones || 0;
    if (Math.random() < 0.30) {
      const stonesDrop = m.def.isBoss ? 3 : 1;
      enhancementStones += stonesDrop;
      pushLog(s.log, `🔨 Получен Камень Усиления x${stonesDrop}`, '#f59e0b');
      pushFx(s.fxQueue, { type: 'loot', text: `🔨 +${stonesDrop} Камень`, color: '#f59e0b' });
    }

    // 4. Tarot Card Drop (8% chance)
    let tarotCards = [...(s.tarotCards || [])];
    if (Math.random() < 0.08 && tarotCards.length < 12) {
      const randomTarot = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
      tarotCards.push(randomTarot);
      sound.playHoly();
      pushLog(s.log, `🎴 Получена Карта Судьбы: ${randomTarot.name}!`, randomTarot.color);
      pushFx(s.fxQueue, { type: 'quest', text: `🎴 ${randomTarot.name}`, color: randomTarot.color });
    }

    // secret zone drop chance
    const unlockedSecrets = [...s.unlockedSecrets];
    if (Math.random() < 0.04) {
      const hZones = ZONES.filter(z => z.hidden && !unlockedSecrets.includes(z.id));
      if (hZones.length > 0) {
        const pick = hZones[Math.floor(Math.random() * hZones.length)];
        unlockedSecrets.push(pick.id);
        pushLog(s.log, `🔮 Найдена скрытая локация: ${pick.name}!`, '#e0a5e9');
        pushFx(s.fxQueue, { type: 'quest', text: `Скрытая зона!`, color: '#e0a5e9' });
      }
    }

    if (s.dungeon) {
      const dun = dungeonById(s.dungeon.dungeonId);
      const nextWave = s.dungeon.wave + 1;
      if (nextWave > dun.waves) {
        // dungeon cleared!
        const rewardItem = generateItem(dun.minLevel + 10, dun.rewardRarity as never);
        if (newInventory.length < 72) newInventory.push(rewardItem);
        pushLog(s.log, `🏆 ПОДЗЕМЕЛЬЕ ПРОЙДЕНО! Награда: ${rewardItem.name}`, '#facc15');
        pushFx(s.fxQueue, { type: 'quest', text: '🏆 Победа!', color: '#facc15' });
        addQuestProgress('dungeon', s.dungeon.dungeonId, 1);
        set({
          dungeon: null,
          kills, bossKills, dungeonsCleared: s.dungeonsCleared + 1,
          gold: s.gold + goldGain, totalGoldEarned: s.totalGoldEarned + goldGain,
          inventory: newInventory, unlockedSecrets, herbsInventory, gemsInventory, enhancementStones, tarotCards,
          monster: spawnFor(s.zoneId, s.stage, s.mastery[s.zoneId] ?? 0, null),
        });
        return;
      } else {
        const nextDungeonRun: DungeonRun = { ...s.dungeon, wave: nextWave };
        set({
          dungeon: nextDungeonRun,
          kills, bossKills,
          gold: s.gold + goldGain, totalGoldEarned: s.totalGoldEarned + goldGain,
          inventory: newInventory, unlockedSecrets, herbsInventory, gemsInventory, enhancementStones, tarotCards,
          monster: spawnFor(s.zoneId, s.stage, s.mastery[s.zoneId] ?? 0, nextDungeonRun),
        });
        return;
      }
    }

    // normal stage progression
    let stage = s.stage;
    let stageKills = s.stageKills + 1;
    const currentZone = zoneById(s.zoneId);
    const mastery = { ...s.mastery };
    const unlockedZones = [...s.unlockedZones];

    if (stageKills >= currentZone.killsPerStage) {
      stageKills = 0;
      if (stage >= currentZone.stages) {
        // zone cleared!
        stage = 1;
        mastery[s.zoneId] = (mastery[s.zoneId] ?? 0) + 1;
        pushLog(s.log, `🌟 Зона «${currentZone.name}» зачищена! Запущен ★ цикл ${mastery[s.zoneId]}`, '#facc15');

        // unlock next zone
        const zi = ZONES.findIndex(z => z.id === s.zoneId);
        if (zi >= 0 && zi + 1 < ZONES.length && !ZONES[zi + 1].hidden) {
          const nextZ = ZONES[zi + 1];
          if (!unlockedZones.includes(nextZ.id)) {
            unlockedZones.push(nextZ.id);
            pushLog(s.log, `🔓 Открыта новая зона: ${nextZ.name}!`, '#38bdf8');
          }
        }
      } else {
        stage++;
      }
    }

    set({
      kills, bossKills, stage, stageKills, mastery, unlockedZones, unlockedSecrets,
      gold: s.gold + goldGain, totalGoldEarned: s.totalGoldEarned + goldGain,
      inventory: newInventory, herbsInventory, gemsInventory, enhancementStones, tarotCards,
      monster: spawnFor(s.zoneId, stage, mastery[s.zoneId] ?? 0, null),
    });

    addQuestProgress('gold', '', s.gold + goldGain);
  }

  return {
    characterName: 'Алерия',
    classId: 'paladin',
    level: 1,
    xp: 0,
    gold: 50,
    totalGoldEarned: 50,
    stats: defaultStats(),
    statPoints: 0,
    skillPoints: 1,
    talentPoints: 1,
    hp: initialDerived.maxHp,
    mana: initialDerived.maxMana,
    shield: 0,

    equipment: {},
    inventory: [],
    selectedSlotFilter: 'all',

    // RPG 2.0 State
    gemsInventory: [
      createGem('ruby', 1),
      createGem('sapphire', 1),
      createGem('topaz', 1),
    ],
    herbsInventory: {
      herb_moon: 10,
      herb_fire: 6,
      herb_ice: 4,
      herb_astral: 2,
    },
    enhancementStones: 15,
    celestialShards: 0,
    ascendancyLevels: {},
    activePotions: [],
    mercenaries: MERCENARIES_CATALOG,
    activeExpeditions: [],
    tarotCards: [
      TAROT_DECK[0],
      TAROT_DECK[1],
      TAROT_DECK[2],
    ],
    activeWings: 'wing_archangel',
    unlockedWings: ['wing_archangel'],
    combo: { count: 0, rank: 'D', multiplier: 1.0, timeLeftSec: 0 },
    screenShake: false,

    skillRanks: {},
    skillCds: {},
    autoCast: {},
    talents: {},

    zoneId: 'hills',
    stage: 1,
    stageKills: 0,
    mastery: {},
    unlockedZones: ['hills'],
    unlockedSecrets: [],
    dungeon: null,

    activePetId: 'pet_dragon',
    petLvl: 1,
    petXp: 0,
    petCustomNames: {},
    petTalents: {},

    monster: initialMonster,
    playerAtk: 0,
    frostSlow: 0,

    quests: makeQuestState(),

    kills: 0,
    bossKills: 0,
    dungeonsCleared: 0,
    fxQueue: [],
    log: [
      { id: logId++, text: '⚔️ Добро пожаловать в Хроники Бездны!', color: '#facc15', time: Date.now() },
    ],
    lastSave: Date.now(),
    derived: initialDerived,

    sfxMuted: false,
    musicMuted: false,

    initCharacter: (name: string, classId: string) => {
      const cls = getClassById(classId);
      const starterEquipment: Partial<Record<SlotId, Item>> = {};
      cls.starterGear.forEach((g, idx) => {
        const slotId: SlotId = g.slot === 'ring' ? 'ring1' : g.slot === 'earring' ? 'earring1' : (g.slot as SlotId);
        starterEquipment[slotId] = {
          id: `starter_${idx}_${Date.now()}`,
          name: g.name,
          slot: g.slot,
          rarity: g.rarity,
          ilvl: 1,
          icon: g.icon,
          base: { dmg: g.dmg, armor: g.armor, hp: g.hp },
          affixes: [],
          sellPrice: 15,
          score: 25,
        };
      });
      const newStats = { ...cls.baseStats };
      const derived = computeDerived(1, newStats, starterEquipment, {});
      set({
        characterName: name,
        classId: classId,
        stats: newStats,
        equipment: starterEquipment,
        hp: derived.maxHp,
        mana: derived.maxMana,
        derived,
        monster: spawnFor('hills', 1, 0, null),
      });
      get().save();
    },

    tick: (dt: number) => {
      try {
        let s = get();
        if (!s.classId || !s.characterName) {
          get().initCharacter(s.characterName || 'Алерия', s.classId || 'paladin');
          s = get();
        }

        // Ensure active valid monster inline
        let currentM = s.monster ? { ...s.monster } : null;
        if (!currentM || !currentM.hp || isNaN(currentM.hp) || currentM.hp <= 0) {
          currentM = spawnFor(s.zoneId || 'hills', s.stage || 1, (s.mastery && s.mastery[s.zoneId]) ?? 0, s.dungeon || null);
        }

        const d = s.derived || computeDerived(s.level || 1, s.stats, s.equipment || {}, s.talents || {});
        let hp = Math.min(d.maxHp, (s.hp ?? d.maxHp) + d.regen * dt);
        let mana = Math.min(d.maxMana, (s.mana ?? d.maxMana) + d.manaRegen * dt);

        sound.updateZoneAndStage(s.zoneId || 'hills', s.stage || 1);

        const newCds: Record<string, number> = {};
        if (s.skillCds) {
          Object.entries(s.skillCds).forEach(([k, v]) => {
            if (v && v > 0) newCds[k] = Math.max(0, v - dt);
          });
        }

        // Combo Timer Decay
        let combo: ComboState = s.combo ? { ...s.combo } : { count: 0, rank: 'D', multiplier: 1.0, timeLeftSec: 0 };
        if (combo.count > 0) {
          combo.timeLeftSec = Math.max(0, combo.timeLeftSec - dt);
          if (combo.timeLeftSec <= 0) {
            combo.count = Math.max(0, Math.floor(combo.count * 0.7) - 1);
            if (combo.count >= 40) { combo.rank = 'SSS'; combo.multiplier = 1.35; }
            else if (combo.count >= 28) { combo.rank = 'SS'; combo.multiplier = 1.25; }
            else if (combo.count >= 18) { combo.rank = 'S'; combo.multiplier = 1.18; }
            else if (combo.count >= 10) { combo.rank = 'A'; combo.multiplier = 1.12; }
            else if (combo.count >= 5) { combo.rank = 'B'; combo.multiplier = 1.08; }
            else if (combo.count >= 2) { combo.rank = 'C'; combo.multiplier = 1.04; }
            else { combo.rank = 'D'; combo.multiplier = 1.0; }
            combo.timeLeftSec = combo.count > 0 ? 3.0 : 0;
          }
        }

        set({ hp, mana, monster: currentM, skillCds: newCds, combo });
      } catch (err) {
        console.error('Combat tick error:', err);
      }
    },



    allocateStat: (st: StatId) => {
      const s = get();
      if (s.statPoints <= 0) return;
      const stats = { ...s.stats, [st]: s.stats[st] + 1 };
      const derived = computeDerived(s.level, stats, s.equipment, s.talents);
      set({ stats, statPoints: s.statPoints - 1, derived });
    },

    allocateStat10: (st: StatId) => {
      const s = get();
      const count = Math.min(10, s.statPoints);
      if (count <= 0) return;
      const stats = { ...s.stats, [st]: s.stats[st] + count };
      const derived = computeDerived(s.level, stats, s.equipment, s.talents);
      set({ stats, statPoints: s.statPoints - count, derived });
    },

    equip: (itemId: string) => {
      const s = get();
      const item = s.inventory.find(i => i.id === itemId);
      if (!item) return;

      let targetSlot: SlotId = item.slot as SlotId;
      if (item.slot === 'ring') targetSlot = s.equipment.ring1 ? 'ring2' : 'ring1';
      if (item.slot === 'earring') targetSlot = s.equipment.earring1 ? 'earring2' : 'earring1';

      const prev = s.equipment[targetSlot];
      const equipment = { ...s.equipment, [targetSlot]: item };
      const inventory = s.inventory.filter(i => i.id !== itemId);
      if (prev) inventory.push(prev);

      const derived = computeDerived(s.level, s.stats, equipment, s.talents);
      set({ equipment, inventory, derived });
    },

    equipBestAll: () => {
      const s = get();
      const allEquipment = { ...s.equipment };
      let currentInv = [...s.inventory];
      let equippedCount = 0;

      // 1. Single Slots
      const singleSlots: { id: SlotId; kind: SlotKind }[] = [
        { id: 'helmet', kind: 'helmet' },
        { id: 'shoulders', kind: 'shoulders' },
        { id: 'armor', kind: 'armor' },
        { id: 'cloak', kind: 'cloak' },
        { id: 'weapon', kind: 'weapon' },
        { id: 'pants', kind: 'pants' },
        { id: 'banner', kind: 'banner' },
        { id: 'gloves', kind: 'gloves' },
        { id: 'kneepads', kind: 'kneepads' },
        { id: 'boots', kind: 'boots' },
        { id: 'amulet', kind: 'amulet' },
      ];

      singleSlots.forEach(slot => {
        const currentEquipped = allEquipment[slot.id];
        const candidates = currentInv
          .filter(i => i.slot === slot.kind || i.slot.startsWith(slot.kind) || slot.id.startsWith(i.slot))
          .sort((a, b) => b.score - a.score);

        if (candidates.length > 0) {
          const best = candidates[0];
          if (!currentEquipped || best.score > currentEquipped.score) {
            currentInv = currentInv.filter(i => i.id !== best.id);
            if (currentEquipped) currentInv.push(currentEquipped);
            allEquipment[slot.id] = best;
            equippedCount++;
          }
        }
      });

      // 2. Dual Rings
      const ringPool = [
        ...(allEquipment.ring1 ? [allEquipment.ring1] : []),
        ...(allEquipment.ring2 ? [allEquipment.ring2] : []),
        ...currentInv.filter(i => i.slot === 'ring' || i.slot.startsWith('ring'))
      ].sort((a, b) => b.score - a.score);

      if (ringPool.length > 0) {
        const top1 = ringPool[0];
        const top2 = ringPool.length > 1 ? ringPool[1] : undefined;

        if (allEquipment.ring1?.id !== top1?.id) {
          allEquipment.ring1 = top1;
          equippedCount++;
        }
        if (top2 && allEquipment.ring2?.id !== top2?.id) {
          allEquipment.ring2 = top2;
          equippedCount++;
        }

        const equippedRingIds = new Set([allEquipment.ring1?.id, allEquipment.ring2?.id].filter(Boolean));
        currentInv = currentInv.filter(i => !(i.slot === 'ring' || i.slot.startsWith('ring')));
        ringPool.forEach(r => {
          if (!equippedRingIds.has(r.id)) currentInv.push(r);
        });
      }

      // 3. Dual Earrings
      const earringPool = [
        ...(allEquipment.earring1 ? [allEquipment.earring1] : []),
        ...(allEquipment.earring2 ? [allEquipment.earring2] : []),
        ...currentInv.filter(i => i.slot === 'earring' || i.slot.startsWith('earring'))
      ].sort((a, b) => b.score - a.score);

      if (earringPool.length > 0) {
        const top1 = earringPool[0];
        const top2 = earringPool.length > 1 ? earringPool[1] : undefined;

        if (allEquipment.earring1?.id !== top1?.id) {
          allEquipment.earring1 = top1;
          equippedCount++;
        }
        if (top2 && allEquipment.earring2?.id !== top2?.id) {
          allEquipment.earring2 = top2;
          equippedCount++;
        }

        const equippedEarringIds = new Set([allEquipment.earring1?.id, allEquipment.earring2?.id].filter(Boolean));
        currentInv = currentInv.filter(i => !(i.slot === 'earring' || i.slot.startsWith('earring')));
        earringPool.forEach(e => {
          if (!equippedEarringIds.has(e.id)) currentInv.push(e);
        });
      }

      if (equippedCount > 0) {
        const derived = computeDerived(s.level, s.stats, allEquipment, s.talents);
        const newTotalScore = Object.values(allEquipment).reduce((sum, i) => sum + (i?.score ?? 0), 0);
        sound.playEquip();
        pushLog(s.log, `⚡ Надето всё наилучшее снаряжение! (Общая мощь: ⚡${fmt(newTotalScore)})`, '#facc15');
        pushFx(s.fxQueue, { type: 'loot', text: `⚡ НАДЕТО ЛУЧШЕЕ!`, color: '#facc15' });
        set({ equipment: allEquipment, inventory: currentInv, derived });
      } else {
        pushLog(s.log, `ℹ️ На вас уже надето всё самое мощное снаряжение из инвентаря!`, '#94a3b8');
      }
    },

    unequip: (slot: SlotId) => {
      const s = get();
      const prev = s.equipment[slot];
      if (!prev || s.inventory.length >= 72) return;

      const equipment = { ...s.equipment };
      delete equipment[slot];
      const inventory = [...s.inventory, prev];
      const derived = computeDerived(s.level, s.stats, equipment, s.talents);
      sound.playEquip();
      set({ equipment, inventory, derived });
    },

    unequipAll: () => {
      const s = get();
      const itemsToUnequip = Object.values(s.equipment).filter(Boolean) as Item[];
      if (itemsToUnequip.length === 0) return;

      const inventory = [...s.inventory, ...itemsToUnequip];
      const equipment = {};
      const derived = computeDerived(s.level, s.stats, equipment, s.talents);
      sound.playEquip();
      pushLog(s.log, `🛡️ Снято ${itemsToUnequip.length} предметов снаряжения в инвентарь.`, '#94a3b8');
      set({ equipment, inventory, derived });
    },

    usePotion: (itemId: string) => {
      const s = get();
      const item = s.inventory.find(i => i.id === itemId);
      if (!item) return;

      const d = s.derived;
      let hpGain = 0;
      let manaGain = 0;

      if (item.name.includes('Здоровья') || item.name.includes('Регенерация')) {
        hpGain = Math.round(d.maxHp * 0.5);
      } else if (item.name.includes('Маны')) {
        manaGain = Math.round(d.maxMana * 0.6);
      } else {
        hpGain = Math.round(d.maxHp * 0.4);
        manaGain = Math.round(d.maxMana * 0.4);
      }

      const newHp = Math.min(d.maxHp, s.hp + hpGain);
      const newMana = Math.min(d.maxMana, s.mana + manaGain);
      const newInv = s.inventory.filter(i => i.id !== item.id);

      sound.playSpell();
      pushFx(s.fxQueue, { type: 'heal', text: `+${fmt(hpGain)} HP`, color: '#4ade80' });
      set({ hp: newHp, mana: newMana, inventory: newInv });
    },

    sellItem: (itemId: string) => {
      const s = get();
      const item = s.inventory.find(i => i.id === itemId);
      if (!item) return;
      const inventory = s.inventory.filter(i => i.id !== itemId);
      set({ inventory, gold: s.gold + item.sellPrice, totalGoldEarned: s.totalGoldEarned + item.sellPrice });
    },

    sellJunk: (maxRarity: string) => {
      const s = get();
      const toSell = s.inventory.filter(i => !rarityAtLeast(i.rarity, maxRarity as never));
      const toKeep = s.inventory.filter(i => rarityAtLeast(i.rarity, maxRarity as never));
      const gained = toSell.reduce((acc, i) => acc + i.sellPrice, 0);
      set({ inventory: toKeep, gold: s.gold + gained, totalGoldEarned: s.totalGoldEarned + gained });
      pushLog(s.log, `💰 Продано ${toSell.length} предметов на ${gained} золота`, '#facc15');
    },

    castSkill: (id: string) => {
      const s = get();
      const cls = getClassById(s.classId);
      const sk = cls?.skills.find(x => x.id === id);
      if (!sk || (s.skillRanks[id] ?? 0) <= 0 || (s.skillCds[id] ?? 0) > 0) return;
      if (s.mana < sk.manaCost) return;

      const mana = s.mana - sk.manaCost;
      const d = s.derived;
      const skillCds = { ...s.skillCds, [id]: sk.cooldown * (1 - d.cdReduction / 100) };

      // Skill Weaving Combo Calculation
      const isNewSkill = s.lastSkillCast && s.lastSkillCast !== id;
      const comboBonus = isNewSkill ? 3 : 1;
      const curComboCount = s.combo?.count ?? 0;
      const nextComboCount = curComboCount + comboBonus;

      let rank: 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' = 'D';
      let comboMult = 1.0;
      if (nextComboCount >= 40) { rank = 'SSS'; comboMult = 1.35; }
      else if (nextComboCount >= 28) { rank = 'SS'; comboMult = 1.25; }
      else if (nextComboCount >= 18) { rank = 'S'; comboMult = 1.18; }
      else if (nextComboCount >= 10) { rank = 'A'; comboMult = 1.12; }
      else if (nextComboCount >= 5) { rank = 'B'; comboMult = 1.08; }
      else if (nextComboCount >= 2) { rank = 'C'; comboMult = 1.04; }

      if (rank === 'SSS' && s.combo?.rank !== 'SSS') {
        sound.playCombo();
        pushFx(s.fxQueue, { type: 'quest', text: '🔥 SSS КУРАЖ СТИЛЯ (+35% Урона)!', color: '#facc15' });
        pushLog(s.log, '🔥 ДОСТИГНУТ РАНГ SSS! Герой входит в боевой кураж!', '#facc15');
      }

      if (isNewSkill) {
        pushFx(s.fxQueue, { type: 'quest', text: '⚡ РОТАЦИЯ СКИЛЛА (+3 КОМБО)', color: '#38bdf8' });
      }

      const updatedCombo = {
        count: nextComboCount,
        rank,
        multiplier: comboMult,
        timeLeftSec: 4.5,
      };

      if (id.includes('heal') || id.includes('meditate') || id.includes('rejuvenation')) {
        const hp = Math.min(d.maxHp, s.hp + Math.round(d.maxHp * 0.35));
        pushFx(s.fxQueue, { type: 'heal', skillId: sk.id, text: `+${fmt(Math.round(d.maxHp * 0.35))} HP`, color: '#4ade80' });
        set({ mana, hp, skillCds, combo: updatedCombo, lastSkillCast: id, fxQueue: [...s.fxQueue] });
        if (s.monster && s.monster.hp > 0) {
          triggerMonsterTurn(get(), s.monster, false);
        }
      } else if (s.monster) {
        const skillDmg = Math.round(d.skillPower * 2.5 * comboMult);
        const mHp = Math.max(0, s.monster.hp - skillDmg);
        pushFx(s.fxQueue, { type: 'skill', skillId: sk.id, text: `${sk.icon} ${sk.name} -${fmt(skillDmg)}`, color: sk.color });
        if (mHp <= 0) {
          onKill(s.monster);
          set({ mana, skillCds, combo: updatedCombo, lastSkillCast: id, fxQueue: [...s.fxQueue] });
        } else {
          const updatedM = { ...s.monster, hp: mHp };
          set({ mana, skillCds, monster: updatedM, combo: updatedCombo, lastSkillCast: id, fxQueue: [...s.fxQueue] });
          triggerMonsterTurn(get(), updatedM, false);
        }
      }
    },

    upgradeSkill: (id: string) => {
      const s = get();
      if (s.skillPoints <= 0) return;
      const skillRanks = { ...s.skillRanks, [id]: (s.skillRanks[id] ?? 0) + 1 };
      const autoCast = { ...s.autoCast, [id]: s.autoCast[id] !== undefined ? s.autoCast[id] : true };
      set({ skillRanks, autoCast, skillPoints: s.skillPoints - 1 });
    },

    toggleAutoCast: (id: string) => {
      const s = get();
      set({ autoCast: { ...s.autoCast, [id]: !s.autoCast[id] } });
    },

    learnTalent: (id: string) => {
      const s = get();
      if (s.talentPoints <= 0) return;
      const talents = { ...s.talents, [id]: (s.talents[id] ?? 0) + 1 };
      const derived = computeDerived(s.level, s.stats, s.equipment, talents);
      set({ talents, talentPoints: s.talentPoints - 1, derived });
    },

    claimQuest: (id: string) => {
      const s = get();
      const q = s.quests[id];
      const def = QUESTS.find(x => x.id === id);
      if (!q || !q.done || q.claimed || !def) return;

      const quests = { ...s.quests, [id]: { ...q, claimed: true } };
      let gold = s.gold + (def.reward.gold ?? 0);
      let statPoints = s.statPoints + (def.reward.statPoints ?? 0);
      let talentPoints = s.talentPoints + (def.reward.talentPoints ?? 0);
      let skillPoints = s.skillPoints + (def.reward.skillPoints ?? 0);

      const inventory = [...s.inventory];
      if (def.reward.itemRarity && inventory.length < 72) {
        inventory.push(generateItem(s.level, def.reward.itemRarity));
      }

      set({ quests, gold, statPoints, talentPoints, skillPoints, inventory });
      pushLog(s.log, `🎁 Получена награда за квест «${def.name}»!`, '#4ade80');
      if (def.reward.xp) grantXp(def.reward.xp);
    },

    travelTo: (zoneId: string) => {
      const s = get();
      set({ zoneId, stage: 1, stageKills: 0, dungeon: null, monster: spawnFor(zoneId, 1, s.mastery[zoneId] ?? 0, null) });
    },

    startDungeon: (id: string) => {
      const s = get();
      const run: DungeonRun = { dungeonId: id, wave: 1, totalTimeSec: 60, timeLeftSec: 60 };
      set({ dungeon: run, monster: spawnFor(s.zoneId, 1, 0, run) });
    },

    leaveDungeon: () => {
      const s = get();
      set({ dungeon: null, monster: spawnFor(s.zoneId, s.stage, s.mastery[s.zoneId] ?? 0, null) });
    },

    manualAttack: () => {
      const s = get();
      if (!s.classId || !s.characterName) return;

      let m = s.monster ? { ...s.monster } : null;
      if (!m || !m.hp || isNaN(m.hp) || m.hp <= 0) {
        m = spawnFor(s.zoneId || 'hills', s.stage || 1, (s.mastery && s.mastery[s.zoneId]) ?? 0, s.dungeon || null);
      }

      const d = s.derived || computeDerived(s.level || 1, s.stats, s.equipment || {}, s.talents || {});
      const dmgMin = (d && !isNaN(d.dmgMin) && d.dmgMin > 0) ? d.dmgMin : 15;
      const dmgMax = (d && !isNaN(d.dmgMax) && d.dmgMax >= dmgMin) ? d.dmgMax : dmgMin + 10;
      const critChance = (d && !isNaN(d.critChance)) ? d.critChance : 5;
      const critMult = (d && !isNaN(d.critMult) && d.critMult > 1) ? d.critMult : 1.5;

      const isCrit = Math.random() * 100 < critChance;

      // 1. Elemental Reactions
      const weaponItem = s.equipment.weapon;
      const heroElement = weaponItem?.element ?? (s.classId === 'archmage' ? 'fire' : s.classId === 'paladin' ? 'holy' : s.classId === 'necromancer' ? 'dark' : s.classId === 'deathknight' ? 'ice' : 'physical');
      const monsterElement = s.monster.def.family === 'elemental_fire' ? 'fire' : s.monster.def.family === 'elemental_ice' ? 'ice' : s.monster.def.family === 'elemental_storm' ? 'lightning' : s.monster.def.family === 'spider' ? 'poison' : s.monster.def.family === 'abyss' ? 'dark' : undefined;

      const reaction = calculateElementalReaction(heroElement, monsterElement);

      // Skill-based Combo Bonus points
      let comboBonus = 1;
      if (isCrit) comboBonus += 2;
      if (reaction) comboBonus += 4;

      const curCount = s.combo?.count ?? 0;
      const nextCount = curCount + comboBonus;
      let rank: 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' = 'D';
      let comboMult = 1.0;
      if (nextCount >= 40) { rank = 'SSS'; comboMult = 1.35; }
      else if (nextCount >= 28) { rank = 'SS'; comboMult = 1.25; }
      else if (nextCount >= 18) { rank = 'S'; comboMult = 1.18; }
      else if (nextCount >= 10) { rank = 'A'; comboMult = 1.12; }
      else if (nextCount >= 5) { rank = 'B'; comboMult = 1.08; }
      else if (nextCount >= 2) { rank = 'C'; comboMult = 1.04; }

      if (rank === 'SSS' && s.combo?.rank !== 'SSS') {
        sound.playCombo();
        pushFx(s.fxQueue, { type: 'quest', text: '🔥 SSS КУРАЖ СТИЛЯ (+35% Урона)!', color: '#facc15' });
        pushLog(s.log, '🔥 ДОСТИГНУТ РАНГ SSS! Герой входит в боевой кураж!', '#facc15');
      }

      const updatedCombo = {
        count: nextCount,
        rank,
        multiplier: comboMult,
        timeLeftSec: 4.5,
      };

      const rawDmg = Math.floor(dmgMin + Math.random() * (dmgMax - dmgMin + 1));
      let dealt = Math.max(1, Math.round(rawDmg * (isCrit ? critMult : 1.0) * comboMult));

      if (reaction) {
        dealt = Math.round(dealt * reaction.dmgMult);
        pushFx(s.fxQueue, { type: 'crit', text: `${reaction.icon} ${reaction.name} x${reaction.dmgMult}! (+4 КОМБО)`, color: reaction.color });
        pushLog(s.log, `💥 РЕАКЦИЯ СТИХИЙ: ${reaction.name} наносит ${fmt(dealt)} урона!`, reaction.color);
      }

      // Active Pet companion attack bonus
      if (s.activePetId) {
        const petDef = PETS.find(p => p.id === s.activePetId);
        if (petDef) {
          const petLvl = s.petLvl ?? 1;
          const petDmg = Math.round((dmgMin + dmgMax) * 0.4 * (1 + petLvl * 0.05));
          dealt += petDmg;
          pushFx(s.fxQueue, { type: 'petHit', value: petDmg, text: `🐾 ${petDef.icon} +${fmt(petDmg)}`, color: petDef.color });
        }
      }

      if (isCrit) sound.playCrit(); else sound.playHit();
      m.hp = Math.max(0, m.hp - dealt);

      pushFx(s.fxQueue, {
        type: isCrit ? 'crit' : 'monsterHit',
        value: dealt,
        text: isCrit ? `💥 КРИТ ${fmt(dealt)}` : `${fmt(dealt)}`,
        color: isCrit ? '#facc15' : reaction ? reaction.color : '#f87171'
      });

      // Screen Shake Trigger on critical or boss hits
      if (isCrit || reaction || (m.hp <= 0 && (m.def.isBoss || m.def.isMiniBoss))) {
        set({ screenShake: true });
        setTimeout(() => set({ screenShake: false }), 220);
      }

      if (m.hp <= 0) {
        onKill(m);
        set({ playerAtk: 1.0, combo: updatedCombo, fxQueue: [...s.fxQueue] });
      } else {
        set({ monster: { ...m }, playerAtk: 1.0, combo: updatedCombo, fxQueue: [...s.fxQueue] });
        triggerMonsterTurn(get(), m, false);
      }
    },

    // ==================== RPG 2.0 ACTIONS ====================

    addGem: (gem: GemItem) => {
      const s = get();
      set({ gemsInventory: [...s.gemsInventory, gem] });
    },

    combineGems: (type: GemType, tier: GemTier) => {
      const s = get();
      if (tier >= 5) return false;
      const matching = s.gemsInventory.filter(g => g.type === type && g.tier === tier);
      if (matching.length < 3) return false;

      // Remove 3 gems and add 1 of next tier
      let removed = 0;
      const newGems = s.gemsInventory.filter(g => {
        if (g.type === type && g.tier === tier && removed < 3) {
          removed++;
          return false;
        }
        return true;
      });

      const upgraded = createGem(type, (tier + 1) as GemTier);
      newGems.push(upgraded);
      sound.playSocket();
      pushLog(s.log, `💎 Огранен самоцвет высшего ранга: ${upgraded.name}!`, '#f59e0b');
      set({ gemsInventory: newGems });
      return true;
    },

    socketGem: (slot: SlotId, socketIdx: number, gemId: string) => {
      const s = get();
      const item = s.equipment[slot];
      const gem = s.gemsInventory.find(g => g.id === gemId);
      if (!item || !gem) return false;

      const curSockets = item.sockets ? [...item.sockets] : [null, null];
      curSockets[socketIdx] = gem;

      const updatedItem: Item = { ...item, sockets: curSockets };
      const equipment = { ...s.equipment, [slot]: updatedItem };
      const gemsInventory = s.gemsInventory.filter(g => g.id !== gemId);
      const derived = computeDerived(s.level, s.stats, equipment, s.talents);

      sound.playSocket();
      pushLog(s.log, `💎 ${gem.name} инкрустирован в ${item.name}!`, '#38bdf8');
      set({ equipment, gemsInventory, derived });
      return true;
    },

    unsocketGem: (slot: SlotId, socketIdx: number) => {
      const s = get();
      const item = s.equipment[slot];
      if (!item || !item.sockets || !item.sockets[socketIdx]) return false;

      const removedGem = item.sockets[socketIdx]!;
      const curSockets = [...item.sockets];
      curSockets[socketIdx] = null;

      const updatedItem: Item = { ...item, sockets: curSockets };
      const equipment = { ...s.equipment, [slot]: updatedItem };
      const gemsInventory = [...s.gemsInventory, removedGem];
      const derived = computeDerived(s.level, s.stats, equipment, s.talents);

      sound.playSocket();
      pushLog(s.log, `💎 ${removedGem.name} извлечен из ${item.name}.`, '#94a3b8');
      set({ equipment, gemsInventory, derived });
      return true;
    },

    refineEquipment: (slot: SlotId) => {
      const s = get();
      const item = s.equipment[slot];
      if (!item) return { success: false, newLevel: 0 };

      const curLvl = item.upgradeLevel ?? 0;
      const refInfo = getRefinementInfo(curLvl);
      if (!refInfo) return { success: false, newLevel: curLvl };

      if (s.gold < refInfo.goldCost || (s.enhancementStones || 0) < refInfo.stonesCost) {
        pushLog(s.log, `❌ Недостаточно Золота или Камней Усиления для заточки!`, '#ef4444');
        return { success: false, newLevel: curLvl };
      }

      const newGold = s.gold - refInfo.goldCost;
      const newStones = s.enhancementStones - refInfo.stonesCost;

      const roll = Math.random() * 100;
      if (roll <= refInfo.successChance) {
        const upgraded = applyUpgradeToItem(item);
        const equipment = { ...s.equipment, [slot]: upgraded };
        const derived = computeDerived(s.level, s.stats, equipment, s.talents);
        sound.playRefineSuccess();
        pushLog(s.log, `✨ ЗАТОЧКА УДАЛАСЬ! ${item.name} улучшен до +${upgraded.upgradeLevel}!`, '#facc15');
        pushFx(s.fxQueue, { type: 'loot', text: `✨ +${upgraded.upgradeLevel} УСПЕХ!`, color: '#facc15' });
        set({ equipment, gold: newGold, enhancementStones: newStones, derived });
        return { success: true, newLevel: upgraded.upgradeLevel ?? 0 };
      } else {
        sound.playRefineFail();
        pushLog(s.log, `💥 ЗАТОЧКА НЕ УДАЛАСЬ! Камни потрачены, но предмет уцелел.`, '#ef4444');
        pushFx(s.fxQueue, { type: 'playerHit', text: `💥 НЕУДАЧА!`, color: '#ef4444' });
        set({ gold: newGold, enhancementStones: newStones });
        return { success: false, newLevel: curLvl };
      }
    },

    gatherHerb: (herbId: string, count = 1) => {
      const s = get();
      const herbsInventory = { ...s.herbsInventory, [herbId]: (s.herbsInventory[herbId] || 0) + count };
      set({ herbsInventory });
    },

    craftAlchemyPotion: (recipeId: string) => {
      const s = get();
      const rec = ALCHEMY_RECIPES.find(r => r.id === recipeId);
      if (!rec) return false;

      // Check materials
      const herbs = { ...s.herbsInventory };
      for (const ing of rec.recipe) {
        if ((herbs[ing.herbId] || 0) < ing.count) return false;
      }

      // Consume materials
      for (const ing of rec.recipe) {
        herbs[ing.herbId] -= ing.count;
      }

      sound.playPotion();
      pushLog(s.log, `🧪 Сварено зелье: ${rec.name}!`, rec.color);
      pushFx(s.fxQueue, { type: 'loot', text: `🧪 ${rec.name}`, color: rec.color });

      // Automatically add or drink
      get().useAlchemyPotion(rec.id);
      set({ herbsInventory: herbs });
      return true;
    },

    useAlchemyPotion: (potionId: string) => {
      const s = get();
      const rec = ALCHEMY_RECIPES.find(r => r.id === potionId);
      if (!rec) return false;

      const expireTimestamp = Date.now() + rec.durationSec * 1000;
      const activePotions = [...s.activePotions.filter(p => p.id !== potionId), {
        id: rec.id,
        name: rec.name,
        icon: rec.icon,
        expireTimestamp,
        color: rec.color,
        statBonus: rec.statBonus,
      }];

      sound.playPotion();
      pushLog(s.log, `✨ Активирован эффект зелья «${rec.name}» на ${Math.round(rec.durationSec / 60)} мин!`, rec.color);
      set({ activePotions });
      return true;
    },

    hireMercenary: (squadId: string) => {
      const s = get();
      const squad = s.mercenaries.find(m => m.id === squadId);
      if (!squad || squad.hired || s.gold < squad.cost) return false;

      const mercenaries = s.mercenaries.map(m => m.id === squadId ? { ...m, hired: true } : m);
      sound.playHoly();
      pushLog(s.log, `⚔️ Нанят наёмничий отряд «${squad.name}»!`, '#38bdf8');
      set({ mercenaries, gold: s.gold - squad.cost });
      return true;
    },

    startExpedition: (squadId: string, missionId: string) => {
      const s = get();
      const squad = s.mercenaries.find(m => m.id === squadId);
      const mission = EXPEDITIONS_CATALOG.find(e => e.id === missionId);
      if (!squad || !squad.hired || !mission || squad.power < mission.minPower) return false;

      const endTimestamp = Date.now() + mission.durationSec * 1000;
      const mercenaries = s.mercenaries.map(m => m.id === squadId ? { ...m, currentMissionId: missionId, missionEndTimestamp: endTimestamp } : m);
      const activeExpeditions = [...s.activeExpeditions.filter(e => e.squadId !== squadId), { squadId, missionId, endTimestamp }];

      sound.playEquip();
      pushLog(s.log, `🚀 Отряд «${squad.name}» отправился в «${mission.name}»!`, '#f59e0b');
      set({ mercenaries, activeExpeditions });
      return true;
    },

    claimExpedition: (squadId: string) => {
      const s = get();
      const squad = s.mercenaries.find(m => m.id === squadId);
      if (!squad || !squad.currentMissionId) return;

      const mission = EXPEDITIONS_CATALOG.find(e => e.id === squad.currentMissionId);
      if (!mission) return;

      let gold = s.gold + mission.rewardGold;
      let enhancementStones = (s.enhancementStones || 0) + mission.rewardStones;
      let herbs = { ...s.herbsInventory };
      if (mission.herbDropId && mission.herbDropCount) {
        herbs[mission.herbDropId] = (herbs[mission.herbDropId] || 0) + mission.herbDropCount;
      }

      let gems = [...s.gemsInventory];
      if (Math.random() < mission.gemChance && gems.length < 50) {
        gems.push(createGem('diamond', 2));
      }

      const mercenaries = s.mercenaries.map(m => m.id === squadId ? { ...m, currentMissionId: undefined, missionEndTimestamp: undefined, level: m.level + 1, power: m.power + 35 } : m);
      const activeExpeditions = s.activeExpeditions.filter(e => e.squadId !== squadId);

      grantXp(mission.rewardXp);
      sound.playLevelUp();
      pushLog(s.log, `🏆 Экспедиция «${mission.name}» завершена! +${fmt(mission.rewardGold)}g, +${mission.rewardStones} Камней!`, '#4ade80');
      pushFx(s.fxQueue, { type: 'loot', text: `🏆 ЭКСПЕДИЦИЯ ЗАВЕРШЕНА!`, color: '#4ade80' });
      set({ gold, enhancementStones, herbsInventory: herbs, gemsInventory: gems, mercenaries, activeExpeditions });
    },

    drawTarotCard: () => {
      const s = get();
      if (s.gold < 15000) return false;
      const pick = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
      sound.playTarot();
      pushLog(s.log, `🎴 Из колоды вытянута карта Таро: ${pick.name}!`, pick.color);
      set({ gold: s.gold - 15000, tarotCards: [...s.tarotCards, pick] });
      return true;
    },

    useTarotCard: (cardId: string) => {
      const s = get();
      const card = s.tarotCards.find(c => c.id === cardId);
      if (!card) return false;

      sound.playTarot();
      const d = s.derived;

      if (card.effect === 'heal_full') {
        set({ hp: d.maxHp, mana: d.maxMana });
        pushFx(s.fxQueue, { type: 'heal', text: '☀️ СОЛНЦЕ: 100% HP/МАНА!', color: card.color });
      } else if (card.effect === 'boss_smite' && s.monster) {
        const smiteDmg = Math.round(s.monster.hp * 0.35);
        s.monster.hp = Math.max(0, s.monster.hp - smiteDmg);
        pushFx(s.fxQueue, { type: 'crit', text: `💀 СМЕРТЬ -${fmt(smiteDmg)}!`, color: card.color });
      } else if (card.effect === 'meteor_storm' && s.monster) {
        const stormDmg = Math.round(d.playerAtk * 4.5);
        s.monster.hp = Math.max(0, s.monster.hp - stormDmg);
        pushFx(s.fxQueue, { type: 'skill', text: `⚡ БАШНЯ: МЕТЕОР -${fmt(stormDmg)}!`, color: card.color });
      } else if (card.effect === 'invulnerability') {
        set({ shield: (s.shield || 0) + Math.round(d.maxHp * 1.5) });
        pushFx(s.fxQueue, { type: 'block', text: '👑 ИМПЕРАТОР: НЕУЯЗВИМОСТЬ!', color: card.color });
      }

      const tarotCards = s.tarotCards.filter(c => c.id !== cardId);
      pushLog(s.log, `🎴 Активирована Карта Судьбы: ${card.name}!`, card.color);
      set({ tarotCards });
      return true;
    },

    equipWing: (wingId: string) => {
      const s = get();
      sound.playHoly();
      pushLog(s.log, `🪽 Надеты крылья: ${WINGS_CATALOG.find(w => w.id === wingId)?.name}!`, '#facc15');
      set({ activeWings: wingId });
    },

    unlockWing: (wingId: string) => {
      const s = get();
      const def = WINGS_CATALOG.find(w => w.id === wingId);
      if (!def || s.unlockedWings.includes(wingId)) return false;
      if (def.costGold && s.gold < def.costGold) return false;

      sound.playHoly();
      pushLog(s.log, `🪽 Разблокирована косметика: ${def.name}!`, def.auraColor);
      set({
        gold: def.costGold ? s.gold - def.costGold : s.gold,
        unlockedWings: [...s.unlockedWings, wingId],
        activeWings: wingId,
      });
      return true;
    },

    upgradeAscendancy: (constellationId: string) => {
      const s = get();
      const def = ASCENDANCY_CONSTELLATIONS.find(c => c.id === constellationId);
      const curLvl = s.ascendancyLevels[constellationId] || 0;
      if (!def || curLvl >= def.maxLevel || s.celestialShards < def.costPerLevel) return false;

      sound.playLevelUp();
      pushLog(s.log, `🌌 Улучшено созвездие «${def.name}» (Ур. ${curLvl + 1})!`, '#c084fc');
      set({
        celestialShards: s.celestialShards - def.costPerLevel,
        ascendancyLevels: { ...s.ascendancyLevels, [constellationId]: curLvl + 1 },
      });
      return true;
    },

    triggerScreenShake: () => {
      set({ screenShake: true });
      setTimeout(() => set({ screenShake: false }), 220);
    },

    manualBlock: () => {
      const s = get();
      const d = s.derived || computeDerived(s.level || 1, s.stats, s.equipment || {}, s.talents || {});
      const blockShield = Math.round((d.maxHp || 100) * 0.35);
      const newShield = (s.shield ?? 0) + blockShield;
      sound.playBlock();
      pushFx(s.fxQueue, { type: 'block', value: blockShield, text: `🛡️ СТАЛЬНОЙ БЛОК (+${fmt(blockShield)})`, color: '#38bdf8' });
      pushLog(s.log, `🛡️ Ваша стойка Блока поглотит урон! (+${fmt(blockShield)} HP щита)`, '#38bdf8');
      set({ shield: newShield, fxQueue: [...s.fxQueue] });

      if (s.monster && s.monster.hp > 0) {
        triggerMonsterTurn(get(), s.monster, true);
      }
    },

    manualFlee: () => {
      const s = get();
      sound.playLoot();
      pushLog(s.log, `🏃 Вы успешно уклонились и убежали на Этап 1!`, '#38bdf8');
      pushFx(s.fxQueue, { type: 'flee', text: '🏃 ПОБЕГ НА ЭТАП 1!', color: '#38bdf8' });
      set({
        stage: 1,
        stageKills: 0,
        dungeon: null,
        monster: spawnFor(s.zoneId || 'hills', 1, (s.mastery && s.mastery[s.zoneId]) ?? 0, null),
        fxQueue: [...s.fxQueue]
      });
    },

    toggleSfx: () => {
      const s = get();
      const next = !s.sfxMuted;
      sound.setSfxMuted(next);
      set({ sfxMuted: next });
    },

    toggleMusic: () => {
      const s = get();
      const next = !s.musicMuted;
      sound.setMusicMuted(next);
      set({ musicMuted: next });
    },

    clearFx: () => set({ fxQueue: [] }),

    save: () => {
      if (isResettingGame) return;
      const s = get();
      if (!s.classId || !s.characterName) return;
      const slotId = getActiveSlotId();
      const data = {
        characterName: s.characterName,
        classId: s.classId,
        level: s.level, xp: s.xp, gold: s.gold, totalGoldEarned: s.totalGoldEarned,
        stats: s.stats, statPoints: s.statPoints, skillPoints: s.skillPoints, talentPoints: s.talentPoints,
        equipment: s.equipment, inventory: s.inventory,
        skillRanks: s.skillRanks, autoCast: s.autoCast, talents: s.talents,
        zoneId: s.zoneId, stage: s.stage, stageKills: s.stageKills, mastery: s.mastery,
        unlockedZones: s.unlockedZones, unlockedSecrets: s.unlockedSecrets,
        activePetId: s.activePetId, petLvl: s.petLvl, petXp: s.petXp, petCustomNames: s.petCustomNames,
        quests: s.quests, kills: s.kills, bossKills: s.bossKills, dungeonsCleared: s.dungeonsCleared,
        // RPG 2.0 Persisted Data
        gemsInventory: s.gemsInventory,
        herbsInventory: s.herbsInventory,
        enhancementStones: s.enhancementStones,
        celestialShards: s.celestialShards,
        ascendancyLevels: s.ascendancyLevels,
        mercenaries: s.mercenaries,
        activeExpeditions: s.activeExpeditions,
        tarotCards: s.tarotCards,
        activeWings: s.activeWings,
        unlockedWings: s.unlockedWings,
        sfxMuted: s.sfxMuted, musicMuted: s.musicMuted,
        savedAt: Date.now(),
      };
      try {
        localStorage.setItem(getSlotSaveKey(slotId), JSON.stringify(data));
      } catch { /* ignore */ }
      set({ lastSave: Date.now() });
    },

    hardReset: () => {
      isResettingGame = true;
      const slotId = getActiveSlotId();
      try {
        localStorage.removeItem(getSlotSaveKey(slotId));
        localStorage.removeItem(SAVE_KEY);
      } catch { /* ignore */ }
      location.reload();
    },

    setSlotFilter: (slot) => set({ selectedSlotFilter: slot }),
  };
});

// ===================== LOAD SAVE =====================
export function loadSave() {
  try {
    const slotId = getActiveSlotId();
    let raw = localStorage.getItem(getSlotSaveKey(slotId));
    if (!raw) {
      raw = localStorage.getItem(SAVE_KEY);
    }
    if (!raw) return;
    const d = JSON.parse(raw);
    if (!d || typeof d !== 'object') return;
    const s = useGame.getState();
    const quests = { ...s.quests };
    Object.entries(d.quests ?? {}).forEach(([k, v]) => { if (quests[k]) quests[k] = v as never; });
    const targetZoneId = d.zoneId && ZONES.some(z => z.id === d.zoneId) ? d.zoneId : 'hills';

    sound.setSfxMuted(d.sfxMuted ?? false);
    sound.setMusicMuted(d.musicMuted ?? false);
    sound.updateZoneAndStage(targetZoneId, d.stage ?? 1);

    useGame.setState({
      characterName: d.characterName ?? '',
      classId: d.classId ?? '',
      level: d.level ?? 1, xp: d.xp ?? 0, gold: d.gold ?? 0, totalGoldEarned: d.totalGoldEarned ?? 0,
      stats: { ...s.stats, ...(d.stats ?? {}) }, statPoints: d.statPoints ?? 0,
      skillPoints: d.skillPoints ?? 0, talentPoints: d.talentPoints ?? 0,
      equipment: d.equipment ?? {}, inventory: d.inventory ?? [],
      skillRanks: d.skillRanks ?? {}, autoCast: d.autoCast ?? {}, talents: d.talents ?? {},
      zoneId: targetZoneId, stage: d.stage ?? 1, stageKills: d.stageKills ?? 0,
      mastery: d.mastery ?? {}, unlockedZones: d.unlockedZones ?? ['hills'],
      unlockedSecrets: d.unlockedSecrets ?? [],
      activePetId: d.activePetId ?? 'pet_dragon',
      petLvl: d.petLvl ?? 1,
      petXp: d.petXp ?? 0,
      petCustomNames: d.petCustomNames ?? {},
      // RPG 2.0 Restore
      gemsInventory: d.gemsInventory ?? s.gemsInventory,
      herbsInventory: d.herbsInventory ?? s.herbsInventory,
      enhancementStones: d.enhancementStones ?? s.enhancementStones,
      celestialShards: d.celestialShards ?? 0,
      ascendancyLevels: d.ascendancyLevels ?? {},
      mercenaries: d.mercenaries ?? s.mercenaries,
      activeExpeditions: d.activeExpeditions ?? [],
      tarotCards: d.tarotCards ?? s.tarotCards,
      activeWings: d.activeWings ?? 'wing_archangel',
      unlockedWings: d.unlockedWings ?? ['wing_archangel'],
      sfxMuted: d.sfxMuted ?? false,
      musicMuted: d.musicMuted ?? false,
      quests, kills: d.kills ?? 0, bossKills: d.bossKills ?? 0, dungeonsCleared: d.dungeonsCleared ?? 0,
    });
    // recompute derived and respawn
    const st2 = useGame.getState();
    const derived = computeDerived(st2.level, st2.stats, st2.equipment, st2.talents);
    useGame.setState({
      derived,
      hp: derived.maxHp, mana: derived.maxMana,
      monster: spawnFor(st2.zoneId, st2.stage, st2.mastery[st2.zoneId] ?? 0, null),
    });
  } catch (err) {
    console.error('Failed to load save:', err);
  }
}
