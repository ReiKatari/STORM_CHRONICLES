import { create } from 'zustand';
import type { ActiveMonster, BaseStats, DungeonRun, FxEvent, Item, LogEntry, QuestState, SlotId, StatId, SlotKind } from './types';
import { generateItem, rarityById } from './items';
import { DUNGEONS, makeMonster, ZONES, zoneById, dungeonById } from './monsters';
import { QUESTS } from './quests';
import { SKILLS, TALENTS } from './skills';
import { computeDerived, MAX_LEVEL, mitigate, monsterReward, monsterStats, rarityAtLeast, xpForLevel } from './engine';
import type { DerivedStats } from './engine';
import { getClassById, HERO_CLASSES } from './classes';
import { sound } from './sound';

let fxId = 1;
let logId = 1;

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

  // skills & talents
  skillRanks: Record<string, number>;
  skillCds: Record<string, number>;
  autoCast: Record<string, boolean>;
  talents: Record<string, number>;

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

  // derived (recomputed)
  derived: DerivedStats;

  // actions
  initCharacter: (name: string, classId: string) => void;
  tick: (dt: number) => void;
  allocateStat: (s: StatId) => void;
  allocateStat10: (s: StatId) => void;
  equip: (itemId: string) => void;
  unequip: (slot: SlotId) => void;
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
  save: () => void;
  hardReset: () => void;
  setSlotFilter: (slot: SlotKind | 'all') => void;
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

