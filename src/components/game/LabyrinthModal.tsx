import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '@/game/store';
import { fmt, computeDerived } from '@/game/engine';
import { generateItem, rarityById } from '@/game/items';
import { FAMILIES } from '@/game/monsters';
import { getClassById } from '@/game/classes';
import { sound } from '@/game/sound';
import type { Item, RarityId } from '@/game/types';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export type LabyrinthDifficulty = 'normal' | 'heroic' | 'mythic';

export type CellType =
  | 'wall'
  | 'floor'
  | 'start'
  | 'exit'
  | 'enemy'
  | 'boss'
  | 'chest'
  | 'lever'
  | 'gate'
  | 'shrine'
  | 'secret';

export interface LabyrinthCell {
  x: number;
  y: number;
  type: CellType;
  visited: boolean;
  visible: boolean;
  cleared: boolean;
  gateLocked?: boolean;
  leverActivated?: boolean;
  secretRevealed?: boolean;
  monsterName?: string;
  monsterHp?: number;
  monsterMaxHp?: number;
  monsterIcon?: string;
  monsterArtSrc?: string;
  monsterColor?: string;
  chestTier?: RarityId;
  shrineBuff?: { name: string; icon: string; desc: string };
}

interface LabyrinthState {
  size: number;
  grid: LabyrinthCell[][];
  playerX: number;
  playerY: number;
  leverCount: number;
  leversPulled: number;
  keysFound: number;
  enemiesKilled: number;
  chestsOpened: number;
  cleared: boolean;
}

