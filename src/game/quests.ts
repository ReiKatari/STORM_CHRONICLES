import type { QuestDef } from './types';

// ===================== QUESTS (190+ RICH EXPANDED QUESTS) =====================
export const QUESTS: QuestDef[] = [
  // --- 1. SLIME QUEST LINE ---
  { id: 'q_slime1', name: 'Зелёная угроза', desc: 'Убейте 15 слаймов', kind: 'kill', target: 'slime', count: 15, reward: { gold: 120, xp: 200 } },
  { id: 'q_slime2', name: 'Очистка холмов', desc: 'Убейте 30 слаймов', kind: 'kill', target: 'slime', count: 30, reward: { gold: 250, xp: 450 } },
  { id: 'q_slime3', name: 'Истребитель желе', desc: 'Убейте 75 слаймов', kind: 'kill', target: 'slime', count: 75, reward: { gold: 800, xp: 1400, statPoints: 2 } },
  { id: 'q_slime4', name: 'Слаймовый Барон', desc: 'Убейте 150 слаймов', kind: 'kill', target: 'slime', count: 150, reward: { gold: 2000, xp: 3500, itemRarity: 'rare' } },
  { id: 'q_slime5', name: 'Первородная Слизь', desc: 'Убейте 300 слаймов', kind: 'kill', target: 'slime', count: 300, reward: { gold: 6000, xp: 10000, statPoints: 4 } },

  // --- 2. RAT QUEST LINE ---
  { id: 'q_rat1', name: 'Крысиный король', desc: 'Убейте 20 крысолюдов', kind: 'kill', target: 'rat', count: 20, reward: { gold: 180, xp: 300 } },
  { id: 'q_rat2', name: 'Зачистка подвалов', desc: 'Убейте 45 крысолюдов', kind: 'kill', target: 'rat', count: 45, reward: { gold: 450, xp: 800 } },
  { id: 'q_rat3', name: 'Чума грызунов', desc: 'Убейте 90 крысолюдов', kind: 'kill', target: 'rat', count: 90, reward: { gold: 1200, xp: 2200, statPoints: 3 } },
  { id: 'q_rat4', name: 'Гроза Подземелий', desc: 'Убейте 200 крысолюдов', kind: 'kill', target: 'rat', count: 200, reward: { gold: 4500, xp: 8000, talentPoints: 1 } },

  // --- 3. GOBLIN QUEST LINE ---
  { id: 'q_goblin1', name: 'Прогнать гоблинов', desc: 'Убейте 25 гоблинов', kind: 'kill', target: 'goblin', count: 25, reward: { gold: 260, xp: 450 } },
  { id: 'q_goblin2', name: 'Разгром разбойников', desc: 'Убейте 60 гоблинов', kind: 'kill', target: 'goblin', count: 60, reward: { gold: 700, xp: 1200 } },
  { id: 'q_goblin3', name: 'Охота за золотом гоблинов', desc: 'Убейте 120 гоблинов', kind: 'kill', target: 'goblin', count: 120, reward: { gold: 2500, xp: 4500, itemRarity: 'epic' } },
  { id: 'q_goblin4', name: 'Королевский Разгром', desc: 'Убейте 250 гоблинов', kind: 'kill', target: 'goblin', count: 250, reward: { gold: 8000, xp: 14000, skillPoints: 1 } },

  // --- 4. ZOMBIE & SKELETON QUEST LINE ---
  { id: 'q_zombie1', name: 'Ходячие мертвецы', desc: 'Убейте 30 зомби', kind: 'kill', target: 'zombie', count: 30, reward: { gold: 350, xp: 600 } },
  { id: 'q_zombie2', name: 'Упокоение мертвых', desc: 'Убейте 75 зомби', kind: 'kill', target: 'zombie', count: 75, reward: { gold: 1000, xp: 1800, statPoints: 2 } },
  { id: 'q_zombie3', name: 'Чумная орда', desc: 'Убейте 160 зомби', kind: 'kill', target: 'zombie', count: 160, reward: { gold: 3800, xp: 7000, talentPoints: 1 } },
  { id: 'q_skeleton1', name: 'Кости в землю', desc: 'Убейте 40 скелетов', kind: 'kill', target: 'skeleton', count: 40, reward: { gold: 650, xp: 1100 } },
  { id: 'q_skeleton2', name: 'Разрушение костниц', desc: 'Убейте 85 скелетов', kind: 'kill', target: 'skeleton', count: 85, reward: { gold: 1800, xp: 3200 } },
  { id: 'q_skeleton3', name: 'Орда бессмертных', desc: 'Убейте 180 скелетов', kind: 'kill', target: 'skeleton', count: 180, reward: { gold: 6000, xp: 10000, skillPoints: 1 } },
  { id: 'q_skeleton4', name: 'Вечный Покой', desc: 'Убейте 350 скелетов', kind: 'kill', target: 'skeleton', count: 350, reward: { gold: 15000, xp: 26000, itemRarity: 'legendary' } },

  // --- 5. WOLF & BEAR QUEST LINE ---
  { id: 'q_wolf1', name: 'Вожак стаи', desc: 'Убейте 30 волков', kind: 'kill', target: 'wolf', count: 30, reward: { gold: 400, xp: 700 } },
  { id: 'q_wolf2', name: 'Опасный лес', desc: 'Убейте 70 волков', kind: 'kill', target: 'wolf', count: 70, reward: { gold: 1100, xp: 2000 } },
  { id: 'q_wolf3', name: 'Ночной вой', desc: 'Убейте 140 волков', kind: 'kill', target: 'wolf', count: 140, reward: { gold: 3500, xp: 6000, talentPoints: 1 } },
  { id: 'q_bear1', name: 'Хозяин чащи', desc: 'Убейте 25 медведей', kind: 'kill', target: 'bear', count: 25, reward: { gold: 900, xp: 1600 } },
  { id: 'q_bear2', name: 'Ярость берсерка', desc: 'Убейте 65 медведей', kind: 'kill', target: 'bear', count: 65, reward: { gold: 2800, xp: 5000, statPoints: 3 } },

  // --- 6. SPIDER & SCORPION QUEST LINE ---
  { id: 'q_spider1', name: 'Паутина войны', desc: 'Убейте 45 пауков', kind: 'kill', target: 'spider', count: 45, reward: { gold: 900, xp: 1600 } },
  { id: 'q_spider2', name: 'Ядовитые логова', desc: 'Убейте 95 пауков', kind: 'kill', target: 'spider', count: 95, reward: { gold: 2400, xp: 4200 } },
  { id: 'q_spider3', name: 'Королева арахнидов', desc: 'Убейте 200 пауков', kind: 'kill', target: 'spider', count: 200, reward: { gold: 8000, xp: 15000, itemRarity: 'legendary' } },
  { id: 'q_scorpion1', name: 'Песчаное жало', desc: 'Убейте 35 скорпионов', kind: 'kill', target: 'scorpion', count: 35, reward: { gold: 1200, xp: 2200 } },
  { id: 'q_scorpion2', name: 'Император пустыни', desc: 'Убейте 80 скорпионов', kind: 'kill', target: 'scorpion', count: 80, reward: { gold: 3600, xp: 6500, talentPoints: 1 } },

  // --- 7. BANDIT & KNIGHT QUEST LINE ---
  { id: 'q_bandit1', name: 'Засада на тракте', desc: 'Убейте 35 бандитов', kind: 'kill', target: 'bandit', count: 35, reward: { gold: 1100, xp: 1900 } },
  { id: 'q_bandit2', name: 'Главарь разбойников', desc: 'Убейте 85 бандитов', kind: 'kill', target: 'bandit', count: 85, reward: { gold: 3200, xp: 5800, itemRarity: 'rare' } },
  { id: 'q_knight1', name: 'Падшая честь', desc: 'Убейте 40 проклятых рыцарей', kind: 'kill', target: 'knight', count: 40, reward: { gold: 3500, xp: 6000 } },
  { id: 'q_knight2', name: 'Орден Тьмы', desc: 'Убейте 90 проклятых рыцарей', kind: 'kill', target: 'knight', count: 90, reward: { gold: 9500, xp: 17000, statPoints: 4 } },

  // --- 8. ORC & MINOTAUR QUEST LINE ---
  { id: 'q_orc1', name: 'Ярость орды', desc: 'Убейте 50 орков', kind: 'kill', target: 'orc', count: 50, reward: { gold: 1400, xp: 2500 } },
  { id: 'q_orc2', name: 'Вождь клана', desc: 'Убейте 110 орков', kind: 'kill', target: 'orc', count: 110, reward: { gold: 3800, xp: 6800, statPoints: 4 } },
  { id: 'q_orc3', name: 'Несокрушимый Легион', desc: 'Убейте 220 орков', kind: 'kill', target: 'orc', count: 220, reward: { gold: 12000, xp: 22000, itemRarity: 'epic' } },
  { id: 'q_minotaur1', name: 'Лабиринт рогатых', desc: 'Убейте 40 минотавров', kind: 'kill', target: 'minotaur', count: 40, reward: { gold: 2200, xp: 4000 } },
  { id: 'q_minotaur2', name: 'Рога и копыта', desc: 'Убейте 90 минотавров', kind: 'kill', target: 'minotaur', count: 90, reward: { gold: 6500, xp: 12000, talentPoints: 1 } },

  // --- 9. ELEMENTALS & GOLEM QUEST LINE ---
  { id: 'q_elem_f1', name: 'Пламенный хаос', desc: 'Убейте 30 элементалей огня', kind: 'kill', target: 'elemental_fire', count: 30, reward: { gold: 1800, xp: 3200 } },
  { id: 'q_elem_f2', name: 'Инферно', desc: 'Убейте 75 элементалей огня', kind: 'kill', target: 'elemental_fire', count: 75, reward: { gold: 5200, xp: 9500, statPoints: 3 } },
  { id: 'q_elem_i1', name: 'Вечная мерзлота', desc: 'Убейте 30 элементалей льда', kind: 'kill', target: 'elemental_ice', count: 30, reward: { gold: 1800, xp: 3200 } },
  { id: 'q_elem_i2', name: 'Ледяной шторм', desc: 'Убейте 75 элементалей льда', kind: 'kill', target: 'elemental_ice', count: 75, reward: { gold: 5200, xp: 9500, statPoints: 3 } },
  { id: 'q_elem_s1', name: 'Грозовой фронт', desc: 'Убейте 30 элементалей бури', kind: 'kill', target: 'elemental_storm', count: 30, reward: { gold: 1800, xp: 3200 } },
  { id: 'q_elem_s2', name: 'Гнев стихий', desc: 'Убейте 75 элементалей бури', kind: 'kill', target: 'elemental_storm', count: 75, reward: { gold: 5200, xp: 9500, talentPoints: 1 } },
  { id: 'q_golem1', name: 'Каменные гиганты', desc: 'Убейте 25 големов', kind: 'kill', target: 'golem', count: 25, reward: { gold: 2000, xp: 3600 } },
  { id: 'q_golem2', name: 'Дробитель монолитов', desc: 'Убейте 60 големов', kind: 'kill', target: 'golem', count: 60, reward: { gold: 6500, xp: 12000, statPoints: 3 } },

  // --- 10. VAMPIRE & CULTIST QUEST LINE ---
  { id: 'q_vampire1', name: 'Кровь и тьма', desc: 'Убейте 25 вампиров', kind: 'kill', target: 'vampire', count: 25, reward: { gold: 2400, xp: 4200 } },
  { id: 'q_vampire2', name: 'Охотник на кровососов', desc: 'Убейте 65 вампиров', kind: 'kill', target: 'vampire', count: 65, reward: { gold: 7500, xp: 13500, itemRarity: 'epic' } },
  { id: 'q_vampire3', name: 'Древний Ковен', desc: 'Убейте 130 вампиров', kind: 'kill', target: 'vampire', count: 130, reward: { gold: 18000, xp: 32000, statPoints: 5 } },
  { id: 'q_cultist1', name: 'Срыв ритуала', desc: 'Убейте 35 культистов', kind: 'kill', target: 'cultist', count: 35, reward: { gold: 2100, xp: 3800 } },
  { id: 'q_cultist2', name: 'Искоренение ереси', desc: 'Убейте 80 культистов', kind: 'kill', target: 'cultist', count: 80, reward: { gold: 6800, xp: 12000, talentPoints: 1 } },

  // --- 11. DEMON & ABYSS QUEST LINE ---
  { id: 'q_demon1', name: 'Посланники ада', desc: 'Убейте 30 демонов', kind: 'kill', target: 'demon', count: 30, reward: { gold: 3200, xp: 5800 } },
  { id: 'q_demon2', name: 'Очищение скверны', desc: 'Убейте 70 демонов', kind: 'kill', target: 'demon', count: 70, reward: { gold: 9500, xp: 17000, statPoints: 4 } },
  { id: 'q_demon3', name: 'Армагеддон', desc: 'Убейте 150 демонов', kind: 'kill', target: 'demon', count: 150, reward: { gold: 25000, xp: 45000, itemRarity: 'legendary' } },
  { id: 'q_abyss1', name: 'Твари глубин', desc: 'Убейте 25 порождений Бездны', kind: 'kill', target: 'abyss', count: 25, reward: { gold: 4500, xp: 8000 } },
  { id: 'q_abyss2', name: 'Разрыв измерений', desc: 'Убейте 65 порождений Бездны', kind: 'kill', target: 'abyss', count: 65, reward: { gold: 14000, xp: 25000, skillPoints: 1 } },
  { id: 'q_abyss3', name: 'Первозданный Хаос', desc: 'Убейте 140 порождений Бездны', kind: 'kill', target: 'abyss', count: 140, reward: { gold: 40000, xp: 75000, itemRarity: 'mythic' } },

  // --- 12. DRAGON & WYVERN QUEST LINE ---
  { id: 'q_dragon1', name: 'Драконье гнездо', desc: 'Убейте 15 драконов', kind: 'kill', target: 'dragon', count: 15, reward: { gold: 5500, xp: 10000 } },
  { id: 'q_dragon2', name: 'Охота на ящеров', desc: 'Убейте 35 драконов', kind: 'kill', target: 'dragon', count: 35, reward: { gold: 16000, xp: 28000, itemRarity: 'legendary' } },
  { id: 'q_dragon3', name: 'Драконоборец', desc: 'Убейте 80 драконов', kind: 'kill', target: 'dragon', count: 80, reward: { gold: 45000, xp: 80000, statPoints: 6, talentPoints: 2 } },
  { id: 'q_wyvern1', name: 'Гроза небес', desc: 'Убейте 20 виверн', kind: 'kill', target: 'wyvern', count: 20, reward: { gold: 3000, xp: 5500 } },
  { id: 'q_wyvern2', name: 'Подрезанные крылья', desc: 'Убейте 50 виверн', kind: 'kill', target: 'wyvern', count: 50, reward: { gold: 8500, xp: 15000, statPoints: 3 } },

  // --- 13. LICH & NECROMANCER QUEST LINE ---
  { id: 'q_lich1', name: 'Филактерии тьмы', desc: 'Убейте 20 личей', kind: 'kill', target: 'lich', count: 20, reward: { gold: 4000, xp: 7000 } },
  { id: 'q_lich2', name: 'Смерть бессмертным', desc: 'Убейте 50 личей', kind: 'kill', target: 'lich', count: 50, reward: { gold: 12000, xp: 21000, itemRarity: 'epic' } },
  { id: 'q_lich3', name: 'Владыка Склепа', desc: 'Убейте 100 личей', kind: 'kill', target: 'lich', count: 100, reward: { gold: 32000, xp: 58000, skillPoints: 1 } },
  { id: 'q_necro1', name: 'Осквернители могил', desc: 'Убейте 25 некромантов', kind: 'kill', target: 'necromancer', count: 25, reward: { gold: 3500, xp: 6200 } },
  { id: 'q_necro2', name: 'Разрушитель культов', desc: 'Убейте 60 некромантов', kind: 'kill', target: 'necromancer', count: 60, reward: { gold: 10500, xp: 18500, statPoints: 4 } },

  // --- 14. HYDRA & SIREN QUEST LINE ---
  { id: 'q_hydra1', name: 'Многоглавый ужас', desc: 'Убейте 20 гидр', kind: 'kill', target: 'hydra', count: 20, reward: { gold: 3800, xp: 6800 } },
  { id: 'q_hydra2', name: 'Отрубить все головы', desc: 'Убейте 50 гидр', kind: 'kill', target: 'hydra', count: 50, reward: { gold: 11000, xp: 20000, itemRarity: 'legendary' } },
  { id: 'q_siren1', name: 'Песнь сирен', desc: 'Убейте 25 сирен', kind: 'kill', target: 'siren', count: 25, reward: { gold: 2600, xp: 4600 } },
  { id: 'q_siren2', name: 'Молчание глубин', desc: 'Убейте 65 сирен', kind: 'kill', target: 'siren', count: 65, reward: { gold: 8000, xp: 14500, statPoints: 3 } },

  // --- 15. TREANT & GARGOYLE QUEST LINE ---
  { id: 'q_treant1', name: 'Защитники рощи', desc: 'Убейте 25 древней', kind: 'kill', target: 'treant', count: 25, reward: { gold: 2400, xp: 4200 } },
  { id: 'q_treant2', name: 'Лесоповал', desc: 'Убейте 60 древней', kind: 'kill', target: 'treant', count: 60, reward: { gold: 7200, xp: 13000, talentPoints: 1 } },
  { id: 'q_gargoyle1', name: 'Каменные крылья', desc: 'Убейте 25 гаргулий', kind: 'kill', target: 'gargoyle', count: 25, reward: { gold: 2800, xp: 5000 } },
  { id: 'q_gargoyle2', name: 'Очистка шпилей', desc: 'Убейте 60 гаргулий', kind: 'kill', target: 'gargoyle', count: 60, reward: { gold: 8200, xp: 14800, statPoints: 3 } },

  // --- 16. YETI, MANTICORE, BEHOLDER, CERBERUS, PHOENIX, LEVIATHAN, TITAN, DJINN, IFRIT, VALKYRIE, ARCHANGEL, ARCHDEMON ---
  { id: 'q_yeti1', name: 'Владыка Снегов', desc: 'Убейте 20 йети', kind: 'kill', target: 'yeti', count: 20, reward: { gold: 4500, xp: 8000 } },
  { id: 'q_yeti2', name: 'Снежная Лавина', desc: 'Убейте 50 йети', kind: 'kill', target: 'yeti', count: 50, reward: { gold: 14000, xp: 25000, itemRarity: 'legendary' } },
  { id: 'q_manticore1', name: 'Яд Мантикоры', desc: 'Убейте 20 мантикор', kind: 'kill', target: 'manticore', count: 20, reward: { gold: 5000, xp: 9000 } },
  { id: 'q_manticore2', name: 'Пустынный Ужас', desc: 'Убейте 50 мантикор', kind: 'kill', target: 'manticore', count: 50, reward: { gold: 16000, xp: 29000, talentPoints: 2 } },
  { id: 'q_beholder1', name: 'Всевидящее Око', desc: 'Убейте 20 бехолдеров', kind: 'kill', target: 'beholder', count: 20, reward: { gold: 6000, xp: 11000 } },
  { id: 'q_beholder2', name: 'Абсолютный Взор', desc: 'Убейте 50 бехолдеров', kind: 'kill', target: 'beholder', count: 50, reward: { gold: 19000, xp: 35000, skillPoints: 1 } },
  { id: 'q_cerberus1', name: 'Страж Врат Ада', desc: 'Убейте 20 церберов', kind: 'kill', target: 'cerberus', count: 20, reward: { gold: 6500, xp: 12000 } },
  { id: 'q_cerberus2', name: 'Цепи Преисподней', desc: 'Убейте 50 церберов', kind: 'kill', target: 'cerberus', count: 50, reward: { gold: 22000, xp: 40000, statPoints: 5 } },
  { id: 'q_phoenix1', name: 'Пепел и Пламя', desc: 'Убейте 15 фениксов', kind: 'kill', target: 'phoenix', count: 15, reward: { gold: 8000, xp: 15000 } },
  { id: 'q_phoenix2', name: 'Вечное Возрождение', desc: 'Убейте 40 фениксов', kind: 'kill', target: 'phoenix', count: 40, reward: { gold: 28000, xp: 50000, itemRarity: 'mythic' } },
  { id: 'q_leviathan1', name: 'Повелитель Безбрежных Вод', desc: 'Убейте 15 левиафанов', kind: 'kill', target: 'leviathan', count: 15, reward: { gold: 9500, xp: 18000 } },
  { id: 'q_leviathan2', name: 'Океаническая Бездна', desc: 'Убейте 40 левиафанов', kind: 'kill', target: 'leviathan', count: 40, reward: { gold: 35000, xp: 65000, itemRarity: 'mythic' } },
  { id: 'q_titan1', name: 'Перворожденный Титан', desc: 'Убейте 15 титанов', kind: 'kill', target: 'titan', count: 15, reward: { gold: 12000, xp: 22000 } },
  { id: 'q_titan2', name: 'Сокрушитель Небес', desc: 'Убейте 40 титанов', kind: 'kill', target: 'titan', count: 40, reward: { gold: 45000, xp: 85000, statPoints: 10 } },
  { id: 'q_djinn1', name: 'Джинн Пустыни', desc: 'Убейте 20 джиннов', kind: 'kill', target: 'djinn', count: 20, reward: { gold: 7500, xp: 14000 } },
  { id: 'q_djinn2', name: 'Тысяча Желаний', desc: 'Убейте 50 джиннов', kind: 'kill', target: 'djinn', count: 50, reward: { gold: 26000, xp: 48000, talentPoints: 2 } },
  { id: 'q_ifrit1', name: 'Пламенный Ифрит', desc: 'Убейте 20 ифритов', kind: 'kill', target: 'ifrit', count: 20, reward: { gold: 8000, xp: 15000 } },
  { id: 'q_ifrit2', name: 'Сердце Вулкана', desc: 'Убейте 50 ифритов', kind: 'kill', target: 'ifrit', count: 50, reward: { gold: 28000, xp: 52000, itemRarity: 'mythic' } },
  { id: 'q_valkyrie1', name: 'Небесная Валькирия', desc: 'Убейте 15 валькирий', kind: 'kill', target: 'valkyrie', count: 15, reward: { gold: 9000, xp: 17000 } },
  { id: 'q_valkyrie2', name: 'Свет Вальхаллы', desc: 'Убейте 40 валькирий', kind: 'kill', target: 'valkyrie', count: 40, reward: { gold: 34000, xp: 62000, talentPoints: 3 } },
  { id: 'q_archangel1', name: 'Падший Архистратиг', desc: 'Убейте 10 архангелов', kind: 'kill', target: 'archangel', count: 10, reward: { gold: 15000, xp: 30000 } },
  { id: 'q_archangel2', name: 'Небесный Суд', desc: 'Убейте 30 архангелов', kind: 'kill', target: 'archangel', count: 30, reward: { gold: 60000, xp: 120000, itemRarity: 'divine' } },
  { id: 'q_archdemon1', name: 'Владыка Архидемонов', desc: 'Убейте 10 архидемонов', kind: 'kill', target: 'archdemon', count: 10, reward: { gold: 20000, xp: 40000 } },
  { id: 'q_archdemon2', name: 'Падение Владык Ада', desc: 'Убейте 30 архидемонов', kind: 'kill', target: 'archdemon', count: 30, reward: { gold: 80000, xp: 160000, itemRarity: 'divine' } },

  // --- 17. GLOBAL KILL MILESTONES (ANY MONSTER) ---
  { id: 'q_any1', name: 'Первая кровь', desc: 'Убейте 50 любых врагов', kind: 'kill', target: '', count: 50, reward: { gold: 400, xp: 700 } },
  { id: 'q_any2', name: 'Сотня поверженных', desc: 'Убейте 100 любых врагов', kind: 'kill', target: '', count: 100, reward: { gold: 900, xp: 1600, statPoints: 2 } },
  { id: 'q_any3', name: 'Опытный боец', desc: 'Убейте 300 любых врагов', kind: 'kill', target: '', count: 300, reward: { gold: 3000, xp: 5500, talentPoints: 1 } },
  { id: 'q_any4', name: 'Гроза чудовищ', desc: 'Убейте 700 любых врагов', kind: 'kill', target: '', count: 700, reward: { gold: 8000, xp: 15000, skillPoints: 1 } },
  { id: 'q_any5', name: 'Мясник Бездны', desc: 'Убейте 1 500 любых врагов', kind: 'kill', target: '', count: 1500, reward: { gold: 20000, xp: 38000, itemRarity: 'legendary' } },
  { id: 'q_any6', name: 'Легендарный Истребитель', desc: 'Убейте 3 000 любых врагов', kind: 'kill', target: '', count: 3000, reward: { gold: 50000, xp: 95000, itemRarity: 'mythic' } },
  { id: 'q_any7', name: 'Вечный Палач', desc: 'Убейте 7 000 любых врагов', kind: 'kill', target: '', count: 7000, reward: { gold: 140000, xp: 260000, statPoints: 15 } },
  { id: 'q_any8', name: 'Бог Войны', desc: 'Убейте 15 000 любых врагов', kind: 'kill', target: '', count: 15000, reward: { gold: 350000, xp: 650000, itemRarity: 'divine' } },
  { id: 'q_any9', name: 'Абсолютный Геноцид', desc: 'Убейте 25 000 любых врагов', kind: 'kill', target: '', count: 25000, reward: { gold: 1000000, xp: 2000000, statPoints: 50, talentPoints: 10 } },

  // --- 18. BOSS BOUNTIES ---
  { id: 'q_boss1', name: 'Убийца боссов I', desc: 'Победите 1 босса', kind: 'boss', target: '', count: 1, reward: { gold: 800, xp: 1500, itemRarity: 'rare' } },
  { id: 'q_boss2', name: 'Убийца боссов II', desc: 'Победите 3 боссов', kind: 'boss', target: '', count: 3, reward: { gold: 3000, xp: 5500, statPoints: 3 } },
  { id: 'q_boss3', name: 'Охотник за головами', desc: 'Победите 8 боссов', kind: 'boss', target: '', count: 8, reward: { gold: 10000, xp: 18000, itemRarity: 'epic' } },
  { id: 'q_boss4', name: 'Покоритель титанов', desc: 'Победите 15 боссов', kind: 'boss', target: '', count: 15, reward: { gold: 25000, xp: 45000, itemRarity: 'legendary' } },
  { id: 'q_boss5', name: 'Бич Владык', desc: 'Победите 30 боссов', kind: 'boss', target: '', count: 30, reward: { gold: 60000, xp: 110000, itemRarity: 'mythic' } },
  { id: 'q_boss6', name: 'Истребитель Лордов', desc: 'Победите 50 боссов', kind: 'boss', target: '', count: 50, reward: { gold: 150000, xp: 250000, itemRarity: 'divine' } },
  { id: 'q_boss7', name: 'Сокрушитель Миров', desc: 'Победите 100 боссов', kind: 'boss', target: '', count: 100, reward: { gold: 500000, xp: 800000, statPoints: 30, talentPoints: 5 } },

  // --- 19. LEVEL MILESTONES ---
  { id: 'q_lvl1', name: 'Первые шаги', desc: 'Достигните 10 уровня', kind: 'level', target: '', count: 10, reward: { gold: 300, xp: 0, statPoints: 3 } },
  { id: 'q_lvl2', name: 'Закалка', desc: 'Достигните 25 уровня', kind: 'level', target: '', count: 25, reward: { gold: 1200, xp: 0, statPoints: 3, talentPoints: 1 } },
  { id: 'q_lvl3', name: 'Ветеран', desc: 'Достигните 50 уровня', kind: 'level', target: '', count: 50, reward: { gold: 5000, xp: 0, statPoints: 5, skillPoints: 1 } },
  { id: 'q_lvl4', name: 'Герой эпохи', desc: 'Достигните 100 уровня', kind: 'level', target: '', count: 100, reward: { gold: 25000, xp: 0, statPoints: 8, talentPoints: 2 } },
  { id: 'q_lvl5', name: 'Полубог', desc: 'Достигните 200 уровня', kind: 'level', target: '', count: 200, reward: { gold: 150000, xp: 0, statPoints: 15, skillPoints: 2 } },
  { id: 'q_lvl6', name: 'Повелитель Судьбы', desc: 'Достигните 300 уровня', kind: 'level', target: '', count: 300, reward: { gold: 500000, xp: 0, statPoints: 25, talentPoints: 5 } },
  { id: 'q_lvl7', name: 'Бессмертный Владыка', desc: 'Достигните 400 уровня', kind: 'level', target: '', count: 400, reward: { gold: 1000000, xp: 0, statPoints: 40, skillPoints: 5 } },
  { id: 'q_lvl8', name: 'Легенда Вселенной', desc: 'Достигните 500 уровня', kind: 'level', target: '', count: 500, reward: { gold: 2000000, xp: 0, statPoints: 60, talentPoints: 10 } },
  { id: 'q_lvl9', name: 'Создатель Реальности', desc: 'Достигните 750 уровня', kind: 'level', target: '', count: 750, reward: { gold: 5000000, xp: 0, statPoints: 100, itemRarity: 'divine' } },
  { id: 'q_lvl10', name: 'Абсолютный Бог', desc: 'Достигните 1000 уровня', kind: 'level', target: '', count: 1000, reward: { gold: 10000000, xp: 0, statPoints: 200, talentPoints: 20 } },

  // --- 20. DUNGEONS ---
  { id: 'q_dun1', name: 'В первый раз?', desc: 'Пройдите 1 подземелье', kind: 'dungeon', target: '', count: 1, reward: { gold: 600, xp: 1000, itemRarity: 'rare' } },
  { id: 'q_dun2', name: 'Покоритель глубин', desc: 'Пройдите 3 подземелья', kind: 'dungeon', target: '', count: 3, reward: { gold: 2500, xp: 4000, itemRarity: 'epic' } },
  { id: 'q_dun3', name: 'Хозяин катакомб', desc: 'Пройдите 10 подземелий', kind: 'dungeon', target: '', count: 10, reward: { gold: 12000, xp: 20000, itemRarity: 'legendary' } },
  { id: 'q_dun4', name: 'Властелин мрака', desc: 'Пройдите 30 подземелий', kind: 'dungeon', target: '', count: 30, reward: { gold: 50000, xp: 80000, itemRarity: 'mythic' } },
  { id: 'q_dun5', name: 'Архитектор Лабиринтов', desc: 'Пройдите 75 подземелий', kind: 'dungeon', target: '', count: 75, reward: { gold: 200000, xp: 350000, itemRarity: 'divine' } },

  // --- 21. LOOT COLLECTION ---
  { id: 'q_loot1', name: 'Синее сияние', desc: 'Получите 3 редких предмета', kind: 'loot', target: 'rare', count: 3, reward: { gold: 500, xp: 800 } },
  { id: 'q_loot2', name: 'Фиолетовая страсть', desc: 'Получите 5 эпических предметов', kind: 'loot', target: 'epic', count: 5, reward: { gold: 2000, xp: 3500, statPoints: 2 } },
  { id: 'q_loot3', name: 'Оранжевая мечта', desc: 'Получите 3 легендарных предмета', kind: 'loot', target: 'legendary', count: 3, reward: { gold: 8000, xp: 14000, talentPoints: 1 } },
  { id: 'q_loot4', name: 'Миф о вечности', desc: 'Получите 2 мифических предмета', kind: 'loot', target: 'mythic', count: 2, reward: { gold: 30000, xp: 50000, skillPoints: 1 } },
  { id: 'q_loot5', name: 'Божественный промысел', desc: 'Получите 1 божественный предмет', kind: 'loot', target: 'divine', count: 1, reward: { gold: 100000, xp: 200000, statPoints: 10 } },
  { id: 'q_loot6', name: 'Королевская Сокровищница', desc: 'Получите 15 легендарных предметов', kind: 'loot', target: 'legendary', count: 15, reward: { gold: 60000, xp: 110000, talentPoints: 3 } },
  { id: 'q_loot7', name: 'Пантеон Мифов', desc: 'Получите 10 мифических предметов', kind: 'loot', target: 'mythic', count: 10, reward: { gold: 180000, xp: 320000, statPoints: 15 } },
  { id: 'q_loot8', name: 'Божественное Снаряжение', desc: 'Получите 5 божественных предметов', kind: 'loot', target: 'divine', count: 5, reward: { gold: 500000, xp: 900000, talentPoints: 10 } },

  // --- 22. GOLD TYCOON ---
  { id: 'q_gold1', name: 'Первый капитал', desc: 'Накопите 5 000 золота (всего заработано)', kind: 'gold', target: '', count: 5000, reward: { gold: 1000, xp: 1500 } },
  { id: 'q_gold2', name: 'Торговый магнат', desc: 'Заработайте 100 000 золота', kind: 'gold', target: '', count: 100000, reward: { gold: 10000, xp: 15000 } },
  { id: 'q_gold3', name: 'Драконья сокровищница', desc: 'Заработайте 2 000 000 золота', kind: 'gold', target: '', count: 2000000, reward: { gold: 200000, xp: 300000, talentPoints: 2 } },
  { id: 'q_gold4', name: 'Золотой Император', desc: 'Заработайте 10 000 000 золота', kind: 'gold', target: '', count: 10000000, reward: { gold: 1000000, xp: 1500000, statPoints: 20 } },
  { id: 'q_gold5', name: 'Казна Создателя', desc: 'Заработайте 50 000 000 золота', kind: 'gold', target: '', count: 50000000, reward: { gold: 5000000, xp: 7500000, talentPoints: 10 } },

  // --- 23. SECRETS ---
  { id: 'q_secret1', name: 'Скрытая тропа', desc: 'Откройте скрытую территорию', kind: 'secret', target: '', count: 1, reward: { gold: 3000, xp: 5000, skillPoints: 1 } },
  { id: 'q_secret2', name: 'Картограф тайн', desc: 'Откройте 3 скрытые территории', kind: 'secret', target: '', count: 3, reward: { gold: 20000, xp: 35000, itemRarity: 'legendary' } },
  { id: 'q_secret3', name: 'Исследователь Запретного', desc: 'Откройте 5 скрытых территорий', kind: 'secret', target: '', count: 5, reward: { gold: 80000, xp: 140000, itemRarity: 'mythic' } },
];

export const questById = (id: string) => QUESTS.find(q => q.id === id)!;