const SAVE_KEY = 'rogalik_save_v4';
let isResettingGame = false;

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

  function recalc(): DerivedStats {
    const s = get();
    return computeDerived(s.level, s.stats, s.equipment, s.talents);
  }

  function addQuestProgress(kind: QuestState['id'] extends never ? never : string, target: string, amount: number) {
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
      const d = recalc();
      sound.playLevelUp();
      pushFx(s.fxQueue, { type: 'levelup', text: `Уровень ${level}!`, color: '#facc15' });
      pushLog(s.log, `⬆️ Уровень ${level}! +${(5 + tBonus) * leveled} очков статов`, '#facc15');
      set({ xp, level, statPoints, skillPoints, talentPoints, hp: d.maxHp, mana: d.maxMana, derived: d });
      addQuestProgress('level', '', level);
    } else {
      set({ xp });
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

    // loot chance
    const dropChance = 0.35 * (1 + d.dropBonus / 100) * (m.def.isBoss ? 2.5 : m.def.isMiniBoss ? 1.5 : 1);
    const newInventory = [...s.inventory];
    if (Math.random() < dropChance && newInventory.length < 72) {
      const drop = generateItem(m.level, m.def.isBoss ? 'rare' : undefined);
      newInventory.push(drop);
      const r = rarityById(drop.rarity);
      sound.playLoot();
      pushLog(s.log, `✨ Выпал предмет: ${drop.name}`, r.color);
      pushFx(s.fxQueue, { type: 'loot', text: drop.name, color: r.color });
      addQuestProgress('loot', drop.rarity, 1);
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
          inventory: newInventory, unlockedSecrets,
          monster: spawnFor(s.zoneId, s.stage, s.mastery[s.zoneId] ?? 0, null),
        });
        return;
      } else {
        const nextDungeonRun: DungeonRun = { ...s.dungeon, wave: nextWave };
        set({
          dungeon: nextDungeonRun,
          kills, bossKills,
          gold: s.gold + goldGain, totalGoldEarned: s.totalGoldEarned + goldGain,
          inventory: newInventory, unlockedSecrets,
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
      inventory: newInventory,
      monster: spawnFor(s.zoneId, stage, mastery[s.zoneId] ?? 0, null),
    });

    addQuestProgress('gold', '', s.gold + goldGain);
  }

  return {
    characterName: '',
    classId: '',
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
        const s = get();
        if (!s.classId || !s.characterName) return;

        // Ensure active valid monster inline
        let currentM = s.monster ? { ...s.monster } : null;
        if (!currentM || !currentM.hp || isNaN(currentM.hp) || currentM.hp <= 0) {
          currentM = spawnFor(s.zoneId || 'hills', s.stage || 1, (s.mastery && s.mastery[s.zoneId]) ?? 0, s.dungeon || null);
        }

        const d = s.derived || computeDerived(s.level || 1, s.stats, s.equipment || {}, s.talents || {});
        let hp = Math.min(d.maxHp, (s.hp ?? d.maxHp) + d.regen * dt);
        let mana = Math.min(d.maxMana, (s.mana ?? d.maxMana) + d.manaRegen * dt);

        const newCds: Record<string, number> = {};
        if (s.skillCds) {
          Object.entries(s.skillCds).forEach(([k, v]) => {
            if (v && v > 0) newCds[k] = Math.max(0, v - dt);
          });
        }

        // Auto-cast skills
        const cls = getClassById(s.classId);
        if (cls && Array.isArray(cls.skills)) {
          for (const sk of cls.skills) {
            if ((s.autoCast ? s.autoCast[sk.id] !== false : true) && (s.skillRanks[sk.id] ?? 0) > 0 && (newCds[sk.id] ?? 0) === 0) {
              if (mana >= sk.manaCost) {
                mana -= sk.manaCost;
                newCds[sk.id] = sk.cooldown * (1 - d.cdReduction / 100);
                let skillDmg = Math.round(d.skillPower * 2.5);
                if (sk.id.includes('heal') || sk.id.includes('meditate') || sk.id.includes('rejuvenation')) {
                  hp = Math.min(d.maxHp, hp + Math.round(d.maxHp * 0.35));
                  pushFx(s.fxQueue, { type: 'heal', text: `+${fmt(Math.round(d.maxHp * 0.35))} HP`, color: '#4ade80' });
                } else if (currentM) {
                  currentM.hp -= skillDmg;
                  pushFx(s.fxQueue, { type: 'skill', text: `✨ ${sk.name} -${fmt(skillDmg)}`, color: sk.color });
                  if (currentM.hp <= 0) {
                    onKill(currentM);
                    set({ hp, mana, skillCds: newCds, fxQueue: [...s.fxQueue] });
                    return;
                  }
                }
              }
            }
          }
        }

        // Active Pet Companion Auto-Attack & Auto-Skills
        if (s.activePetId && currentM) {
          const petDef = PETS.find(p => p.id === s.activePetId);
          if (petDef) {
            const petLvl = s.petLvl ?? 1;
            const petDmg = Math.round((d.dmgMin + d.dmgMax) * 0.4 * (1 + petLvl * 0.05));
            const petAtkTimer = ((s as any).petAtkTimer ?? 0) + dt;
            if (petAtkTimer >= 1.8) {
              currentM.hp -= petDmg;
              pushFx(s.fxQueue, { type: 'petHit', value: petDmg, text: `🐾 ${petDef.icon} ${fmt(petDmg)}`, color: petDef.color });
              (s as any).petAtkTimer = 0;
              if (currentM.hp <= 0) {
                onKill(currentM);
                set({ hp, mana, skillCds: newCds, fxQueue: [...s.fxQueue] });
                return;
              }
            } else {
              (s as any).petAtkTimer = petAtkTimer;
            }
          }
        }

        // Monster attack timer
        if (currentM) {
          let mTimer = (currentM.attackTimer ?? 0) + dt;
          if (mTimer >= 1.8) {
            mTimer = 0;
            if (Math.random() * 100 >= d.dodge) {
              const mDmg = mitigate(currentM.dmg, d.armor);
              let remDmg = mDmg;
              let currShield = s.shield ?? 0;
              if (currShield > 0) {
                const absorbed = Math.min(currShield, remDmg);
                currShield -= absorbed;
                remDmg -= absorbed;
              }
              hp -= remDmg;
              pushFx(s.fxQueue, { type: 'playerHit', value: mDmg, text: `-${fmt(mDmg)}`, color: '#ef4444' });
              if (hp <= 0) {
                hp = d.maxHp;
                pushLog(s.log, `☠️ Вы погибли от рук ${currentM.def.name}. Отступление на этап 1!`, '#ef4444');
                set({ stage: 1, stageKills: 0, dungeon: null, monster: spawnFor(s.zoneId || 'hills', 1, (s.mastery && s.mastery[s.zoneId]) ?? 0, null), hp, mana: d.maxMana, shield: 0, playerAtk: 0 });
                return;
              }
              set({ shield: currShield });
            } else {
              pushFx(s.fxQueue, { type: 'dodge', text: '💨 Уворот!', color: '#38bdf8' });
            }
          }
          currentM.attackTimer = mTimer;
        }

        set({ hp, mana, monster: currentM, skillCds: newCds, fxQueue: [...s.fxQueue] });
      } catch (err) {
        console.error('Combat tick error:', err);
      }
    },

    equipBestAll: () => {
      const s = get();
      let equipment = { ...s.equipment };
      let inventory = [...s.inventory];

      // 1. Single Slots
      const singleSlots: { slotId: SlotId; kind: string }[] = [
        { slotId: 'helmet', kind: 'helmet' },
        { slotId: 'shoulders', kind: 'shoulders' },
        { slotId: 'armor', kind: 'armor' },
        { slotId: 'cloak', kind: 'cloak' },
        { slotId: 'weapon', kind: 'weapon' },
        { slotId: 'pants', kind: 'pants' },
        { slotId: 'banner', kind: 'banner' },
        { slotId: 'gloves', kind: 'gloves' },
        { slotId: 'kneepads', kind: 'kneepads' },
        { slotId: 'boots', kind: 'boots' },
        { slotId: 'amulet', kind: 'amulet' },
      ];

      singleSlots.forEach(({ slotId, kind }) => {
        const candidates = inventory.filter(i => i.slot === kind).sort((a, b) => b.score - a.score);
        if (candidates.length === 0) return;

        const best = candidates[0];
        const equipped = equipment[slotId];

        if (!equipped || best.score > equipped.score) {
          inventory = inventory.filter(i => i.id !== best.id);
          if (equipped) inventory.push(equipped);
          equipment[slotId] = best;
        }
      });

      // 2. Rings (ring1 & ring2)
      let ringCandidates = inventory.filter(i => i.slot === 'ring').sort((a, b) => b.score - a.score);
      if (ringCandidates.length > 0) {
        const best1 = ringCandidates[0];
        const eq1 = equipment.ring1;
        if (!eq1 || best1.score > eq1.score) {
          inventory = inventory.filter(i => i.id !== best1.id);
          if (eq1) inventory.push(eq1);
          equipment.ring1 = best1;
        }
      }
      ringCandidates = inventory.filter(i => i.slot === 'ring').sort((a, b) => b.score - a.score);
      if (ringCandidates.length > 0) {
        const best2 = ringCandidates[0];
        const eq2 = equipment.ring2;
        if (!eq2 || best2.score > eq2.score) {
          inventory = inventory.filter(i => i.id !== best2.id);
          if (eq2) inventory.push(eq2);
          equipment.ring2 = best2;
        }
      }

      // 3. Earrings (earring1 & earring2)
      let earringCandidates = inventory.filter(i => i.slot === 'earring').sort((a, b) => b.score - a.score);
      if (earringCandidates.length > 0) {
        const best1 = earringCandidates[0];
        const eq1 = equipment.earring1;
        if (!eq1 || best1.score > eq1.score) {
          inventory = inventory.filter(i => i.id !== best1.id);
          if (eq1) inventory.push(eq1);
          equipment.earring1 = best1;
        }
      }
      earringCandidates = inventory.filter(i => i.slot === 'earring').sort((a, b) => b.score - a.score);
      if (earringCandidates.length > 0) {
        const best2 = earringCandidates[0];
        const eq2 = equipment.earring2;
        if (!eq2 || best2.score > eq2.score) {
          inventory = inventory.filter(i => i.id !== best2.id);
          if (eq2) inventory.push(eq2);
          equipment.earring2 = best2;
        }
      }

      const derived = computeDerived(s.level, s.stats, equipment, s.talents);
      sound.playEquip();
      set({ equipment, inventory, derived });
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

    unequip: (slot: SlotId) => {
      const s = get();
      const prev = s.equipment[slot];
      if (!prev || s.inventory.length >= 72) return;

      const equipment = { ...s.equipment };
      delete equipment[slot];
      const inventory = [...s.inventory, prev];
      const derived = computeDerived(s.level, s.stats, equipment, s.talents);
      set({ equipment, inventory, derived });
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
      const sk = cls.skills.find(x => x.id === id);
      if (!sk || (s.skillRanks[id] ?? 0) <= 0 || (s.skillCds[id] ?? 0) > 0) return;
      if (s.mana < sk.manaCost) return;

      const mana = s.mana - sk.manaCost;
      const d = s.derived;
      const skillCds = { ...s.skillCds, [id]: sk.cooldown * (1 - d.cdReduction / 100) };

      if (id.includes('heal') || id.includes('meditate') || id.includes('rejuvenation')) {
        const hp = Math.min(d.maxHp, s.hp + Math.round(d.maxHp * 0.35));
        pushFx(s.fxQueue, { type: 'heal', text: `+${fmt(Math.round(d.maxHp * 0.35))} HP`, color: '#4ade80' });
        set({ mana, hp, skillCds });
      } else {
        const skillDmg = Math.round(d.skillPower * 2.5);
        const mHp = s.monster.hp - skillDmg;
        pushFx(s.fxQueue, { type: 'skill', text: `✨ ${sk.name} -${fmt(skillDmg)}`, color: sk.color });
        if (mHp <= 0) {
          onKill(s.monster);
          set({ mana, skillCds });
        } else {
          set({ mana, skillCds, monster: { ...s.monster, hp: mHp } });
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
      if (!s.monster) return;
      let m = { ...s.monster };
      const d = s.derived;

      const isCrit = Math.random() * 100 < d.critChance;
      const rawDmg = Math.floor(d.dmgMin + Math.random() * (d.dmgMax - d.dmgMin + 1));
      const dealt = Math.round(rawDmg * (isCrit ? d.critMult : 1.0));

      if (isCrit) sound.playCrit(); else sound.playHit();
      m.hp -= dealt;
      pushFx(s.fxQueue, {
        type: isCrit ? 'crit' : 'monsterHit',
        value: dealt,
        text: isCrit ? `💥 КРИТ ${fmt(dealt)}` : `${fmt(dealt)}`,
        color: isCrit ? '#facc15' : '#f87171'
      });

      if (m.hp <= 0) {
        onKill(m);
        set({ playerAtk: 1.0, fxQueue: [...s.fxQueue] });
      } else {
        set({ playerAtk: 1.0, monster: m, fxQueue: [...s.fxQueue] });
      }
    },

    manualBlock: () => {
      const s = get();
      const d = s.derived;
      const blockShield = Math.round(d.maxHp * 0.35);
      const newShield = (s.shield ?? 0) + blockShield;
      sound.playLevelUp();
      pushFx(s.fxQueue, { type: 'heal', text: `🛡️ БЛОК +${fmt(blockShield)} Щит!`, color: '#facc15' });
      pushLog(s.log, `🛡️ Ваша стойка Блока поглотит урон! (+${fmt(blockShield)} HP щита)`, '#facc15');
      set({ shield: newShield, fxQueue: [...s.fxQueue] });
    },

    manualFlee: () => {
      const s = get();
      sound.playLoot();
      pushLog(s.log, `🏃 Вы успешно уклонились и убежали на Этап 1!`, '#38bdf8');
      pushFx(s.fxQueue, { type: 'dodge', text: '🏃 Убежал на этап 1!', color: '#38bdf8' });
      set({
        stage: 1,
        stageKills: 0,
        dungeon: null,
        monster: spawnFor(s.zoneId || 'hills', 1, (s.mastery && s.mastery[s.zoneId]) ?? 0, null),
        fxQueue: [...s.fxQueue]
      });
    },

    clearFx: () => set({ fxQueue: [] }),

    save: () => {
      if (isResettingGame) return;
      const s = get();
      if (!s.classId || !s.characterName) return;
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
        savedAt: Date.now(),
      };
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
      set({ lastSave: Date.now() });
    },

    hardReset: () => {
      isResettingGame = true;
      localStorage.removeItem(SAVE_KEY);
      location.reload();
    },

    setSlotFilter: (slot) => set({ selectedSlotFilter: slot }),
  };
});

// ===================== LOAD SAVE =====================
export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (!d || typeof d !== 'object') return;
    const s = useGame.getState();
    const quests = { ...s.quests };
    Object.entries(d.quests ?? {}).forEach(([k, v]) => { if (quests[k]) quests[k] = v as never; });
    const targetZoneId = d.zoneId && ZONES.some(z => z.id === d.zoneId) ? d.zoneId : 'hills';
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
    try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
  }
}