// Procedural Maze Generator using Recursive Backtracking
function generateProceduralLabyrinth(size: number, diff: LabyrinthDifficulty): LabyrinthState {
  const actualSize = size % 2 === 0 ? size + 1 : size;
  const grid: LabyrinthCell[][] = [];

  for (let y = 0; y < actualSize; y++) {
    grid[y] = [];
    for (let x = 0; x < actualSize; x++) {
      grid[y][x] = {
        x,
        y,
        type: 'wall',
        visited: false,
        visible: false,
        cleared: false,
      };
    }
  }

  const stack: [number, number][] = [];
  const startX = 1;
  const startY = 1;
  grid[startY][startX].type = 'floor';
  stack.push([startX, startY]);

  const directions = [
    [0, -2],
    [2, 0],
    [0, 2],
    [-2, 0],
  ];

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];
    const neighbors: [number, number, number, number][] = [];

    for (const [dx, dy] of directions) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx > 0 && nx < actualSize - 1 && ny > 0 && ny < actualSize - 1) {
        if (grid[ny][nx].type === 'wall') {
          neighbors.push([nx, ny, cx + dx / 2, cy + dy / 2]);
        }
      }
    }

    if (neighbors.length > 0) {
      const [nx, ny, wallX, wallY] = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[wallY][wallX].type = 'floor';
      grid[ny][nx].type = 'floor';
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }

  // Add occasional loops for multiple paths
  const loopsCount = Math.floor(actualSize * 0.7);
  for (let i = 0; i < loopsCount; i++) {
    const rx = 1 + Math.floor(Math.random() * (actualSize - 2));
    const ry = 1 + Math.floor(Math.random() * (actualSize - 2));
    if (grid[ry][rx].type === 'wall') {
      const adjacentFloors = [
        grid[ry - 1]?.[rx]?.type === 'floor',
        grid[ry + 1]?.[rx]?.type === 'floor',
        grid[ry]?.[rx - 1]?.type === 'floor',
        grid[ry]?.[rx + 1]?.type === 'floor',
      ].filter(Boolean).length;
      if (adjacentFloors >= 2) {
        grid[ry][rx].type = 'floor';
      }
    }
  }

  const floorCells: LabyrinthCell[] = [];
  const deadEnds: LabyrinthCell[] = [];

  for (let y = 1; y < actualSize - 1; y++) {
    for (let x = 1; x < actualSize - 1; x++) {
      if (grid[y][x].type === 'floor' && !(x === startX && y === startY)) {
        floorCells.push(grid[y][x]);
        const wallsAround = [
          grid[y - 1][x].type === 'wall',
          grid[y + 1][x].type === 'wall',
          grid[y][x - 1].type === 'wall',
          grid[y][x + 1].type === 'wall',
        ].filter(Boolean).length;
        if (wallsAround >= 3) {
          deadEnds.push(grid[y][x]);
        }
      }
    }
  }

  // Set Start
  grid[startY][startX].type = 'start';
  grid[startY][startX].visited = true;
  grid[startY][startX].visible = true;
  grid[startY][startX].cleared = true;

  // Set Exit Boss at the furthest cell
  let exitCell = deadEnds.length > 0 ? deadEnds.pop()! : floorCells[floorCells.length - 1];
  let maxDist = 0;
  floorCells.forEach(c => {
    const d = Math.abs(c.x - startX) + Math.abs(c.y - startY);
    if (d > maxDist) {
      maxDist = d;
      exitCell = c;
    }
  });

  grid[exitCell.y][exitCell.x].type = 'boss';
  grid[exitCell.y][exitCell.x].monsterName = 'Минотавр Бездны (Владыка Лабиринта)';
  grid[exitCell.y][exitCell.x].monsterIcon = '🐂';
  grid[exitCell.y][exitCell.x].monsterColor = '#ef4444';
  grid[exitCell.y][exitCell.x].monsterHp = Math.round(4500 * (diff === 'mythic' ? 3.5 : diff === 'heroic' ? 2.2 : 1.2));
  grid[exitCell.y][exitCell.x].monsterMaxHp = grid[exitCell.y][exitCell.x].monsterHp;

  // Gate before exit
  const adjToBoss = [
    grid[exitCell.y - 1]?.[exitCell.x],
    grid[exitCell.y + 1]?.[exitCell.x],
    grid[exitCell.y]?.[exitCell.x - 1],
    grid[exitCell.y]?.[exitCell.x + 1],
  ].filter(c => c && c.type === 'floor');

  if (adjToBoss.length > 0) {
    const gateCell = adjToBoss[0];
    gateCell.type = 'gate';
    gateCell.gateLocked = true;
  }

  // Levers
  const leverCount = diff === 'mythic' ? 3 : diff === 'heroic' ? 2 : 1;
  for (let i = 0; i < leverCount; i++) {
    const cell = deadEnds.length > 0 ? deadEnds.pop()! : floorCells.splice(Math.floor(Math.random() * floorCells.length), 1)[0];
    if (cell && cell.type === 'floor') {
      cell.type = 'lever';
      cell.leverActivated = false;
    }
  }

  // Treasure Chests
  const chestTiers: RarityId[] = ['rare', 'epic', 'legendary'];
  const chestCount = Math.min(deadEnds.length, 4) + 1;
  for (let i = 0; i < chestCount; i++) {
    const cell = deadEnds.length > 0 ? deadEnds.pop()! : floorCells.splice(Math.floor(Math.random() * floorCells.length), 1)[0];
    if (cell && cell.type === 'floor') {
      cell.type = 'chest';
      cell.chestTier = chestTiers[Math.floor(Math.random() * chestTiers.length)];
    }
  }

  // Shrines
  const shrines = [
    { name: 'Алтарь Исцеления', icon: '💖', desc: 'Восстанавливает 100% Здоровья и Маны' },
    { name: 'Алтарь Ярости', icon: '⚡', desc: '+50% к урону в лабиринте' },
    { name: 'Алтарь Прозрения', icon: '🔮', desc: 'Полностью раскрывает всю карту катакомб' },
  ];
  for (let i = 0; i < Math.min(2, floorCells.length); i++) {
    const cell = floorCells.splice(Math.floor(Math.random() * floorCells.length), 1)[0];
    if (cell && cell.type === 'floor') {
      cell.type = 'shrine';
      cell.shrineBuff = shrines[i % shrines.length];
    }
  }

  // Secret Illusionary Wall
  for (let y = 1; y < actualSize - 1; y++) {
    for (let x = 1; x < actualSize - 1; x++) {
      if (grid[y][x].type === 'wall') {
        const floorNeighbors = [
          grid[y - 1]?.[x]?.type !== 'wall',
          grid[y + 1]?.[x]?.type !== 'wall',
          grid[y]?.[x - 1]?.type !== 'wall',
          grid[y]?.[x + 1]?.type !== 'wall',
        ].filter(Boolean).length;
        if (floorNeighbors === 2) {
          grid[y][x].type = 'secret';
          grid[y][x].secretRevealed = false;
          break;
        }
      }
    }
  }

  // Populate Enemies
  const enemyCount = Math.floor(floorCells.length * 0.45);
  for (let i = 0; i < enemyCount; i++) {
    const cell = floorCells.splice(Math.floor(Math.random() * floorCells.length), 1)[0];
    if (cell && cell.type === 'floor') {
      const fam = FAMILIES[Math.floor(Math.random() * FAMILIES.length)];
      cell.type = 'enemy';
      cell.monsterName = fam.name;
      cell.monsterIcon = fam.icons[0] || '👹';
      cell.monsterColor = fam.color;
      cell.monsterHp = Math.round(900 * (diff === 'mythic' ? 2.5 : diff === 'heroic' ? 1.7 : 1.1));
      cell.monsterMaxHp = cell.monsterHp;
    }
  }

  return {
    size: actualSize,
    grid,
    playerX: startX,
    playerY: startY,
    leverCount,
    leversPulled: 0,
    keysFound: 0,
    enemiesKilled: 0,
    chestsOpened: 0,
    cleared: false,
  };
}

