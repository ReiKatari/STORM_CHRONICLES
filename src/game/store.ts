import { create } from 'zustand';
import type { ActiveMonster, BaseStats, DungeonRun, FxEvent, Item, LogEntry, QuestState, SlotId, StatId } from './types';
import { generateItem, rarityById } from './items';
import { DUNGEONS, makeMonster, ZONES, zoneById, dungeonById } from './monsters';
import { QUESTS } from './quests';
import { SKILLS, TALENTS } from './skills';
import { computeDerived, MAX_LEVEL, mitigate, monsterReward, monsterStats, rarityAtLeast, xpForLevel } from './engine';
import type { DerivedStats } from './engine';

let fxId = 1;
let logId = 1;

export interface GameState {
  // character
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
  clearFx: () => void;
  save: () => void;
  hardReset: () => void;
  setSlotFilter: (slot: SlotKind | 'all') => void;
}

const baseStats = (): BaseStats => ({ str: 5, agi: 5, vit: 5, int: 5, end: 5, luk: 5, wis: 5, per: 5, cha: 5, wil: 5 });

function zoneBaseLevel(zoneIndex: number): number {
  return 1 + zoneIndex * 15;
}

function makeQuestState(): Record<string, QuestState> {
  const q: Record<string, QuestState> = {};
  QUESTS.forEach(def => { q[def.id] = { id: def.id, progress: 0, done: false, claimed: false }; });
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

const SAVE_KEY = 'rogalik_save_v1';

function pushFx(fx: FxEvent[], e: Omit<FxEvent, 'id'>) {
  fx.push({ ...e, id: fxId++ });
  if (fx.length > 60) fx.splice(0, fx.length - 60);
}
function pushLog(log: LogEntry[], text: string, color = '#e2e8f0') {
  log.push({ id: logId++, text, color, time: Date.now() });
  if (log.length > 80) log.splice(0, log.length - 80);
}

const initialDerived = computeDerived(1, baseStats(), {}, {});

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
    let xp = s.xp + amount;
    let level = s.level;
    let statPoints = s.statPoints;
    let skillPoints = s.skillPoints;
    let talentPoints = s.talentPoints;
    const tBonus = s.talents['t_stats'] ?? 0;
    let leveled = 0;
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
    const goldGain = Math.floor(m.gold * (1 + d.goldBonus / 100));
    const xpGain = Math.floor(m.xp * (1 + d.xpBonus / 100));
    const totalGold = s.totalGoldEarned + goldGain;
    pushFx(s.fxQueue, { type: 'death', value: m.def.isBoss ? 2 : m.def.isMiniBoss ? 1 : 0 });
    pushLog(s.log, `☠️ ${m.def.name} (ур.${m.level}) — +${xpGain} опыта, +${goldGain} золота`, m.def.isBoss ? '#fb923c' : '#94a3b8');
    set({ gold: s.gold + goldGain, totalGoldEarned: totalGold, kills: s.kills + 1 });
    addQuestProgress('kill', m.def.family, 1);
    addQuestProgress('gold', '', totalGold);

    // loot
    const dropChance = (m.def.isBoss ? 1 : m.def.isMiniBoss ? 0.75 : 0.26) + d.dropBonus / 200;
    const loot: Item[] = [];
    if (Math.random() < dropChance) {
      const bonus = s.dungeon ? dungeonById(s.dungeon.dungeonId).lootBonus : 0;
      loot.push(generateItem(m.level, s.stats.luk + d.dropBonus * 0.3, bonus));
    }
    if (m.def.isBoss) {
      const bonus = s.dungeon ? dungeonById(s.dungeon.dungeonId).lootBonus : 2;
      loot.push(generateItem(m.level, s.stats.luk, bonus + 2));
      if (Math.random() < 0.35) loot.push(generateItem(m.level, s.stats.luk, bonus));
      set({ bossKills: s.bossKills + 1 });
      addQuestProgress('boss', '', 1);
    }
    if (loot.length > 0) {
      const inv = [...s.inventory, ...loot].slice(-72);
      set({ inventory: inv });
      loot.forEach(it => {
        const r = rarityById(it.rarity);
        pushFx(s.fxQueue, { type: 'loot', text: it.icon, color: r.color });
        pushLog(s.log, `🎁 Дроп: ${it.name} [${r.name}]`, r.color);
        addQuestProgress('loot', it.rarity, 1);
      });
    }
    grantXp(xpGain);

    // progression
    const s2 = get();
    if (s2.dungeon) {
      const dun = dungeonById(s2.dungeon.dungeonId);
      if (s2.dungeon.wave >= dun.waves) {
        // dungeon cleared!
        pushLog(s2.log, `🏆 Подземелье «${dun.name}» пройдено!`, '#4ade80');
        pushFx(s2.fxQueue, { type: 'levelup', text: '🏆 Подземелье пройдено!', color: '#4ade80' });
        const bonusItems = [generateItem(dun.minLevel + 10, s2.stats.luk, dun.lootBonus), generateItem(dun.minLevel + 10, s2.stats.luk, dun.lootBonus)];
        set({
          dungeon: null,
          dungeonsCleared: s2.dungeonsCleared + 1,
          inventory: [...get().inventory, ...bonusItems].slice(-72),
        });
        addQuestProgress('dungeon', '', 1);
        bonusItems.forEach(it => { pushLog(get().log, `🎁 Награда: ${it.name}`, rarityById(it.rarity).color); addQuestProgress('loot', it.rarity, 1); });
      } else {
        set({ dungeon: { ...s2.dungeon, wave: s2.dungeon.wave + 1 } });
      }
    } else {
      const zone = zoneById(s2.zoneId);
      if (m.def.isBoss) {
        const mastery = { ...s2.mastery, [zone.id]: (s2.mastery[zone.id] ?? 0) + 1 };
        // unlock next zone
        const zi = ZONES.findIndex(z => z.id === zone.id);
        const next = ZONES[zi + 1];
        const unlockedZones = [...s2.unlockedZones];
        if (next && !next.hidden && !unlockedZones.includes(next.id)) {
          unlockedZones.push(next.id);
          pushLog(s2.log, `🗺️ Открыта новая территория: ${next.name}!`, '#4ade80');
        }
        pushLog(s2.log, `👑 Босс «${zone.name}» повержен! Цикл усиления +1`, '#fb923c');
        set({ mastery, unlockedZones, stage: 1, stageKills: 0 });
      } else {
        const kills = s2.stageKills + 1;
        if (kills >= zone.killsPerStage) {
          const ns = Math.min(zone.stages, s2.stage + 1);
          const zone2 = zoneById(s2.zoneId);
          if (ns === Math.ceil(zone2.stages / 2)) pushLog(s2.log, `⚠️ Мини-босс приближается...`, '#c084fc');
          if (ns === zone2.stages) pushLog(s2.log, `💀 Босс ждёт впереди: ${zone2.bossName}!`, '#f87171');
          set({ stage: ns, stageKills: 0 });
          pushFx(s2.fxQueue, { type: 'quest', text: `Этап ${ns}/${zone2.stages}`, color: '#93c5fd' });
        } else {
          set({ stageKills: kills });
        }
      }
    }

    // respawn
    const s3 = get();
    const newM = spawnFor(s3.zoneId, s3.stage, s3.mastery[s3.zoneId] ?? 0, s3.dungeon);
    if (newM.def.isBoss) pushFx(s3.fxQueue, { type: 'bossSpawn', text: newM.def.name, color: '#f87171' });
    set({ monster: newM });
  }

  function playerAttack() {
    const s = get();
    const d = s.derived;
    const m = s.monster;
    let dmg = Math.floor(d.dmgMin + Math.random() * (d.dmgMax - d.dmgMin));
    if (m.def.isBoss) dmg = Math.floor(dmg * (1 + d.bossDmg / 100));
    const crit = Math.random() * 100 < d.critChance;
    if (crit) dmg = Math.floor(dmg * d.critMult);
    dmg = mitigate(dmg, 0);
    let healFromLs = 0;
    if (d.lifesteal > 0) healFromLs = Math.floor(dmg * d.lifesteal / 100);
    const newHp = m.hp - dmg;
    pushFx(s.fxQueue, { type: crit ? 'crit' : 'playerHit', value: dmg, color: crit ? '#facc15' : '#e2e8f0' });
    if (healFromLs > 0) set({ hp: Math.min(d.maxHp, s.hp + healFromLs) });
    if (newHp <= 0) {
      set({ monster: { ...m, hp: 0 } });
      onKill({ ...m, hp: 0 });
    } else {
      set({ monster: { ...m, hp: newHp } });
    }
  }

  function monsterAttack() {
    const s = get();
    const d = s.derived;
    const m = s.monster;
    if (m.hp <= 0) return;
    if (Math.random() * 100 < d.dodge) {
      pushFx(s.fxQueue, { type: 'dodge', text: 'Уворот', color: '#4ade80' });
      return;
    }
    let dmg = mitigate(Math.floor(m.dmg * (0.85 + Math.random() * 0.3)), d.armor);
    if (s.shield > 0) {
      const absorbed = Math.min(s.shield, dmg);
      dmg -= absorbed;
      set({ shield: s.shield - absorbed });
    }
    pushFx(s.fxQueue, { type: 'monsterHit', value: dmg, color: '#f87171' });
    const hp = s.hp - dmg;
    if (hp <= 0) {
      // death
      const lost = Math.floor(s.gold * 0.03);
      pushLog(s.log, `💀 Вы погибли! Потеряно ${lost} золота. Воскрешение...`, '#f87171');
      pushFx(s.fxQueue, { type: 'death', value: -1 });
      const fresh = spawnFor(s.zoneId, s.stage, s.mastery[s.zoneId] ?? 0, s.dungeon);
      set({ hp: Math.floor(d.maxHp * 0.6), mana: Math.floor(d.maxMana * 0.5), gold: s.gold - lost, monster: fresh, stageKills: 0, shield: 0 });
    } else {
      set({ hp });
    }
  }

  function doCast(id: string, manual: boolean) {
    const s = get();
    const d = s.derived;
    const skill = SKILLS.find(k => k.id === id)!;
    const rank = s.skillRanks[id] ?? 0;
    if (rank <= 0 || s.level < skill.unlockLevel) return;
    if ((s.skillCds[id] ?? 0) > 0) return;
    const cost = Math.floor(skill.manaCost * (1 - Math.min(0.5, (s.talents['m_mana'] ?? 0) * 0.04)));
    if (s.mana < cost) { if (manual) pushLog(s.log, '🔷 Не хватает маны!', '#60a5fa'); return; }

    const m = s.monster;
    const power = skill.basePower * (1 + (rank - 1) * 0.25);
    const fxEvents = s.fxQueue;
    let mana = s.mana - cost;
    let hp = s.hp;
    let shield = s.shield;

    if (skill.kind === 'damage' || skill.kind === 'dot') {
      const scaleStat = skill.scaling === 'str' ? d.dmgMax : d.skillPower;
      let dmg = Math.floor(scaleStat * power / 100 * (0.9 + Math.random() * 0.2));
      if (skill.id === 'blood_ritual') hp = Math.max(1, hp - Math.floor(d.maxHp * 0.05));
      if (m.def.isBoss) dmg = Math.floor(dmg * (1 + d.bossDmg / 100));
      pushFx(fxEvents, { type: 'skill', skillFx: skill.fx, value: dmg, color: skill.color, text: skill.icon });
      if (skill.kind === 'dot') {
        const dotDmg = Math.floor(dmg * (1 + (s.talents['m_dot'] ?? 0) * 0.10) / 3);
        m.dots.push({ dmg: dotDmg, ticks: 3 });
      } else {
        m.hp -= dmg;
      }
      if (skill.id === 'frost_nova') set({ frostSlow: 4 });
    } else if (skill.kind === 'heal') {
      const amount = Math.floor(d.maxHp * power / 100 * (1 + (s.talents['m_heal'] ?? 0) * 0.12));
      hp = Math.min(d.maxHp, hp + amount);
      pushFx(fxEvents, { type: 'heal', value: amount, color: skill.color, skillFx: 'heal' });
    } else if (skill.kind === 'buff') {
      shield = Math.floor(d.maxHp * power / 100);
      pushFx(fxEvents, { type: 'heal', value: 0, color: skill.color, skillFx: 'shield', text: '🛡️' });
    }

    const cd = skill.cooldown * (1 - d.cdReduction / 100);
    set({ mana, hp, shield, skillCds: { ...s.skillCds, [id]: cd }, monster: { ...m } });
    if (m.hp <= 0) onKill({ ...m, hp: 0 });
  }

  return {
    level: 1, xp: 0, gold: 0, totalGoldEarned: 0,
    stats: baseStats(), statPoints: 0, skillPoints: 0, talentPoints: 0,
    hp: initialDerived.maxHp, mana: initialDerived.maxMana, shield: 0,
    equipment: {}, inventory: [], selectedSlotFilter: 'all',
    skillRanks: {}, skillCds: {}, autoCast: {}, talents: {},
    zoneId: 'hills', stage: 1, stageKills: 0, mastery: {},
    unlockedZones: ['hills'], unlockedSecrets: [],
    dungeon: null,
    monster: initialMonster, playerAtk: 0, frostSlow: 0,
    quests: makeQuestState(),
    kills: 0, bossKills: 0, dungeonsCleared: 0,
    fxQueue: [], log: [{ id: 0, text: '🗡️ Добро пожаловать в Хроники Бездны!', color: '#facc15', time: Date.now() }],
    lastSave: 0,
    derived: initialDerived,

    tick: (dt) => {
      const s = get();
      const d = s.derived;
      // regen
      let hp = Math.min(d.maxHp, s.hp + d.regen * dt * d.maxHp * 0.01 + d.regen * dt);
      let mana = Math.min(d.maxMana, s.mana + d.manaRegen * dt);
      // cooldowns
      const cds: Record<string, number> = {};
      let cdChanged = false;
      Object.entries(s.skillCds).forEach(([k, v]) => {
        if (v > 0) { cds[k] = Math.max(0, v - dt); cdChanged = true; }
      });
      const frostSlow = Math.max(0, s.frostSlow - dt);

      // dots
      const m = { ...s.monster, dots: [...s.monster.dots] };
      m.dotTimer += dt;
      if (m.dotTimer >= 1) {
        m.dotTimer -= 1;
        let dotTotal = 0;
        m.dots = m.dots.map(dot => { dotTotal += dot.dmg; return { ...dot, ticks: dot.ticks - 1 }; }).filter(dot => dot.ticks > 0);
        if (dotTotal > 0) {
          m.hp -= dotTotal;
          pushFx(s.fxQueue, { type: 'playerHit', value: dotTotal, color: '#84cc16' });
        }
      }

      // player attack
      let playerAtk = s.playerAtk + dt * d.attackSpeed;
      if (playerAtk >= 1) {
        playerAtk -= 1;
        set({ hp, mana, frostSlow, ...(cdChanged ? { skillCds: cds } : {}), monster: m, playerAtk });
        playerAttack();
      } else {
        // monster attack timer
        m.attackTimer += dt * (frostSlow > 0 ? 0.5 : 1);
        if (m.attackTimer >= 2.3 && m.hp > 0) {
          m.attackTimer = 0;
          set({ hp, mana, frostSlow, ...(cdChanged ? { skillCds: cds } : {}), monster: m, playerAtk });
          monsterAttack();
        } else {
          set({ hp, mana, frostSlow, ...(cdChanged ? { skillCds: cds } : {}), monster: m, playerAtk });
        }
      }

      // dot kill check
      const s2 = get();
      if (s2.monster.hp <= 0 && s2.monster.maxHp > 0) onKill(s2.monster);

      // autocast
      const s3 = get();
      Object.entries(s3.autoCast).forEach(([id, on]) => {
        if (on && (s3.skillRanks[id] ?? 0) > 0 && (s3.skillCds[id] ?? 0) <= 0) {
          const skill = SKILLS.find(k => k.id === id)!;
          if (skill.kind === 'heal' && s3.hp > s3.derived.maxHp * 0.55) return;
          doCast(id, false);
        }
      });

      // autosave every 6s
      if (Date.now() - get().lastSave > 6000) get().save();
    },

    allocateStat: (st) => {
      const s = get();
      if (s.statPoints <= 0) return;
      const stats = { ...s.stats, [st]: s.stats[st] + 1 };
      set({ stats, statPoints: s.statPoints - 1, derived: computeDerived(s.level, stats, s.equipment, s.talents) });
    },
    allocateStat10: (st) => {
      const s = get();
      const n = Math.min(10, s.statPoints);
      if (n <= 0) return;
      const stats = { ...s.stats, [st]: s.stats[st] + n };
      set({ stats, statPoints: s.statPoints - n, derived: computeDerived(s.level, stats, s.equipment, s.talents) });
    },

    equip: (itemId) => {
      const s = get();
      const item = s.inventory.find(i => i.id === itemId);
      if (!item) return;
      // find best slot for kind
      const slotOf = (kind: string): SlotId[] =>
        (['weapon','helmet','armor','gloves','kneepads','shoulders','boots','pants','amulet','cloak','banner'] as SlotId[])
          .includes(kind as SlotId) ? [kind as SlotId]
          : kind === 'ring' ? ['ring1', 'ring2'] : ['earring1', 'earring2'];
      const slots = slotOf(item.slot);
      let target = slots.find(sl => !s.equipment[sl]);
      if (!target) {
        // replace lowest score
        target = slots.reduce((a, b) => ((s.equipment[a]?.score ?? 0) <= (s.equipment[b]?.score ?? 0) ? a : b));
      }
      const equipment = { ...s.equipment };
      const old = equipment[target];
      equipment[target] = item;
      let inventory = s.inventory.filter(i => i.id !== itemId);
      if (old) inventory = [...inventory, old];
      set({ equipment, inventory, derived: computeDerived(s.level, s.stats, equipment, s.talents) });
      pushLog(s.log, `⚔️ Экипировано: ${item.name}`, rarityById(item.rarity).color);
    },

    unequip: (slot) => {
      const s = get();
      const item = s.equipment[slot];
      if (!item) return;
      const equipment = { ...s.equipment };
      delete equipment[slot];
      set({ equipment, inventory: [...s.inventory, item].slice(-72), derived: computeDerived(s.level, s.stats, equipment, s.talents) });
    },

    sellItem: (itemId) => {
      const s = get();
      const item = s.inventory.find(i => i.id === itemId);
      if (!item) return;
      set({ inventory: s.inventory.filter(i => i.id !== itemId), gold: s.gold + item.sellPrice, totalGoldEarned: s.totalGoldEarned + item.sellPrice });
      addQuestProgress('gold', '', get().totalGoldEarned);
    },

    sellJunk: (maxRarity) => {
      const s = get();
      // sell all items with rarity below maxRarity
      const toSell = s.inventory.filter(i => !rarityAtLeast(i.rarity, maxRarity as never));
      const toKeep = s.inventory.filter(i => rarityAtLeast(i.rarity, maxRarity as never));
      const gain = toSell.reduce((sum, i) => sum + i.sellPrice, 0);
      set({ inventory: toKeep, gold: s.gold + gain, totalGoldEarned: s.totalGoldEarned + gain });
      pushLog(s.log, `💰 Продано ${toSell.length} предметов за ${gain} золота`, '#fbbf24');
      addQuestProgress('gold', '', get().totalGoldEarned);
    },

    castSkill: (id) => doCast(id, true),

    upgradeSkill: (id) => {
      const s = get();
      const skill = SKILLS.find(k => k.id === id)!;
      const rank = s.skillRanks[id] ?? 0;
      if (s.level < skill.unlockLevel || s.skillPoints <= 0 || rank >= skill.maxRank) return;
      set({ skillRanks: { ...s.skillRanks, [id]: rank + 1 }, skillPoints: s.skillPoints - 1 });
      pushLog(s.log, `✨ Скилл «${skill.name}» улучшен до ранга ${rank + 1}`, skill.color);
    },

    toggleAutoCast: (id) => {
      const s = get();
      set({ autoCast: { ...s.autoCast, [id]: !s.autoCast[id] } });
    },

    learnTalent: (id) => {
      const s = get();
      const t = TALENTS.find(x => x.id === id)!;
      const rank = s.talents[id] ?? 0;
      if (s.talentPoints <= 0 || rank >= t.maxRank) return;
      const branchPoints = TALENTS.filter(x => x.branch === t.branch).reduce((sum, x) => sum + (s.talents[x.id] ?? 0), 0);
      if (t.row > 0 && branchPoints < t.row * 3) return;
      const talents = { ...s.talents, [id]: rank + 1 };
      set({ talents, talentPoints: s.talentPoints - 1, derived: computeDerived(s.level, s.stats, s.equipment, talents) });
      pushLog(s.log, `🌟 Талант «${t.name}» — ранг ${rank + 1}`, '#facc15');
    },

    claimQuest: (id) => {
      const s = get();
      const st = s.quests[id];
      const def = QUESTS.find(q => q.id === id)!;
      if (!st?.done || st.claimed) return;
      const mult = 1 + (s.talents['t_quest'] ?? 0) * 0.10;
      const gold = Math.floor(def.reward.gold * mult);
      const quests = { ...s.quests, [id]: { ...st, claimed: true } };
      pushLog(s.log, `✅ Награда за «${def.name}»: +${gold} золота${def.reward.xp ? `, +${Math.floor(def.reward.xp * mult)} опыта` : ''}`, '#4ade80');
      pushFx(s.fxQueue, { type: 'quest', text: '✅ Награда!', color: '#4ade80' });
      set({
        quests,
        gold: s.gold + gold,
        totalGoldEarned: s.totalGoldEarned + gold,
        statPoints: s.statPoints + (def.reward.statPoints ?? 0),
        talentPoints: s.talentPoints + (def.reward.talentPoints ?? 0),
        skillPoints: s.skillPoints + (def.reward.skillPoints ?? 0),
      });
      if (def.reward.itemRarity) {
        const it = generateItem(s.level, s.stats.luk, 10, def.reward.itemRarity);
        set({ inventory: [...get().inventory, it].slice(-72) });
        pushLog(get().log, `🎁 Награда: ${it.name}`, rarityById(it.rarity).color);
        addQuestProgress('loot', it.rarity, 1);
      }
      if (def.reward.xp) grantXp(Math.floor(def.reward.xp * mult));
      // secret unlocks
      const s2 = get();
      const secrets = [...s2.unlockedSecrets];
      const unlockSecret = (sid: string, msg: string, color: string) => {
        if (!secrets.includes(sid)) { secrets.push(sid); pushLog(s2.log, msg, color); pushFx(s2.fxQueue, { type: 'levelup', text: msg, color }); }
      };
      if (id === 'q_any1') unlockSecret('shroom', '🍄 Открыта скрытая территория: Грибная роща!', '#d946ef');
      if (id === 'q_boss3') unlockSecret('sunken', '🌊 Открыта скрытая территория: Затонувший храм!', '#38bdf8');
      if (id === 'q_lvl3') unlockSecret('graveyard', '🪦 Открыта скрытая территория: Кладбище героев!', '#94a3b8');
      if (id === 'q_dun2') unlockSecret('mechgarden', '⚙️ Открыта скрытая территория: Механический сад!', '#facc15');
      set({ unlockedSecrets: secrets });
      addQuestProgress('secret', '', secrets.length);
    },

    travelTo: (zoneId) => {
      const s = get();
      const zone = zoneById(zoneId);
      const isSecret = zone.hidden;
      if (isSecret && !s.unlockedSecrets.includes(zoneId)) return;
      if (!isSecret && !s.unlockedZones.includes(zoneId)) return;
      if (s.level < zone.minLevel) return;
      set({ zoneId, stage: 1, stageKills: 0, dungeon: null, monster: spawnFor(zoneId, 1, s.mastery[zoneId] ?? 0, null) });
      pushLog(s.log, `🗺️ Переход: ${zone.name}`, '#93c5fd');
    },

    startDungeon: (id) => {
      const s = get();
      const d = DUNGEONS.find(x => x.id === id)!;
      if (s.level < d.minLevel) return;
      const run: DungeonRun = { dungeonId: id, wave: 1, active: true };
      set({ dungeon: run, monster: spawnFor(s.zoneId, 1, 0, run) });
      pushLog(s.log, `🏰 Вход в подземелье: ${d.name} (волн: ${d.waves})`, '#c084fc');
    },

    leaveDungeon: () => {
      const s = get();
      set({ dungeon: null, monster: spawnFor(s.zoneId, s.stage, s.mastery[s.zoneId] ?? 0, null) });
      pushLog(s.log, '🚪 Вы покинули подземелье', '#94a3b8');
    },

    clearFx: () => set({ fxQueue: [] }),

    save: () => {
      const s = get();
      const data = {
        level: s.level, xp: s.xp, gold: s.gold, totalGoldEarned: s.totalGoldEarned,
        stats: s.stats, statPoints: s.statPoints, skillPoints: s.skillPoints, talentPoints: s.talentPoints,
        equipment: s.equipment, inventory: s.inventory,
        skillRanks: s.skillRanks, autoCast: s.autoCast, talents: s.talents,
        zoneId: s.zoneId, stage: s.stage, stageKills: s.stageKills, mastery: s.mastery,
        unlockedZones: s.unlockedZones, unlockedSecrets: s.unlockedSecrets,
        quests: s.quests, kills: s.kills, bossKills: s.bossKills, dungeonsCleared: s.dungeonsCleared,
        savedAt: Date.now(),
      };
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
      set({ lastSave: Date.now() });
    },

    hardReset: () => {
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
    const s = useGame.getState();
    const quests = { ...s.quests };
    Object.entries(d.quests ?? {}).forEach(([k, v]) => { if (quests[k]) quests[k] = v as never; });
    useGame.setState({
      level: d.level ?? 1, xp: d.xp ?? 0, gold: d.gold ?? 0, totalGoldEarned: d.totalGoldEarned ?? 0,
      stats: { ...s.stats, ...(d.stats ?? {}) }, statPoints: d.statPoints ?? 0,
      skillPoints: d.skillPoints ?? 0, talentPoints: d.talentPoints ?? 0,
      equipment: d.equipment ?? {}, inventory: d.inventory ?? [],
      skillRanks: d.skillRanks ?? {}, autoCast: d.autoCast ?? {}, talents: d.talents ?? {},
      zoneId: d.zoneId ?? 'hills', stage: d.stage ?? 1, stageKills: d.stageKills ?? 0,
      mastery: d.mastery ?? {}, unlockedZones: d.unlockedZones ?? ['hills'],
      unlockedSecrets: d.unlockedSecrets ?? [],
      quests, kills: d.kills ?? 0, bossKills: d.bossKills ?? 0, dungeonsCleared: d.dungeonsCleared ?? 0,
    });
    // offline progress (cap 8h)
    const away = Math.min(8 * 3600 * 1000, Date.now() - (d.savedAt ?? Date.now()));
    if (away > 60000) {
      const st = useGame.getState();
      const minutes = away / 60000;
      const zone = zoneById(st.zoneId);
      const lvl = zone.minLevel + st.stage;
      const kpm = 8; // assumed kills per minute
      const kills = Math.floor(minutes * kpm * 0.5);
      const gold = Math.floor(kills * monsterReward(lvl, 1, 1).gold * 0.5);
      const xp = Math.floor(kills * monsterReward(lvl, 1, 1).xp * 0.4);
      useGame.setState({ gold: st.gold + gold, totalGoldEarned: st.totalGoldEarned + gold });
      st.log.push({ id: 9999 + Date.now(), text: `🌙 Офлайн-прогресс (${Math.floor(minutes)} мин): +${gold} золота, +${xp} опыта`, color: '#93c5fd', time: Date.now() });
      useGame.setState({ log: [...st.log] });
    }
    // recompute derived and respawn
    const st2 = useGame.getState();
    const derived = computeDerived(st2.level, st2.stats, st2.equipment, st2.talents);
    useGame.setState({
      derived,
      hp: derived.maxHp, mana: derived.maxMana,
      monster: spawnFor(st2.zoneId, st2.stage, st2.mastery[st2.zoneId] ?? 0, null),
    });
  } catch { /* corrupted save → ignore */ }
}
