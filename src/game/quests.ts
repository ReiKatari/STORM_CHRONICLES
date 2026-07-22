import type { QuestDef } from './types';

// ===================== QUESTS (40) =====================
export const QUESTS: QuestDef[] = [
  // --- kill quests ---
  { id: 'q_slime1', name: 'Зелёная угроза', desc: 'Убейте 15 слаймов', kind: 'kill', target: 'slime', count: 15, reward: { gold: 120, xp: 200 } },
  { id: 'q_rat1', name: 'Крысиный король', desc: 'Убейте 20 крысолюдов', kind: 'kill', target: 'rat', count: 20, reward: { gold: 180, xp: 300 } },
  { id: 'q_goblin1', name: 'Прогнать гоблинов', desc: 'Убейте 25 гоблинов', kind: 'kill', target: 'goblin', count: 25, reward: { gold: 260, xp: 450 } },
  { id: 'q_wolf1', name: 'Вожак стаи', desc: 'Убейте 30 волков', kind: 'kill', target: 'wolf', count: 30, reward: { gold: 400, xp: 700 } },
  { id: 'q_skeleton1', name: 'Кости в землю', desc: 'Убейте 40 скелетов', kind: 'kill', target: 'skeleton', count: 40, reward: { gold: 650, xp: 1100 } },
  { id: 'q_spider1', name: 'Паутина войны', desc: 'Убейте 45 пауков', kind: 'kill', target: 'spider', count: 45, reward: { gold: 900, xp: 1600 } },
  { id: 'q_ghost1', name: 'Успокоить духов', desc: 'Убейте 50 призраков', kind: 'kill', target: 'ghost', count: 50, reward: { gold: 1300, xp: 2300 } },
  { id: 'q_demon1', name: 'Охота на демонов', desc: 'Убейте 60 демонов', kind: 'kill', target: 'demon', count: 60, reward: { gold: 2000, xp: 3500 } },
  { id: 'q_vampire1', name: 'Кол в сердце', desc: 'Убейте 70 вампиров', kind: 'kill', target: 'vampire', count: 70, reward: { gold: 3000, xp: 5200 } },
  { id: 'q_dragon1', name: 'Драконоборец', desc: 'Убейте 80 драконов', kind: 'kill', target: 'dragon', count: 80, reward: { gold: 5000, xp: 8500, talentPoints: 1 } },
  { id: 'q_abyss1', name: 'Вглядеться в бездну', desc: 'Убейте 100 порождений Бездны', kind: 'kill', target: 'abyss', count: 100, reward: { gold: 8000, xp: 14000, skillPoints: 1 } },
  { id: 'q_any1', name: 'Тихая охота', desc: 'Убейте 50 любых монстров', kind: 'killAny', target: '', count: 50, reward: { gold: 300, xp: 500, statPoints: 2 } },
  { id: 'q_any2', name: 'Сотня смертей', desc: 'Убейте 100 любых монстров', kind: 'killAny', target: '', count: 100, reward: { gold: 700, xp: 1200 } },
  { id: 'q_any3', name: 'Пять сотен', desc: 'Убейте 500 любых монстров', kind: 'killAny', target: '', count: 500, reward: { gold: 4000, xp: 7000, talentPoints: 1 } },
  { id: 'q_any4', name: 'Тысячник', desc: 'Убейте 1000 любых монстров', kind: 'killAny', target: '', count: 1000, reward: { gold: 12000, xp: 20000, skillPoints: 2 } },
  { id: 'q_any5', name: 'Легенда резни', desc: 'Убейте 5000 любых монстров', kind: 'killAny', target: '', count: 5000, reward: { gold: 60000, xp: 100000, statPoints: 10 } },
  // --- bosses ---
  { id: 'q_boss1', name: 'Первая кровь', desc: 'Победите 1 босса', kind: 'boss', target: '', count: 1, reward: { gold: 500, xp: 800, itemRarity: 'rare' } },
  { id: 'q_boss2', name: 'Охотник на вожаков', desc: 'Победите 3 боссов', kind: 'boss', target: '', count: 3, reward: { gold: 1500, xp: 2500 } },
  { id: 'q_boss3', name: 'Палач гигантов', desc: 'Победите 5 боссов', kind: 'boss', target: '', count: 5, reward: { gold: 4000, xp: 6500, itemRarity: 'epic' } },
  { id: 'q_boss4', name: 'Король-убийца', desc: 'Победите 12 боссов', kind: 'boss', target: '', count: 12, reward: { gold: 15000, xp: 25000, itemRarity: 'legendary' } },
  { id: 'q_boss5', name: 'Богоборец', desc: 'Победите 25 боссов', kind: 'boss', target: '', count: 25, reward: { gold: 50000, xp: 80000, itemRarity: 'mythic' } },
  // --- levels ---
  { id: 'q_lvl1', name: 'Первые шаги', desc: 'Достигните 10 уровня', kind: 'level', target: '', count: 10, reward: { gold: 300, xp: 0, statPoints: 3 } },
  { id: 'q_lvl2', name: 'Закалка', desc: 'Достигните 25 уровня', kind: 'level', target: '', count: 25, reward: { gold: 1200, xp: 0, statPoints: 3, talentPoints: 1 } },
  { id: 'q_lvl3', name: 'Ветеран', desc: 'Достигните 50 уровня', kind: 'level', target: '', count: 50, reward: { gold: 5000, xp: 0, statPoints: 5, skillPoints: 1 } },
  { id: 'q_lvl4', name: 'Герой эпохи', desc: 'Достигните 100 уровня', kind: 'level', target: '', count: 100, reward: { gold: 25000, xp: 0, statPoints: 8, talentPoints: 2 } },
  { id: 'q_lvl5', name: 'Полубог', desc: 'Достигните 200 уровня', kind: 'level', target: '', count: 200, reward: { gold: 150000, xp: 0, statPoints: 15, skillPoints: 2 } },
  // --- dungeons ---
  { id: 'q_dun1', name: 'В первый раз?', desc: 'Пройдите 1 подземелье', kind: 'dungeon', target: '', count: 1, reward: { gold: 600, xp: 1000, itemRarity: 'rare' } },
  { id: 'q_dun2', name: 'Покоритель глубин', desc: 'Пройдите 3 подземелья', kind: 'dungeon', target: '', count: 3, reward: { gold: 2500, xp: 4000, itemRarity: 'epic' } },
  { id: 'q_dun3', name: 'Хозяин катакомб', desc: 'Пройдите 10 подземелий', kind: 'dungeon', target: '', count: 10, reward: { gold: 12000, xp: 20000, itemRarity: 'legendary' } },
  { id: 'q_dun4', name: 'Властелин мрака', desc: 'Пройдите 30 подземелий', kind: 'dungeon', target: '', count: 30, reward: { gold: 50000, xp: 80000, itemRarity: 'mythic' } },
  // --- loot ---
  { id: 'q_loot1', name: 'Синее сияние', desc: 'Получите 3 редких предмета', kind: 'loot', target: 'rare', count: 3, reward: { gold: 500, xp: 800 } },
  { id: 'q_loot2', name: 'Фиолетовая страсть', desc: 'Получите 5 эпических предметов', kind: 'loot', target: 'epic', count: 5, reward: { gold: 2000, xp: 3500, statPoints: 2 } },
  { id: 'q_loot3', name: 'Оранжевая мечта', desc: 'Получите 3 легендарных предмета', kind: 'loot', target: 'legendary', count: 3, reward: { gold: 8000, xp: 14000, talentPoints: 1 } },
  { id: 'q_loot4', name: 'Миф о вечности', desc: 'Получите 2 мифических предмета', kind: 'loot', target: 'mythic', count: 2, reward: { gold: 30000, xp: 50000, skillPoints: 1 } },
  { id: 'q_loot5', name: 'Божественный промысел', desc: 'Получите 1 божественный предмет', kind: 'loot', target: 'divine', count: 1, reward: { gold: 100000, xp: 200000, statPoints: 10 } },
  // --- gold ---
  { id: 'q_gold1', name: 'Первый капитал', desc: 'Накопите 5 000 золота (всего заработано)', kind: 'gold', target: '', count: 5000, reward: { gold: 1000, xp: 1500 } },
  { id: 'q_gold2', name: 'Торговый магнат', desc: 'Заработайте 100 000 золота', kind: 'gold', target: '', count: 100000, reward: { gold: 10000, xp: 15000 } },
  { id: 'q_gold3', name: 'Драконья сокровищница', desc: 'Заработайте 2 000 000 золота', kind: 'gold', target: '', count: 2000000, reward: { gold: 200000, xp: 300000, talentPoints: 2 } },
  // --- secrets ---
  { id: 'q_secret1', name: 'Скрытая тропа', desc: 'Откройте скрытую территорию', kind: 'secret', target: '', count: 1, reward: { gold: 3000, xp: 5000, skillPoints: 1 } },
  { id: 'q_secret2', name: 'Картограф тайн', desc: 'Откройте 3 скрытые территории', kind: 'secret', target: '', count: 3, reward: { gold: 20000, xp: 35000, itemRarity: 'legendary' } },
];

export const questById = (id: string) => QUESTS.find(q => q.id === id)!;