function updateFogOfWar(grid: LabyrinthCell[][], px: number, py: number, viewRadius = 2) {
  const size = grid.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= viewRadius) {
        grid[y][x].visible = true;
        grid[y][x].visited = true;
      } else {
        grid[y][x].visible = false;
      }
    }
  }
}

export default function LabyrinthModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const [sizeSetting, setSizeSetting] = useState<9 | 11 | 13>(11);
  const [difficulty, setDifficulty] = useState<LabyrinthDifficulty>('normal');
  const [maze, setMaze] = useState<LabyrinthState>(() => {
    const m = generateProceduralLabyrinth(11, 'normal');
    updateFogOfWar(m.grid, m.playerX, m.playerY, 2);
    return m;
  });

  // Active Combat State (Prominent Modal)
  const [combatModal, setCombatModal] = useState<{
    targetX: number;
    targetY: number;
    monsterName: string;
    monsterIcon: string;
    monsterArtSrc?: string;
    monsterHp: number;
    monsterMaxHp: number;
    playerHp: number;
    playerMaxHp: number;
    playerArtSrc?: string;
    isBoss: boolean;
  } | null>(null);

  // Chest Loot Modal Popup
  const [lootModal, setLootModal] = useState<{
    item: Item;
    gold: number;
    rarity: RarityId;
  } | null>(null);

  const [logText, setLogText] = useState<string>('🧭 Вы вошли в Древний Катакомбный Лабиринт. Исследуйте коридоры, активируйте рычаги и найдите Владыку!');
  const [victoryModal, setVictoryModal] = useState(false);
  const [activeBuff, setActiveBuff] = useState<string | null>(null);

  const combatIntervalRef = useRef<number | null>(null);

  const level = useGame(s => s.level);
  const derived = useGame(s => s.derived) || computeDerived(level, useGame.getState().stats, useGame.getState().equipment, useGame.getState().talents);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const startNewLabyrinth = useCallback((sz: 9 | 11 | 13, diff: LabyrinthDifficulty) => {
    sound.playSpell();
    if (combatIntervalRef.current) clearInterval(combatIntervalRef.current);
    const newM = generateProceduralLabyrinth(sz, diff);
    updateFogOfWar(newM.grid, newM.playerX, newM.playerY, 2);
    setMaze(newM);
    setCombatModal(null);
    setLootModal(null);
    setVictoryModal(false);
    setActiveBuff(null);
    setLogText(`🏰 Сгенерирован новый лабиринт (${sz}x${sz}, сложность: ${diff.toUpperCase()}). Удачи!`);
  }, []);

  // Cell Interaction Triggers
  const triggerCellEvent = (cell: LabyrinthCell, x: number, y: number) => {
    // 1. Lever Trigger
    if (cell.type === 'lever' && !cell.leverActivated) {
      sound.playEquip();
      setMaze(prev => {
        const nextGrid = prev.grid.map(row => row.map(c => ({ ...c })));
        nextGrid[y][x].leverActivated = true;
        const newPulled = prev.leversPulled + 1;
        return { ...prev, grid: nextGrid, leversPulled: newPulled };
      });
      setLogText(`⚙️ Вы потянули древний рычаг! Механизм открывает замки (${maze.leversPulled + 1}/${maze.leverCount}).`);
      return;
    }

    // 2. Chest Trigger (Loot Popup)
    if (cell.type === 'chest' && !cell.cleared) {
      sound.playLoot();
      const goldReward = level * 700 + Math.floor(Math.random() * 900);
      const r = rarityById(cell.chestTier || 'rare');
      const item = generateItem(level, cell.chestTier || 'rare');

      useGame.setState(s => ({
        gold: s.gold + goldReward,
        inventory: [...s.inventory, item],
        log: [...s.log, { id: Date.now(), text: `🎁 ЛАБИРИНТ: Открыт ${r.name} сундук! +${fmt(goldReward)} золота, получен ${item.name}!`, color: r.color, time: Date.now() }]
      }));

      setMaze(prev => {
        const nextGrid = prev.grid.map(row => row.map(c => ({ ...c })));
        nextGrid[y][x].cleared = true;
        return { ...prev, grid: nextGrid, chestsOpened: prev.chestsOpened + 1 };
      });

      setLootModal({ item, gold: goldReward, rarity: cell.chestTier || 'rare' });
      setLogText(`🎁 Вы открыли ${r.name} сундук! Получено +${fmt(goldReward)} золота и ${item.name}!`);
      return;
    }

    // 3. Shrine Trigger
    if (cell.type === 'shrine' && !cell.cleared && cell.shrineBuff) {
      sound.playHoly();
      if (cell.shrineBuff.icon === '💖') {
        useGame.setState(s => ({ hp: s.derived.maxHp, mana: s.derived.maxMana }));
      } else if (cell.shrineBuff.icon === '🔮') {
        setMaze(prev => {
          const revealed = prev.grid.map(row => row.map(c => ({ ...c, visited: true, visible: true })));
          return { ...prev, grid: revealed };
        });
      } else {
        setActiveBuff(cell.shrineBuff.name);
      }

      setMaze(prev => {
        const nextGrid = prev.grid.map(row => row.map(c => ({ ...c })));
        nextGrid[y][x].cleared = true;
        return { ...prev, grid: nextGrid };
      });

      setLogText(`✨ СВЯТИЛИЩЕ: ${cell.shrineBuff.name}! ${cell.shrineBuff.desc}`);
      return;
    }

    // 4. Enemy / Boss Battle Trigger
    if ((cell.type === 'enemy' || cell.type === 'boss') && !cell.cleared) {
      const classId = useGame.getState().classId;
      const heroClass = classId ? getClassById(classId) : null;
      const heroMaxHp = derived.maxHp || 1000;
      const mHp = cell.monsterHp || 600;

      setCombatModal({
        targetX: x,
        targetY: y,
        monsterName: cell.monsterName || 'Страж Лабиринта',
        monsterIcon: cell.monsterIcon || '👹',
        monsterArtSrc: cell.monsterArtSrc || (cell.type === 'boss' ? '/monsters/minotaur.jpg' : '/monsters/orc.jpg'),
        monsterHp: mHp,
        monsterMaxHp: mHp,
        playerHp: heroMaxHp,
        playerMaxHp: heroMaxHp,
        playerArtSrc: heroClass?.artSrc || '/heroes/hero_paladin.jpg',
        isBoss: cell.type === 'boss',
      });

      startTacticalFight(x, y, cell);
    }
  };

  // Move Player Function with Functional Updates & Zero Glitches
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (combatModal || lootModal) return;

    setMaze(prev => {
      const nx = prev.playerX + dx;
      const ny = prev.playerY + dy;

      if (nx < 0 || nx >= prev.size || ny < 0 || ny >= prev.size) return prev;

      const target = prev.grid[ny][nx];

      // Wall collision
      if (target.type === 'wall') {
        sound.playBlock();
        setLogText('🧱 Монолитная каменная стена. Прохода нет.');
        return prev;
      }

      // Secret Wall collision
      if (target.type === 'secret' && !target.secretRevealed) {
        sound.playHit();
        sound.playLevelUp();
        const nextGrid = prev.grid.map(row => row.map(c => ({ ...c })));
        nextGrid[ny][nx].secretRevealed = true;
        nextGrid[ny][nx].type = 'floor';
        setLogText('✨ ВЫ ОБНАРУЖИЛИ ИЛЛЮЗОРНУЮ СТЕНУ! Скрытый проход открыт!');
        return { ...prev, grid: nextGrid };
      }

      // Locked Gate collision
      if (target.type === 'gate' && target.gateLocked) {
        if (prev.leversPulled >= prev.leverCount) {
          sound.playHoly();
          const nextGrid = prev.grid.map(row => row.map(c => ({ ...c })));
          nextGrid[ny][nx].gateLocked = false;
          setLogText('🔓 Все рычаги активированы! Врата к Владыке Лабиринта распахнуты!');
          return { ...prev, grid: nextGrid };
        } else {
          sound.playBlock();
          setLogText(`🔒 Врата заперты тяжелой магической решеткой! Нужно активировать все рычаги (${prev.leversPulled}/${prev.leverCount}).`);
          return prev;
        }
      }

      // Step success!
      sound.playFootstep();
      const nextGrid = prev.grid.map(row => row.map(c => ({ ...c })));
      nextGrid[ny][nx].visited = true;
      updateFogOfWar(nextGrid, nx, ny, 2);

      setTimeout(() => {
        triggerCellEvent(nextGrid[ny][nx], nx, ny);
      }, 0);

      return {
        ...prev,
        grid: nextGrid,
        playerX: nx,
        playerY: ny,
      };
    });
  }, [combatModal, lootModal]);

  // Keyboard navigation listener (Preventing background scroll!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (combatModal || lootModal) return;
        onClose();
        return;
      }

      const moveKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's', 'a', 'd', 'W', 'S', 'A', 'D', 'KeyW', 'KeyS', 'KeyA', 'KeyD'];
      if (moveKeys.includes(e.key) || moveKeys.includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (combatModal || lootModal) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') movePlayer(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') movePlayer(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') movePlayer(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') movePlayer(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [combatModal, lootModal, movePlayer, onClose]);

  // Real-time Tactical Combat Loop
  const startTacticalFight = (x: number, y: number, cell: LabyrinthCell) => {
    sound.playSlash();
    setLogText(`⚔️ НАПАДЕНИЕ! В коридоре вас атакует ${cell.monsterName}!`);

    if (combatIntervalRef.current) clearInterval(combatIntervalRef.current);

    const heroAtk = Math.max(25, Math.round((derived.dmgMin + derived.dmgMax) / 2));
    let curMHp = cell.monsterHp || 700;
    let curPHp = derived.maxHp || 1000;

    combatIntervalRef.current = window.setInterval(() => {
      // 1. Hero Attacks Monster
      const dmg = Math.round(heroAtk * (activeBuff ? 1.5 : 1.0) * (0.85 + Math.random() * 0.3));
      curMHp = Math.max(0, curMHp - dmg);
      sound.playHit();

      // 2. Monster Attacks Hero
      const eDmg = Math.max(16, Math.round((cell.type === 'boss' ? 95 : 45) - derived.armor * 0.2));
      curPHp = Math.max(0, curPHp - eDmg);

      setCombatModal(prev => prev ? {
        ...prev,
        monsterHp: curMHp,
        playerHp: curPHp,
      } : null);

      // Victory!
      if (curMHp <= 0) {
        clearInterval(combatIntervalRef.current!);
        combatIntervalRef.current = null;
        sound.playLevelUp();

        const goldWin = cell.type === 'boss' ? level * 3000 + 6000 : level * 500 + 600;
        const xpWin = cell.type === 'boss' ? level * 2000 + 4000 : level * 250 + 300;

        useGame.setState(s => ({
          gold: s.gold + goldWin,
          xp: s.xp + xpWin,
          kills: s.kills + 1,
          bossKills: s.bossKills + (cell.type === 'boss' ? 1 : 0),
          log: [...s.log, { id: Date.now(), text: `⚔️ ЛАБИРИНТ: Повержен ${cell.monsterName}! +${fmt(goldWin)} золота, +${xpWin} опыта`, color: '#facc15', time: Date.now() }]
        }));

        setMaze(prev => {
          const nextGrid = prev.grid.map(row => row.map(c => ({ ...c })));
          nextGrid[y][x].cleared = true;
          return {
            ...prev,
            grid: nextGrid,
            enemiesKilled: prev.enemiesKilled + 1,
            cleared: cell.type === 'boss' ? true : prev.cleared,
          };
        });

        if (cell.type === 'boss') {
          setVictoryModal(true);
          setLogText(`👑 ТРИУМФ! Владыка Лабиринта повержен! Древние сокровища катакомб ваши!`);
        } else {
          setLogText(`⚔️ Монстр ${cell.monsterName} повержен! +${fmt(goldWin)} золота, +${xpWin} опыта`);
        }

        setTimeout(() => setCombatModal(null), 500);
        return;
      }

      // Defeat!
      if (curPHp <= 0) {
        clearInterval(combatIntervalRef.current!);
        combatIntervalRef.current = null;
        sound.playBlock();
        setLogText(`💀 ПОРАЖЕНИЕ! Вас сломил ${cell.monsterName}. Вы отступили ко входу.`);
        setMaze(prev => ({ ...prev, playerX: 1, playerY: 1 }));
        setCombatModal(null);
      }
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (combatIntervalRef.current) clearInterval(combatIntervalRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans select-none">
      <div className="bg-slate-950 border border-emerald-500/50 rounded-2xl max-w-5xl w-full p-4 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-3 relative max-h-[95vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">🧭</span>
            <div>
              <h2 className="font-black text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span>ДРЕВНИЙ КАТАКОМБНЫЙ ЛАБИРИНТ (LABYRINTH OF TRIALS)</span>
                <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  {maze.size}x{maze.size} · {difficulty.toUpperCase()}
                </span>
              </h2>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-3 flex-wrap">
                <span>Рычаги: <b className="text-amber-300 font-black">{maze.leversPulled}/{maze.leverCount}</b></span>
                <span>·</span>
                <span>Сундуки: <b className="text-purple-300 font-black">{maze.chestsOpened}</b></span>
                <span>·</span>
                <span>Убито врагов: <b className="text-red-300 font-black">{maze.enemiesKilled}</b></span>
                {activeBuff && <span className="text-cyan-300 font-black bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">✨ {activeBuff}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Difficulty Selector */}
            <div className="flex bg-slate-900 rounded-xl p-0.5 border border-slate-800 text-[10px] font-black">
              {(['normal', 'heroic', 'mythic'] as LabyrinthDifficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => {
                    setDifficulty(d);
                    startNewLabyrinth(sizeSetting, d);
                  }}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    difficulty === d ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d === 'normal' ? 'Обычный' : d === 'heroic' ? 'Героический' : 'Мифический'}
                </button>
              ))}
            </div>

            {/* Size Selector */}
            <div className="flex bg-slate-900 rounded-xl p-0.5 border border-slate-800 text-[10px] font-black">
              {([9, 11, 13] as const).map(sz => (
                <button
                  key={sz}
                  onClick={() => {
                    setSizeSetting(sz);
                    startNewLabyrinth(sz, difficulty);
                  }}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    sizeSetting === sz ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sz}x{sz}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-900/60 text-slate-400 hover:text-red-300 font-bold text-sm flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Grid Viewport & Sidebar */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-3 relative">
          
          {/* Labyrinth Grid Canvas / Box (3 Columns) */}
          <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            
            {/* Grid Render */}
            <div
              className="grid gap-1 p-2 bg-slate-950/90 border border-slate-800/80 rounded-2xl shadow-2xl max-w-full max-h-[58vh] aspect-square overflow-auto"
              style={{
                gridTemplateColumns: `repeat(${maze.size}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${maze.size}, minmax(0, 1fr))`,
              }}
            >
              {maze.grid.map((row, y) =>
                row.map((cell, x) => {
                  const isPlayer = maze.playerX === x && maze.playerY === y;
                  const isAdjacent = Math.abs(x - maze.playerX) + Math.abs(y - maze.playerY) === 1;

                  // Render hidden under Fog of War
                  if (!cell.visible && !cell.visited) {
                    return (
                      <div
                        key={`${x}-${y}`}
                        className="w-7 h-7 sm:w-9 sm:h-9 bg-black/95 rounded-md border border-slate-900/40 flex items-center justify-center text-[10px] text-slate-800 select-none"
                      >
                        ?
                      </div>
                    );
                  }

                  // Render Dimly Visited (Out of sight)
                  const isDim = !cell.visible && cell.visited;

                  // Wall cell
                  if (cell.type === 'wall' || (cell.type === 'secret' && !cell.secretRevealed)) {
                    return (
                      <div
                        key={`${x}-${y}`}
                        onClick={() => isAdjacent && movePlayer(x - maze.playerX, y - maze.playerY)}
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-md border transition-all flex items-center justify-center text-xs select-none ${
                          isDim
                            ? 'bg-slate-950 border-slate-900 text-slate-800 opacity-40'
                            : 'bg-slate-800/80 border-slate-700/60 shadow-inner'
                        } ${isAdjacent ? 'cursor-pointer hover:border-amber-400/80 hover:scale-105' : ''}`}
                      >
                        🧱
                      </div>
                    );
                  }

                  // Interactive / Floor cells
                  let icon = '·';
                  let colorClass = 'text-slate-600';
                  let bgClass = isDim ? 'bg-slate-950 opacity-50' : 'bg-slate-900/80';

                  if (isPlayer) {
                    icon = '🧙‍♂️';
                    colorClass = 'text-emerald-400 font-black animate-pulse';
                    bgClass = 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)] ring-2 ring-emerald-400';
                  } else if (cell.type === 'boss') {
                    icon = cell.cleared ? '💀' : '🐂';
                    colorClass = cell.cleared ? 'text-slate-600' : 'text-red-400 animate-bounce';
                    bgClass = cell.cleared ? 'bg-slate-950' : 'bg-red-950/80 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
                  } else if (cell.type === 'gate') {
                    icon = cell.gateLocked ? '🔒' : '🔓';
                    colorClass = cell.gateLocked ? 'text-amber-400' : 'text-emerald-400';
                    bgClass = cell.gateLocked ? 'bg-amber-950/80 border-amber-500/50' : 'bg-slate-900';
                  } else if (cell.type === 'lever') {
                    icon = cell.leverActivated ? '✅' : '⚙️';
                    colorClass = cell.leverActivated ? 'text-emerald-400' : 'text-amber-300 animate-pulse';
                    bgClass = cell.leverActivated ? 'bg-slate-950' : 'bg-amber-950/60 border-amber-500/40';
                  } else if (cell.type === 'chest') {
                    icon = cell.cleared ? '📭' : '🎁';
                    colorClass = cell.cleared ? 'text-slate-600' : 'text-purple-400';
                    bgClass = cell.cleared ? 'bg-slate-950' : 'bg-purple-950/80 border-purple-500/50';
                  } else if (cell.type === 'shrine') {
                    icon = cell.cleared ? '🪨' : cell.shrineBuff?.icon || '✨';
                    colorClass = cell.cleared ? 'text-slate-600' : 'text-cyan-400';
                    bgClass = cell.cleared ? 'bg-slate-950' : 'bg-cyan-950/80 border-cyan-500/50';
                  } else if (cell.type === 'enemy') {
                    icon = cell.cleared ? '💀' : cell.monsterIcon || '👹';
                    colorClass = cell.cleared ? 'text-slate-600' : 'text-rose-400';
                    bgClass = cell.cleared ? 'bg-slate-950' : 'bg-rose-950/60 border-rose-500/40';
                  } else if (cell.type === 'start') {
                    icon = '🟢';
                  }

                  return (
                    <button
                      key={`${x}-${y}`}
                      onClick={() => isAdjacent && movePlayer(x - maze.playerX, y - maze.playerY)}
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-md border flex items-center justify-center text-xs transition-all ${bgClass} ${colorClass} ${
                        isAdjacent ? 'cursor-pointer hover:border-emerald-400 hover:scale-105 ring-1 ring-emerald-500/40' : 'border-slate-800'
                      }`}
                      title={`${cell.type} (${x},${y})`}
                    >
                      {icon}
                    </button>
                  );
                })
              )}
            </div>

            {/* On-screen Virtual D-Pad Controller */}
            <div className="absolute bottom-2 right-2 flex flex-col items-center gap-1 bg-slate-950/90 p-2 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur">
              <button
                onClick={() => movePlayer(0, -1)}
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white font-black text-sm border border-slate-700 transition-all active:scale-90 shadow flex items-center justify-center cursor-pointer"
              >
                ▲
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => movePlayer(-1, 0)}
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white font-black text-sm border border-slate-700 transition-all active:scale-90 shadow flex items-center justify-center cursor-pointer"
                >
                  ◀
                </button>
                <button
                  onClick={() => movePlayer(0, 1)}
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white font-black text-sm border border-slate-700 transition-all active:scale-90 shadow flex items-center justify-center cursor-pointer"
                >
                  ▼
                </button>
                <button
                  onClick={() => movePlayer(1, 0)}
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white font-black text-sm border border-slate-700 transition-all active:scale-90 shadow flex items-center justify-center cursor-pointer"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Inspector (1 Column) */}
          <div className="space-y-3 flex flex-col">
            
            {/* Guide & Controls Box */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300 shadow">
              <div className="font-black text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📖</span>
                <span>Обозначения и Управление</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                <div className="flex items-center gap-1.5"><span>🧙‍♂️</span><span>Герой</span></div>
                <div className="flex items-center gap-1.5"><span>⚙️</span><span>Рычаг</span></div>
                <div className="flex items-center gap-1.5"><span>🔒</span><span>Врата Босса</span></div>
                <div className="flex items-center gap-1.5"><span>🎁</span><span>Сундук</span></div>
                <div className="flex items-center gap-1.5"><span>✨</span><span>Святилище</span></div>
                <div className="flex items-center gap-1.5"><span>🐂</span><span>Владыка</span></div>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                Передвижение: <b className="text-slate-200">WASD</b>, <b className="text-slate-200">Стрелки</b>, экранный D-Pad или <b className="text-slate-200">клик по соседней клетке</b>.
              </div>
            </div>

            {/* Labyrinth Action Log */}
            <div className="flex-1 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 font-mono shadow overflow-y-auto min-h-[100px]">
              {logText}
            </div>

            {/* Generate New Labyrinth Button */}
            <button
              onClick={() => startNewLabyrinth(sizeSetting, difficulty)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:scale-[1.02] text-white font-black text-xs border border-emerald-400/60 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔄</span>
              <span>Пересоздать Лабиринт</span>
            </button>
          </div>
        </div>

        {/* Live Combat Overlay Arena Modal */}
        {combatModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-950 border border-red-500/80 rounded-2xl max-w-lg w-full p-5 shadow-[0_0_50px_rgba(239,68,68,0.4)] space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 font-black text-sm text-red-400 uppercase tracking-wider">
                <span>⚔️</span>
                <span>{combatModal.isBoss ? '🔥 БИТВА С ВЛАДЫКОЙ ЛАБИРИНТА' : 'СРАЖЕНИЕ В КАТАКОМБАХ'}</span>
              </div>

              {/* Combatants Grid with high-res artwork portraits */}
              <div className="flex items-center justify-around py-3 bg-slate-900/60 rounded-2xl border border-slate-800">
                {/* Hero Card */}
                <div className="flex flex-col items-center gap-1.5 w-36">
                  <div className="relative">
                    {combatModal.playerArtSrc ? (
                      <img
                        src={combatModal.playerArtSrc}
                        alt="Герой"
                        className="w-16 h-16 rounded-full border-2 border-emerald-400 object-cover shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                      />
                    ) : (
                      <span className="text-4xl animate-pulse">🧙‍♂️</span>
                    )}
                    <span className="absolute -bottom-1 -right-1 text-xs bg-slate-900 border border-emerald-500 rounded-full px-1.5 py-0.5 text-emerald-300 font-bold">
                      Lv.{level}
                    </span>
                  </div>
                  <span className="font-bold text-xs text-emerald-400">Герой</span>
                  <span className="font-mono text-[10px] text-slate-300">
                    {fmt(combatModal.playerHp)} / {fmt(combatModal.playerMaxHp)} HP
                  </span>
                  <div className="w-28 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-150"
                      style={{ width: `${Math.max(0, (combatModal.playerHp / combatModal.playerMaxHp) * 100)}%` }}
                    />
                  </div>
                </div>

                <span className="text-2xl font-black text-amber-400 animate-pulse">VS</span>

                {/* Monster Card */}
                <div className="flex flex-col items-center gap-1.5 w-36">
                  <div className="relative">
                    {combatModal.monsterArtSrc ? (
                      <img
                        src={combatModal.monsterArtSrc}
                        alt={combatModal.monsterName}
                        className={`w-16 h-16 rounded-full border-2 ${
                          combatModal.isBoss
                            ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.8)] ring-2 ring-red-500/50'
                            : 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                        } object-cover`}
                      />
                    ) : (
                      <span className="text-4xl animate-bounce">{combatModal.monsterIcon}</span>
                    )}
                    {combatModal.isBoss && (
                      <span className="absolute -top-1 -right-1 text-xs bg-red-950 border border-red-500 rounded-full px-1.5 py-0.5 text-red-300 font-bold">
                        👑
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-xs text-red-400 truncate max-w-[130px]" title={combatModal.monsterName}>
                    {combatModal.monsterName}
                  </span>
                  <span className="font-mono text-[10px] text-slate-300">
                    {fmt(combatModal.monsterHp)} / {fmt(combatModal.monsterMaxHp)} HP
                  </span>
                  <div className="w-28 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-150"
                      style={{ width: `${Math.max(0, (combatModal.monsterHp / combatModal.monsterMaxHp) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 font-mono bg-slate-900/80 p-2 rounded-xl border border-slate-800 animate-pulse">
                ⚔️ Бой в реальном времени...
              </div>
            </div>
          </div>
        )}

        {/* Chest Loot Discovery Popup Modal */}
        {lootModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-950 border border-amber-500/80 rounded-2xl max-w-sm w-full p-5 shadow-[0_0_50px_rgba(245,158,11,0.4)] space-y-3 text-center">
              <span className="text-5xl animate-bounce inline-block">🎁</span>
              <div className="font-black text-sm text-amber-300 uppercase tracking-widest">
                СУНДУК СОКРОВИЩ ОТКРЫТ!
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-left">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-1 bg-slate-950 rounded-lg border border-slate-800">{lootModal.item.icon}</span>
                  <div>
                    <div className="text-xs font-black" style={{ color: rarityById(lootModal.item.rarity).color }}>
                      {lootModal.item.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Мощь: ⚡{fmt(lootModal.item.score)} · {rarityById(lootModal.item.rarity).name}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono font-black text-yellow-300 pt-1 border-t border-slate-800">
                  💰 Награда: +{fmt(lootModal.gold)} золота
                </div>
              </div>

              <button
                onClick={() => setLootModal(null)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-105 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Забрать Сокровище
              </button>
            </div>
          </div>
        )}

        {/* Full Labyrinth Clear Victory Banner */}
        {victoryModal && (
          <div className="p-4 bg-emerald-950/95 border border-emerald-500 rounded-2xl shadow-2xl text-center space-y-3 animate-fadeIn">
            <div className="text-lg font-black text-amber-300 flex items-center justify-center gap-2">
              <span>🎉</span>
              <span>ВЛАДЫКА ЛАБИРИНТА СОКРУШЁН!</span>
            </div>
            <p className="text-xs text-emerald-200 max-w-lg mx-auto leading-relaxed">
              Вы одолели грозного Минотавра! Вы можете свободно исследовать оставшиеся сундуки, святилища и тайные комнаты или начать новый забег.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
              <button
                onClick={() => setVictoryModal(false)}
                className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>🧭</span>
                <span>Продолжить исследование</span>
              </button>
              <button
                onClick={() => startNewLabyrinth(sizeSetting, difficulty)}
                className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>Новый Лабиринт</span>
              </button>
              <button
                onClick={onClose}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
