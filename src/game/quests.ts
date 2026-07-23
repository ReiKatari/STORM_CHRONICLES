import type { QuestDef } from './types';

// ===================== QUESTS (120+) =====================
export const QUESTS: QuestDef[] = [
  // --- 1. SLIME QUEST LINE ---
  { id: 'q_slime1', name: 'Зелёная угроза', desc: 'Убейте 15 слаймов', kind: 'kill', target: 'slime', count: 15, reward: { gold: 120, xp: 200 } },
  { id: 'q_slime2', name: 'Очистка холмов', desc: 'Убейте 30 слаймов', kind: 'kill', target: 'slime', count: 30, reward: { gold: 250, xp: 450 } },
  { id: 'q_slime3', name: 'Истребитель желе', desc: 'Убейте 75 слаймов', kind: 'kill', target: 'slime', count: 75, reward: { gold: 800, xp: 1400, statPoints: 2 } },
  { id: 'q_slime4', name: 'Слаймовый Барон', desc: 'Убейте 150 слаймов', kind: 'kill', target: 'slime', count: 150, reward: { gold: 2000, xp: 3500, itemRarity: 'rare' } },

  // --- 2. RAT QUEST LINE ---
  { id: 'q_rat1', name: 'Крысиный король', desc: 'Убейте 20 крысолюдов', kind: 'kill', target: 'rat', count: 20, reward: { gold: 180, xp: 300 } },
  { id: 'q_rat2', name: 'Зачистка подвалов', desc: 'Убейте 45 крысолюдов', kind: 'kill', target: 'rat', count: 45, reward: { gold: 450, xp: 800 } },
  { id: 'q_rat3', name: 'Чума грызунов', desc: 'Убейте 90 крысолюдов', kind: 'kill', target: 'rat', count: 90, reward: { gold: 1200, xp: 2200, statPoints: 3 } },

  // --- 3. GOBLIN QUEST LINE ---
  { id: 'q_goblin1', name: 'Прогнать гоблинов', desc: 'Убейте 25 гоблинов', kind: 'kill', target: 'goblin', count: 25, reward: { gold: 260, xp: 450 } },
  { id: 'q_goblin2', name: 'Разгром разбойников', desc: 'Убейте 60 гоблинов', kind: 'kill', target: 'goblin', count: 60, reward: { gold: 700, xp: 1200 } },
  { id: 'q_goblin3', name: 'Охота за золотом гоблинов', desc: 'Убейте 120 гоблинов', kind: 'kill', target: 'goblin', count: 120, reward: { gold: 2500, xp: 4500, itemRarity: 'epic' } },

  // --- 4. WOLF QUEST LINE ---
  { id: 'q_wolf1', name: 'Вожак стаи', desc: 'Убейте 30 волков', kind: 'kill', target: 'wolf', count: 30, reward: { gold: 400, xp: 700 } },
  { id: 'q_wolf2', name: 'Опасный лес', desc: 'Убейте 70 волков', kind: 'kill', target: 'wolf', count: 70, reward: { gold: 1100, xp: 2000 } },
  { id: 'q_wolf3', name: 'Ночной вой', desc: 'Убейте 140 волков', kind: 'kill', target: 'wolf', count: 140, reward: { gold: 3500, xp: 6000, talentPoints: 1 } },

  // --- 5. SKELETON QUEST LINE ---
  { id: 'q_skeleton1', name: 'Кости в землю', desc: 'Убейте 40 скелетов', kind: 'kill', target: 'skeleton', count: 40, reward: { gold: 650, xp: 1100 } },
  { id: 'q_skeleton2', name: 'Разрушение костниц', desc: 'Убейте 85 скелетов', kind: 'kill', target: 'skeleton', count: 85, reward: { gold: 1800, xp: 3200 } },
  { id: 'q_skeleton3', name: 'Орда бессмертных', desc: 'Убейте 180 скелетов', kind: 'kill', target: 'skeleton', count: 180, reward: { gold: 6000, xp: 10000, skillPoints: 1 } },

  // --- 6. SPIDER QUEST LINE ---
  { id: 'q_spider1', name: 'Паутина войны', desc: 'Убейте 45 пауков', kind: 'kill', target: 'spider', count: 45, reward: { gold: 900, xp: 1600 } },
  { id: 'q_spider2', name: 'Ядовитые логова', desc: 'Убейте 95 пауков', kind: 'kill', target: 'spider', count: 95, reward: { gold: 2400, xp: 4200 } },
  { id: 'q_spider3', name: 'Королева арахнидов', desc: 'Убейте 200 пауков', kind: 'kill', target: 'spider', count: 200, reward: { gold: 8000, xp: 15000, itemRarity: 'legendary' } },

  // --- 7. ORC & MINOTAUR QUEST LINE ---
  { id: 'q_orc1', name: 'Ярость орды', desc: 'Убейте 50 орков', kind: 'kill', target: 'orc', count: 50, reward: { gold: 1400, xp: 2500 } },
  { id: 'q_orc2', name: 'Вождь клана', desc: 'Убейте 110 орков', kind: 'kill', target: 'orc', count: 110, reward: { gold: 3800, xp: 6800, statPoints: 4 } },
  { id: 'q_minotaur1', name: 'Лабиринт рогатых', desc: 'Убейте 40 минотавров', kind: 'kill', target: 'minotaur', count: 40, reward: { gold: 2200, xp: 4000 } },

  // --- 8. ELEMENTAL & HYDRA QUEST LINE ---
  { id: 'q_elem1', name: 'Буйство стихий', desc: 'Убейте 50 элементалей', kind: 'kill', target: 'elemental', count: 50, reward: { gold: 2500, xp: 4500 } },
  { id: 'q_hydra1', name: 'Девять голов', desc: 'Убейте 30 гидр', kind: 'kill', target: 'hydra', count: 30, reward: { gold: 4500, xp: 8000, talentPoints: 1 } },

  // --- 9. GHOST & CULTIST QUEST LINE ---
  { id: 'q_ghost1', name: 'Успокоить духов', desc: 'Убейте 50 призраков', kind: 'kill', target: 'ghost', count: 50, reward: { gold: 1300, xp: 2300 } },
  { id: 'q_cultist1', name: 'Тёмные ритуалы', desc: 'Убейте 60 культистов', kind: 'kill', target: 'cultist', count: 60, reward: { gold: 2800, xp: 5000 } },

  // --- 10. DEMON & ARCHDEMON QUEST LINE ---
  { id: 'q_demon1', name: 'Охота на демонов', desc: 'Убейте 60 демонов', kind: 'kill', target: 'demon', count: 60, reward: { gold: 2000, xp: 3500 } },
  { id: 'q_demon2', name: 'Пламя преисподней', desc: 'Убейте 130 демонов', kind: 'kill', target: 'demon', count: 130, reward: { gold: 5500, xp: 9500, talentPoints: 1 } },

  // --- 11. VAMPIRE & LICH QUEST LINE ---
  { id: 'q_vampire1', name: 'Кол в сердце', desc: 'Убейте 70 вампиров', kind: 'kill', target: 'vampire', count: 70, reward: { gold: 3000, xp: 5200 } },
  { id: 'q_vampire2', name: 'Алая зачистка', desc: 'Убейте 150 вампиров', kind: 'kill', target: 'vampire', count: 150, reward: { gold: 9000, xp: 16000, statPoints: 5 } },
  { id: 'q_lich1', name: 'Костница лича', desc: 'Убейте 40 личей', kind: 'kill', target: 'lich', count: 40, reward: { gold: 8000, xp: 15000, itemRarity: 'legendary' } },

  // --- 12. DRAGON & PHOENIX QUEST LINE ---
  { id: 'q_dragon1', name: 'Драконоборец', desc: 'Убейте 80 драконов', kind: 'kill', target: 'dragon', count: 80, reward: { gold: 5000, xp: 8500, talentPoints: 1 } },
  { id: 'q_dragon2', name: 'Покоритель стихий', desc: 'Убейте 160 драконов', kind: 'kill', target: 'dragon', count: 160, reward: { gold: 18000, xp: 30000, itemRarity: 'mythic' } },
  { id: 'q_phoenix1', name: 'Восставший из пепла', desc: 'Убейте 25 фениксов', kind: 'kill', target: 'phoenix', count: 25, reward: { gold: 12000, xp: 22000, skillPoints: 1 } },

  // --- 13. ABYSS QUEST LINE ---
  { id: 'q_abyss1', name: 'Вглядеться в бездну', desc: 'Убейте 100 порождений Бездны', kind: 'kill', target: 'abyss', count: 100, reward: { gold: 8000, xp: 14000, skillPoints: 1 } },
  { id: 'q_abyss2', name: 'Страж Пропасти', desc: 'Убейте 250 порождений Бездны', kind: 'kill', target: 'abyss', count: 250, reward: { gold: 35000, xp: 60000, itemRarity: 'divine' } },

  // --- 14. ANY MONSTER SLAUGHTER ---
  { id: 'q_any1', name: 'Тихая охота', desc: 'Убейте 50 любых монстров', kind: 'killAny', target: '', count: 50, reward: { gold: 300, xp: 500, statPoints: 2 } },
  { id: 'q_any2', name: 'Сотня смертей', desc: 'Убейте 100 любых монстров', kind: 'killAny', target: '', count: 100, reward: { gold: 700, xp: 1200 } },
  { id: 'q_any3', name: 'Пять сотен', desc: 'Убейте 500 любых монстров', kind: 'killAny', target: '', count: 500, reward: { gold: 4000, xp: 7000, talentPoints: 1 } },
  { id: 'q_any4', name: 'Тысячник', desc: 'Убейте 1 000 любых монстров', kind: 'killAny', target: '', count: 1000, reward: { gold: 12000, xp: 20000, skillPoints: 2 } },
  { id: 'q_any5', name: 'Легенда резни', desc: 'Убейте 5 000 любых монстров', kind: 'killAny', target: '', count: 5000, reward: { gold: 60000, xp: 100000, statPoints: 10 } },
  { id: 'q_any6', name: 'Великий Палач Бездны', desc: 'Убейте 10 000 любых монстров', kind: 'killAny', target: '', count: 10000, reward: { gold: 150000, xp: 250000, talentPoints: 3 } },

  // --- 15. BOSS BOUNTIES ---
  { id: 'q_boss1', name: 'Первая кровь', desc: 'Победите 1 босса', kind: 'boss', target: '', count: 1, reward: { gold: 500, xp: 800, itemRarity: 'rare' } },
  { id: 'q_boss2', name: 'Охотник на вожаков', desc: 'Победите 3 боссов', kind: 'boss', target: '', count: 3, reward: { gold: 1500, xp: 2500 } },
  { id: 'q_boss3', name: 'Палач гигантов', desc: 'Победите 5 боссов', kind: 'boss', target: '', count: 5, reward: { gold: 4000, xp: 6500, itemRarity: 'epic' } },
  { id: 'q_boss4', name: 'Король-убийца', desc: 'Победите 12 боссов', kind: 'boss', target: '', count: 12, reward: { gold: 15000, xp: 25000, itemRarity: 'legendary' } },
  { id: 'q_boss5', name: 'Богоборец', desc: 'Победите 25 боссов', kind: 'boss', target: '', count: 25, reward: { gold: 50000, xp: 80000, itemRarity: 'mythic' } },
  { id: 'q_boss6', name: 'Истребитель Лордов', desc: 'Победите 50 боссов', kind: 'boss', target: '', count: 50, reward: { gold: 150000, xp: 250000, itemRarity: 'divine' } },

  // --- 16. LEVEL MILESTONES ---
  { id: 'q_lvl1', name: 'Первые шаги', desc: 'Достигните 10 уровня', kind: 'level', target: '', count: 10, reward: { gold: 300, xp: 0, statPoints: 3 } },
  { id: 'q_lvl2', name: 'Закалка', desc: 'Достигните 25 уровня', kind: 'level', target: '', count: 25, reward: { gold: 1200, xp: 0, statPoints: 3, talentPoints: 1 } },
  { id: 'q_lvl3', name: 'Ветеран', desc: 'Достигните 50 уровня', kind: 'level', target: '', count: 50, reward: { gold: 5000, xp: 0, statPoints: 5, skillPoints: 1 } },
  { id: 'q_lvl4', name: 'Герой эпохи', desc: 'Достигните 100 уровня', kind: 'level', target: '', count: 100, reward: { gold: 25000, xp: 0, statPoints: 8, talentPoints: 2 } },
  { id: 'q_lvl5', name: 'Полубог', desc: 'Достигните 200 уровня', kind: 'level', target: '', count: 200, reward: { gold: 150000, xp: 0, statPoints: 15, skillPoints: 2 } },
  { id: 'q_lvl6', name: 'Повелитель Судьбы', desc: 'Достигните 300 уровня', kind: 'level', target: '', count: 300, reward: { gold: 500000, xp: 0, statPoints: 25, talentPoints: 5 } },

  // --- 17. DUNGEONS ---
  { id: 'q_dun1', name: 'В первый раз?', desc: 'Пройдите 1 подземелье', kind: 'dungeon', target: '', count: 1, reward: { gold: 600, xp: 1000, itemRarity: 'rare' } },
  { id: 'q_dun2', name: 'Покоритель глубин', desc: 'Пройдите 3 подземелья', kind: 'dungeon', target: '', count: 3, reward: { gold: 2500, xp: 4000, itemRarity: 'epic' } },
  { id: 'q_dun3', name: 'Хозяин катакомб', desc: 'Пройдите 10 подземелий', kind: 'dungeon', target: '', count: 10, reward: { gold: 12000, xp: 20000, itemRarity: 'legendary' } },
  { id: 'q_dun4', name: 'Властелин мрака', desc: 'Пройдите 30 подземелий', kind: 'dungeon', target: '', count: 30, reward: { gold: 50000, xp: 80000, itemRarity: 'mythic' } },

  // --- 18. LOOT COLLECTION ---
  { id: 'q_loot1', name: 'Синее сияние', desc: 'Получите 3 редких предмета', kind: 'loot', target: 'rare', count: 3, reward: { gold: 500, xp: 800 } },
  { id: 'q_loot2', name: 'Фиолетовая страсть', desc: 'Получите 5 эпических предметов', kind: 'loot', target: 'epic', count: 5, reward: { gold: 2000, xp: 3500, statPoints: 2 } },
  { id: 'q_loot3', name: 'Оранжевая мечта', desc: 'Получите 3 легендарных предмета', kind: 'loot', target: 'legendary', count: 3, reward: { gold: 8000, xp: 14000, talentPoints: 1 } },
  { id: 'q_loot4', name: 'Миф о вечности', desc: 'Получите 2 мифических предмета', kind: 'loot', target: 'mythic', count: 2, reward: { gold: 30000, xp: 50000, skillPoints: 1 } },
  { id: 'q_loot5', name: 'Божественный промысел', desc: 'Получите 1 божественный предмет', kind: 'loot', target: 'divine', count: 1, reward: { gold: 100000, xp: 200000, statPoints: 10 } },

  // --- 19. GOLD TYCOON ---
  { id: 'q_gold1', name: 'Первый капитал', desc: 'Накопите 5 000 золота (всего заработано)', kind: 'gold', target: '', count: 5000, reward: { gold: 1000, xp: 1500 } },
  { id: 'q_gold2', name: 'Торговый магнат', desc: 'Заработайте 100 000 золота', kind: 'gold', target: '', count: 100000, reward: { gold: 10000, xp: 15000 } },
  { id: 'q_gold3', name: 'Драконья сокровищница', desc: 'Заработайте 2 000 000 золота', kind: 'gold', target: '', count: 2000000, reward: { gold: 200000, xp: 300000, talentPoints: 2 } },

  // --- 20. SECRETS ---
  { id: 'q_secret1', name: 'Скрытая тропа', desc: 'Откройте скрытую территорию', kind: 'secret', target: '', count: 1, reward: { gold: 3000, xp: 5000, skillPoints: 1 } },
  { id: 'q_secret2', name: 'Картограф тайн', desc: 'Откройте 3 скрытые территории', kind: 'secret', target: '', count: 3, reward: { gold: 20000, xp: 35000, itemRarity: 'legendary' } },
];

export const questById = (id: string) => QUESTS.find(q => q.id === id)!;
